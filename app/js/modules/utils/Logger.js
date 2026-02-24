/**
 * Logger 클래스
 * 디버깅 및 로깅 시스템
 */

// 환경 설정
const isDevelopment = process.env.NODE_ENV !== 'production';
const isLoggingEnabled = isDevelopment;

export class Logger {
    constructor(context = 'App') {
        this.context = context;
        this.logs = [];
        this.maxLogs = 1000;
    }

    /**
     * 로그 레벨
     */
    static LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    /**
     * 현재 설정된 로그 레벨 가져오기
     * @returns {number} 로그 레벨
     */
    static getCurrentLevel() {
        const levelMap = {
            'debug': Logger.LEVELS.DEBUG,
            'info': Logger.LEVELS.INFO,
            'warn': Logger.LEVELS.WARN,
            'error': Logger.LEVELS.ERROR
        };
        return levelMap[config.logging.level] || Logger.LEVELS.INFO;
    }

    /**
     * 로그 출력 여부 확인
     * @param {number} level - 로그 레벨
     * @returns {boolean} 출력 여부
     */
    static shouldLog(level) {
        return isLoggingEnabled() && level >= Logger.getCurrentLevel();
    }

    /**
     * 로그 포맷팅
     * @param {string} level - 레벨명
     * @param {string} context - 컨텍스트
     * @param {string} message - 메시지
     * @returns {string} 포맷된 로그
     */
    static formatLog(level, context, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] [${context}] ${message}`;
    }

    /**
     * 로그 저장
     * @param {number} level - 로그 레벨
     * @param {string} message - 메시지
     * @param {*} data - 추가 데이터
     */
    saveLog(level, message, data) {
        const log = {
            timestamp: Date.now(),
            level,
            context: this.context,
            message,
            data
        };

        this.logs.push(log);

        // 최대 로그 수 제한
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    /**
     * 디버그 로그
     * @param {string} message - 메시지
     * @param {*} data - 추가 데이터
     */
    debug(message, data = null) {
        if (!Logger.shouldLog(Logger.LEVELS.DEBUG)) return;

        const formattedLog = Logger.formatLog('DEBUG', this.context, message);

        if (config.logging.console) {
            console.log(formattedLog, data || '');
        }

        this.saveLog(Logger.LEVELS.DEBUG, message, data);
    }

    /**
     * 정보 로그
     * @param {string} message - 메시지
     * @param {*} data - 추가 데이터
     */
    info(message, data = null) {
        if (!Logger.shouldLog(Logger.LEVELS.INFO)) return;

        const formattedLog = Logger.formatLog('INFO', this.context, message);

        if (config.logging.console) {
            console.info(formattedLog, data || '');
        }

        this.saveLog(Logger.LEVELS.INFO, message, data);
    }

    /**
     * 경고 로그
     * @param {string} message - 메시지
     * @param {*} data - 추가 데이터
     */
    warn(message, data = null) {
        if (!Logger.shouldLog(Logger.LEVELS.WARN)) return;

        const formattedLog = Logger.formatLog('WARN', this.context, message);

        if (config.logging.console) {
            console.warn(formattedLog, data || '');
        }

        this.saveLog(Logger.LEVELS.WARN, message, data);
    }

    /**
     * 에러 로그
     * @param {string} message - 메시지
     * @param {Error|*} error - 에러 객체
     */
    error(message, error = null) {
        if (!Logger.shouldLog(Logger.LEVELS.ERROR)) return;

        const formattedLog = Logger.formatLog('ERROR', this.context, message);

        if (config.logging.console) {
            console.error(formattedLog, error || '');
            if (error instanceof Error) {
                console.error(error.stack);
            }
        }

        this.saveLog(Logger.LEVELS.ERROR, message, error);

        // 원격 로깅 (설정된 경우)
        if (config.logging.remote) {
            this.sendToRemote('error', message, error);
        }
    }

    /**
     * 성능 측정 시작
     * @param {string} label - 레이블
     */
    time(label) {
        if (isDevelopment()) {
            console.time(`[${this.context}] ${label}`);
        }
    }

    /**
     * 성능 측정 종료
     * @param {string} label - 레이블
     */
    timeEnd(label) {
        if (isDevelopment()) {
            console.timeEnd(`[${this.context}] ${label}`);
        }
    }

    /**
     * 그룹 시작
     * @param {string} label - 레이블
     */
    group(label) {
        if (isDevelopment() && config.logging.console) {
            console.group(`[${this.context}] ${label}`);
        }
    }

    /**
     * 그룹 종료
     */
    groupEnd() {
        if (isDevelopment() && config.logging.console) {
            console.groupEnd();
        }
    }

    /**
     * 테이블 출력
     * @param {Object|Array} data - 데이터
     */
    table(data) {
        if (isDevelopment() && config.logging.console) {
            console.table(data);
        }
    }

    /**
     * 로그 내역 조회
     * @param {number} level - 로그 레벨 (선택사항)
     * @param {number} limit - 조회할 개수
     * @returns {Array} 로그 배열
     */
    getLogs(level = null, limit = 100) {
        let logs = this.logs;

        if (level !== null) {
            logs = logs.filter(log => log.level === level);
        }

        return logs.slice(-limit);
    }

    /**
     * 로그 지우기
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * 원격 서버로 로그 전송 (구현 필요)
     * @param {string} level - 로그 레벨
     * @param {string} message - 메시지
     * @param {*} data - 데이터
     */
    sendToRemote(level, message, data) {
        // TODO: 원격 로깅 서버 구현
        // fetch('/api/logs', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ level, context: this.context, message, data })
        // });
    }

    /**
     * 로그 다운로드
     */
    downloadLogs() {
        const logsJson = JSON.stringify(this.logs, null, 2);
        const blob = new Blob([logsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 전역 로거 인스턴스
export const logger = new Logger('QuizApp');
