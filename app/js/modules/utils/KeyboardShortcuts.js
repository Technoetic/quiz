/**
 * KeyboardShortcuts 클래스
 * 키보드 단축키 관리
 */

export class KeyboardShortcuts {
    /**
     * @param {Object} handlers - 단축키 핸들러 맵
     */
    constructor(handlers = {}) {
        this.handlers = handlers;
        this.enabled = true;
        this.pressedKeys = new Set();
        this.init();
    }

    /**
     * 초기화
     */
    init() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    /**
     * 키 다운 이벤트 핸들러
     * @param {KeyboardEvent} e - 키보드 이벤트
     */
    handleKeyDown(e) {
        if (!this.enabled) return;

        // 입력 필드에서는 단축키 무시
        if (this.isInputElement(e.target)) return;

        this.pressedKeys.add(e.key.toLowerCase());

        // 단축키 조합 확인
        const shortcut = this.getShortcutKey(e);
        if (this.handlers[shortcut]) {
            e.preventDefault();
            this.handlers[shortcut](e);
        }
    }

    /**
     * 키 업 이벤트 핸들러
     * @param {KeyboardEvent} e - 키보드 이벤트
     */
    handleKeyUp(e) {
        this.pressedKeys.delete(e.key.toLowerCase());
    }

    /**
     * 단축키 키 조합 생성
     * @param {KeyboardEvent} e - 키보드 이벤트
     * @returns {string} 단축키 문자열
     */
    getShortcutKey(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('ctrl');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        if (e.metaKey) parts.push('meta');

        const key = e.key.toLowerCase();
        if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
            parts.push(key);
        }

        return parts.join('+');
    }

    /**
     * 입력 요소 확인
     * @param {HTMLElement} element - 요소
     * @returns {boolean} 입력 요소 여부
     */
    isInputElement(element) {
        const tagName = element.tagName.toLowerCase();
        return tagName === 'input' ||
               tagName === 'textarea' ||
               tagName === 'select' ||
               element.isContentEditable;
    }

    /**
     * 단축키 등록
     * @param {string} shortcut - 단축키 (예: 'ctrl+s', 'alt+n')
     * @param {Function} handler - 핸들러 함수
     */
    register(shortcut, handler) {
        this.handlers[shortcut.toLowerCase()] = handler;
    }

    /**
     * 단축키 해제
     * @param {string} shortcut - 단축키
     */
    unregister(shortcut) {
        delete this.handlers[shortcut.toLowerCase()];
    }

    /**
     * 여러 단축키 한번에 등록
     * @param {Object} shortcuts - 단축키 맵
     */
    registerMultiple(shortcuts) {
        Object.entries(shortcuts).forEach(([key, handler]) => {
            this.register(key, handler);
        });
    }

    /**
     * 단축키 활성화
     */
    enable() {
        this.enabled = true;
    }

    /**
     * 단축키 비활성화
     */
    disable() {
        this.enabled = false;
    }

    /**
     * 모든 단축키 제거
     */
    clear() {
        this.handlers = {};
    }

    /**
     * 등록된 단축키 목록 조회
     * @returns {string[]} 단축키 배열
     */
    getRegisteredShortcuts() {
        return Object.keys(this.handlers);
    }

    /**
     * 단축키 도움말 생성
     * @param {Object} descriptions - 단축키 설명 맵
     * @returns {string} HTML 문자열
     */
    static generateHelpHTML(descriptions) {
        const shortcuts = Object.entries(descriptions)
            .map(([key, desc]) => {
                const keyDisplay = key
                    .split('+')
                    .map(k => `<kbd>${k.toUpperCase()}</kbd>`)
                    .join(' + ');
                return `<div class="shortcut-item">
                    <span class="shortcut-keys">${keyDisplay}</span>
                    <span class="shortcut-desc">${desc}</span>
                </div>`;
            })
            .join('');

        return `<div class="shortcuts-help">${shortcuts}</div>`;
    }
}

/**
 * 기본 단축키 설정
 */
export const DEFAULT_SHORTCUTS = {
    // 탭 전환
    '1': 'quiz',      // 문제 풀기
    '2': 'admin',     // 문제 등록
    '3': 'list',      // 문제 목록
    '4': 'settings',  // 설정

    // 네비게이션
    'n': 'next',           // 다음 문제
    'r': 'restart',        // 퀴즈 재시작
    'escape': 'close',     // 닫기/취소

    // 편집
    'ctrl+s': 'save',      // 저장
    'ctrl+n': 'new',       // 새 문제
    'ctrl+e': 'export',    // 내보내기
    'ctrl+i': 'import',    // 가져오기

    // 기타
    '?': 'help',           // 도움말
    'ctrl+/': 'shortcuts'  // 단축키 목록
};

/**
 * 단축키 설명
 */
export const SHORTCUT_DESCRIPTIONS = {
    '1': '문제 풀기 탭으로 이동',
    '2': '문제 등록 탭으로 이동',
    '3': '문제 목록 탭으로 이동',
    '4': '설정 탭으로 이동',
    'n': '다음 문제',
    'r': '퀴즈 재시작',
    'escape': '닫기/취소',
    'ctrl+s': '저장',
    'ctrl+n': '새 문제',
    'ctrl+e': '문제 내보내기',
    'ctrl+i': '문제 가져오기',
    '?': '도움말',
    'ctrl+/': '단축키 목록 보기'
};
