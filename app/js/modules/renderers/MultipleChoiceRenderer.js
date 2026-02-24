/**
 * MultipleChoiceRenderer 클래스
 * 객관식 문제 렌더링 전담
 */

import { Utils } from '../utils.js';
import { AppConstants } from '../constants/AppConstants.js';

export class MultipleChoiceRenderer {
    /**
     * 객관식 문제 렌더링
     * @param {Question} question - 문제 객체
     * @param {HTMLElement} container - 렌더링할 컨테이너
     * @param {Function} onAnswerSelected - 답변 선택 시 콜백
     */
    render(question, container, onAnswerSelected) {
        const numberCircles = ['①', '②', '③', '④'];

        // 옵션 섞기
        const shuffledOptions = Utils.shuffleArray(
            question.options.map((text, index) => ({
                text,
                isCorrect: index === Number(question.correctAnswer)
            }))
        );

        // .options 컨테이너 생성
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options';

        // 옵션 버튼 생성
        shuffledOptions.forEach((option, index) => {
            const button = this.createOptionButton(
                option,
                index,
                numberCircles[index],
                onAnswerSelected
            );
            optionsContainer.appendChild(button);
        });

        container.appendChild(optionsContainer);
    }

    /**
     * 옵션 버튼 생성
     * @param {Object} option - 옵션 객체
     * @param {number} index - 옵션 인덱스
     * @param {string} numberCircle - 번호 표시
     * @param {Function} onAnswerSelected - 콜백 함수
     * @returns {HTMLElement} 버튼 요소
     */
    createOptionButton(option, index, numberCircle, onAnswerSelected) {
        const button = document.createElement('button');
        const textSpan = document.createElement('span');

        textSpan.textContent = `${numberCircle} ${Utils.escapeHtml(option.text)}`;

        button.appendChild(textSpan);

        // 색상 값 직접 사용
        const successColor = '#4caf50';
        const lightGrayColor = '#f8f9fa';
        const fastDuration = AppConstants.ANIMATION_DURATIONS.FAST;

        button.onclick = () => {
            if (!button.disabled) {
                // 클릭 애니메이션
                button.style.backgroundColor = successColor;
                setTimeout(() => {
                    button.style.backgroundColor = lightGrayColor;
                    onAnswerSelected(option.isCorrect);
                }, fastDuration);
            }
        };

        return button;
    }
}
