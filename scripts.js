let currentTouchImage = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// 터치 시작
function touchStart(event) {
    currentTouchImage = event.target;
    const touch = event.touches[0];
    touchOffsetX = touch.clientX - currentTouchImage.getBoundingClientRect().left;
    touchOffsetY = touch.clientY - currentTouchImage.getBoundingClientRect().top;

    // 터치 이동 시작 시 크기 고정
    currentTouchImage.style.position = 'absolute';
    currentTouchImage.style.zIndex = '1000';
    currentTouchImage.style.width = '50px'; // 원래 이미지 크기로 유지
    currentTouchImage.style.height = '50px'; // 원래 이미지 크기로 유지
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
