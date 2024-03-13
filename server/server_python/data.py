import pandas as pd 

# 엑셀 파일에 담겨진 파일들 호출
df = pd.read_excel("./data.xlsx", "문제답")

df_correct_list = list(df["정답"])

df_new_question_list = list(df["유사도문제"])

df_new_answer_list = list(df["유사도답"])

df_main_keyword_list = list(df["유사도키워드"])

print(">> read data complete")