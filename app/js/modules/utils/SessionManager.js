/**
 * SessionManager 클래스
 * 학습 세션 관리 (타이머, 휴식 등)
 */

import { StorageManager } from '../storage/StorageManager.js';
import { AppConstants } from '../constants/AppConstants.js';

export class SessionManager {

    constructor(options = {}) {
        this.options = {
            workDuration: options.workDuration || AppConstants.SESSION_TIMES.WORK,
            breakDuration: options.breakDuration || AppConstants.SESSION_TIMES.BREAK,
            longBreakDuration: options.longBreakDuration || AppConstants.SESSION_TIMES.LONG_BREAK,
            sessionsUntilLongBreak: options.sessionsUntilLongBreak || AppConstants.SESSIONS_UNTIL_LONG_BREAK,
            autoStartBreak: options.autoStartBreak || false,
            notifications: options.notifications || true
        };

        this.storage = new StorageManager(AppConstants.STORAGE_KEYS.SESSION);
        this.state = AppConstants.SESSION_STATES.IDLE;
        this.sessionCount = this.storage.get('sessionCount', 0);
        this.totalTime = this.storage.get('totalTime', 0);

        this.timer = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.remainingTime = this.options.workDuration;

        this.callbacks = {
            onTick: null,
            onStateChange: null,
            onSessionComplete: null,
            onBreakComplete: null
        };
    }

    /**
     * 세션 시작
     */
    start() {
        if (this.state === AppConstants.SESSION_STATES.ACTIVE) return;

        this.state = AppConstants.SESSION_STATES.ACTIVE;
        this.startTime = Date.now();

        this.timer = setInterval(() => {
            this.tick();
        }, 1000);

        this.emitStateChange();
    }

    /**
     * 세션 일시정지
     */
    pause() {
        if (this.state !== AppConstants.SESSION_STATES.ACTIVE) return;

        this.state = AppConstants.SESSION_STATES.PAUSED;
        this.elapsedTime += Date.now() - this.startTime;
        this.remainingTime = this.getCurrentDuration() - this.elapsedTime;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.emitStateChange();
    }

    /**
     * 세션 재개
     */
    resume() {
        if (this.state !== AppConstants.SESSION_STATES.PAUSED) return;

        this.state = AppConstants.SESSION_STATES.ACTIVE;
        this.startTime = Date.now();

        this.timer = setInterval(() => {
            this.tick();
        }, 1000);

        this.emitStateChange();
    }

    /**
     * 세션 중지
     */
    stop() {
        this.state = AppConstants.SESSION_STATES.IDLE;
        this.elapsedTime = 0;
        this.remainingTime = this.options.workDuration;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.emitStateChange();
    }

    /**
     * 휴식 시작
     */
    startBreak() {
        this.state = AppConstants.SESSION_STATES.BREAK;
        this.startTime = Date.now();
        this.elapsedTime = 0;

        const isLongBreak = this.sessionCount % this.options.sessionsUntilLongBreak === 0;
        this.remainingTime = isLongBreak
            ? this.options.longBreakDuration
            : this.options.breakDuration;

        this.timer = setInterval(() => {
            this.tick();
        }, 1000);

        this.emitStateChange();

        if (this.options.notifications) {
            this.notifyBreakStart(isLongBreak);
        }
    }

    /**
     * 타이머 틱
     */
    tick() {
        const now = Date.now();
        const elapsed = this.elapsedTime + (now - this.startTime);
        const duration = this.getCurrentDuration();

        this.remainingTime = Math.max(0, duration - elapsed);

        // 콜백 호출
        if (this.callbacks.onTick) {
            this.callbacks.onTick(this.remainingTime, duration);
        }

        // 세션 완료
        if (elapsed >= duration) {
            if (this.state === AppConstants.SESSION_STATES.ACTIVE) {
                this.completeSession();
            } else if (this.state === AppConstants.SESSION_STATES.BREAK) {
                this.completeBreak();
            }
        }
    }

    /**
     * 세션 완료
     */
    completeSession() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.sessionCount++;
        this.totalTime += this.options.workDuration;
        this.saveProgress();

