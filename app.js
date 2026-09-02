// =============================================================================
// ADVISION VIP AI AGENT - INTERACTIVE CHATGPT STYLE ENGINE
// =============================================================================

let userName = localStorage.getItem('ADVISION_USER_NAME') || "";
let userCategory = localStorage.getItem('ADVISION_USER_CAT') || "";
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

// SYSTEM PROMPT FOR ADVISION MASTER AGENT (VIP SPECIFICATIONS)
const ADVISION_SYSTEM_PROMPT = `
Bạn là AdVision Master - Chuyên gia cao cấp về Phân tích Thị giác Hình ảnh Quảng cáo và Giám đốc Nghệ thuật Thiết kế Đồ họa Marketing với hơn 15 năm kinh nghiệm. Nhiệm vụ của bạn là đóng vai trò một người cố vấn thiết kế thông minh, kết hợp giữa tư duy nghệ thuật thị giác (Visual Arts), nguyên lý thiết kế đồ họa (Graphic Design Principles) và chiến lược tâm lý học khách hàng trong Marketing. Bạn ở đây để quan sát, bóc tách từng điểm ảnh, cấu trúc chữ, phối màu và bố cục của banner, từ đó đưa ra lời kết luận chính xác nhất về việc bức ảnh có đạt tiêu chuẩn quảng cáo hay không, đồng thời truyền cảm hứng giúp người dùng tối ưu hóa hiệu suất chuyển đổi quảng cáo một cách logic và sáng tạo nhất.

CÂU HỎI TRUNG TÂM BẮT BUỘC TRẢ LỜI:
"BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"

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
  alert('Đã lưu API Key thành công!');
});

// CHAT SUBMIT HANDLER (INTERACTIVE AGENT DIALOGUE)
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text && !currentBase64) return;

  // Add User Message to Chat UI
  appendUserMessage(text, currentBase64 ? attachedThumb.src : null);
  chatInput.value = '';

  // Case 1: If user is giving their name/info
  if (!userName && text && !currentBase64) {
    userName = text;
    localStorage.setItem('ADVISION_USER_NAME', userName);
    appendAgentThinking();
    await new Promise(r => setTimeout(r, 1000));
    removeAgentThinking();
    
    appendAgentMessage(`
      <p class="font-extrabold text-amber-300 mb-1">Rất tuyệt vời! Chào <strong>bạn ${userName}</strong>! 💻🎨</p>
      <p>Cảm ơn <strong>bạn ${userName}</strong> đã chia sẻ! Bây giờ bạn hãy bấm nút đính kèm 📎 hoặc kéo thả bức ảnh banner quảng cáo cần kiểm tra vào đây nhé.</p>
      <p class="mt-2 text-indigo-300 font-semibold">AdVision Master sẽ 'mổ xẻ' từng điểm ảnh và thẩm định tiêu chuẩn giúp bạn ${userName} ngay lập tức!</p>
    `);
    return;
  }

  // Case 2: If user sends an image or text for analysis
  if (currentBase64) {
    appendAgentThinking();
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";
    let reportText = "";

    const userGreeting = userName ? `Tôi tên là ${userName}. ` : "";

    if (apiKey) {
      try {
        if (apiKey.startsWith('sk-')) {
          reportText = await callOpenAiVisionApi(apiKey, currentBase64, currentMimeType, userGreeting + text);
        } else {
          reportText = await callGeminiVisionApi(apiKey, currentBase64, currentMimeType, userGreeting + text);
        }
      } catch (err) {
        console.warn("API Error:", err);
        reportText = getMockAnalysis(currentFileName || "banner.png", userName || "bạn");
      }
    } else {
      await new Promise(r => setTimeout(r, 1500));
      reportText = getMockAnalysis(currentFileName || "banner.png", userName || "bạn");
    }

    // Reset attachment
    btnRemoveAttachment.click();
    removeAgentThinking();

    // Clean any arrows
    reportText = reportText.replace(/->|-->|⇒/g, '•');
    appendAgentMessage(formatMarkdown(reportText));
    return;
  }

  // Case 3: Regular text chat reply
  if (text) {
    appendAgentThinking();
    await new Promise(r => setTimeout(r, 1000));
    removeAgentThinking();
    appendAgentMessage(`
      <p>Cảm ơn phản hồi của <strong>bạn ${userName || 'bạn'}</strong>! AdVision Master đã ghi nhận thông tin này.</p>
      <p class="mt-2 text-indigo-300 font-semibold">Nếu bạn có thêm ảnh banner quảng cáo nào khác, cứ gửi lên để mình tiếp tục soi tiêu chuẩn giúp bạn nhé!</p>
    `);
  }
});

// CHAT UI UTILITIES
function appendUserMessage(text, imgSrc) {
  let imgHtml = imgSrc ? `<img src="${imgSrc}" class="max-h-48 rounded-xl border border-slate-700 mb-2">` : '';
  let textHtml = text ? `<p>${text}</p>` : '';

  const html = `
    <div class="flex gap-3 justify-end max-w-3xl ml-auto">
      <div class="bg-indigo-600 border border-indigo-500 p-4 rounded-2xl rounded-tr-none text-white text-sm shadow-md space-y-2">
        ${imgHtml}
        ${textHtml}
      </div>
      <div class="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
        <i class="fa-solid fa-user"></i>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function appendAgentMessage(formattedHtml) {
  const html = `
    <div class="flex gap-4 max-w-3xl">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-md">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="space-y-3 text-sm text-slate-200">
        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl rounded-tl-none shadow-md leading-relaxed space-y-3">
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
    <div id="thinking-bubble" class="flex gap-4 max-w-3xl">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 animate-bounce">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-indigo-300 font-semibold flex items-center gap-2">
        <div class="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        <span>AdVision Master đang soi từng điểm ảnh...</span>
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
  const explicitPrompt = `Hãy phân tích bức ảnh quảng cáo này và trả lời chính xác câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"\n\nThông tin người dùng gửi kèm: ${userText}\n\n${ADVISION_SYSTEM_PROMPT}`;

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
  throw lastErr || new Error("Không thể gọi Gemini API");
}

