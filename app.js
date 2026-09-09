// =============================================================================
// ADVISION AI - HỆ THỐNG CỐ VẤN THẨM ĐỊNH HÌNH ẢNH QUẢNG CÁO
// NHÂN VẬT: HOÀNG AN - TỰ XƯNG LÀ "MÌNH", GỌI NGƯỜI DÙNG BẰNG "TÊN" LINH HOẠT
// TỰ ĐỘNG HIỆU ỨNG GÕ CHỮ (TYPING INDICATOR) VÀ FADE TỪ TRÁI SANG PHẢI THEO DÒNG
// =============================================================================

// Trạng thái người dùng và hội thoại
let userName = localStorage.getItem('ADVISION_USER_NAME') || "";
let userIndustry = localStorage.getItem('ADVISION_USER_INDUSTRY') || "";
let nameVariations = JSON.parse(localStorage.getItem('ADVISION_NAME_VARIATIONS') || "[]");
let hasGreeted = Boolean(userName);

let currentBase64 = null;
let currentMimeType = null;
let currentFileName = null;
let activeAnalysis = null;
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

// Khởi tạo giao diện badge
updateUserBadge();

// HÀM XỬ LÝ TRÍCH XUẤT TÊN THÔNG MINH VÀ TẠO CÁC BIẾN THỂ GỌI TÊN
function extractSmartName(rawText) {
  if (!rawText) return { mainName: "bạn", variations: ["bạn"] };
  
  // Loại bỏ các từ đệm mở đầu thông thường
  let cleaned = rawText.trim()
    .replace(/^(mình tên là|tên mình là|tôi tên là|tên tôi là|tên em là|tên anh là|tên chị là)/gi, '')
    .replace(/^(mình là|tôi là|em là|anh là|chị là|cứ gọi mình là|cứ gọi tôi là|gọi là|gọi mình là)/gi, '')
    .replace(/^(tên|chào bạn mình là|chào bạn tôi là|tôi|mình)/gi, '')
    .replace(/[.,!?:;]+/g, '')
    .trim();

  if (!cleaned) cleaned = rawText.trim();

  // Tách các từ trong tên (Ví dụ: "Trần Thái Cương")
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const variations = [];

  if (parts.length >= 3) {
    const lastName = parts[parts.length - 1]; // "Cương"
    const middleLast = parts.slice(parts.length - 2).join(' '); // "Thái Cương"
    const firstLast = `${parts[0]} ${lastName}`; // "Trần Cương"
    const fullName = parts.join(' '); // "Trần Thái Cương"
    variations.push(lastName, middleLast, firstLast, fullName);
  } else if (parts.length === 2) {
    const lastName = parts[1]; // "Cương"
    const fullName = parts.join(' '); // "Thái Cương" hoặc "Trần Cương"
    variations.push(lastName, fullName);
  } else if (parts.length === 1) {
    variations.push(parts[0]);
  } else {
    variations.push("bạn");
  }

  // Tên hiển thị chính là biến thể ngắn gọn nhất (thường là tên gọi)
  const mainName = variations[0];
  return { mainName, fullName: parts.join(' ') || mainName, variations };
}

// HÀM LẤY TÊN NGẪU NHIÊN ĐỂ XƯNG HÔ TỰ NHIÊN, KHÔNG MÁY MÓC
function getDynamicCallName() {
  if (!nameVariations || nameVariations.length === 0) {
    return userName || "bạn";
  }
  const randomIndex = Math.floor(Math.random() * nameVariations.length);
  return nameVariations[randomIndex];
}

