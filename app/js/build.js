/**
 * Build script - ES6 모듈을 번들링하여 file:// 프로토콜에서도 실행 가능하게 만듦
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// 프로젝트 루트 경로
const rootDir = path.resolve(__dirname, '..');

async function build() {
    try {
        // 번들을 js 폴더에 직접 빌드
        await esbuild.build({
            entryPoints: [path.join(rootDir, 'js/main.js')],
            bundle: true,
            format: 'iife', // Immediately Invoked Function Expression
            outfile: path.join(rootDir, 'js/bundle.js'),
            minify: false, // 디버깅 용이하게 minify 안함
            sourcemap: false, // 소스맵 비활성화 (배포용)
            target: ['es2020'],
            platform: 'browser', // 브라우저 환경으로 명시
            loader: {
                '.js': 'js',
                '.mjs': 'js'
            },
            // sql-wasm.js는 번들에서 제외 (동적 import로 로드)
            external: ['../lib/sql-wasm.js'],
            define: {
                'process.env.NODE_ENV': '"production"'
            }
        });

        console.log('✅ 번들링 완료: js/bundle.js (Dexie 포함)');

        // 모든 HTML 파일 수정 (bundle.js 참조로 변경)
        const htmlFiles = ['index.html', 'admin.html', 'list.html', 'deleted.html', 'settings.html'];

        htmlFiles.forEach(htmlFile => {
            const htmlPath = path.join(rootDir, 'html', htmlFile);
            if (fs.existsSync(htmlPath)) {
                let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

                // 이미 sql.js 로드 스크립트가 있으면 건너뛰기
                if (htmlContent.includes('window.initSqlJs')) {
                    console.log(`⏭️  HTML 건너뜀 (이미 수정됨): html/${htmlFile}`);
                    return;
                }

                // type="module" 스크립트를 일반 스크립트로 변경
                htmlContent = htmlContent.replace(
                    /<script type="module" src="\.\.\/js\/main\.js"><\/script>/g,
                    '<!-- SQL.js (외부 로드) -->\n    <script type="module">\n        import initSqlJs from \'../js/lib/sql-wasm.js\';\n        window.initSqlJs = initSqlJs;\n    </script>\n\n    <!-- Main JavaScript (ES6 Modules) -->\n    <script src="../js/bundle.js"></script>'
                );

                fs.writeFileSync(htmlPath, htmlContent);
                console.log(`✅ HTML 수정 완료: html/${htmlFile}`);
            }
        });

        console.log('\n🎉 빌드 완료!');
        console.log('📁 server.js 없이도 html/*.html 파일을 더블클릭하여 실행 가능합니다.');
        console.log('⚠️  단, file:// 프로토콜에서는 일부 브라우저 제약이 있을 수 있습니다.');

    } catch (error) {
        console.error('❌ 빌드 실패:', error);
        process.exit(1);
    }
}

build();
