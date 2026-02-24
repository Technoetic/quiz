const { chromium } = require('../../node_modules/playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync, spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const DB_PATH = path.join(__dirname, '..', 'data', 'questions.db');
const SERVER_PATH = path.join(__dirname, 'server.js');

let passed = 0;
let failed = 0;

function ok(label, value) {
    if (value) {
        console.log(`  ✅ ${label}`);
        passed++;
    } else {
        console.log(`  ❌ ${label}`);
        failed++;
    }
}

function isPortInUse(port) {
    try {
        const result = execSync(`netstat -ano | findstr ":${port} " | findstr "LISTENING"`, { encoding: 'utf8' });
        return result.trim().length > 0;
    } catch {
        return false;
    }
}

function killPort(port) {
    try {
        const result = execSync(`netstat -ano | findstr ":${port} " | findstr "LISTENING"`, { encoding: 'utf8' });
        const lines = result.trim().split('\n');
        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
                try { execSync(`taskkill /PID ${pid} /F`); } catch {}
            }
        }
    } catch {}
}

function waitForServer(port, timeout = 5000) {
    return new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
            const req = http.get(`http://localhost:${port}/html/index.html`, (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => {
                if (Date.now() - start < timeout) setTimeout(check, 300);
                else resolve(false);
            });
            req.end();
        };
        check();
    });
}

(async () => {
    // ─────────────────────────────────────────
    console.log('\n[1] start.bat 핵심 로직: 포트 킬 후 서버 재시작');
    // ─────────────────────────────────────────

    ok('3000 포트 점유 중 (킬 대상)', isPortInUse(3000));

    killPort(3000);
    await new Promise(r => setTimeout(r, 800));
    ok('포트 킬 후 3000 비워짐', !isPortInUse(3000));

    const serverProc = spawn('node', [SERVER_PATH], { detached: true, stdio: 'ignore' });
    serverProc.unref();
    const serverUp = await waitForServer(3000);
    ok('서버 재시작 후 응답', serverUp);

    // ─────────────────────────────────────────
    console.log('\n[2] start.bat UX 구성 검증');
    // ─────────────────────────────────────────
    const batContent = fs.readFileSync(path.join(__dirname, '..', 'start.bat'), 'ascii');
    ok('color 0A (초록 터미널)', batContent.includes('color 0A'));
    ok('title 설정', batContent.includes('title'));
    ok('프로그레스 바 포함', batContent.includes('[####'));
    ok('READY 메시지', batContent.includes('READY'));
    ok('Access URL 표시', batContent.includes('http://localhost:3000'));
    ok('포트 킬 로직', batContent.includes('taskkill'));
    ok('서버 실행 로직', batContent.includes('node') && batContent.includes('server.js'));

    // ─────────────────────────────────────────
    console.log('\n[3] 페이지 로드');
    // ─────────────────────────────────────────
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => consoleErrors.push(err.message));

    const res = await page.goto(`${BASE_URL}/html/index.html`, { waitUntil: 'networkidle' });
    ok('index.html 200', res.status() === 200);
    ok('타이틀 정상', (await page.title()).includes('문제'));

    // ─────────────────────────────────────────
    console.log('\n[4] 정적 리소스');
    // ─────────────────────────────────────────
    for (const r of ['/js/bundle.js', '/css/style.css', '/data/questions.db', '/js/lib/sql-wasm.js']) {
        const resp = await page.request.get(`${BASE_URL}${r}`);
        ok(r, resp.status() === 200);
    }

    // ─────────────────────────────────────────
    console.log('\n[5] POST /api/save-db');
    // ─────────────────────────────────────────
    const dbData = fs.readFileSync(DB_PATH);
    const mtimeBefore = fs.statSync(DB_PATH).mtimeMs;
    const apiRes = await page.request.post(`${BASE_URL}/api/save-db`, {
        headers: { 'Content-Type': 'application/octet-stream' },
        data: dbData,
    });
    ok('응답 200', apiRes.status() === 200);
    ok('{"ok":true}', (await apiRes.json()).ok === true);
    ok('DB 파일 갱신', fs.statSync(DB_PATH).mtimeMs >= mtimeBefore);

    // ─────────────────────────────────────────
    console.log('\n[6] 에러 처리');
    // ─────────────────────────────────────────
    ok('없는 파일 404', (await page.request.get(`${BASE_URL}/nonexistent.js`)).status() === 404);
    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    ok('콘솔 에러 없음', criticalErrors.length === 0);
    if (criticalErrors.length > 0) criticalErrors.forEach(e => console.log(`     ⚠️  ${e}`));

    await browser.close();

    console.log(`\n${'─'.repeat(40)}`);
    console.log(`결과: ${passed + failed}개 중 ✅ ${passed}개 통과 / ❌ ${failed}개 실패`);
    console.log('─'.repeat(40));

    process.exit(failed > 0 ? 1 : 0);
})();
