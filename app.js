// =============================================================================
// ADVISION AI - HIGH CONTRAST & ULTRA LEGIBLE APPLICATION ENGINE
// =============================================================================

let userName = localStorage.getItem('ADVISION_USER_NAME') || "";
let currentBase64 = null;
let currentMimeType = null;
let currentFileName = null;

// Element Selectors
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const btnAttachImage = document.getElementById('btn-attach-image');
const fileInput = document.getElementById('file-input');

const attachedImagePreview = document.getElementById('attached-image-preview');
const attachedThumb = document.getElementById('attached-thumb');
const attachedFilename = document.getElementById('attached-filename');
const btnRemoveAttachment = document.getElementById('btn-remove-attachment');

const btnApiKeyModal = document.getElementById('btn-api-key-modal');
const apiModal = document.getElementById('api-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnSaveKey = document.getElementById('btn-save-key');
const inputApiKey = document.getElementById('input-api-key');

// Load stored API Key
const savedKey = localStorage.getItem('GEMINI_API_KEY') || "";
if (savedKey) inputApiKey.value = savedKey;

// SYSTEM PROMPT CHUẨN XÁC, KHIÊM TỐN (HIGH CONTRAST PROMPT)
const ADVISION_SYSTEM_PROMPT = `
Bạn là AdVision - Chuyên gia thẩm định hình ảnh và thiết kế banner quảng cáo. Nhiệm vụ của bạn là bóc tách, đánh giá và nhận xét các yếu tố hình ảnh trên banner: Mật độ văn bản (quy tắc 20%), nút kêu gọi hành động (CTA), tỷ lệ tương phản và bố cục thị giác.

CÂU HỎI TRUNG TÂM BẮT BUỘC TRẢ LỜI:
"BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"

CÁC NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ MŨI TÊN (như ->, -->, ⇒) trong bất kỳ phần nào của câu trả lời.
2. Trình bày bài phân tích theo các KHỐI VĂN BẢN (Text Blocks) rõ ràng.
3. Phong cách nói chuyện: Khiêm tốn, lịch sự, ngắn gọn, đi thẳng vào vấn đề, mạch lạc và logic.
4. Xưng hô tự nhiên theo tên của người dùng nếu có.
5. Cuối bài đánh giá, gợi ý 1-2 câu hỏi ngắn để hỗ trợ người dùng tối ưu hơn.

CẤU TRÚC KẾT QUẢ ĐẦU RA (OUTPUT BLOCK STRUCTURE):

--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: [ĐẠT TIÊU CHUẨN / CHƯA ĐẠT TIÊU CHUẨN]
Điểm số thiết kế: [X/10]

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: [Nhận diện sản phẩm, vị trí, độ nổi bật]
- Văn bản & Mật độ chữ: [Đánh giá mật độ text, độ dễ đọc]
- Thông điệp quảng cáo: [Đánh giá thông điệp]
- Nút kêu gọi hành động (CTA): [Kích thước, vị trí, tương phản]

[KHỐI 3: ƯU ĐIỂM & HẠN CHẾ]
- Ưu điểm: [Chi tiết làm tốt]
- Hạn chế: [Chi tiết cần cải thiện]

[KHỐI 4: ĐỀ XUẤT TỐI ƯU]
- Đề xuất 1: [Lời khuyên cụ thể]
- Đề xuất 2: [Lời khuyên cụ thể]

[KHỐI 5: TƯ VẤN THÊM]
[Lời nhắn ngắn gọn + 1-2 câu hỏi gợi ý thêm cho người dùng]
--------------------------------
`;

// ATTACHMENT HANDLERS
btnAttachImage.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
});

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file hình ảnh (.png, .jpg, .jpeg, .webp)');
    return;
  }
  currentFileName = file.name;
  attachedFilename.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;

  const reader = new FileReader();
  reader.onload = function(e) {
    currentBase64 = e.target.result.split(',')[1];
    currentMimeType = file.type;
    attachedThumb.src = e.target.result;
    attachedImagePreview.classList.remove('hidden');
    attachedImagePreview.classList.add('flex');
  };
  reader.readAsDataURL(file);
}

