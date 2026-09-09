// =============================================================================
// ADVISION AI - HỆ THỐNG CỐ VẤN THẨM ĐỊNH HÌNH ẢNH QUẢNG CÁO
// 100% KẾT NỐI VÀ SINH CÂU TRẢ LỜI ĐỘNG TỪ API (GEMINI / OPENAI)
// NHÂN VẬT: HOÀNG AN - TỰ XƯNG "MÌNH", GỌI BẰNG TÊN, GÕ CHỮ TỰ NHIÊN
// =============================================================================

// Trạng thái người dùng và hội thoại
let userName = localStorage.getItem('ADVISION_USER_NAME') || "";
let userIndustry = localStorage.getItem('ADVISION_USER_INDUSTRY') || "";
let nameVariations = JSON.parse(localStorage.getItem('ADVISION_NAME_VARIATIONS') || "[]");

let currentBase64 = null;
let currentMimeType = null;
let currentFileName = null;

// Lưu trữ ảnh đang thẩm định và toàn bộ lịch sử trao đổi đa lượt để gửi lên API
let activeImageData = null; 
let conversationHistory = []; // Chứa các lượt trao đổi [{ role: 'user' | 'model', text: '...' }]
let isAiTyping = false;

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

const btnDocsModal = document.getElementById('btn-docs-modal');
const docsModal = document.getElementById('docs-modal');
const btnCloseDocsModal = document.getElementById('btn-close-docs-modal');
const btnDoneDocsModal = document.getElementById('btn-done-docs-modal');

const btnResetChat = document.getElementById('btn-reset-chat');
const userInfoBadge = document.getElementById('user-info-badge');
const badgeUserName = document.getElementById('badge-user-name');
const badgeIndustryContainer = document.getElementById('badge-industry-container');
const badgeIndustryName = document.getElementById('badge-industry-name');

// Load API Key đã lưu
const savedKey = localStorage.getItem('GEMINI_API_KEY') || "";
if (savedKey) inputApiKey.value = savedKey;

// Cập nhật giao diện badge
updateUserBadge();

// HÀM XỬ LÝ TRÍCH XUẤT TÊN THÔNG MINH VÀ TẠO CÁC BIẾN THỂ GỌI TÊN
function extractSmartName(rawText) {
  if (!rawText) return { mainName: "bạn", variations: ["bạn"] };
  
  let cleaned = rawText.trim()
    .replace(/^(mình tên là|tên mình là|tôi tên là|tên tôi là|tên em là|tên anh là|tên chị là)/gi, '')
    .replace(/^(mình là|tôi là|em là|anh là|chị là|cứ gọi mình là|cứ gọi tôi là|gọi là|gọi mình là)/gi, '')
    .replace(/^(tên|chào bạn mình là|chào bạn tôi là|tôi|mình)/gi, '')
    .replace(/[.,!?:;]+/g, '')
    .trim();

  if (!cleaned) cleaned = rawText.trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  const variations = [];

  if (parts.length >= 3) {
    const lastName = parts[parts.length - 1]; // Ví dụ: Cương
    const middleLast = parts.slice(parts.length - 2).join(' '); // Thái Cương
    const firstLast = `${parts[0]} ${lastName}`; // Trần Cương
    const fullName = parts.join(' '); // Trần Thái Cương
    variations.push(lastName, middleLast, firstLast, fullName);
  } else if (parts.length === 2) {
    const lastName = parts[1];
    const fullName = parts.join(' ');
    variations.push(lastName, fullName);
  } else if (parts.length === 1) {
    variations.push(parts[0]);
  } else {
    variations.push("bạn");
  }

  const mainName = variations[0];
  return { mainName, fullName: parts.join(' ') || mainName, variations };
}

// HÀM LẤY TÊN NGẪU NHIÊN ĐỂ XƯNG HÔ TỰ NHIÊN
function getDynamicCallName() {
  if (!nameVariations || nameVariations.length === 0) {
    return userName || "bạn";
  }
  const randomIndex = Math.floor(Math.random() * nameVariations.length);
  return nameVariations[randomIndex];
}

