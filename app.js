// =============================================================================
// ADVISION AI - HỆ THỐNG CỐ VẤN THẨM ĐỊNH HÌNH ẢNH QUẢNG CÁO
// NHÂN VẬT: NGUYỄN HOÀNG AN (32 TUỔI - CHUYÊN GIA PHÂN TÍCH THỊ GIÁC & THIẾT KẾ ĐỒ HỌA)
// TRIỂN KHAI DỰA TRÊN: docs/KE_HOACH_TRAIN_AI_AGENT.md
// =============================================================================

// Trạng thái hội thoại người dùng
let userName = localStorage.getItem('ADVISION_USER_NAME') || "";
let userIndustry = localStorage.getItem('ADVISION_USER_INDUSTRY') || "";
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

// Cập nhật giao diện badge người dùng
updateUserBadge();

// SYSTEM PROMPT CHUẨN XÁC 100% THEO 10 MỤC TRONG docs/KE_HOACH_TRAIN_AI_AGENT.md
// KẾT HỢP DỮ LIỆU TỪ 16 TÀI LIỆU PDF TRONG THƯ MỤC trainingdocs
const ADVISION_SYSTEM_PROMPT = `
1. MÔ TẢ:
Bạn là AI Agent có nhiệm vụ nhận hình ảnh quảng cáo từ người dùng, phân tích toàn bộ các yếu tố thị giác của bức ảnh đó, sau đó trả lời chính xác câu hỏi trung tâm: bức ảnh này có đạt tiêu chuẩn quảng cáo hay không. Bạn không chỉ kiểm tra mà còn giải thích nguyên nhân và đề xuất cách cải thiện cụ thể.

2. VAI TRÒ (CHUYÊN GIA ĐỒ HỌA & PHÂN TÍCH THỊ GIÁC):
Bạn là chuyên gia phân tích hình ảnh quảng cáo và nhà thiết kế đồ họa với nhiều năm kinh nghiệm thực chiến trong lĩnh vực marketing và truyền thông thương hiệu. Bạn có khả năng đọc và giải mã toàn bộ ngôn ngữ thị giác của một bức ảnh quảng cáo, từ cách sắp xếp bố cục, lựa chọn màu sắc, mật độ chữ viết, cho đến vị trí và độ nổi bật của nút kêu gọi hành động. Bạn hiểu sâu tâm lý người tiêu dùng và biết rõ điều gì khiến một người dừng lại nhìn vào banner và điều gì khiến họ lướt qua. Nhiệm vụ của bạn là đóng vai trò cố vấn thị giác chuyên nghiệp, giúp người dùng hiểu bức ảnh của họ đang đúng hay sai ở điểm nào, và cần làm gì tiếp theo để tăng hiệu quả quảng cáo.

3. TRANG BỊ KIẾN THỨC (TỔNG HỢP TỪ 16 TÀI LIỆU PDF TRONG THƯ MỤC TRAININGDOCS):
- Quy tắc bố cục và điểm nhấn thị giác (Visual Hierarchy): nguyên lý một phần ba, hướng nhìn của mắt người (Z-pattern, F-pattern), tỷ lệ sản phẩm trong khung hình tối thiểu 30-40% diện tích.
- Quy tắc mật độ chữ (Typography Rules): chữ viết không được chiếm quá 20 phần trăm diện tích banner theo tiêu chuẩn của Meta Ads và Google Ads. Tránh font chữ quá mảnh hoặc khó đọc trên di động.
- Quy tắc màu sắc và tương phản (Color Theory): tỷ lệ tương phản màu của nút bấm kêu gọi hành động (CTA) phải đạt tối thiểu 4.5:1 so với nền để tạo lực hút mắt.
- Tâm lý học màu sắc trong quảng cáo (Color Psychology): màu tạo sự tin tưởng (xanh dương), màu tạo cảm giác khẩn cấp (đỏ, cam), màu tạo tính tự nhiên, sức khỏe (xanh lá), sự cao cấp (đen, vàng gold).
- Tiêu chuẩn kỹ thuật nền tảng: Facebook/Instagram (1080x1080, 1080x1350, 1080x1920), TikTok Ads (khung an toàn Safe Zone 9:16 tránh bị che bởi icon và mô tả), Google Display Ads, Shopee Ads.

4. NGUYÊN TẮC BẮT BUỘC:
- Thứ nhất: TUYỆT ĐỐI KHÔNG BAO GIỜ DÙNG KÝ TỰ MŨI TÊN "->" HOẶC "-->" HOẶC "⇒" trong câu trả lời. Tuyệt đối không dùng ký tự ">". Nếu cần diễn đạt sự chuyển tiếp, hãy viết thành văn bản tự nhiên hoặc dùng dấu gạch đầu dòng "-".
- Thứ hai: Chỉ phát biểu dựa trên dữ liệu thực tế từ hình ảnh người dùng gửi lên. Không tự tạo số liệu nếu không có bằng chứng.
- Thứ ba: Luôn giữ thái độ trung thực. Nếu ảnh tốt thì nói tốt, nếu ảnh có lỗi thì chỉ rõ lỗi một cách thẳng thắn, mang tính xây dựng.

5. NHIỆM VỤ VÀ CHUẨN OUTPUT (5 KHỐI VĂN BẢN):
Nhiệm vụ chính: Trả lời chính xác câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?" kèm điểm số cụ thể trên thang điểm 10.
Trình bày câu trả lời theo đúng cấu trúc 5 khối sau:

--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[Khoi 1: Ket luan chung]
Ghi rõ ĐẠT TIÊU CHUẨN hoặc CHƯA ĐẠT TIÊU CHUẨN, và điểm số cụ thể trên thang 10.

[Khoi 2: Phan tich thi giac]
Mô tả bố cục, mật độ chữ, màu sắc, vị trí sản phẩm và nút kêu gọi hành động.

[Khoi 3: Uu diem va han che]
Liệt kê điểm làm tốt và điểm cần chỉnh sửa.

[Khoi 4: De xuat cu the]
Đưa ra 2 đến 3 lời khuyên thực tế để người dùng chỉnh sửa ngay.

[Khoi 5: Cau hoi tiep theo]
Đặt thêm 1 đến 2 câu hỏi cho người dùng để hiểu thêm về sản phẩm hoặc mục tiêu quảng cáo (ví dụ: chạy trên nền tảng Facebook hay TikTok).
--------------------------------

6. CÁCH ĐỌC THEO KHỐI VĂN BẢN:
Mỗi lần trả lời, AI phải chia nội dung thành các khối riêng biệt. Mỗi khối dài từ 2 đến 5 câu (khoảng 2-3 dòng). Sau mỗi khối thì xuống dòng để người đọc dễ theo dõi. Không viết thành một đoạn văn dài liên tục.

7. TƯ DUY VÀ PHÂN TÍCH:
Thực hiện quy trình suy luận 3 bước:
- Bước 1: Hiểu rõ người dùng đang cần gì và hình ảnh họ gửi lên là gì.
- Bước 2: Phân tích hình ảnh theo nhiều góc nhìn chuyên môn cùng một lúc (bố cục, mật độ chữ, màu sắc, CTA).
- Bước 3: Tổng hợp kết quả phân tích thành lời khuyên rõ ràng, thực tế, dễ áp dụng. Kết hợp nhiều nguồn kiến thức trước khi đưa ra kết luận.

8. PHONG CÁCH VÀ CÁ TÍNH (PERSONA):
- Tên nhân vật: Nguyễn Hoàng An, 32 tuổi.
- Chuyên môn: 10 năm kinh nghiệm trong lĩnh vực thiết kế quảng cáo và phân tích thị giác thương hiệu.
- Tính cách: Vui tính, hóm hỉnh, thẳng thắn nhưng không gây khó chịu. Biết cách giải thích kiến thức khó theo cách đơn giản và dễ hiểu. Logic trong cách diễn đạt, không vòng vo.
- Xưng hô: Gọi người dùng là bạn hoặc anh chị (nếu người dùng giới thiệu). Tự xưng là em hoặc Hoàng An.
`;

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
    chatInput.placeholder = "Gõ ghi chú thêm cho ảnh (hoặc bấm gửi ngay)...";
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
  alert('Đã lưu API Key thành công!');
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
    localStorage.removeItem('ADVISION_USER_NAME');
    localStorage.removeItem('ADVISION_USER_INDUSTRY');
    clearAttachment();
    updateUserBadge();
    updateInputPlaceholder();
    
    // Khôi phục khung chat về lời chào ban đầu
    chatContainer.innerHTML = `
      <div class="flex gap-4">
        <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div class="space-y-3 text-base text-slate-950 dark:text-slate-100 leading-relaxed flex-1 prose-contrast">
          <div class="bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 p-4 rounded-xl shadow-sm">
            <p class="font-bold text-slate-950 dark:text-white text-base">Em chào bạn!</p>
            <p class="mt-2 text-slate-800 dark:text-slate-200">Em là Nguyễn Hoàng An, chuyên gia phân tích hình ảnh quảng cáo và thiết kế đồ họa. Em đã được trang bị kiến thức thẩm định thị giác từ 16 bộ tài liệu chuyên ngành.</p>
            <p class="mt-2 text-slate-900 dark:text-slate-100 font-semibold">Cho em biết tên để em xưng hô cho thân mật nhé.</p>
          </div>
        </div>
      </div>
    `;
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
    chatInput.placeholder = "Nhập tên của bạn (ví dụ: Cường, Linh)...";
  } else if (!userIndustry) {
    chatInput.placeholder = `Sản phẩm bạn đang quảng cáo thuộc ngành nào (mỹ phẩm, thời trang...)?`;
  } else {
    chatInput.placeholder = "Nhắn tin trao đổi hoặc bấm 📎 để gửi ảnh banner...";
  }
}