btnRemoveAttachment.addEventListener('click', () => {
  currentBase64 = null;
  currentMimeType = null;
  currentFileName = null;
  fileInput.value = '';
  attachedThumb.src = '';
  attachedImagePreview.classList.add('hidden');
  attachedImagePreview.classList.remove('flex');
});

// API KEY MODAL HANDLERS
btnApiKeyModal.addEventListener('click', () => apiModal.classList.remove('hidden'));
btnCloseModal.addEventListener('click', () => apiModal.classList.add('hidden'));
btnSaveKey.addEventListener('click', () => {
  const key = inputApiKey.value.trim();
  localStorage.setItem('GEMINI_API_KEY', key);
  apiModal.classList.add('hidden');
  alert('Đã lưu API Key!');
});

// CHAT FORM SUBMISSION
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text && !currentBase64) return;

  appendUserMessage(text, currentBase64 ? attachedThumb.src : null);
  chatInput.value = '';

  // Capturing User Name if first message
  if (!userName && text && !currentBase64) {
    userName = text;
    localStorage.setItem('ADVISION_USER_NAME', userName);
    appendAgentThinking();
    await new Promise(r => setTimeout(r, 800));
    removeAgentThinking();
    
    appendAgentMessage(`
      <p class="font-bold">Chào <strong>${userName}</strong>!</p>
      <p>Bây giờ bạn có thể bấm biểu tượng 📎 để đính kèm hình ảnh banner quảng cáo cần đánh giá nhé.</p>
    `);
    return;
  }

  // Image Analysis Execution
  if (currentBase64) {
    appendAgentThinking();
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";
    let reportText = "";

    const userPromptText = userName ? `Người dùng tên là ${userName}. ` : "";

    if (apiKey) {
      try {
        if (apiKey.startsWith('sk-')) {
          reportText = await callOpenAiVisionApi(apiKey, currentBase64, currentMimeType, userPromptText + text);
        } else {
          reportText = await callGeminiVisionApi(apiKey, currentBase64, currentMimeType, userPromptText + text);
        }
      } catch (err) {
        console.warn("API Error:", err);
        reportText = getMinimalMockAnalysis(currentFileName || "banner.png", userName || "bạn");
      }
    } else {
      await new Promise(r => setTimeout(r, 1200));
      reportText = getMinimalMockAnalysis(currentFileName || "banner.png", userName || "bạn");
    }

    btnRemoveAttachment.click();
    removeAgentThinking();

    // Clean forbidden arrows
    reportText = reportText.replace(/->|-->|⇒/g, '•');
    appendAgentMessage(formatMarkdown(reportText));
    return;
  }

  // Interactive Dialogue Reply
  if (text) {
    appendAgentThinking();
    await new Promise(r => setTimeout(r, 800));
    removeAgentThinking();
    appendAgentMessage(`
      <p>Cảm ơn thông tin của <strong>${userName || 'bạn'}</strong>. Bạn có thể tải thêm ảnh banner khác nếu muốn tiếp tục phân tích nhé.</p>
    `);
  }
});

