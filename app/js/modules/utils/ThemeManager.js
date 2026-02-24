/**
 * ThemeManager 클래스
 * 테마(다크모드/라이트모드) 관리
 */

import { AppConstants } from '../constants/AppConstants.js';

export class ThemeManager {

    /**
     * CSS 변수 정의
     */
    static THEME_VARIABLES = {
        light: {
            '--color-bg': '#f8f9fa',
            '--color-surface': '#ffffff',
            '--color-text': '#333333',
            '--color-text-secondary': '#666666',
            '--color-border': '#dee2e6',
            '--color-shadow': 'rgba(0, 0, 0, 0.1)',
            '--color-hover': '#f0f0f0'
        },
        dark: {
            '--color-bg': '#1a1a1a',
            '--color-surface': '#2d2d2d',
            '--color-text': '#e0e0e0',
            '--color-text-secondary': '#a0a0a0',
            '--color-border': '#404040',
            '--color-shadow': 'rgba(0, 0, 0, 0.3)',
            '--color-hover': '#383838'
        }
    };

    constructor() {
        this.currentTheme = this.loadTheme();
        this.init();
    }

    /**
     * 초기화
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.setupMediaQueryListener();
    }

    /**
     * 저장된 테마 로드
     * @returns {string} 테마
     */
    loadTheme() {
        const saved = localStorage.getItem(AppConstants.STORAGE_KEYS.THEME);
        if (saved && Object.values(AppConstants.THEMES).includes(saved)) {
            return saved;
        }
        return AppConstants.THEMES.AUTO;
    }

    /**
     * 테마 저장
     * @param {string} theme - 테마
     */
    saveTheme(theme) {
        localStorage.setItem(AppConstants.STORAGE_KEYS.THEME, theme);
    }

    /**
     * 시스템 다크모드 감지
     * @returns {boolean} 다크모드 여부
     */
    isSystemDarkMode() {
        return window.matchMedia &&
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * 미디어 쿼리 리스너 설정
     */
    setupMediaQueryListener() {
        if (!window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === AppConstants.THEMES.AUTO) {
                this.applyTheme(AppConstants.THEMES.AUTO);
            }
        });
    }

    /**
     * 테마 적용
     * @param {string} theme - 테마
     */
    applyTheme(theme) {
        this.currentTheme = theme;
        this.saveTheme(theme);

        let actualTheme = theme;
        if (theme === AppConstants.THEMES.AUTO) {
            actualTheme = this.isSystemDarkMode()
                ? AppConstants.THEMES.DARK
                : AppConstants.THEMES.LIGHT;
        }

        // HTML 요소에 data-theme 속성 설정
        document.documentElement.setAttribute('data-theme', actualTheme);

        // CSS 변수 적용
        this.applyCSSVariables(actualTheme);

        // 이벤트 발생
        this.dispatchThemeChangeEvent(actualTheme);
    }

    /**
     * CSS 변수 적용
     * @param {string} theme - 테마
     */
    applyCSSVariables(theme) {
        const variables = ThemeManager.THEME_VARIABLES[theme];
        if (!variables) return;

        const root = document.documentElement;
        Object.entries(variables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }

    /**
     * 테마 변경 이벤트 발생
     * @param {string} theme - 테마
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme }
        });
        window.dispatchEvent(event);
    }

    /**
     * 테마 전환 (라이트 ↔ 다크)
     */
    toggle() {
        const currentActualTheme = this.getCurrentActualTheme();
        const newTheme = currentActualTheme === AppConstants.THEMES.DARK
            ? AppConstants.THEMES.LIGHT
            : AppConstants.THEMES.DARK;

        this.applyTheme(newTheme);
    }

    /**
     * 현재 실제 테마 가져오기 (AUTO 해석)
     * @returns {string} 실제 테마
     */
    getCurrentActualTheme() {
        if (this.currentTheme === AppConstants.THEMES.AUTO) {
            return this.isSystemDarkMode()
                ? AppConstants.THEMES.DARK
                : AppConstants.THEMES.LIGHT;
        }
        return this.currentTheme;
    }

    /**
     * 현재 테마 가져오기
     * @returns {string} 테마
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * 다크모드 여부
     * @returns {boolean} 다크모드 여부
     */
    isDarkMode() {
        return this.getCurrentActualTheme() === AppConstants.THEMES.DARK;
    }

    /**
     * 라이트모드 여부
     * @returns {boolean} 라이트모드 여부
     */
    isLightMode() {
        return this.getCurrentActualTheme() === AppConstants.THEMES.LIGHT;
    }

    /**
     * 테마 변경 이벤트 리스너 등록
     * @param {Function} callback - 콜백 함수
     */
    onThemeChange(callback) {
        window.addEventListener('themechange', (e) => {
            callback(e.detail.theme);
        });
    }

    /**
     * 테마 토글 버튼 생성
     * @param {HTMLElement} container - 컨테이너 요소
     * @returns {HTMLElement} 버튼 요소
     */
    createToggleButton(container) {
        const button = document.createElement('button');
        button.className = 'theme-toggle-btn';
        button.setAttribute('aria-label', '테마 전환');

        this.updateButtonIcon(button);

        button.onclick = () => {
            this.toggle();
            this.updateButtonIcon(button);
        };

        if (container) {
            container.appendChild(button);
        }

        return button;
    }

    /**
     * 버튼 아이콘 업데이트
     * @param {HTMLElement} button - 버튼 요소
     */
    updateButtonIcon(button) {
        const isDark = this.isDarkMode();
        button.innerHTML = isDark
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        button.title = isDark ? '라이트 모드로 전환' : '다크 모드로 전환';
    }

    /**
     * 테마 선택 드롭다운 생성
     * @param {HTMLElement} container - 컨테이너 요소
     * @returns {HTMLElement} 드롭다운 요소
     */
    createThemeSelector(container) {
        const select = document.createElement('select');
        select.className = 'theme-selector';
        select.setAttribute('aria-label', '테마 선택');

        const options = [
            { value: AppConstants.THEMES.AUTO, label: '시스템 설정' },
            { value: AppConstants.THEMES.LIGHT, label: '라이트 모드' },
            { value: AppConstants.THEMES.DARK, label: '다크 모드' }
        ];

        options.forEach(({ value, label }) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            if (value === this.currentTheme) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.onchange = (e) => {
            this.applyTheme(e.target.value);
        };

        if (container) {
            container.appendChild(select);
        }

        return select;
    }

    /**
     * 애니메이션과 함께 테마 전환
     * @param {string} theme - 테마
     * @param {number} duration - 애니메이션 시간 (ms)
     */
    applyThemeWithTransition(theme, duration = 300) {
        document.documentElement.style.setProperty(
            '--theme-transition-duration',
            `${duration}ms`
        );

        document.body.classList.add('theme-transitioning');

        this.applyTheme(theme);

        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, duration);
    }
}
