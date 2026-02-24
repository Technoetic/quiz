/**
 * SettingsStorage 클래스
 * 설정 데이터 저장 전담
 */

import { StorageManager } from './StorageManager.js';
import { AppConstants } from '../constants/AppConstants.js';

export class SettingsStorage {
    constructor() {
        this.storage = new StorageManager(AppConstants.STORAGE_KEYS.APP_NAME);
    }

    /**
     * 설정 저장
     * @param {Object} settings - 설정 객체
     */
    saveSettings(settings) {
        this.storage.set(AppConstants.STORAGE_KEYS.SETTINGS, settings);
    }

    /**
     * 설정 로드
     * @returns {Object} 설정 객체
     */
    loadSettings() {
        return this.storage.get(AppConstants.STORAGE_KEYS.SETTINGS, {
            apiKey: '',
            enableRephrase: true
        });
    }

    /**
     * 개별 설정 값 저장
     * @param {string} key - 설정 키
     * @param {*} value - 설정 값
     */
    setSetting(key, value) {
        const settings = this.loadSettings();
        settings[key] = value;
        this.saveSettings(settings);
    }

    /**
     * 개별 설정 값 조회
     * @param {string} key - 설정 키
     * @param {*} defaultValue - 기본값
     * @returns {*} 설정 값
     */
    getSetting(key, defaultValue = null) {
        const settings = this.loadSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    /**
     * 설정 삭제
     */
    clearSettings() {
        this.storage.remove(AppConstants.STORAGE_KEYS.SETTINGS);
    }
}
