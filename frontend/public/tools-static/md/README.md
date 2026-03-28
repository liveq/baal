# #13 마크다운 에디터

> ⚠️ **개발 시작 전 필독!**
> 전역 개발 가이드: [`../_template/README.md`](../_template/README.md)
> Phase 1 버그, 체크리스트, 크로스 프로모션 도구 버튼 구현 확인 필수!

**URL:** md.baal.co.kr

## 서비스 내용

실시간 마크다운 미리보기. GitHub Flavored Markdown 지원. HTML/MD 다운로드

## 기능 요구사항

- [ ] 마크다운 입력 (텍스트 에리어)
- [ ] 실시간 미리보기 (2열 레이아웃)
- [ ] GitHub Flavored Markdown (GFM) 지원:
  - [ ] 테이블
  - [ ] 체크박스 (- [ ] / - [x])
  - [ ] 취소선 (~~text~~)
  - [ ] 자동 링크
- [ ] 코드 하이라이팅 (100+ 언어)
- [ ] 파일 업로드 (.md)
- [ ] 다운로드:
  - [ ] .md 파일
  - [ ] .html 파일 (스타일 포함)
- [ ] 툴바 (볼드, 이탤릭, 링크 등)
- [ ] 미리보기 동기화 (스크롤)
- [ ] 다크모드 미리보기

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **StackEdit** - 가장 인기 있는 온라인 마크다운 에디터
   - 강점: 기능 최고, Google Drive 동기화, 템플릿
   - 약점: UI 복잡, 무거움, 광고

2. **Dillinger** - 클린한 UI
   - 강점: 간단한 UI, 빠름, 다양한 export
   - 약점: 고급 기능 부족

3. **MarkdownLivePreview** - 심플
   - 강점: 빠르고 간단, 실시간 미리보기
   - 약점: 기능 제한적

4. **Editor.md** - 중국 개발
   - 강점: 다이어그램 지원, Emoji
   - 약점: 중국어 우선, 느림

5. **HackMD** - 협업 전문
   - 강점: 실시간 협업, 공유 기능
   - 약점: 회원가입 필요, 개인 사용엔 과함

### 우리의 차별화 전략

- ✅ **깔끔한 2열 레이아웃** - 입력/미리보기 동시
- ✅ **GitHub Flavored Markdown** - 100% 호환
- ✅ **빠른 로딩** - 가벼운 라이브러리
- ✅ **툴바 지원** - 버튼으로 간편 입력
- ✅ **스크롤 동기화** - 입력과 미리보기 연동
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **완전 무료** - 회원가입 불필요

## 주요 라이브러리

### 옵션 1: marked.js + highlight.js (기본 권장)

가벼운 마크다운 파서 + 코드 하이라이팅

```html
<script src="https://cdn.jsdelivr.net/npm/marked@11.0.0/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/highlight.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css">
```

```javascript
// marked 설정
marked.setOptions({
  gfm: true,              // GitHub Flavored Markdown
  breaks: true,           // 줄바꿈 자동 변환
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function(code, lang) {
    // 코드 하이라이팅
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch {
        return code;
      }
    }
    return hljs.highlightAuto(code).value;
  }
});

// 마크다운 → HTML 변환
function renderMarkdown(markdown) {
  return marked.parse(markdown);
}

// 실시간 렌더링
document.getElementById('markdown-input').addEventListener('input', (e) => {
  const markdown = e.target.value;
  const html = renderMarkdown(markdown);
  document.getElementById('preview').innerHTML = html;
});
```

**특징:**
- ✅ 빠름 (50KB)
- ✅ GFM 완벽 지원
- ✅ 코드 하이라이팅 우수
- ✅ 커스터마이징 쉬움

### 옵션 2: markdown-it (고급 기능)

플러그인 기반 확장 가능

```html
<script src="https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/markdown-it-emoji@3.0.0/dist/markdown-it-emoji.min.js"></script>
```

