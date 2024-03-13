let savingBody = document.body
const stageHref = window.location.href;
const stageNum = stageHref.split('&')[0].split('=')[1];
const stageStatus = stageHref.split('&')[1].split('=')[1];
const _id = localStorage.getItem('_id');
const chatUl = document.getElementById('chatUl')
const resetBtn = document.getElementById('resetBtn')
const btnWrap = document.querySelector('.layer-pop .btn-wrap')
const chatArea = document.querySelector('.inner-main ul');
const pageTit = document.querySelector('#chat .page-tit')
const headerCate = document.querySelector('header .cate')
const headerStar = document.querySelector('header .star')
const hintBtn = document.getElementById('hintBtn')
const answerBtn = document.getElementById('answerBtn')
const bottomWrap = document.querySelector('#chat .bottom-wrap')
const answerWrap = document.querySelector('#chat .answer-wrap')
const answerText = document.querySelector('#chat .answer-wrap .a-text')
let qAnswer = ''

// 별
let startDict = {
    1: "★",
    2: "★★",
    3: "★★★",
    4: "★★★★",
    5: "★★★★★",
}

// 시간 함수
function timeSet() {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    return `${hours > 12 ? '오후' : '오전'} ${hours % 12 || 12}시 ${minutes}분`;
}

// 크기 자동조절 라이브러리
autosize($("textArea"))

// text 업데이트 함수
async function textUpdateFn(data) {
    let text = (data !== undefined && data !== null) ? data : "";
    const response = await fetch('http://13.124.29.186:8080/auth/update/text',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id, num:stageNum, data:text})
    })
    if(response.ok){
        const data = await response.json()

    }
}

// 초기화 함수
async function reset() {
    chatArea.innerHTML = '';
    textUpdateFn()
    stageComFetch(stageNum, 1)
    window.location.href = `./chat.html?q=${stageNum}&status=n`
}


// 로드 시 출력
document.addEventListener('DOMContentLoaded', async ()=>{
    savingBody = document.body

    let html = ''
    const qResponse = await fetch('http://13.124.29.186:8080/stage/one',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({N:stageNum})
    })

    const response = await fetch('http://13.124.29.186:8080/auth/info',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id})
    })

    // 유저정보 불러오기
    if(response.ok){
        const data = await response.json();
        if(data.conversation[stageNum].text){
            chatUl.innerHTML = data.conversation[stageNum].text
        }

        // 문제정보 출력
        if(qResponse.ok){
            const qdata = await qResponse.json()

            qAnswer = qdata.A
            
            chatUl.innerHTML = html
            pageTit.innerText = `${qdata.N} 스테이지`
            headerCate.innerText = qdata.T
            headerStar.innerText = startDict[qdata.L]

            // 상태가 완료이면 채팅 나가기 버튼 활성화 및 해설 노출
            if(data.conversation[stageNum].com == 2 && stageStatus == 'y'){
                bottomWrap.innerHTML = `
                <button type="button" class="close-chat-btn" onclick="window.location.href='./stage.html'">채팅 나가기</button>
                `

                answerText.innerText = qdata.A
                answerWrap.style.display = 'block'
            }

            // 힌트
            hintBtn.addEventListener('click',()=>{
                hintFn(qdata.H)
            })

            // 초기화 시 출력
            if(data.conversation[stageNum].text.length == 0){
                html = `
                <li class="bot">
                    <div class="m-ico"></div>
                    <div class="txt-area">
                        <div class="name">마추리</div>
                        <div class="txt">
                            안녕 브리튼 조수? 이번 사건은 어려운 사건이야
                            사건을 설명해줄게:)<br><br>
                            
                            <span class='txt-bold'>${qdata.Q}</span>
                        </div>
                        <div class="date">${timeSet()}</div>
                    </div>
                </li>
                `
                chatUl.innerHTML = html
            }

            // 이어하기 & 기록보기
            if(stageStatus == 'n' && data.conversation[stageNum].text.length == 0){    
                html = `
                <li class="bot">
                    <div class="m-ico"></div>
                    <div class="txt-area">
                        <div class="name">마추리</div>
                        <div class="txt">
                            안녕 브리튼 조수? 이번 사건은 어려운 사건이야
                            사건을 설명해줄게:)<br><br>
                            
                            <span class='txt-bold'>${qdata.Q}</span>
                        </div>
                        <div class="date">${timeSet()}</div>
                    </div>
                </li>
                `

                chatUl.innerHTML = html
            }else if(stageStatus == 'y'){
                if(data.conversation[stageNum].text.length == 0){
                    html = `
                    <li class="bot">
                        <div class="m-ico"></div>
                        <div class="txt-area">
                            <div class="name">마추리</div>
                            <div class="txt">
                                안녕 브리튼 조수? 이번 사건은 어려운 사건이야
                                사건을 설명해줄게:)<br><br>
                                
                                <span class='txt-bold'>${qdata.Q}</span>
                            </div>
                            <div class="date">${timeSet()}</div>
                        </div>
                    </li>
                    `
                    chatUl.innerHTML = html
                }else{
                    chatUl.innerHTML = data.conversation[stageNum].text;
                }
            }
        }

    }

})


