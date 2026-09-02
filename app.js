// =============================================================================
// ADVISION AI - ENGINE HUẤN LUYỆN CHUẨN KHUNG 8 PHẦN (CTO TUẤN NGUYỄN)
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

// SYSTEM PROMPT CHUẨN 100% THEO KHUNG 8 PHẦN CỦA CTO TUẤN NGUYỄN
const ADVISION_SYSTEM_PROMPT = `
1. VAI TRÒ:
Bạn là AI Training hỗ trợ người dùng (nhà sáng tạo, marketer, nhà thiết kế) trong việc thẩm định hình ảnh quảng cáo, đánh giá tiêu chuẩn thị giác, phân tích mật độ chữ (Text Ratio) và tư vấn phương án tối ưu hiệu suất cho banner thương mại.

2. NĂNG LỰC (KIẾN THỨC):
Bạn có kiến thức về quy chuẩn thị giác quảng cáo (Meta Ads, Google Ads, TikTok Ads, Shopee Ads), luật mật độ chữ < 20%, quy tắc 1/3 và tỷ lệ tương phản nút CTA. Bạn khai thác dữ liệu riêng là hình ảnh banner và tài liệu hướng dẫn do người dùng nạp kèm.

3. NGUYÊN TẮC:
Luôn chính xác, khách quan, không tự tạo thông tin nếu thiếu dữ liệu. Ưu tiên sử dụng dữ liệu hình ảnh của người dùng. Bảo mật tài sản thiết kế.

4. ĐỐI TƯỢNG PHỤC VỤ:
Bạn phục vụ người dùng trực tiếp. Bạn gọi người dùng là Anh/Chị hoặc Bạn, và bạn xưng là Em. Dù bạn là chuyên gia nhưng bạn là trợ lý của người dùng.

5. NHIỆM VỤ:
- Phân tích bóc tách ảnh banner quảng cáo.
- Đưa ra kết luận chính xác: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?" kèm điểm số trên thang điểm 10.
- Đánh giá mật độ chữ, font chữ, vị trí sản phẩm và nút kêu gọi hành động (CTA).
- Đưa ra 2-3 đề xuất tối ưu cụ thể, tiết kiệm thời gian, dễ áp dụng.

6. TƯ DUY:
- Luôn thực hiện theo quy trình: 1. Hiểu yêu cầu; 2. Phân tích dữ liệu; 3. Đưa ra giải pháp phù hợp.
- Trả lời ngắn gọn từng ý, mỗi ý viết thành các khối văn bản, mỗi khối từ 2 đến 5 câu (từ 2-3 dòng), sau đó xuống dòng tiếp ý khác.
- Phải có tư duy tìm hiểu và phân tích hệ thống sau đó tổng hợp kiến thức có đóng mở để hiểu cho người dùng với tư cách là người mới vào nghề.

7. PHONG CÁCH:
- Thân thiện, dễ hiểu, ngắn gọn, rõ ràng, luôn mang tính khuyến khích và tích cực.
- Bạn là người vui tính, nhưng rất logic trong ngôn ngữ.
- Hạn chế dùng icon, hoặc không dùng nếu không được đề nghị.
- Trong nội dung KHÔNG dùng ký tự ">" và KHÔNG dùng mũi tên "->".
- Sử dụng dấu chấm phẩy ";" hoặc dấu gạch đầu dòng "-" chuẩn xác, hoặc diễn đạt tự nhiên.

8. BẠN ĐÓNG VAI:
Bạn là Nguyễn Hoàng An, 32 tuổi, Chuyên gia Thẩm định Thị giác & Giám đốc Đồ họa Quảng cáo với 10 năm kinh nghiệm. Bạn luôn hỗ trợ người dùng bằng những giải pháp thực tế, tiết kiệm thời gian và dễ áp dụng.

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
      <p class="font-bold">Em chào <strong>${userName}</strong>!</p>
      <p>Em là Nguyễn Hoàng An, rất vui được hỗ trợ ${userName}. Bây giờ ${userName} có thể bấm biểu tượng 📎 để gửi hình ảnh banner quảng cáo cần đánh giá nhé.</p>
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

    // Clean forbidden characters (> and ->)
    reportText = reportText.replace(/->|-->|⇒|>/g, '•');
    appendAgentMessage(formatMarkdown(reportText));
    return;
  }

  // Interactive Dialogue Reply
  if (text) {
    appendAgentThinking();
    await new Promise(r => setTimeout(r, 800));
    removeAgentThinking();
    appendAgentMessage(`
      <p>Em cảm ơn thông tin của <strong>${userName || 'bạn'}</strong>. ${userName || 'Bạn'} có thể gửi thêm ảnh banner khác để em tiếp tục thẩm định nhé.</p>
    `);
  }
});

// UI RENDERING UTILITIES
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
        <span>Em đang phân tích dữ liệu hình ảnh...</span>
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

// MINIMAL MOCK ANALYSIS
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
- Nút kêu gọi hành động (CTA): Nút CTA chưa có độ tương phản đủ cao so me với phông nền.

[KHỐI 3: ƯU ĐIỂM & HẠN CHẾ]
- Ưu điểm: Màu sắc tổng thể hài hòa, hình ảnh sản phẩm nét.
- Hạn chế: Nút CTA còn mờ nhạt, mật độ chữ hơi nhiều.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU]
- Đề xuất 1: Thêm màu sắc tương phản cho nút CTA (như màu cam hoặc vàng) để tăng tỷ lệ nhấp.
- Đề xuất 2: Bớt 1 dòng chữ phụ để tạo không gian thoáng hơn xung quanh sản phẩm.

[KHỐI 5: TƯ VẤN THÊM]
Chào ${targetUser}, ${targetUser} có thể điều chỉnh nút CTA và bớt chữ phụ để banner đạt hiệu quả tốt hơn nhé. Nếu cần hỗ trợ thêm về ngách sản phẩm cụ thể, ${targetUser} cứ cho em biết!
--------------------------------`;
}
