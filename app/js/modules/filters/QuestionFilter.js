/**
 * QuestionFilter 클래스
 * 문제 필터링 및 검색
 */

import { AppConstants } from '../constants/AppConstants.js';

export class QuestionFilter {
    constructor(questions = []) {
        this.questions = questions;
        this.filters = {
            type: null,
            subject: null,
            searchText: null,
            dateRange: null,
            answered: null
        };
    }

    /**
     * 문제 목록 설정
     * @param {Array} questions - 문제 배열
     */
    setQuestions(questions) {
        this.questions = questions;
        return this;
    }

    /**
     * 유형 필터
     * @param {string} type - 문제 유형
     * @returns {QuestionFilter} this
     */
    byType(type) {
        this.filters.type = type;
        return this;
    }

    /**
     * 과목 필터
     * @param {string} subject - 과목명
     * @returns {QuestionFilter} this
     */
    bySubject(subject) {
        this.filters.subject = subject;
        return this;
    }

    /**
     * 텍스트 검색
     * @param {string} text - 검색어
     * @returns {QuestionFilter} this
     */
    search(text) {
        this.filters.searchText = text;
        return this;
    }

    /**
     * 날짜 범위 필터
     * @param {Date} start - 시작일
     * @param {Date} end - 종료일
     * @returns {QuestionFilter} this
     */
    byDateRange(start, end) {
        this.filters.dateRange = { start, end };
        return this;
    }

    /**
     * 답변 상태 필터
     * @param {boolean} answered - 답변 여부 (true: 답변함, false: 미답변, null: 전체)
     * @param {Set} answeredQuestions - 답변한 문제 인덱스 Set
     * @returns {QuestionFilter} this
     */
    byAnsweredStatus(answered, answeredQuestions) {
        this.filters.answered = { status: answered, set: answeredQuestions };
        return this;
    }

    /**
     * 필터 적용
     * @returns {Array} 필터링된 문제 배열
     */
    apply() {
        let filtered = [...this.questions];

        // 유형 필터
        if (this.filters.type) {
            filtered = filtered.filter(q => q.type === this.filters.type);
        }

        // 과목 필터
        if (this.filters.subject) {
            filtered = filtered.filter(q => q.subject === this.filters.subject);
        }

        // 텍스트 검색
        if (this.filters.searchText) {
            const searchLower = this.filters.searchText.toLowerCase();
            filtered = filtered.filter(q => {
                // 문제 내용 검색
                if (q.question.toLowerCase().includes(searchLower)) return true;

                // 과목 검색
                if (q.subject.toLowerCase().includes(searchLower)) return true;

                // 옵션 검색 (객관식)
                if (q.options && Array.isArray(q.options)) {
                    return q.options.some(opt =>
                        opt.toLowerCase().includes(searchLower)
                    );
                }

                // 정답 검색 (주관식)
                if (q.correctAnswer && typeof q.correctAnswer === 'string') {
                    return q.correctAnswer.toLowerCase().includes(searchLower);
                }

                // 순서 검색 (순서나열)
                if (q.correctOrder && Array.isArray(q.correctOrder)) {
                    return q.correctOrder.some(item =>
                        item.toLowerCase().includes(searchLower)
                    );
                }

                return false;
            });
        }

        // 날짜 범위 필터
        if (this.filters.dateRange) {
            const { start, end } = this.filters.dateRange;
            filtered = filtered.filter(q => {
                if (!q.createdAt) return true;
                const date = new Date(q.createdAt);
                return date >= start && date <= end;
            });
        }

        // 답변 상태 필터
        if (this.filters.answered && this.filters.answered.status !== null) {
            const { status, set } = this.filters.answered;
            filtered = filtered.filter(q => {
                const isAnswered = set.has(q.index);
                return status ? isAnswered : !isAnswered;
            });
        }

        return filtered;
    }

    /**
     * 필터 초기화
     * @returns {QuestionFilter} this
     */
    reset() {
        this.filters = {
            type: null,
            subject: null,
            searchText: null,
            dateRange: null,
            answered: null
        };
        return this;
    }

