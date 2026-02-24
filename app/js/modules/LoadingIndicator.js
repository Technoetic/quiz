/**
 * LoadingIndicator 클래스
 * 로딩 스피너 표시 관리
 */

import { AppConstants } from './constants/AppConstants.js';
import { domCache } from './utils/DOMCache.js';

export class LoadingIndicator {
    /**
     * @param {string} spinnerId - 로딩 스피너 요소의 ID
     */
    constructor(spinnerId = AppConstants.DOM_IDS.LOADING_SPINNER) {
        this.spinner = domCache.get('loadingSpinner') || document.getElementById(spinnerId);
    }

    /**
     * 로딩 스피너 표시
     */
    show() {
        if (this.spinner) this.spinner.style.display = 'flex';
    }

    /**
     * 로딩 스피너 숨기기
     */
    hide() {
        if (this.spinner) this.spinner.style.display = 'none';
    }
}
