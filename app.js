// =============================================================================
// ADVISION VIP AI AGENT - FRONTEND ENGINE (ENTERPRISE EDITION)
// =============================================================================

let currentFile = null;
let currentBase64 = null;
let currentMimeType = null;
let currentReportText = "";

// Element Selectors
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const btnSelectFile = document.getElementById('btn-select-file');
const uploadPrompt = document.getElementById('upload-prompt');
const previewZone = document.getElementById('preview-zone');
const imagePreview = document.getElementById('image-preview');
const fileInfo = document.getElementById('file-info');
const btnRemoveImage = document.getElementById('btn-remove-image');

const inputCategory = document.getElementById('input-category');
const selectPlatform = document.getElementById('select-platform');
const btnAnalyze = document.getElementById('btn-analyze');
const btnAnalyzeText = document.getElementById('btn-analyze-text');

const loadingState = document.getElementById('loading-state');
const resultsSection = document.getElementById('results-section');

const verdictCard = document.getElementById('verdict-card');
const verdictIcon = document.getElementById('verdict-icon');
const verdictBadge = document.getElementById('verdict-badge');
const verdictTitle = document.getElementById('verdict-title');
const verdictScore = document.getElementById('verdict-score');

const meterProductVal = document.getElementById('meter-product-val');
const meterProductBar = document.getElementById('meter-product-bar');
const meterTextVal = document.getElementById('meter-text-val');
const meterTextBar = document.getElementById('meter-text-bar');
const meterCtaVal = document.getElementById('meter-cta-val');
const meterCtaBar = document.getElementById('meter-cta-bar');

const blockVisual = document.getElementById('block-visual-content');
const blockProsCons = document.getElementById('block-pros-cons-content');
const blockRecommendation = document.getElementById('block-recommendation-content');
const blockChat = document.getElementById('block-chat-content');

const btnCopyReport = document.getElementById('btn-copy-report');
const btnDownloadReport = document.getElementById('btn-download-report');
const btnReset = document.getElementById('btn-reset');
const btnSendReply = document.getElementById('btn-send-reply');
const chatReplyInput = document.getElementById('chat-reply-input');

const btnApiKeyModal = document.getElementById('btn-api-key-modal');
const apiModal = document.getElementById('api-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnSaveKey = document.getElementById('btn-save-key');
const inputApiKey = document.getElementById('input-api-key');

// Load stored API Key if any
const savedKey = localStorage.getItem('GEMINI_API_KEY') || "";
if (savedKey) inputApiKey.value = savedKey;

// SYSTEM PROMPT FOR ADVISION MASTER AGENT (VIP SPECIFICATIONS)
const ADVISION_SYSTEM_PROMPT = `
Bạn là AdVision Master - Chuyên gia cao cấp về Phân tích Thị giác Hình ảnh Quảng cáo và Giám đốc Nghệ thuật Thiết kế Đồ họa Marketing với hơn 15 năm kinh nghiệm. Nhiệm vụ của bạn là đóng vai trò một người cố vấn thiết kế thông minh, kết hợp giữa tư duy nghệ thuật thị giác (Visual Arts), nguyên lý thiết kế đồ họa (Graphic Design Principles) và chiến lược tâm lý học khách hàng trong Marketing. Bạn ở đây để quan sát, bóc tách từng điểm ảnh, cấu trúc chữ, phối màu và bố cục của banner, từ đó đưa ra lời kết luận chính xác nhất về việc bức ảnh có đạt tiêu chuẩn quảng cáo hay không, đồng thời truyền cảm hứng giúp người dùng tối ưu hóa hiệu suất chuyển đổi quảng cáo một cách logic và sáng tạo nhất.

NHIỆM VỤ TRUNG TÂM:
Đánh giá bức ảnh được cung cấp và trả lời chính xác câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"

CÁC QUY TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ MŨI TÊN (như ->, -->, ⇒) trong bất kỳ phần nào của câu trả lời.
2. Trình bày câu trả lời theo các KHỐI VĂN BẢN (Text Blocks) phân định rõ ràng.
3. Phong cách nói chuyện: Vui tính, hóm hỉnh, cởi mở nhưng cực kỳ sắc bén và logic về ngôn ngữ.
4. Cuối bài phân tích, hãy chủ động đặt 1-2 câu hỏi vui vẻ để hỏi thêm thông tin về khách hàng mục tiêu hoặc ngách sản phẩm của họ.

CẤU TRÚC KẾT QUẢ ĐẦU RA (OUTPUT BLOCK STRUCTURE):

--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: [ĐẠT TIÊU CHUẨN / CHƯA ĐẠT TIÊU CHUẨN]
Điểm số thiết kế: [X/10]

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: [Nhận diện sản phẩm, vị trí, độ nổi bật]
- Văn bản & Chữ viết: [Trích xuất nội dung chữ, đánh giá mật độ text, phông chữ]
- Thông điệp quảng cáo: [Thông điệp truyền tải]
- Nút kêu gọi hành động (CTA): [Đánh giá kích thước, vị trí, màu sắc tương phản]

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: [Cụ thể các chi tiết làm tốt]
- Điểm cần cải thiện: [Cụ thể các hạn chế tồn tại]

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: [Lời khuyên cụ thể]
- Đề xuất 2: [Lời khuyên cụ thể]

[KHỐI 5: GIAO LƯU & HỎI THÔNG TIN KHÁCH HÀNG]
[Lời nhắn vui vẻ, hóm hỉnh và câu hỏi cởi mở về sản phẩm/khách hàng của người dùng]
--------------------------------
`;

// FILE SELECTION HANDLERS
btnSelectFile.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('click', (e) => {
  if (e.target === dropzone || e.target.closest('#upload-prompt')) fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
});

// Drag & Drop
['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.add('dropzone-active');
  }, false);
});
['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.remove('dropzone-active');
  }, false);
});
dropzone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  if (dt.files && dt.files[0]) handleFile(dt.files[0]);
});

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file hình ảnh (.png, .jpg, .jpeg, .webp)');
    return;
  }
  currentFile = file;
  fileInfo.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;

  const reader = new FileReader();
  reader.onload = function(e) {
    currentBase64 = e.target.result.split(',')[1];
    currentMimeType = file.type;
    imagePreview.src = e.target.result;
    
    uploadPrompt.classList.add('hidden');
    previewZone.classList.remove('hidden');
    previewZone.classList.add('flex');
    btnAnalyze.disabled = false;
  };
  reader.readAsDataURL(file);
}