// SYSTEM PROMPT TRUYỀN THẲNG VÀO API
function getSystemPrompt() {
  const callName = getDynamicCallName();
  return `Bạn là Hoàng An, chuyên gia phân tích hình ảnh quảng cáo và thiết kế đồ họa.

QUY TẮC CỐT LÕI:
1. Xưng hô: Bạn luôn tự xưng là "mình" và gọi đối phương bằng tên của họ (${callName}). Tuyệt đối không xưng "em" hay "tôi".
2. Giọng điệu và ngôn ngữ: Mọi câu nói phải mạch lạc, trau chuốt, có đầy đủ chủ ngữ và vị ngữ. Viết văn tự nhiên, đều chữ, rõ ràng, không in đậm nhạt lung tung theo dòng.
3. Đang trong cuộc trò chuyện thì TUYỆT ĐỐI KHÔNG ĐƯỢC CHÀO LẠI (không nói "Chào bạn, mình là Hoàng An..."). Tiếp nối mạch lạc câu chuyện.
4. Tuyệt đối KHÔNG dùng từ tiếng Anh "banner". Luôn dùng tiếng Việt: "hình ảnh quảng cáo", "ảnh quảng cáo" hoặc "bức ảnh".
5. Tuyệt đối KHÔNG dùng các dòng kẻ nét đứt như "--------------------------------".
6. Tuyệt đối KHÔNG dùng ký tự mũi tên "->", "-->", "⇒", "→" và không dùng ký tự ">".
7. Bắt buộc dùng TIẾNG VIỆT CÓ DẤU ĐẦY ĐỦ, chuẩn ngữ pháp và chính tả.

QUY TẮC TƯƠNG TÁC TỪNG KHỐI THEO YÊU CẦU:
- Khi người dùng gửi một bức ảnh quảng cáo mới, bạn CHỈ TRẢ LỜI DUY NHẤT [Khối 1: Kết luận chung]:
  + Kết luận bức ảnh ĐẠT TIÊU CHUẨN hoặc CHƯA ĐẠT TIÊU CHUẨN để chạy quảng cáo.
  + Chấm điểm thiết kế cụ thể trên thang điểm 10 dựa trên các tiêu chí thị giác thực tế của bức ảnh (sản phẩm, chữ viết, màu sắc, nút bấm).
  + Đưa ra 2-3 câu nhận xét tổng quan có đầy đủ chủ ngữ vị ngữ.
  + Sau đó, bạn HỎI người dùng ngắn gọn xem họ có muốn mình phân tích chi tiết về bố cục thị giác và mật độ chữ viết của bức ảnh này không.
  + TUYỆT ĐỐI KHÔNG trả lời dồn dập các khối 2, 3, 4, 5 cùng một lúc để tránh làm người đọc bị ngợp.
- Khi người dùng đồng ý hoặc yêu cầu xem tiếp (ví dụ: xem bố cục chữ, xem ưu nhược điểm, xem đề xuất):
  + Bạn nhìn lại bức ảnh thực tế và trả lời sâu về phần đó.
  + Cuối mỗi phần, tiếp tục hỏi xem họ có muốn xem phần tiếp theo hay không.`;
}

// HIỂN THỊ LỜI CHÀO BAN ĐẦU VỚI HIỆU ỨNG GÕ CHỮ
async function playInitialGreeting() {
  chatContainer.innerHTML = '';
  showTypingIndicator("Hoàng An đang soạn lời chào...");
  await delay(800);
  hideTypingIndicator();

  const greetingLines = [
    "Chào bạn, mình là Hoàng An.",
    "Mình rất vui được đồng hành cùng bạn trong việc xem xét và tối ưu hóa các hình ảnh quảng cáo.",
    "Trước khi bắt đầu, bạn có thể chia sẻ cho mình biết tên của bạn để chúng mình tiện xưng hô được không?"
  ];
  await streamLines(greetingLines);
}