    /**
     * 정렬
     * @param {string} field - 정렬 필드
     * @param {string} order - 정렬 순서 ('asc' | 'desc')
     * @returns {Array} 정렬된 문제 배열
     */
    sort(field, order = 'asc') {
        const filtered = this.apply();

        return filtered.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // 문자열 비교
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * 그룹화
     * @param {string} field - 그룹화 필드
     * @returns {Object} 그룹화된 객체
     */
    groupBy(field) {
        const filtered = this.apply();
        const groups = {};

        filtered.forEach(q => {
            const key = q[field] || '기타';
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(q);
        });

        return groups;
    }

    /**
     * 페이지네이션
     * @param {number} page - 페이지 번호 (1부터 시작)
     * @param {number} pageSize - 페이지 크기
     * @returns {Object} { items, totalPages, currentPage }
     */
    paginate(page, pageSize) {
        const filtered = this.apply();
        const totalPages = Math.ceil(filtered.length / pageSize);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        return {
            items: filtered.slice(start, end),
            totalPages,
            currentPage: page,
            totalItems: filtered.length
        };
    }

    /**
     * 통계
     * @returns {Object} 통계 정보
     */
    getStats() {
        const filtered = this.apply();

        const stats = {
            total: filtered.length,
            byType: {},
            bySubject: {}
        };

        filtered.forEach(q => {
            // 유형별
            if (!stats.byType[q.type]) {
                stats.byType[q.type] = 0;
            }
            stats.byType[q.type]++;

            // 과목별
            if (!stats.bySubject[q.subject]) {
                stats.bySubject[q.subject] = 0;
            }
            stats.bySubject[q.subject]++;
        });

        return stats;
    }

    /**
     * 고급 검색
     * @param {Object} criteria - 검색 조건
     * @returns {Array} 필터링된 문제 배열
     */
    advancedSearch(criteria) {
        let results = [...this.questions];

        if (criteria.types && criteria.types.length > 0) {
            results = results.filter(q => criteria.types.includes(q.type));
        }

        if (criteria.subjects && criteria.subjects.length > 0) {
            results = results.filter(q => criteria.subjects.includes(q.subject));
        }

        if (criteria.keywords && criteria.keywords.length > 0) {
            results = results.filter(q => {
                const content = JSON.stringify(q).toLowerCase();
                return criteria.keywords.every(keyword =>
                    content.includes(keyword.toLowerCase())
                );
            });
        }

        if (criteria.excludeKeywords && criteria.excludeKeywords.length > 0) {
            results = results.filter(q => {
                const content = JSON.stringify(q).toLowerCase();
                return !criteria.excludeKeywords.some(keyword =>
                    content.includes(keyword.toLowerCase())
                );
            });
        }

        return results;
    }

    /**
     * 랜덤 선택
     * @param {number} count - 선택할 개수
     * @returns {Array} 랜덤 문제 배열
     */
    random(count) {
        const filtered = this.apply();
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * 중복 제거
     * @param {string} field - 중복 체크 필드
     * @returns {Array} 중복 제거된 문제 배열
     */
    unique(field = 'question') {
        const filtered = this.apply();
        const seen = new Set();
        const unique = [];

        filtered.forEach(q => {
            const value = q[field];
            if (!seen.has(value)) {
                seen.add(value);
                unique.push(q);
            }
        });

        return unique;
    }

    /**
     * 현재 필터 상태 가져오기
     * @returns {Object} 필터 상태
     */
    getFilters() {
        return { ...this.filters };
    }

    /**
     * 필터 상태 설정
     * @param {Object} filters - 필터 상태
     * @returns {QuestionFilter} this
     */
    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        return this;
    }

    /**
     * 체이닝을 위한 정적 팩토리 메서드
     * @param {Array} questions - 문제 배열
     * @returns {QuestionFilter} 인스턴스
     */
    static create(questions) {
        return new QuestionFilter(questions);
    }
}