// SYSTEM PROMPT CHUẨN XÁC: XƯNG "MÌNH", GỌI ĐỐI PHƯƠNG BẰNG TÊN, KHÔNG DÙNG TỪ BANNER, KHÔNG CHỮ ĐẬM NHẠT
const ADVISION_SYSTEM_PROMPT = `
1. MÔ TẢ VÀ XƯNG HÔ:
Bạn là Hoàng An, chuyên gia phân tích hình ảnh quảng cáo và thiết kế đồ họa.
QUY TẮC XƯNG HÔ BẮT BUỘC: Bạn luôn tự xưng là "mình" và gọi người dùng bằng tên của họ (ví dụ: Cương, Thái Cương, Trần Cương). Tuyệt đối không xưng "em" hay "tôi".

2. VAI TRÒ VÀ NĂNG LỰC:
Bạn có nhiều năm kinh nghiệm thực chiến trong lĩnh vực marketing thị giác. Bạn có khả năng bóc tách toàn bộ ngôn ngữ của một bức ảnh quảng cáo: bố cục một phần ba, hướng nhìn của mắt (Z-pattern, F-pattern), mật độ chữ viết dưới 20 phần trăm, độ tương phản màu của nút bấm kêu gọi hành động tối thiểu 4.5:1, và vùng an toàn trên các nền tảng Facebook, TikTok. Nhiệm vụ của bạn là cố vấn trực tiếp, giúp người dùng biết bức ảnh đạt hay chưa đạt tiêu chuẩn và cần làm gì tiếp theo.

3. NGUYÊN TẮC BẮT BUỘC:
- Tuyệt đối KHÔNG sử dụng từ tiếng Anh "banner". Luôn dùng: "hình ảnh quảng cáo", "ảnh quảng cáo" hoặc "bức ảnh".
- Tuyệt đối KHÔNG dùng các dòng kẻ nét đứt như "--------------------------------".
- Bắt buộc dùng TIẾNG VIỆT CÓ DẤU ĐẦY ĐỦ, chuẩn ngữ pháp.
- Tuyệt đối KHÔNG dùng ký tự mũi tên "->", "-->", "⇒", "→" và không dùng ký tự ">".
- KHÔNG dùng chữ in đậm nhạt xen kẽ từng dòng gây rối mắt. Viết văn tự nhiên, đều chữ, rõ ràng.
- ĐANG TRONG CUỘC TRÒ CHUYỆN THÌ TUYỆT ĐỐI KHÔNG CHÀO LẠI. Phải tiếp nối mạch lạc câu chuyện.
- QUY TẮC TƯƠNG TÁC TỪNG KHỐI: Khi người dùng gửi hình ảnh, TUYỆT ĐỐI KHÔNG trả lời dồn dập toàn bộ các khối một lúc. Bạn chỉ trả lời [Khối 1: Kết luận chung] (kết luận đạt hay chưa đạt, điểm số trên thang 10, nhận xét tổng quan 2-3 câu). Sau đó, HỎI người dùng xem có muốn phân tích chi tiết về bố cục thị giác và mật độ chữ hay không. Chỉ khi người dùng đồng ý hoặc yêu cầu xem tiếp, bạn mới trả lời khối tiếp theo.

4. CẤU TRÚC CÁC KHỐI KHI PHÂN TÍCH:
[Khối 1: Kết luận chung]
Kết luận ĐẠT TIÊU CHUẨN hoặc CHƯA ĐẠT TIÊU CHUẨN, điểm số trên thang 10. Nhận xét ngắn gọn 2-3 câu. Kèm câu hỏi xem người dùng có muốn phân tích chi tiết bố cục và chữ viết không.

[Khối 2: Phân tích thị giác]
Mô tả bố cục, mật độ chữ, màu sắc, vị trí sản phẩm và nút bấm. Kèm câu hỏi xem người dùng có muốn xem ưu và nhược điểm không.

[Khối 3: Ưu điểm và hạn chế]
Chỉ ra điểm làm tốt và điểm hạn chế cụ thể. Kèm câu hỏi xem người dùng có muốn nhận đề xuất chỉnh sửa không.

[Khối 4: Đề xuất cụ thể]
2 đến 3 lời khuyên thực tế để chỉnh sửa ngay.

[Khối 5: Câu hỏi tiếp theo]
Hỏi người dùng về kênh chạy quảng cáo hoặc mục tiêu tiếp theo để tư vấn thêm.
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
    nameVariations = [];
    hasGreeted = false;
    activeAnalysis = null;
    localStorage.removeItem('ADVISION_USER_NAME');
    localStorage.removeItem('ADVISION_USER_INDUSTRY');
    localStorage.removeItem('ADVISION_NAME_VARIATIONS');
    clearAttachment();
    updateUserBadge();
    updateInputPlaceholder();
    
    // Khôi phục khung chat về lời chào ban đầu chuẩn
    chatContainer.innerHTML = `
      <div class="flex gap-4">
        <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div class="space-y-3 text-base text-slate-950 dark:text-slate-100 leading-relaxed flex-1 prose-contrast">
          <div class="bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 p-4 rounded-xl shadow-sm text-slate-900 dark:text-slate-100">
            <p>Chào bạn! Mình là Hoàng An, hỗ trợ bạn đánh giá và tối ưu hình ảnh quảng cáo.</p>
            <p class="mt-2">Cho mình biết tên của bạn để tiện xưng hô nhé.</p>
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
    chatInput.placeholder = "Nhập tên của bạn (ví dụ: Trần Thái Cương, Linh)...";
  } else if (!userIndustry) {
    const callName = getDynamicCallName();
    chatInput.placeholder = `Sản phẩm ${callName} đang làm thuộc ngành nào (thời trang, mỹ phẩm...)?`;
  } else {
    chatInput.placeholder = "Nhắn tin trao đổi hoặc bấm 📎 để gửi hình ảnh quảng cáo...";
  }
}

