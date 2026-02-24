/**
 * SubjectiveRenderer 클래스
 * 주관식 문제 렌더링 전담
 */

import { AppConstants } from '../constants/AppConstants.js';

export class SubjectiveRenderer {
    /**
     * 주관식 문제 렌더링
     * @param {Question} question - 문제 객체
     * @param {HTMLElement} container - 렌더링할 컨테이너
     * @param {Function} onAnswerSubmitted - 답변 제출 시 콜백
     */
    render(question, container, onAnswerSubmitted) {
        const input = this.createInput();
        const submitButton = this.createSubmitButton(input, question, onAnswerSubmitted);

        container.appendChild(input);
        container.appendChild(submitButton);

        // 자동 포커스
        input.focus();
    }

    /**
     * 입력 필드 생성
     * @returns {HTMLInputElement} 입력 요소
     */
    createInput() {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = AppConstants.CSS_CLASSES.ANSWER_INPUT;
        input.placeholder = AppConstants.UI_TEXT.ENTER_ANSWER;
        return input;
    }

    /**
     * 제출 버튼 생성
     * @param {HTMLInputElement} input - 입력 요소
     * @param {Question} question - 문제 객체
     * @param {Function} onAnswerSubmitted - 콜백 함수
     * @returns {HTMLButtonElement} 버튼 요소
     */
    createSubmitButton(input, question, onAnswerSubmitted) {
        const submitButton = document.createElement('button');
        submitButton.textContent = AppConstants.UI_TEXT.SUBMIT_ANSWER;
        submitButton.className = AppConstants.CSS_CLASSES.SUBMIT_BUTTON;

        const handleSubmit = () => {
            const userAnswer = input.value.trim();
            if (!userAnswer) {
                // 빈 답변인 경우 null 전달
                onAnswerSubmitted(null);
                return;
            }
            onAnswerSubmitted(question.checkAnswer(userAnswer));
        };

        submitButton.onclick = handleSubmit;
        input.onkeypress = (e) => {
            if (e.key === 'Enter') handleSubmit();
        };

        return submitButton;
    }
}
