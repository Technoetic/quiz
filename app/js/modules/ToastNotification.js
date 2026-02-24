/**
 * ToastNotification 클래스
 * Toast 알림 표시 관리
 */

import { AppConstants } from './constants/AppConstants.js';
import { domCache } from './utils/DOMCache.js';

export class ToastNotification {
    /**
     * @param {string} containerId - Toast 컨테이너 요소의 ID
     */
    constructor(containerId = AppConstants.DOM_IDS.TOAST_CONTAINER) {
        this.container = domCache.get('toastContainer') || document.getElementById(containerId);
    }

    /**
     * Toast 알림 표시
     * @param {string} message - 표시할 메시지
     * @param {string} type - 알림 타입 ('info', 'success', 'error')
     * @param {number} duration - 표시 시간 (밀리초)
     */
    show(message, type = AppConstants.NOTIFICATION_TYPES.INFO, duration = AppConstants.ANIMATION_DURATIONS.VERY_SLOW) {
        if (!this.container) return;

        this.container.textContent = message;
        this.container.className = `toast show toast-${type}`;

        setTimeout(() => {
            this.container.classList.remove('show');
        }, duration);
    }
}