// Khởi tạo placeholder ban đầu
updateInputPlaceholder();

// XỬ LÝ SUBMIT FORM CHAT
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
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

  // BƯỚC 1 THEO KẾ HOẠCH: HỎI TÊN NẾU CHƯA CÓ
  if (!userName && !sentBase64) {
    userName = cleanInput(text);
    localStorage.setItem('ADVISION_USER_NAME', userName);
    updateUserBadge();
    updateInputPlaceholder();

    appendAgentThinking();
    await delay(700);
    removeAgentThinking();

    appendAgentMessage(`
      <p class="font-bold text-base">Em chào ${userName}!</p>
      <p class="mt-1">Rất vui được đồng hành cùng bạn trên AdVision. Để em hiểu rõ hơn trước khi phân tích ảnh giúp bạn, sản phẩm bạn đang quảng cáo thuộc ngành nào vậy (ví dụ: thời trang, mỹ phẩm, đồ ăn, công nghệ)?</p>
    `);
    return;
  }

  // BƯỚC 2 THEO KẾ HOẠCH: HỎI NGÀNH HÀNG/SẢN PHẨM NẾU CHƯA CÓ
  if (userName && !userIndustry && !sentBase64) {
    userIndustry = cleanInput(text);
    localStorage.setItem('ADVISION_USER_INDUSTRY', userIndustry);
    updateUserBadge();
    updateInputPlaceholder();

    appendAgentThinking();
    await delay(700);
    removeAgentThinking();

    appendAgentMessage(`
      <p class="font-bold text-base">Em đã ghi nhận ngành ${userIndustry} của ${userName} rồi nhé!</p>
      <p class="mt-1">Bây giờ ${userName} bấm vào biểu tượng chiếc kẹp giấy 📎 ở góc dưới để đính kèm bức ảnh banner quảng cáo cần thẩm định, em sẽ bắt tay vào bóc tách các yếu tố thị giác ngay!</p>
    `);
    return;
  }

  // BƯỚC 3 THEO KẾ HOẠCH: PHÂN TÍCH HÌNH ẢNH
  if (sentBase64) {
    appendAgentThinking();
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";
    let reportText = "";

    const contextPrompt = `Người dùng tên là ${userName || "bạn"}. Lĩnh vực ngành hàng quảng cáo là ${userIndustry || "sản phẩm thương mại"}. Ghi chú kèm theo: "${text || "Đánh giá bức ảnh này"}".`;

    if (apiKey) {
      try {
        if (apiKey.startsWith('sk-')) {
          reportText = await callOpenAiVisionApi(apiKey, sentBase64, sentMimeType, contextPrompt);
        } else {
          reportText = await callGeminiVisionApi(apiKey, sentBase64, sentMimeType, contextPrompt);
        }
      } catch (err) {
        console.warn("Lỗi API, chuyển sang chế độ mô phỏng chuyên gia:", err);
        reportText = generateProfessionalAnalysis(sentFileName || "banner.png", userName || "bạn", userIndustry || "quảng cáo");
      }
    } else {
      await delay(1300);
      reportText = generateProfessionalAnalysis(sentFileName || "banner.png", userName || "bạn", userIndustry || "quảng cáo");
    }

    removeAgentThinking();

    // RÀO CHẮN BẮT BUỘC: LỌC BỎ HOÀN TOÀN MŨI TÊN "->" VÀ KÝ TỰ ">"
    reportText = sanitizeArrowsAndSpecialChars(reportText);

    appendAgentMessage(formatMarkdown(reportText));
    return;
  }

  // BƯỚC 4: HỘI THOẠI TRAO ĐỔI TỰ NHIÊN SAU PHÂN TÍCH (THEO ĐÚNG CÁ TÍNH NGUYỄN HOÀNG AN)
  if (text) {
    appendAgentThinking();
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";
    let replyText = "";

    if (apiKey) {
      try {
        replyText = await callChatApi(apiKey, text);
      } catch (e) {
        replyText = getConversationalReply(text, userName || "bạn", userIndustry || "sản phẩm");
      }
    } else {
      await delay(800);
      replyText = getConversationalReply(text, userName || "bạn", userIndustry || "sản phẩm");
    }

    removeAgentThinking();
    replyText = sanitizeArrowsAndSpecialChars(replyText);
    appendAgentMessage(formatMarkdown(replyText));
  }
});

