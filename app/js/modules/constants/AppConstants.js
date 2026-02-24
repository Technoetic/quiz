/**
 * AppConstants 클래스
 * 애플리케이션 전체에서 사용되는 상수 정의
 */

export class AppConstants {
    /**
     * 문제 유형
     */
    static QUESTION_TYPES = {
        MULTIPLE: 'multiple',
        SUBJECTIVE: 'subjective',
        SEQUENCE: 'sequence'
    };

    /**
     * 문제 유형 라벨
     */
    static QUESTION_TYPE_LABELS = {
        [AppConstants.QUESTION_TYPES.MULTIPLE]: '객관식',
        [AppConstants.QUESTION_TYPES.SUBJECTIVE]: '주관식',
        [AppConstants.QUESTION_TYPES.SEQUENCE]: '순서나열'
    };

    /**
     * 탭 이름
     */
    static TABS = {
        QUIZ: 'quiz',
        ADMIN: 'admin',
        LIST: 'list',
        SETTINGS: 'settings',
        EDIT: 'edit'
    };

    /**
     * 로컬 스토리지 키
     */
    static STORAGE_KEYS = {
        QUESTION_BANK: 'questionBank',
        ANSWERED_QUESTIONS: 'answeredQuestions',
        SETTINGS: 'quizAppSettings',
        ANALYTICS: 'analytics',
        SESSION: 'session',
        PROGRESS: 'progress',
        THEME: 'theme'
    };

    /**
     * 알림 타입
     */
    static NOTIFICATION_TYPES = {
        SUCCESS: 'success',
        ERROR: 'error',
        INFO: 'info',
        WARNING: 'warning'
    };

    /**
     * 세션 상태
     */
    static SESSION_STATES = {
        IDLE: 'idle',
        ACTIVE: 'active',
        PAUSED: 'paused',
        BREAK: 'break'
    };

    /**
     * 테마
     */
    static THEMES = {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto'
    };

    /**
     * 색상
     */
    static COLORS = {
        SUCCESS: '#4caf50',
        ERROR: '#f44336',
        WARNING: '#ff9800',
        INFO: '#2196f3',
        LIGHT_GRAY: '#f8f9fa'
    };

    /**
     * 애니메이션 지속 시간 (ms)
     */
    static ANIMATION_DURATIONS = {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
        MEDIUM: 800,
        VERY_SLOW: 2000
    };

    /**
     * 토스트 지속 시간 (ms)
     */
    static TOAST_DURATIONS = {
        SHORT: 2000,
        NORMAL: 3000,
        LONG: 5000
    };

    /**
     * 디바운스 딜레이 (ms)
     */
    static DEBOUNCE_DELAYS = {
        SEARCH: 300,
        RESIZE: 250,
        SCROLL: 150
    };

    /**
     * 객관식 옵션 개수
     */
    static MULTIPLE_CHOICE_OPTIONS_COUNT = 4;

    /**
     * 순서 나열 최소 항목 수
     */
    static SEQUENCE_MIN_ITEMS = 2;

    /**
     * 정답 확인 대기 시간 (ms)
     */
    static ANSWER_CHECK_DELAY = 500;

    /**
     * 세션 시간 (ms)
     */
    static SESSION_TIMES = {
        WORK: 25 * 60 * 1000,       // 25분
        BREAK: 5 * 60 * 1000,       // 5분
        LONG_BREAK: 15 * 60 * 1000  // 15분
    };

    /**
     * 긴 휴식까지 세션 수
     */
    static SESSIONS_UNTIL_LONG_BREAK = 4;

    /**
     * 콘페티 색상
     */
    static CONFETTI_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8', '#f7dc6f'];

    /**
     * 콘페티 개수
     */
    static CONFETTI_COUNT = 50;

    /**
     * Z-Index
     */
    static Z_INDEX = {
        CONFETTI: 9999
    };

    /**
     * 최대 표시 가능한 알림 수
     */
    static MAX_VISIBLE_NOTIFICATIONS = 3;

    /**
     * 최대 세션 기록 수
     */
    static MAX_SESSION_HISTORY = 100;

    /**
     * CSS 클래스
     */
    static CSS_CLASSES = {
        ACTIVE: 'active',
        HIDDEN: 'hidden',
        DISABLED: 'disabled',
        FADE_IN: 'fade-in',
        FADE_OUT: 'fade-out',
        FORM_TOGGLE: 'form-toggle',
        TAB_BTN: 'tab-btn',
        FILTER_BTN: 'filter-btn',
        SUBMIT_BTN: 'submit-btn',
        ANSWER_INPUT: 'answer-input',
        SUBMIT_BUTTON: 'submit-button',
        SEQUENCE_ANSWER: 'sequence-answer',
        SEQUENCE_OPTION: 'sequence-option',
        DRAGGING: 'dragging'
    };