// Khởi động trang web
window.addEventListener('DOMContentLoaded', () => {
  if (!userName) {
    playInitialGreeting();
  } else {
    const callName = getDynamicCallName();
    const welcomeBackLines = [
      `Chào ${callName}, mình rất vui được gặp lại bạn.`,
      `Bạn có thể gửi hình ảnh quảng cáo mới vào đây để chúng mình cùng phân tích tiếp nhé.`
    ];
    streamLines(welcomeBackLines);
  }
});

// XỬ LÝ SỰ KIỆN ĐÍNH KÈM HÌNH ẢNH
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
    chatInput.placeholder = "Nhập thêm lời nhắn cho ảnh (hoặc bấm gửi ngay)...";
    chatInput.focus();
  };
  reader.readAsDataURL(file);
}

btnRemoveAttachment.addEventListener('click', () => {
  clearAttachment();
  updateInputPlaceholder();
});

function clearAttachment() {
  currentBase64 = null;
  currentMimeType = null;
  currentFileName = null;
  fileInput.value = '';
  attachedThumb.src = '';
  attachedImagePreview.classList.add('hidden');
  attachedImagePreview.classList.remove('flex');
}

// MODAL API KEY
btnApiKeyModal.addEventListener('click', () => apiModal.classList.remove('hidden'));
btnCloseModal.addEventListener('click', () => apiModal.classList.add('hidden'));
btnSaveKey.addEventListener('click', () => {
  const key = inputApiKey.value.trim();
  localStorage.setItem('GEMINI_API_KEY', key);
  apiModal.classList.add('hidden');
  alert('Đã lưu API Key thành công! Bây giờ mọi câu trả lời sẽ được sinh trực tiếp từ AI.');
});

// MODAL TÀI LIỆU ĐÀO TẠO PDF
btnDocsModal.addEventListener('click', () => docsModal.classList.remove('hidden'));
btnCloseDocsModal.addEventListener('click', () => docsModal.classList.add('hidden'));
btnDoneDocsModal.addEventListener('click', () => docsModal.classList.add('hidden'));

// NÚT BẮT ĐẦU LẠI CUỘC HỘI THOẠI
btnResetChat.addEventListener('click', () => {
  if (confirm('Bạn có muốn bắt đầu lại cuộc trò chuyện và nhập lại thông tin từ đầu không?')) {
    userName = "";
    userIndustry = "";
    nameVariations = [];
    activeImageData = null;
    conversationHistory = [];
    localStorage.removeItem('ADVISION_USER_NAME');
    localStorage.removeItem('ADVISION_USER_INDUSTRY');
    localStorage.removeItem('ADVISION_NAME_VARIATIONS');
    clearAttachment();
    updateUserBadge();
    updateInputPlaceholder();
    playInitialGreeting();
  }
});

// CẬP NHẬT BADGE VÀ PLACEHOLDER
function updateUserBadge() {
  if (userName) {
    badgeUserName.textContent = userName;
    userInfoBadge.classList.remove('hidden');
    userInfoBadge.classList.add('flex');
    
    if (userIndustry) {
      badgeIndustryName.textContent = userIndustry;
      badgeIndustryContainer.classList.remove('hidden');
    } else {
      badgeIndustryContainer.classList.add('hidden');
    }
  } else {
    userInfoBadge.classList.add('hidden');
    userInfoBadge.classList.remove('flex');
  }
}

function updateInputPlaceholder() {
  if (!userName) {
    chatInput.placeholder = "Nhập tên của bạn (ví dụ: Trần Thái Cương, Linh)...";
  } else if (!userIndustry) {
    const callName = getDynamicCallName();
    chatInput.placeholder = `Sản phẩm ${callName} đang làm thuộc ngành nào (thời trang, mỹ phẩm...)?`;
  } else {
    chatInput.placeholder = "Nhắn tin trao đổi hoặc bấm 📎 để gửi hình ảnh quảng cáo...";
  }
}

