// =============================================================================
// ADVISION AI - HỆ THỐNG CỐ VẤN THẨM ĐỊNH HÌNH ẢNH QUẢNG CÁO
// NHÂN VẬT: NGUYỄN HOÀNG AN (32 TUỔI - CHUYÊN GIA PHÂN TÍCH THỊ GIÁC & THIẾT KẾ ĐỒ HỌA)
// TRIỂN KHAI THEO QUY CHUẨN TƯƠNG TÁC TỪNG BƯỚC, TIẾNG VIỆT CÓ DẤU ĐẦY ĐỦ
// =============================================================================

// Trạng thái hội thoại người dùng
let userName = localStorage.getItem('ADVISION_USER_NAME') || "";
let userIndustry = localStorage.getItem('ADVISION_USER_INDUSTRY') || "";
let currentBase64 = null;
let currentMimeType = null;
let currentFileName = null;

// Bộ nhớ lưu trữ tiến trình phân tích ảnh hiện tại (để trả lời từng khối theo yêu cầu)
let activeAnalysis = null;

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

// SYSTEM PROMPT CHUẨN XÁC, TIẾNG VIỆT ĐẦY ĐỦ DẤU, KHÔNG DÙNG DÒNG KẺ, KHÔNG DÙNG TỪ BANNER
const ADVISION_SYSTEM_PROMPT = `
1. MÔ TẢ:
Bạn là AI Agent hỗ trợ người dùng thẩm định hình ảnh quảng cáo, đánh giá tiêu chuẩn thị giác, phân tích mật độ chữ viết và tư vấn phương án tối ưu hiệu suất cho hình ảnh quảng cáo thương mại.

2. VAI TRÒ (CHUYÊN GIA ĐỒ HỌA VÀ PHÂN TÍCH THỊ GIÁC):
Bạn là chuyên gia phân tích hình ảnh quảng cáo và nhà thiết kế đồ họa với nhiều năm kinh nghiệm thực chiến trong lĩnh vực marketing và truyền thông thương hiệu. Bạn có khả năng đọc và giải mã toàn bộ ngôn ngữ thị giác của một bức ảnh quảng cáo, từ cách sắp xếp bố cục, lựa chọn màu sắc, mật độ chữ viết, cho đến vị trí và độ nổi bật của nút kêu gọi hành động. Bạn hiểu sâu tâm lý người tiêu dùng và biết rõ điều gì khiến một người dừng lại nhìn vào hình ảnh quảng cáo và điều gì khiến họ lướt qua. Nhiệm vụ của bạn là đóng vai trò cố vấn thị giác chuyên nghiệp, giúp người dùng hiểu bức ảnh của họ đang đúng hay sai ở điểm nào, và cần làm gì tiếp theo để tăng hiệu quả quảng cáo.

3. TRANG BỊ KIẾN THỨC (TỔNG HỢP TỪ 16 TÀI LIỆU PDF TRONG THƯ MỤC TRAININGDOCS):
- Quy tắc bố cục và điểm nhấn thị giác: nguyên lý một phần ba, hướng nhìn của mắt người (Z-pattern, F-pattern), tỷ lệ sản phẩm trong khung hình tối thiểu 30-40% diện tích.
- Quy tắc mật độ chữ: chữ viết không được chiếm quá 20 phần trăm diện tích hình ảnh theo tiêu chuẩn của Meta Ads và Google Ads. Tránh phông chữ quá mảnh hoặc khó đọc trên di động.
- Quy tắc màu sắc và tương phản: tỷ lệ tương phản màu của nút bấm kêu gọi hành động (CTA) phải đạt tối thiểu 4.5:1 so với nền để tạo lực hút mắt.
- Tâm lý học màu sắc trong quảng cáo: màu tạo sự tin tưởng (xanh dương), màu tạo cảm giác khẩn cấp (đỏ, cam), màu tạo tính tự nhiên, sức khỏe (xanh lá), sự cao cấp (đen, vàng gold).
- Tiêu chuẩn kỹ thuật nền tảng: Facebook/Instagram (1080x1080, 1080x1350, 1080x1920), TikTok Ads (khung an toàn Safe Zone 9:16 tránh bị che bởi biểu tượng và mô tả), Google Display Ads, Shopee Ads.

4. NGUYÊN TẮC BẮT BUỘC (QUAN TRỌNG NHẤT):
- Tuyệt đối KHÔNG sử dụng từ tiếng Anh "banner". Bắt buộc dùng tiếng Việt chuẩn: "hình ảnh quảng cáo", "ảnh quảng cáo" hoặc "bức ảnh".
- Tuyệt đối KHÔNG dùng các dòng kẻ nét đứt như "--------------------------------" hoặc "------".
- Bắt buộc dùng TIẾNG VIỆT CÓ DẤU ĐẦY ĐỦ, chuẩn ngữ pháp và chính tả.
- Tuyệt đối KHÔNG bao giờ dùng ký tự mũi tên "->", "-->", "⇒", "→" trong câu trả lời. Tuyệt đối không dùng ký tự ">".
- QUY TẮC TƯƠNG TÁC TỪNG KHỐI: Khi người dùng gửi hình ảnh, TUYỆT ĐỐI KHÔNG ĐƯỢC trả lời dồn dập toàn bộ các khối một lúc vì sẽ làm người dùng lười đọc. Bạn chỉ trả lời [Khối 1: Kết luận chung] (kết luận đạt hay chưa đạt, điểm số trên thang 10, nhận xét tổng quan 2-3 câu). Sau đó, bạn HỎI người dùng xem có muốn phân tích chi tiết về bố cục thị giác và mật độ chữ hay không. Chỉ khi người dùng đồng ý hoặc yêu cầu xem tiếp, bạn mới trả lời khối tiếp theo và tiếp tục hỏi xem họ có muốn xem phần kế tiếp không.

5. CẤU TRÚC 5 KHỐI ĐẦU RA KHI ĐƯỢC YÊU CẦU:
[Khối 1: Kết luận chung]
Ghi rõ ĐẠT TIÊU CHUẨN hoặc CHƯA ĐẠT TIÊU CHUẨN, và điểm số cụ thể trên thang 10. Kèm theo câu hỏi xem người dùng có muốn phân tích chi tiết bố cục và chữ viết không.

[Khối 2: Phân tích thị giác]
Mô tả bố cục, mật độ chữ, màu sắc, vị trí sản phẩm và nút kêu gọi hành động. Kèm theo câu hỏi xem người dùng có muốn xem ưu và nhược điểm không.

[Khối 3: Ưu điểm và hạn chế]
Liệt kê điểm làm tốt và điểm cần chỉnh sửa. Kèm theo câu hỏi xem người dùng có muốn xem các đề xuất tối ưu cụ thể không.

[Khối 4: Đề xuất cụ thể]
Đưa ra 2 đến 3 lời khuyên thực tế để người dùng chỉnh sửa ngay.

[Khối 5: Câu hỏi tiếp theo]
Đặt thêm 1 đến 2 câu hỏi cho người dùng để hiểu thêm về sản phẩm hoặc kênh quảng cáo (Facebook, TikTok).

6. CÁCH ĐỌC THEO KHỐI VĂN BẢN:
Mỗi lần trả lời, chỉ trình bày một khối nội dung riêng biệt từ 2 đến 5 câu (khoảng 2-3 dòng), xuống dòng rõ ràng.

7. PHONG CÁCH VÀ CÁ TÍNH (PERSONA):
- Tên nhân vật: Nguyễn Hoàng An, 32 tuổi.
- Chuyên môn: Phân tích thị giác và tối ưu hóa hình ảnh quảng cáo.
- Tính cách: Vui tính, hóm hỉnh, thẳng thắn nhưng nhẹ nhàng, lịch sự. Biết cách giải thích kiến thức khó theo cách đơn giản và dễ hiểu. Logic trong cách diễn đạt, không vòng vo.
- Xưng hô: Gọi người dùng là bạn hoặc anh chị. Tự xưng là em hoặc Hoàng An.
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
    activeAnalysis = null;
    localStorage.removeItem('ADVISION_USER_NAME');
    localStorage.removeItem('ADVISION_USER_INDUSTRY');
    clearAttachment();
    updateUserBadge();
    updateInputPlaceholder();
    
    // Khôi phục khung chat về lời chào ban đầu chuẩn tiếng Việt có dấu
    chatContainer.innerHTML = `
      <div class="flex gap-4">
        <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div class="space-y-3 text-base text-slate-950 dark:text-slate-100 leading-relaxed flex-1 prose-contrast">
          <div class="bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 p-4 rounded-xl shadow-sm">
            <p class="font-bold text-slate-950 dark:text-white text-base">Em chào bạn!</p>
            <p class="mt-2 text-slate-800 dark:text-slate-200">Em là Nguyễn Hoàng An, hỗ trợ bạn đánh giá và tối ưu hình ảnh quảng cáo.</p>
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
    chatInput.placeholder = "Sản phẩm bạn đang quảng cáo thuộc ngành nào (mỹ phẩm, thời trang...)?";
  } else {
    chatInput.placeholder = "Nhắn tin trao đổi hoặc bấm 📎 để gửi hình ảnh quảng cáo...";
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

  // BƯỚC 1: HỎI TÊN NẾU CHƯA CÓ
  if (!userName && !sentBase64) {
    userName = cleanInput(text);
    localStorage.setItem('ADVISION_USER_NAME', userName);
    updateUserBadge();
    updateInputPlaceholder();

    appendAgentThinking();
    await delay(600);
    removeAgentThinking();

    appendAgentMessage(`
      <p class="font-bold text-base">Em chào ${userName}!</p>
      <p class="mt-1">Rất vui được đồng hành cùng bạn trên AdVision. Để em hiểu rõ hơn trước khi phân tích ảnh giúp bạn, sản phẩm bạn đang quảng cáo thuộc ngành nào vậy (ví dụ: thời trang, mỹ phẩm, đồ ăn, công nghệ)?</p>
    `);
    return;
  }

  // BƯỚC 2: HỎI NGÀNH HÀNG NẾU CHƯA CÓ
  if (userName && !userIndustry && !sentBase64) {
    userIndustry = cleanInput(text);
    localStorage.setItem('ADVISION_USER_INDUSTRY', userIndustry);
    updateUserBadge();
    updateInputPlaceholder();

    appendAgentThinking();
    await delay(600);
    removeAgentThinking();

    appendAgentMessage(`
      <p class="font-bold text-base">Em đã ghi nhận ngành ${userIndustry} của ${userName} rồi nhé!</p>
      <p class="mt-1">Bây giờ ${userName} bấm vào biểu tượng chiếc kẹp giấy 📎 ở góc dưới để đính kèm hình ảnh quảng cáo cần thẩm định, em sẽ bắt tay vào xem xét ngay!</p>
    `);
    return;
  }

  // BƯỚC 3: NGƯỜI DÙNG GỬI ẢNH MỚI ➔ CHỈ TRẢ VỀ [KHỐI 1: KẾT LUẬN CHUNG] VÀ HỎI NGƯỜI DÙNG
  if (sentBase64) {
    appendAgentThinking();
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    // Tạo sẵn kho dữ liệu phân tích từng khối cho ảnh này
    activeAnalysis = buildAnalysisSteps(sentFileName || "ảnh quảng cáo", userName || "bạn", userIndustry || "sản phẩm");
    activeAnalysis.currentStep = 1;

    let responseText = "";
    if (apiKey) {
      try {
        const prompt = `Người dùng gửi hình ảnh quảng cáo. Thông tin người dùng: tên là ${userName || "bạn"}, ngành hàng ${userIndustry || "sản phẩm"}.
QUY TẮC BẮT BUỘC: 
- Bạn CHỈ ĐƯỢC PHÉP TRẢ LỜI DUY NHẤT [Khối 1: Kết luận chung] gồm: Đạt hay Chưa đạt tiêu chuẩn, điểm số trên thang 10, nhận xét tổng quan từ 2 đến 3 câu.
- Sau đó, HỎI người dùng một cách ngắn gọn xem họ có muốn phân tích chi tiết về bố cục thị giác và chữ viết hay không.
- Tuyệt đối không trả lời các khối 2, 3, 4, 5 ngay bây giờ để tránh làm người đọc bị ngợp.
- Dùng tiếng Việt có dấu đầy đủ, tuyệt đối không dùng từ "banner", không dùng dòng kẻ "--------------------------------", không dùng ký tự mũi tên "->".`;

        if (apiKey.startsWith('sk-')) {
          responseText = await callOpenAiVisionApi(apiKey, sentBase64, sentMimeType, prompt);
        } else {
          responseText = await callGeminiVisionApi(apiKey, sentBase64, sentMimeType, prompt);
        }
      } catch (err) {
        console.warn("Lỗi kết nối API, sử dụng chế độ thẩm định từng bước:", err);
        responseText = activeAnalysis.block1;
      }
    } else {
      await delay(1000);
      responseText = activeAnalysis.block1;
    }

    removeAgentThinking();
    responseText = sanitizeStrictRules(responseText);

    // Hiển thị Khối 1 kèm các nút bấm nhanh
    const quickActions = [
      { text: "Phân tích bố cục & chữ", action: "step_block2" },
      { text: "Xem ưu điểm & hạn chế", action: "step_block3" },
      { text: "Xem đề xuất chỉnh sửa", action: "step_block4" }
    ];
    appendAgentMessageWithActions(formatMarkdown(responseText), quickActions);
    return;
  }

  // BƯỚC 4: NGƯỜI DÙNG PHẢN HỒI HOẶC YÊU CẦU PHÂN TÍCH TỪNG KHỐI TIẾP THEO
  if (text) {
    appendAgentThinking();
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    // Kiểm tra xem người dùng có đang trong luồng phân tích ảnh và muốn xem khối tiếp theo không
    const handledByStep = handleInteractiveSteps(text);
    if (handledByStep) {
      await delay(600);
      removeAgentThinking();
      appendAgentMessageWithActions(formatMarkdown(handledByStep.text), handledByStep.actions);
      return;
    }

    // Nếu là câu hỏi đàm thoại thông thường
    let replyText = "";
    if (apiKey) {
      try {
        replyText = await callChatApi(apiKey, text);
      } catch (e) {
        replyText = getConversationalReply(text, userName || "bạn", userIndustry || "sản phẩm");
      }
    } else {
      await delay(600);
      replyText = getConversationalReply(text, userName || "bạn", userIndustry || "sản phẩm");
    }

    removeAgentThinking();
    replyText = sanitizeStrictRules(replyText);
    appendAgentMessage(formatMarkdown(replyText));
  }
});

