# #17 차트 생성기

**URL:** chart.baal.co.kr

## 서비스 내용

데이터 시각화 차트 생성 (Line, Bar, Pie, Doughnut, Scatter, Radar). CSV/JSON 입력. 커스터마이징. PNG/SVG 다운로드

## 기능 요구사항

- [ ] 차트 타입 선택:
  - [ ] Line Chart (선 그래프)
  - [ ] Bar Chart (막대 그래프)
  - [ ] Pie Chart (원형 그래프)
  - [ ] Doughnut Chart (도넛 그래프)
  - [ ] Scatter Chart (산점도)
  - [ ] Radar Chart (방사형 그래프)
- [ ] 데이터 입력 방식:
  - [ ] 수동 입력 (테이블)
  - [ ] CSV 업로드
  - [ ] JSON 입력
- [ ] 커스터마이징:
  - [ ] 색상 팔레트 (사전 정의/커스텀)
  - [ ] 레이블 편집
  - [ ] 범례 위치 (상/하/좌/우/숨김)
  - [ ] 애니메이션 ON/OFF
  - [ ] 그리드 표시/숨김
  - [ ] 축 레이블 설정
- [ ] 차트 미리보기 (실시간)
- [ ] PNG 다운로드
- [ ] SVG 다운로드 (또는 고해상도 PNG)
- [ ] JSON 데이터 다운로드
- [ ] 차트 크기 조절 (800x600 / 1920x1080 등)
- [ ] 반응형 차트 (모바일 대응)

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **ChartBlocks** - 고급 차트 빌더
   - 강점: 다양한 차트 타입, 데이터 연동, 대시보드
   - 약점: 무료는 3개 제한, 회원가입 필수

2. **Infogram** - 인포그래픽 전문
   - 강점: 인포그래픽+차트 통합, 템플릿 많음
   - 약점: 무료는 워터마크, 기능 제한

3. **LiveGap Charts** - 간단한 차트 생성기
   - 강점: 완전 무료, 빠름, 간단한 UI
   - 약점: 기능 제한적, 디자인 구식

4. **Rapid Tables Chart Maker** - 학생용 도구
   - 강점: 간단, 무료
   - 약점: 차트 타입 제한적, 커스터마이징 부족

5. **Meta-Chart** - 온라인 차트 도구
   - 강점: 무료, 다양한 타입
   - 약점: UI 복잡, 속도 느림

### 우리의 차별화 전략

- ✅ **완전 무료** - 제한 없음, 워터마크 없음
- ✅ **브라우저 기반** - 설치 불필요, 즉시 사용
- ✅ **최신 라이브러리** - Chart.js v4 (2025년 표준)
- ✅ **고품질 다운로드** - PNG, SVG 모두 지원
- ✅ **간단한 UI** - 3단계로 차트 완성
- ✅ **CSV/JSON 지원** - 대량 데이터 입력 편리
- ✅ **다크모드** 지원
- ✅ **반응형** - 모바일에서도 완벽

## 주요 라이브러리

### 옵션 1: Chart.js v4 (추천!)

가장 인기 있는 JavaScript 차트 라이브러리 (60k+ GitHub Stars)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### 기본 사용법

```javascript
// 1. Line Chart (선 그래프)
const lineChart = new Chart(document.getElementById('chart-canvas'), {
  type: 'line',
  data: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{
      label: '매출',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4, // 곡선 정도
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '월별 매출 현황'
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// 2. Bar Chart (막대 그래프)
const barChart = new Chart(document.getElementById('chart-canvas'), {
  type: 'bar',
  data: {
    labels: ['빨강', '파랑', '노랑', '초록', '보라', '주황'],
    datasets: [{
      label: '투표 수',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// 3. Pie Chart (원형 그래프)
const pieChart = new Chart(document.getElementById('chart-canvas'), {
  type: 'pie',
  data: {
    labels: ['빨강', '파랑', '노랑'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  }
});

// 4. Doughnut Chart (도넛 그래프)
const doughnutChart = new Chart(document.getElementById('chart-canvas'), {
  type: 'doughnut',
  data: {
    labels: ['빨강', '파랑', '노랑'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// 5. Scatter Chart (산점도)
const scatterChart = new Chart(document.getElementById('chart-canvas'), {
  type: 'scatter',
  data: {
    datasets: [{
      label: 'Scatter Dataset',
      data: [
        { x: -10, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 5 },
        { x: 0.5, y: 5.5 }
      ],
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom'
      }
    }
  }
});

// 6. Radar Chart (방사형 그래프)
const radarChart = new Chart(document.getElementById('chart-canvas'), {
  type: 'radar',
  data: {
    labels: ['공격', '방어', '속도', '체력', '정신'],
    datasets: [{
      label: 'Player 1',
      data: [65, 59, 90, 81, 56],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: 'Player 2',
      data: [28, 48, 40, 19, 96],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  },
  options: {
    responsive: true,
    elements: {
      line: {
        borderWidth: 3
      }
    }
  }
});
```