// XỬ LÝ SUBMIT FORM CHAT
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isAiTyping) return;
  
  const text = chatInput.value.trim();
  if (!text && !currentBase64) return;

  const sentImgSrc = currentBase64 ? attachedThumb.src : null;
  const sentBase64 = currentBase64;
  const sentMimeType = currentMimeType;
  const sentFileName = currentFileName;

  appendUserMessage(text, sentImgSrc);
  chatInput.value = '';
  clearAttachment();
  updateInputPlaceholder();

  // BƯỚC 1: TRÍCH XUẤT TÊN THÔNG MINH
  if (!userName && !sentBase64) {
    const parsed = extractSmartName(text);
    userName = parsed.mainName;
    nameVariations = parsed.variations;
    localStorage.setItem('ADVISION_USER_NAME', userName);
    localStorage.setItem('ADVISION_NAME_VARIATIONS', JSON.stringify(nameVariations));
    updateUserBadge();
    updateInputPlaceholder();

    const callName = getDynamicCallName();
    const replyLines = [
      `Chào ${callName}, mình rất vui được làm quen với bạn.`,
      `Để mình có thể nắm bắt đúng bối cảnh thiết kế trước khi xem ảnh, bạn có thể chia sẻ cho mình biết sản phẩm bạn đang làm thuộc ngành hàng nào không?`
    ];
    
    showTypingIndicator("Hoàng An đang soạn câu trả lời...");
    await delay(900);
    hideTypingIndicator();
    await streamLines(replyLines);
    return;
  }

  // BƯỚC 2: NHẬN DIỆN NGÀNH HÀNG
  if (userName && !userIndustry && !sentBase64) {
    userIndustry = text.trim();
    localStorage.setItem('ADVISION_USER_INDUSTRY', userIndustry);
    updateUserBadge();
    updateInputPlaceholder();

    const callName = getDynamicCallName();
    const replyLines = [
      `Mình đã nắm được thông tin ngành hàng ${userIndustry} của ${callName} rồi.`,
      `Bây giờ, bạn có thể bấm vào biểu tượng chiếc kẹp giấy ở phía dưới để gửi hình ảnh quảng cáo qua cho mình xem nhé.`
    ];
    
    showTypingIndicator("Hoàng An đang soạn câu trả lời...");
    await delay(900);
    hideTypingIndicator();
    await streamLines(replyLines);
    return;
  }

  // BƯỚC 3: NGƯỜI DÙNG GỬI ẢNH ➔ GỌI VISION API TRỰC TIẾP TỪ GEMINI / OPENAI
  if (sentBase64) {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    // Nếu chưa có API Key, nhắc người dùng dán mã để AI kết nối trực tiếp
    if (!apiKey) {
      showTypingIndicator("Hoàng An đang kiểm tra kết nối AI...");
      await delay(800);
      hideTypingIndicator();

      const noKeyNotice = [
        "Để mình có thể kết nối với trí tuệ nhân tạo và trực tiếp bóc tách hình ảnh quảng cáo thực tế của bạn, bạn hãy bấm vào nút **API Key** ở góc trên để dán mã vào nhé.",
        "Mã Gemini API Key được Google cấp hoàn toàn miễn phí tại trang Google AI Studio (aistudio.google.com). Sau khi lưu Key, mình sẽ phân tích ngay lập tức!"
      ];
      await streamLines(noKeyNotice);
      apiModal.classList.remove('hidden');
      return;
    }

    // Lưu dữ liệu ảnh đang hoạt động
    activeImageData = {
      base64: sentBase64,
      mimeType: sentMimeType,
      fileName: sentFileName
    };
    conversationHistory = []; // Reset lịch sử cho bức ảnh mới

    showTypingIndicator("Hoàng An đang gửi ảnh lên AI để bóc tách...");

    const callName = getDynamicCallName();
    const userPromptText = `Đây là bức ảnh quảng cáo sản phẩm ngành ${userIndustry || "thương mại"} của ${callName}. Ghi chú kèm theo: "${text || "Hãy thẩm định bức ảnh này"}".
Hãy phân tích bức ảnh và BẮT ĐẦU bằng [Khối 1: Kết luận chung] gồm: Đạt hay chưa đạt tiêu chuẩn, điểm số trên thang điểm 10, nhận xét tổng quan 2-3 câu có đầy đủ chủ ngữ vị ngữ. Sau đó hỏi ${callName} xem có muốn phân tích chi tiết về bố cục thị giác và mật độ chữ hay không.`;

    let apiResponse = "";
    try {
      if (apiKey.startsWith('sk-')) {
        apiResponse = await callOpenAiVisionApi(apiKey, sentBase64, sentMimeType, userPromptText);
      } else {
        apiResponse = await callGeminiVisionApi(apiKey, sentBase64, sentMimeType, userPromptText);
      }
    } catch (err) {
      console.error("Lỗi API Vision:", err);
      apiResponse = `Mình gặp sự cố khi kết nối với máy chủ AI (${err.message}). Bạn vui lòng kiểm tra lại mã API Key ở nút góc trên màn hình nhé.`;
    }

    hideTypingIndicator();

    // Lưu lại lượt thoại vào lịch sử
    conversationHistory.push({ role: 'user', text: userPromptText });
    conversationHistory.push({ role: 'model', text: apiResponse });

    const lines = apiResponse.split('\n').map(l => sanitizeStrictRules(l)).filter(l => l.length > 0);
    const quickActions = [
      { text: "Phân tích bố cục & chữ", action: "step_block2" },
      { text: "Xem ưu điểm & hạn chế", action: "step_block3" },
      { text: "Xem đề xuất chỉnh sửa", action: "step_block4" }
    ];

    await streamLines(lines, quickActions);
    return;
  }

  // BƯỚC 4: NGƯỜI DÙNG PHẢN HỒI TIẾP THEO ➔ GỌI API THEO ĐA LƯỢT (MULTI-TURN CHAT API)
  if (text) {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    if (!apiKey) {
      showTypingIndicator("Hoàng An đang kiểm tra kết nối AI...");
      await delay(800);
      hideTypingIndicator();

      const noKeyNotice = [
        "Bạn hãy bấm vào nút **API Key** ở góc trên màn hình để nhập mã Gemini API Key trước nhé.",
        "Khi có API Key, mọi câu trả lời đều sẽ được AI sinh tự động dựa trên ngữ cảnh thực tế của bạn!"
      ];
      await streamLines(noKeyNotice);
      apiModal.classList.remove('hidden');
      return;
    }

    showTypingIndicator("Hoàng An đang gửi câu hỏi tới AI...");

    let apiResponse = "";
    try {
      if (apiKey.startsWith('sk-')) {
        apiResponse = await callOpenAiMultiTurnChat(apiKey, text);
      } else {
        apiResponse = await callGeminiMultiTurnChat(apiKey, text);
      }
    } catch (err) {
      console.error("Lỗi Chat API:", err);
      apiResponse = `Đã xảy ra lỗi khi kết nối với AI (${err.message}). Bạn vui lòng thử lại sau giây lát nhé.`;
    }

    hideTypingIndicator();

    // Lưu vào lịch sử hội thoại
    conversationHistory.push({ role: 'user', text: text });
    conversationHistory.push({ role: 'model', text: apiResponse });

    const lines = apiResponse.split('\n').map(l => sanitizeStrictRules(l)).filter(l => l.length > 0);

    // Gợi ý nút hành động tiếp theo tùy theo ngữ cảnh
    let nextActions = null;
    const lower = text.toLowerCase();
    if (lower.includes('bố cục') || lower.includes('chữ')) {
      nextActions = [
        { text: "Xem ưu điểm & hạn chế", action: "step_block3" },
        { text: "Xem đề xuất chỉnh sửa", action: "step_block4" }
      ];
    } else if (lower.includes('ưu điểm') || lower.includes('hạn chế')) {
      nextActions = [
        { text: "Xem đề xuất chỉnh sửa", action: "step_block4" }
      ];
    } else if (lower.includes('đề xuất') || lower.includes('chỉnh sửa')) {
      nextActions = [
        { text: "Chạy trên Facebook", action: "reply_facebook" },
        { text: "Chạy trên TikTok", action: "reply_tiktok" }
      ];
    }

    await streamLines(lines, nextActions);
  }
});

