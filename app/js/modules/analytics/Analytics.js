/**
 * Analytics 클래스
 * 학습 통계 및 분석
 */

import { StorageManager } from '../storage/StorageManager.js';
import { AppConstants } from '../constants/AppConstants.js';

export class Analytics {
    constructor() {
        this.storage = new StorageManager(AppConstants.STORAGE_KEYS.ANALYTICS);
        this.sessionStart = Date.now();
        this.data = this.loadData();
    }

    /**
     * 데이터 로드
     * @returns {Object} 분석 데이터
     */
    loadData() {
        return this.storage.get('data', {
            totalQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            totalTime: 0,
            sessions: [],
            subjectStats: {},
            typeStats: {},
            dailyStats: {},
            streak: {
                current: 0,
                longest: 0,
                lastDate: null
            }
        });
    }

    /**
     * 데이터 저장
     */
    saveData() {
        this.storage.set('data', this.data);
    }

    /**
     * 문제 풀이 기록
     * @param {Object} params - 매개변수
     */
    recordAnswer({ question, isCorrect, timeSpent, subject, type }) {
        this.data.totalQuestions++;

        if (isCorrect) {
            this.data.correctAnswers++;
        } else {
            this.data.incorrectAnswers++;
        }

        this.data.totalTime += timeSpent;

        // 과목별 통계
        if (!this.data.subjectStats[subject]) {
            this.data.subjectStats[subject] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                totalTime: 0
            };
        }
        this.data.subjectStats[subject].total++;
        this.data.subjectStats[subject][isCorrect ? 'correct' : 'incorrect']++;
        this.data.subjectStats[subject].totalTime += timeSpent;