```javascript
const md = window.markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch {}
    }
    return '';
  }
});

// 플러그인 추가
md.use(window.markdownitEmoji);

// 렌더링
const html = md.render('# Hello :smile:');
```

**특징:**
- ✅ 플러그인 풍부
- ✅ Emoji, 각주 등 확장 기능
- ⚠️ 무거움 (100KB+)

**권장:**
- 기본: marked.js (빠르고 충분)
- 고급: markdown-it (확장 필요 시)

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────────────────────┐
│  마크다운 에디터                                 │
│  실시간 미리보기로 마크다운 작성                 │
├─────────────────────────────────────────────────┤
│  [파일 업로드] [다운로드 MD] [다운로드 HTML]     │
├─────────────────────────────────────────────────┤
│  툴바:                                           │
│  [B] [I] [Link] [Code] [List] [Quote] [Table]   │
├─────────────────────────────────────────────────┤
│  ┌─ 입력 ────────────┬─ 미리보기 ───────────┐  │
│  │ # Hello World     │  Hello World         │  │
│  │                   │  ===============     │  │
│  │ This is **bold**  │                      │  │
│  │ and *italic*.     │  This is bold        │  │
│  │                   │  and italic.         │  │
│  │ ## Code Example   │                      │  │
│  │ ```javascript     │  Code Example        │  │
│  │ console.log('hi');│  ─────────────       │  │
│  │ ```               │  console.log('hi');  │  │
│  │                   │                      │  │
│  │                   │  ☑ Task completed    │  │
│  │ - [x] Task done   │  ☐ Task pending      │  │
│  │ - [ ] Task todo   │                      │  │
│  │                   │                      │  │
│  └───────────────────┴──────────────────────┘  │
│  (스크롤 동기화)                                 │
└─────────────────────────────────────────────────┘
```

### 툴바 기능

```javascript
const toolbar = [
  { name: 'bold', icon: 'B', prefix: '**', suffix: '**', placeholder: 'bold text' },
  { name: 'italic', icon: 'I', prefix: '_', suffix: '_', placeholder: 'italic text' },
  { name: 'link', icon: '🔗', prefix: '[', suffix: '](url)', placeholder: 'link text' },
  { name: 'code', icon: '</>', prefix: '`', suffix: '`', placeholder: 'code' },
  { name: 'codeBlock', icon: '{ }', prefix: '```\n', suffix: '\n```', placeholder: 'code' },
  { name: 'list', icon: '•', prefix: '- ', suffix: '', placeholder: 'list item' },
  { name: 'quote', icon: '"', prefix: '> ', suffix: '', placeholder: 'quote' },
  { name: 'table', icon: '⊞', template: '| Header |\n| ------ |\n| Cell   |' }
];

function insertMarkdown(prefix, suffix, placeholder) {
  const textarea = document.getElementById('markdown-input');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const text = selectedText || placeholder;

  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);

  textarea.value = before + prefix + text + suffix + after;

  // 커서 위치 조정
  const newCursorPos = start + prefix.length + text.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
  textarea.focus();

  // 미리보기 업데이트
  updatePreview();
}
```

### 스크롤 동기화

```javascript
let isScrolling = false;