// HÀM LÀM SẠCH VÀ CHUẨN HÓA CÂU CHỮ TRẢ VỀ TỪ API
function sanitizeStrictRules(str) {
  if (!str) return "";
  return str
    .replace(/^-{3,}$/gm, '')
    .replace(/-{5,}/g, '')
    .replace(/banner\b/gi, 'hình ảnh quảng cáo')
    .replace(/banners\b/gi, 'các hình ảnh quảng cáo')
    .replace(/\bEm chào\b/gi, 'Chào')
    .replace(/\bem\b/gi, 'mình')
    .replace(/->|-->|=>|⇒|→/g, '•')
    .replace(/^> /gm, '')
    .replace(/>/g, '')
    .trim();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// GIAO DIỆN NGƯỜI DÙNG GỬI TIN NHẮN
function appendUserMessage(text, imgSrc) {
  let imgHtml = imgSrc ? `<img src="${imgSrc}" class="max-h-52 rounded-lg border-2 border-slate-400 dark:border-slate-600 mb-2 object-cover">` : '';
  let textHtml = text ? `<p>${text}</p>` : '';

  const html = `
    <div class="flex gap-3 justify-end">
      <div class="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-2xl rounded-tr-none text-base font-normal max-w-xl leading-relaxed shadow-sm border border-slate-700">
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

// HIỂN THỊ ICON ĐANG NHẬP CHỮ (TYPING INDICATOR)
function showTypingIndicator(message = "Hoàng An đang soạn câu trả lời...") {
  isAiTyping = true;
  const html = `
    <div id="typing-indicator" class="flex gap-4">
      <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow">
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="text-sm text-slate-800 dark:text-slate-200 flex items-center gap-3 bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 px-4 py-3 rounded-xl">
        <div class="flex items-center gap-1.5">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
        <span class="text-xs text-slate-600 dark:text-slate-400">${message}</span>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function hideTypingIndicator() {
  isAiTyping = false;
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// HIỆU ỨNG GÕ CHỮ TỪNG DÒNG MƯỢT MÀ VÀ FADE TỪ TRÁI SANG PHẢI
async function streamLines(linesArray, actionButtons = null) {
  isAiTyping = true;
  
  const messageWrapperId = 'agent-msg-' + Date.now();
  const html = `
    <div class="flex gap-4">
      <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow self-start mt-1">
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="space-y-3 text-base text-slate-900 dark:text-slate-100 leading-relaxed flex-1 prose-contrast">
        <div id="${messageWrapperId}" class="bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-2.5 text-slate-900 dark:text-slate-100">
        </div>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', html);
  const container = document.getElementById(messageWrapperId);

  // In ra từng dòng với hiệu ứng fade-in từ trái sang phải
  for (let i = 0; i < linesArray.length; i++) {
    const line = linesArray[i].trim();
    if (!line) continue;

    const p = document.createElement('p');
    p.className = 'fade-in-text font-normal text-slate-900 dark:text-slate-100';
    p.textContent = line;
    container.appendChild(p);
    scrollToBottom();

    await delay(160);
  }

  // Nếu có nút hành động nhanh, hiển thị phía dưới
  if (actionButtons && actionButtons.length > 0) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 mt-3 fade-in-text';
    actionsDiv.innerHTML = actionButtons.map(btn => `
      <button type="button" onclick="triggerQuickAction('${btn.text}')" class="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 transition-all shadow-sm">
        ${btn.text}
      </button>
    `).join('');
    container.appendChild(actionsDiv);
    scrollToBottom();
  }

  isAiTyping = false;
}

// HÀM KÍCH HOẠT NÚT HÀNH ĐỘNG NHANH
window.triggerQuickAction = function(actionText) {
  chatInput.value = actionText;
  chatForm.dispatchEvent(new Event('submit'));
};

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// =============================================================================
// CÁC HÀM GỌI API THỰC TẾ (REAL API ENGINE CHO GEMINI VÀ OPENAI)
// =============================================================================

// 1. GỌI GEMINI VISION API CHO ẢNH MỚI
async function callGeminiVisionApi(apiKey, base64Data, mimeType, userText) {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  let lastErr = null;

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              { text: `${getSystemPrompt()}\n\n${userText}` },
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }]
        })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error?.message || `HTTP ${resp.status}`);
      }

      const json = await resp.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Không thể kết nối với Gemini API");
}

// 2. GỌI GEMINI MULTI-TURN CHAT (GỬI KÈM NGỮ CẢNH ẢNH + LỊCH SỬ TRAO ĐỔI)
async function callGeminiMultiTurnChat(apiKey, newText) {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
  let lastErr = null;

  // Xây dựng contents array chứa toàn bộ lịch sử và ảnh ban đầu
  const contents = [];

  // Thêm lượt đầu tiên kèm ảnh (nếu có)
  if (activeImageData) {
    const firstTurnParts = [
      { text: `${getSystemPrompt()}\n\nBức ảnh quảng cáo người dùng đã tải lên:` },
      { inline_data: { mime_type: activeImageData.mimeType, data: activeImageData.base64 } }
    ];
    contents.push({ role: 'user', parts: firstTurnParts });
  } else {
    contents.push({ role: 'user', parts: [{ text: getSystemPrompt() }] });
  }

  // Thêm các lượt hội thoại tiếp theo
  for (let i = 0; i < conversationHistory.length; i++) {
    const item = conversationHistory[i];
    contents.push({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.text }]
    });
  }

  // Thêm câu hỏi mới của người dùng
  contents.push({
    role: 'user',
    parts: [{ text: `${newText}\n(Lưu ý: Bạn là Hoàng An, tự xưng là mình, gọi người dùng bằng tên, không chào lại, trả lời có đầy đủ chủ vị, không dùng từ banner, không dùng dòng kẻ)` }]
  });

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: contents })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error?.message || `HTTP ${resp.status}`);
      }

      const json = await resp.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Không thể kết nối với Gemini Chat API");
}

// 3. GỌI OPENAI VISION API
async function callOpenAiVisionApi(apiKey, base64Data, mimeType, userText) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        {
          role: 'user',
          content: [
            { type: 'text', text: userText },
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

// 4. GỌI OPENAI MULTI-TURN CHAT
async function callOpenAiMultiTurnChat(apiKey, newText) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const messages = [{ role: 'system', content: getSystemPrompt() }];

  if (activeImageData) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: 'Đây là hình ảnh quảng cáo đang trao đổi:' },
        { type: 'image_url', image_url: { url: `data:${activeImageData.mimeType};base64,${activeImageData.base64}` } }
      ]
    });
  }

  for (const item of conversationHistory) {
    messages.push({
      role: item.role === 'model' ? 'assistant' : 'user',
      content: item.text
    });
  }

  messages.push({ role: 'user', content: newText });

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 1000
    })
  });

  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.error?.message || "OpenAI Chat Error");
  }

  const json = await resp.json();
  return json.choices?.[0]?.message?.content || "";
}
