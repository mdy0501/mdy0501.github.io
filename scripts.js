const correctAnswer = ['m', 'h', 'j', 'l', 'f', 'b', 'n'];
let currentTouchImage = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// 이미지 풀 생성
window.onload = function () {
    const imagePool = document.getElementById('image-pool');
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];

    images.forEach((name) => {
        let img = document.createElement("img");
        img.src = `images/${name}.png`;
        img.draggable = true;
        img.id = `img${name}`;
        img.ondragstart = drag;
        img.ondragend = dragEnd;

        // 터치 이벤트 추가
        img.addEventListener('touchstart', touchStart);
        img.addEventListener('touchmove', touchMove);
        img.addEventListener('touchend', touchEnd);

        imagePool.appendChild(img);
    });
};

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);

    setTimeout(() => {
        event.target.style.visibility = "hidden";
    }, 0);
}

function dragEnd(event) {
    event.target.style.visibility = "visible";
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedImage = document.getElementById(data);

    if (event.target.classList.contains("drop-box") && !event.target.hasChildNodes()) {
        event.target.appendChild(draggedImage);
        draggedImage.style.visibility = "visible";
    }
}

// 터치 시작
function touchStart(event) {
    currentTouchImage = event.target;
    const touch = event.touches[0];
    touchOffsetX = touch.clientX - currentTouchImage.getBoundingClientRect().left;
    touchOffsetY = touch.clientY - currentTouchImage.getBoundingClientRect().top;

    currentTouchImage.style.position = 'absolute';
    currentTouchImage.style.zIndex = '1000';
}

// 터치 이동
function touchMove(event) {
    if (!currentTouchImage) return;

    const touch = event.touches[0];
    currentTouchImage.style.left = `${touch.clientX - touchOffsetX}px`;
    currentTouchImage.style.top = `${touch.clientY - touchOffsetY}px`;
}

// 터치 끝
function touchEnd(event) {
    if (!currentTouchImage) return;

    currentTouchImage.style.zIndex = '1';
    const touch = event.changedTouches[0];
    const dropElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropElement && dropElement.classList.contains('drop-box') && !dropElement.hasChildNodes()) {
        dropElement.appendChild(currentTouchImage);
        currentTouchImage.style.position = 'static';
    } else {
        // 원래 위치로 복귀
        currentTouchImage.style.position = 'static';
    }

    currentTouchImage = null;
}

function checkAnswer() {
    let answer = [];
    const boxes = document.querySelectorAll(".drop-box");

    boxes.forEach(box => {
        if (box.firstChild) {
            answer.push(box.firstChild.id.replace('img', ''));
        } else {
            answer.push(null);
        }
    });

    const result = document.getElementById("result");
    if (JSON.stringify(answer) === JSON.stringify(correctAnswer)) {
        result.innerHTML = "정답!<br>비밀번호 : 5021";
        const baedalImg = document.createElement("img");
        baedalImg.src = "images/baedal.gif";
        baedalImg.className = "centered-image";
        result.appendChild(baedalImg);

        document.getElementById('submit-btn').disabled = true;
        document.getElementById('reset-btn').disabled = true;
    } else {
        result.innerHTML = "땡!";
        const img = document.createElement("img");
        img.src = "images/out.gif";
        img.className = "centered-image";
        result.appendChild(img);
    }
}

function resetGame() {
    location.reload();
}
