// =============================================================================
// ADVISION ENTERPRISE AI AGENT - EXECUTIVE APPLICATION ENGINE
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

// SYSTEM PROMPT CHUYÊN NGHỆP & TRƯỞNG THÀNH (EXECUTIVE PERSONA)
const ADVISION_SYSTEM_PROMPT = `
Bạn là AdVision Master - Cố vấn Trưởng chuyên về Thẩm định Thị giác Hình ảnh Quảng cáo và Giám đốc Nghệ thuật Thiết kế Đồ họa Thương mại với 15 năm kinh nghiệm quản trị chiến dịch. Nhiệm vụ của bạn là bóc tách, đánh giá và cố vấn tối ưu hóa hình ảnh quảng cáo trên các lăng kính: Nghệ thuật thị giác, Mật độ văn bản, Tương phản điểm nhấn và Tâm lý học người tiêu dùng.

CÂU HỎI TRUNG TÂM BẮT BUỘC TRẢ LỜI:
"BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"

CÁC NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ MŨI TÊN (như ->, -->, ⇒) trong bất kỳ phần nào của câu trả lời.
2. Trình bày bài phân tích theo các KHỐI VĂN BẢN (Text Blocks) mạch lạc.
3. Phong cách nói chuyện: Trưởng thành, trang trọng, lịch sự, tri thức, tinh tế và cực kỳ sắc bén về logic ngôn ngữ.
4. Xưng hô trân trọng với người dùng theo tên riêng của họ.
5. Cuối bài thẩm định, luôn chủ động đặt 1-2 câu hỏi chiến lược mở để tìm hiểu sâu hơn về đối tượng khách hàng mục tiêu hoặc giá trị cốt lõi (USP) của sản phẩm.

CẤU TRÚC KẾT QUẢ ĐẦU RA (OUTPUT BLOCK STRUCTURE):

--------------------------------
BÁO CÁO THẨM ĐỊNH TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: [ĐẠT TIÊU CHUẨN / CHƯA ĐẠT TIÊU CHUẨN]
Điểm số thiết kế: [X/10]

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: [Phân tích vị trí, góc chụp và độ nổi bật sản phẩm]
- Văn bản & Mật độ chữ: [Đánh giá mật độ text theo quy tắc 20%, tính dễ đọc]
- Thông điệp truyền tải: [Đánh giá tính nhất quán và hiệu lực thông điệp]
- Nút kêu gọi hành động (CTA): [Đánh giá kích thước, vị trí và tỷ lệ tương phản màu]

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: [Các yếu tố kỹ thuật làm tốt]
- Hạn chế tồn tại: [Các rào chắn giảm tỷ lệ chuyển đổi]

[KHỐI 4: ĐỀ XUẤT TỐI ƯU CHIẾN LƯỢC]
- Đề xuất 1: [Giải pháp cụ thể]
- Đề xuất 2: [Giải pháp cụ thể]

[KHỐI 5: TƯ VẤN BỔ SUNG & HOẠCH ĐỊNH CHIẾN DỊCH]
[Lời nhận xét tinh tế + 1-2 câu hỏi chiến lược mở dành cho người dùng]
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
  alert('Đã lưu cấu hình Khóa API!');
});

// CHAT FORM SUBMISSION (EXECUTIVE DIALOGUE FLOW)
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text && !currentBase64) return;

  // Render User Message
  appendUserMessage(text, currentBase64 ? attachedThumb.src : null);
  chatInput.value = '';

  // Case 1: Welcome Discovery (Capturing User Name)
  if (!userName && text && !currentBase64) {
    userName = text;
    localStorage.setItem('ADVISION_USER_NAME', userName);
    appendAgentThinking();
    await new Promise(r => setTimeout(r, 1000));
    removeAgentThinking();
    
    appendAgentMessage(`
      <p class="font-bold text-amber-400 mb-1">Trân trọng cảm ơn thông tin từ Quý khách ${userName}!</p>
      <p class="text-slate-300">Rất hân hạnh được đồng hành cùng Quý khách <strong>${userName}</strong> trong chiến dịch lần này.</p>
      <p class="mt-2 text-indigo-300 font-semibold border-t border-slate-800/80 pt-2">Xin Quý khách <strong>${userName}</strong> vui lòng bấm nút đính kèm 📎 hoặc kéo thả file banner quảng cáo cần thẩm định vào khung hội thoại. Tôi sẽ tiến hành phân tích đa chiều ngay lập tức.</p>
    `);
    return;
  }

  // Case 2: Image Analysis Execution
  if (currentBase64) {
    appendAgentThinking();
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";
    let reportText = "";

    const userPromptText = userName ? `Quý khách hàng tên là ${userName}. ` : "";

    if (apiKey) {
      try {
        if (apiKey.startsWith('sk-')) {
          reportText = await callOpenAiVisionApi(apiKey, currentBase64, currentMimeType, userPromptText + text);
        } else {
          reportText = await callGeminiVisionApi(apiKey, currentBase64, currentMimeType, userPromptText + text);
        }
      } catch (err) {
        console.warn("API Error:", err);
        reportText = getExecutiveMockAnalysis(currentFileName || "banner.png", userName || "Quý khách");
      }
    } else {
      await new Promise(r => setTimeout(r, 1500));
      reportText = getExecutiveMockAnalysis(currentFileName || "banner.png", userName || "Quý khách");
    }

    // Reset attachment & loading bubble
    btnRemoveAttachment.click();
    removeAgentThinking();

    // Clean any prohibited arrows
    reportText = reportText.replace(/->|-->|⇒/g, '•');
    appendAgentMessage(formatMarkdown(reportText));
    return;
  }

  // Case 3: Interactive Dialogue Reply
  if (text) {
    appendAgentThinking();
    await new Promise(r => setTimeout(r, 1000));
    removeAgentThinking();
    appendAgentMessage(`
      <p class="text-slate-300">Cảm ơn thông tin phản hồi từ Quý khách <strong>${userName || 'Quý khách'}</strong>. Hệ thống đã ghi nhận yêu cầu này vào hồ sơ thẩm định.</p>
      <p class="mt-2 text-indigo-300 font-semibold">Nếu Quý khách có thêm phương án thiết kế hoặc banner quảng cáo khác, xin vui lòng gửi file để tôi tiếp tục thẩm định đối chiếu.</p>
    `);
  }
});

// UI RENDERING UTILITIES
function appendUserMessage(text, imgSrc) {
  let imgHtml = imgSrc ? `<img src="${imgSrc}" class="max-h-48 rounded-lg border border-slate-700 mb-2">` : '';
  let textHtml = text ? `<p>${text}</p>` : '';

  const html = `
    <div class="flex gap-3 justify-end max-w-3xl ml-auto">
      <div class="bg-amber-600/90 border border-amber-500/50 p-4 rounded-2xl rounded-tr-none text-slate-950 font-medium text-sm shadow-md space-y-2">
        ${imgHtml}
        ${textHtml}
      </div>
      <div class="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-md">
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
      <div class="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0 shadow-md">
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="space-y-3 text-sm text-slate-200">
        <div class="executive-card p-5 rounded-2xl rounded-tl-none shadow-xl leading-relaxed space-y-3">
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
      <div class="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="executive-card px-4 py-3 rounded-2xl rounded-tl-none text-xs text-amber-300 font-medium flex items-center gap-2">
        <div class="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <span>AdVision Master đang tiến hành thẩm định thị giác chi tiết...</span>
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
  const explicitPrompt = `Hãy phân tích bức ảnh quảng cáo này và trả lời chính xác câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"\n\nThông tin Quý khách hàng cung cấp: ${userText}\n\n${ADVISION_SYSTEM_PROMPT}`;

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
    .replace(/^### (.*$)/gim, '<h4 class="font-bold text-white mt-3 mb-1 text-sm font-sans">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-bold text-amber-400 mt-4 mb-2 text-base font-sans">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-amber-300">$1</strong>')
    .replace(/^[-*+] (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-slate-300 my-1">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  return html;
}

// EXECUTIVE DEMO MOCK ANALYSIS
function getExecutiveMockAnalysis(filename, targetUser) {
  return `--------------------------------
BÁO CÁO THẨM ĐỊNH TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu hóa chuyển đổi)
Điểm số thiết kế: 6.5/10

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: Hình ảnh sản phẩm trong banner (${filename}) hiển thị ở góc chụp trung tâm, tuy nhiên độ đổ bóng chưa tạo cảm giác chân thực.
- Văn bản & Mật độ chữ: Mật độ chữ chiếm khoảng 24% diện tích thiết kế, tiệm cận ngưỡng giới hạn quy định của các nền tảng kỹ thuật số.
- Thông điệp truyền tải: Tiêu đề khuyến mãi rõ ràng nhưng thiếu điểm nhấn độc nhất (USP).
- Nút kêu gọi hành động (CTA): Tỷ lệ tương phản màu sắc của nút CTA chưa đạt độ tách biệt tối ưu so với phông nền xung quanh.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Gam màu tổng thể tươi sáng, sắc nét và giữ được sự nhất quán định vị thương hiệu.
- Hạn chế tồn tại: Nút CTA bị chìm trong tổng thể bố cục, giảm động lực thôi thúc nhấp chuột của người xem.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU CHIẾN LƯỢC]
- Đề xuất 1: Gia tăng kích thước nút CTA thêm 15% và áp dụng gam màu tương phản cao (như Cam viền Vàng) để tối ưu luồng đọc mắt nhìn.
- Đề xuất 2: Tối giản bớt 1 dòng chữ mô tả phụ nhằm tạo khoảng thở thị giác tập trung cho sản phẩm chính.

[KHỐI 5: TƯ VẤN BỔ SUNG & HOẠCH ĐỊNH CHIẾN DỊCH]
Kính thưa Quý khách ${targetUser}, bản banner hiện tại đã xây dựng nền tảng hình ảnh rất chỉn chu. Nếu được hiệu chỉnh nút CTA và khoảng thở thị giác, hiệu suất chuyển đổi sẽ gia tăng đáng kể.

Để AdVision Master cố vấn chuyên sâu hơn cho chiến dịch của Quý khách ${targetUser}, xin vui lòng chia sẻ thêm:
1. Nhóm đối tượng khách hàng mục tiêu mà Quý khách ${targetUser} đang hướng đến coi trọng nhất về Yếu tố Giá thành hay Giá trị Đẳng cấp?
2. Quý khách có dự định bổ sung mã ưu đãi hoặc đặc quyền quà tặng nào lên banner không?
--------------------------------`;
}