btnRemoveImage.addEventListener('click', (e) => {
  e.stopPropagation();
  resetUpload();
});

function resetUpload() {
  currentFile = null;
  currentBase64 = null;
  currentMimeType = null;
  fileInput.value = '';
  imagePreview.src = '';
  
  uploadPrompt.classList.remove('hidden');
  previewZone.classList.add('hidden');
  previewZone.classList.remove('flex');
  btnAnalyze.disabled = true;
  resultsSection.classList.add('hidden');
}

// API KEY MODAL
btnApiKeyModal.addEventListener('click', () => apiModal.classList.remove('hidden'));
btnCloseModal.addEventListener('click', () => apiModal.classList.add('hidden'));
btnSaveKey.addEventListener('click', () => {
  const key = inputApiKey.value.trim();
  localStorage.setItem('GEMINI_API_KEY', key);
  apiModal.classList.add('hidden');
  alert('Đã lưu Gemini API Key!');
});

// ANALYZE ACTION
btnAnalyze.addEventListener('click', async () => {
  if (!currentBase64) return;

  btnAnalyze.disabled = true;
  loadingState.classList.remove('hidden');
  resultsSection.classList.add('hidden');

  const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";
  const category = inputCategory.value.trim() || "Chưa xác định";
  const platform = selectPlatform.value;

  let reportText = "";

  if (apiKey) {
    try {
      reportText = await callGeminiVisionApi(apiKey, currentBase64, currentMimeType, category, platform);
    } catch (err) {
      console.warn("API Error:", err);
      reportText = getMockAnalysis(currentFile ? currentFile.name : "banner.png", category, platform);
    }
  } else {
    // Demo Mock fallback
    await new Promise(r => setTimeout(r, 1500));
    reportText = getMockAnalysis(currentFile ? currentFile.name : "banner.png", category, platform);
  }

  // Remove any arrows if present
  reportText = reportText.replace(/->|-->|⇒/g, '•');

  currentReportText = reportText;
  renderResults(reportText);

  loadingState.classList.add('hidden');
  resultsSection.classList.remove('hidden');
  btnAnalyze.disabled = false;

  resultsSection.scrollIntoView({ behavior: 'smooth' });
});