    /**
     * DOM ID
     */
    static DOM_IDS = {
        // 탭
        TAB_QUIZ: 'tab-quiz',
        TAB_ADMIN: 'tab-admin',
        TAB_LIST: 'tab-list',
        TAB_SETTINGS: 'tab-settings',
        TAB_EDIT: 'tab-edit',

        // 섹션
        QUIZ_SECTION: 'quiz-section',
        ADMIN_SECTION: 'admin-section',
        LIST_SECTION: 'list-section',
        SETTINGS_SECTION: 'settings-section',
        EDIT_SECTION: 'edit-section',
        DELETED_SECTION: 'deleted-section',

        // 퀴즈
        QUESTION: 'question',
        QUESTION_CONTENT: 'question-content',
        RESULT: 'result',
        PROGRESS: 'progress',
        SUBJECT_DROPDOWN: 'subjectDropdown',

        // 객관식 폼
        MC_FORM: 'multipleChoiceForm',
        MC_SUBJECT: 'mcSubject',
        MC_QUESTION: 'mcQuestion',
        MC_CORRECT_ANSWER: 'mcCorrectAnswer',

        // 주관식 폼
        SUB_FORM: 'subjectiveForm',
        SUB_SUBJECT: 'subSubject',
        SUB_QUESTION: 'subQuestion',
        SUB_CORRECT_ANSWER: 'subCorrectAnswer',

        // 순서 나열 폼
        SEQ_FORM: 'sequenceForm',
        SEQ_SUBJECT: 'seqSubject',
        SEQ_QUESTION: 'seqQuestion',
        SEQ_ITEMS: 'sequenceItems',

        // 수정 폼
        EDIT_MC_FORM: 'editMultipleChoiceForm',
        EDIT_SUB_FORM: 'editSubjectiveForm',
        EDIT_SEQ_FORM: 'editSequenceForm',
        EDIT_SEQ_ITEMS: 'editSequenceItems',

        // 목록
        QUESTION_LIST: 'questionList',
        QUESTION_STATS: 'questionStats',

        // 설정
        API_KEY: 'apiKey',
        ENABLE_REPHRASE: 'enableRephrase',

        // 기타
        TOAST_CONTAINER: 'toast-container',
        LOADING_SPINNER: 'loading-spinner'
    };

    /**
     * 에러 메시지
     */
    static ERROR_MESSAGES = {
        REQUIRED_FIELDS: '모든 필수 필드를 입력해주세요.',
        INVALID_ANSWER: '올바른 정답을 입력해주세요.',
        INVALID_FILE: '올바른 파일 형식이 아닙니다.',
        IMPORT_FAILED: '데이터 가져오기에 실패했습니다.',
        EXPORT_FAILED: '데이터 내보내기에 실패했습니다.',
        STORAGE_FULL: '저장 공간이 부족합니다.',
        NETWORK_ERROR: '네트워크 오류가 발생했습니다.'
    };

    /**
     * 성공 메시지
     */
    static SUCCESS_MESSAGES = {
        QUESTION_ADDED: '문제가 등록되었습니다!',
        QUESTION_UPDATED: '문제가 수정되었습니다!',
        QUESTION_DELETED: '문제가 삭제되었습니다!',
        ALL_DELETED: '모든 문제가 삭제되었습니다.',
        SETTINGS_SAVED: '설정이 저장되었습니다.',
        DATA_IMPORTED: '데이터를 성공적으로 가져왔습니다.',
        DATA_EXPORTED: '데이터를 성공적으로 내보냈습니다.'
    };

    /**
     * 확인 메시지
     */
    static CONFIRM_MESSAGES = {
        DELETE_QUESTION: '정말로 이 문제를 삭제하시겠습니까?',
        DELETE_ALL: '정말로 모든 문제를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
        RESET_PROGRESS: '진행 상황을 초기화하시겠습니까?'
    };

    /**
     * UI 텍스트
     */
    static UI_TEXT = {
        SUBMIT_ANSWER: '정답 제출',
        ENTER_ANSWER: '답을 입력하세요'
    };

    /**
     * 파일 형식
     */
    static FILE_FORMATS = {
        JSON: 'json',
        CSV: 'csv',
        TXT: 'txt'
    };

    /**
     * MIME 타입
     */
    static MIME_TYPES = {
        JSON: 'application/json',
        CSV: 'text/csv;charset=utf-8',
        TXT: 'text/plain;charset=utf-8'
    };

    /**
     * 기본 파일명
     */
    static DEFAULT_FILENAMES = {
        QUESTIONS_JSON: 'questions.json',
        QUESTIONS_CSV: 'questions.csv',
        QUESTIONS_TXT: 'questions.txt',
        TEMPLATE_CSV: 'questions_template.csv'
    };
}

// Freeze 처리로 상수 불변성 보장
Object.freeze(AppConstants);
Object.freeze(AppConstants.QUESTION_TYPES);
Object.freeze(AppConstants.QUESTION_TYPE_LABELS);
Object.freeze(AppConstants.TABS);
Object.freeze(AppConstants.STORAGE_KEYS);
Object.freeze(AppConstants.NOTIFICATION_TYPES);
Object.freeze(AppConstants.SESSION_STATES);
Object.freeze(AppConstants.THEMES);
Object.freeze(AppConstants.COLORS);
Object.freeze(AppConstants.ANIMATION_DURATIONS);
Object.freeze(AppConstants.TOAST_DURATIONS);
Object.freeze(AppConstants.DEBOUNCE_DELAYS);
Object.freeze(AppConstants.SESSION_TIMES);
Object.freeze(AppConstants.CONFETTI_COLORS);
Object.freeze(AppConstants.Z_INDEX);
Object.freeze(AppConstants.CSS_CLASSES);
Object.freeze(AppConstants.DOM_IDS);
Object.freeze(AppConstants.ERROR_MESSAGES);
Object.freeze(AppConstants.SUCCESS_MESSAGES);
Object.freeze(AppConstants.CONFIRM_MESSAGES);
Object.freeze(AppConstants.FILE_FORMATS);
Object.freeze(AppConstants.MIME_TYPES);
Object.freeze(AppConstants.DEFAULT_FILENAMES);