### CSV 데이터 파싱 및 차트 생성

```javascript
// CSV 파일 읽기
async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());

      // 첫 줄: 레이블
      const labels = lines[0].split(',').map(s => s.trim());

      // 나머지 줄: 데이터
      const datasets = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const label = values[0].trim();
        const data = values.slice(1).map(v => parseFloat(v));

        return {
          label: label,
          data: data,
          borderColor: getRandomColor(index),
          backgroundColor: getRandomColor(index, 0.2)
        };
      });

      resolve({ labels: labels.slice(1), datasets });
    };
    reader.onerror = reject;
    reader.readAsText(file, 'UTF-8');
  });
}

// CSV 예시:
// , 1월, 2월, 3월, 4월, 5월, 6월
// 매출, 12, 19, 3, 5, 2, 3
// 비용, 5, 8, 2, 3, 1, 2

// 사용 예
const fileInput = document.getElementById('csv-input');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const { labels, datasets } = await parseCSV(file);
    createChart('line', labels, datasets);
  }
});

// 랜덤 색상 생성
function getRandomColor(index, alpha = 1) {
  const colors = [
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 206, 86, ${alpha})`,
    `rgba(75, 192, 192, ${alpha})`,
    `rgba(153, 102, 255, ${alpha})`,
    `rgba(255, 159, 64, ${alpha})`
  ];
  return colors[index % colors.length];
}
```

### PNG 다운로드

```javascript
// PNG 다운로드 (Canvas toBlob)
function downloadChartAsPNG(chart) {
  const canvas = chart.canvas;
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart.png';
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// 고해상도 PNG (2x)
function downloadHighResPNG(chart) {
  const originalCanvas = chart.canvas;
  const scale = 2;

  // 고해상도 Canvas 생성
  const highResCanvas = document.createElement('canvas');
  highResCanvas.width = originalCanvas.width * scale;
  highResCanvas.height = originalCanvas.height * scale;

  const ctx = highResCanvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.drawImage(originalCanvas, 0, 0);

  highResCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart-hd.png';
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// JSON 데이터 다운로드
function downloadChartData(chart) {
  const data = JSON.stringify(chart.data, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'chart-data.json';
  link.click();
  URL.revokeObjectURL(url);
}
```

### 옵션 2: ApexCharts (SVG 기반)

SVG 기반 차트 라이브러리, 모던한 디자인

```html
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
```

```javascript
// ApexCharts 기본 사용법
const options = {
  series: [{
    name: '매출',
    data: [12, 19, 3, 5, 2, 3]
  }],
  chart: {
    type: 'line',
    height: 350,
    toolbar: {
      show: true,
      tools: {
        download: true
      }
    }
  },
  xaxis: {
    categories: ['1월', '2월', '3월', '4월', '5월', '6월']
  },
  stroke: {
    curve: 'smooth'
  },
  colors: ['#008FFB']
};

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// SVG 다운로드 (내장 기능)
chart.dataURI().then((uri) => {
  const link = document.createElement('a');
  link.href = uri.imgURI;
  link.download = 'chart.svg';
  link.click();
});

// PNG 다운로드 (내장 기능)
chart.dataURI({ scale: 2 }).then((uri) => {
  const link = document.createElement('a');
  link.href = uri.imgURI;
  link.download = 'chart.png';
  link.click();
});
```

**Chart.js vs ApexCharts:**

| 특징 | Chart.js | ApexCharts |
|------|----------|------------|
| 기반 | Canvas | SVG |
| 성능 | 대량 데이터 빠름 | 중간 |
| 인기도 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| SVG 지원 | ❌ | ✅ |
| 애니메이션 | 기본 | 고급 |
| 추천 | **일반적** | SVG 필수 시 |

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────┐
│  차트 생성기                      │
│  데이터 시각화 도구                │
├─────────────────────────────────┤
│  1️⃣ 차트 타입 선택                │
│  [Line] [Bar] [Pie] [Doughnut]  │
│  [Scatter] [Radar]              │
├─────────────────────────────────┤
│  2️⃣ 데이터 입력                   │
│  입력 방식: ● 수동  ○ CSV  ○ JSON│
│                                 │
│  레이블:  [1월] [2월] [3월] [+] │
│  매출:    [12]  [19]  [3]   [+] │
│  비용:    [5]   [8]   [2]   [+] │
│                                 │
│  또는 파일 업로드: [CSV 선택]    │
├─────────────────────────────────┤
│  3️⃣ 커스터마이징                  │
│  색상 팔레트: [기본] [무지개] [커스텀]│
│  범례 위치: [상] [하] [좌] [우] [숨김]│
│  ☑ 애니메이션  ☑ 그리드 표시     │
│  차트 제목: [월별 매출 현황     ]│
│  Y축 레이블: [금액 (만원)       ]│
├─────────────────────────────────┤
│  4️⃣ 미리보기                      │
│  ┌─────────────────────────┐    │
│  │  월별 매출 현황          │    │
│  │  ╱                      │    │
│  │ ╱  ╲                    │    │
│  │╱    ╲  ╱╲              │    │
│  │       ╲╱  ╲             │    │
│  │ 1월 2월 3월 4월 5월 6월 │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  [PNG 다운로드] [JSON 다운로드]  │
│  크기: [800x600 ▼]              │
└─────────────────────────────────┘
```

### 차트 타입별 활용

**Line Chart (선 그래프):**
- 용도: 시계열 데이터, 트렌드 분석
- 예시: 주가, 매출, 온도 변화

**Bar Chart (막대 그래프):**
- 용도: 카테고리별 비교
- 예시: 판매량, 설문 조사, 순위

**Pie Chart (원형 그래프):**
- 용도: 비율 표시
- 예시: 시장 점유율, 예산 분배

**Doughnut Chart (도넛 그래프):**
- 용도: Pie Chart + 중앙 여백
- 예시: 투표 결과, 카테고리 비율

**Scatter Chart (산점도):**
- 용도: 상관관계 분석
- 예시: 키-몸무게, 공부시간-성적

**Radar Chart (방사형 그래프):**
- 용도: 다변량 데이터 비교
- 예시: 게임 캐릭터 능력치, 제품 비교

### 주요 기능 순서

1. 차트 타입 선택 (Line, Bar 등)
2. 데이터 입력 (수동/CSV/JSON)
3. 커스터마이징 (색상, 레이블, 범례)
4. 실시간 미리보기
5. 다운로드 (PNG/JSON)

## 난이도 & 예상 기간

- **난이도:** 보통 (Chart.js 라이브러리, CSV 파싱)
- **예상 기간:** 2.5일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] Day 1 오전: UI 구성, 타입 선택, 기본 차트 생성 (Line, Bar)
- [ ] Day 1 오후: 수동 데이터 입력 (테이블), 실시간 미리보기
- [ ] Day 2 오전: CSV 업로드 및 파싱, JSON 입력
- [ ] Day 2 오후: 추가 차트 타입 (Pie, Doughnut, Scatter, Radar)
- [ ] Day 3 오전: 커스터마이징 (색상, 범례, 애니메이션), PNG 다운로드
- [ ] Day 3 오후: 반응형 처리, 테스트, 최적화

## 트래픽 예상

⭐⭐⭐ 높음 - "차트 생성, 그래프 만들기" 검색량 매우 높음 (학생, 직장인)

## SEO 키워드

- 차트 생성기
- 그래프 만들기
- 무료 차트 도구
- 엑셀 차트
- 데이터 시각화
- CSV 차트
- 온라인 그래프
- 원형 그래프 생성

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & Chart.js 기반)

1. **대량 데이터 입력 시 차트 렌더링 느림**
   - 원인: 1000개 이상 데이터 포인트
   - 해결: 데이터 포인트 제한 (최대 500개)
   - 해결: 샘플링 또는 집계 제안
   - 코드:
     ```javascript
     const MAX_DATA_POINTS = 500;

     function validateDataSize(data) {
       if (data.length > MAX_DATA_POINTS) {
         showToast(`데이터가 너무 많습니다. (최대 ${MAX_DATA_POINTS}개). 샘플링을 권장합니다.`, 'warning');
         return false;
       }
       return true;
     }

     // 데이터 샘플링 (균등 간격)
     function sampleData(data, maxPoints) {
       if (data.length <= maxPoints) return data;

       const step = Math.ceil(data.length / maxPoints);
       return data.filter((_, index) => index % step === 0);
     }

     // 사용 예
     let chartData = originalData;
     if (chartData.length > MAX_DATA_POINTS) {
       chartData = sampleData(chartData, MAX_DATA_POINTS);
       showToast(`데이터를 ${chartData.length}개로 샘플링했습니다.`, 'info');
     }
     ```

2. **CSV 파일 파싱 오류 (쉼표, 따옴표)**
   - 원인: CSV 내부에 쉼표 포함 ("서울, 강남"), 따옴표 처리
   - 해결: Papa Parse 라이브러리 사용 (RFC 4180 준수)
   - 코드:
     ```javascript
     // Papa Parse CDN
     // <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

     function parseCSVWithPapaParse(file) {
       return new Promise((resolve, reject) => {
         Papa.parse(file, {
           header: true,
           dynamicTyping: true, // 숫자 자동 변환
           skipEmptyLines: true,
           complete: (results) => {
             if (results.errors.length > 0) {
               console.error('CSV 파싱 오류:', results.errors);
               showToast('CSV 파일 형식이 올바르지 않습니다.', 'error');
               reject(results.errors);
             } else {
               resolve(results.data);
             }
           },
           error: reject
         });
       });
     }

     // 사용 예
     const csvFile = document.getElementById('csv-input').files[0];
     const data = await parseCSVWithPapaParse(csvFile);

     // data = [
     //   { 월: '1월', 매출: 12, 비용: 5 },
     //   { 월: '2월', 매출: 19, 비용: 8 },
     //   ...
     // ]

     const labels = data.map(row => row['월']);
     const datasets = [
       {
         label: '매출',
         data: data.map(row => row['매출']),
         borderColor: 'rgb(75, 192, 192)'
       },
       {
         label: '비용',
         data: data.map(row => row['비용']),
         borderColor: 'rgb(255, 99, 132)'
       }
     ];
     ```

3. **반응형 차트 크기 문제 (모바일에서 깨짐)**
   - 원인: Canvas 크기가 고정됨
   - 해결: Chart.js responsive 옵션
   - 해결: 부모 요소 크기에 맞춤
   - 코드:
     ```javascript
     const chart = new Chart(ctx, {
       type: 'line',
       data: data,
       options: {
         responsive: true,
         maintainAspectRatio: true,
         aspectRatio: 2, // 가로:세로 = 2:1
         onResize: (chart, size) => {
           console.log('차트 크기 변경:', size);
         }
       }
     });

     // CSS로 부모 크기 조절
     // #chart-container {
     //   width: 100%;
     //   max-width: 800px;
     //   height: 400px;
     // }

     // 윈도우 리사이즈 이벤트
     window.addEventListener('resize', () => {
       chart.resize();
     });
     ```

4. **범례가 너무 많아서 화면 밖으로 나감**
   - 원인: 데이터셋 10개 이상
   - 해결: 범례 스크롤 또는 숨김 옵션
   - 코드:
     ```javascript
     const chart = new Chart(ctx, {
       type: 'line',
       data: data,
       options: {
         plugins: {
           legend: {
             display: true,
             position: 'right',
             labels: {
               boxWidth: 12,
               padding: 10,
               font: {
                 size: 10
               }
             },
             // 범례 최대 줄 수
             maxHeight: 200,
             onClick: (e, legendItem, legend) => {
               // 클릭 시 데이터셋 토글
               const index = legendItem.datasetIndex;
               const chart = legend.chart;
               const meta = chart.getDatasetMeta(index);
               meta.hidden = !meta.hidden;
               chart.update();
             }
           }
         }
       }
     });

     // 데이터셋 많으면 범례 숨김
     if (datasets.length > 10) {
       showToast('범례가 너무 많아 숨김 처리되었습니다.', 'info');
       chart.options.plugins.legend.display = false;
       chart.update();
     }
     ```

5. **색상 자동 생성 시 비슷한 색 반복**
   - 원인: 랜덤 색상이 겹침
   - 해결: 사전 정의된 색상 팔레트 사용
   - 코드:
     ```javascript
     // Material Design 색상 팔레트
     const colorPalettes = {
       basic: [
         '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
         '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
       ],
       pastel: [
         '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9',
         '#BAE1FF', '#E0BBE4', '#FFDFD3', '#FEC8D8'
       ],
       vivid: [
         '#E63946', '#F1FAEE', '#A8DADC', '#457B9D',
         '#1D3557', '#E76F51', '#F4A261', '#2A9D8F'
       ],
       rainbow: [
         '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
         '#0000FF', '#4B0082', '#9400D3', '#FF1493'
       ]
     };

     function getColor(index, palette = 'basic', alpha = 1) {
       const colors = colorPalettes[palette];
       const color = colors[index % colors.length];

       // RGB로 변환 후 alpha 적용
       if (alpha < 1) {
         const hex = color.replace('#', '');
         const r = parseInt(hex.substring(0, 2), 16);
         const g = parseInt(hex.substring(2, 4), 16);
         const b = parseInt(hex.substring(4, 6), 16);
         return `rgba(${r}, ${g}, ${b}, ${alpha})`;
       }

       return color;
     }

     // 사용 예
     const datasets = dataRows.map((row, index) => ({
       label: row.label,
       data: row.data,
       borderColor: getColor(index, 'vivid'),
       backgroundColor: getColor(index, 'vivid', 0.2)
     }));
     ```

6. **애니메이션 재생 시 이전 데이터 잔상**
   - 원인: Chart 업데이트 시 이전 데이터 남음
   - 해결: chart.destroy() 후 재생성
   - 코드:
     ```javascript
     let currentChart = null;

     function createChart(type, labels, datasets) {
       const canvas = document.getElementById('chart-canvas');
       const ctx = canvas.getContext('2d');

       // 이전 차트 제거
       if (currentChart) {
         currentChart.destroy();
       }

       // 새 차트 생성
       currentChart = new Chart(ctx, {
         type: type,
         data: { labels, datasets },
         options: {
           animation: {
             duration: 1000,
             easing: 'easeInOutQuart'
           }
         }
       });
     }

     // 데이터 업데이트 (애니메이션 없이)
     function updateChartData(newLabels, newDatasets) {
       if (currentChart) {
         currentChart.data.labels = newLabels;
         currentChart.data.datasets = newDatasets;
         currentChart.update('none'); // 'none' = 애니메이션 없음
       }
     }
     ```

7. **JSON 입력 형식 오류**
   - 원인: 사용자가 잘못된 JSON 입력
   - 해결: JSON 유효성 검증
   - 코드:
     ```javascript
     function validateJSON(jsonString) {
       try {
         const data = JSON.parse(jsonString);

         // 필수 필드 검증
         if (!data.labels || !Array.isArray(data.labels)) {
           throw new Error('labels 필드가 없거나 배열이 아닙니다.');
         }

         if (!data.datasets || !Array.isArray(data.datasets)) {
           throw new Error('datasets 필드가 없거나 배열이 아닙니다.');
         }

         // 각 데이터셋 검증
         data.datasets.forEach((dataset, index) => {
           if (!dataset.label) {
             throw new Error(`데이터셋 ${index}: label이 없습니다.`);
           }
           if (!dataset.data || !Array.isArray(dataset.data)) {
             throw new Error(`데이터셋 ${index}: data가 없거나 배열이 아닙니다.`);
           }
           if (dataset.data.length !== data.labels.length) {
             throw new Error(`데이터셋 ${index}: 데이터 수와 레이블 수가 다릅니다.`);
           }
         });

         return { valid: true, data };

       } catch (error) {
         return { valid: false, error: error.message };
       }
     }

     // 사용 예
     const jsonInput = document.getElementById('json-input').value;
     const result = validateJSON(jsonInput);

     if (result.valid) {
       createChart('line', result.data.labels, result.data.datasets);
     } else {
       showToast(`JSON 오류: ${result.error}`, 'error');
     }

     // 예시 JSON:
     // {
     //   "labels": ["1월", "2월", "3월"],
     //   "datasets": [
     //     {
     //       "label": "매출",
     //       "data": [12, 19, 3]
     //     }
     //   ]
     // }
     ```

8. **Pie Chart에서 작은 비율 레이블 겹침**
   - 원인: 레이블 공간 부족
   - 해결: 플러그인으로 레이블 위치 조정
   - 코드:
     ```javascript
     // chartjs-plugin-datalabels 사용
     // <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0"></script>

     const pieChart = new Chart(ctx, {
       type: 'pie',
       data: {
         labels: ['A', 'B', 'C', 'D', 'E'],
         datasets: [{
           data: [30, 25, 20, 15, 10],
           backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
         }]
       },
       options: {
         plugins: {
           datalabels: {
             formatter: (value, ctx) => {
               const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
               const percentage = (value / total * 100).toFixed(1) + '%';
               return percentage;
             },
             color: '#fff',
             font: {
               weight: 'bold',
               size: 14
             },
             // 작은 비율은 숨김
             display: (ctx) => {
               const value = ctx.dataset.data[ctx.dataIndex];
               const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
               return (value / total) > 0.05; // 5% 이상만 표시
             }
           }
         }
       },
       plugins: [ChartDataLabels]
     });
     ```

9. **차트 다운로드 시 배경 투명 (PNG)**
   - 원인: Canvas 배경이 투명
   - 해결: 배경색 추가 옵션
   - 코드:
     ```javascript
     function downloadChartWithBackground(chart, backgroundColor = '#ffffff') {
       const originalCanvas = chart.canvas;
       const width = originalCanvas.width;
       const height = originalCanvas.height;

       // 임시 Canvas 생성
       const tempCanvas = document.createElement('canvas');
       tempCanvas.width = width;
       tempCanvas.height = height;
       const tempCtx = tempCanvas.getContext('2d');

       // 배경색 채우기
       tempCtx.fillStyle = backgroundColor;
       tempCtx.fillRect(0, 0, width, height);

       // 원본 차트 그리기
       tempCtx.drawImage(originalCanvas, 0, 0);

       // 다운로드
       tempCanvas.toBlob((blob) => {
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = 'chart.png';
         link.click();
         URL.revokeObjectURL(url);
       }, 'image/png');
     }

     // UI 옵션
     // ☑ 흰색 배경 추가 (PNG)
     ```

10. **수동 데이터 입력 시 행/열 추가 불편**
    - 원인: 동적 테이블 관리
    - 해결: + 버튼으로 행/열 추가
    - 코드:
      ```javascript
      // 동적 테이블 관리
      let tableData = {
        labels: ['1월', '2월', '3월'],
        datasets: [
          { label: '매출', data: [12, 19, 3] }
        ]
      };

      function renderDataTable() {
        const table = document.getElementById('data-table');
        table.innerHTML = '';

        // 헤더 (레이블)
        const headerRow = table.insertRow();
        headerRow.insertCell().textContent = '항목';
        tableData.labels.forEach((label, index) => {
          const cell = headerRow.insertCell();
          cell.innerHTML = `<input type="text" value="${label}" data-type="label" data-index="${index}">`;
        });
        headerRow.insertCell().innerHTML = '<button onclick="addColumn()">+</button>';

        // 데이터 행
        tableData.datasets.forEach((dataset, dsIndex) => {
          const row = table.insertRow();
          const labelCell = row.insertCell();
          labelCell.innerHTML = `<input type="text" value="${dataset.label}" data-type="dataset-label" data-index="${dsIndex}">`;

          dataset.data.forEach((value, index) => {
            const cell = row.insertCell();
            cell.innerHTML = `<input type="number" value="${value}" data-dataset="${dsIndex}" data-index="${index}">`;
          });

          row.insertCell().innerHTML = '<button onclick="removeDataset(' + dsIndex + ')">-</button>';
        });

        // 행 추가 버튼
        const addRow = table.insertRow();
        addRow.insertCell().innerHTML = '<button onclick="addDataset()">+ 항목 추가</button>';
      }

      function addColumn() {
        tableData.labels.push(`항목${tableData.labels.length + 1}`);
        tableData.datasets.forEach(dataset => {
          dataset.data.push(0);
        });
        renderDataTable();
      }

      function addDataset() {
        tableData.datasets.push({
          label: `데이터${tableData.datasets.length + 1}`,
          data: new Array(tableData.labels.length).fill(0)
        });
        renderDataTable();
      }

      function removeDataset(index) {
        tableData.datasets.splice(index, 1);
        renderDataTable();
      }

      // 입력 이벤트 (실시간 업데이트)
      document.getElementById('data-table').addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT') {
          const type = target.dataset.type;
          const index = parseInt(target.dataset.index);

          if (type === 'label') {
            tableData.labels[index] = target.value;
          } else if (type === 'dataset-label') {
            tableData.datasets[index].label = target.value;
          } else {
            const dsIndex = parseInt(target.dataset.dataset);
            tableData.datasets[dsIndex].data[index] = parseFloat(target.value) || 0;
          }

          updateChart();
        }
      });
      ```

## 통합 전략

### 엑셀 대안으로 포지셔닝

**메시지:**
- "엑셀 없이 차트 만들기"
- "CSV 파일로 즉시 차트 생성"

**워크플로우:**
1. 엑셀/구글 시트에서 데이터 복사
2. CSV로 저장
3. chart.baal.co.kr에 업로드
4. 차트 다운로드

### 다른 도구와 연계

**json.baal.co.kr (JSON 도구):**
- JSON 데이터를 차트로 시각화
- API 응답을 차트로 변환

## 추가 기능 (선택사항)

### 1. 차트 템플릿 저장

```javascript
const templates = {
  'monthly-sales': {
    type: 'line',
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{ label: '매출', data: [0, 0, 0, 0, 0, 0] }]
  },
  'market-share': {
    type: 'pie',
    labels: ['A사', 'B사', 'C사', '기타'],
    datasets: [{ data: [30, 25, 20, 25] }]
  }
};

localStorage.setItem('chart-templates', JSON.stringify(templates));
```

### 2. 실시간 데이터 연동 (고급)

```javascript
// Google Sheets API 연동
async function fetchGoogleSheets(sheetId) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1`;
  const response = await fetch(url);
  const data = await response.json();
  return data.values;
}
```

### 3. 다크모드 차트

```javascript
const darkModeColors = {
  backgroundColor: '#1e1e1e',
  textColor: '#ffffff',
  gridColor: 'rgba(255, 255, 255, 0.1)'
};