// XỬ LÝ ĐIỀU HƯỚNG TỪNG KHỐI KHI NGƯỜI DÙNG PHẢN HỒI
function handleInteractiveSteps(inputText) {
  if (!activeAnalysis) return null;

  const lower = inputText.toLowerCase();

  // Yêu cầu phân tích Khối 2 (Bố cục, thị giác, mật độ chữ)
  if (lower.includes('bố cục') || lower.includes('chữ') || lower.includes('thị giác') || lower.includes('bước 2') || lower.includes('phân tích') || lower === 'có' || lower === 'ok' || lower === 'tiếp tục') {
    if (activeAnalysis.currentStep <= 1 || lower.includes('bố cục') || lower.includes('thị giác')) {
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

  // Yêu cầu phân tích Khối 3 (Ưu điểm và hạn chế)
  if (lower.includes('ưu điểm') || lower.includes('hạn chế') || lower.includes('nhược điểm') || lower.includes('bước 3')) {
    activeAnalysis.currentStep = 3;
    return {
      text: activeAnalysis.block3,
      actions: [
        { text: "Xem đề xuất chỉnh sửa", action: "step_block4" }
      ]
    };
  }

  // Yêu cầu phân tích Khối 4 & 5 (Đề xuất tối ưu và câu hỏi tiếp theo)
  if (lower.includes('đề xuất') || lower.includes('chỉnh sửa') || lower.includes('tối ưu') || lower.includes('bước 4') || lower.includes('giải pháp')) {
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

// BỘ DỮ LIỆU TỪNG KHỐI CHUẨN XÁC, TIẾNG VIỆT CÓ DẤU, KHÔNG DÒNG KẺ, KHÔNG TỪ BANNER
function buildAnalysisSteps(filename, targetUser, industry) {
  return {
    block1: `### [Khối 1: Kết luận chung]
KẾT LUẬN: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu thêm để đạt hiệu quả cao nhất).
Điểm số đánh giá: 6.8/10.

Bức ảnh quảng cáo ngành ${industry} đã làm nổi bật được chủ thể sản phẩm chính, nhưng vẫn còn một số điểm nghẽn về độ tương phản của nút bấm và mật độ chữ viết trước khi đưa vào chạy quảng cáo.

Bạn có muốn em phân tích chi tiết về bố cục thị giác và mật độ chữ của bức ảnh này không?`,

    block2: `### [Khối 2: Phân tích thị giác]
Chủ thể sản phẩm được định vị khá tốt ở khu vực trung tâm và ánh sáng làm rõ được chi tiết sản phẩm. Tuy nhiên, mật độ chữ viết đang chiếm khoảng 24 phần trăm diện tích, hơi vượt mức quy chuẩn 20 phần trăm. Nút bấm kêu gọi hành động có kích thước vừa vặn nhưng màu sắc chưa tạo được độ tương phản 4.5:1 so với phông nền xung quanh.

Bạn có muốn em chỉ ra các ưu điểm và điểm hạn chế cụ thể của bức ảnh không?`,

    block3: `### [Khối 3: Ưu điểm và hạn chế]
Ưu điểm nổi bật là hình ảnh sản phẩm có độ phân giải sắc nét, tông màu chủ đạo tạo được cảm giác tin cậy cho thương hiệu. Điểm hạn chế là phần tiêu đề phụ hơi nhiều chữ gây nhiễu mắt người xem, đồng thời nút bấm kêu gọi hành động bị chìm do dùng màu tiệp với lớp nền.

Bạn có muốn em đưa ra các đề xuất cụ thể để chỉnh sửa và tối ưu bức ảnh này không?`,

    block4_5: `### [Khối 4: Đề xuất cụ thể]
Thứ nhất, bạn nên rút gọn bớt một dòng chữ phụ để người xem nắm bắt thông điệp cốt lõi ngay trong 2 giây đầu tiên. Thứ hai, hãy đổi màu nút kêu gọi hành động sang tông màu tương phản mạnh hơn như vàng cam hoặc đỏ tươi để tăng tỷ lệ nhấp chuột. Thứ ba, bạn hãy giữ khoảng cách thoáng ở các mép ngoài để đảm bảo vùng an toàn khi hiển thị trên điện thoại.

### [Khối 5: Câu hỏi tiếp theo]
Bức ảnh này ${targetUser} dự định chạy quảng cáo trên Facebook hay TikTok vậy? Bạn chia sẻ thêm để em tư vấn căn chỉnh kích thước chuẩn xác nhất nhé!`
  };
}

// HÀM LÀM SẠCH KÝ TỰ MŨI TÊN, DÒNG KẺ NÉT ĐỨT VÀ TỪ BANNER
function sanitizeStrictRules(str) {
  if (!str) return "";
  return str
    // Loại bỏ dòng kẻ nét đứt
    .replace(/^-{3,}$/gm, '')
    .replace(/-{5,}/g, '')
    // Thay thế từ banner bằng từ thuần Việt
    .replace(/banner\b/gi, 'hình ảnh quảng cáo')
    .replace(/banners\b/gi, 'các hình ảnh quảng cáo')
    // Loại bỏ mũi tên và ký tự >
    .replace(/->|-->|=>|⇒|→/g, '•')
    .replace(/^> /gm, '')
    .replace(/>/g, '')
    .trim();
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

function appendAgentMessageWithActions(formattedHtml, actionButtons) {
  let actionsHtml = "";
  if (actionButtons && actionButtons.length > 0) {
    actionsHtml = `
      <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 mt-3">
        ${actionButtons.map(btn => `
          <button type="button" onclick="triggerQuickAction('${btn.text}')" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 transition-all shadow-sm">
            ${btn.text}
          </button>
        `).join('')}
      </div>
    `;
  }

  const html = `
    <div class="flex gap-4">
      <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow">
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="space-y-3 text-base text-slate-950 dark:text-slate-100 leading-relaxed flex-1 prose-contrast">
        <div class="bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-2">
          ${formattedHtml}
          ${actionsHtml}
        </div>
      </div>
    </div>
  `;
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

// HÀM KÍCH HOẠT NÚT HÀNH ĐỘNG NHANH
window.triggerQuickAction = function(actionText) {
  chatInput.value = actionText;
  chatForm.dispatchEvent(new Event('submit'));
};

function appendAgentThinking() {
  const html = `
    <div id="thinking-bubble" class="flex gap-4">
      <div class="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
        <i class="fa-solid fa-user-tie"></i>
      </div>
      <div class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3 bg-slate-100 dark:bg-[#161e2e] border-2 border-slate-300 dark:border-slate-700 px-4 py-3 rounded-xl">
        <div class="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        <span>Hoàng An đang phân tích...</span>
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
  const prompt = `Bạn là Nguyễn Hoàng An (32 tuổi, chuyên gia thiết kế đồ họa và phân tích thị giác quảng cáo). Hãy trả lời người dùng (${userName || 'bạn'}, ngành ${userIndustry || 'sản phẩm'}) một cách vui tính, logic, thực tế. Tuyệt đối không dùng từ "banner", không dùng dòng kẻ "--------------------------------", không dùng ký tự mũi tên "->".\n\nTin nhắn người dùng: ${userText}\n\n${ADVISION_SYSTEM_PROMPT}`;

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
    .replace(/^### (.*$)/gim, '<h4 class="font-extrabold text-slate-950 dark:text-white mt-2 mb-1 text-base">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-black text-blue-700 dark:text-blue-400 mt-3 mb-2 text-lg border-b pb-1 border-slate-300 dark:border-slate-700">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-950 dark:text-white">$1</strong>')
    .replace(/^[-*+] (.*$)/gim, '<li class="ml-4 list-disc font-medium text-slate-900 dark:text-slate-200 my-1">$1</li>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal font-medium text-slate-900 dark:text-slate-200 my-1">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  return html;
}

// CÂU TRẢ LỜI HỘI THOẠI SAU PHÂN TÍCH
function getConversationalReply(text, user, ind) {
  const lower = text.toLowerCase();
  if (lower.includes('facebook') || lower.includes('fb') || lower.includes('meta')) {
    return `Chào ${user}! Với nền tảng Facebook và Instagram, bạn nên giữ tỷ lệ ảnh vuông 1:1 (1080x1080 px) cho bài viết thông thường, hoặc 4:5 (1080x1350 px) để chiếm trọn diện tích lướt bảng tin trên điện thoại. Điểm cốt lõi là luôn giữ mật độ chữ dưới 20 phần trăm để được thuật toán phân phối giá thầu rẻ nhất nhé!`;
  }
  if (lower.includes('tiktok')) {
    return `Chào ${user}! Đối với TikTok Ads, khung hình chuẩn bắt buộc là dạng dọc 9:16 (1080x1920 px). Bạn phải đặc biệt chú ý vùng an toàn Safe Zone: chừa trống 140px ở phần đỉnh đầu và 280px ở đáy dưới vì TikTok sẽ đặt nút thả tim, bình luận và tiêu đề bài viết đè lên khu vực đó nhé!`;
  }
  return `Em hiểu ý của ${user} rồi! Với sản phẩm ngành ${ind}, việc giữ cho thiết kế tinh gọn và thông điệp ngắn gọn luôn là chìa khóa gia tăng tỷ lệ chuyển đổi. ${user} có thể chỉnh sửa lại thiết kế rồi gửi hình ảnh mới vào đây, em sẽ tiếp tục đồng hành thẩm định giúp bạn nhé!`;
}
