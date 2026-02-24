/**
 * CompletionCelebration 클래스
 * 퀴즈 완료 축하 화면 및 애니메이션
 */

import { AppConstants } from './constants/AppConstants.js';

export class CompletionCelebration {
    /**
     * @param {HTMLElement} questionElement - 문제 제목 요소
     * @param {HTMLElement} contentElement - 콘텐츠 요소
     */
    constructor(questionElement, contentElement) {
        this.questionElement = questionElement;
        this.contentElement = contentElement;
    }

    /**
     * 완료 축하 화면 표시
     * @param {Function} onRestartCallback - 재시작 버튼 클릭 시 콜백
     */
    show(onRestartCallback) {
        // result 영역 숨기기
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.classList.remove('show');
            resultElement.style.display = 'none';
        }

        this.displayCompletionMessage(onRestartCallback);
        this.createConfetti();
    }

    /**
     * 완료 메시지 표시
     * @param {Function} onRestartCallback - 재시작 콜백
     */
    displayCompletionMessage(onRestartCallback) {
        this.questionElement.textContent = '';
        this.contentElement.innerHTML = `
            <div class="completion-card">
                <div class="completion-icon">🎉</div>
                <h2 class="completion-title">모든 문제 완료!</h2>
                <p class="completion-sub">전체 문제를 모두 풀었습니다.</p>
                <p class="completion-desc">훌륭한 성취를 이루어냈어요!</p>
                <button id="restart-quiz-btn" class="completion-restart-btn">
                    다시 시작하기
                </button>
            </div>
        `;

        // 이벤트 리스너 등록
        const restartBtn = document.getElementById('restart-quiz-btn');
        if (restartBtn) {
            restartBtn.onclick = onRestartCallback;
        }
    }

    /**
     * 콘페티 애니메이션 생성
     */
    createConfetti() {
        const colors = AppConstants.CONFETTI_COLORS;
        const confettiCount = AppConstants.CONFETTI_COUNT;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createSingleConfetti(colors);
            }, i * 30);
        }
    }

    /**
     * 개별 콘페티 생성
     * @param {string[]} colors - 색상 배열
     */
    createSingleConfetti(colors) {
        const confetti = document.createElement('div');

        // 스타일 설정
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = AppConstants.Z_INDEX.CONFETTI;

        document.body.appendChild(confetti);

        // 애니메이션
        const animation = confetti.animate([
            {
                transform: 'translateY(0px)',
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: AppConstants.ANIMATION_DURATIONS.VERY_SLOW + Math.random() * 2000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        // 애니메이션 종료 시 요소 제거
        animation.onfinish = () => confetti.remove();
    }

    /**
     * 축하 화면 숨기기
     */
    hide() {
        this.questionElement.textContent = '문제가 여기에 표시됩니다.';
        this.contentElement.innerHTML = '';
    }
}
