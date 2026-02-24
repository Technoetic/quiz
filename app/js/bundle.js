var QuizApp = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // app/js/main.js
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default
  });

  // app/js/modules/constants/AppConstants.js
  var AppConstants = class _AppConstants {
    /**
     * 문제 유형
     */
    static QUESTION_TYPES = {
      MULTIPLE: "multiple",
      SUBJECTIVE: "subjective",
      SEQUENCE: "sequence"
    };
    /**
     * 문제 유형 라벨
     */
    static QUESTION_TYPE_LABELS = {
      [_AppConstants.QUESTION_TYPES.MULTIPLE]: "\uAC1D\uAD00\uC2DD",
      [_AppConstants.QUESTION_TYPES.SUBJECTIVE]: "\uC8FC\uAD00\uC2DD",
      [_AppConstants.QUESTION_TYPES.SEQUENCE]: "\uC21C\uC11C\uB098\uC5F4"
    };
    /**
     * 탭 이름
     */
    static TABS = {
      QUIZ: "quiz",
      ADMIN: "admin",
      LIST: "list",
      SETTINGS: "settings",
      EDIT: "edit"
    };
    /**
     * 로컬 스토리지 키
     */
    static STORAGE_KEYS = {
      QUESTION_BANK: "questionBank",
      ANSWERED_QUESTIONS: "answeredQuestions",
      SETTINGS: "quizAppSettings",
      ANALYTICS: "analytics",
      SESSION: "session",
      PROGRESS: "progress",
      THEME: "theme"
    };
    /**
     * 알림 타입
     */
    static NOTIFICATION_TYPES = {
      SUCCESS: "success",
      ERROR: "error",
      INFO: "info",
      WARNING: "warning"
    };
    /**
     * 세션 상태
     */
    static SESSION_STATES = {
      IDLE: "idle",
      ACTIVE: "active",
      PAUSED: "paused",
      BREAK: "break"
    };
    /**
     * 테마
     */
    static THEMES = {
      LIGHT: "light",
      DARK: "dark",
      AUTO: "auto"
    };
    /**
     * 색상
     */
    static COLORS = {
      SUCCESS: "#4caf50",
      ERROR: "#f44336",
      WARNING: "#ff9800",
      INFO: "#2196f3",
      LIGHT_GRAY: "#f8f9fa"
    };
    /**
     * 애니메이션 지속 시간 (ms)
     */
    static ANIMATION_DURATIONS = {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
      MEDIUM: 800,
      VERY_SLOW: 2e3
    };
    /**
     * 토스트 지속 시간 (ms)
     */
    static TOAST_DURATIONS = {
      SHORT: 2e3,
      NORMAL: 3e3,
      LONG: 5e3
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
      WORK: 25 * 60 * 1e3,
      // 25분
      BREAK: 5 * 60 * 1e3,
      // 5분
      LONG_BREAK: 15 * 60 * 1e3
      // 15분
    };
    /**
     * 긴 휴식까지 세션 수
     */
    static SESSIONS_UNTIL_LONG_BREAK = 4;
    /**
     * 콘페티 색상
     */
    static CONFETTI_COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#ffa07a", "#98d8c8", "#f7dc6f"];
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
      ACTIVE: "active",
      HIDDEN: "hidden",
      DISABLED: "disabled",
      FADE_IN: "fade-in",
      FADE_OUT: "fade-out",
      FORM_TOGGLE: "form-toggle",
      TAB_BTN: "tab-btn",
      FILTER_BTN: "filter-btn",
      SUBMIT_BTN: "submit-btn",
      ANSWER_INPUT: "answer-input",
      SUBMIT_BUTTON: "submit-button",
      SEQUENCE_ANSWER: "sequence-answer",
      SEQUENCE_OPTION: "sequence-option",
      DRAGGING: "dragging"
    };
    /**
     * DOM ID
     */
    static DOM_IDS = {
      // 탭
      TAB_QUIZ: "tab-quiz",
      TAB_ADMIN: "tab-admin",
      TAB_LIST: "tab-list",
      TAB_SETTINGS: "tab-settings",
      TAB_EDIT: "tab-edit",
      // 섹션
      QUIZ_SECTION: "quiz-section",
      ADMIN_SECTION: "admin-section",
      LIST_SECTION: "list-section",
      SETTINGS_SECTION: "settings-section",
      EDIT_SECTION: "edit-section",
      DELETED_SECTION: "deleted-section",
      // 퀴즈
      QUESTION: "question",
      QUESTION_CONTENT: "question-content",
      RESULT: "result",
      PROGRESS: "progress",
      SUBJECT_DROPDOWN: "subjectDropdown",
      // 객관식 폼
      MC_FORM: "multipleChoiceForm",
      MC_SUBJECT: "mcSubject",
      MC_QUESTION: "mcQuestion",
      MC_CORRECT_ANSWER: "mcCorrectAnswer",
      // 주관식 폼
      SUB_FORM: "subjectiveForm",
      SUB_SUBJECT: "subSubject",
      SUB_QUESTION: "subQuestion",
      SUB_CORRECT_ANSWER: "subCorrectAnswer",
      // 순서 나열 폼
      SEQ_FORM: "sequenceForm",
      SEQ_SUBJECT: "seqSubject",
      SEQ_QUESTION: "seqQuestion",
      SEQ_ITEMS: "sequenceItems",
      // 수정 폼
      EDIT_MC_FORM: "editMultipleChoiceForm",
      EDIT_SUB_FORM: "editSubjectiveForm",
      EDIT_SEQ_FORM: "editSequenceForm",
      EDIT_SEQ_ITEMS: "editSequenceItems",
      // 목록
      QUESTION_LIST: "questionList",
      QUESTION_STATS: "questionStats",
      // 설정
      API_KEY: "apiKey",
      ENABLE_REPHRASE: "enableRephrase",
      // 기타
      TOAST_CONTAINER: "toast-container",
      LOADING_SPINNER: "loading-spinner"
    };
    /**
     * 에러 메시지
     */
    static ERROR_MESSAGES = {
      REQUIRED_FIELDS: "\uBAA8\uB4E0 \uD544\uC218 \uD544\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.",
      INVALID_ANSWER: "\uC62C\uBC14\uB978 \uC815\uB2F5\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
      INVALID_FILE: "\uC62C\uBC14\uB978 \uD30C\uC77C \uD615\uC2DD\uC774 \uC544\uB2D9\uB2C8\uB2E4.",
      IMPORT_FAILED: "\uB370\uC774\uD130 \uAC00\uC838\uC624\uAE30\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
      EXPORT_FAILED: "\uB370\uC774\uD130 \uB0B4\uBCF4\uB0B4\uAE30\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
      STORAGE_FULL: "\uC800\uC7A5 \uACF5\uAC04\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4.",
      NETWORK_ERROR: "\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4."
    };
    /**
     * 성공 메시지
     */
    static SUCCESS_MESSAGES = {
      QUESTION_ADDED: "\uBB38\uC81C\uAC00 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4!",
      QUESTION_UPDATED: "\uBB38\uC81C\uAC00 \uC218\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4!",
      QUESTION_DELETED: "\uBB38\uC81C\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4!",
      ALL_DELETED: "\uBAA8\uB4E0 \uBB38\uC81C\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      SETTINGS_SAVED: "\uC124\uC815\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      DATA_IMPORTED: "\uB370\uC774\uD130\uB97C \uC131\uACF5\uC801\uC73C\uB85C \uAC00\uC838\uC654\uC2B5\uB2C8\uB2E4.",
      DATA_EXPORTED: "\uB370\uC774\uD130\uB97C \uC131\uACF5\uC801\uC73C\uB85C \uB0B4\uBCF4\uB0C8\uC2B5\uB2C8\uB2E4."
    };
    /**
     * 확인 메시지
     */
    static CONFIRM_MESSAGES = {
      DELETE_QUESTION: "\uC815\uB9D0\uB85C \uC774 \uBB38\uC81C\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?",
      DELETE_ALL: "\uC815\uB9D0\uB85C \uBAA8\uB4E0 \uBB38\uC81C\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?\n\uC774 \uC791\uC5C5\uC740 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
      RESET_PROGRESS: "\uC9C4\uD589 \uC0C1\uD669\uC744 \uCD08\uAE30\uD654\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?"
    };
    /**
     * UI 텍스트
     */
    static UI_TEXT = {
      SUBMIT_ANSWER: "\uC815\uB2F5 \uC81C\uCD9C",
      ENTER_ANSWER: "\uB2F5\uC744 \uC785\uB825\uD558\uC138\uC694"
    };
    /**
     * 파일 형식
     */
    static FILE_FORMATS = {
      JSON: "json",
      CSV: "csv",
      TXT: "txt"
    };
    /**
     * MIME 타입
     */
    static MIME_TYPES = {
      JSON: "application/json",
      CSV: "text/csv;charset=utf-8",
      TXT: "text/plain;charset=utf-8"
    };
    /**
     * 기본 파일명
     */
    static DEFAULT_FILENAMES = {
      QUESTIONS_JSON: "questions.json",
      QUESTIONS_CSV: "questions.csv",
      QUESTIONS_TXT: "questions.txt",
      TEMPLATE_CSV: "questions_template.csv"
    };
  };
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

  // app/js/modules/Question.js
  var Question = class {
    /**
     * @param {Object} data - 문제 데이터
     * @param {string} data.type - 문제 유형 ('multiple', 'subjective', 'sequence')
     * @param {string} data.subject - 과목명
     * @param {string} data.question - 문제 내용
     * @param {number} data.index - 문제 인덱스
     */
    constructor(data) {
      this.id = data.id;
      this.type = data.type;
      this.subject = data.subject;
      this.question = data.question;
      this.index = data.index;
      if (this.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
        this.options = data.options;
        this.correctAnswer = data.correctAnswer;
      } else if (this.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
        this.correctAnswer = data.correctAnswer;
        this.alternativeAnswers = data.alternativeAnswers || [];
      } else if (this.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
        this.correctOrder = data.correctOrder;
      }
      this.deleted = data.deleted || false;
    }
    /**
     * JSON 직렬화
     * @returns {Object} JSON 객체
     */
    toJSON() {
      const base = {
        type: this.type,
        subject: this.subject,
        question: this.question
      };
      if (this.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
        return { ...base, options: this.options, correctAnswer: this.correctAnswer };
      } else if (this.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
        return { ...base, correctAnswer: this.correctAnswer, alternativeAnswers: this.alternativeAnswers };
      } else if (this.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
        return { ...base, correctOrder: this.correctOrder };
      }
      return base;
    }
    /**
     * 사용자 답변 확인
     * @param {*} userAnswer - 사용자 답변
     * @returns {boolean} 정답 여부
     */
    checkAnswer(userAnswer) {
      if (this.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
        return userAnswer === true;
      } else if (this.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
        const normalized = userAnswer.trim().toLowerCase();
        return normalized === this.correctAnswer.trim().toLowerCase() || this.alternativeAnswers.some((alt) => normalized === alt.trim().toLowerCase());
      } else if (this.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
        return JSON.stringify(userAnswer) === JSON.stringify(this.correctOrder);
      }
      return false;
    }
  };

  // app/js/modules/SupabaseQuestionBank.js
  var SUPABASE_URL = "https://dxaehcocrbvhatyfmrvp.supabase.co";
  var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YWVoY29jcmJ2aGF0eWZtcnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDAwMTcsImV4cCI6MjA4NzUxNjAxN30.pkeDachOuRpjJX1KCUvMtEY2sio2kSq5hbhH5pPp75U";
  var SupabaseQuestionBank = class {
    constructor() {
      this.questions = [];
      this.baseUrl = `${SUPABASE_URL}/rest/v1/questions`;
      this.headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      };
    }
    async init() {
      console.log("Supabase QuestionBank \uCD08\uAE30\uD654...");
      await this.loadQuestions();
      console.log("Supabase QuestionBank \uCD08\uAE30\uD654 \uC644\uB8CC");
    }
    async loadQuestions() {
      try {
        const res = await fetch(`${this.baseUrl}?order=id.asc`, {
          headers: this.headers
        });
        if (!res.ok) throw new Error(`\uB85C\uB4DC \uC2E4\uD328: ${res.status}`);
        const rows = await res.json();
        this.questions = rows.map((row, index) => new Question({
          id: row.id,
          type: row.type,
          subject: row.subject,
          question: row.question,
          options: row.options || null,
          correctAnswer: row.correct_answer || null,
          correctOrder: row.correct_order || null,
          deleted: row.deleted || false,
          index
        }));
        console.log(`${this.questions.length}\uAC1C \uBB38\uC81C \uB85C\uB4DC \uC644\uB8CC`);
      } catch (error) {
        console.error("\uBB38\uC81C \uB85C\uB4DC \uC2E4\uD328:", error);
        this.questions = [];
      }
    }
    async add(questionData) {
      try {
        const res = await fetch(this.baseUrl, {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({
            type: questionData.type,
            subject: questionData.subject,
            question: questionData.question,
            options: questionData.options || null,
            correct_answer: questionData.correctAnswer || null,
            correct_order: questionData.correctOrder || null,
            deleted: false
          })
        });
        if (!res.ok) throw new Error(`\uCD94\uAC00 \uC2E4\uD328: ${res.status}`);
        await this.loadQuestions();
        console.log("\uBB38\uC81C \uCD94\uAC00 \uC644\uB8CC");
        return this.questions[this.questions.length - 1];
      } catch (error) {
        console.error("\uBB38\uC81C \uCD94\uAC00 \uC2E4\uD328:", error);
        throw error;
      }
    }
    async update(index, questionData) {
      const question = this.questions[index];
      if (!question) return false;
      try {
        const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
          method: "PATCH",
          headers: this.headers,
          body: JSON.stringify({
            type: questionData.type,
            subject: questionData.subject,
            question: questionData.question,
            options: questionData.options || null,
            correct_answer: questionData.correctAnswer || null,
            correct_order: questionData.correctOrder || null
          })
        });
        if (!res.ok) throw new Error(`\uC218\uC815 \uC2E4\uD328: ${res.status}`);
        await this.loadQuestions();
        console.log("\uBB38\uC81C \uC218\uC815 \uC644\uB8CC");
        return true;
      } catch (error) {
        console.error("\uBB38\uC81C \uC218\uC815 \uC2E4\uD328:", error);
        return false;
      }
    }
    async delete(index) {
      const question = this.questions[index];
      if (!question) return false;
      try {
        const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
          method: "PATCH",
          headers: this.headers,
          body: JSON.stringify({ deleted: true })
        });
        if (!res.ok) throw new Error(`\uC0AD\uC81C \uC2E4\uD328: ${res.status}`);
        await this.loadQuestions();
        return true;
      } catch (error) {
        console.error("\uBB38\uC81C \uC0AD\uC81C \uC2E4\uD328:", error);
        return false;
      }
    }
    async restore(index) {
      const question = this.questions[index];
      if (!question) return false;
      try {
        const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
          method: "PATCH",
          headers: this.headers,
          body: JSON.stringify({ deleted: false })
        });
        if (!res.ok) throw new Error(`\uBCF5\uC6D0 \uC2E4\uD328: ${res.status}`);
        await this.loadQuestions();
        return true;
      } catch (error) {
        console.error("\uBB38\uC81C \uBCF5\uC6D0 \uC2E4\uD328:", error);
        return false;
      }
    }
    async permanentDelete(index) {
      const question = this.questions[index];
      if (!question) return false;
      try {
        const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
          method: "DELETE",
          headers: this.headers
        });
        if (!res.ok) throw new Error(`\uC601\uAD6C \uC0AD\uC81C \uC2E4\uD328: ${res.status}`);
        await this.loadQuestions();
        return true;
      } catch (error) {
        console.error("\uBB38\uC81C \uC601\uAD6C \uC0AD\uC81C \uC2E4\uD328:", error);
        return false;
      }
    }
    async deleteAllQuestions() {
      try {
        const res = await fetch(`${this.baseUrl}?deleted=eq.false`, {
          method: "PATCH",
          headers: this.headers,
          body: JSON.stringify({ deleted: true })
        });
        if (!res.ok) throw new Error(`\uC804\uCCB4 \uC0AD\uC81C \uC2E4\uD328: ${res.status}`);
        await this.loadQuestions();
        return true;
      } catch (error) {
        console.error("\uC804\uCCB4 \uC0AD\uC81C \uC2E4\uD328:", error);
        return false;
      }
    }
    getAll() {
      return this.questions.filter((q) => !q.deleted);
    }
    getDeleted() {
      return this.questions.filter((q) => q.deleted);
    }
    getBySubject(subject) {
      return this.questions.filter((q) => !q.deleted && q.subject === subject);
    }
    getByType(type) {
      return this.questions.filter((q) => !q.deleted && q.type === type);
    }
    getStats() {
      const all = this.getAll();
      return {
        total: all.length,
        multiple: all.filter((q) => q.type === AppConstants.QUESTION_TYPES.MULTIPLE).length,
        subjective: all.filter((q) => q.type === AppConstants.QUESTION_TYPES.SUBJECTIVE).length,
        sequence: all.filter((q) => q.type === AppConstants.QUESTION_TYPES.SEQUENCE).length,
        deleted: this.getDeleted().length
      };
    }
    async downloadBackup() {
      const all = this.questions;
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "questions-backup.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // app/js/modules/utils/DOMCache.js
  var DOMCache = class {
    constructor() {
      this.cache = /* @__PURE__ */ new Map();
      this.initialized = false;
    }
    /**
     * 모든 주요 DOM 요소 캐싱
     */
    init() {
      if (this.initialized) return;
      this.set("tabQuiz", AppConstants.DOM_IDS.TAB_QUIZ);
      this.set("tabAdmin", AppConstants.DOM_IDS.TAB_ADMIN);
      this.set("tabList", AppConstants.DOM_IDS.TAB_LIST);
      this.set("tabDeleted", "tab-deleted");
      this.set("tabSettings", AppConstants.DOM_IDS.TAB_SETTINGS);
      this.set("tabEdit", AppConstants.DOM_IDS.TAB_EDIT);
      this.set("quizSection", AppConstants.DOM_IDS.QUIZ_SECTION);
      this.set("adminSection", AppConstants.DOM_IDS.ADMIN_SECTION);
      this.set("listSection", AppConstants.DOM_IDS.LIST_SECTION);
      this.set("settingsSection", AppConstants.DOM_IDS.SETTINGS_SECTION);
      this.set("editSection", AppConstants.DOM_IDS.EDIT_SECTION);
      this.set("deletedSection", AppConstants.DOM_IDS.DELETED_SECTION);
      this.set("question", AppConstants.DOM_IDS.QUESTION);
      this.set("questionContent", AppConstants.DOM_IDS.QUESTION_CONTENT);
      this.set("result", AppConstants.DOM_IDS.RESULT);
      this.set("progress", AppConstants.DOM_IDS.PROGRESS);
      this.set("subjectDropdown", AppConstants.DOM_IDS.SUBJECT_DROPDOWN);
      this.set("mcForm", AppConstants.DOM_IDS.MC_FORM);
      this.set("mcSubject", AppConstants.DOM_IDS.MC_SUBJECT);
      this.set("mcQuestion", AppConstants.DOM_IDS.MC_QUESTION);
      this.set("mcCorrectAnswer", AppConstants.DOM_IDS.MC_CORRECT_ANSWER);
      this.set("subForm", AppConstants.DOM_IDS.SUB_FORM);
      this.set("subSubject", AppConstants.DOM_IDS.SUB_SUBJECT);
      this.set("subQuestion", AppConstants.DOM_IDS.SUB_QUESTION);
      this.set("subCorrectAnswer", AppConstants.DOM_IDS.SUB_CORRECT_ANSWER);
      this.set("seqForm", AppConstants.DOM_IDS.SEQ_FORM);
      this.set("seqSubject", AppConstants.DOM_IDS.SEQ_SUBJECT);
      this.set("seqQuestion", AppConstants.DOM_IDS.SEQ_QUESTION);
      this.set("seqItems", AppConstants.DOM_IDS.SEQ_ITEMS);
      this.set("editMcForm", AppConstants.DOM_IDS.EDIT_MC_FORM);
      this.set("editSubForm", AppConstants.DOM_IDS.EDIT_SUB_FORM);
      this.set("editSeqForm", AppConstants.DOM_IDS.EDIT_SEQ_FORM);
      this.set("editSeqItems", AppConstants.DOM_IDS.EDIT_SEQ_ITEMS);
      this.set("questionList", AppConstants.DOM_IDS.QUESTION_LIST);
      this.set("questionStats", AppConstants.DOM_IDS.QUESTION_STATS);
      this.set("apiKey", AppConstants.DOM_IDS.API_KEY);
      this.set("enableRephrase", AppConstants.DOM_IDS.ENABLE_REPHRASE);
      this.set("toastContainer", AppConstants.DOM_IDS.TOAST_CONTAINER);
      this.set("loadingSpinner", AppConstants.DOM_IDS.LOADING_SPINNER);
      this.setByQuery("progressFill", ".progress-fill");
      this.setByQuery("progressText", ".progress-text");
      this.setByQuery("resultIcon", ".result-icon");
      this.setByQuery("resultText", ".result-text");
      this.initialized = true;
    }
    /**
     * ID로 요소 캐싱
     * @param {string} key - 캐시 키
     * @param {string} id - DOM ID
     */
    set(key, id) {
      const element = document.getElementById(id);
      if (element) {
        this.cache.set(key, element);
      }
    }
    /**
     * querySelector로 요소 캐싱
     * @param {string} key - 캐시 키
     * @param {string} selector - CSS 선택자
     */
    setByQuery(key, selector) {
      const element = document.querySelector(selector);
      if (element) {
        this.cache.set(key, element);
      }
    }
    /**
     * querySelectorAll로 요소 캐싱
     * @param {string} key - 캐시 키
     * @param {string} selector - CSS 선택자
     */
    setAllByQuery(key, selector) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        this.cache.set(key, Array.from(elements));
      }
    }
    /**
     * 캐시된 요소 가져오기
     * @param {string} key - 캐시 키
     * @returns {HTMLElement|null} DOM 요소
     */
    get(key) {
      return this.cache.get(key) || null;
    }
    /**
     * 캐시 존재 확인
     * @param {string} key - 캐시 키
     * @returns {boolean} 존재 여부
     */
    has(key) {
      return this.cache.has(key);
    }
    /**
     * 특정 캐시 삭제
     * @param {string} key - 캐시 키
     */
    remove(key) {
      this.cache.delete(key);
    }
    /**
     * 모든 캐시 초기화
     */
    clear() {
      this.cache.clear();
      this.initialized = false;
    }
    /**
     * 캐시된 요소 개수
     * @returns {number} 개수
     */
    size() {
      return this.cache.size;
    }
    /**
     * 캐시 키 목록
     * @returns {Array<string>} 키 배열
     */
    keys() {
      return Array.from(this.cache.keys());
    }
    /**
     * 옵션 요소 가져오기 (객관식)
     * @param {number} index - 옵션 인덱스 (1-4)
     * @returns {HTMLElement|null} 옵션 요소
     */
    getOption(index) {
      const key = `option${index}`;
      if (!this.has(key)) {
        this.set(key, key);
      }
      return this.get(key);
    }
    /**
     * 수정 폼 옵션 요소 가져오기
     * @param {number} index - 옵션 인덱스 (1-4)
     * @returns {HTMLElement|null} 옵션 요소
     */
    getEditOption(index) {
      const key = `editOption${index}`;
      if (!this.has(key)) {
        this.set(key, key);
      }
      return this.get(key);
    }
    /**
     * 통계 요소 가져오기
     * @param {string} type - 통계 타입 ('all', 'multiple', 'subjective', 'sequence')
     * @returns {HTMLElement|null} 통계 요소
     */
    getStat(type) {
      const key = `stat${type.charAt(0).toUpperCase()}${type.slice(1)}`;
      if (!this.has(key)) {
        this.set(key, key);
      }
      return this.get(key);
    }
    /**
     * 동적 요소 새로고침
     * 동적으로 생성되는 요소는 필요 시 재캐싱
     * @param {string} key - 캐시 키
     * @param {string} idOrSelector - ID 또는 선택자
     * @param {boolean} useQuery - querySelector 사용 여부
     */
    refresh(key, idOrSelector, useQuery = false) {
      this.remove(key);
      if (useQuery) {
        this.setByQuery(key, idOrSelector);
      } else {
        this.set(key, idOrSelector);
      }
    }
  };
  var domCache = new DOMCache();

  // app/js/modules/ToastNotification.js
  var ToastNotification = class {
    /**
     * @param {string} containerId - Toast 컨테이너 요소의 ID
     */
    constructor(containerId = AppConstants.DOM_IDS.TOAST_CONTAINER) {
      this.container = domCache.get("toastContainer") || document.getElementById(containerId);
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
        this.container.classList.remove("show");
      }, duration);
    }
  };

  // app/js/modules/LoadingIndicator.js
  var LoadingIndicator = class {
    /**
     * @param {string} spinnerId - 로딩 스피너 요소의 ID
     */
    constructor(spinnerId = AppConstants.DOM_IDS.LOADING_SPINNER) {
      this.spinner = domCache.get("loadingSpinner") || document.getElementById(spinnerId);
    }
    /**
     * 로딩 스피너 표시
     */
    show() {
      if (this.spinner) this.spinner.style.display = "flex";
    }
    /**
     * 로딩 스피너 숨기기
     */
    hide() {
      if (this.spinner) this.spinner.style.display = "none";
    }
  };

  // app/js/modules/FeedbackUI.js
  var FeedbackUI = class {
    /**
     * @param {HTMLElement} resultElement - 결과 표시 요소
     */
    constructor(resultElement) {
      this.resultElement = resultElement;
      this.iconElement = resultElement.querySelector(".result-icon");
      this.textElement = resultElement.querySelector(".result-text");
    }
    /**
     * 정답/오답 피드백 표시
     * @param {boolean} isCorrect - 정답 여부
     * @param {string} message - 표시할 메시지 (선택사항)
     */
    show(isCorrect, message = null) {
      this.resultElement.className = `result ${isCorrect ? "result-correct" : "result-wrong"} show`;
      if (this.iconElement) {
        this.iconElement.innerHTML = isCorrect ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
      }
      if (this.textElement) {
        this.textElement.textContent = message || (isCorrect ? "\uC815\uB2F5\uC785\uB2C8\uB2E4!" : "\uC624\uB2F5\uC785\uB2C8\uB2E4");
      }
    }
    /**
     * 힌트 표시
     * @param {string} hintText - 힌트 텍스트
     */
    showHint(hintText) {
      if (this.iconElement) {
        this.iconElement.innerHTML = '<i class="fas fa-lightbulb"></i>';
      }
      if (this.textElement) {
        this.textElement.textContent = hintText;
      }
    }
    /**
     * 피드백 숨기기
     */
    hide() {
      this.resultElement.className = "result";
      if (this.iconElement) this.iconElement.innerHTML = "";
      if (this.textElement) this.textElement.textContent = "";
    }
    /**
     * 정답 옵션 강조 (객관식용)
     * @param {number} correctIndex - 정답 옵션 인덱스
     */
    highlightCorrectOption(correctIndex) {
      const questionContent = domCache.get("questionContent");
      if (!questionContent) return;
      const optionButtons = questionContent.querySelectorAll("button");
      optionButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctIndex) {
          btn.style.border = `3px solid ${AppConstants.COLORS.INFO}`;
          btn.style.backgroundColor = AppConstants.COLORS.INFO_LIGHT;
        }
      });
    }
    /**
     * 옵션 스타일 초기화
     */
    resetOptions() {
      const questionContent = domCache.get("questionContent");
      if (!questionContent) return;
      const optionButtons = questionContent.querySelectorAll("button");
      optionButtons.forEach((btn) => {
        btn.disabled = false;
        btn.style.border = "";
        btn.style.backgroundColor = "";
      });
    }
  };

  // app/js/modules/utils.js
  var Utils = class _Utils {
    /**
     * HTML 이스케이프 처리
     * @param {string} text - 이스케이프할 텍스트
     * @returns {string} 이스케이프 처리된 HTML
     */
    static escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
    /**
     * 배열 섞기 (Fisher-Yates 알고리즘)
     * @param {Array} array - 섞을 배열
     * @returns {Array} 섞인 배열의 복사본
     */
    static shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    /**
     * 텍스트 너비 측정
     * @param {string} text - 측정할 텍스트
     * @param {string} font - 폰트 스타일
     * @returns {number} 텍스트 너비 (픽셀)
     */
    static getTextWidth(text, font) {
      const canvas = _Utils.getTextWidth.canvas || (_Utils.getTextWidth.canvas = document.createElement("canvas"));
      const context = canvas.getContext("2d");
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    }
    /**
     * Debounce 함수
     * 연속된 호출을 지연시키고 마지막 호출만 실행
     * @param {Function} func - 실행할 함수
     * @param {number} delay - 지연 시간 (ms)
     * @returns {Function} Debounced 함수
     */
    static debounce(func, delay = 300) {
      let timeoutId;
      return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(context, args);
        }, delay);
      };
    }
    /**
     * Throttle 함수
     * 일정 시간 간격으로만 함수 실행
     * @param {Function} func - 실행할 함수
     * @param {number} limit - 실행 간격 (ms)
     * @returns {Function} Throttled 함수
     */
    static throttle(func, limit = 300) {
      let inThrottle;
      return function(...args) {
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
    /**
     * 딥 클론
     * 객체를 깊은 복사
     * @param {any} obj - 복사할 객체
     * @returns {any} 복사된 객체
     */
    static deepClone(obj) {
      if (obj === null || typeof obj !== "object") return obj;
      if (obj instanceof Date) return new Date(obj);
      if (obj instanceof Array) return obj.map((item) => _Utils.deepClone(item));
      if (obj instanceof Object) {
        const cloned = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            cloned[key] = _Utils.deepClone(obj[key]);
          }
        }
        return cloned;
      }
    }
    /**
     * 숫자 포맷팅
     * @param {number} num - 숫자
     * @param {number} decimals - 소수점 자릿수
     * @returns {string} 포맷된 문자열
     */
    static formatNumber(num, decimals = 0) {
      return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    /**
     * 시간 포맷팅 (ms -> MM:SS)
     * @param {number} ms - 밀리초
     * @returns {string} MM:SS 형식
     */
    static formatTime(ms) {
      const totalSeconds = Math.ceil(ms / 1e3);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    /**
     * 랜덤 ID 생성
     * @param {number} length - ID 길이
     * @returns {string} 랜덤 ID
     */
    static generateId(length = 8) {
      return Math.random().toString(36).substring(2, 2 + length);
    }
    /**
     * 배열 청크 분할
     * @param {Array} array - 배열
     * @param {number} size - 청크 크기
     * @returns {Array} 분할된 배열
     */
    static chunk(array, size) {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }
    /**
     * 배열 중복 제거
     * @param {Array} array - 배열
     * @param {string} key - 중복 체크할 키 (객체 배열인 경우)
     * @returns {Array} 중복 제거된 배열
     */
    static unique(array, key = null) {
      if (!key) {
        return [...new Set(array)];
      }
      const seen = /* @__PURE__ */ new Set();
      return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
    }
  };

  // app/js/modules/renderers/MultipleChoiceRenderer.js
  var MultipleChoiceRenderer = class {
    /**
     * 객관식 문제 렌더링
     * @param {Question} question - 문제 객체
     * @param {HTMLElement} container - 렌더링할 컨테이너
     * @param {Function} onAnswerSelected - 답변 선택 시 콜백
     */
    render(question, container, onAnswerSelected) {
      const numberCircles = ["\u2460", "\u2461", "\u2462", "\u2463"];
      const shuffledOptions = Utils.shuffleArray(
        question.options.map((text, index) => ({
          text,
          isCorrect: index === Number(question.correctAnswer)
        }))
      );
      const optionsContainer = document.createElement("div");
      optionsContainer.className = "options";
      shuffledOptions.forEach((option, index) => {
        const button = this.createOptionButton(
          option,
          index,
          numberCircles[index],
          onAnswerSelected
        );
        optionsContainer.appendChild(button);
      });
      container.appendChild(optionsContainer);
    }
    /**
     * 옵션 버튼 생성
     * @param {Object} option - 옵션 객체
     * @param {number} index - 옵션 인덱스
     * @param {string} numberCircle - 번호 표시
     * @param {Function} onAnswerSelected - 콜백 함수
     * @returns {HTMLElement} 버튼 요소
     */
    createOptionButton(option, index, numberCircle, onAnswerSelected) {
      const button = document.createElement("button");
      const textSpan = document.createElement("span");
      textSpan.textContent = `${numberCircle} ${Utils.escapeHtml(option.text)}`;
      button.appendChild(textSpan);
      const successColor = "#4caf50";
      const lightGrayColor = "#f8f9fa";
      const fastDuration = AppConstants.ANIMATION_DURATIONS.FAST;
      button.onclick = () => {
        if (!button.disabled) {
          button.style.backgroundColor = successColor;
          setTimeout(() => {
            button.style.backgroundColor = lightGrayColor;
            onAnswerSelected(option.isCorrect);
          }, fastDuration);
        }
      };
      return button;
    }
  };

  // app/js/modules/renderers/SubjectiveRenderer.js
  var SubjectiveRenderer = class {
    /**
     * 주관식 문제 렌더링
     * @param {Question} question - 문제 객체
     * @param {HTMLElement} container - 렌더링할 컨테이너
     * @param {Function} onAnswerSubmitted - 답변 제출 시 콜백
     */
    render(question, container, onAnswerSubmitted) {
      const input = this.createInput();
      const submitButton = this.createSubmitButton(input, question, onAnswerSubmitted);
      container.appendChild(input);
      container.appendChild(submitButton);
      input.focus();
    }
    /**
     * 입력 필드 생성
     * @returns {HTMLInputElement} 입력 요소
     */
    createInput() {
      const input = document.createElement("input");
      input.type = "text";
      input.className = AppConstants.CSS_CLASSES.ANSWER_INPUT;
      input.placeholder = AppConstants.UI_TEXT.ENTER_ANSWER;
      return input;
    }
    /**
     * 제출 버튼 생성
     * @param {HTMLInputElement} input - 입력 요소
     * @param {Question} question - 문제 객체
     * @param {Function} onAnswerSubmitted - 콜백 함수
     * @returns {HTMLButtonElement} 버튼 요소
     */
    createSubmitButton(input, question, onAnswerSubmitted) {
      const submitButton = document.createElement("button");
      submitButton.textContent = AppConstants.UI_TEXT.SUBMIT_ANSWER;
      submitButton.className = AppConstants.CSS_CLASSES.SUBMIT_BUTTON;
      const handleSubmit = () => {
        const userAnswer = input.value.trim();
        if (!userAnswer) {
          onAnswerSubmitted(null);
          return;
        }
        onAnswerSubmitted(question.checkAnswer(userAnswer));
      };
      submitButton.onclick = handleSubmit;
      input.onkeypress = (e) => {
        if (e.key === "Enter") handleSubmit();
      };
      return submitButton;
    }
  };

  // app/js/modules/renderers/SequenceRenderer.js
  var SequenceRenderer = class {
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
      const container = document.createElement("div");
      container.className = AppConstants.CSS_CLASSES.SEQUENCE_ANSWER;
      const shuffledOrder = Utils.shuffleArray([...question.correctOrder]);
      shuffledOrder.forEach((item, index) => {
        const div = this.createDraggableItem(item, index);
        container.appendChild(div);
      });
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
      const div = document.createElement("div");
      div.className = AppConstants.CSS_CLASSES.SEQUENCE_OPTION;
      div.draggable = true;
      div.textContent = text;
      div.dataset.index = index;
      div.ondragstart = (e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", div.innerHTML);
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
          return { offset, element: child };
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
      const submitButton = document.createElement("button");
      submitButton.textContent = AppConstants.UI_TEXT.SUBMIT_ANSWER;
      submitButton.className = AppConstants.CSS_CLASSES.SUBMIT_BUTTON;
      submitButton.onclick = () => {
        const currentOrder = Array.from(sequenceContainer.children).map((item) => item.textContent);
        onAnswerSubmitted(question.checkAnswer(currentOrder));
      };
      return submitButton;
    }
  };

  // app/js/modules/ProgressTracker.js
  var ProgressTracker = class {
    /**
     * @param {HTMLElement} progressFill - 진행 바 채우기 요소
     * @param {HTMLElement} progressText - 진행 텍스트 요소
     */
    constructor(progressFill, progressText) {
      this.progressFill = progressFill;
      this.progressText = progressText;
      this.answeredQuestions = /* @__PURE__ */ new Set();
      this.loadFromStorage();
    }
    /**
     * LocalStorage에서 진행 상황 로드
     */
    loadFromStorage() {
      const saved = localStorage.getItem(AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS);
      if (saved) {
        this.answeredQuestions = new Set(JSON.parse(saved));
      }
    }
    /**
     * LocalStorage에 진행 상황 저장
     */
    saveToStorage() {
      localStorage.setItem(
        AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS,
        JSON.stringify(Array.from(this.answeredQuestions))
      );
    }
    /**
     * 답변한 문제 추가
     * @param {number} questionIndex - 문제 인덱스
     */
    markAsAnswered(questionIndex) {
      this.answeredQuestions.add(questionIndex);
      this.saveToStorage();
    }
    /**
     * 특정 문제를 답변했는지 확인
     * @param {number} questionIndex - 문제 인덱스
     * @returns {boolean} 답변 여부
     */
    isAnswered(questionIndex) {
      return this.answeredQuestions.has(questionIndex);
    }
    /**
     * 진행 상황 초기화
     */
    reset() {
      this.answeredQuestions.clear();
      this.saveToStorage();
    }
    /**
     * 진행 바 업데이트
     * @param {Question[]} questions - 전체 문제 목록
     * @param {QuestionBank} questionBank - 문제 저장소 (삭제 여부 확인용)
     * @param {string} currentSubject - 현재 선택된 과목
     */
    updateProgress(questions, questionBank, currentSubject = "") {
      const answeredCount = Array.from(this.answeredQuestions).filter((index) => {
        const q = questionBank.questions[index];
        return q && !q.deleted && (!currentSubject || q.subject === currentSubject);
      }).length;
      const totalCount = questions.length;
      const percentage = totalCount > 0 ? answeredCount / totalCount * 100 : 0;
      if (this.progressFill) {
        this.progressFill.style.width = `${percentage}%`;
      }
      if (this.progressText) {
        this.progressText.textContent = `\uC9C4\uD589 \uC0C1\uD669: ${answeredCount}/${totalCount}`;
      }
    }
    /**
     * 완료 여부 확인
     * @param {Question[]} questions - 전체 문제 목록
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {string} currentSubject - 현재 선택된 과목
     * @returns {boolean} 완료 여부
     */
    isCompleted(questions, questionBank, currentSubject = "") {
      const answeredCount = Array.from(this.answeredQuestions).filter((index) => {
        const q = questionBank.questions[index];
        return q && !q.deleted && (!currentSubject || q.subject === currentSubject);
      }).length;
      return answeredCount >= questions.length && questions.length > 0;
    }
    /**
     * 답변되지 않은 문제 목록 반환
     * @param {Question[]} questions - 전체 문제 목록
     * @returns {Question[]} 답변되지 않은 문제
     */
    getUnansweredQuestions(questions) {
      return questions.filter((q) => !this.answeredQuestions.has(q.index));
    }
    /**
     * 답변한 문제 수 반환
     * @param {Question[]} allQuestions - 전체 문제 목록
     * @param {string} currentSubject - 현재 선택된 과목
     * @returns {number} 답변한 문제 수
     */
    getAnsweredCount(allQuestions, currentSubject = "") {
      return Array.from(this.answeredQuestions).filter((index) => {
        const q = allQuestions[index];
        return q && !q.deleted && (!currentSubject || q.subject === currentSubject);
      }).length;
    }
  };

  // app/js/modules/CompletionCelebration.js
  var CompletionCelebration = class {
    /**
     * @param {HTMLElement} questionElement - 문제 제목 요소
     * @param {HTMLElement} contentElement - 콘텐츠 요소
     */
    constructor(questionElement, contentElement) {
      this.questionElement = questionElement;
      this.contentElement = contentElement;
    }
    /**
     * 완료 축하 화면 표시
     * @param {Function} onRestartCallback - 재시작 버튼 클릭 시 콜백
     */
    show(onRestartCallback) {
      const resultElement = document.getElementById("result");
      if (resultElement) {
        resultElement.classList.remove("show");
        resultElement.style.display = "none";
      }
      this.displayCompletionMessage(onRestartCallback);
      this.createConfetti();
    }
    /**
     * 완료 메시지 표시
     * @param {Function} onRestartCallback - 재시작 콜백
     */
    displayCompletionMessage(onRestartCallback) {
      this.questionElement.textContent = "";
      this.contentElement.innerHTML = `
            <div class="completion-card">
                <div class="completion-icon">\u{1F389}</div>
                <h2 class="completion-title">\uBAA8\uB4E0 \uBB38\uC81C \uC644\uB8CC!</h2>
                <p class="completion-sub">\uC804\uCCB4 \uBB38\uC81C\uB97C \uBAA8\uB450 \uD480\uC5C8\uC2B5\uB2C8\uB2E4.</p>
                <p class="completion-desc">\uD6CC\uB96D\uD55C \uC131\uCDE8\uB97C \uC774\uB8E8\uC5B4\uB0C8\uC5B4\uC694!</p>
                <button id="restart-quiz-btn" class="completion-restart-btn">
                    \uB2E4\uC2DC \uC2DC\uC791\uD558\uAE30
                </button>
            </div>
        `;
      const restartBtn = document.getElementById("restart-quiz-btn");
      if (restartBtn) {
        restartBtn.onclick = onRestartCallback;
      }
    }
    /**
     * 콘페티 애니메이션 생성
     */
    createConfetti() {
      const colors = AppConstants.CONFETTI_COLORS;
      const confettiCount = AppConstants.CONFETTI_COUNT;
      for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
          this.createSingleConfetti(colors);
        }, i * 30);
      }
    }
    /**
     * 개별 콘페티 생성
     * @param {string[]} colors - 색상 배열
     */
    createSingleConfetti(colors) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-10px";
      confetti.style.borderRadius = "50%";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = AppConstants.Z_INDEX.CONFETTI;
      document.body.appendChild(confetti);
      const animation = confetti.animate([
        {
          transform: "translateY(0px)",
          opacity: 1
        },
        {
          transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0
        }
      ], {
        duration: AppConstants.ANIMATION_DURATIONS.VERY_SLOW + Math.random() * 2e3,
        easing: "cubic-bezier(0, .9, .57, 1)"
      });
      animation.onfinish = () => confetti.remove();
    }
    /**
     * 축하 화면 숨기기
     */
    hide() {
      this.questionElement.textContent = "\uBB38\uC81C\uAC00 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.";
      this.contentElement.innerHTML = "";
    }
  };

  // app/js/modules/utils/AnimationController.js
  var AnimationController = class {
    /**
     * 애니메이션 활성화 여부
     * @returns {boolean} 애니메이션 활성화 상태
     */
    static isEnabled() {
      return true;
    }
    /**
     * 요소 페이드 인
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static fadeIn(element, duration = 300, callback = null) {
      if (!this.isEnabled()) {
        element.style.opacity = "1";
        element.style.display = "";
        if (callback) callback();
        return;
      }
      element.style.opacity = "0";
      element.style.display = "";
      element.style.transition = `opacity ${duration}ms ease-in-out`;
      element.offsetHeight;
      element.style.opacity = "1";
      setTimeout(() => {
        element.style.transition = "";
        if (callback) callback();
      }, duration);
    }
    /**
     * 요소 페이드 아웃
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static fadeOut(element, duration = 300, callback = null) {
      if (!this.isEnabled()) {
        element.style.opacity = "0";
        element.style.display = "none";
        if (callback) callback();
        return;
      }
      element.style.transition = `opacity ${duration}ms ease-in-out`;
      element.style.opacity = "0";
      setTimeout(() => {
        element.style.display = "none";
        element.style.transition = "";
        if (callback) callback();
      }, duration);
    }
    /**
     * 슬라이드 다운
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static slideDown(element, duration = 300, callback = null) {
      if (!this.isEnabled()) {
        element.style.display = "";
        element.style.maxHeight = "";
        if (callback) callback();
        return;
      }
      element.style.display = "block";
      const height = element.scrollHeight;
      element.style.maxHeight = "0";
      element.style.overflow = "hidden";
      element.style.transition = `max-height ${duration}ms ease-in-out`;
      element.offsetHeight;
      element.style.maxHeight = height + "px";
      setTimeout(() => {
        element.style.maxHeight = "";
        element.style.overflow = "";
        element.style.transition = "";
        if (callback) callback();
      }, duration);
    }
    /**
     * 슬라이드 업
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static slideUp(element, duration = 300, callback = null) {
      if (!this.isEnabled()) {
        element.style.display = "none";
        element.style.maxHeight = "0";
        if (callback) callback();
        return;
      }
      const height = element.scrollHeight;
      element.style.maxHeight = height + "px";
      element.style.overflow = "hidden";
      element.style.transition = `max-height ${duration}ms ease-in-out`;
      element.offsetHeight;
      element.style.maxHeight = "0";
      setTimeout(() => {
        element.style.display = "none";
        element.style.overflow = "";
        element.style.transition = "";
        if (callback) callback();
      }, duration);
    }
    /**
     * 흔들기 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} intensity - 강도 (px)
     * @param {number} duration - 지속 시간 (ms)
     */
    static shake(element, intensity = 10, duration = 500) {
      if (!this.isEnabled()) return;
      const keyframes = [
        { transform: "translateX(0)" },
        { transform: `translateX(-${intensity}px)` },
        { transform: `translateX(${intensity}px)` },
        { transform: `translateX(-${intensity}px)` },
        { transform: `translateX(${intensity}px)` },
        { transform: "translateX(0)" }
      ];
      element.animate(keyframes, {
        duration,
        easing: "ease-in-out"
      });
    }
    /**
     * 펄스 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} scale - 확대 비율
     * @param {number} duration - 지속 시간 (ms)
     */
    static pulse(element, scale = 1.1, duration = 300) {
      if (!this.isEnabled()) return;
      const keyframes = [
        { transform: "scale(1)" },
        { transform: `scale(${scale})` },
        { transform: "scale(1)" }
      ];
      element.animate(keyframes, {
        duration,
        easing: "ease-in-out"
      });
    }
    /**
     * 바운스 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} height - 바운스 높이 (px)
     * @param {number} duration - 지속 시간 (ms)
     */
    static bounce(element, height = 20, duration = 600) {
      if (!this.isEnabled()) return;
      const keyframes = [
        { transform: "translateY(0)" },
        { transform: `translateY(-${height}px)`, offset: 0.4 },
        { transform: "translateY(0)", offset: 0.6 },
        { transform: `translateY(-${height / 2}px)`, offset: 0.8 },
        { transform: "translateY(0)" }
      ];
      element.animate(keyframes, {
        duration,
        easing: "ease-out"
      });
    }
    /**
     * 회전 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} degrees - 회전 각도
     * @param {number} duration - 지속 시간 (ms)
     */
    static rotate(element, degrees = 360, duration = 500) {
      if (!this.isEnabled()) return;
      const keyframes = [
        { transform: "rotate(0deg)" },
        { transform: `rotate(${degrees}deg)` }
      ];
      element.animate(keyframes, {
        duration,
        easing: "ease-in-out"
      });
    }
    /**
     * 깜빡임 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} times - 깜빡임 횟수
     * @param {number} duration - 지속 시간 (ms)
     */
    static blink(element, times = 3, duration = 600) {
      if (!this.isEnabled()) return;
      const keyframes = [];
      for (let i = 0; i <= times * 2; i++) {
        keyframes.push({ opacity: i % 2 === 0 ? 1 : 0 });
      }
      element.animate(keyframes, {
        duration,
        easing: "step-end"
      });
    }
    /**
     * 확대/축소 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} fromScale - 시작 스케일
     * @param {number} toScale - 종료 스케일
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static scale(element, fromScale = 0, toScale = 1, duration = 300, callback = null) {
      if (!this.isEnabled()) {
        element.style.transform = `scale(${toScale})`;
        if (callback) callback();
        return;
      }
      const keyframes = [
        { transform: `scale(${fromScale})` },
        { transform: `scale(${toScale})` }
      ];
      const animation = element.animate(keyframes, {
        duration,
        easing: "ease-out",
        fill: "forwards"
      });
      if (callback) {
        animation.onfinish = callback;
      }
    }
    /**
     * 버튼 클릭 효과
     * @param {HTMLElement} button - 버튼 요소
     */
    static buttonClick(button) {
      if (!this.isEnabled()) return;
      this.pulse(button, 0.95, 150);
    }
    /**
     * 성공 애니메이션
     * @param {HTMLElement} element - 대상 요소
     */
    static success(element) {
      if (!this.isEnabled()) return;
      const keyframes = [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.2)", opacity: 1, offset: 0.5 },
        { transform: "scale(1)", opacity: 1 }
      ];
      element.animate(keyframes, {
        duration: 600,
        easing: "ease-in-out"
      });
    }
    /**
     * 에러 애니메이션
     * @param {HTMLElement} element - 대상 요소
     */
    static error(element) {
      if (!this.isEnabled()) return;
      this.shake(element, 10, 500);
    }
    /**
     * 컨페티 생성 (축하 효과)
     * @param {HTMLElement} container - 컨테이너 요소
     * @param {number} count - 컨페티 개수
     * @param {number} duration - 지속 시간 (ms)
     */
    static confetti(container, count = 50, duration = 3e3) {
      if (!this.isEnabled()) return;
      const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe"];
      const confettiElements = [];
      for (let i = 0; i < count; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti-piece";
        confetti.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: ${Math.random() * 0.5 + 0.5};
                border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
                pointer-events: none;
                z-index: 9999;
            `;
        container.appendChild(confetti);
        confettiElements.push(confetti);
        const keyframes = [
          {
            transform: "translate(0, 0) rotate(0deg)",
            opacity: 1
          },
          {
            transform: `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
            opacity: 0
          }
        ];
        confetti.animate(keyframes, {
          duration: duration + Math.random() * 1e3,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        });
      }
      setTimeout(() => {
        confettiElements.forEach((confetti) => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        });
      }, duration + 1e3);
    }
    /**
     * 프로그레스 바 애니메이션
     * @param {HTMLElement} progressBar - 프로그레스 바 요소
     * @param {number} fromPercent - 시작 퍼센트
     * @param {number} toPercent - 종료 퍼센트
     * @param {number} duration - 지속 시간 (ms)
     */
    static progressBar(progressBar, fromPercent, toPercent, duration = 500) {
      if (!this.isEnabled()) {
        progressBar.style.width = `${toPercent}%`;
        return;
      }
      progressBar.style.width = `${fromPercent}%`;
      progressBar.style.transition = `width ${duration}ms ease-out`;
      progressBar.offsetHeight;
      progressBar.style.width = `${toPercent}%`;
      setTimeout(() => {
        progressBar.style.transition = "";
      }, duration);
    }
    /**
     * 리플 효과 (머티리얼 디자인)
     * @param {HTMLElement} element - 대상 요소
     * @param {Event} event - 이벤트 객체
     */
    static ripple(element, event) {
      if (!this.isEnabled()) return;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            width: 0;
            height: 0;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: translate(-50%, -50%);
        `;
      element.style.position = element.style.position || "relative";
      element.style.overflow = "hidden";
      element.appendChild(ripple);
      const size = Math.max(rect.width, rect.height) * 2;
      const keyframes = [
        { width: "0", height: "0", opacity: 1 },
        { width: `${size}px`, height: `${size}px`, opacity: 0 }
      ];
      const animation = ripple.animate(keyframes, {
        duration: 600,
        easing: "ease-out"
      });
      animation.onfinish = () => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      };
    }
    /**
     * 스무스 스크롤
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     */
    static smoothScrollTo(element, duration = 500) {
      if (!this.isEnabled()) {
        element.scrollIntoView();
        return;
      }
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
    /**
     * 카운트업 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} start - 시작 숫자
     * @param {number} end - 종료 숫자
     * @param {number} duration - 지속 시간 (ms)
     */
    static countUp(element, start, end, duration = 1e3) {
      if (!this.isEnabled()) {
        element.textContent = end;
        return;
      }
      const range = end - start;
      const increment = range / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (increment > 0 && current >= end || increment < 0 && current <= end) {
          current = end;
          clearInterval(timer);
        }
        element.textContent = Math.round(current);
      }, 16);
    }
    /**
     * 타이핑 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {string} text - 표시할 텍스트
     * @param {number} speed - 타이핑 속도 (ms/char)
     * @param {Function} callback - 완료 콜백
     */
    static typeWriter(element, text, speed = 50, callback = null) {
      if (!this.isEnabled()) {
        element.textContent = text;
        if (callback) callback();
        return;
      }
      element.textContent = "";
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(timer);
          if (callback) callback();
        }
      }, speed);
    }
  };

  // app/js/modules/QuizUI.js
  var QuizUI = class {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {FeedbackUI} feedbackUI - 피드백 UI 관리자
     * @param {ToastNotification} toast - Toast 알림 관리자
     */
    constructor(questionBank, feedbackUI, toast) {
      this.questionBank = questionBank;
      this.feedbackUI = feedbackUI;
      this.toast = toast;
      this.currentQuestion = null;
      this.currentSubject = "";
      this.lastAnsweredTime = 0;
      this.questionElement = domCache.get("question");
      this.questionContentElement = domCache.get("questionContent");
      this.renderers = {
        [AppConstants.QUESTION_TYPES.MULTIPLE]: new MultipleChoiceRenderer(),
        [AppConstants.QUESTION_TYPES.SUBJECTIVE]: new SubjectiveRenderer(),
        [AppConstants.QUESTION_TYPES.SEQUENCE]: new SequenceRenderer()
      };
      const progressFill = domCache.get("progressFill");
      const progressText = domCache.get("progressText");
      this.progressTracker = new ProgressTracker(progressFill, progressText);
      this.completionCelebration = new CompletionCelebration(
        this.questionElement,
        this.questionContentElement
      );
      this.answeredQuestions = this.progressTracker.answeredQuestions;
    }
    /**
     * 과목 필터 적용
     * @param {string} subject - 과목명
     */
    filterBySubject(subject) {
      this.currentSubject = subject;
      this.updateProgress();
    }
    /**
     * 랜덤 문제 생성
     */
    generateQuestion() {
      const questions = this.currentSubject ? this.questionBank.getBySubject(this.currentSubject) : this.questionBank.getAll();
      const unanswered = questions.filter((q) => !this.answeredQuestions.has(q.index));
      if (unanswered.length === 0) {
        if (questions.length === 0) {
          this.showNoQuestionsMessage();
        } else {
          this.showCompletionCelebration();
        }
        return;
      }
      const randomIndex = Math.floor(Math.random() * unanswered.length);
      this.currentQuestion = unanswered[randomIndex];
      this.displayQuestion();
      this.feedbackUI.hide();
    }
    /**
     * 문제 표시
     */
    displayQuestion() {
      if (!this.currentQuestion) return;
      this.questionElement.textContent = this.currentQuestion.question;
      this.questionContentElement.innerHTML = "";
      AnimationController.fadeIn(this.questionContentElement, AppConstants.ANIMATION_DURATIONS.FAST);
      const renderer = this.renderers[this.currentQuestion.type];
      if (renderer) {
        renderer.render(
          this.currentQuestion,
          this.questionContentElement,
          (isCorrect) => this.handleAnswer(isCorrect)
        );
      }
    }
    /**
     * 답변 처리 (렌더러 콜백)
     * @param {boolean} isCorrect - 정답 여부
     */
    handleAnswer(isCorrect) {
      if (this.currentQuestion.type === AppConstants.QUESTION_TYPES.SUBJECTIVE && isCorrect === null) {
        this.toast.show("\uB2F5\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.", AppConstants.NOTIFICATION_TYPES.ERROR);
        return;
      }
      this.checkAnswer(isCorrect);
    }
    /**
     * 답변 확인
     * @param {boolean} isCorrect - 정답 여부
     */
    checkAnswer(isCorrect) {
      const currentTime = Date.now();
      if (isCorrect && currentTime - this.lastAnsweredTime > 1e3) {
        this.feedbackUI.show(true);
        AnimationController.success(this.questionContentElement);
        this.lastAnsweredTime = currentTime;
        this.answeredQuestions.add(this.currentQuestion.index);
        this.progressTracker.saveToStorage();
        this.updateProgress();
        const questions = this.currentSubject ? this.questionBank.getBySubject(this.currentSubject) : this.questionBank.getAll();
        const answeredCount = this.progressTracker.getAnsweredCount(
          this.questionBank.questions,
          this.currentSubject
        );
        if (answeredCount >= questions.length) {
          setTimeout(() => {
            this.showCompletionCelebration();
          }, AppConstants.ANIMATION_DURATIONS.MEDIUM);
        } else {
          setTimeout(() => {
            this.currentQuestion = null;
            this.generateQuestion();
          }, AppConstants.ANIMATION_DURATIONS.MEDIUM);
        }
      } else if (!isCorrect) {
        this.feedbackUI.show(false);
        AnimationController.error(this.questionContentElement);
        if (this.currentQuestion.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
          const correctIndex = this.currentQuestion.correctAnswer;
          const correctAnswer = this.currentQuestion.options[correctIndex];
          this.feedbackUI.highlightCorrectOption(correctIndex);
          setTimeout(() => {
            this.feedbackUI.showHint(`\uC815\uB2F5: ${correctAnswer}`);
          }, AppConstants.ANIMATION_DURATIONS.SLOW);
        } else if (this.currentQuestion.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
          setTimeout(() => {
            this.feedbackUI.showHint(`\uC815\uB2F5 \uC21C\uC11C: ${this.currentQuestion.correctOrder.join(" \u2192 ")}`);
          }, AppConstants.ANIMATION_DURATIONS.SLOW);
        }
        setTimeout(() => {
          this.feedbackUI.hide();
          this.feedbackUI.resetOptions();
        }, AppConstants.ANIMATION_DURATIONS.VERY_SLOW);
      }
    }
    /**
     * 진행 상황 업데이트
     */
    updateProgress() {
      const questions = this.currentSubject ? this.questionBank.getBySubject(this.currentSubject) : this.questionBank.getAll();
      this.progressTracker.updateProgress(
        questions,
        this.questionBank,
        this.currentSubject
      );
    }
    /**
     * 문제 없음 메시지 표시
     */
    showNoQuestionsMessage() {
      const questionElement = document.getElementById("question");
      const contentElement = document.getElementById("question-content");
      if (questionElement) {
        questionElement.textContent = "\uB4F1\uB85D\uB41C \uBB38\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.";
      }
      if (contentElement) {
        contentElement.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="font-size: 18px; margin-bottom: 20px; color: #666;">\uBB38\uC81C\uB97C \uB4F1\uB85D\uD574\uC8FC\uC138\uC694.</p>
                    <a href="admin.html" style="display: inline-block; padding: 12px 24px; font-size: 16px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        \uBB38\uC81C \uB4F1\uB85D\uD558\uB7EC \uAC00\uAE30
                    </a>
                </div>
            `;
      }
    }
    /**
     * 완료 축하 화면 표시
     */
    showCompletionCelebration() {
      this.completionCelebration.show(() => this.restartQuiz());
    }
    /**
     * 퀴즈 재시작
     */
    restartQuiz() {
      this.answeredQuestions.clear();
      this.progressTracker.saveToStorage();
      this.currentQuestion = null;
      this.updateProgress();
      this.generateQuestion();
      this.toast.show("\uBB38\uC81C\uB97C \uB2E4\uC2DC \uC2DC\uC791\uD569\uB2C8\uB2E4!", AppConstants.NOTIFICATION_TYPES.SUCCESS);
    }
  };

  // app/js/modules/AdminUI.js
  var AdminUI = class {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {ToastNotification} toast - Toast 알림 관리자
     */
    constructor(questionBank, toast) {
      this.questionBank = questionBank;
      this.toast = toast;
      this.editingIndex = null;
      this.initializeEventListeners();
      this.updateQuestionList();
    }
    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
      const multipleChoiceForm = domCache.get("mcForm");
      if (multipleChoiceForm) {
        multipleChoiceForm.addEventListener("submit", (e) => {
          e.preventDefault();
          this.addMultipleChoiceQuestion();
        });
      }
      const subjectiveForm = domCache.get("subForm");
      if (subjectiveForm) {
        subjectiveForm.addEventListener("submit", (e) => {
          e.preventDefault();
          this.addSubjectiveQuestion();
        });
      }
      const sequenceForm = domCache.get("seqForm");
      if (sequenceForm) {
        sequenceForm.addEventListener("submit", (e) => {
          e.preventDefault();
          this.addSequenceQuestion();
        });
      }
      this.initializeSubjectSelectors();
      this.initializeEnterKeySubmit();
      const deleteAllBtn = document.querySelector(".delete-all-btn");
      if (deleteAllBtn) {
        deleteAllBtn.addEventListener("click", () => {
          this.deleteAllQuestions();
        });
      }
    }
    /**
     * 엔터 키로 폼 제출 활성화
     */
    initializeEnterKeySubmit() {
      const mcCorrectAnswer = domCache.get("mcCorrectAnswer");
      if (mcCorrectAnswer) {
        mcCorrectAnswer.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const form = domCache.get("mcForm");
            if (form) {
              form.dispatchEvent(new Event("submit"));
            }
          }
        });
      }
      const subCorrectAnswer = domCache.get("subCorrectAnswer");
      if (subCorrectAnswer) {
        subCorrectAnswer.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const form = domCache.get("subForm");
            if (form) {
              form.dispatchEvent(new Event("submit"));
            }
          }
        });
      }
    }
    /**
     * 과목 선택 드롭다운 초기화 (직접 입력 기능)
     */
    initializeSubjectSelectors() {
      const subjectSelectors = [
        { select: "mcSubject", input: "mcSubjectCustom", wrapper: "mcSubjectCustomWrapper", clear: "mcSubjectClear" },
        { select: "subSubject", input: "subSubjectCustom", wrapper: "subSubjectCustomWrapper", clear: "subSubjectClear" },
        { select: "seqSubject", input: "seqSubjectCustom", wrapper: "seqSubjectCustomWrapper", clear: "seqSubjectClear" }
      ];
      subjectSelectors.forEach(({ select, input, wrapper, clear }) => {
        const selectElement = document.getElementById(select);
        const wrapperElement = document.getElementById(wrapper);
        const inputElement = document.getElementById(input);
        const clearButton = document.getElementById(clear);
        if (selectElement && wrapperElement && inputElement && clearButton) {
          selectElement.addEventListener("change", (e) => {
            if (e.target.value === "custom") {
              wrapperElement.style.display = "flex";
              inputElement.required = true;
              selectElement.required = false;
              inputElement.focus();
            } else {
              wrapperElement.style.display = "none";
              inputElement.required = false;
              selectElement.required = true;
              inputElement.value = "";
            }
          });
          clearButton.addEventListener("click", () => {
            selectElement.value = "";
            wrapperElement.style.display = "none";
            inputElement.value = "";
            inputElement.required = false;
            selectElement.required = true;
          });
        }
      });
    }
    /**
     * 커스텀 과목 입력 필드 초기화
     */
    resetCustomSubjectInput(wrapperId) {
      const wrapperElement = document.getElementById(wrapperId);
      if (wrapperElement) {
        wrapperElement.style.display = "none";
        const inputElement = wrapperElement.querySelector("input");
        if (inputElement) {
          inputElement.value = "";
          inputElement.required = false;
        }
      }
    }
    /**
     * 커스텀 과목을 localStorage에 저장하고 드롭다운에 추가
     */
    saveCustomSubject(subject) {
      if (!subject) return;
      const savedSubjects = JSON.parse(localStorage.getItem("customSubjects") || "[]");
      if (savedSubjects.includes(subject)) return;
      savedSubjects.push(subject);
      localStorage.setItem("customSubjects", JSON.stringify(savedSubjects));
      if (typeof window.updateAllSubjectDropdowns === "function") {
        window.updateAllSubjectDropdowns();
      }
    }
    /**
     * 객관식 문제 추가
     */
    async addMultipleChoiceQuestion() {
      const subjectSelect = domCache.get("mcSubject");
      const subjectCustom = document.getElementById("mcSubjectCustom");
      const subject = (subjectSelect?.value === "custom" ? subjectCustom?.value : subjectSelect?.value)?.trim();
      const question = domCache.get("mcQuestion")?.value;
      const options = [
        domCache.getOption(1)?.value,
        domCache.getOption(2)?.value,
        domCache.getOption(3)?.value,
        domCache.getOption(4)?.value
      ];
      const correctAnswer = parseInt(domCache.get("mcCorrectAnswer")?.value) - 1;
      if (!subject || !question || options.some((opt) => !opt) || isNaN(correctAnswer)) {
        this.toast.show(AppConstants.ERROR_MESSAGES.REQUIRED_FIELDS, AppConstants.NOTIFICATION_TYPES.ERROR);
        return;
      }
      if (subjectSelect?.value === "custom") {
        this.saveCustomSubject(subject);
      }
      await this.questionBank.add({
        type: AppConstants.QUESTION_TYPES.MULTIPLE,
        subject,
        question,
        options,
        correctAnswer
      });
      domCache.get("mcForm")?.reset();
      this.resetCustomSubjectInput("mcSubjectCustomWrapper");
      this.toast.show("\uBB38\uC81C\uAC00 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", AppConstants.NOTIFICATION_TYPES.SUCCESS);
      this.updateQuestionList();
    }
    /**
     * 주관식 문제 추가
     */
    async addSubjectiveQuestion() {
      const subjectSelect = domCache.get("subSubject");
      const subjectCustom = document.getElementById("subSubjectCustom");
      const subject = (subjectSelect?.value === "custom" ? subjectCustom?.value : subjectSelect?.value)?.trim();
      const question = domCache.get("subQuestion")?.value;
      const correctAnswer = domCache.get("subCorrectAnswer")?.value.trim();
      const altAnswers = Array.from(document.querySelectorAll(".alternative-answer input")).map((input) => input.value.trim()).filter((v) => v);
      if (!subject || !question || !correctAnswer) {
        this.toast.show(AppConstants.ERROR_MESSAGES.REQUIRED_FIELDS, AppConstants.NOTIFICATION_TYPES.ERROR);
        return;
      }
      if (subjectSelect?.value === "custom") {
        this.saveCustomSubject(subject);
      }
      await this.questionBank.add({
        type: AppConstants.QUESTION_TYPES.SUBJECTIVE,
        subject,
        question,
        correctAnswer,
        alternativeAnswers: altAnswers
      });
      domCache.get("subForm")?.reset();
      this.resetCustomSubjectInput("subSubjectCustomWrapper");
      this.toast.show("\uBB38\uC81C\uAC00 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", AppConstants.NOTIFICATION_TYPES.SUCCESS);
      this.updateQuestionList();
    }
    /**
     * 순서 나열 문제 추가
     */
    async addSequenceQuestion() {
      const subjectSelect = domCache.get("seqSubject");
      const subjectCustom = document.getElementById("seqSubjectCustom");
      const subject = (subjectSelect?.value === "custom" ? subjectCustom?.value : subjectSelect?.value)?.trim();
      const question = domCache.get("seqQuestion")?.value;
      const seqItems = domCache.get("seqItems");
      const items = seqItems ? Array.from(seqItems.querySelectorAll(".sequence-input")).map((input) => input.value.trim()).filter((v) => v) : [];
      if (!subject || !question || items.length < AppConstants.SEQUENCE_MIN_ITEMS) {
        this.toast.show("\uCD5C\uC18C 2\uAC1C \uC774\uC0C1\uC758 \uD56D\uBAA9\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.", AppConstants.NOTIFICATION_TYPES.ERROR);
        return;
      }
      if (subjectSelect?.value === "custom") {
        this.saveCustomSubject(subject);
      }
      await this.questionBank.add({
        type: AppConstants.QUESTION_TYPES.SEQUENCE,
        subject,
        question,
        correctOrder: items
      });
      domCache.get("seqForm")?.reset();
      this.resetCustomSubjectInput("seqSubjectCustomWrapper");
      this.toast.show("\uBB38\uC81C\uAC00 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", AppConstants.NOTIFICATION_TYPES.SUCCESS);
      this.updateQuestionList();
    }
    /**
     * 문제 목록 업데이트
     * @param {string} filterType - 필터 타입 ('all', 'multiple', 'subjective', 'sequence')
     * @param {string} subjectFilter - 과목 필터
     */
    updateQuestionList(filterType = "all", subjectFilter = "", textFilter = "") {
      let questions = this.questionBank.getAll();
      if (filterType !== "all") {
        questions = questions.filter((q) => q.type === filterType);
      }
      if (subjectFilter) {
        questions = questions.filter((q) => q.subject.includes(subjectFilter));
      }
      if (textFilter) {
        const keyword = textFilter.toLowerCase();
        questions = questions.filter((q) => q.question.toLowerCase().includes(keyword));
      }
      const listElement = document.getElementById("questionList");
      if (!listElement) return;
      listElement.innerHTML = "";
      if (questions.length === 0) {
        listElement.innerHTML = '<div class="no-questions">\uB4F1\uB85D\uB41C \uBB38\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</div>';
        return;
      }
      questions.forEach((question) => {
        const questionItem = this.createQuestionListItem(question);
        listElement.appendChild(questionItem);
      });
      this.updateStats();
    }
    /**
     * 문제 목록 아이템 생성
     * @param {Question} question - 문제 객체
     * @returns {HTMLElement} 문제 아이템 요소
     */
    createQuestionListItem(question) {
      const div = document.createElement("div");
      div.className = "question-item";
      const typeLabels = {
        "multiple": "\uAC1D\uAD00\uC2DD",
        "subjective": "\uC8FC\uAD00\uC2DD",
        "sequence": "\uC21C\uC11C\uB098\uC5F4"
      };
      const questionPreview = (question.question || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
      let answerDisplay = "";
      if (question.type === "multiple" && question.options) {
        const correctOptionText = question.options[Number(question.correctAnswer)];
        answerDisplay = `<span class="answer-info">\uC815\uB2F5: ${correctOptionText || ""}</span>`;
      } else if (question.type === "subjective" && question.correctAnswer) {
        answerDisplay = `<span class="answer-info">\uC815\uB2F5: ${question.correctAnswer}</span>`;
      } else if (question.type === "sequence" && question.correctOrder) {
        answerDisplay = `<span class="answer-info">\uC815\uB2F5: ${question.correctOrder.join(" \u2192 ")}</span>`;
      }
      div.innerHTML = `
            <div class="question-header">
                <div class="question-info">
                    <span class="question-type-label">${typeLabels[question.type]}</span>
                    <span class="question-number">#${question.index + 1}</span>
                </div>
                <div class="question-actions">
                    <button class="edit-btn" onclick="app.adminUI.editQuestion(${question.index})" aria-label="\uBB38\uC81C \uC218\uC815">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="app.adminUI.deleteQuestion(${question.index})" aria-label="\uBB38\uC81C \uC0AD\uC81C">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="question-content">
                <p><strong>${question.subject}</strong></p>
                <p>${questionPreview}</p>
                <p style="margin-top: 8px; color: #4caf50; font-weight: bold;">${answerDisplay}</p>
            </div>
        `;
      return div;
    }
    /**
     * 문제 수정
     * @param {number} index - 문제 인덱스
     */
    editQuestion(index) {
      const question = this.questionBank.questions[index];
      if (!question || question.deleted) {
        this.toast.show("\uBB38\uC81C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", "error");
        return;
      }
      if (!document.getElementById("tab-edit")) {
        sessionStorage.setItem("editQuestionIndex", index);
        window.location.href = "admin.html";
        return;
      }
      this.editingQuestionIndex = index;
      if (typeof window.switchAdminTab === "function") {
        window.switchAdminTab("edit");
      }
      if (typeof window.switchEditQuestionType === "function") {
        window.switchEditQuestionType(question.type);
      }
      const setSubjectSelect = (selectId, subject) => {
        const select = document.getElementById(selectId);
        if (!select) return;
        if (subject && !Array.from(select.options).some((o) => o.value === subject)) {
          const opt = document.createElement("option");
          opt.value = subject;
          opt.textContent = subject;
          select.appendChild(opt);
        }
        select.value = subject || "";
      };
      if (question.type === "multiple") {
        setSubjectSelect("editMcSubject", question.subject);
        document.getElementById("editMcQuestion").value = question.question || "";
        document.getElementById("editOption1").value = question.options[0] || "";
        document.getElementById("editOption2").value = question.options[1] || "";
        document.getElementById("editOption3").value = question.options[2] || "";
        document.getElementById("editOption4").value = question.options[3] || "";
        document.getElementById("editMcCorrectAnswer").value = Number(question.correctAnswer) + 1 || "";
      } else if (question.type === "subjective") {
        setSubjectSelect("editSubSubject", question.subject);
        document.getElementById("editSubQuestion").value = question.question || "";
        document.getElementById("editSubCorrectAnswer").value = question.correctAnswer || "";
      } else if (question.type === "sequence") {
        setSubjectSelect("editSeqSubject", question.subject);
        document.getElementById("editSeqQuestion").value = question.question || "";
        const container = document.getElementById("editSequenceItems");
        container.innerHTML = "";
        question.correctOrder.forEach((item, i) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "sequence-item";
          itemDiv.innerHTML = `
                    <input type="text" class="sequence-input" name="edit-sequence-item-${i + 1}" placeholder="\uC21C\uC11C ${i + 1}" value="${item}" required>
                `;
          container.appendChild(itemDiv);
        });
      }
      this.toast.show("\uBB38\uC81C\uB97C \uC218\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", "info");
    }
    /**
     * 문제 삭제
     * @param {number} index - 문제 인덱스
     */
    async deleteQuestion(index) {
      if (confirm("\uC815\uB9D0\uB85C \uC774 \uBB38\uC81C\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?")) {
        await this.questionBank.delete(index);
        this.toast.show("\uBB38\uC81C\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", "success");
        this.updateQuestionList();
      }
    }
    /**
     * 모든 문제 삭제 (휴지통으로 이동)
     */
    async deleteAllQuestions() {
      const totalQuestions = this.questionBank.getAll().length;
      if (totalQuestions === 0) {
        this.toast.show("\uC0AD\uC81C\uD560 \uBB38\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.", "info");
        return;
      }
      const confirmMessage = `\uC815\uB9D0\uB85C \uBAA8\uB4E0 \uBB38\uC81C ${totalQuestions}\uAC1C\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?
\uC0AD\uC81C\uB41C \uBB38\uC81C\uB294 "\uC0AD\uC81C\uB41C \uBB38\uC81C" \uD0ED\uC5D0\uC11C \uBCF5\uC6D0\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`;
      if (confirm(confirmMessage)) {
        const success = await this.questionBank.deleteAllQuestions();
        if (success) {
          this.toast.show(`\uBAA8\uB4E0 \uBB38\uC81C\uAC00 \uD734\uC9C0\uD1B5\uC73C\uB85C \uC774\uB3D9\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`, "success");
          setTimeout(() => {
            window.location.href = "deleted.html";
          }, 1500);
        } else {
          this.toast.show("\uBB38\uC81C \uC0AD\uC81C \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.", "error");
        }
      }
    }
    /**
     * 문제 필터링 및 표시
     * @param {string} type - 필터 타입
     */
    filterAndDisplayQuestions(type) {
      const allFilterButtons = document.querySelectorAll("#list-section .subject-filters .filter-btn");
      const typeOrder = ["all", "multiple", "subjective", "sequence"];
      const idx = typeOrder.indexOf(type);
      const selectedBtn = idx >= 0 ? allFilterButtons[idx] : null;
      if (!selectedBtn) return;
      allFilterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "";
        btn.style.transform = "";
        btn.style.boxShadow = "";
      });
      selectedBtn.classList.add("active");
      selectedBtn.style.backgroundColor = "#4CAF50";
      selectedBtn.style.color = "white";
      selectedBtn.style.transform = "translateY(-1px)";
      selectedBtn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      const searchInput = document.getElementById("questionSearchInput");
      const textFilter = searchInput ? searchInput.value.trim() : "";
      this.updateQuestionList(type === "all" ? "all" : type, "", textFilter);
    }
    /**
     * 통계 업데이트
     */
    updateStats() {
      const stats = this.questionBank.getStats();
      const statAll = document.getElementById("statAll");
      const statMultiple = document.getElementById("statMultiple");
      const statSubjective = document.getElementById("statSubjective");
      const statSequence = document.getElementById("statSequence");
      if (statAll) statAll.textContent = stats.total;
      if (statMultiple) statMultiple.textContent = stats.multiple;
      if (statSubjective) statSubjective.textContent = stats.subjective;
      if (statSequence) statSequence.textContent = stats.sequence;
    }
    /**
     * 문제 유형 전환
     * @param {string} type - 문제 유형
     */
    switchQuestionType(type) {
      document.querySelectorAll(".form-toggle").forEach((form) => form.classList.remove("active"));
      document.querySelectorAll(".question-type-select .tab-btn").forEach((btn) => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "";
      });
      const selectedBtn = document.querySelector(`[onclick="toggleQuestionType('${type}')"]`);
      if (selectedBtn) {
        selectedBtn.classList.add("active");
        selectedBtn.style.backgroundColor = "";
        selectedBtn.style.color = "";
      }
      if (type === "multiple") {
        document.getElementById("multipleChoiceForm")?.classList.add("active");
      } else if (type === "subjective") {
        document.getElementById("subjectiveForm")?.classList.add("active");
      } else {
        document.getElementById("sequenceForm")?.classList.add("active");
      }
    }
  };

  // app/js/modules/TabManager.js
  var TabManager = class {
    constructor() {
      this.currentTab = "quiz";
      this.initializeEventListeners();
    }
    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
      const tabButtons = document.querySelectorAll('.tab-buttons .tab-btn[id^="tab-"]');
      tabButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const tabId = e.target.id;
          const tabName = tabId.replace("tab-", "");
          if (tabName) {
            this.switchTab(tabName);
          }
        });
      });
    }
    /**
     * 탭 전환
     * @param {string} tabName - 탭 이름
     */
    switchTab(tabName) {
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });
      const selectedTabBtn = domCache.get(`tab${tabName.charAt(0).toUpperCase()}${tabName.slice(1)}`);
      if (selectedTabBtn) {
        selectedTabBtn.classList.add("active");
        selectedTabBtn.setAttribute("aria-selected", "true");
      }
      const quizSection = domCache.get("quizSection");
      const adminSection = domCache.get("adminSection");
      const editSection = domCache.get("editSection");
      const listSection = domCache.get("listSection");
      const settingsSection = domCache.get("settingsSection");
      const deletedSection = domCache.get("deletedSection");
      [quizSection, adminSection, editSection, listSection, settingsSection, deletedSection].forEach((section) => {
        if (section) section.style.display = "none";
      });
      const sectionMap = {
        "quiz": quizSection,
        "admin": adminSection,
        "edit": editSection,
        "list": listSection,
        "settings": settingsSection,
        "deleted": deletedSection
      };
      const targetSection = sectionMap[tabName];
      if (targetSection) {
        targetSection.style.display = tabName === "quiz" ? "flex" : "block";
      }
      if (tabName === "admin" && window.app?.adminUI) {
        window.app.adminUI.switchQuestionType(AppConstants.QUESTION_TYPES.MULTIPLE);
      } else if (tabName === "list" && window.app?.adminUI) {
        window.app.adminUI.filterAndDisplayQuestions("all");
      }
      this.currentTab = tabName;
    }
  };

  // app/js/modules/handlers/DOMEventHandler.js
  var DOMEventHandler = class {
    /**
     * @param {Object} app - 앱 인스턴스
     */
    constructor(app2) {
      this.app = app2;
      this.boundHandlers = /* @__PURE__ */ new Map();
    }
    /**
     * 모든 이벤트 리스너 초기화
     */
    init() {
      this.initTabButtons();
      this.initQuizFilters();
      this.initAdminForms();
      this.initEditForms();
      this.initListFilters();
      this.initSettingsForm();
      this.initFormSubmits();
    }
    /**
     * 탭 버튼 이벤트
     */
    initTabButtons() {
      const tabButtons = [
        { id: "tab-quiz", name: "quiz" },
        { id: "tab-admin", name: "admin" },
        { id: "tab-list", name: "list" },
        { id: "tab-settings", name: "settings" },
        { id: "tab-edit", name: "edit" }
      ];
      tabButtons.forEach(({ id, name }) => {
        const button = document.getElementById(id);
        if (button) {
          const handler = () => this.handleTabSwitch(name);
          button.addEventListener("click", handler);
          this.boundHandlers.set(`tab-${id}`, { element: button, event: "click", handler });
        }
      });
    }
    /**
     * 탭 전환 핸들러
     * @param {string} tabName - 탭 이름
     */
    handleTabSwitch(tabName) {
      if (this.app && this.app.tabManager) {
        this.app.tabManager.switchTab(tabName);
      }
    }
    /**
     * 퀴즈 필터 이벤트
     */
    initQuizFilters() {
      const subjectDropdown = document.getElementById("subjectDropdown");
      if (subjectDropdown) {
        const handler = (e) => this.handleQuizSubjectFilter(e.target.value);
        subjectDropdown.addEventListener("change", handler);
        this.boundHandlers.set("subject-dropdown", { element: subjectDropdown, event: "change", handler });
      }
    }
    /**
     * 과목별 퀴즈 필터링 핸들러
     * @param {string} subject - 과목명
     */
    handleQuizSubjectFilter(subject) {
      if (this.app && this.app.quizUI) {
        this.app.quizUI.filterBySubject(subject);
        this.app.quizUI.generateQuestion();
      }
    }
    /**
     * 관리자 폼 이벤트 (문제 등록)
     */
    initAdminForms() {
      const addSeqButton = document.querySelector("#sequenceForm .add-btn");
      if (addSeqButton) {
        const handler = () => this.handleAddSequenceItem("sequenceItems");
        addSeqButton.addEventListener("click", handler);
        this.boundHandlers.set("add-seq-item", { element: addSeqButton, event: "click", handler });
      }
    }
    /**
     * 수정 폼 이벤트
     */
    initEditForms() {
      const addEditSeqButton = document.querySelector("#editSequenceForm .add-btn");
      if (addEditSeqButton) {
        const handler = () => this.handleAddSequenceItem("editSequenceItems");
        addEditSeqButton.addEventListener("click", handler);
        this.boundHandlers.set("add-edit-seq-item", { element: addEditSeqButton, event: "click", handler });
      }
    }
    /**
     * 문제 유형 토글 핸들러
     * @param {string} type - 문제 유형
     */
    handleQuestionTypeToggle(type) {
      if (this.app && this.app.adminUI) {
        this.app.adminUI.switchQuestionType(type);
      }
    }
    /**
     * 순서 나열 항목 추가 핸들러
     * @param {string} containerId - 컨테이너 ID
     */
    handleAddSequenceItem(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const itemCount = container.children.length;
      const newItem = document.createElement("div");
      newItem.className = "sequence-item";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "sequence-input";
      input.name = containerId === "sequenceItems" ? `sequence-item-${itemCount + 1}` : `edit-sequence-item-${itemCount + 1}`;
      input.placeholder = `\uC21C\uC11C ${itemCount + 1}`;
      input.required = true;
      newItem.appendChild(input);
      if (itemCount >= 2) {
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener("click", () => this.handleRemoveSequenceItem(newItem, container));
        newItem.appendChild(deleteBtn);
      }
      container.appendChild(newItem);
    }
    /**
     * 순서 나열 항목 제거 핸들러
     * @param {HTMLElement} item - 삭제할 항목
     * @param {HTMLElement} container - 컨테이너
     */
    handleRemoveSequenceItem(item, container) {
      if (container.children.length <= 2) {
        if (this.app && this.app.toast) {
          this.app.toast.show("\uCD5C\uC18C 2\uAC1C\uC758 \uD56D\uBAA9\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.", "error");
        }
        return;
      }
      container.removeChild(item);
    }
    /**
     * 목록 필터 이벤트
     */
    initListFilters() {
      const listSection = document.getElementById("list-section");
      if (listSection) {
        const filterButtons = listSection.querySelectorAll(".filter-btn");
        const filters = ["all", "multiple", "subjective", "sequence"];
        filterButtons.forEach((button, index) => {
          const handler = () => this.handleFilterQuestions(filters[index]);
          button.addEventListener("click", handler);
          this.boundHandlers.set(`filter-${index}`, { element: button, event: "click", handler });
        });
        const deleteAllBtn = listSection.querySelector(".delete-all-btn");
        if (deleteAllBtn) {
          const handler = () => this.handleDeleteAllQuestions();
          deleteAllBtn.addEventListener("click", handler);
          this.boundHandlers.set("delete-all", { element: deleteAllBtn, event: "click", handler });
        }
        const searchInput = document.getElementById("questionSearchInput");
        if (searchInput) {
          const handler = () => this.handleSearchFilter();
          searchInput.addEventListener("input", handler);
          this.boundHandlers.set("search-input", { element: searchInput, event: "input", handler });
        }
      }
    }
    /**
     * 문제 필터링 핸들러
     * @param {string} type - 필터 타입
     */
    handleFilterQuestions(type) {
      if (this.app && this.app.adminUI) {
        this.app.adminUI.filterAndDisplayQuestions(type);
      }
    }
    /**
     * 텍스트 검색 필터 핸들러
     */
    handleSearchFilter() {
      if (this.app && this.app.adminUI) {
        const searchInput = document.getElementById("questionSearchInput");
        const textFilter = searchInput ? searchInput.value.trim() : "";
        const activeBtn = document.querySelector("#list-section .subject-filters .filter-btn.active");
        const filterButtons = document.querySelectorAll("#list-section .subject-filters .filter-btn");
        const typeOrder = ["all", "multiple", "subjective", "sequence"];
        let currentType = "all";
        filterButtons.forEach((btn, i) => {
          if (btn.classList.contains("active")) currentType = typeOrder[i];
        });
        this.app.adminUI.updateQuestionList(currentType, "", textFilter);
      }
    }
    /**
     * 모든 문제 삭제 핸들러
     */
    handleDeleteAllQuestions() {
      if (this.app && this.app.adminUI) {
        this.app.adminUI.deleteAllQuestions();
      }
    }
    /**
     * 설정 폼 이벤트
     */
    initSettingsForm() {
      const settingsSection = document.getElementById("settings-section");
      if (settingsSection) {
        const saveBtn = settingsSection.querySelector(".submit-btn");
        if (saveBtn) {
          const handler = () => this.handleSaveSettings();
          saveBtn.addEventListener("click", handler);
          this.boundHandlers.set("save-settings", { element: saveBtn, event: "click", handler });
        }
      }
    }
    /**
     * 설정 저장 핸들러
     */
    handleSaveSettings() {
      const apiKey = document.getElementById("apiKey")?.value;
      const enableRephrase = document.getElementById("enableRephrase")?.checked;
      const settings = {
        apiKey,
        enableRephrase
      };
      localStorage.setItem("quizAppSettings", JSON.stringify(settings));
      if (this.app && this.app.toast) {
        this.app.toast.show("\uC124\uC815\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", "success");
      }
    }
    /**
     * 폼 제출 이벤트 (preventDefault만 처리)
     */
    initFormSubmits() {
      const forms = [
        "multipleChoiceForm",
        "subjectiveForm",
        "sequenceForm",
        "editMcForm",
        "editSubForm",
        "editSeqForm"
      ];
      forms.forEach((formId) => {
        const form = document.getElementById(formId);
        if (form) {
          const handler = (e) => {
            e.preventDefault();
            if (formId.startsWith("edit")) {
              this.handleEditFormSubmit(formId);
            }
          };
          form.addEventListener("submit", handler);
          this.boundHandlers.set(`form-${formId}`, { element: form, event: "submit", handler });
        }
      });
    }
    /**
     * 수정 폼 제출 처리
     * @param {string} formId - 폼 ID
     */
    handleEditFormSubmit(formId) {
      const index = this.app.adminUI.editingQuestionIndex;
      if (index === void 0 || index === null) {
        this.app.toast.show("\uC218\uC815\uD560 \uBB38\uC81C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", "error");
        return;
      }
      const question = this.app.questionBank.questions[index];
      if (!question) {
        this.app.toast.show("\uBB38\uC81C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", "error");
        return;
      }
      let updatedQuestion = null;
      if (formId === "editMcForm") {
        const subject = document.getElementById("editMcSubject").value.trim();
        const questionText = document.getElementById("editMcQuestion").value.trim();
        const options = [
          document.getElementById("editOption1").value.trim(),
          document.getElementById("editOption2").value.trim(),
          document.getElementById("editOption3").value.trim(),
          document.getElementById("editOption4").value.trim()
        ];
        const correctAnswer = parseInt(document.getElementById("editMcCorrectAnswer").value) - 1;
        updatedQuestion = {
          ...question,
          subject,
          question: questionText,
          options,
          correctAnswer
        };
      } else if (formId === "editSubForm") {
        const subject = document.getElementById("editSubSubject").value.trim();
        const questionText = document.getElementById("editSubQuestion").value.trim();
        const correctAnswer = document.getElementById("editSubCorrectAnswer").value.trim();
        updatedQuestion = {
          ...question,
          subject,
          question: questionText,
          correctAnswer
        };
      } else if (formId === "editSeqForm") {
        const subject = document.getElementById("editSeqSubject").value.trim();
        const questionText = document.getElementById("editSeqQuestion").value.trim();
        const inputs = document.querySelectorAll("#editSequenceItems .sequence-input");
        const correctOrder = Array.from(inputs).map((input) => input.value.trim());
        updatedQuestion = {
          ...question,
          subject,
          question: questionText,
          correctOrder
        };
      }
      if (updatedQuestion) {
        this.app.questionBank.update(index, updatedQuestion);
        this.app.toast.show("\uBB38\uC81C\uAC00 \uC218\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4!", "success");
        const tabEdit = document.getElementById("tab-edit");
        if (tabEdit) {
          tabEdit.style.display = "none";
        }
        const tabList = document.getElementById("tab-list");
        if (tabList) {
          tabList.click();
        }
        this.app.adminUI.editingQuestionIndex = null;
      }
    }
    /**
     * 모든 이벤트 리스너 제거
     */
    destroy() {
      this.boundHandlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this.boundHandlers.clear();
    }
  };

  // app/js/modules/SettingsUI.js
  var SettingsUI = class {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {AutoBackup} autoBackup - 자동 백업 시스템
     * @param {ToastNotification} toast - Toast 알림
     */
    constructor(questionBank, autoBackup, toast) {
      this.questionBank = questionBank;
      this.autoBackup = autoBackup;
      this.toast = toast;
      this.initializeEventListeners();
      this.loadSettings();
      this.updateBackupStatus();
    }
    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
      document.getElementById("btnManualBackup")?.addEventListener("click", () => {
        this.handleManualBackup();
      });
      document.getElementById("btnRestoreBackup")?.addEventListener("click", () => {
        this.handleRestoreBackup();
      });
      document.getElementById("btnRestoreDefaults")?.addEventListener("click", () => {
        this.handleRestoreDefaults();
      });
      document.getElementById("backupFileInput")?.addEventListener("change", (e) => {
        this.handleFileSelected(e);
      });
      document.getElementById("autoBackupEnabled")?.addEventListener("change", (e) => {
        this.handleAutoBackupToggle(e.target.checked);
      });
      document.getElementById("backupInterval")?.addEventListener("change", (e) => {
        this.handleBackupIntervalChange(parseInt(e.target.value));
      });
      document.getElementById("btnSaveSettings")?.addEventListener("click", () => {
        this.handleSaveSettings();
      });
    }
    /**
     * 설정 로드
     */
    loadSettings() {
      const apiKey = localStorage.getItem("chatgptApiKey") || "";
      const apiKeyInput = document.getElementById("apiKey");
      if (apiKeyInput) {
        apiKeyInput.value = apiKey;
      }
      const enableRephrase = localStorage.getItem("enableRephrase") !== "false";
      const rephraseCheckbox = document.getElementById("enableRephrase");
      if (rephraseCheckbox) {
        rephraseCheckbox.checked = enableRephrase;
      }
      const autoBackupSettings = JSON.parse(localStorage.getItem("autoBackupSettings") || "{}");
      const autoBackupCheckbox = document.getElementById("autoBackupEnabled");
      if (autoBackupCheckbox) {
        autoBackupCheckbox.checked = autoBackupSettings.enabled !== false;
      }
      const backupInterval = document.getElementById("backupInterval");
      if (backupInterval && autoBackupSettings.interval !== void 0) {
        const minutes = autoBackupSettings.interval / 6e4;
        backupInterval.value = minutes.toString();
      }
    }
    /**
     * 설정 저장
     */
    handleSaveSettings() {
      const apiKey = document.getElementById("apiKey")?.value || "";
      localStorage.setItem("chatgptApiKey", apiKey);
      const enableRephrase = document.getElementById("enableRephrase")?.checked || false;
      localStorage.setItem("enableRephrase", enableRephrase.toString());
      const autoBackupEnabled = document.getElementById("autoBackupEnabled")?.checked || false;
      const backupInterval = parseInt(document.getElementById("backupInterval")?.value || "5");
      this.autoBackup.setEnabled(autoBackupEnabled);
      this.autoBackup.setInterval(backupInterval);
      this.toast.show("\uC124\uC815\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4", "success");
    }
    /**
     * 수동 백업 처리
     */
    async handleManualBackup() {
      try {
        await this.autoBackup.createBackup(true);
        this.toast.show("\uBC31\uC5C5 \uD30C\uC77C\uC774 \uB2E4\uC6B4\uB85C\uB4DC\uB418\uC5C8\uC2B5\uB2C8\uB2E4", "success");
        this.updateBackupStatus();
      } catch (error) {
        console.error("\uBC31\uC5C5 \uC2E4\uD328:", error);
        this.toast.show("\uBC31\uC5C5 \uC2E4\uD328: " + error.message, "error");
      }
    }
    /**
     * 백업 복원 처리 (파일 선택 대화상자 열기)
     */
    handleRestoreBackup() {
      const fileInput = document.getElementById("backupFileInput");
      if (fileInput) {
        fileInput.click();
      }
    }
    /**
     * 파일 선택 처리
     */
    async handleFileSelected(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!confirm("\uBC31\uC5C5 \uD30C\uC77C\uB85C \uBCF5\uC6D0\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C? \uD604\uC7AC \uB370\uC774\uD130\uB294 \uBC31\uC5C5\uB429\uB2C8\uB2E4.")) {
        event.target.value = "";
        return;
      }
      try {
        const result = await this.autoBackup.restoreFromFile(file);
        this.toast.show(
          `\uBCF5\uC6D0 \uC644\uB8CC: ${result.restoredCount}\uAC1C \uBB38\uC81C \uBCF5\uC6D0\uB428`,
          "success"
        );
        if (window.app && window.app.adminUI) {
          window.app.adminUI.updateQuestionList();
        }
        this.updateBackupStatus();
      } catch (error) {
        console.error("\uBCF5\uC6D0 \uC2E4\uD328:", error);
        this.toast.show("\uBCF5\uC6D0 \uC2E4\uD328: " + error.message, "error");
      }
      event.target.value = "";
    }
    /**
     * 기본 문제로 복원 처리
     */
    async handleRestoreDefaults() {
      if (!confirm("\uAE30\uBCF8 \uBB38\uC81C\uB85C \uBCF5\uC6D0\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C? \uD604\uC7AC \uB370\uC774\uD130\uB294 \uBC31\uC5C5\uB429\uB2C8\uB2E4.")) {
        return;
      }
      try {
        await this.questionBank.restoreDefaults();
        this.toast.show("\uAE30\uBCF8 \uBB38\uC81C\uB85C \uBCF5\uC6D0\uB418\uC5C8\uC2B5\uB2C8\uB2E4", "success");
        if (window.app && window.app.adminUI) {
          window.app.adminUI.updateQuestionList();
        }
        this.updateBackupStatus();
      } catch (error) {
        console.error("\uBCF5\uC6D0 \uC2E4\uD328:", error);
        this.toast.show("\uBCF5\uC6D0 \uC2E4\uD328: " + error.message, "error");
      }
    }
    /**
     * 자동 백업 토글 처리
     */
    handleAutoBackupToggle(enabled) {
      this.autoBackup.setEnabled(enabled);
      if (enabled) {
        this.toast.show("\uC790\uB3D9 \uBC31\uC5C5\uC774 \uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4", "info");
      } else {
        this.toast.show("\uC790\uB3D9 \uBC31\uC5C5\uC774 \uBE44\uD65C\uC131\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4", "info");
      }
    }
    /**
     * 백업 간격 변경 처리
     */
    handleBackupIntervalChange(minutes) {
      this.autoBackup.setInterval(minutes);
      if (minutes === 0) {
        this.toast.show("\uC989\uC2DC \uBC31\uC5C5 \uBAA8\uB4DC\uB85C \uC124\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4", "info");
      } else {
        this.toast.show(`\uBC31\uC5C5 \uAC04\uACA9: ${minutes}\uBD84`, "info");
      }
    }
    /**
     * 백업 상태 업데이트
     */
    updateBackupStatus() {
      const statusDiv = document.getElementById("backupStatus");
      const lastBackupTimeSpan = document.getElementById("lastBackupTime");
      if (statusDiv && lastBackupTimeSpan) {
        const lastBackupTime = this.autoBackup.getLastBackupTime();
        lastBackupTimeSpan.textContent = lastBackupTime;
        statusDiv.style.display = "block";
      }
      if (!this.statusUpdateInterval) {
        this.statusUpdateInterval = setInterval(() => {
          this.updateBackupStatus();
        }, 6e4);
      }
    }
    /**
     * 백업 이력 표시 (선택 사항)
     */
    async showBackupHistory() {
      try {
        const history = await this.autoBackup.getBackupHistory();
        if (history.length === 0) {
          this.toast.show("\uBC31\uC5C5 \uC774\uB825\uC774 \uC5C6\uC2B5\uB2C8\uB2E4", "info");
          return;
        }
        const list = history.slice(0, 5).map((backup, i) => {
          const date = new Date(backup.timestamp);
          return `${i + 1}. ${date.toLocaleString()} (${backup.questionCount}\uAC1C \uBB38\uC81C)`;
        }).join("\n");
        alert(`\uCD5C\uADFC \uBC31\uC5C5 \uC774\uB825:

${list}`);
      } catch (error) {
        console.error("\uBC31\uC5C5 \uC774\uB825 \uC870\uD68C \uC2E4\uD328:", error);
      }
    }
    /**
     * 정리
     */
    destroy() {
      if (this.statusUpdateInterval) {
        clearInterval(this.statusUpdateInterval);
        this.statusUpdateInterval = null;
      }
    }
  };

  // app/js/modules/DeletedQuestionsUI.js
  var DeletedQuestionsUI = class {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {ToastNotification} toast - Toast 알림
     */
    constructor(questionBank, toast) {
      this.questionBank = questionBank;
      this.toast = toast;
      this.initializeEventListeners();
      this.updateDeletedQuestionList();
    }
    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
      document.getElementById("btnRestoreAll")?.addEventListener("click", () => {
        this.handleRestoreAll();
      });
      document.getElementById("btnPermanentDeleteAll")?.addEventListener("click", () => {
        this.handlePermanentDeleteAll();
      });
      document.getElementById("deletedSubjectFilter")?.addEventListener("change", (e) => {
        this.updateDeletedQuestionList(e.target.value);
      });
      document.getElementById("tab-deleted")?.addEventListener("click", () => {
        this.updateDeletedQuestionList();
        this.updateSubjectFilter();
      });
    }
    /**
     * 삭제된 문제 목록 업데이트
     * @param {string} subjectFilter - 과목 필터
     */
    updateDeletedQuestionList(subjectFilter = "") {
      const listElement = document.getElementById("deletedQuestionList");
      if (!listElement) return;
      let deletedQuestions = this.questionBank.getDeleted();
      if (subjectFilter) {
        deletedQuestions = deletedQuestions.filter((q) => q.subject === subjectFilter);
      }
      const statsElement = document.getElementById("deletedCount");
      if (statsElement) {
        statsElement.textContent = `${deletedQuestions.length}\uAC1C`;
      }
      if (deletedQuestions.length === 0) {
        listElement.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">\uC0AD\uC81C\uB41C \uBB38\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</p>';
        return;
      }
      listElement.innerHTML = deletedQuestions.map((question, idx) => {
        const typeLabel = this.getTypeLabel(question.type);
        const previewText = this.getQuestionPreview(question);
        return `
                <div class="question-item" style="background: #fff3cd; border-left: 4px solid #ffc107;">
                    <div class="question-header">
                        <span class="question-number">#${question.index + 1}</span>
                        <span class="question-type" style="background: #ffc107;">${typeLabel}</span>
                        <span class="question-subject">${question.subject}</span>
                    </div>
                    <div class="question-content">
                        <strong>${question.question}</strong>
                        <p style="color: #666; margin-top: 5px;">${previewText}</p>
                    </div>
                    <div class="question-actions">
                        <button class="action-btn restore-btn" data-index="${question.index}" style="background: #28a745; color: white;">
                            \uBCF5\uC6D0
                        </button>
                        <button class="action-btn permanent-delete-btn" data-index="${question.index}" style="background: #dc3545; color: white;">
                            \uC601\uAD6C \uC0AD\uC81C
                        </button>
                    </div>
                </div>
            `;
      }).join("");
      listElement.querySelectorAll(".restore-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = parseInt(e.target.dataset.index);
          this.handleRestore(index);
        });
      });
      listElement.querySelectorAll(".permanent-delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = parseInt(e.target.dataset.index);
          this.handlePermanentDelete(index);
        });
      });
    }
    /**
     * 과목 필터 업데이트
     */
    updateSubjectFilter() {
      const filterElement = document.getElementById("deletedSubjectFilter");
      if (!filterElement) return;
      const deletedQuestions = this.questionBank.getDeleted();
      const subjects = [...new Set(deletedQuestions.map((q) => q.subject))];
      const currentOptions = Array.from(filterElement.options).map((opt) => opt.value);
      subjects.forEach((subject) => {
        if (!currentOptions.includes(subject)) {
          const option = document.createElement("option");
          option.value = subject;
          option.textContent = subject;
          filterElement.appendChild(option);
        }
      });
    }
    /**
     * 문제 유형 레이블 반환
     */
    getTypeLabel(type) {
      const labels = {
        "multiple": "\uAC1D\uAD00\uC2DD",
        "subjective": "\uC8FC\uAD00\uC2DD",
        "sequence": "\uC21C\uC11C\uB098\uC5F4"
      };
      return labels[type] || type;
    }
    /**
     * 문제 미리보기 텍스트
     */
    getQuestionPreview(question) {
      if (question.type === "multiple") {
        return `\uC815\uB2F5: ${question.options[question.correctAnswer]}`;
      } else if (question.type === "subjective") {
        return `\uC815\uB2F5: ${question.correctAnswer}`;
      } else if (question.type === "sequence") {
        return `\uC21C\uC11C: ${question.correctOrder.join(" \u2192 ")}`;
      }
      return "";
    }
    /**
     * 개별 문제 복원
     */
    async handleRestore(index) {
      if (!confirm("\uC774 \uBB38\uC81C\uB97C \uBCF5\uC6D0\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?")) {
        return;
      }
      const success = await this.questionBank.restore(index);
      if (success) {
        this.toast.show("\uBB38\uC81C\uAC00 \uBCF5\uC6D0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", "success");
        this.updateDeletedQuestionList();
        this.updateSubjectFilter();
        if (window.app && window.app.adminUI) {
          window.app.adminUI.updateQuestionList();
        }
      } else {
        this.toast.show("\uBB38\uC81C \uBCF5\uC6D0\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4", "error");
      }
    }
    /**
     * 개별 문제 영구 삭제
     */
    async handlePermanentDelete(index) {
      if (!confirm("\uC774 \uBB38\uC81C\uB97C \uC601\uAD6C\uC801\uC73C\uB85C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?\n\n\u26A0\uFE0F \uC774 \uC791\uC5C5\uC740 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4!")) {
        return;
      }
      const success = await this.questionBank.permanentDelete(index);
      if (success) {
        this.toast.show("\uBB38\uC81C\uAC00 \uC601\uAD6C \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", "info");
        this.updateDeletedQuestionList();
      } else {
        this.toast.show("\uBB38\uC81C \uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4", "error");
      }
    }
    /**
     * 전체 복원
     */
    async handleRestoreAll() {
      const deletedQuestions = this.questionBank.getDeleted();
      if (deletedQuestions.length === 0) {
        this.toast.show("\uBCF5\uC6D0\uD560 \uBB38\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4", "info");
        return;
      }
      if (!confirm(`${deletedQuestions.length}\uAC1C\uC758 \uBB38\uC81C\uB97C \uBAA8\uB450 \uBCF5\uC6D0\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`)) {
        return;
      }
      for (const question of deletedQuestions) {
        await this.questionBank.restore(question.index);
      }
      this.toast.show(`${deletedQuestions.length}\uAC1C \uBB38\uC81C\uAC00 \uBCF5\uC6D0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`, "success");
      this.updateDeletedQuestionList();
      if (window.app && window.app.adminUI) {
        window.app.adminUI.updateQuestionList();
      }
    }
    /**
     * 전체 영구 삭제
     */
    async handlePermanentDeleteAll() {
      const deletedQuestions = this.questionBank.getDeleted();
      if (deletedQuestions.length === 0) {
        this.toast.show("\uC0AD\uC81C\uD560 \uBB38\uC81C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4", "info");
        return;
      }
      if (!confirm(`\u26A0\uFE0F ${deletedQuestions.length}\uAC1C\uC758 \uBB38\uC81C\uB97C \uC601\uAD6C\uC801\uC73C\uB85C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?

\uC774 \uC791\uC5C5\uC740 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4!`)) {
        return;
      }
      if (!confirm("\uC815\uB9D0\uB85C \uC601\uAD6C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C? \uB9C8\uC9C0\uB9C9 \uD655\uC778\uC785\uB2C8\uB2E4.")) {
        return;
      }
      const indices = deletedQuestions.map((q) => q.index).sort((a, b) => b - a);
      for (const index of indices) {
        await this.questionBank.permanentDelete(index);
      }
      this.toast.show(`${deletedQuestions.length}\uAC1C \uBB38\uC81C\uAC00 \uC601\uAD6C \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`, "info");
      this.updateDeletedQuestionList();
    }
  };

  // app/js/modules/App.js
  var App = class {
    constructor() {
      this.questionBank = new SupabaseQuestionBank();
      this.toast = new ToastNotification();
      this.loading = new LoadingIndicator();
      this.init();
      window.app = this;
    }
    /**
     * 애플리케이션 초기화
     */
    async init() {
      domCache.init();
      await this.questionBank.init();
      const resultElement = document.getElementById("result");
      if (resultElement) {
        this.feedbackUI = new FeedbackUI(resultElement);
        this.quizUI = new QuizUI(this.questionBank, this.feedbackUI, this.toast);
      }
      this.adminUI = new AdminUI(this.questionBank, this.toast);
      this.settingsUI = new SettingsUI(this.questionBank, null, this.toast);
      this.deletedQuestionsUI = new DeletedQuestionsUI(this.questionBank, this.toast);
      this.tabManager = new TabManager();
      this.eventHandler = new DOMEventHandler(this);
      this.adminUI.updateQuestionList();
      this.updateSubjectDropdown();
      if (typeof window.updateAllSubjectDropdowns === "function") {
        window.updateAllSubjectDropdowns();
      }
      if (this.quizUI) {
        this.quizUI.updateProgress();
        this.quizUI.generateQuestion();
      }
      this.eventHandler.init();
      this.initKeyboardShortcuts();
      const editIndex = sessionStorage.getItem("editQuestionIndex");
      if (editIndex !== null && document.getElementById("tab-edit")) {
        sessionStorage.removeItem("editQuestionIndex");
        this.adminUI.editQuestion(Number(editIndex));
      }
      console.log("Quiz App \uCD08\uAE30\uD654 \uC644\uB8CC");
      console.log(`DOM \uCE90\uC2DC: ${domCache.size()}\uAC1C \uC694\uC18C`);
      console.log(`\uBB38\uC81C \uC218: ${this.questionBank.getAll().length}\uAC1C`);
      console.log(`\uC800\uC7A5\uC18C: SQLite \uD30C\uC77C \uAE30\uBC18 (\uC790\uB3D9 \uB85C\uB4DC/\uC800\uC7A5)`);
    }
    /**
     * 과목 드롭다운 업데이트
     */
    updateSubjectDropdown() {
      const dropdown = domCache.get("subjectDropdown");
      if (!dropdown) return;
      const questions = this.questionBank.getAll();
      const subjects = new Set(questions.map((q) => q.subject));
      const existingOptions = Array.from(dropdown.options).map((opt) => opt.value);
      subjects.forEach((subject) => {
        if (!existingOptions.includes(subject) && subject) {
          const option = document.createElement("option");
          option.value = subject;
          option.textContent = subject;
          dropdown.appendChild(option);
        }
      });
    }
    /**
     * 애플리케이션 정리
     */
    destroy() {
      if (this.eventHandler) {
        this.eventHandler.destroy();
      }
      domCache.clear();
    }
  };
  window.toggleQuestionType = function(type) {
    if (window.app && window.app.adminUI) {
      window.app.adminUI.switchQuestionType(type);
    }
  };
  window.manageSubjects = function(selectId) {
    const modal = document.getElementById("subjectModal");
    const subjectList = document.getElementById("subjectList");
    const savedSubjects = JSON.parse(localStorage.getItem("customSubjects") || "[]");
    const deletedDefaultSubjects = JSON.parse(localStorage.getItem("deletedDefaultSubjects") || "[]");
    const defaultSubjects = [];
    const activeDefaultSubjects = defaultSubjects.filter((s) => !deletedDefaultSubjects.includes(s));
    const allSubjects = [.../* @__PURE__ */ new Set([...activeDefaultSubjects, ...savedSubjects])];
    subjectList.innerHTML = "";
    allSubjects.forEach((subject) => {
      const item = document.createElement("div");
      item.className = "subject-item";
      item.innerHTML = `
            <span class="subject-item-name">${subject}</span>
            <button class="subject-item-delete" onclick="deleteSubject('${subject}')">\uC0AD\uC81C</button>
        `;
      subjectList.appendChild(item);
    });
    modal.style.display = "flex";
  };
  window.closeSubjectModal = function() {
    const modal = document.getElementById("subjectModal");
    modal.style.display = "none";
  };
  window.deleteSubject = function(subject) {
    if (!confirm(`"${subject}" \uACFC\uBAA9\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`)) {
      return;
    }
    const savedSubjects = JSON.parse(localStorage.getItem("customSubjects") || "[]");
    const deletedDefaultSubjects = JSON.parse(localStorage.getItem("deletedDefaultSubjects") || "[]");
    const defaultSubjects = [];
    if (defaultSubjects.includes(subject)) {
      if (!deletedDefaultSubjects.includes(subject)) {
        deletedDefaultSubjects.push(subject);
        localStorage.setItem("deletedDefaultSubjects", JSON.stringify(deletedDefaultSubjects));
      }
    } else {
      const updatedCustomSubjects = savedSubjects.filter((s) => s !== subject);
      localStorage.setItem("customSubjects", JSON.stringify(updatedCustomSubjects));
    }
    window.updateAllSubjectDropdowns();
    window.closeSubjectModal();
    if (window.app && window.app.toast) {
      window.app.toast.show(`"${subject}" \uACFC\uBAA9\uC774 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`, "success");
    }
  };
  window.switchAdminTab = function(tab) {
    const addSection = document.getElementById("add-section");
    const editSection = document.getElementById("edit-section");
    const tabAdd = document.getElementById("tab-add");
    const tabEdit = document.getElementById("tab-edit");
    if (tab === "add") {
      if (addSection) addSection.style.display = "";
      if (editSection) editSection.style.display = "none";
      if (tabAdd) tabAdd.classList.add("active");
      if (tabEdit) {
        tabEdit.classList.remove("active");
        tabEdit.style.display = "none";
      }
    } else {
      if (addSection) addSection.style.display = "none";
      if (editSection) editSection.style.display = "";
      if (tabAdd) tabAdd.classList.remove("active");
      if (tabEdit) {
        tabEdit.classList.add("active");
        tabEdit.style.display = "inline-block";
      }
    }
  };
  window.switchEditQuestionType = function(type) {
    const editForms = {
      multiple: document.getElementById("editMcForm"),
      subjective: document.getElementById("editSubForm"),
      sequence: document.getElementById("editSeqForm")
    };
    const buttons = document.querySelectorAll("#edit-section .question-type-select .tab-btn");
    Object.values(editForms).forEach((form) => {
      if (form) form.classList.remove("active");
    });
    buttons.forEach((btn2) => btn2.classList.remove("active"));
    if (editForms[type]) {
      editForms[type].classList.add("active");
    }
    const typeMap = { multiple: "edit-tab-multiple", subjective: "edit-tab-subjective", sequence: "edit-tab-sequence" };
    const btn = document.getElementById(typeMap[type]);
    if (btn) btn.classList.add("active");
  };
  window.updateAllSubjectDropdowns = function() {
    const selectIds = ["mcSubject", "subSubject", "seqSubject", "editMcSubject", "editSubSubject", "editSeqSubject"];
    selectIds.forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (!select) return;
      const currentValue = select.value;
      const savedSubjects = JSON.parse(localStorage.getItem("customSubjects") || "[]");
      const defaultSubjects = [];
      const deletedDefaultSubjects = JSON.parse(localStorage.getItem("deletedDefaultSubjects") || "[]");
      const activeDefaultSubjects = defaultSubjects.filter((s) => !deletedDefaultSubjects.includes(s));
      const allSubjects = [.../* @__PURE__ */ new Set([...activeDefaultSubjects, ...savedSubjects])];
      select.innerHTML = '<option value="" disabled selected>\uACFC\uBAA9\uC744 \uC120\uD0DD\uD558\uC138\uC694</option>';
      allSubjects.forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
      });
      if (["mcSubject", "subSubject", "seqSubject"].includes(selectId)) {
        const customOption = document.createElement("option");
        customOption.value = "custom";
        customOption.textContent = "\uC9C1\uC811 \uC785\uB825";
        select.appendChild(customOption);
      }
      if (currentValue && allSubjects.includes(currentValue)) {
        select.value = currentValue;
      }
    });
  };
  App.prototype.initKeyboardShortcuts = function() {
    document.addEventListener("keydown", (e) => {
      const tagName = e.target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return;
      }
      if (e.key >= "1" && e.key <= "4") {
        const buttonIndex = parseInt(e.key) - 1;
        const buttons = document.querySelectorAll(".options button");
        if (buttons[buttonIndex] && !buttons[buttonIndex].disabled) {
          e.preventDefault();
          buttons[buttonIndex].click();
        }
      }
    });
  };

  // app/js/main.js
  var app;
  document.addEventListener("DOMContentLoaded", () => {
    app = new App();
    console.log("Quiz App \uC2DC\uC791");
  });
  var main_default = app;
  return __toCommonJS(main_exports);
})();