        // 문제 유형별 통계
        if (!this.data.typeStats[type]) {
            this.data.typeStats[type] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                totalTime: 0
            };
        }
        this.data.typeStats[type].total++;
        this.data.typeStats[type][isCorrect ? 'correct' : 'incorrect']++;
        this.data.typeStats[type].totalTime += timeSpent;

        // 일별 통계
        const today = this.getToday();
        if (!this.data.dailyStats[today]) {
            this.data.dailyStats[today] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                totalTime: 0
            };
        }
        this.data.dailyStats[today].total++;
        this.data.dailyStats[today][isCorrect ? 'correct' : 'incorrect']++;
        this.data.dailyStats[today].totalTime += timeSpent;

        // 연속 학습일 업데이트
        this.updateStreak();

        this.saveData();
    }

    /**
     * 오늘 날짜 문자열
     * @returns {string} YYYY-MM-DD 형식
     */
    getToday() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    /**
     * 연속 학습일 업데이트
     */
    updateStreak() {
        const today = this.getToday();
        const lastDate = this.data.streak.lastDate;

        if (lastDate === today) {
            // 오늘 이미 기록됨
            return;
        }

        if (lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
                // 연속
                this.data.streak.current++;
            } else {
                // 끊김
                this.data.streak.current = 1;
            }
        } else {
            // 첫 기록
            this.data.streak.current = 1;
        }

        if (this.data.streak.current > this.data.streak.longest) {
            this.data.streak.longest = this.data.streak.current;
        }

        this.data.streak.lastDate = today;
    }

    /**
     * 세션 시작
     */
    startSession() {
        this.sessionStart = Date.now();
    }

    /**
     * 세션 종료
     */
    endSession() {
        const duration = Date.now() - this.sessionStart;
        this.data.sessions.push({
            date: new Date().toISOString(),
            duration
        });

        // 최근 세션만 유지
        if (this.data.sessions.length > AppConstants.MAX_SESSION_HISTORY) {
            this.data.sessions = this.data.sessions.slice(-AppConstants.MAX_SESSION_HISTORY);
        }

        this.saveData();
    }

    /**
     * 전체 정답률
     * @returns {number} 정답률 (0-100)
     */
    getAccuracyRate() {
        if (this.data.totalQuestions === 0) return 0;
        return Math.round((this.data.correctAnswers / this.data.totalQuestions) * 100);
    }

    /**
     * 과목별 정답률
     * @param {string} subject - 과목명
     * @returns {number} 정답률 (0-100)
     */
    getSubjectAccuracy(subject) {
        const stats = this.data.subjectStats[subject];
        if (!stats || stats.total === 0) return 0;
        return Math.round((stats.correct / stats.total) * 100);
    }

    /**
     * 문제 유형별 정답률
     * @param {string} type - 문제 유형
     * @returns {number} 정답률 (0-100)
     */
    getTypeAccuracy(type) {
        const stats = this.data.typeStats[type];
        if (!stats || stats.total === 0) return 0;
        return Math.round((stats.correct / stats.total) * 100);
    }

    /**
     * 평균 문제 풀이 시간
     * @returns {number} 평균 시간 (ms)
     */
    getAverageTime() {
        if (this.data.totalQuestions === 0) return 0;
        return Math.round(this.data.totalTime / this.data.totalQuestions);
    }

    /**
     * 과목별 평균 시간
     * @param {string} subject - 과목명
     * @returns {number} 평균 시간 (ms)
     */
    getSubjectAverageTime(subject) {
        const stats = this.data.subjectStats[subject];
        if (!stats || stats.total === 0) return 0;
        return Math.round(stats.totalTime / stats.total);
    }

    /**
     * 최근 N일 통계
     * @param {number} days - 일수
     * @returns {Object} 통계
     */
    getRecentDaysStats(days = 7) {
        const stats = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            stats.push({
                date: dateStr,
                ...(this.data.dailyStats[dateStr] || {
                    total: 0,
                    correct: 0,
                    incorrect: 0,
                    totalTime: 0
                })
            });
        }

        return stats;
    }

    /**
     * 강점/약점 과목 분석
     * @returns {Object} 분석 결과
     */
    getStrengthsWeaknesses() {
        const subjects = Object.entries(this.data.subjectStats)
            .map(([subject, stats]) => ({
                subject,
                accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
                total: stats.total
            }))
            .filter(s => s.total >= 5)  // 최소 5문제 이상
            .sort((a, b) => b.accuracy - a.accuracy);

        return {
            strengths: subjects.slice(0, 3),
            weaknesses: subjects.slice(-3).reverse()
        };
    }

    /**
     * 학습 트렌드 분석
     * @returns {string} 트렌드 ('improving' | 'declining' | 'stable')
     */
    getLearningTrend() {
        const recent = this.getRecentDaysStats(7);
        const withData = recent.filter(d => d.total > 0);

        if (withData.length < 3) return 'stable';

        const firstHalf = withData.slice(0, Math.floor(withData.length / 2));
        const secondHalf = withData.slice(Math.floor(withData.length / 2));

        const firstAvg = firstHalf.reduce((sum, d) =>
            sum + (d.total > 0 ? (d.correct / d.total) * 100 : 0), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, d) =>
            sum + (d.total > 0 ? (d.correct / d.total) * 100 : 0), 0) / secondHalf.length;

        const diff = secondAvg - firstAvg;

        if (diff > 5) return 'improving';
        if (diff < -5) return 'declining';
        return 'stable';
    }

    /**
     * 요약 통계
     * @returns {Object} 요약
     */
    getSummary() {
        return {
            totalQuestions: this.data.totalQuestions,
            correctAnswers: this.data.correctAnswers,
            incorrectAnswers: this.data.incorrectAnswers,
            accuracyRate: this.getAccuracyRate(),
            totalTime: this.data.totalTime,
            averageTime: this.getAverageTime(),
            streak: this.data.streak,
            trend: this.getLearningTrend(),
            strengthsWeaknesses: this.getStrengthsWeaknesses()
        };
    }

    /**
     * 모든 데이터 내보내기
     * @returns {Object} 전체 데이터
     */
    exportData() {
        return { ...this.data };
    }

    /**
     * 데이터 가져오기
     * @param {Object} data - 가져올 데이터
     */
    importData(data) {
        this.data = { ...this.loadData(), ...data };
        this.saveData();
    }

    /**
     * 데이터 초기화
     */
    reset() {
        this.data = this.loadData();
        this.data = {
            totalQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            totalTime: 0,
            sessions: [],
            subjectStats: {},
            typeStats: {},
            dailyStats: {},
            streak: {
                current: 0,
                longest: 0,
                lastDate: null
            }
        };
        this.saveData();
    }
}
