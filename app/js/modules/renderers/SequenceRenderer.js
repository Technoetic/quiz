/**
 * SequenceRenderer 클래스
 * 순서 나열 문제 렌더링 전담
 */

import { Utils } from '../utils.js';
import { AppConstants } from '../constants/AppConstants.js';

export class SequenceRenderer {
    /**
     * 순서 나열 문제 렌더링
     * @param {Question} question - 문제 객체
     * @param {HTMLElement} container - 렌더링할 컨테이너
     * @param {Function} onAnswerSubmitted - 답변 제출 시 콜백
     */
    render(question, container, onAnswerSubmitted) {
        const sequenceContainer = this.createSequenceContainer(question);
        const submitButton = this.createSubmitButton(sequenceContainer, question, onAnswerSubmitted);

        container.appendChild(sequenceContainer);
        container.appendChild(submitButton);
    }

    /**
     * 순서 컨테이너 생성 (드래그 앤 드롭)
     * @param {Question} question - 문제 객체
     * @returns {HTMLElement} 순서 컨테이너
     */
    createSequenceContainer(question) {
        const container = document.createElement('div');
        container.className = AppConstants.CSS_CLASSES.SEQUENCE_ANSWER;

        // 정답 순서 섞기
        const shuffledOrder = Utils.shuffleArray([...question.correctOrder]);

        // 드래그 가능한 아이템 생성
        shuffledOrder.forEach((item, index) => {
            const div = this.createDraggableItem(item, index);
            container.appendChild(div);
        });

        // 드래그 오버 이벤트
        container.ondragover = (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(container, e.clientY);
            const dragging = document.querySelector(`.${AppConstants.CSS_CLASSES.DRAGGING}`);
            if (dragging) {
                if (afterElement == null) {
                    container.appendChild(dragging);
                } else {
                    container.insertBefore(dragging, afterElement);
                }
            }
        };

        return container;
    }

    /**
     * 드래그 가능한 아이템 생성
     * @param {string} text - 아이템 텍스트
     * @param {number} index - 인덱스
     * @returns {HTMLElement} 드래그 아이템
     */
    createDraggableItem(text, index) {
        const div = document.createElement('div');
        div.className = AppConstants.CSS_CLASSES.SEQUENCE_OPTION;
        div.draggable = true;
        div.textContent = text;
        div.dataset.index = index;

        div.ondragstart = (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', div.innerHTML);
            div.classList.add(AppConstants.CSS_CLASSES.DRAGGING);
        };

        div.ondragend = () => {
            div.classList.remove(AppConstants.CSS_CLASSES.DRAGGING);
        };

        return div;
    }

    /**
     * 드래그 후 삽입 위치 계산
     * @param {HTMLElement} container - 컨테이너
     * @param {number} y - Y 좌표
     * @returns {HTMLElement|null} 삽입 위치 요소
     */
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(`.${AppConstants.CSS_CLASSES.SEQUENCE_OPTION}:not(.${AppConstants.CSS_CLASSES.DRAGGING})`)];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * 제출 버튼 생성
     * @param {HTMLElement} sequenceContainer - 순서 컨테이너
     * @param {Question} question - 문제 객체
     * @param {Function} onAnswerSubmitted - 콜백 함수
     * @returns {HTMLButtonElement} 버튼 요소
     */
    createSubmitButton(sequenceContainer, question, onAnswerSubmitted) {
        const submitButton = document.createElement('button');
        submitButton.textContent = AppConstants.UI_TEXT.SUBMIT_ANSWER;
        submitButton.className = AppConstants.CSS_CLASSES.SUBMIT_BUTTON;

        submitButton.onclick = () => {
            const currentOrder = Array.from(sequenceContainer.children)
                .map(item => item.textContent);
            onAnswerSubmitted(question.checkAnswer(currentOrder));
        };

        return submitButton;
    }
}
