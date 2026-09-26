/**
 * =============================================================================
 * ADVISION AI - BỘ ĐIỀU KHIỂN GIAO DIỆN & TƯƠNG TÁC (UI CONTROLLER)
 * =============================================================================
 * Quản lý toàn bộ hiển thị DOM, hiệu ứng gõ phím kiểu streaming, xem trước ảnh,
 * và các cửa sổ Modal (Quy chuẩn thiết kế, Cài đặt API Key).
 */

const UIController = {
  // Ánh xạ các phần tử giao diện
  elements: {
    chatContainer: document.getElementById('chat-container'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    btnAttachImage: document.getElementById('btn-attach-image'),
    fileInput: document.getElementById('file-input'),

    attachedImagePreview: document.getElementById('attached-image-preview'),
    attachedCountText: document.getElementById('attached-count-text'),
    attachedThumbsList: document.getElementById('attached-thumbs-list'),
    btnClearAllAttachments: document.getElementById('btn-clear-all-attachments'),

    btnApiKeyModal: document.getElementById('btn-api-key-modal'),
    apiModal: document.getElementById('api-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnSaveKey: document.getElementById('btn-save-key'),
    inputApiKey: document.getElementById('input-api-key'),
    apiStatusDot: document.getElementById('api-status-dot'),

    btnDocsModal: document.getElementById('btn-docs-modal'),
    docsModal: document.getElementById('docs-modal'),
    btnCloseDocsModal: document.getElementById('btn-close-docs-modal'),
    btnDoneDocsModal: document.getElementById('btn-done-docs-modal'),
    docsRulesList: document.getElementById('docs-rules-list'),

    btnResetChat: document.getElementById('btn-reset-chat'),
    userInfoBadge: document.getElementById('user-info-badge'),
    badgeUserName: document.getElementById('badge-user-name'),
    badgeIndustryContainer: document.getElementById('badge-industry-container'),
    badgeIndustryName: document.getElementById('badge-industry-name'),
  },

  // Trạng thái hiển thị AI đang phản hồi
  isAiTyping: false,

  // Tiện ích tạm dừng bất đồng bộ
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Cuộn khung chat xuống đáy mượt mà
  scrollToBottom() {
    if (this.elements.chatContainer) {
      this.elements.chatContainer.scrollTop = this.elements.chatContainer.scrollHeight;
    }
  },

  // Cập nhật chấm trạng thái kết nối API
  updateApiStatusIndicator(hasKey) {
    const dot = this.elements.apiStatusDot;
    if (!dot) return;
    if (hasKey) {
      dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20";
      dot.title = "API Key đã kết nối";
    } else {
      dot.className = "w-1.5 h-1.5 rounded-full bg-amber-400";
      dot.title = "Chưa cài đặt API Key";
    }
  },

  // Cập nhật huy hiệu thông tin người dùng ở thanh công cụ
  updateUserBadge(userName, userIndustry) {
    const { userInfoBadge, badgeUserName, badgeIndustryContainer, badgeIndustryName } = this.elements;
    if (!userInfoBadge) return;

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
  },

  // Cập nhật gợi ý placeholder trong ô nhập liệu
  updateInputPlaceholder(userName, userIndustry, callName, attachedCount = 0) {
    const input = this.elements.chatInput;
    if (!input) return;

    if (attachedCount > 0) {
      input.placeholder = attachedCount === 1
        ? "Nhập thêm lời nhắn cho ảnh (hoặc bấm gửi ngay)..."
        : `Nhập ghi chú cho ${attachedCount} ảnh này (hoặc bấm gửi ngay)...`;
      return;
    }

    if (!userName) {
      input.placeholder = "Nhập tên của bạn (ví dụ: Trần Thái Cương, Linh)...";
    } else if (!userIndustry) {
      input.placeholder = `Sản phẩm ${callName} đang làm thuộc ngành nào (thời trang, mỹ phẩm...)?`;
    } else {
      input.placeholder = "Nhắn tin trao đổi hoặc bấm 📎 để gửi ảnh quảng cáo...";
    }
  },

  // Hiển thị danh sách thumbnail ảnh đã chọn
  renderAttachmentPreviews(attachedImages) {
    const { attachedImagePreview, attachedCountText, attachedThumbsList, fileInput } = this.elements;
    if (!attachedImagePreview || !attachedThumbsList) return;

    if (attachedImages.length === 0) {
      attachedImagePreview.classList.add('hidden');
      attachedImagePreview.classList.remove('flex');
      attachedThumbsList.innerHTML = '';
      if (fileInput) fileInput.value = '';
      return;
    }

    attachedImagePreview.classList.remove('hidden');
    attachedImagePreview.classList.add('flex');
    if (attachedCountText) {
      attachedCountText.textContent = `Ảnh đã chọn (${attachedImages.length})`;
    }

    attachedThumbsList.innerHTML = attachedImages.map((img, idx) => `
      <div class="relative group shrink-0">
        <img src="${img.dataUrl}" alt="${img.fileName}" class="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" title="${img.fileName}">
        <button type="button" onclick="window.AppController.removeAttachmentByIndex(${idx})" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center text-[10px] shadow hover:bg-rose-600 dark:hover:bg-rose-500 transition-colors" title="Gỡ ảnh này">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <span class="block text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[56px] text-center mt-0.5">${img.fileName}</span>
      </div>
    `).join('');
  },

  // Thêm tin nhắn của người dùng vào hộp thoại
  appendUserMessage(text, images) {
    let imgHtml = '';
    if (images && images.length > 0) {
      imgHtml = `<div class="flex flex-wrap gap-2 mb-2.5">${images.map(img =>
        `<img src="${img.dataUrl}" alt="${img.fileName}" class="max-h-48 rounded-xl border border-slate-200 dark:border-borderDark object-cover shadow-sm" title="${img.fileName}">`
      ).join('')}</div>`;
    }
    const textHtml = text ? `<p class="leading-relaxed">${text}</p>` : '';

    const html = `
      <div class="flex gap-3 justify-end items-start group">
        <div class="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 px-4 py-3 rounded-2xl rounded-tr-sm text-[15px] font-normal max-w-lg leading-relaxed shadow-sm">
          ${imgHtml}
          ${textHtml}
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 border border-slate-300 dark:border-slate-700">
          <i class="fa-regular fa-user"></i>
        </div>
      </div>
    `;
    this.elements.chatContainer.insertAdjacentHTML('beforeend', html);
    this.scrollToBottom();
  },

  // Hiển thị chỉ báo Hoàng An đang suy nghĩ / soạn tin
  showTypingIndicator(message = "Hoàng An đang soạn câu trả lời...") {
    this.isAiTyping = true;
    const html = `
      <div id="typing-indicator" class="flex gap-3 items-center">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
          HA
        </div>
        <div class="inline-flex items-center gap-2.5 bg-white dark:bg-cardDark border border-slate-200/80 dark:border-borderDark px-4 py-2.5 rounded-2xl rounded-tl-sm text-xs text-slate-500 dark:text-slate-400 shadow-sm">
          <div class="flex items-center gap-1">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
          <span>${message}</span>
        </div>
      </div>
    `;
    this.elements.chatContainer.insertAdjacentHTML('beforeend', html);
    this.scrollToBottom();
  },

  // Ẩn chỉ báo soạn tin
  hideTypingIndicator() {
    this.isAiTyping = false;
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  },

  // Phân loại dòng văn bản để định dạng trực quan
  classifyLine(line) {
    if (/^\[GỢI Ý PROMPT.*?\]\s*$/i.test(line)) return 'redesign-prompt-header';
    if (/^\[.+\]\s*$/.test(line)) return 'block-header';
    if (/^📸\s/.test(line)) return 'image-label';
    if (/^[^-\[].+:\s*$/.test(line)) return 'section-title';
    if (/^-\s+.+:\s*$/.test(line)) return 'section-title';
    if (/^-\s+.+:/.test(line)) return 'bullet-with-content';
    if (/^-\s+/.test(line)) return 'bullet';
    return 'paragraph';
  },

  // Tiện ích sao chép văn bản vào Clipboard mượt mà
  async copyToClipboard(button, text) {
    try {
      await navigator.clipboard.writeText(text);
      const originalHtml = button.innerHTML;
      button.innerHTML = `<i class="fa-solid fa-check text-emerald-400"></i> <span class="text-emerald-400">Đã sao chép!</span>`;
      button.classList.add('bg-emerald-950/40', 'border-emerald-700/60');
      setTimeout(() => {
        button.innerHTML = originalHtml;
        button.classList.remove('bg-emerald-950/40', 'border-emerald-700/60');
      }, 2200);
    } catch (err) {
      console.error("Không thể copy:", err);
      alert("Đã sao chép: " + text.substring(0, 50) + "...");
    }
  },

  // Hiệu ứng hiển thị chữ từng dòng mượt mà (Streaming Lines)
  async streamLines(linesArray, actionButtons = null) {
    this.isAiTyping = true;
    const messageWrapperId = 'agent-msg-' + Date.now();
    const html = `
      <div class="flex gap-3.5 items-start">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
          HA
        </div>
        <div class="space-y-3 text-[15px] leading-relaxed flex-1 prose-refined">
          <div id="${messageWrapperId}" class="bg-white dark:bg-cardDark border border-slate-200/80 dark:border-borderDark p-4 sm:p-5 rounded-2xl rounded-tl-sm shadow-sm space-y-2.5 text-slate-800 dark:text-slate-200">
          </div>
        </div>
      </div>
    `;
    this.elements.chatContainer.insertAdjacentHTML('beforeend', html);
    const container = document.getElementById(messageWrapperId);

    let isInsidePromptBlock = false;

    for (let i = 0; i < linesArray.length; i++) {
      const line = linesArray[i].trim();
      if (!line) continue;

      const type = this.classifyLine(line);
      const el = document.createElement('div');
      el.className = 'fade-in-text';

      if (type === 'redesign-prompt-header') {
        isInsidePromptBlock = true;
        el.className = 'mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-700 shadow-md space-y-2.5';
        el.innerHTML = `
          <div class="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </span>
              <span class="text-xs font-bold tracking-wide text-slate-200">Prompt Tái Thiết Kế (DALL-E 3 / Midjourney / ChatGPT)</span>
            </div>
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Gen AI Ready</span>
          </div>
        `;
        container.appendChild(el);
        this.scrollToBottom();
        await this.delay(90);
        continue;
      }

      if (isInsidePromptBlock) {
        // Kiểm tra nếu chuyển sang block mới khác
        if (type === 'block-header') {
          isInsidePromptBlock = false;
        } else {
          // Render nội dung prompt kèm nút copy
          const promptBox = document.createElement('div');
          promptBox.className = 'p-3 bg-black/40 rounded-xl border border-slate-700/60 font-mono text-xs text-emerald-300 leading-relaxed space-y-2 select-all break-words';
          
          const cleanPromptText = line.replace(/^(Prompt.*?:\s*)/i, '').replace(/^[\\"\']+|[\\"\']+$/g, '');
          promptBox.textContent = cleanPromptText;

          const copyBtn = document.createElement('button');
          copyBtn.type = 'button';
          copyBtn.className = 'mt-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/80 transition-all flex items-center gap-1.5 shadow-sm';
          copyBtn.innerHTML = `<i class="fa-regular fa-copy text-xs"></i> <span>Sao chép Prompt cho ChatGPT</span>`;
          copyBtn.addEventListener('click', () => this.copyToClipboard(copyBtn, cleanPromptText));

          const wrapper = container.lastElementChild;
          if (wrapper && wrapper.classList.contains('bg-gradient-to-br')) {
            wrapper.appendChild(promptBox);
            wrapper.appendChild(copyBtn);
          } else {
            container.appendChild(promptBox);
            container.appendChild(copyBtn);
          }

          this.scrollToBottom();
          await this.delay(90);
          continue;
        }
      }

      if (type === 'block-header') {
        el.className += ' text-[13px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 pt-3 pb-1 border-b border-slate-200/60 dark:border-slate-700/40 mb-1';
        el.textContent = line.replace(/^\[|\]$/g, '');
      } else if (type === 'image-label') {
        el.className += ' text-sm font-bold text-indigo-600 dark:text-indigo-400 pt-2 pb-1';
        el.textContent = line;
      } else if (type === 'section-title') {
        el.className += ' font-semibold text-slate-900 dark:text-white text-[15px] pt-1';
        el.textContent = line.replace(/^-\s+/, '');
      } else if (type === 'bullet-with-content') {
        const colonIdx = line.indexOf(':');
        const label = line.substring(0, colonIdx + 1).replace(/^-\s+/, '');
        const content = line.substring(colonIdx + 1).trim();
        el.className += ' text-[15px] leading-relaxed pt-1';
        const labelEl = document.createElement('div');
        labelEl.className = 'font-semibold text-slate-900 dark:text-white';
        labelEl.textContent = label;
        const contentEl = document.createElement('div');
        contentEl.className = 'font-normal text-slate-700 dark:text-slate-300';
        contentEl.textContent = content;
        el.append(labelEl, contentEl);
      } else if (type === 'bullet') {
        el.className += ' font-normal text-slate-700 dark:text-slate-300 leading-relaxed pl-4 text-[14px]';
        el.textContent = line.replace(/^-\s+/, '• ');
      } else {
        el.className += ' font-normal text-slate-800 dark:text-slate-200 leading-relaxed';
        el.textContent = line;
      }

      container.appendChild(el);
      this.scrollToBottom();
      await this.delay(90);
    }

    if (actionButtons && actionButtons.length > 0) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'flex flex-wrap gap-2 pt-2.5 border-t border-slate-100 dark:border-borderDark mt-3 fade-in-text';
      actionsDiv.innerHTML = actionButtons.map(btn => `
        <button type="button" onclick="window.AppController.triggerQuickAction('${btn.text}')" class="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shadow-sm flex items-center gap-1.5">
          <span>${btn.text}</span>
          <i class="fa-solid fa-arrow-right text-[9px] opacity-50"></i>
        </button>
      `).join('');
      container.appendChild(actionsDiv);
      this.scrollToBottom();
    }

    this.isAiTyping = false;
  },

  // Làm sạch văn bản AI trả về theo đúng chuẩn không ký tự markdown thô
  sanitizeStrictRules(str) {
    if (!str) return "";
    return str
      .replace(/^\*{3,}$/gm, '')
      .replace(/\*{3,}/g, '')
      .replace(/^-{3,}$/gm, '')
      .replace(/^={3,}$/gm, '')
      .replace(/-{5,}/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/banner\b/gi, 'hình ảnh quảng cáo')
      .replace(/banners\b/gi, 'các hình ảnh quảng cáo')
      .replace(/\bEm chào\b/gi, 'Chào')
      .replace(/\bem\b/gi, 'mình')
      .replace(/->|-->|=>|==>|⇒|→|⇄|⇆|⇾|➔|➜|⇢|⇨/g, ' : ')
      .replace(/^>\s*/gm, '')
      .replace(/>/g, '')
      .trim();
  },

  // Khởi tạo các sự kiện Modal
  initModals() {
    const {
      btnDocsModal, docsModal, btnCloseDocsModal, btnDoneDocsModal, docsRulesList,
      btnApiKeyModal, apiModal, btnCloseModal
    } = this.elements;

    if (docsRulesList && window.RulesService) {
      docsRulesList.innerHTML = window.RulesService.renderToHtml();
    }

    if (btnDocsModal) btnDocsModal.addEventListener('click', () => docsModal.classList.remove('hidden'));
    if (btnCloseDocsModal) btnCloseDocsModal.addEventListener('click', () => docsModal.classList.add('hidden'));
    if (btnDoneDocsModal) btnDoneDocsModal.addEventListener('click', () => docsModal.classList.add('hidden'));

    if (btnApiKeyModal) btnApiKeyModal.addEventListener('click', () => apiModal.classList.remove('hidden'));
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => apiModal.classList.add('hidden'));
  }
};

window.UIController = UIController;
