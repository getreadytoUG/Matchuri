from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import return_req

app = FastAPI()

# CORS Error 방지를 목적으로 하며 요청 페이지 주소를 넣으면 해당 url 에 대한 CORS Error 막아준다
origins = [
    "http://matchuri.s3-website.ap-northeast-2.amazonaws.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # 브라우저 요청에 인증 정보를 포함
    allow_methods=["*"],
    allow_headers=["*"]
)

# 들어오는 질문에 대한 힌트
class Chat(BaseModel):
    text: str
    q: str

@app.post("/chat")
async def make_chat(data: Chat):
    print(">> request complete")
    user_question = data.text
    stage = int(data.q)

    matchuri_answer, is_correct = return_req(user_question, stage)
    
    response = {
        "text": matchuri_answer,
        "is_correct": is_correct
    }
    print(">> response")
    return response
