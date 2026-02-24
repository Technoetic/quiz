/**
 * ExportImport 클래스
 * 데이터 내보내기/가져오기 관리
 */

import { AppConstants } from '../constants/AppConstants.js';

export class ExportImport {
    /**
     * 파일 형식
     */
    static FORMATS = {
        JSON: 'json',
        CSV: 'csv',
        TXT: 'txt'
    };

    /**
     * JSON으로 내보내기
     * @param {Array} data - 데이터 배열
     * @param {string} filename - 파일명
     */
    static exportJSON(data, filename = 'questions.json') {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, filename, 'application/json');
    }

    /**
     * CSV로 내보내기
     * @param {Array} data - 데이터 배열
     * @param {string} filename - 파일명
     */
    static exportCSV(data, filename = 'questions.csv') {
        if (data.length === 0) {
            console.warn('내보낼 데이터가 없습니다.');
            return;
        }

        // CSV 헤더
        const headers = Object.keys(data[0]);
        let csv = headers.map(this.escapeCSV).join(',') + '\n';

        // CSV 데이터
        data.forEach(item => {
            const row = headers.map(header => {
                const value = item[header];
                if (Array.isArray(value)) {
                    return this.escapeCSV(JSON.stringify(value));
                }
                return this.escapeCSV(String(value || ''));
            }).join(',');
            csv += row + '\n';
        });

        this.downloadFile(csv, filename, 'text/csv;charset=utf-8');
    }

    /**
     * TXT로 내보내기 (사람이 읽기 쉬운 형식)
     * @param {Array} data - 데이터 배열
     * @param {string} filename - 파일명
     */
    static exportTXT(data, filename = 'questions.txt') {
        let text = '';

        data.forEach((item, index) => {
            text += `\n문제 ${index + 1}\n`;
            text += `${'='.repeat(50)}\n`;
            text += `과목: ${item.subject}\n`;
            text += `유형: ${this.getTypeLabel(item.type)}\n`;
            text += `문제: ${item.question}\n`;

            if (item.type === AppConstants.QUESTION_TYPES.MULTIPLE && item.options) {
                text += `\n보기:\n`;
                item.options.forEach((opt, i) => {
                    const marker = i === item.correctAnswer ? '●' : '○';
                    text += `  ${marker} ${i + 1}. ${opt}\n`;
                });
            } else if (item.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
                text += `\n정답: ${item.correctAnswer}\n`;
                if (item.alternativeAnswers && item.alternativeAnswers.length > 0) {
                    text += `대체 답변: ${item.alternativeAnswers.join(', ')}\n`;
                }
            } else if (item.type === AppConstants.QUESTION_TYPES.SEQUENCE && item.correctOrder) {
                text += `\n올바른 순서:\n`;
                item.correctOrder.forEach((step, i) => {
                    text += `  ${i + 1}. ${step}\n`;
                });
            }

            text += '\n';
        });

        this.downloadFile(text, filename, 'text/plain;charset=utf-8');
    }

    /**
     * 문제 유형 라벨
     * @param {string} type - 유형
     * @returns {string} 라벨
     */
    static getTypeLabel(type) {
        const labels = {
            [AppConstants.QUESTION_TYPES.MULTIPLE]: '객관식',
            [AppConstants.QUESTION_TYPES.SUBJECTIVE]: '주관식',
            [AppConstants.QUESTION_TYPES.SEQUENCE]: '순서나열'
        };
        return labels[type] || type;
    }

    /**
     * CSV 필드 이스케이프
     * @param {string} value - 값
     * @returns {string} 이스케이프된 값
     */
    static escapeCSV(value) {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
    }

    /**
     * 파일 다운로드
     * @param {string} content - 파일 내용
     * @param {string} filename - 파일명
     * @param {string} mimeType - MIME 타입
     */
    static downloadFile(content, filename, mimeType) {
        // BOM 추가 (한글 깨짐 방지)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 메모리 해제
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    /**
     * JSON 파일 가져오기
     * @param {File} file - 파일 객체
     * @returns {Promise<Array>} 데이터 배열
     */
    static importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        resolve(data);
                    } else {
                        reject(new Error('올바른 JSON 배열 형식이 아닙니다.'));
                    }
                } catch (error) {
                    reject(new Error('JSON 파싱 실패: ' + error.message));
                }
            };

            reader.onerror = () => {
                reject(new Error('파일 읽기 실패'));
            };

            reader.readAsText(file, 'UTF-8');
        });
    }

    /**
     * CSV 파일 가져오기
     * @param {File} file - 파일 객체
     * @returns {Promise<Array>} 데이터 배열
     */
    static importCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n').filter(line => line.trim());

                    if (lines.length < 2) {
                        reject(new Error('CSV 파일이 비어있습니다.'));
                        return;
                    }

                    // 헤더 파싱
                    const headers = this.parseCSVLine(lines[0]);

                    // 데이터 파싱
                    const data = [];
                    for (let i = 1; i < lines.length; i++) {
                        const values = this.parseCSVLine(lines[i]);
                        if (values.length === headers.length) {
                            const item = {};
                            headers.forEach((header, index) => {
                                let value = values[index];

                                // JSON 배열 파싱 시도
                                if (value.startsWith('[') && value.endsWith(']')) {
                                    try {
                                        value = JSON.parse(value);
                                    } catch (e) {
                                        // 파싱 실패시 문자열 유지
                                    }
                                }

                                // 숫자 파싱 시도
                                if (!isNaN(value) && value !== '') {
                                    value = Number(value);
                                }

                                item[header] = value;
                            });
                            data.push(item);
                        }
                    }

                    resolve(data);
                } catch (error) {
                    reject(new Error('CSV 파싱 실패: ' + error.message));
                }
            };

            reader.onerror = () => {
                reject(new Error('파일 읽기 실패'));
            };

            reader.readAsText(file, 'UTF-8');
        });
    }

    /**
     * CSV 라인 파싱
     * @param {string} line - CSV 라인
     * @returns {Array<string>} 값 배열
     */
    static parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current);
        return values;
    }

    /**
     * 파일 선택 다이얼로그 표시
     * @param {string} accept - 허용할 파일 형식
     * @returns {Promise<File>} 선택된 파일
     */
    static selectFile(accept = '.json,.csv') {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.style.display = 'none';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('파일이 선택되지 않았습니다.'));
                }
                document.body.removeChild(input);
            };

            input.oncancel = () => {
                reject(new Error('파일 선택이 취소되었습니다.'));
                document.body.removeChild(input);
            };

            document.body.appendChild(input);
            input.click();
        });
    }

    /**
     * 자동 파일 형식 감지 및 가져오기
     * @param {File} file - 파일 객체
     * @returns {Promise<Array>} 데이터 배열
     */
    static async importAuto(file) {
        const extension = file.name.split('.').pop().toLowerCase();

        switch (extension) {
            case 'json':
                return this.importJSON(file);
            case 'csv':
                return this.importCSV(file);
            default:
                throw new Error(`지원하지 않는 파일 형식입니다: ${extension}`);
        }
    }

    /**
     * 템플릿 CSV 생성
     * @param {string} filename - 파일명
     */
    static exportTemplate(filename = 'questions_template.csv') {
        const template = [
            {
                type: AppConstants.QUESTION_TYPES.MULTIPLE,
                subject: '예시 과목',
                question: '문제를 입력하세요',
                options: ['보기1', '보기2', '보기3', '보기4'],
                correctAnswer: 0,
                alternativeAnswers: [],
                correctOrder: []
            },
            {
                type: AppConstants.QUESTION_TYPES.SUBJECTIVE,
                subject: '예시 과목',
                question: '문제를 입력하세요',
                options: [],
                correctAnswer: '정답',
                alternativeAnswers: ['대체답변1', '대체답변2'],
                correctOrder: []
            },
            {
                type: AppConstants.QUESTION_TYPES.SEQUENCE,
                subject: '예시 과목',
                question: '순서를 맞추세요',
                options: [],
                correctAnswer: '',
                alternativeAnswers: [],
                correctOrder: ['첫번째', '두번째', '세번째']
            }
        ];

        this.exportCSV(template, filename);
    }

    /**
     * 데이터 검증
     * @param {Array} data - 데이터 배열
     * @returns {Object} 검증 결과 { valid: boolean, errors: string[] }
     */
    static validate(data) {
        const errors = [];

        if (!Array.isArray(data)) {
            errors.push('데이터가 배열이 아닙니다.');
            return { valid: false, errors };
        }

        data.forEach((item, index) => {
            if (!item.type) {
                errors.push(`${index + 1}번 문제: 유형(type)이 없습니다.`);
            }
            if (!item.subject) {
                errors.push(`${index + 1}번 문제: 과목(subject)이 없습니다.`);
            }
            if (!item.question) {
                errors.push(`${index + 1}번 문제: 문제(question)가 없습니다.`);
            }

            if (item.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
                if (!Array.isArray(item.options) || item.options.length !== AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT) {
                    errors.push(`${index + 1}번 문제: 객관식은 ${AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT}개의 보기가 필요합니다.`);
                }
                if (typeof item.correctAnswer !== 'number' || item.correctAnswer < 0 || item.correctAnswer > AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT - 1) {
                    errors.push(`${index + 1}번 문제: 정답은 0-${AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT - 1} 사이여야 합니다.`);
                }
            } else if (item.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
                if (!item.correctAnswer) {
                    errors.push(`${index + 1}번 문제: 정답이 없습니다.`);
                }
            } else if (item.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
                if (!Array.isArray(item.correctOrder) || item.correctOrder.length < AppConstants.SEQUENCE_MIN_ITEMS) {
                    errors.push(`${index + 1}번 문제: 최소 ${AppConstants.SEQUENCE_MIN_ITEMS}개 이상의 순서가 필요합니다.`);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
