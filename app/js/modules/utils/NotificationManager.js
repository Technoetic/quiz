/**
 * NotificationManager 클래스
 * 모든 알림(Toast, 브라우저 알림 등) 통합 관리
 */

import { AppConstants } from '../constants/AppConstants.js';

export class NotificationManager {

    /**
     * 알림 위치
     */
    static POSITIONS = {
        TOP_LEFT: 'top-left',
        TOP_CENTER: 'top-center',
        TOP_RIGHT: 'top-right',
        BOTTOM_LEFT: 'bottom-left',
        BOTTOM_CENTER: 'bottom-center',
        BOTTOM_RIGHT: 'bottom-right'
    };

    constructor(options = {}) {
        this.options = {
            position: options.position || NotificationManager.POSITIONS.TOP_RIGHT,
            duration: options.duration || AppConstants.TOAST_DURATIONS.NORMAL,
            enableBrowser: options.enableBrowser || false,
            enableSound: options.enableSound || false,
            maxVisible: options.maxVisible || AppConstants.MAX_VISIBLE_NOTIFICATIONS
        };

        this.activeNotifications = [];
        this.queue = [];
        this.container = this.createContainer();

        if (this.options.enableBrowser) {
            this.requestBrowserPermission();
        }
    }

    /**
     * 알림 컨테이너 생성
     * @returns {HTMLElement} 컨테이너 요소
     */
    createContainer() {
        let container = document.querySelector('.notification-container');

        if (!container) {
            container = document.createElement('div');
            container.className = `notification-container ${this.options.position}`;
            document.body.appendChild(container);
        }

        return container;
    }

    /**
     * Toast 알림 표시
     * @param {string} message - 메시지
     * @param {string} type - 알림 타입
     * @param {number} duration - 표시 시간
     */
    showToast(message, type = AppConstants.NOTIFICATION_TYPES.INFO, duration = null) {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type,
            duration: duration || this.options.duration
        };

        if (this.activeNotifications.length >= this.options.maxVisible) {
            this.queue.push(notification);
            return;
        }

