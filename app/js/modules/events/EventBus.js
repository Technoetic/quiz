/**
 * EventBus 클래스
 * 전역 이벤트 버스 (Pub/Sub 패턴)
 */

export class EventBus {
    constructor() {
        this.events = new Map();
    }

    /**
     * 이벤트 리스너 등록
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 콜백 함수
     * @returns {Function} 구독 취소 함수
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        this.events.get(event).push(callback);

        // 구독 취소 함수 반환
        return () => this.off(event, callback);
    }

    /**
     * 일회성 이벤트 리스너 등록
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 콜백 함수
     */
    once(event, callback) {
        const onceWrapper = (...args) => {
            callback(...args);
            this.off(event, onceWrapper);
        };

        this.on(event, onceWrapper);
    }

    /**
     * 이벤트 리스너 제거
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 콜백 함수
     */
    off(event, callback) {
        if (!this.events.has(event)) return;

        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);

        if (index > -1) {
            callbacks.splice(index, 1);
        }

        // 리스너가 없으면 이벤트 삭제
        if (callbacks.length === 0) {
            this.events.delete(event);
        }
    }

    /**
     * 이벤트 발생
     * @param {string} event - 이벤트 이름
     * @param {...*} args - 이벤트 데이터
     */
    emit(event, ...args) {
        if (!this.events.has(event)) return;

        const callbacks = this.events.get(event);
        callbacks.forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in event handler for "${event}":`, error);
            }
        });
    }

    /**
     * 모든 리스너 제거
     * @param {string} event - 이벤트 이름 (선택사항, 없으면 모든 이벤트)
     */
    clear(event = null) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    /**
     * 등록된 이벤트 목록
     * @returns {string[]} 이벤트 이름 배열
     */
    eventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * 특정 이벤트의 리스너 수
     * @param {string} event - 이벤트 이름
     * @returns {number} 리스너 수
     */
    listenerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }
}

// 싱글톤 인스턴스
export const eventBus = new EventBus();

// 이벤트 이름 상수
export const EVENTS = {
    // 문제 관련
    QUESTION_ADDED: 'question:added',
    QUESTION_UPDATED: 'question:updated',
    QUESTION_DELETED: 'question:deleted',
    QUESTIONS_CLEARED: 'questions:cleared',

    // 퀴즈 관련
    QUIZ_STARTED: 'quiz:started',
    QUIZ_COMPLETED: 'quiz:completed',
    QUIZ_RESTARTED: 'quiz:restarted',
    QUESTION_ANSWERED: 'question:answered',
    ANSWER_CORRECT: 'answer:correct',
    ANSWER_INCORRECT: 'answer:incorrect',

    // UI 관련
    TAB_CHANGED: 'tab:changed',
    FILTER_CHANGED: 'filter:changed',
    PROGRESS_UPDATED: 'progress:updated',

    // 설정 관련
    SETTINGS_SAVED: 'settings:saved',
    SETTINGS_LOADED: 'settings:loaded',

    // Storage 관련
    STORAGE_SAVED: 'storage:saved',
    STORAGE_LOADED: 'storage:loaded',
    STORAGE_CLEARED: 'storage:cleared'
};