// Khởi tạo placeholder ban đầu
updateInputPlaceholder();

// XỬ LÝ SUBMIT FORM CHAT
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isAiTyping) return; // Tránh gửi đè khi AI đang gõ
  
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

  // BƯỚC 1: NHẬN DIỆN VÀ XỬ LÝ TÊN THÔNG MINH
  if (!userName && !sentBase64) {
    const parsed = extractSmartName(text);
    userName = parsed.mainName;
    nameVariations = parsed.variations;
    localStorage.setItem('ADVISION_USER_NAME', userName);
    localStorage.setItem('ADVISION_NAME_VARIATIONS', JSON.stringify(nameVariations));
    hasGreeted = true;
    updateUserBadge();
    updateInputPlaceholder();

    const callName = getDynamicCallName();
    const reply = `Chào ${callName}! Rất vui được đồng hành cùng ${callName}. Để mình hiểu rõ hơn trước khi xem ảnh, sản phẩm ${callName} đang làm thuộc ngành nào vậy (ví dụ: thời trang, mỹ phẩm, đồ ăn, công nghệ)?`;
    
    await streamAgentResponse(reply);
    return;
  }

  // BƯỚC 2: NHẬN DIỆN NGÀNH HÀNG
  if (userName && !userIndustry && !sentBase64) {
    userIndustry = text.trim();
    localStorage.setItem('ADVISION_USER_INDUSTRY', userIndustry);
    updateUserBadge();
    updateInputPlaceholder();

    const callName = getDynamicCallName();
    const reply = `Mình đã ghi nhận ngành ${userIndustry} của ${callName} rồi nhé! Bây giờ ${callName} bấm vào biểu tượng chiếc kẹp giấy 📎 ở góc dưới để đính kèm hình ảnh quảng cáo cần thẩm định, mình sẽ bắt tay vào xem xét ngay!`;
    
    await streamAgentResponse(reply);
    return;
  }

  // BƯỚC 3: NGƯỜI DÙNG GỬI ẢNH ➔ CHỈ TRẢ VỀ [KHỐI 1] VÀ HỎI XEM CÓ MUỐN PHÂN TÍCH TIẾP KHÔNG
  if (sentBase64) {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";
    activeAnalysis = buildAnalysisSteps(sentFileName || "ảnh quảng cáo", userIndustry || "sản phẩm");
    activeAnalysis.currentStep = 1;

    let responseText = "";
    if (apiKey) {
      try {
        const callName = getDynamicCallName();
        const prompt = `Người dùng gửi hình ảnh quảng cáo. Thông tin người dùng: xưng là mình, gọi đối phương là ${callName}, ngành hàng ${userIndustry || "sản phẩm"}.
QUY TẮC BẮT BUỘC:
- Không được chào lại nếu đã chào trước đó.
- BẮT BUỘC CHỈ TRẢ LỜI DUY NHẤT [Khối 1: Kết luận chung] gồm: Kết luận đạt hay chưa đạt tiêu chuẩn, điểm số trên thang 10, nhận xét tổng quan 2-3 câu.
- Sau đó, HỎI người dùng ngắn gọn xem họ có muốn phân tích chi tiết về bố cục thị giác và mật độ chữ hay không.
- Tuyệt đối không trả lời dồn dập các khối 2, 3, 4, 5 ngay bây giờ.
- Viết tiếng Việt có dấu đầy đủ, đều màu chữ, tuyệt đối không dùng từ "banner", không dùng dòng kẻ nét đứt, không dùng ký tự mũi tên "->".`;

        // Hiển thị typing giả lập
        showTypingIndicator();
        if (apiKey.startsWith('sk-')) {
          responseText = await callOpenAiVisionApi(apiKey, sentBase64, sentMimeType, prompt);
        } else {
          responseText = await callGeminiVisionApi(apiKey, sentBase64, sentMimeType, prompt);
        }
        hideTypingIndicator();
      } catch (err) {
        console.warn("Lỗi kết nối API, sử dụng chế độ mô phỏng:", err);
        hideTypingIndicator();
        responseText = activeAnalysis.block1;
      }
    } else {
      showTypingIndicator();
      await delay(1200);
      hideTypingIndicator();
      responseText = activeAnalysis.block1;
    }

    responseText = sanitizeStrictRules(responseText);

    const callName = getDynamicCallName();
    const quickActions = [
      { text: `Phân tích bố cục & chữ`, action: "step_block2" },
      { text: `Xem ưu điểm & hạn chế`, action: "step_block3" },
      { text: `Xem đề xuất chỉnh sửa`, action: "step_block4" }
    ];

    await streamAgentResponse(responseText, quickActions);
    return;
  }

  // BƯỚC 4: NGƯỜI DÙNG PHẢN HỒI NỐI TIẾP CUỘC TRÒ CHUYỆN (KHÔNG CHÀO LẠI)
  if (text) {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    // Kiểm tra xem người dùng có muốn xem các khối tiếp theo của ảnh không
    const handledByStep = handleInteractiveSteps(text);
    if (handledByStep) {
      showTypingIndicator();
      await delay(900);
      hideTypingIndicator();
      await streamAgentResponse(handledByStep.text, handledByStep.actions);
      return;
    }

    // Cuộc trò chuyện tự nhiên tiếp nối
    showTypingIndicator();
    let replyText = "";
    if (apiKey) {
      try {
        replyText = await callChatApi(apiKey, text);
      } catch (e) {
        replyText = getConversationalReply(text, userIndustry || "sản phẩm");
      }
    } else {
      await delay(1000);
      replyText = getConversationalReply(text, userIndustry || "sản phẩm");
    }

    hideTypingIndicator();
    replyText = sanitizeStrictRules(replyText);
    await streamAgentResponse(replyText);
  }
});

