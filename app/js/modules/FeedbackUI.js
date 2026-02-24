/**
 * FeedbackUI 클래스
 * 사용자 피드백 표시를 관리
 */

import { AppConstants } from './constants/AppConstants.js';
import { domCache } from './utils/DOMCache.js';

export class FeedbackUI {
    /**
     * @param {HTMLElement} resultElement - 결과 표시 요소
     */
    constructor(resultElement) {
        this.resultElement = resultElement;
        this.iconElement = resultElement.querySelector('.result-icon');
        this.textElement = resultElement.querySelector('.result-text');
    }

    /**
     * 정답/오답 피드백 표시
     * @param {boolean} isCorrect - 정답 여부
     * @param {string} message - 표시할 메시지 (선택사항)
     */
    show(isCorrect, message = null) {
        this.resultElement.className = `result ${isCorrect ? 'result-correct' : 'result-wrong'} show`;

        if (this.iconElement) {
            this.iconElement.innerHTML = isCorrect
                ? '<i class="fas fa-check-circle"></i>'
                : '<i class="fas fa-times-circle"></i>';
        }

        if (this.textElement) {
            this.textElement.textContent = message || (isCorrect ? '정답입니다!' : '오답입니다');
        }
    }

    /**
     * 힌트 표시
     * @param {string} hintText - 힌트 텍스트
     */
    showHint(hintText) {
        if (this.iconElement) {
            this.iconElement.innerHTML = '<i class="fas fa-lightbulb"></i>';
        }
        if (this.textElement) {
            this.textElement.textContent = hintText;
        }
    }

    /**
     * 피드백 숨기기
     */
    hide() {
        this.resultElement.className = 'result';
        if (this.iconElement) this.iconElement.innerHTML = '';
        if (this.textElement) this.textElement.textContent = '';
    }

    /**
     * 정답 옵션 강조 (객관식용)
     * @param {number} correctIndex - 정답 옵션 인덱스
     */
    highlightCorrectOption(correctIndex) {
        const questionContent = domCache.get('questionContent');
        if (!questionContent) return;

        const optionButtons = questionContent.querySelectorAll('button');
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === correctIndex) {
                btn.style.border = `3px solid ${AppConstants.COLORS.INFO}`;
                btn.style.backgroundColor = AppConstants.COLORS.INFO_LIGHT;
            }
        });
    }

    /**
     * 옵션 스타일 초기화
     */
    resetOptions() {
        const questionContent = domCache.get('questionContent');
        if (!questionContent) return;

        const optionButtons = questionContent.querySelectorAll('button');
        optionButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.border = '';
            btn.style.backgroundColor = '';
        });
    }
}