        if (this.callbacks.onSessionComplete) {
            this.callbacks.onSessionComplete(this.sessionCount);
        }

        if (this.options.notifications) {
            this.notifySessionComplete();
        }

        // 자동 휴식 시작
        if (this.options.autoStartBreak) {
            setTimeout(() => this.startBreak(), 1000);
        } else {
            this.state = AppConstants.SESSION_STATES.IDLE;
            this.elapsedTime = 0;
            this.remainingTime = this.options.workDuration;
            this.emitStateChange();
        }
    }

    /**
     * 휴식 완료
     */
    completeBreak() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.state = AppConstants.SESSION_STATES.IDLE;
        this.elapsedTime = 0;
        this.remainingTime = this.options.workDuration;

        if (this.callbacks.onBreakComplete) {
            this.callbacks.onBreakComplete();
        }

        if (this.options.notifications) {
            this.notifyBreakComplete();
        }

        this.emitStateChange();
    }

    /**
     * 현재 세션 시간 가져오기
     * @returns {number} 시간 (ms)
     */
    getCurrentDuration() {
        if (this.state === AppConstants.SESSION_STATES.BREAK) {
            const isLongBreak = this.sessionCount % this.options.sessionsUntilLongBreak === 0;
            return isLongBreak ? this.options.longBreakDuration : this.options.breakDuration;
        }
        return this.options.workDuration;
    }

    /**
     * 남은 시간 포맷
     * @returns {string} MM:SS 형식
     */
    getFormattedTime() {
        const totalSeconds = Math.ceil(this.remainingTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * 진행률 (0-100)
     * @returns {number} 진행률
     */
    getProgress() {
        const duration = this.getCurrentDuration();
        const elapsed = duration - this.remainingTime;
        return Math.min(100, Math.round((elapsed / duration) * 100));
    }

    /**
     * 상태 변경 이벤트 발생
     */
    emitStateChange() {
        if (this.callbacks.onStateChange) {
            this.callbacks.onStateChange(this.state);
        }
    }

    /**
     * 세션 완료 알림
     */
    notifySessionComplete() {
        const message = `세션 ${this.sessionCount} 완료! 잠시 휴식하세요.`;
        this.showNotification('세션 완료', message);
    }

    /**
     * 휴식 시작 알림
     * @param {boolean} isLongBreak - 긴 휴식 여부
     */
    notifyBreakStart(isLongBreak) {
        const duration = isLongBreak ? '15분' : '5분';
        const message = `${duration} 휴식이 시작되었습니다.`;
        this.showNotification('휴식 시간', message);
    }

    /**
     * 휴식 완료 알림
     */
    notifyBreakComplete() {
        const message = '휴식이 끝났습니다. 다시 시작하세요!';
        this.showNotification('휴식 완료', message);
    }

    /**
     * 알림 표시
     * @param {string} title - 제목
     * @param {string} message - 메시지
     */
    showNotification(title, message) {
        // 브라우저 알림
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body: message });
        }

        // CustomEvent 발생
        const event = new CustomEvent('session-notification', {
            detail: { title, message }
        });
        window.dispatchEvent(event);
    }

    /**
     * 진행 상황 저장
     */
    saveProgress() {
        this.storage.set('sessionCount', this.sessionCount);
        this.storage.set('totalTime', this.totalTime);
    }

    /**
     * 통계 가져오기
     * @returns {Object} 통계
     */
    getStats() {
        return {
            sessionCount: this.sessionCount,
            totalTime: this.totalTime,
            totalHours: Math.round(this.totalTime / (1000 * 60 * 60) * 10) / 10
        };
    }

    /**
     * 콜백 등록
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 콜백 함수
     */
    on(event, callback) {
        if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase()}${event.slice(1)}`)) {
            this.callbacks[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`] = callback;
        }
    }

    /**
     * 옵션 업데이트
     * @param {Object} options - 새 옵션
     */
    updateOptions(options) {
        Object.assign(this.options, options);
    }

    /**
     * 초기화
     */
    reset() {
        this.stop();
        this.sessionCount = 0;
        this.totalTime = 0;
        this.saveProgress();
    }

    /**
     * 정리
     */
    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
