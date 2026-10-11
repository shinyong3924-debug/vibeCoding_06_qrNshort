# QRnShort

URL 유틸리티 웹 앱. URL을 QR코드로 변환하거나(프로젝트04 URL2QR 재사용) 짧은 URL로 단축한다.

## 폴더 구조

```
프로젝트06/
├── index.html, style.css   # 메인: 'QR코드' / 'URL단축' 버튼
├── url2qr/                 # 프로젝트04 결과물 (URL → QR코드, JPG 다운로드)
└── urlShort/               # URL 단축 기능 (신규)
```

## 기능 명세

| ID | 화면 | 기능 | 동작 |
|----|------|------|------|
| F1 | 메인 | 'QR코드' 버튼 | `url2qr/index.html`로 이동 |
| F2 | 메인 | 'URL단축' 버튼 | `urlShort/index.html`로 이동 |
| F3 | URL단축 | URL 입력창 | http/https URL 입력 |
| F4 | URL단축 | '단축하기' 버튼 | 입력창이 비어 있으면 비활성화 |
| F5 | URL단축 | 단축 요청 | OpenAPI로 단축 요청 후 응답을 읽기 전용 출력 상자에 표시 |
| F6 | URL단축 | '복사' 버튼 | 결과를 클립보드에 복사하고 '복사하였습니다' 알림창 표시 |
| F7 | URL2QR | QR 생성 | URL 입력 후 확인 → 입력창이 아래로 이동, 중앙에 QR코드 표시 |
| F8 | URL2QR | JPG 저장 | QR코드 클릭 시 `qrcode.jpg` 다운로드 |

## 사용 OpenAPI

| API | 용도 | 비고 |
|-----|------|------|
| `https://da.gd/s?url=...` | URL 단축 (1순위) | API Key 불필요, CORS 허용(`Access-Control-Allow-Origin: *`), 응답은 텍스트 |
| `https://is.gd/create.php?format=json&callback=...` | URL 단축 (2순위) | CORS 미지원이라 `fetch` 시 네트워크 오류 → JSONP로 호출 |
| qrcodejs 1.0.0 (cdnjs) | QR코드 생성 | 브라우저에서 생성, 서버 호출 없음 |