document.getElementById('markdown-input').addEventListener('scroll', (e) => {
  if (isScrolling) return;
  isScrolling = true;

  const input = e.target;
  const preview = document.getElementById('preview');

  const scrollPercentage = input.scrollTop / (input.scrollHeight - input.clientHeight);
  preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);

  setTimeout(() => { isScrolling = false; }, 100);
});
```

### 주요 기능 순서

1. 마크다운 입력 (또는 파일 업로드)
2. 실시간 미리보기 자동 업데이트
3. 툴바 버튼으로 서식 삽입 (선택사항)
4. 다운로드 (.md 또는 .html)

## 난이도 & 예상 기간

- **난이도:** 쉬움 (라이브러리 활용)
- **예상 기간:** 2일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] Day 1 오전: UI 구성 (2열 레이아웃), 툴바
- [ ] Day 1 오후: marked.js 통합, 실시간 렌더링
- [ ] Day 2 오전: 코드 하이라이팅, 파일 업로드/다운로드
- [ ] Day 2 오후: 스크롤 동기화, 최적화

## 트래픽 예상

⭐⭐ 중간 - 개발자, 작가, 블로거 타겟

## SEO 키워드

- 마크다운 에디터
- Markdown Editor
- 마크다운 변환
- MD to HTML
- 마크다운 미리보기
- GitHub Markdown
- 온라인 마크다운 에디터

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & 실무 이슈 기반)

1. **실시간 렌더링 시 성능 저하 (긴 문서)**
   - 원인: 매 입력마다 전체 문서 파싱
   - 해결: Debounce (300ms)
   - 코드:
     ```javascript
     let debounceTimer;

     document.getElementById('markdown-input').addEventListener('input', (e) => {
       clearTimeout(debounceTimer);
       debounceTimer = setTimeout(() => {
         const markdown = e.target.value;
         const html = marked.parse(markdown);
         document.getElementById('preview').innerHTML = html;
       }, 300); // 300ms 대기
     });
     ```

2. **XSS 공격 위험 (HTML 인젝션)**
   - 원인: 사용자가 `<script>` 태그 입력
   - 해결: DOMPurify로 sanitize
   - 코드:
     ```html
     <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
     ```
     ```javascript
     function renderMarkdown(markdown) {
       const rawHtml = marked.parse(markdown);
       const cleanHtml = DOMPurify.sanitize(rawHtml, {
         ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'strong', 'em', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br', 'del', 'input'],
         ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'type', 'checked', 'disabled']
       });
       return cleanHtml;
     }
     ```

3. **체크박스 클릭 시 마크다운에 반영 안 됨**
   - 원인: HTML 체크박스는 읽기 전용
   - 해결: 체크박스 클릭 이벤트로 마크다운 수정
   - 코드:
     ```javascript
     document.getElementById('preview').addEventListener('click', (e) => {
       if (e.target.type === 'checkbox' && e.target.dataset.line) {
         const lineNumber = parseInt(e.target.dataset.line);
         const textarea = document.getElementById('markdown-input');
         const lines = textarea.value.split('\n');

         // [ ] ↔ [x] 토글
         if (lines[lineNumber].includes('- [ ]')) {
           lines[lineNumber] = lines[lineNumber].replace('- [ ]', '- [x]');
         } else if (lines[lineNumber].includes('- [x]')) {
           lines[lineNumber] = lines[lineNumber].replace('- [x]', '- [ ]');
         }

         textarea.value = lines.join('\n');
         updatePreview();
       }
     });
     ```

4. **코드 블록 하이라이팅 안 됨 (언어 미지정)**
   - 원인: ```code``` 형식에서 언어 없음
   - 해결: highlight.js 자동 감지
   - 코드:
     ```javascript
     marked.setOptions({
       highlight: function(code, lang) {
         if (lang && hljs.getLanguage(lang)) {
           return hljs.highlight(code, { language: lang }).value;
         }
         // 언어 미지정 시 자동 감지
         return hljs.highlightAuto(code).value;
       }
     });
     ```

5. **다운로드한 HTML에 스타일 없음 (깨짐)**
   - 원인: CSS 링크 누락
   - 해결: 스타일 inline으로 포함
   - 코드:
     ```javascript
     function downloadHTML(markdown) {
       const html = marked.parse(markdown);
       const styledHtml = `
     <!DOCTYPE html>
     <html lang="ko">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Markdown Preview</title>
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css">
       <style>
         body {
           max-width: 800px;
           margin: 40px auto;
           padding: 20px;
           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
           line-height: 1.6;
           color: #333;
         }
         code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
         pre { background: #282c34; color: #abb2bf; padding: 16px; border-radius: 8px; overflow-x: auto; }
         pre code { background: none; padding: 0; }
         table { border-collapse: collapse; width: 100%; margin: 16px 0; }
         th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
         th { background: #f4f4f4; }
         blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
         img { max-width: 100%; }
       </style>
     </head>
     <body>
       ${html}
     </body>
     </html>
       `;

       const blob = new Blob([styledHtml], { type: 'text/html' });
       const link = document.createElement('a');
       link.href = URL.createObjectURL(blob);
       link.download = 'markdown.html';
       link.click();
       URL.revokeObjectURL(link.href);
     }
     ```

6. **파일 업로드 시 인코딩 오류 (한글 깨짐)**
   - 원인: UTF-8 인코딩 미지정
   - 해결: FileReader에 UTF-8 명시
   - 코드:
     ```javascript
     function uploadMarkdown(file) {
       const reader = new FileReader();
       reader.onload = (e) => {
         const content = e.target.result;
         document.getElementById('markdown-input').value = content;
         updatePreview();
       };
       // UTF-8로 읽기
       reader.readAsText(file, 'UTF-8');
     }
     ```

7. **테이블 미리보기가 안 보임 (GFM 미지원)**
   - 원인: marked의 GFM 옵션 비활성화
   - 해결: gfm: true, tables: true 설정
   - 코드:
     ```javascript
     marked.setOptions({
       gfm: true,      // GitHub Flavored Markdown
       tables: true,   // 테이블 지원
       breaks: true    // 줄바꿈 자동 변환
     });
     ```

## 추가 기능 (선택사항)

### 마크다운 템플릿

```javascript
const templates = {
  readme: `# Project Title

## Description
A brief description of your project.

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`javascript
const app = require('./app');
app.start();
\`\`\`

## License
MIT`,

  blog: `# Blog Post Title

*Published on: ${new Date().toLocaleDateString()}*

## Introduction
Your introduction here...

## Main Content
- Point 1
- Point 2
- Point 3

## Conclusion
Final thoughts...`,

  doc: `# API Documentation

## Endpoint: /api/users

### GET /api/users
Returns a list of users.

**Response:**
\`\`\`json
{
  "users": [
    { "id": 1, "name": "John" }
  ]
}
\`\`\``
};