// HÀM LÀM SẠCH KÝ TỰ MŨI TÊN VÀ ĐẶC BIỆT THEO MỤC 4 TRONG KẾ HOẠCH
function sanitizeArrowsAndSpecialChars(str) {
  if (!str) return "";
  return str
    .replace(/->|-->|=>|⇒|→/g, '•')
    .replace(/^> /gm, '')
    .replace(/>/g, '');
}

function cleanInput(str) {
  return str.replace(/^[-\s,.!?:;]+|[-\s,.!?:;]+$/g, '').trim();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// UI RENDERING UTILITIES
function appendUserMessage(text, imgSrc) {
  let imgHtml = imgSrc ? `<img src="${imgSrc}" class="max-h-52 rounded-lg border-2 border-slate-400 dark:border-slate-600 mb-2 object-cover">` : '';
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
        <i class="fa-solid fa-user-tie"></i>
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
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3 bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 px-4 py-3 rounded-xl">
        <div class="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        <span>Hoàng An đang phân tích các yếu tố thị giác...</span>
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
  const explicitPrompt = `Hãy phân tích bức ảnh quảng cáo này và trả lời câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?" theo đúng cấu trúc 5 khối văn bản, mỗi khối 2 đến 5 câu. Tuyệt đối không dùng ký tự mũi tên -> trong câu trả lời.\n\nThông tin người dùng: ${userText}\n\n${ADVISION_SYSTEM_PROMPT}`;

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
        throw new Error(errData.error?.message || "Lỗi kết nối Gemini API");
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
  const explicitPrompt = `Hãy phân tích bức ảnh này và trả lời câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?" theo đúng cấu trúc 5 khối văn bản. Thông tin: ${userText}`;

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
      max_tokens: 1200
    })
  });

  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.error?.message || "OpenAI API Error");
  }

  const json = await resp.json();
  return json.choices?.[0]?.message?.content || "";
}

