/**
 * 메인 JavaScript 파일
 * 애플리케이션 초기화
 */

import { App } from './modules/App.js';

// 전역 앱 인스턴스
let app;

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    app = new App();

    console.log('Quiz App 시작');
});

// 모듈을 기본 내보내기로도 제공
export default app;