        this.displayToast(notification);
    }

    /**
     * Toast 표시
     * @param {Object} notification - 알림 객체
     */
    displayToast(notification) {
        const toast = this.createToastElement(notification);
        this.container.appendChild(toast);
        this.activeNotifications.push(notification);

        // 애니메이션
        setTimeout(() => toast.classList.add('show'), 10);

        // 사운드 재생
        if (this.options.enableSound) {
            this.playSound(notification.type);
        }

        // 자동 제거
        if (notification.duration > 0) {
            setTimeout(() => {
                this.hideToast(toast, notification.id);
            }, notification.duration);
        }
    }

    /**
     * Toast 요소 생성
     * @param {Object} notification - 알림 객체
     * @returns {HTMLElement} Toast 요소
     */
    createToastElement(notification) {
        const toast = document.createElement('div');
        toast.className = `notification-toast ${notification.type}`;
        toast.dataset.id = notification.id;

        const icon = this.getIcon(notification.type);
        const closeBtn = '<button class="notification-close" aria-label="닫기">&times;</button>';

        toast.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${notification.message}</span>
                ${closeBtn}
            </div>
        `;

        // 닫기 버튼 이벤트
        toast.querySelector('.notification-close').onclick = () => {
            this.hideToast(toast, notification.id);
        };

        return toast;
    }

    /**
     * Toast 숨기기
     * @param {HTMLElement} toast - Toast 요소
     * @param {string} id - 알림 ID
     */
    hideToast(toast, id) {
        toast.classList.remove('show');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }

            this.activeNotifications = this.activeNotifications.filter(n => n.id !== id);

            // 대기열에서 다음 알림 표시
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                this.displayToast(next);
            }
        }, 300);
    }

    /**
     * 타입별 아이콘 반환
     * @param {string} type - 알림 타입
     * @returns {string} 아이콘 HTML
     */
    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>'
        };
        return icons[type] || icons.info;
    }

    /**
     * 브라우저 알림 권한 요청
     */
    async requestBrowserPermission() {
        if (!('Notification' in window)) {
            console.warn('이 브라우저는 알림을 지원하지 않습니다.');
            return;
        }

        if (Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    /**
     * 브라우저 알림 표시
     * @param {string} title - 제목
     * @param {string} message - 메시지
     * @param {Object} options - 옵션
     */
    showBrowserNotification(title, message, options = {}) {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        const notification = new Notification(title, {
            body: message,
            icon: options.icon || '/favicon.ico',
            badge: options.badge,
            tag: options.tag,
            requireInteraction: options.requireInteraction || false,
            ...options
        });

        if (options.onClick) {
            notification.onclick = options.onClick;
        }

        return notification;
    }

    /**
     * 사운드 재생
     * @param {string} type - 알림 타입
     */
    playSound(type) {
        // TODO: 오디오 파일 추가 시 구현
        // const audio = new Audio(`/sounds/${type}.mp3`);
        // audio.play().catch(() => {});
    }

    /**
     * Success 알림
     * @param {string} message - 메시지
     * @param {number} duration - 표시 시간
     */
    success(message, duration) {
        this.showToast(message, AppConstants.NOTIFICATION_TYPES.SUCCESS, duration);
    }

    /**
     * Error 알림
     * @param {string} message - 메시지
     * @param {number} duration - 표시 시간
     */
    error(message, duration) {
        this.showToast(message, AppConstants.NOTIFICATION_TYPES.ERROR, duration);
    }

    /**
     * Info 알림
     * @param {string} message - 메시지
     * @param {number} duration - 표시 시간
     */
    info(message, duration) {
        this.showToast(message, AppConstants.NOTIFICATION_TYPES.INFO, duration);
    }

    /**
     * Warning 알림
     * @param {string} message - 메시지
     * @param {number} duration - 표시 시간
     */
    warning(message, duration) {
        this.showToast(message, AppConstants.NOTIFICATION_TYPES.WARNING, duration);
    }

    /**
     * 진행중인 알림 표시 (로딩 등)
     * @param {string} message - 메시지
     * @returns {string} 알림 ID
     */
    showProgress(message) {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type: AppConstants.NOTIFICATION_TYPES.INFO,
            duration: 0  // 자동 제거 안됨
        };

        this.displayToast(notification);
        return notification.id;
    }

    /**
     * 진행중인 알림 업데이트
     * @param {string} id - 알림 ID
     * @param {string} message - 새 메시지
     */
    updateProgress(id, message) {
        const toast = this.container.querySelector(`[data-id="${id}"]`);
        if (toast) {
            const messageEl = toast.querySelector('.notification-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    }

    /**
     * 진행중인 알림 완료
     * @param {string} id - 알림 ID
     * @param {string} message - 완료 메시지
     */
    completeProgress(id, message) {
        const toast = this.container.querySelector(`[data-id="${id}"]`);
        if (toast) {
            const messageEl = toast.querySelector('.notification-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
            toast.classList.remove(AppConstants.NOTIFICATION_TYPES.INFO);
            toast.classList.add(AppConstants.NOTIFICATION_TYPES.SUCCESS);

            setTimeout(() => {
                this.hideToast(toast, id);
            }, 2000);
        }
    }

    /**
     * 모든 알림 제거
     */
    clearAll() {
        this.activeNotifications.forEach(n => {
            const toast = this.container.querySelector(`[data-id="${n.id}"]`);
            if (toast) {
                this.hideToast(toast, n.id);
            }
        });
        this.queue = [];
    }

    /**
     * 위치 변경
     * @param {string} position - 새 위치
     */
    setPosition(position) {
        this.container.className = `notification-container ${position}`;
        this.options.position = position;
    }

    /**
     * 옵션 업데이트
     * @param {Object} options - 새 옵션
     */
    updateOptions(options) {
        Object.assign(this.options, options);
    }
}
