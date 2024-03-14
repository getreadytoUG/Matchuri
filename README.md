# 🔮 추리추리 마추리
##### 추리 수수께끼 게임 챗봇
###### 기간: 2024-01-12 ~ 2024-02-20
-----------------
## 💡 프로젝트 기획
#### - 평소에 심심할때 할게없을때 쉽게 할 수 있는 어플을 만들고 싶다는 생각이 들어 인터넷을 찾아보다가 수수께끼 문제들을 찾았습니다. 
#### - 그래서 마추리팀은 단순 대화만 할 수 있는 챗봇이 아닌 수수께끼 게임을 만들어 문제를 스테이지 형식으로 구성하고 질문하면 해당 질문에 맞는 답변을 사용자에게 전달하고, 힌트 및 정답등을 버튼형식으로 구현하여 사용자가 더욱 쉽고 편하게 게임을 즐길 수 있도록 챗봇을 제작하였습니다.

<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/f015ca14-8bf3-4f52-b063-4ee8f36fe63d">


<hr>

# **마추리란?**
#### - 사람과 챗봇이 수수께끼 문제를 같이 풀어가는 게임형식의 챗봇으로 유저(브리튼) 챗봇(마추리)로 구성되어 있습니다.
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/aafd69e6-33d0-473e-80ab-46bf00ec079f">



## 👨‍💻 My Role in Process
#### 👑 Leader
###### - 기획, 서버구현, 디자인, 프론트구현, 서버배포, PPT제작, 데이터수집, 총괄

## 🌏 Dataset & Model
#### Dataset
- 문제별로 [질문과 답변 데이터](https://drive.google.com/file/d/1hooxqgkDLEYTyrYSiuQs8O9of8wcQ1VP/view?usp=drive_link)를 직접 작성함
- 모델 학습에 사용한 문제는 총 6개로 2289개의 질문-답 데이터셋 사용

#### Model
- 문장 학습 모델 [skt/kogpt2-base-v2](https://github.com/SKT-AI/KoGPT2)
- 유사도 측정 모델 [ddobokki/klue-roberta-base-nli-sts](https://huggingface.co/ddobokki/klue-roberta-base-nli-sts)
-----------------
## 🚀 Result
- 발표ppt [추리추리 마추리 ppt](https://github.com/getreadytoUG/Matchuri/blob/main/Matchuri.pdf)

### **프론트**
- 제작 화면1
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/3bd639e7-4d70-48f4-8453-6970013c61d4">


- 제작 화면2
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/801f191b-b2a3-4b6c-9c33-c365f9e9236f">

### **서버**
#### - 확장성을 위해 node, python 두가지 서버를 같이 사용 채팅부분을 제외한 나머지 부분은 전무 node.js로 서버를 작업하였고 모델과 소통해야하는 채팅 부분은 python 서버로 작업하였습니다.

<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/7e7a2023-4daf-4527-9693-665cffe95a8d">
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/acc3a564-a6df-493e-854a-bd23f6e40c73">

### **모델**
#### - 유저가 질문을 입력하면 RoBerta로 유사성을 검사하고 문제와 유저가 입력한 질문이 유사하다고 판단되면 GPT2 모델에 넣어 학습한 질문과 대조하여 학습된 답변을 그래도 출력하거나 GPT2가 생성한 답변을 출력되게 모델을 학습시켰습니다.

<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/ade24316-65e4-4328-8bd8-da9f902ad279">
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/f7171876-c2a9-42d4-a548-f7268155f6ac">
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/ce4b3420-1687-4a08-a769-1be384a5f880">
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/fabfea4b-2de8-42fe-a628-b35a9e4279fa">

- **전처리 과정**
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/2269b777-6d77-4395-8126-316c9d4789e1">

- **GPT2**
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/b1a1864e-9e7c-4ea7-8061-a7713b2839fc">
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/3e02f2cc-f046-4752-8d08-470aace2dbf8">
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/283c499a-684e-4b3b-bb07-7b18ff43d273">

- **최종모델**
<img width="100%" alt="image" src="https://github.com/getreadytoUG/Matchuri/assets/127275992/e846ddff-70ef-42c2-b45f-d7fbc7f2e731">











-----------------
### ⚙️ Skills & Tools

<p align="center">
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/JavaScript-gray?style=flat&logo=JavaScript&logoColor=F7DF1E"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=4479A1"/>&nbsp;&nbsp;
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Colab-F37626?style=flat&logo=googlecolab&logoColor=white"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/VScode-007ACC?style=flat&logo=visualstudiocode&logoColor=white"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Discord-5865F2?style=flat&logo=Discord&logoColor=white"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/AWSEC2-FF9900?style=flat&logo=amazonec2&logoColor=white"/>&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/AWSS3-569A31?style=flat&logo=amazons3&logoColor=white"/>&nbsp;&nbsp;

  
</p>