// 메세지 입력 시 버튼 활성화
const chatBtn = document.querySelector('#chatGo')
const textArea = document.querySelector('#textArea')

textArea.addEventListener('keyup',()=>{
    if(textArea.value.trim().length > 0){
        chatBtn.classList.add('active');
        chatBtn.disabled = false;
    }else{
        chatBtn.classList.remove('active');
        chatBtn.disabled = true;
    }
})

// 헤더 유틸
const headerUtilBtn = document.querySelector('header .util-btn')
headerUtilBtn.addEventListener('click', (el)=>{
    const eTarget = el.currentTarget;
    const utilWrap = eTarget.previousElementSibling
    if(utilWrap.classList.contains('fadeOut')){
        utilWrap.classList.add('fadeIn')
        utilWrap.classList.remove('fadeOut')
        eTarget.lastElementChild.style.transform = 'rotate(180deg)'
    }else{
        utilWrap.classList.add('fadeOut')
        utilWrap.classList.remove('fadeIn')
        eTarget.lastElementChild.style.transform = 'rotate(0deg)'
    }
})

// 힌트, 정답 버튼
const hintAnswerBtn = document.querySelector('.hint-answer-btn');

hintAnswerBtn.addEventListener('click',(el) => {
    const eTarget = el.currentTarget;
    const btnWrap = eTarget.previousElementSibling

    if(btnWrap.classList.contains('fadeOut')){
        btnWrap.classList.add('fadeIn')
        btnWrap.classList.remove('fadeOut')
    }else{
        btnWrap.classList.add('fadeOut')
        btnWrap.classList.remove('fadeIn')
    }
});

// 뒤로가기 레이어
const chatLayer = document.getElementById('chatLayer')
const backBtn = document.getElementById('backBtn')
const txtWrap = document.querySelector('.layer-pop .txt-wrap')
const layerBtn = document.querySelector('.layer-pop .btn-wrap button:first-child')


backBtn.addEventListener('click',()=>{
    txtWrap.innerHTML = '나가시면 <span class="txt-point">저장하지 않은 데이터가 삭제</span> 됩니다.<br>정말 나가시겠습니까?'
    layerBtn.innerText = '나가기'
    layerOn('chatLayer');
    layerBtn.addEventListener('click',(el)=>{
        window.location.href = './stage.html'
    })
})

// 저장하기
const savingBtn = document.getElementById('savingBtn')

savingBtn.addEventListener('click',async ()=>{
    savingData = chatUl.innerHTML;
    textUpdateFn(savingData);

    const saveLayer = document.getElementById('saveLayer');
    saveLayer.classList.remove('fadeOut');
    saveLayer.classList.add('fadeIn');

    setTimeout(() => {
        saveLayer.classList.add('fadeOut');
        saveLayer.classList.remove('fadeIn');
    }, 2000);
})


// 채팅
const chatGoBtn = document.getElementById('chatGo');
let isBotAnswering = false;

