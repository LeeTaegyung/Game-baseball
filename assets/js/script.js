(() => {
    const wrap = document.getElementById('wrap');
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
    };
    let resultVal = [];
    let timeControl = undefined;
    let timeInitVal = 30;
    let timeVal = timeInitVal;
    let fireworkInterval;

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
        resultVal = [];
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
                gameEnd('over');
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
            gameEnd('clear');
        } else {
            numInput.focus();
        }
    }

    function gameEnd(type) {
        const gameEndEl = document.createElement('div');
        const gameResetEl = document.createElement('button');
        let typeClass, gameMotionTxt, ttl, desc;
        
        state.isStart = false;
        clearInterval(timeControl);
        numInput.setAttribute('disabled', true);

        if(type === 'clear') {
            typeClass = 'game_clear';
            gameMotionTxt = `
                <svg viewBox="0 0 350 51" width="50%" height="210px">
                    <text x="0" y="90%">g</text>
                    <text x="30" y="90%">a</text>
                    <text x="60" y="90%">m</text>
                    <text x="110" y="90%">e</text>
                    <text x="150" y="90%">c</text>
                    <text x="180" y="90%">l</text>
                    <text x="200" y="90%">e</text>
                    <text x="230" y="90%">a</text>
                    <text x="260" y="90%">r</text>
                    <text x="280" y="90%">~</text>
                    <text x="300" y="100%">~</text>
                </svg>
            `;
            ttl = document.createElement('h2');
            desc = document.createElement('p');
            ttl.classList.add('game_result_ttl')
            ttl.innerHTML = '게임 결과';
            desc.classList.add('game_result_desc')
            desc.innerHTML = `count: <span class="count">${note.querySelectorAll('div').length}</span>`;

        } else if(type === 'over') {
            typeClass = 'game_over';
            gameMotionTxt = `
                <svg viewBox="0 0 280 51" width="50%" height="210px">
                    <text x="0" y="90%">g</text>
                    <text x="30" y="90%">a</text>
                    <text x="60" y="90%">m</text>
                    <text x="110" y="90%">e</text>
                    <text x="150" y="90%">o</text>
                    <text x="180" y="90%">v</text>
                    <text x="205" y="90%">e</text>
                    <text x="230" y="90%">r</text>
                    <text x="250" y="90%">!</text>
                </svg>
            `;
        }
        
        gameResetEl.classList.add('reset_btn');
        gameResetEl.innerHTML = '다시 시작하기';
        gameEndEl.classList.add(typeClass);

        gameEndEl.innerHTML = gameMotionTxt;
        gameEndEl.appendChild(gameResetEl);

        wrap.appendChild(gameEndEl);
        if(type === 'clear'){
            gameEndEl.insertBefore(desc, gameEndEl.firstChild);
            gameEndEl.insertBefore(ttl, gameEndEl.firstChild);

            fireworkInterval = setInterval(function() {
                createFireWork(gameEndEl);
            }, 300)

        }

        gameResetEl.addEventListener('click', function(){
            //초기화
            timeEl.innerHTML = timeVal;
            state.isStart = true;
            getNum();
            timeOut();
            numInput.removeAttribute('disabled');
            gameEndEl.remove();
            note.innerHTML = '';
            clearInterval(fireworkInterval);
        })
    }

    function createParticle(bg, duration) {
        const item = document.createElement('div');
        const particle = document.createElement('span');
        item.classList.add('firework_item');
        particle.classList.add('particle');
        particle.style.backgroundColor = bg;
        particle.style.animationDuration = duration;
        item.appendChild(particle);
        
        return item;
    }

    function createFireWork(target) {
        const fireWorkEl = document.createElement('div');
        const bgColor = ['#EB455F', '#DC0000', '#FFE15D', '#FF6E31', '#F56EB3', 'blue'];
        const bgRandom = Math.floor(Math.random() * bgColor.length);
        const particleDuration = Math.floor(Math.random() + 0.5);
        fireWorkEl.classList.add('firework');
        fireWorkEl.style.top = `${Math.floor(Math.random() * window.outerHeight)}px`;
        fireWorkEl.style.left = `${Math.floor(Math.random() * window.outerWidth)}px`;
        for(let i = 0; i < 12; i++) {
            fireWorkEl.appendChild(createParticle(bgColor[bgRandom], particleDuration));
        }
        target.appendChild(fireWorkEl);

        setTimeout(function(){
            fireWorkEl.remove();
        }, 3000);
    }


    gameStartBtn.addEventListener('click', gameStart);
    numBtn.addEventListener('click', getBallStrike);
    numInput.addEventListener('keyup', function(e){
        if(e.keyCode == 13) {
            getBallStrike();
        }
    })




})()