function loadTemplate(templateName) {
  document.getElementById('markdown-input').value = templates[templateName];
  updatePreview();
}
```

### 단축키 지원

```javascript
document.getElementById('markdown-input').addEventListener('keydown', (e) => {
  // Ctrl/Cmd + B: Bold
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    insertMarkdown('**', '**', 'bold text');
  }

  // Ctrl/Cmd + I: Italic
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
    e.preventDefault();
    insertMarkdown('_', '_', 'italic text');
  }

  // Ctrl/Cmd + K: Link
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    insertMarkdown('[', '](url)', 'link text');
  }
});
```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- **경쟁사 분석 완료:**
  - StackEdit, Dillinger, MarkdownLivePreview 조사
  - 차별화: 빠른 로딩, 툴바, 스크롤 동기화
- **라이브러리 조사 완료:**
  - marked.js (기본) - 빠름, GFM 지원
  - markdown-it (고급) - 플러그인 풍부
  - highlight.js (코드 하이라이팅)
  - DOMPurify (XSS 방지)
- **실제 이슈 파악:**
  - 성능 저하, XSS 공격, 체크박스 동기화
  - 스타일 누락, 인코딩 오류
- **UI/UX 패턴:**
  - 2열 레이아웃, 툴바, 스크롤 동기화

## 참고 자료

- [marked.js GitHub](https://github.com/markedjs/marked)
- [highlight.js](https://highlightjs.org/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [markdown-it GitHub](https://github.com/markdown-it/markdown-it)
- [DOMPurify](https://github.com/cure53/DOMPurify)