if (isDarkMode) {
  chart.options.plugins.title.color = darkModeColors.textColor;
  chart.options.scales.x.ticks.color = darkModeColors.textColor;
  chart.options.scales.y.ticks.color = darkModeColors.textColor;
  chart.options.scales.x.grid.color = darkModeColors.gridColor;
  chart.options.scales.y.grid.color = darkModeColors.gridColor;
  chart.update();
}
```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- README.md 작성
- **경쟁사 분석 완료:**
  - ChartBlocks, Infogram, LiveGap Charts, Rapid Tables, Meta-Chart 조사
  - 대부분 제한적 또는 유료, 회원가입 필요
  - 차별화: 완전 무료, 브라우저 기반, CSV/JSON 지원
- **라이브러리 조사 완료:**
  - Chart.js v4 (추천) - Canvas 기반, 가장 인기
  - ApexCharts - SVG 기반, 모던한 디자인
  - Best practices: 데이터 제한, CSV 파싱, 반응형
- **실제 이슈 파악:**
  - 대량 데이터 느림, CSV 파싱 오류, 반응형 문제
  - 범례 오버플로우, 색상 중복, 애니메이션 잔상
- **UI/UX 패턴:**
  - 4단계 워크플로우 (타입 → 데이터 → 커스터마이징 → 다운로드)
  - 수동/CSV/JSON 입력, 실시간 미리보기
  - 6가지 차트 타입, 색상 팔레트

## 참고 자료

- [Chart.js 공식 문서](https://www.chartjs.org/docs/latest/)
- [Chart.js GitHub](https://github.com/chartjs/Chart.js)
- [ApexCharts 공식 문서](https://apexcharts.com/docs/)
- [Papa Parse (CSV 파싱)](https://www.papaparse.com/)
- [Chart.js Samples](https://www.chartjs.org/docs/latest/samples/)
- [Data Visualization Best Practices](https://www.tableau.com/learn/articles/data-visualization)
