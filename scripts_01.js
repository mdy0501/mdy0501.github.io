const correctAnswer = ['m', 'h', 'j', 'l', 'f', 'b', 'n'];
let currentDragImage = null; // 현재 드래그 중인 이미지

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
        img.ondragend = dragEnd; // 드래그 끝날 때 원래 자리로 복귀
        imagePool.appendChild(img);
    });
};

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);

    // 드래그할 때 이미지를 100x100으로 설정하고 원래 위치에서 숨기기
    if (currentDragImage) {
        document.body.removeChild(currentDragImage); // 이전 드래그 이미지를 제거
    }
    currentDragImage = new Image();
    currentDragImage.src = event.target.src;
    currentDragImage.style.width = "100px";
    currentDragImage.style.height = "100px";
    currentDragImage.style.position = "absolute";
    currentDragImage.style.top = "-9999px"; // 화면 밖에 두어 커스텀 드래그 이미지를 사용하게 함
    document.body.appendChild(currentDragImage);
    event.dataTransfer.setDragImage(currentDragImage, 50, 50);

    // 원본 이미지를 드래그 시작할 때 숨김
    setTimeout(() => {
        event.target.style.visibility = "hidden";
    }, 0);
}

function dragEnd(event) {
    const draggedImage = document.getElementById(event.target.id);
    // 드래그가 끝났을 때, 원래 자리로 복귀시키기 위해 보이게 설정
    if (draggedImage && !event.target.closest(".drop-box")) {
        draggedImage.style.visibility = "visible";
    }
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedImage = document.getElementById(data);

    // 네모 박스에 이미지 드롭하기
    if (event.target.classList.contains("drop-box") && !event.target.hasChildNodes()) {
        event.target.appendChild(draggedImage);
        draggedImage.style.width = "100px";
        draggedImage.style.height = "100px";
        draggedImage.style.visibility = "visible"; // 드롭 후 다시 보이도록 설정
    } else {
        // 드롭 실패 시 원래 위치로 돌아오도록 설정
        draggedImage.style.visibility = "visible";
    }
}

function checkAnswer() {
    let answer = [];
    const boxes = document.querySelectorAll(".drop-box");

    boxes.forEach(box => {
        if (box.firstChild) {
            answer.push(box.firstChild.id.replace('img', ''));
        } else {
            answer.push(null); // 빈 칸은 null로 간주
        }
    });

    const result = document.getElementById("result");
    if (JSON.stringify(answer) === JSON.stringify(correctAnswer)) {
        // 정답일 때 룰렛 효과
        startRouletteEffect(boxes, () => {
            // 룰렛이 멈춘 후 정답 표시
            boxes.forEach(box => {
                box.innerHTML = ""; // 기존 이미지 삭제
                const img = document.createElement("img");
                img.src = "images/18.png";
                img.className = "centered-image";
                box.appendChild(img);
            });
            result.innerHTML = "정답!<br>비밀번호 : 5021";
            const baedalImg = document.createElement("img");
            baedalImg.src = "images/baedal.gif";
            baedalImg.className = "centered-image";
            result.appendChild(baedalImg);

            // 정답 버튼과 새로고침 버튼 비활성화 처리
            document.getElementById('submit-btn').disabled = true;
            document.getElementById('reset-btn').disabled = true;
        });
    } else {
        result.innerHTML = "땡!";
        const img = document.createElement("img");
        img.src = "images/out.gif";
        img.className = "centered-image";
        result.appendChild(img);
    }
}

// 룰렛 효과 함수 (2초 동안 빠르게 회전)
function startRouletteEffect(boxes, callback) {
    let count = 0;
    const interval = setInterval(() => {
        boxes.forEach(box => {
            const randomImg = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'][Math.floor(Math.random() * 15)];
            box.innerHTML = `<img src="images/${randomImg}.png" style="width: 100px; height: 100px;">`;
        });
        count++;
        if (count === 20) { // 2초 동안 (20번 회전)
            clearInterval(interval);
            callback(); // 룰렛이 끝난 후 콜백 실행
        }
    }, 100); // 속도 증가
}

// 게임 리셋 함수
function resetGame() {
    location.reload();
}
