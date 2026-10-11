const form = document.getElementById('url-form');
const input = document.getElementById('url-input');
const qrSection = document.getElementById('qr-section');
const qrBox = document.getElementById('qr-code');
const errorMsg = document.getElementById('error-msg');

const QR_SIZE = 240;
let qr = null;

// URL 입력 → QR코드 생성 (입력창은 QR 아래로 내려감)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    const url = input.value.trim();

    try {
        new URL(url);
    } catch {
        errorMsg.textContent = '올바른 URL을 입력해 주세요. (예: https://example.com)';
        return;
    }

    try {
        qrBox.innerHTML = '';
        qr = new QRCode(qrBox, {
            text: url,
            width: QR_SIZE,
            height: QR_SIZE,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        qrSection.hidden = false;
    } catch (err) {
        console.error(err);
        errorMsg.textContent = 'QR코드 생성 중 오류가 발생했습니다.';
    }
});

// QR코드 클릭 → JPG 다운로드 (흰 여백 포함)
qrBox.addEventListener('click', () => {
    const source = qrBox.querySelector('canvas');
    if (!source) return;

    const margin = 20;
    const out = document.createElement('canvas');
    out.width = source.width + margin * 2;
    out.height = source.height + margin * 2;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(source, margin, margin);

    const link = document.createElement('a');
    link.download = 'qrcode.jpg';
    link.href = out.toDataURL('image/jpeg', 0.95);
    link.click();
});

// 마우스 위치에 따라 그라데이션 색상이 조금씩 변하도록
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const root = document.documentElement.style;
    root.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    root.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    root.setProperty('--c1', `hsl(${45 + x * 10}, 100%, ${92 - y * 4}%)`);
    root.setProperty('--c2', `hsl(${42 + y * 8}, 100%, 75%)`);
    root.setProperty('--c3', `hsl(${25 + x * 15}, 100%, ${84 - x * 4}%)`);
});