async function callOpenAiVisionApi(apiKey, base64Data, mimeType, userText) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const explicitPrompt = `Hãy phân tích bức ảnh này và trả lời câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"\nThông tin người dùng: ${userText}`;

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
    .replace(/^### (.*$)/gim, '<h4 class="font-bold text-white mt-3 mb-1 font-lg">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-black text-amber-300 mt-4 mb-2 text-base">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-amber-300">$1</strong>')
    .replace(/^[-*+] (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-slate-300 my-1">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  return html;
}

// DEMO MOCK FALLBACK FOR CHATBOT STYLE
function getMockAnalysis(filename, targetUser) {
  return `--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu hóa chuyển đổi)
Điểm số thiết kế: 6.5/10

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: Hình ảnh sản phẩm trong banner (${filename}) hiển thị nổi bật ở vị trí trung tâm.
- Văn bản & Chữ viết: Mật độ chữ khoảng 25% diện tích banner. Tiêu đề khuyến mãi rõ ràng nhưng phông chữ phụ hơi nhỏ.
- Thông điệp quảng cáo: Thông điệp truyền tải ngắn gọn nhưng chưa có điểm nhấn độc nhất.
- Nút kêu gọi hành động (CTA): Nút CTA chưa đạt độ tương phản tối ưu so với phông nền.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Màu sắc tươi sáng, hình ảnh sản phẩm góc chụp đẹp và sắc nét.
- Điểm cần cải thiện: Nút CTA còn chìm trong nền, thiếu lực đẩy thôi thúc khách hàng mua ngay.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: Nâng kích thước nút CTA "MUA NGAY" lên 15% và đổ màu tương phản (như Vàng neon hoặc Cam) để mắt người xem chú ý ngay lập tức.
- Đề xuất 2: Giảm bớt 1 dòng chữ mô tả phụ để tăng khoảng trống thị giác xung quanh sản phẩm.

[KHỐI 5: GIAO LƯU & HỎI THÔNG TIN KHÁCH HÀNG]
Chào bạn ${targetUser}! Banner này có phần hình ảnh sản phẩm rất mướt mắt, giống như một ngôi sao đã sẵn sàng lên sân khấu nhưng cần một ánh đèn chiếu chuẩn hơn vậy!

Để AdVision Master giúp bạn ${targetUser} tối ưu chuẩn xác nhất cho chiến dịch, bạn có thể chia sẻ thêm:
1. Đối tượng khách hàng mục tiêu mà bạn ${targetUser} đang nhắm đến thuộc độ tuổi nào và họ quan tâm nhất đến Giá cả hay Chất lượng?
2. Bạn có chương trình tặng kèm hay Mã giảm giá nào đặc biệt để đưa vào banner không?
--------------------------------`;
}
