/**
 * =============================================================================
 * ADVISION AI - BỘ ĐIỀU PHỐI HỆ THỐNG TRUNG TÂM (MAIN CONTROLLER)
 * =============================================================================
 * Kết nối các mô-đun:
 * - AdvConfig: Cấu hình hệ thống & khóa API
 * - RulesService: 22 quy chuẩn thẩm định thị giác
 * - PersonaPrompt: Nhân cách Cố vấn Hoàng An & Prompt tri thức 16 PDF
 * - ApiService: Cổng giao tiếp Vision AI (Gemini & OpenAI)
 * - UIController: Quản lý hiển thị, streaming chữ, modal & xem trước ảnh
 */

const AppController = {
  // Trạng thái phiên làm việc (Session State)
  state: {
    userName: localStorage.getItem(AdvConfig.STORAGE_KEYS.USER_NAME) || "",
    userIndustry: localStorage.getItem(AdvConfig.STORAGE_KEYS.USER_INDUSTRY) || "",
    nameVariations: JSON.parse(localStorage.getItem(AdvConfig.STORAGE_KEYS.NAME_VARIATIONS) || "[]"),
    attachedImages: [],
    activeImageData: null,
    conversationHistory: []
  },

  // Khởi động toàn bộ hệ thống
  init() {
    UIController.initModals();
    this.bindEvents();
    this.updateSystemStatus();

    // Hiển thị lời chào mở đầu nếu là người dùng mới
    if (!this.state.userName) {
      this.playInitialGreeting();
    } else {
      const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
      UIController.streamLines([
        `Chào ${callName}, mình rất vui được gặp lại bạn.`,
        `Bạn có thể gửi hình ảnh quảng cáo mới vào đây để chúng mình cùng phân tích tiếp nhé.`
      ]);
    }
  },

  // Đồng bộ trạng thái giao diện và API
  updateSystemStatus() {
    const key = AdvConfig.getEffectiveApiKey();
    if (UIController.elements.inputApiKey) {
      UIController.elements.inputApiKey.value = key;
    }
    UIController.updateApiStatusIndicator(!!key);
    UIController.updateUserBadge(this.state.userName, this.state.userIndustry);
    const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
    UIController.updateInputPlaceholder(this.state.userName, this.state.userIndustry, callName, this.state.attachedImages.length);
  },

  // Lời chào mở đầu thân thiện từ Hoàng An
  async playInitialGreeting() {
    UIController.elements.chatContainer.innerHTML = '';
    UIController.showTypingIndicator("Hoàng An đang chuẩn bị...");
    await UIController.delay(700);
    UIController.hideTypingIndicator();

    const greetingLines = [
      "Chào bạn, mình là Hoàng An.",
      "Mình rất vui được đồng hành cùng bạn trong việc thẩm định và tối ưu hóa các hình ảnh quảng cáo.",
      "Trước khi bắt đầu, bạn có thể chia sẻ cho mình biết tên của bạn để chúng mình tiện xưng hô được không?"
    ];
    await UIController.streamLines(greetingLines);
  },

  // Đăng ký các sự kiện tương tác
  bindEvents() {
    const { chatForm, btnAttachImage, fileInput, btnClearAllAttachments, btnSaveKey, inputApiKey, apiModal, btnResetChat } = UIController.elements;

    // Sự kiện đính kèm hình ảnh
    if (btnAttachImage && fileInput) {
      btnAttachImage.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleIncomingFiles(e.target.files);
        }
      });
    }

    if (btnClearAllAttachments) {
      btnClearAllAttachments.addEventListener('click', () => this.clearAllAttachments());
    }

    // Sự kiện lưu API Key cá nhân
    if (btnSaveKey && inputApiKey) {
      btnSaveKey.addEventListener('click', () => {
        const key = inputApiKey.value.trim();
        localStorage.setItem(AdvConfig.STORAGE_KEYS.API_KEY, key);
        if (apiModal) apiModal.classList.add('hidden');
        this.updateSystemStatus();
        alert('Đã lưu API Key thành công! Hệ thống đã sẵn sàng kết nối AI.');
      });
    }

    // Sự kiện đặt lại cuộc trò chuyện từ đầu
    if (btnResetChat) {
      btnResetChat.addEventListener('click', () => {
        if (confirm('Bạn có muốn bắt đầu lại cuộc trò chuyện và nhập lại thông tin từ đầu không?')) {
          this.state.userName = "";
          this.state.userIndustry = "";
          this.state.nameVariations = [];
          this.state.activeImageData = null;
          this.state.conversationHistory = [];
          localStorage.removeItem(AdvConfig.STORAGE_KEYS.USER_NAME);
          localStorage.removeItem(AdvConfig.STORAGE_KEYS.USER_INDUSTRY);
          localStorage.removeItem(AdvConfig.STORAGE_KEYS.NAME_VARIATIONS);
          this.clearAllAttachments();
          this.updateSystemStatus();
          this.playInitialGreeting();
        }
      });
    }

    // Sự kiện submit khung chat
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleChatSubmit();
      });
    }
  },

  // Xử lý nạp các file ảnh tải lên
  handleIncomingFiles(files) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Vui lòng chọn các file hình ảnh hợp lệ (.png, .jpg, .jpeg, .webp)');
      return;
    }

    let loaded = 0;
    for (const file of validFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.state.attachedImages.push({
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          base64: e.target.result.split(',')[1],
          dataUrl: e.target.result
        });
        loaded++;
        if (loaded === validFiles.length) {
          UIController.renderAttachmentPreviews(this.state.attachedImages);
          const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
          UIController.updateInputPlaceholder(this.state.userName, this.state.userIndustry, callName, this.state.attachedImages.length);
        }
      };
      reader.readAsDataURL(file);
    }
  },

  // Xóa 1 ảnh trong danh sách đính kèm
  removeAttachmentByIndex(index) {
    this.state.attachedImages.splice(index, 1);
    UIController.renderAttachmentPreviews(this.state.attachedImages);
    const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
    UIController.updateInputPlaceholder(this.state.userName, this.state.userIndustry, callName, this.state.attachedImages.length);
  },

  // Xóa toàn bộ ảnh đính kèm
  clearAllAttachments() {
    this.state.attachedImages = [];
    UIController.renderAttachmentPreviews(this.state.attachedImages);
    const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
    UIController.updateInputPlaceholder(this.state.userName, this.state.userIndustry, callName, 0);
  },

  // Kích hoạt phản hồi nhanh từ các nút gợi ý
  triggerQuickAction(actionText) {
    if (UIController.elements.chatInput) {
      UIController.elements.chatInput.value = actionText;
      this.handleChatSubmit();
    }
  },

  // Xử lý gửi tin nhắn người dùng
  async handleChatSubmit() {
    if (UIController.isAiTyping) return;

    const chatInput = UIController.elements.chatInput;
    const text = chatInput.value.trim();
    if (!text && this.state.attachedImages.length === 0) return;

    const sentImages = [...this.state.attachedImages];
    this.clearAllAttachments();
    chatInput.value = '';

    UIController.appendUserMessage(text, sentImages);

    // BƯỚC 1: TRÍCH XUẤT TÊN THÔNG MINH
    if (!this.state.userName && sentImages.length === 0) {
      const parsed = PersonaPrompt.extractSmartName(text);
      this.state.userName = parsed.mainName;
      this.state.nameVariations = parsed.variations;
      localStorage.setItem(AdvConfig.STORAGE_KEYS.USER_NAME, this.state.userName);
      localStorage.setItem(AdvConfig.STORAGE_KEYS.NAME_VARIATIONS, JSON.stringify(this.state.nameVariations));
      this.updateSystemStatus();

      const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
      const replyLines = [
        `Chào ${callName}, mình rất vui được làm quen với bạn.`,
        `Để mình có thể nắm bắt đúng bối cảnh thiết kế trước khi xem ảnh, bạn có thể chia sẻ cho mình biết sản phẩm bạn đang làm thuộc ngành hàng nào không?`
      ];

      UIController.showTypingIndicator("Hoàng An đang soạn câu trả lời...");
      await UIController.delay(800);
      UIController.hideTypingIndicator();
      await UIController.streamLines(replyLines);
      return;
    }

    // BƯỚC 2: NHẬN DIỆN NGÀNH HÀNG
    if (this.state.userName && !this.state.userIndustry && sentImages.length === 0) {
      this.state.userIndustry = text.trim();
      localStorage.setItem(AdvConfig.STORAGE_KEYS.USER_INDUSTRY, this.state.userIndustry);
      this.updateSystemStatus();

      const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
      const replyLines = [
        `Mình đã nắm được thông tin ngành hàng ${this.state.userIndustry} của ${callName} rồi.`,
        `Bây giờ, bạn có thể bấm vào biểu tượng chiếc kẹp giấy ở phía dưới để gửi 1 hoặc nhiều hình ảnh quảng cáo qua cho mình xem nhé.`
      ];

      UIController.showTypingIndicator("Hoàng An đang soạn câu trả lời...");
      await UIController.delay(800);
      UIController.hideTypingIndicator();
      await UIController.streamLines(replyLines);
      return;
    }

    const apiKey = AdvConfig.getEffectiveApiKey();
    if (!apiKey) {
      UIController.showTypingIndicator("Hoàng An đang kiểm tra kết nối...");
      await UIController.delay(700);
      UIController.hideTypingIndicator();
      await UIController.streamLines([
        "Bạn hãy bấm vào nút **API Key** ở góc trên màn hình để cấu hình kết nối AI trước nhé."
      ]);
      if (UIController.elements.apiModal) UIController.elements.apiModal.classList.remove('hidden');
      return;
    }

    const callName = PersonaPrompt.getDynamicCallName(this.state.nameVariations, this.state.userName);
    const systemPrompt = PersonaPrompt.getSystemPrompt(callName);

    // BƯỚC 3: NGƯỜI DÙNG GỬI ẢNH -> THẨM ĐỊNH TỪNG ẢNH MỘT
    if (sentImages.length > 0) {
      if (sentImages.length > 1) {
        UIController.showTypingIndicator(`Hoàng An đang tiếp nhận ${sentImages.length} bức ảnh...`);
        await UIController.delay(600);
        UIController.hideTypingIndicator();
        await UIController.streamLines([
          `Chào ${callName}, mình đã nhận đủ ${sentImages.length} hình ảnh quảng cáo bạn vừa gửi.`,
          `Bây giờ mình sẽ quan sát và bóc tách đánh giá chi tiết cho từng bức ảnh một nhé.`
        ]);
        await UIController.delay(400);
      }

      for (let i = 0; i < sentImages.length; i++) {
        const currentImg = sentImages[i];
        this.state.activeImageData = currentImg;

        const indicatorText = sentImages.length > 1
          ? `Hoàng An đang thẩm định ảnh ${i + 1}/${sentImages.length}: ${currentImg.fileName}...`
          : `Hoàng An đang soi ảnh dựa trên bộ tri thức thiết kế...`;
        UIController.showTypingIndicator(indicatorText);

        const userPromptText = PersonaPrompt.buildVisionUserPrompt(
          callName,
          this.state.userIndustry,
          currentImg,
          i,
          sentImages.length,
          text
        );

        let apiResponse = "";
        try {
          apiResponse = await ApiService.analyzeImage({
            apiKey,
            base64: currentImg.base64,
            mimeType: currentImg.mimeType,
            prompt: userPromptText,
            systemPrompt
          });
        } catch (err) {
          console.error("Lỗi Vision API:", err);
          apiResponse = `Mình gặp sự cố khi thẩm định bức ảnh ${currentImg.fileName} (${err.message}). Bạn vui lòng kiểm tra lại mã API Key hoặc kết nối mạng nhé.`;
        }

        UIController.hideTypingIndicator();

        this.state.conversationHistory.push({ role: 'user', text: userPromptText });
        this.state.conversationHistory.push({ role: 'model', text: apiResponse });

        const lines = apiResponse.split('\n')
          .map(l => UIController.sanitizeStrictRules(l))
          .filter(l => l.length > 0);

        const isLast = (i === sentImages.length - 1);
        const quickActions = isLast ? (
          sentImages.length > 1 ? [
            { text: "So sánh ảnh nào tối ưu nhất?", action: "compare_images" },
            { text: "Tối ưu cho Facebook & Instagram", action: "reply_facebook" },
            { text: "Tối ưu cho TikTok Video dọc", action: "reply_tiktok" }
          ] : [
            { text: "Tối ưu cho Facebook & Instagram", action: "reply_facebook" },
            { text: "Tối ưu cho TikTok & Video dọc", action: "reply_tiktok" },
            { text: "Gợi ý bảng màu & Font chữ mới", action: "reply_palette" }
          ]
        ) : null;

        if (sentImages.length > 1) {
          lines.unshift(`📸 BỨC ẢNH ${i + 1}/${sentImages.length}: ${currentImg.fileName}`);
        }

        await UIController.streamLines(lines, quickActions);

        if (!isLast) {
          await UIController.delay(700);
        }
      }
      return;
    }

    // BƯỚC 4: HỘI THOẠI ĐA LƯỢT (MULTI-TURN CHAT)
    if (text) {
      UIController.showTypingIndicator("Hoàng An đang tra cứu quy chuẩn thiết kế...");

      let apiResponse = "";
      try {
        apiResponse = await ApiService.chatNextTurn({
          apiKey,
          text,
          systemPrompt,
          conversationHistory: this.state.conversationHistory,
          activeImageData: this.state.activeImageData
        });
      } catch (err) {
        console.error("Lỗi Chat API:", err);
        apiResponse = `Đã xảy ra lỗi khi kết nối với AI (${err.message}). Bạn vui lòng thử lại sau giây lát nhé.`;
      }

      UIController.hideTypingIndicator();

      this.state.conversationHistory.push({ role: 'user', text });
      this.state.conversationHistory.push({ role: 'model', text: apiResponse });

      const lines = apiResponse.split('\n')
        .map(l => UIController.sanitizeStrictRules(l))
        .filter(l => l.length > 0);

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
          { text: "Tối ưu cho Facebook", action: "reply_facebook" },
          { text: "Tối ưu cho TikTok", action: "reply_tiktok" }
        ];
      }

      await UIController.streamLines(lines, nextActions);
    }
  }
};

window.AppController = AppController;

// Khởi tạo ứng dụng khi DOM sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
  AppController.init();
});