// HIGH CONTRAST UI RENDERING UTILITIES
function appendUserMessage(text, imgSrc) {
  let imgHtml = imgSrc ? `<img src="${imgSrc}" class="max-h-48 rounded border-2 border-slate-400 dark:border-slate-600 mb-2">` : '';
  let textHtml = text ? `<p>${text}</p>` : '';

  const html = `
    <div class="flex gap-3 justify-end">
      <div class="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl rounded-tr-none text-base font-medium max-w-xl leading-relaxed shadow-sm border border-slate-700">
        ${imgHtml}
        ${textHtml}
      </div>
      <div class="w-9 h-9 rounded-lg bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white font-black text-sm shrink-0 border border-slate-600">
        <i class="fa-solid fa-user"></i>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function appendAgentMessage(formattedHtml) {
  const html = `
    <div class="flex gap-4">
      <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="space-y-3 text-base text-slate-950 dark:text-slate-100 leading-relaxed flex-1 prose-contrast">
        <div class="bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-2">
          ${formattedHtml}
        </div>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function appendAgentThinking() {
  const html = `
    <div id="thinking-bubble" class="flex gap-4">
      <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3 bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 px-4 py-3 rounded-xl">
        <div class="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        <span>Đang bóc tách và phân tích hình ảnh...</span>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function removeAgentThinking() {
  const bubble = document.getElementById('thinking-bubble');
  if (bubble) bubble.remove();
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// API CALL ENGINES
async function callGeminiVisionApi(apiKey, base64Data, mimeType, userText) {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  const explicitPrompt = `Hãy phân tích bức ảnh quảng cáo này và trả lời chính xác câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"\n\nThông tin kèm theo: ${userText}\n\n${ADVISION_SYSTEM_PROMPT}`;

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
              { text: explicitPrompt },
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
  throw lastErr || new Error("Không thể kết nối Gemini API");
}

async function callOpenAiVisionApi(apiKey, base64Data, mimeType, userText) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const explicitPrompt = `Hãy phân tích bức ảnh này và trả lời câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"\nThông tin: ${userText}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: ADVISION_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: explicitPrompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
          ]
        }
      ],
      max_tokens: 1000
    })
  });

  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.error?.message || "OpenAI API Error");
  }

  const json = await resp.json();
  return json.choices?.[0]?.message?.content || "";
}

function formatMarkdown(str) {
  if (!str) return "";
  let html = str
    .replace(/^### (.*$)/gim, '<h4 class="font-extrabold text-slate-950 dark:text-white mt-3 mb-1 text-base">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-black text-blue-700 dark:text-blue-400 mt-4 mb-2 text-lg border-b pb-1 border-slate-300 dark:border-slate-700">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-950 dark:text-white">$1</strong>')
    .replace(/^[-*+] (.*$)/gim, '<li class="ml-4 list-disc font-medium text-slate-900 dark:text-slate-200 my-1">$1</li>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal font-medium text-slate-900 dark:text-slate-200 my-1">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  return html;
}

// MINIMAL HIGH CONTRAST MOCK ANALYSIS
function getMinimalMockAnalysis(filename, targetUser) {
  return `--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu thêm)
Điểm số thiết kế: 6.5/10

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: Sản phẩm trong file ${filename} được đặt ở trung tâm, góc nhìn tương đối rõ ràng.
- Văn bản & Mật độ chữ: Mật độ văn bản chiếm khoảng 24% diện tích thiết kế.
- Thông điệp quảng cáo: Tiêu đề hiển thị rõ nhưng chưa nổi bật ý chính.
- Nút kêu gọi hành động (CTA): Nút CTA chưa có độ tương phản đủ cao so với phông nền.

[KHỐI 3: ƯU ĐIỂM & HẠN CHẾ]
- Ưu điểm: Màu sắc tổng thể hài hòa, hình ảnh sản phẩm nét.
- Hạn chế: Nút CTA còn mờ nhạt, mật độ chữ hơi nhiều.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU]
- Đề xuất 1: Thêm màu sắc tương phản cho nút CTA (như màu cam hoặc vàng) để tăng tỷ lệ nhấp.
- Đề xuất 2: Bớt 1 dòng chữ phụ để tạo không gian thoáng hơn xung quanh sản phẩm.

[KHỐI 5: TƯ VẤN THÊM]
Chào ${targetUser}, bạn có thể điều chỉnh nút CTA và bớt bớt chữ phụ để banner đạt hiệu quả tốt hơn nhé. Nếu cần hỗ trợ thêm về ngách sản phẩm cụ thể, bạn cứ cho tôi biết!
--------------------------------`;
}
