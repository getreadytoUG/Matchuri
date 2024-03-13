# 모델을 생성하는 파일
import torch
import torch.nn.functional as F
from transformers import PreTrainedTokenizerFast, GPT2LMHeadModel, AutoTokenizer, AutoModel
import data

# Mean Pooling 함수
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0]
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min = 1e-9)

roberta_tokenizer = AutoTokenizer.from_pretrained("ddobokki/klue-roberta-small-nli-sts")
roberta_model = AutoModel.from_pretrained("ddobokki/klue-roberta-small-nli-sts")

Q_TKN, A_TKN, BOS, EOS, MASK, SENT, PAD = "<usr>", "<sys>", '</s>', '</s>', '<unused0>', '<unused1>', '<pad>'
koGPT2_TOKENIZER = PreTrainedTokenizerFast.from_pretrained("skt/kogpt2-base-v2",
            bos_token=BOS, eos_token=EOS, unk_token='<unk>',
            pad_token=PAD, mask_token=MASK)
model = GPT2LMHeadModel.from_pretrained('skt/kogpt2-base-v2')

device = torch.device ("cuda" if torch.cuda.is_available() else "cpu")

custom_tokens = ['<문제1>', '<문제11>', '<문제28>', '<문제22>', '<문제29>', '<문제20>']

koGPT2_TOKENIZER.add_special_tokens({'additional_special_tokens': custom_tokens})
model.resize_token_embeddings(len(koGPT2_TOKENIZER))

model.to(device)

checkpoint = torch.load("./modelStorage/matchuri-last-model.pth", map_location=torch.device(device))

model.load_state_dict(checkpoint["model_state_dict"])

# 유사도 계산 함수
def get_similarity_scores_cleaning_version(user_question, stage):    
    print(">> calc sim")

    stage_index = stage - 1

    sentences = [user_question, data.df_new_question_list[stage_index], data.df_new_answer_list[stage_index], data.df_main_keyword_list[stage_index]]

    encoded_input = roberta_tokenizer(sentences, padding=True, truncation=True, return_tensors="pt")

    with torch.no_grad():
        model_output = roberta_model(**encoded_input)

    sentence_embeddings = mean_pooling(model_output, encoded_input["attention_mask"])
    sentence_embeddings_input = sentence_embeddings[0].unsqueeze(0)
    sentence_embeddings_q = sentence_embeddings[1].unsqueeze(0)
    sentence_embeddings_a = sentence_embeddings[2].unsqueeze(0)
    sentence_embeddings_k = sentence_embeddings[3].unsqueeze(0)

    score_question = round(float(F.cosine_similarity(sentence_embeddings_input, sentence_embeddings_q)), 4)
    score_answer = round(float(F.cosine_similarity(sentence_embeddings_input, sentence_embeddings_a)), 4)
    score_keyword = round(float(F.cosine_similarity(sentence_embeddings_input, sentence_embeddings_k)), 4)

    return score_question, score_answer, score_keyword

# 모델이 대답을 생성하는 함수
def make_req(user_question, stage):
    global model
    # model.eval()

    with torch.no_grad():
        matchuri_answer = ""
        correct=data.df_correct_list[stage-1]
        user_question = "정답 = " + correct + "질문 = " + user_question

        index_set = {1: "1", 2: "11", 3: "28", 4: "22", 5: "20", 6: "29"}
        
        num = index_set[stage]
        Q_num = '<문제'+num+'>'

        while 1:
            input_ids = torch.LongTensor(koGPT2_TOKENIZER.encode(Q_TKN + user_question + SENT + Q_num + A_TKN + matchuri_answer)).unsqueeze(dim=0)
            pred = model(input_ids)
            pred = pred.logits
            gen = koGPT2_TOKENIZER.convert_ids_to_tokens(torch.argmax(pred, dim=-1).squeeze().cpu().numpy().tolist())[-1]
            if gen == EOS:
                break
            matchuri_answer += gen.replace("▁", " ")
    return matchuri_answer.strip()


# user 에게 대답을 송출하는 함수
def return_req(user_question, stage):

    user_question = user_question.replace("마추리", "").replace("교수", "").replace("특성", "특징").upper().strip()

    is_correct = "n"

    sim_score_question, sim_score_answer, sim_score_keyword = get_similarity_scores_cleaning_version(user_question, stage)
    print(">> calc sim complete")
    print(">> make answer")
    if sim_score_answer > 0.70:
        matchuri_answer = "정답이야! 역시 내 조수다워. 정확한 정답을 알려줄게!!! 그럼 다음 사건에서 만나도록하지:)"
        is_correct = "y"
    elif (sim_score_question < 0.21) & (sim_score_answer < 0.21) & (sim_score_keyword < 0.165):
        matchuri_answer = "자네의 질문을 이해하지 못했네. 미안하지만 다시 질문해주게. 브리튼."
    elif (sim_score_question < 0.3) & (sim_score_answer < 0.3) & (sim_score_keyword < 0.165):
        matchuri_answer = "그건 중요하지 않네. 브리튼. 다른 질문을 해보게."
    else:
        matchuri_answer = make_req(user_question, stage)
    print(">> make answer complete")
    return matchuri_answer, is_correct