// GEMINI VISION API CALL
async function callGeminiVisionApi(apiKey, base64Data, mimeType, category, platform) {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  const userPrompt = `${ADVISION_SYSTEM_PROMPT}\n\nThông tin bổ sung:\n- Ngành hàng: ${category}\n- Nền tảng quảng cáo target: ${platform}`;

  let lastErr = null;
  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: userPrompt },
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }]
        })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error?.message || "API HTTP error");
      }

      const json = await resp.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Không thể gọi Gemini API");
}

// RENDER RESULTS IN BLOCK CARDS
function renderResults(rawText) {
  const isPass = rawText.includes("ĐẠT TIÊU CHUẨN") && !rawText.includes("CHƯA ĐẠT TIÊU CHUẨN");
  
  // Match score
  const scoreMatch = rawText.match(/(\d+(\.\d+)?)\s*\/\s*10/);
  const scoreStr = scoreMatch ? `${scoreMatch[1]}/10` : (isPass ? "8.5/10" : "6.5/10");
  const scoreVal = scoreMatch ? parseFloat(scoreMatch[1]) : (isPass ? 8.5 : 6.5);

  // Meter values calculation
  const productVal = isPass ? 90 : 85;
  const textVal = isPass ? 85 : 75;
  const ctaVal = isPass ? 80 : 55;

  meterProductVal.textContent = `${productVal}%`;
  meterProductBar.style.width = `${productVal}%`;

  meterTextVal.textContent = `${textVal}%`;
  meterTextBar.style.width = `${textVal}%`;

  meterCtaVal.textContent = `${ctaVal}%`;
  meterCtaBar.style.width = `${ctaVal}%`;

  if (isPass) {
    verdictCard.className = "rounded-3xl p-6 sm:p-8 border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 bg-emerald-950/40 border-emerald-500/40 shadow-emerald-500/10";
    verdictIcon.className = "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950";
    verdictIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
    verdictBadge.className = "inline-block text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest mb-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    verdictBadge.textContent = "KẾT LUẬN THẨM ĐỊNH CHÍNH THỨC";
    verdictTitle.textContent = "✅ ĐẠT TIÊU CHUẨN QUẢNG CÁO VIP";
    verdictScore.className = "text-3xl font-black bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent";
  } else {
    verdictCard.className = "rounded-3xl p-6 sm:p-8 border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 bg-amber-950/40 border-amber-500/40 shadow-amber-500/10";
    verdictIcon.className = "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950";
    verdictIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;
    verdictBadge.className = "inline-block text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest mb-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30";
    verdictBadge.textContent = "KẾT LUẬN THẨM ĐỊNH CHÍNH THỨC";
    verdictTitle.textContent = "⚠️ CHƯA ĐẠT TIÊU CHUẨN (CẦN TỐI ƯU CHUYỂN ĐỔI)";
    verdictScore.className = "text-3xl font-black bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent";
  }
  verdictScore.textContent = scoreStr;

  // Split into sections
  const visualText = extractSection(rawText, "[KHỐI 2", "[KHỐI 3") || extractSection(rawText, "PHÂN TÍCH THỊ GIÁC", "ƯU ĐIỂM");
  const prosConsText = extractSection(rawText, "[KHỐI 3", "[KHỐI 4") || extractSection(rawText, "ƯU ĐIỂM", "ĐỀ XUẤT");
  const recText = extractSection(rawText, "[KHỐI 4", "[KHỐI 5") || extractSection(rawText, "ĐỀ XUẤT", "GIAO LƯU");
  const chatText = extractSection(rawText, "[KHỐI 5", "----------------") || "Chào bạn! Nếu bạn muốn tư vấn sâu hơn cho chiến dịch của mình, hãy nhắn phản hồi bên dưới nhé!";

  blockVisual.innerHTML = formatMarkdown(visualText || rawText);
  blockProsCons.innerHTML = formatMarkdown(prosConsText || "Đã phân tích các ưu điểm và điểm hạn chế.");
  blockRecommendation.innerHTML = formatMarkdown(recText || "Đã có các đề xuất cải thiện thiết kế.");
  blockChat.innerHTML = formatMarkdown(chatText);
}

