(() => {
    // input 숫자만 입력할 수 있게 조건걸기.
    // form validation
    // 15초 시간제한
    // 1~9 숫자 랜덤, 중복x
    // 숫자o 위치x -> ball
    // 숫자o 위치o -> strike
    // 3s 되면 게임종료

    const numList = document.querySelectorAll('.num span');
    const numVal = document.getElementById('numVal');
    const numValBtn = document.getElementById('numValBtn');
    const note = document.querySelector('.note');
    const timeVal = document.querySelector('.time_val');
    const gameStartBtn = document.querySelector('.game_start');
    const state = {
        isStart: false,
        isOver: false,
        isClear: false,
    };
    let resultVal = [];
    let timeControl = undefined;
    let timeInitVal = 30;
    let timeIdx = timeInitVal;

    function init() {
        numVal.focus();
        timeVal.innerHTML = timeIdx;
        getNum();
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

            timeIdx--;

            timeVal.innerHTML = timeIdx;

            if(timeIdx == 0) {
                // 게임종료
                state.isOver = true;
                clearInterval(timeControl);
                numVal.setAttribute('disabled', true);
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
        timeIdx = timeInitVal;
        timeVal.innerHTML = timeIdx;
        timeOut();
    }

    function getBallStrike() {

        if(state.isOver || state.isClear || state.isStart) return;

        const regexr = /^\d+$/;
        let txtArr, ball, strike;

        if(!numVal.value.match(regexr)) {
            alert('숫자만 입력해주세요.');
            numVal.value = '';
            return;
        } else if(numVal.value.length !== 3) {
            alert('3자리 숫자를 입력해주세요.');
            numVal.value = '';
            return;
        }
        
        if(timeControl === undefined) timeOut();

        txtArr = numVal.value.split('').map(ele => +ele);

        ball = txtArr.filter((ele, idx) => { return resultVal.includes(ele) && ele !== resultVal[idx] });
        strike = txtArr.filter((ele, idx) => {return resultVal.includes(ele) && ele === resultVal[idx]});

        createNoteItem(numVal.value, ball.length, strike.length);

        numVal.value = '';

        if(strike.length === resultVal.length) {
            state.isClear = true;
            numVal.setAttribute('disabled', true);
            clearInterval(timeControl);
        } else {
            numVal.focus();
        }
    }

    gameStartBtn.addEventListener('click', function(){
        document.querySelector('.game_desc').classList.add('start');
        document.querySelector('.box').classList.add('on');
    })

    numValBtn.addEventListener('click', getBallStrike);
    numVal.addEventListener('keyup', function(e){
        if(e.keyCode == 13) {
            getBallStrike();
        }
    })

    init();


})()