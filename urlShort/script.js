const urlInput = document.getElementById('url-input');
const shortenBtn = document.getElementById('shorten-btn');
const result = document.getElementById('result');
const copyBtn = document.getElementById('copy-btn');
const message = document.getElementById('message');

function showError(text) {
    message.textContent = text;
    message.className = 'message error';
}

function clearMessage() {
    message.textContent = '';
    message.className = 'message';
}

// 입력 필드가 비어 있으면 '단축하기' 버튼 비활성화
urlInput.addEventListener('input', () => {
    shortenBtn.disabled = urlInput.value.trim() === '';
});

urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !shortenBtn.disabled) shortenBtn.click();
});

// 1순위: da.gd OpenAPI (CORS 허용, 응답은 단축 URL 텍스트)
async function shortenWithDagd(longUrl) {
    const response = await fetch(`https://da.gd/s?url=${encodeURIComponent(longUrl)}`);
    const text = (await response.text()).trim();
    if (!response.ok || !text.startsWith('http')) {
        throw new Error(text || `HTTP ${response.status}`);
    }
    return text;
}

// 2순위: is.gd OpenAPI (CORS 미지원 → JSONP 방식으로 호출)
function shortenWithIsgd(longUrl) {
    return new Promise((resolve, reject) => {
        const callbackName = `isgdCallback_${Date.now()}`;
        const script = document.createElement('script');
        const timer = setTimeout(() => cleanup(new Error('응답 시간 초과')), 8000);

        function cleanup(err, value) {
            clearTimeout(timer);
            delete window[callbackName];
            script.remove();
            err ? reject(err) : resolve(value);
        }

        window[callbackName] = (data) => {
            if (data && data.shorturl) cleanup(null, data.shorturl);
            else cleanup(new Error((data && data.errormessage) || '단축 실패'));
        };
        script.onerror = () => cleanup(new Error('네트워크 오류'));
        script.src = `https://is.gd/create.php?format=json&callback=${callbackName}&url=${encodeURIComponent(longUrl)}`;
        document.body.appendChild(script);
    });
}

// '단축하기' 클릭 → OpenAPI로 단축 요청 → 출력 상자에 표시
shortenBtn.addEventListener('click', async () => {
    const longUrl = urlInput.value.trim();
    clearMessage();

    try {
        const parsed = new URL(longUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
        showError('올바른 URL을 입력해 주세요. (예: https://example.com)');
        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = '단축 중...';
    result.value = '';
    copyBtn.disabled = true;

    try {
        let shortUrl;
        try {
            shortUrl = await shortenWithDagd(longUrl);
        } catch (err) {
            console.warn('da.gd 실패, is.gd로 재시도:', err);
            shortUrl = await shortenWithIsgd(longUrl);
        }
        result.value = shortUrl;
        copyBtn.disabled = false;
    } catch (err) {
        console.error(err);
        showError('URL 단축에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
        shortenBtn.textContent = '단축하기';
        shortenBtn.disabled = urlInput.value.trim() === '';
    }
});

// '복사' 클릭 → 클립보드 복사 후 알림창
copyBtn.addEventListener('click', async () => {
    if (!result.value) return;
    try {
        await navigator.clipboard.writeText(result.value);
    } catch {
        result.select();
        document.execCommand('copy');
    }
    alert('복사하였습니다');
});