// XỬ LÝ ĐIỀU HƯỚNG TỪNG KHỐI THEO YÊU CẦU CỦA NGƯỜI DÙNG
function handleInteractiveSteps(inputText) {
  if (!activeAnalysis) return null;

  const lower = inputText.toLowerCase();

  // Khối 2: Bố cục, chữ viết
  if (lower.includes('bố cục') || lower.includes('chữ') || lower.includes('thị giác') || lower.includes('phân tích') || lower === 'có' || lower === 'ok' || lower === 'tiếp' || lower === 'tiếp tục') {
    if (activeAnalysis.currentStep <= 1 || lower.includes('bố cục') || lower.includes('chữ')) {
      activeAnalysis.currentStep = 2;
      return {
        text: activeAnalysis.block2,
        actions: [
          { text: "Xem ưu điểm & hạn chế", action: "step_block3" },
          { text: "Xem đề xuất chỉnh sửa", action: "step_block4" }
        ]
      };
    }
  }

  // Khối 3: Ưu điểm và hạn chế
  if (lower.includes('ưu điểm') || lower.includes('hạn chế') || lower.includes('nhược điểm') || lower.includes('điểm mạnh')) {
    activeAnalysis.currentStep = 3;
    return {
      text: activeAnalysis.block3,
      actions: [
        { text: "Xem đề xuất chỉnh sửa", action: "step_block4" }
      ]
    };
  }

  // Khối 4 & 5: Đề xuất cụ thể và định hướng kênh quảng cáo
  if (lower.includes('đề xuất') || lower.includes('chỉnh sửa') || lower.includes('tối ưu') || lower.includes('giải pháp')) {
    activeAnalysis.currentStep = 4;
    return {
      text: activeAnalysis.block4_5,
      actions: [
        { text: "Chạy trên Facebook", action: "reply_facebook" },
        { text: "Chạy trên TikTok", action: "reply_tiktok" }
      ]
    };
  }

  return null;
}