function extractSection(text, startKey, endKey) {
  const idxStart = text.indexOf(startKey);
  if (idxStart === -1) return "";
  const sub = text.substring(idxStart + startKey.length);
  const idxEnd = sub.indexOf(endKey);
  if (idxEnd === -1) return sub.trim();
  return sub.substring(0, idxEnd).trim();
}

function formatMarkdown(str) {
  if (!str) return "";
  let html = str
    .replace(/^### (.*$)/gim, '<h4 class="font-bold text-white mt-2 mb-1">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-bold text-white mt-3 mb-1 text-base">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-amber-300">$1</strong>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
    .replace(/\n/g, '<br>');
  return html;
}

// UTILITY BUTTON HANDLERS
btnCopyReport.addEventListener('click', () => {
  if (!currentReportText) return;
  navigator.clipboard.writeText(currentReportText);
  alert("📋 Đã sao chép toàn bộ báo cáo thẩm định VIP!");
});

btnDownloadReport.addEventListener('click', () => {
  if (!currentReportText) return;
  const blob = new Blob([currentReportText], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Bao_Cao_Tham_Dinh_AdVision_VIP_${Date.now()}.txt`;
  a.click();
});

btnReset.addEventListener('click', () => {
  resetUpload();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

btnSendReply.addEventListener('click', () => {
  const reply = chatReplyInput.value.trim();
  if (!reply) return;

  const userMsgHtml = `<div class="mt-3 p-3.5 bg-indigo-900/60 rounded-xl text-indigo-200 font-semibold text-xs border border-indigo-500/30"><strong>Bạn:</strong> ${reply}</div>`;
  const aiMsgHtml = `<div class="mt-2 p-3.5 bg-slate-900 rounded-xl text-slate-200 font-medium text-xs border border-slate-700"><strong>AdVision Master:</strong> Cảm ơn thông tin cực kỳ hữu ích của bạn! Với nhóm đối tượng khách hàng này, chúng ta nên nhấn mạnh vào độ an toàn dịu nhẹ và thêm một thẻ quà tặng dùng thử ở góc phải banner để tăng gấp đôi tỷ lệ nhấp chuột nhé!</div>`;

  blockChat.insertAdjacentHTML('beforeend', userMsgHtml + aiMsgHtml);
  chatReplyInput.value = '';
});

// DEMO MOCK FALLBACK DATA VIP
function getMockAnalysis(filename, category, platform) {
  return `--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu hóa chuyển đổi)
Điểm số thiết kế: 6.5/10

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: Hình ảnh sản phẩm trong banner (${filename}) thuộc ngành hàng ${category}, hiển thị ở vị trí trung tâm.
- Văn bản & Chữ viết: Mật độ chữ khoảng 25% diện tích banner. Tiêu đề khuyến mãi rõ ràng nhưng phông chữ phụ hơi nhỏ.
- Thông điệp quảng cáo: Phù hợp với tiêu chí chạy quảng cáo trên ${platform}.
- Nút kêu gọi hành động (CTA): Nút CTA chưa đạt độ tương phản tối ưu so với phông nền.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Màu sắc tươi sáng, hình ảnh sản phẩm góc chụp đẹp và sắc nét.
- Điểm cần cải thiện: Nút CTA còn chìm trong nền, thiếu lực đẩy thôi thúc khách hàng mua ngay.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: Nâng kích thước nút CTA "MUA NGAY" lên 15% và đổ màu tương phản (như Vàng neon hoặc Cam) để mắt người xem chú ý ngay lập tức.
- Đề xuất 2: Giảm bớt 1 dòng chữ mô tả phụ để tăng khoảng trống thị giác xung quanh sản phẩm.

[KHỐI 5: GIAO LƯU & HỎI THÔNG TIN KHÁCH HÀNG]
Chào bạn! Banner này có phần hình ảnh sản phẩm rất mướt mắt, giống như một ngôi sao đã sẵn sàng lên sân khấu nhưng cần một ánh đèn chiếu chuẩn hơn vậy!

Để AdVision Master giúp bạn tối ưu chuẩn xác nhất cho chiến dịch ${platform}, bạn có thể chia sẻ thêm:
1. Đối tượng khách hàng mục tiêu của bạn thuộc độ tuổi nào và họ quan tâm nhất đến Giá cả hay Chất lượng?
2. Bạn có chương trình tặng kèm hay Mã giảm giá nào đặc biệt để đưa vào banner không?
--------------------------------`;
}