async function sendMessage() {
    const message = textArea.value.trim().replace(/\n/g, '<br>'); // Replace newline characters with <br> tags
    const stageHref = window.location.href;
    const stageNum = stageHref.split('&')[0].split('=')[1];
    if (message !== '') {
        const lastMessage = chatArea.lastElementChild;
        const isLastMessageFromUser = lastMessage && lastMessage.classList.contains('me');

        const newMessage = document.createElement('li');
        newMessage.className = 'me';

        if (!isLastMessageFromUser) {
            newMessage.innerHTML = `
                <div class="b-ico"></div>
                <div class="txt-area">
                    <div class="name">브리튼</div>
                    <div class="txt">${message}</div>
                    <div class="date">${timeSet()}</div>
                </div>
            `;
        } else {
            newMessage.innerHTML = `
                <div class="txt-area">
                    <div class="txt">${message}</div>
                    <div class="date">${timeSet()}</div>
                </div>
            `;
        }

        chatArea.appendChild(newMessage);
        textArea.value = '';
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    // 유저의 질문을 python 서버 쪽으로 보내는 부분
    const user_question = {
        "text": message,
        "q": stageNum
    }

    isBotAnswering = true;

    if (isBotAnswering) {
        // 마추리가 대답 중일 때 대기 중 메시지를 추가
        const newMessage = document.createElement('li');
        newMessage.className = 'bot spinner';
        newMessage.innerHTML = `
            <div class="m-ico"></div>
            <div class="txt-area">
                <div class="name">마추리</div>
                <div class="txt"><i class="xi-spinner-2 xi-spin"></i></div>
                <div class="date">${timeSet()}</div>
            </div>
        `;
        chatArea.appendChild(newMessage);
        textArea.value = '';
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
        // 마지막으로 추가된 마추리의 메시지 찾기
        const lastMessage = chatArea.lastElementChild;
    
        // 마지막으로 추가된 메시지가 마추리의 메시지인지 확인하고, 대기 중 메시지를 업데이트
        if (lastMessage && lastMessage.classList.contains('bot') && lastMessage.classList.contains('spinner')) {
            // 마추리의 대답을 가져오기 위해 서버에 요청
            fetch("http://13.124.29.186:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user_question)
            })
            .then((data) => data.json())
            .then((jsondata) => {
                isBotAnswering = false;
                let is_correct = jsondata.is_correct
                // 대기 중 메시지의 텍스트를 마추리의 실제 대답으로 업데이트 
                lastMessage.querySelector('.txt').innerHTML = jsondata.text;
                lastMessage.classList.remove('spinner'); // 로딩 표시 클래스 제거

                if(is_correct === 'y'){
                    stageComFetch(stageNum, 2)
                    textUpdateFn(chatUl.innerHTML)
            
                    bottomWrap.innerHTML = `
                    <button type="button" class="close-chat-btn" onclick="window.location.href='./stage.html'">채팅 나가기</button>
                    `
            
                    answerText.innerText = qAnswer
                    answerText.style.display = 'block'
                    answerWrap.style.display = 'block'
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }


    
}

textArea.addEventListener('input', function() {
    chatGoBtn.disabled = textArea.value.trim() === '';
});

// 키보드 이벤트
textArea.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        
        if(textArea.value.trim().length > 0){
            chatBtn.classList.add('active');
            chatBtn.disabled = false;
            sendMessage();
        }else{
            chatBtn.classList.remove('active');
            chatBtn.disabled = true;
        }
    }
});

// 클릭 이벤트
chatGoBtn.addEventListener('click', sendMessage);

// 힌트
let hintN = 0
function hintFn(hintData) {
    html =`${hintData[hintN]}<br><span class="txt-point2">${hintN + 1}</span>/${hintData.length-1 + 1}`
    txtWrap.innerHTML = html
    btnWrap.innerHTML = `<button type="button" class="black-btn" onclick="layerOut('chatLayer')">닫기</button>`
    hintN += 1
    layerOn('chatLayer')

    if(hintN == hintData.length-1 + 1){
        hintN = 0;
    }
}

// 상태 패치
async function stageComFetch(stageNum, com) {
    const comResponse = await fetch('http://13.124.29.186:8080/auth/update/com',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id, num:stageNum, com})
    })
    if(comResponse.ok){
        const data = await comResponse.json()
    }
}

// 정답 버튼
answerBtn.addEventListener('click', async ()=>{
    const comResponse = await fetch('http://13.124.29.186:8080/auth/update/com',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id, num:stageNum, com:2})
    })
    if(comResponse.ok){
        textUpdateFn(chatUl.innerHTML)
        const data = await comResponse.json()
        window.location.href = `./chat.html?q=${stageNum}&status=y`
    }
})

// 새로고침 막기
window.addEventListener('keydown', function (e) {
    // 만약 눌린 키가 F5 키이면
    if (e.key === 'F5') {
        // 기본 동작을 막음
        e.preventDefault();
    }
});