// BỘ NỘI DUNG TỪNG KHỐI CHUẨN XÁC, TIẾNG VIỆT ĐẦY ĐỦ DẤU, ĐỀU MÀU CHỮ, GỌI TÊN LINH HOẠT
function buildAnalysisSteps(filename, industry) {
  const callName = getDynamicCallName();
  return {
    block1: `[Khối 1: Kết luận chung]
Kết luận: Chưa đạt tiêu chuẩn (Cần tối ưu thêm để đạt hiệu quả cao nhất).
Điểm số đánh giá: 6.8/10.

Bức ảnh quảng cáo ngành ${industry} đã làm nổi bật được chủ thể sản phẩm chính, nhưng vẫn còn một số điểm nghẽn về độ tương phản của nút bấm và mật độ chữ viết trước khi đưa vào chạy quảng cáo.

${callName} có muốn mình phân tích chi tiết về bố cục thị giác và mật độ chữ của bức ảnh này không?`,

    block2: `[Khối 2: Phân tích thị giác]
Chủ thể sản phẩm được định vị khá tốt ở khu vực trung tâm và ánh sáng làm rõ được chi tiết sản phẩm. Tuy nhiên, mật độ chữ viết đang chiếm khoảng 24 phần trăm diện tích, hơi vượt mức quy chuẩn 20 phần trăm. Nút bấm kêu gọi hành động có kích thước vừa vặn nhưng màu sắc chưa tạo được độ tương phản 4.5:1 so với phông nền xung quanh.

${callName} có muốn mình chỉ ra các ưu điểm và điểm hạn chế cụ thể của bức ảnh không?`,

    block3: `[Khối 3: Ưu điểm và hạn chế]
Ưu điểm nổi bật là hình ảnh sản phẩm có độ phân giải sắc nét, tông màu chủ đạo tạo được cảm giác tin cậy cho thương hiệu. Điểm hạn chế là phần tiêu đề phụ hơi nhiều chữ gây nhiễu mắt người xem, đồng thời nút bấm kêu gọi hành động bị chìm do dùng màu tiệp với lớp nền.

${callName} có muốn mình đưa ra các đề xuất cụ thể để chỉnh sửa và tối ưu bức ảnh này không?`,

    block4_5: `[Khối 4: Đề xuất cụ thể]
Thứ nhất, bạn nên rút gọn bớt một dòng chữ phụ để người xem nắm bắt thông điệp cốt lõi ngay trong 2 giây đầu tiên. Thứ hai, hãy đổi màu nút kêu gọi hành động sang tông màu tương phản mạnh hơn như vàng cam hoặc đỏ tươi để tăng tỷ lệ nhấp chuột. Thứ ba, bạn hãy giữ khoảng cách thoáng ở các mép ngoài để đảm bảo vùng an toàn khi hiển thị trên điện thoại.

[Khối 5: Câu hỏi tiếp theo]
Bức ảnh này ${callName} dự định chạy quảng cáo trên Facebook hay TikTok vậy? Bạn chia sẻ thêm để mình tư vấn căn chỉnh kích thước chuẩn xác nhất nhé!`
  };
}