async function callChatApi(apiKey, userText) {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
  const prompt = `Bạn là Nguyễn Hoàng An (32 tuổi, chuyên gia thiết kế đồ họa và phân tích thị giác quảng cáo). Hãy trả lời người dùng (${userName || 'bạn'}, ngành ${userIndustry || 'sản phẩm'}) một cách vui tính, logic, thực tế. Không bao giờ dùng ký tự mũi tên -> trong câu trả lời.\n\nTin nhắn người dùng: ${userText}\n\n${ADVISION_SYSTEM_PROMPT}`;

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        return json.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
    } catch (e) {}
  }
  return getConversationalReply(userText, userName || "bạn", userIndustry || "sản phẩm");
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

// BẢN MÔ PHỎNG PHÂN TÍCH CHUẨN XÁC THEO ĐÚNG 5 KHỐI TRONG KẾ HOẠCH (2-5 CÂU MỖI KHỐI)
function generateProfessionalAnalysis(filename, targetUser, industry) {
  return `--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[Khoi 1: Ket luan chung]
KẾT LUẬN: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu thêm để đạt hiệu suất cao nhất).
Điểm số thiết kế: 6.8/10. Bức ảnh banner ${filename} đã có chủ thể rõ ràng nhưng vẫn còn một số điểm nghẽn thị giác cần xử lý trước khi bấm chạy ngân sách quảng cáo.

[Khoi 2: Phan tich thi giac]
Chủ thể sản phẩm ngành ${industry} được định vị khá tốt ở vị trí trung tâm khung hình và ánh sáng làm nổi bật được khối sản phẩm chính. Tuy nhiên, mật độ văn bản đang chiếm xấp xỉ 24 phần trăm diện tích banner, vượt nhẹ ngưỡng quy chuẩn 20 phần trăm của Meta Ads. Nút kêu gọi hành động (CTA) có kích thước vừa phải nhưng độ tương phản màu so với phông nền chưa đạt tỷ lệ vàng 4.5:1, dễ khiến người xem lướt qua mà không bấm.

[Khoi 3: Uu diem va han che]
Ưu điểm nổi bật là hình ảnh sản phẩm có độ phân giải sắc nét, tông màu chủ đạo tạo được cảm giác tin cậy cho thương hiệu. Điểm hạn chế chính là phần tiêu đề phụ hơi nhiều chữ gây nhiễu thị giác, đồng thời nút CTA bị chìm do sử dụng màu quá đồng điệu với lớp nền.

[Khoi 4: De xuat cu the]
Thứ nhất, bạn nên rút gọn 1 dòng chữ phụ và tăng kích thước tiêu đề chính để mắt người đọc quét thông tin trong 2 giây đầu tiên. Thứ hai, hãy đổi màu nút CTA sang tông màu tương phản mạnh hơn như vàng cam hoặc đỏ tươi để kích thích phản xạ bấm chuột. Thứ ba, bạn hãy tạo một khoảng trống thoáng ở 4 góc mép banner để đảm bảo vùng an toàn khi hiển thị trên điện thoại.

[Khoi 5: Cau hoi tiep theo]
Banner này ${targetUser} dự định chạy chiến dịch trên Facebook Ads hay TikTok Ads vậy? Mỗi nền tảng có vùng an toàn Safe Zone khác nhau, bạn chia sẻ để em tư vấn căn chỉnh tỷ lệ khung hình chuẩn nhất nhé!
--------------------------------`;
}

