(() => {
    // input 숫자만 입력할 수 있게 조건걸기.
    // form validation
    // 15초 시간제한
    // 1~9 숫자 랜덤, 중복x
    // 숫자o 위치x -> ball
    // 숫자o 위치o -> strike
    // 3s 되면 게임종료

    const stage = document.querySelector('.stage');
    const desc = document.querySelector('.game_desc');
    const numList = document.querySelectorAll('.num span');
    const numInput = document.getElementById('numInput');
    const numBtn = document.getElementById('numBtn');
    const note = document.querySelector('.note');
    const timeEl = document.querySelector('.time_val');
    const gameStartBtn = document.querySelector('.game_start');
    const state = {
        isStart: false,
        isOver: false,
        isClear: false,
    };
    let resultVal = [];
    let timeControl = undefined;
    let timeInitVal = 30;
    let timeVal = timeInitVal;

    function gameStart() {
        if(state.isStart) return;

        new Promise((resolve) => {
            desc.classList.add('start');
            stage.classList.add('on');
            timeEl.innerHTML = timeVal;
            state.isStart = true;
            getNum();
            setTimeout(function(){
                resolve();
            }, 1100)
        }).then(() => {
            timeOut();
        })
    }

    function getNum() {
        for(let i = 0; i < numList.length; i++) {
            let randomNum = Math.floor(Math.random() * (9 - 1) + 1);

            if(!resultVal.includes(randomNum)) {
                resultVal.push(randomNum);
            } else {
                i--;
            }
        }

        console.log(resultVal);
    }

    function timeOut() {
        timeControl = setInterval(function(){

            timeVal--;

            timeEl.innerHTML = timeVal;

            if(timeVal == 0) {
                state.isStart = false;
                clearInterval(timeControl);
                numInput.setAttribute('disabled', true);

                // 게임종료 모션

            }

        }, 1000)
    }

    function createNoteItem(inputNum, bNum, sNum) {
        const div = document.createElement('div');
        div.innerHTML = `<span class="input_num">${inputNum}</span>
                        <span class="input_result">${bNum}B ${sNum}S</span>`;

        note.appendChild(div);

        note.scrollTop = note.scrollHeight;
        clearInterval(timeControl);
        timeVal = timeInitVal;
        timeEl.innerHTML = timeVal;
        timeOut();
    }

    function getBallStrike() {

        if(!state.isStart) return;

        const regexr = /^[1-9]{3}$/;
        let txtArr, ball, strike;
        let dupleArr = new Set(numInput.value);

        // 조건 검열
        if(!regexr.test(numInput.value)) {
            alert('1~9 중 3자리를 입력해주세요.');
            numInput.value = '';
            return;
        } else if(numInput.value.length > dupleArr.size) {
            alert('똑같은 숫자 2개이상 입력 할 수 없습니다.');
            numInput.value = '';
            return;
        }

        // 입력 받은 글자 배열로 변환
        txtArr = numInput.value.split('').map(ele => parseInt(ele));

        // 볼 / 스트라이크 확인
        ball = txtArr.filter((ele, idx) => { return resultVal.includes(ele) && ele !== resultVal[idx] });
        strike = txtArr.filter((ele, idx) => {return resultVal.includes(ele) && ele === resultVal[idx]});

        // 입력한 값 note 영역에 추가
        createNoteItem(numInput.value, ball.length, strike.length);

        // input 초기화
        numInput.value = '';

        // 만약에 정답이면(스트라이크가 3개이면) 게임 종료
        if(strike.length === resultVal.length) {
            state.isStart = false;
            numInput.setAttribute('disabled', true);
            clearInterval(timeControl);

            // 게임 클리어 모션

        } else {
            numInput.focus();
        }
    }


    gameStartBtn.addEventListener('click', gameStart);
    numBtn.addEventListener('click', getBallStrike);
    numInput.addEventListener('keyup', function(e){
        if(e.keyCode == 13) {
            getBallStrike();
        }
    })



})()