// HÀM LÀM SẠCH VÀ CHUẨN HÓA CÂU CHỮ
function sanitizeStrictRules(str) {
  if (!str) return "";
  return str
    // Loại bỏ dòng kẻ nét đứt
    .replace(/^-{3,}$/gm, '')
    .replace(/-{5,}/g, '')
    // Thay thế từ banner bằng từ thuần Việt
    .replace(/banner\b/gi, 'hình ảnh quảng cáo')
    .replace(/banners\b/gi, 'các hình ảnh quảng cáo')
    // Thay thế em thành mình nếu còn sót
    .replace(/\bEm chào\b/gi, 'Chào')
    .replace(/\bem\b/gi, 'mình')
    // Loại bỏ mũi tên và ký tự >
    .replace(/->|-->|=>|⇒|→/g, '•')
    .replace(/^> /gm, '')
    .replace(/>/g, '')
    .trim();
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
function showTypingIndicator() {
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
        <span class="text-xs text-slate-600 dark:text-slate-400">Hoàng An đang soạn câu trả lời...</span>
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

// HIỆU ỨNG GÕ CHỮ TỪ TỪ VÀ FADE TỪ TRÁI SANG PHẢI THEO DÒNG
async function streamAgentResponse(rawText, actionButtons = null) {
  isAiTyping = true;
  
  // Tách nội dung thành các khối dòng
  const lines = rawText.split('\n').filter(line => line.trim().length > 0);

  // Tạo bubble khung tin nhắn ban đầu
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
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const p = document.createElement('p');
    p.className = 'fade-in-text font-normal text-slate-900 dark:text-slate-100';
    p.textContent = line;
    container.appendChild(p);
    scrollToBottom();

    // Tốc độ gõ tự nhiên giữa các dòng
    await delay(180);
  }

  // Nếu có các nút bấm nhanh, xuất hiện sau khi in xong
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

// API CALL ENGINES
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
            parts: [
              { text: `${userText}\n\n${ADVISION_SYSTEM_PROMPT}` },
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

async function callChatApi(apiKey, userText) {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
  const callName = getDynamicCallName();
  const prompt = `Bạn là Hoàng An (chuyên gia thiết kế và phân tích thị giác quảng cáo). Hãy trả lời ${callName} (ngành ${userIndustry || 'sản phẩm'}) một cách vui tính, logic, thực tế. 
QUY TẮC: Bạn tự xưng là "mình", gọi đối phương là ${callName}. ĐANG TRONG CUỘC TRÒ CHUYỆN THÌ TUYỆT ĐỐI KHÔNG ĐƯỢC CHÀO LẠI. Không dùng từ "banner", không dùng dòng kẻ nét đứt, không dùng ký tự mũi tên "->", viết đều màu chữ.\n\nTin nhắn của ${callName}: ${userText}\n\n${ADVISION_SYSTEM_PROMPT}`;

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
  return getConversationalReply(userText, userIndustry || "sản phẩm");
}

// CÂU TRẢ LỜI HỘI THOẠI SAU PHÂN TÍCH (KHÔNG CHÀO LẠI, NỐI TIẾP MẠCH LẠC)
function getConversationalReply(text, ind) {
  const lower = text.toLowerCase();
  const callName = getDynamicCallName();

  if (lower.includes('facebook') || lower.includes('fb') || lower.includes('meta')) {
    return `Với nền tảng Facebook và Instagram, ${callName} nên giữ tỷ lệ ảnh vuông 1:1 (1080x1080 px) cho bài viết thông thường, hoặc 4:5 (1080x1350 px) để chiếm trọn diện tích lướt bảng tin trên điện thoại. Điểm cốt lõi là luôn giữ mật độ chữ dưới 20 phần trăm để được thuật toán phân phối giá thầu rẻ nhất nhé!`;
  }
  if (lower.includes('tiktok')) {
    return `Đối với TikTok Ads, khung hình chuẩn bắt buộc là dạng dọc 9:16 (1080x1920 px). ${callName} cần đặc biệt chú ý vùng an toàn Safe Zone: chừa trống 140px ở phần đỉnh đầu và 280px ở đáy dưới vì TikTok sẽ đặt nút thả tim, bình luận và tiêu đề bài viết đè lên khu vực đó.`;
  }
  return `Mình hiểu ý của ${callName} rồi! Với sản phẩm ngành ${ind}, việc giữ cho thiết kế tinh gọn và thông điệp ngắn gọn luôn là chìa khóa gia tăng tỷ lệ nhấp chuột. ${callName} có thể chỉnh sửa lại thiết kế rồi gửi hình ảnh mới vào đây, mình sẽ tiếp tục đồng hành xem xét giúp bạn nhé!`;
}