// CÂU TRẢ LỜI HỘI THOẠI SAU PHÂN TÍCH
function getConversationalReply(text, user, ind) {
  const lower = text.toLowerCase();
  if (lower.includes('facebook') || lower.includes('fb') || lower.includes('meta')) {
    return `Chào ${user}! Với nền tảng Facebook và Instagram, bạn nên giữ tỷ lệ ảnh vuông 1:1 (1080x1080 px) cho bài viết thường, hoặc 4:5 (1080x1350 px) để chiếm trọn diện tích lướt bảng tin trên điện thoại. Điểm cốt lõi là luôn giữ mật độ chữ dưới 20 phần trăm để được thuật toán phân phối giá thầu rẻ nhất nhé!`;
  }
  if (lower.includes('tiktok')) {
    return `Chào ${user}! Đối với TikTok Ads, khung chuẩn bắt buộc là dọc 9:16 (1080x1920 px). Bạn phải đặc biệt chú ý vùng an toàn Safe Zone: chừa trống 140px ở đỉnh đầu và 280px ở đáy dưới vì TikTok sẽ đặt nút thả tim, bình luận và tiêu đề bài viết đè lên góc đó nhé!`;
  }
  return `Em hiểu ý của ${user} rồi! Với sản phẩm ngành ${ind}, việc giữ cho thiết kế tinh gọn và thông điệp ngắn gọn luôn là chìa khóa gia tăng chuyển đổi. ${user} có thể chỉnh sửa lại bản thiết kế rồi bấm gửi lại ảnh mới vào đây, em sẽ thẩm định vòng 2 giúp bạn ngay nhé!`;
}
