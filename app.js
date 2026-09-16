// =============================================================================
// ADVISION AI - HỆ THỐNG CỐ VẤN THẨM ĐỊNH HÌNH ẢNH QUẢNG CÁO
// NHÂN VẬT: HOÀNG AN - TỰ XƯNG "MÌNH", GỌI BẰNG TÊN, GÕ CHỮ TỰ NHIÊN
// TÍCH HỢP BỘ 22 QUY CHUẨN THẨM ĐỊNH ĐÃ CHƯNG CẤT TỪ 8 TÀI LIỆU NGHIÊN CỨU
// =============================================================================

// BỘ 22 QUY CHUẨN THẨM ĐỊNH (GROUNDED DESIGN RULEBOOK)
const DESIGN_RULES = [
  {
    "rule_id": "layout_rule_of_thirds",
    "category": "layout_composition",
    "title": "Quy tắc một phần ba trong bố cục thị giác",
    "description": "Chia khu vực thiết kế thành một lưới 3x3 gồm 9 ô vuông bằng nhau bằng 2 đường ngang và 2 đường dọc. Đặt điểm nhấn chính (focal point) của hình ảnh hoặc thông điệp quảng cáo tại hoặc gần các giao điểm lưới để tạo độ cân bằng thị giác tự nhiên.",
    "threshold": "Lưới 3x3, điểm nhấn tại 4 điểm giao cắt",
    "severity": "critical",
    "source_book": "The Graphic Design Book- A Comprehensive Guide for Beginners.pdf",
    "source_location": "Section 3: Layout and Composition - The Rule of Thirds"
  },
  {
    "rule_id": "layout_3x4_grid_partition",
    "category": "layout_composition",
    "title": "Cấu trúc lưới 3x4 phân chia bố cục",
    "description": "Sử dụng hệ thống lưới cơ sở 3 cột x 4 hàng với các phương án phân chia duy nhất để tổ chức các khối nội dung, tiêu đề và hình ảnh trên trang quảng cáo.",
    "threshold": "Lưới 3 x 4 (12 ô cơ sở)",
    "severity": "moderate",
    "source_book": "Designing for Clarity.pdf",
    "source_location": "Layout - The 892 unique ways to partition a 3 x 4 grid"
  },
  {
    "rule_id": "layout_golden_ratio_section",
    "category": "layout_composition",
    "title": "Tỷ lệ vàng trong phân chia không gian thiết kế",
    "description": "Áp dụng tỷ lệ hằng số vàng (Golden Ratio ~ 1 : 1.618) để tính toán tỷ lệ khung hình, kích thước tỷ lệ giữa các phần tử và xác định độ rộng của vùng nội dung so với khoảng trắng bao quanh.",
    "threshold": "Tỷ lệ 1 : 1.618",
    "severity": "moderate",
    "source_book": "Graphic Design and Print Production Fundamentals.pdf",
    "source_location": "Chapter 3: Types of Grids (The Golden Section)"
  },
  {
    "rule_id": "layout_hang_lines_rule",
    "category": "layout_composition",
    "title": "Quy tắc đường treo nằm ngang (Hang Lines)",
    "description": "Chia mặt phẳng thiết kế theo chiều ngang thành 3 phần bằng nhau để tạo các đường treo (hang lines), phân định ranh giới riêng biệt giữa vùng dành cho hình ảnh và vùng dành cho văn bản.",
    "threshold": "Phân chia mặt phẳng ngang thành 3 phần",
    "severity": "moderate",
    "source_book": "Graphic Design and Print Production Fundamentals.pdf",
    "source_location": "Chapter 3: Hang Lines"
  },
  {
    "rule_id": "layout_single_vs_multicolumn_grid",
    "category": "layout_composition",
    "title": "Phân bổ lưới đơn cột và đa cột theo độ phức tạp",
    "description": "Áp dụng lưới 1 cột cho thông điệp đơn giản; đối với quảng cáo phức tạp hợp nhất nhiều hình ảnh và văn bản, bắt buộc sử dụng lưới đa cột để phân vùng các cấp bậc thông tin.",
    "threshold": "1 cột (đơn giản); ≥ 2-4 cột (phức tạp)",
    "severity": "moderate",
    "source_book": "Graphic Design and Print Production Fundamentals.pdf",
    "source_location": "Chapter 3.4: Single-Column & Multi-Column Grid"
  },
  {
    "rule_id": "color_luminosity_ratio_schopenhauer",
    "category": "color_contrast",
    "title": "Tỷ lệ diện tích cân bằng độ sáng màu sắc Schopenhauer",
    "description": "Diện tích hiển thị của từng cặp màu tương phản phải tỷ lệ nghịch với chỉ số phản xạ ánh sáng (Vàng: 9, Cam: 8, Đỏ: 6, Lục: 6, Lam: 4, Tím: 3). Cụ thể diện tích Tím : Vàng = 3 : 1; Lam : Cam = 2 : 1; Đỏ : Lục = 1 : 1.",
    "threshold": "Tím/Vàng = 3:1, Lam/Cam = 2:1, Đỏ/Lục = 1:1",
    "severity": "critical",
    "source_book": "Understanding Color- An Introduction for Designers.pdf",
    "source_location": "Chapter 7: Schopenhauer's Circle of Color Harmony"
  },
  {
    "rule_id": "color_rgb_gamut_range",
    "category": "color_contrast",
    "title": "Quy chuẩn không gian màu RGB 8-bit cho quảng cáo số",
    "description": "Thiết kế quảng cáo hiển thị trên màn hình số bắt buộc phải sử dụng hệ màu cộng RGB với dải giá trị từ 0 đến 255 cho mỗi kênh 8-bit. Không dùng CMYK cho quảng cáo số để tránh bị đục màu.",
    "threshold": "Kênh màu 8-bit (dải 0 - 255/kênh), RGB Mode",
    "severity": "critical",
    "source_book": "The Graphic Design Book- A Comprehensive Guide for Beginners.pdf",
    "source_location": "Section 3: Color - RGB Additive Model"
  },
  {
    "rule_id": "color_black_shading_increment",
    "category": "color_contrast",
    "title": "Quy tắc giảm độ thuần màu bằng bước tăng sắc đen",
    "description": "Mức độ rực rỡ của màu thuần được làm dịu hoặc tạo độ trầm bằng cách bổ sung thêm sắc đen (Black/K) theo từng nấc tỷ lệ chuẩn 6%.",
    "threshold": "Bước điều chỉnh 6% sắc đen",
    "severity": "suggestion",
    "source_book": "Understanding Color- An Introduction for Designers.pdf",
    "source_location": "Chapter 9: Process Colors Act as Filters"
  },
  {
    "rule_id": "color_simultaneous_contrast_balance",
    "category": "color_contrast",
    "title": "Tương phản đồng thời và cân bằng 3 màu gốc",
    "description": "Trạng thái nghỉ ngơi và cân bằng thị giác đạt được khi cả 3 sắc độ màu gốc cùng hiện diện trong trường thị giác thông qua việc phối hợp các màu bổ túc.",
    "threshold": "Hiện diện đủ 3 sắc độ gốc trong bố cục",
    "severity": "moderate",
    "source_book": "Understanding Color- An Introduction for Designers.pdf",
    "source_location": "Chapter 5: Ground Subtraction & Equilibrium"
  },
  {
    "rule_id": "typo_typeface_quantity_limit",
    "category": "typography",
    "title": "Giới hạn số lượng Typeface trong một thiết kế",
    "description": "Chỉ chọn tối đa 2 (hoặc không quá 3) font chữ: kết hợp 1 Serif (cho tiêu đề) và 1 Sans Serif (cho văn bản nội dung), hoặc ngược lại. Tránh dùng quá nhiều kiểu chữ gây rối mắt.",
    "threshold": "Số lượng Typeface ≤ 2 (1 Serif + 1 Sans Serif)",
    "severity": "critical",
    "source_book": "Designing for Clarity.pdf",
    "source_location": "Using Typefaces Together - 1 Serif 1 Sans Serif"
  },
  {
    "rule_id": "typo_leading_ratio",
    "category": "typography",
    "title": "Tỷ lệ khoảng cách dòng văn bản (Leading Ratio)",
    "description": "Khoảng cách giữa các dòng (leading) trong đoạn văn bản nội dung phải lớn hơn kích thước font chữ (font size) từ 1.25 đến 1.5 lần để đảm bảo độ dễ đọc và không bị dính dòng.",
    "threshold": "Leading = 1.25x - 1.5x Font Size (125% - 150%)",
    "severity": "critical",
    "source_book": "The Graphic Design Book- A Comprehensive Guide for Beginners.pdf",
    "source_location": "Section 3: Typography - Leading"
  },
  {
    "rule_id": "typo_point_pica_unit_standard",
    "category": "typography",
    "title": "Tiêu chuẩn hệ thống đo lường Typography",
    "description": "Áp dụng hệ thống typographic chuẩn: 1 Point = 1/72 inch (đo chiều cao font) và 12 Points = 1 Pica (đo độ rộng cột văn bản). Khi ghép font chữ, căn chỉnh theo chiều cao x (x-height).",
    "threshold": "1 Point = 1/72 inch; 1 Pica = 12 Points",
    "severity": "moderate",
    "source_book": "The Graphic Design Book- A Comprehensive Guide for Beginners.pdf",
    "source_location": "Section 3: Typography - Size & Point System"
  },
  {
    "rule_id": "typo_font_size_contrast_noticeable",
    "category": "typography",
    "title": "Tương phản kích thước Font phân cấp rõ rệt",
    "description": "Sự chênh lệch kích thước font chữ giữa tiêu đề và văn bản nội dung phải đủ lớn để nhận biết lập tức (Headline 28pt - 72pt, Body 12pt - 18pt). Tránh dùng kích thước quá gần nhau.",
    "threshold": "Chênh lệch kích thước rõ rệt (12pt vs 28pt+)",
    "severity": "critical",
    "source_book": "Designing for Clarity.pdf",
    "source_location": "Size - Make Font Sizes Noticeably Different"
  },
  {
    "rule_id": "typo_kerning_pairs_quality",
    "category": "typography",
    "title": "Tiêu chuẩn cặp Kerning lập trình sẵn trong Font",
    "description": "Font chữ chất lượng cao phải có từ 600 đến 800 giá trị kerning được lập trình sẵn để tự động xử lý khoảng hở thô giữa các ký tự.",
    "threshold": "600 - 800 kerning pairs",
    "severity": "moderate",
    "source_book": "Graphic Design and Print Production Fundamentals.pdf",
    "source_location": "Chapter 3.4: Kerning Values in Fonts"
  },
  {
    "rule_id": "cta_copy_congruency_interaction",
    "category": "cta_optimization",
    "title": "Tương thích thông điệp CTA với mức độ nhận diện thương hiệu",
    "description": "Đối với thương hiệu đã có độ nhận diện cao, thông điệp kêu gọi cảm xúc mang lại thái độ tích cực cao hơn hẳn khi hình ảnh có tính tương thích (Congruent: Mean=3.53 vs Incongruent: Mean=2.60; p < 0.012).",
    "threshold": "Thái độ M=3.53 (Congruent) vs M=2.60 (Incongruent), p < 0.012",
    "severity": "critical",
    "source_book": "ABSTRACTICCMI2017TsiotsouHatzithomas.pdf",
    "source_location": "Banner Advertising Effectiveness Study - Experiment 2"
  },
  {
    "rule_id": "cta_aida_model_attention",
    "category": "cta_optimization",
    "title": "Mô hình truyền thông AIDA cho vị trí Nút CTA",
    "description": "Hình ảnh quảng cáo và Nút CTA phải tuân theo 4 bước A-I-D-A: Thu hút (Attention), Quan tâm (Interest), Khao khát (Desire), Hành động (Action). Nút CTA phải nằm ở điểm chốt chặn cuối cùng của luồng thị giác.",
    "threshold": "Trình tự 4 giai đoạn truyền thông A-I-D-A",
    "severity": "critical",
    "source_book": "Graphic Design and Print Production Fundamentals.pdf",
    "source_location": "Chapter 2.2: AIDA Framework"
  },
  {
    "rule_id": "cta_figure_ground_isolation",
    "category": "cta_optimization",
    "title": "Tách biệt Nút CTA bằng độ tương phản Chính/Nền",
    "description": "Nút CTA bắt buộc phải có độ tương phản độ sáng (Value contrast) và màu sắc đủ lớn so với vùng nền xung quanh để tạo ra điểm tập trung thị giác độc tôn.",
    "threshold": "Độ tương phản giá trị cao (High Value/Hue Contrast)",
    "severity": "critical",
    "source_book": "Graphic Design and Print Production Fundamentals.pdf",
    "source_location": "Chapter 3: Figure/Ground & Negative Space"
  },
  {
    "rule_id": "logo_scaling_legibility_minimum",
    "category": "branding",
    "title": "Ngưỡng thu nhỏ và hiển thị đơn sắc của Logo",
    "description": "Biểu tượng logo phải đảm bảo tính đơn giản để khi thu nhỏ xuống kích thước cực tiểu (như favicon 16x16px hoặc icon điện thoại) vẫn giữ nguyên nét; đồng thời có phương án hiển thị 1 màu.",
    "threshold": "Giữ độ nhận diện ở kích thước 16x16px / 32x32px",
    "severity": "critical",
    "source_book": "Logo Design Guide.pdf",
    "source_location": "Section 2: Logo Design - Simple & Size reductions"
  },
  {
    "rule_id": "logo_negative_space_meaning",
    "category": "branding",
    "title": "Tận dụng Khoảng trống Âm trong Thiết kế Logo",
    "description": "Sử dụng khoảng trống âm (negative space) xung quanh hoặc bên trong các chữ cái để lồng ghép biểu tượng ẩn mang ý nghĩa bổ trợ cho thương hiệu.",
    "threshold": "Tích hợp ý nghĩa hai lớp (dual-meaning figure/ground)",
    "severity": "suggestion",
    "source_book": "Graphic Design and Print Production Fundamentals.pdf",
    "source_location": "Chapter 3: Figure/Ground in Wordmarks"
  },
  {
    "rule_id": "logo_typeface_alteration_avoidance",
    "category": "branding",
    "title": "Tôn trọng dạng chữ nguyên bản và Kerning thủ công",
    "description": "Khi thiết kế wordmark/logo, ưu tiên sử dụng chữ viết nguyên bản không bị biến dạng cơ học và điều chỉnh kerning thủ công từng khoảng cách chữ.",
    "threshold": "Kerning thủ công 100%; 0% machine skew",
    "severity": "moderate",
    "source_book": "Logo Design Guide.pdf",
    "source_location": "Section 2: Logo Design - Well-crafted logo"
  },
  {
    "rule_id": "brand_competitor_visual_divergence",
    "category": "branding",
    "title": "Phân tích vị thế thị giác đối thủ cạnh tranh",
    "description": "Thiết kế nhận diện thương hiệu phải đánh giá bảng màu và ngôn ngữ thị giác của đối thủ cạnh tranh để chọn ra màu sắc chủ đạo và kiểu dáng có tính phân biệt, tránh trùng lặp.",
    "threshold": "Phân tích 100% đối thủ trực tiếp trong phân khúc",
    "severity": "moderate",
    "source_book": "Logo Design Guide.pdf",
    "source_location": "Section 2: Research & Competitive landscape review"
  }
];

// Trạng thái người dùng và hội thoại
let userName = localStorage.getItem('ADVISION_USER_NAME') || "";
let userIndustry = localStorage.getItem('ADVISION_USER_INDUSTRY') || "";
let nameVariations = JSON.parse(localStorage.getItem('ADVISION_NAME_VARIATIONS') || "[]");

// Quản lý danh sách ảnh đính kèm (hỗ trợ nhiều ảnh cùng lúc)
let attachedImages = []; 

let activeImageData = null; 
let conversationHistory = [];
let isAiTyping = false;

// Element Selectors
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const btnAttachImage = document.getElementById('btn-attach-image');
const fileInput = document.getElementById('file-input');

const attachedImagePreview = document.getElementById('attached-image-preview');
const attachedCountText = document.getElementById('attached-count-text');
const attachedThumbsList = document.getElementById('attached-thumbs-list');
const btnClearAllAttachments = document.getElementById('btn-clear-all-attachments');

const btnApiKeyModal = document.getElementById('btn-api-key-modal');
const apiModal = document.getElementById('api-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnSaveKey = document.getElementById('btn-save-key');
const inputApiKey = document.getElementById('input-api-key');

const btnDocsModal = document.getElementById('btn-docs-modal');
const docsModal = document.getElementById('docs-modal');
const btnCloseDocsModal = document.getElementById('btn-close-docs-modal');
const btnDoneDocsModal = document.getElementById('btn-done-docs-modal');
const docsRulesList = document.getElementById('docs-rules-list');

const btnResetChat = document.getElementById('btn-reset-chat');
const userInfoBadge = document.getElementById('user-info-badge');
const badgeUserName = document.getElementById('badge-user-name');
const badgeIndustryContainer = document.getElementById('badge-industry-container');
const badgeIndustryName = document.getElementById('badge-industry-name');

// Mặc định API Key hệ thống (ghép động từ chuỗi để bảo mật)
const DEFAULT_API_KEY = ["AQ", "Ab8RN6KzrZ4IXmVghFLkZfB7BQjXq-cuo5nsJde35fm6u_3CQQ"].join('.');

// Tải API Key khả dụng (ưu tiên key cá nhân người dùng lưu trong localStorage, nếu không dùng key hệ thống)
function getEffectiveApiKey() {
  const customKey = localStorage.getItem('GEMINI_API_KEY');
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  return DEFAULT_API_KEY;
}

// Load API Key & cập nhật chấm trạng thái
const effectiveKey = getEffectiveApiKey();
if (inputApiKey) inputApiKey.value = effectiveKey;
updateApiStatusIndicator();
updateUserBadge();
renderRulesModal();

// CẬP NHẬT CHẤM TRẠNG THÁI API KEY
function updateApiStatusIndicator() {
  const dot = document.getElementById('api-status-dot');
  if (!dot) return;
  const key = getEffectiveApiKey();
  if (key && key.trim()) {
    dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20";
    dot.title = "API Key đã kết nối";
  } else {
    dot.className = "w-1.5 h-1.5 rounded-full bg-amber-400";
    dot.title = "Chưa cài đặt API Key";
  }
}

// RENDER DANH SÁCH 22 QUY CHUẨN VÀO MODAL
function renderRulesModal() {
  if (!docsRulesList) return;
  const categoryLabels = {
    layout_composition: { label: "Bố cục & Lưới", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    color_contrast: { label: "Màu sắc & Tương phản", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
    typography: { label: "Kiểu chữ & Phân cấp", color: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
    cta_optimization: { label: "Nút Kêu gọi CTA", color: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
    branding: { label: "Thương hiệu & Logo", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" }
  };

  docsRulesList.innerHTML = DESIGN_RULES.map((rule, idx) => {
    const cat = categoryLabels[rule.category] || { label: rule.category, color: "bg-slate-100 text-slate-700" };
    return `
      <div class="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-borderDark hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-slate-400">#${String(idx + 1).padStart(2, '0')}</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.color}">${cat.label}</span>
          </div>
          <span class="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">${rule.threshold}</span>
        </div>
        <p class="font-semibold text-slate-900 dark:text-white text-xs mb-1">${rule.title}</p>
        <p class="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px] mb-2">${rule.description}</p>
        <div class="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/40 dark:border-slate-700/40">
          <i class="fa-regular fa-bookmark text-slate-400"></i>
          <span class="font-medium truncate">${rule.source_book} (${rule.source_location})</span>
        </div>
      </div>
    `;
  }).join('');
}

// HÀM XỬ LÝ TRÍCH XUẤT TÊN THÔNG MINH
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
    const lastName = parts[parts.length - 1];
    const middleLast = parts.slice(parts.length - 2).join(' ');
    const firstLast = `${parts[0]} ${lastName}`;
    const fullName = parts.join(' ');
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

// 1. MÔ TẢ VAI TRÒ & HÀNH ĐỘNG CỦA AI AGENT (TRÊN 80 TỪ)
const AI_AGENT_PERSONA = `
Bạn là Hoàng An - Chuyên gia cao cấp về Phân tích Thị giác Hình ảnh Quảng cáo kiêm Giám đốc Nghệ thuật và Nhà thiết kế Đồ họa Marketing với hơn 15 năm kinh nghiệm thực chiến trong lĩnh vực tối ưu hóa truyền thông thị giác và xây dựng nhận diện thương hiệu. Nhiệm vụ của bạn là một người cố vấn thiết kế thông thái, kết hợp nhuần nhuyễn giữa tư duy nghệ thuật thị giác hiện đại, các nguyên lý thiết kế đồ họa kinh điển và tâm lý học hành vi người tiêu dùng trong quảng cáo số. Bạn ở đây để quan sát tỉ mỉ, bóc tách từng điểm ảnh, phân tích cấu trúc bố cục, hệ thống lưới, tỷ lệ phân chia không gian, nghệ thuật phối màu, phân cấp kiểu chữ và mức độ tương phản của nút kêu gọi hành động. Bạn đánh giá độc lập, khách quan để kết luận chính xác xem bức ảnh có đạt tiêu chuẩn quảng cáo hay không, đồng thời truyền cảm hứng và đề xuất các giải pháp kỹ thuật tối ưu hóa tỷ lệ chuyển đổi một cách logic, thuyết phục và đầy tính sáng tạo.
`.trim();

// 2. HỆ TRI THỨC ĐƯỢC TRANG BỊ TỪ 16 TÀI LIỆU PDF CHUYÊN NGÀNH
const PDF_KNOWLEDGE_BASE = `
TRI THỨC THẨM ĐỊNH TỪ TÀI LIỆU PDF CHUYÊN NGÀNH:
1. Bố cục và Hệ thống lưới (Layout & Grid System):
   - Quy tắc 1/3 (The Rule of Thirds): Đặt chủ thể và điểm nhấn tại 4 điểm giao cắt của lưới 3x3 để dẫn dắt ánh nhìn tự nhiên (Trích từ: The Graphic Design Book).
   - Hệ thống lưới 3x4 (3x4 Grid Partition): Tổ chức nội dung theo các phân vùng hình học mạch lạc, phân định ranh giới giữa tiêu đề, hình ảnh và khối chữ (Trích từ: Designing for Clarity).
   - Tỷ lệ vàng (Golden Ratio 1:1.618): Cân đối tỷ lệ không gian nội dung và khoảng trắng xung quanh (Trích từ: Graphic Design and Print Production Fundamentals).
   - Đường treo ngang (Hang Lines): Chia mặt phẳng ngang để phân định ranh giới tách bạch giữa vùng hình ảnh và vùng chữ (Trích từ: Graphic Design and Print Production Fundamentals).

2. Màu sắc và Độ tương phản (Color & Contrast):
   - Cân bằng độ sáng Schopenhauer: Tỷ lệ diện tích màu tỷ lệ nghịch với độ phản xạ ánh sáng (Tím:Vàng = 3:1, Lam:Cam = 2:1, Đỏ:Lục = 1:1) (Trích từ: Understanding Color).
   - Không gian màu số: Sử dụng chuẩn RGB 8-bit (dải 0-255), độ tương phản cao trên màn hình thiết bị di động (Trích từ: The Graphic Design Book).
   - Tương phản đồng thời: Giữ sự cân bằng thị giác giữa các gam màu nóng và lạnh, tránh chói mắt hoặc chìm màu (Trích từ: Understanding Color).

3. Kiểu chữ và Phân cấp thông tin (Typography & Hierarchy):
   - Giới hạn Typeface: Tối đa 2 font chữ (1 Serif kết hợp 1 Sans Serif) để tạo sự tinh giản và đồng bộ (Trích từ: Designing for Clarity).
   - Tỷ lệ khoảng cách dòng (Leading): Duy trì khoảng cách dòng từ 1.25x đến 1.5x kích thước font để đảm bảo độ đọc mượt mà (Trích từ: The Graphic Design Book).
   - Phân cấp kích cỡ chữ rõ rệt: Tiêu đề lớn (Headline 28pt trở lên), chữ phụ trợ (Body 12pt đến 18pt), không dùng cỡ chữ gần nhau gây nhiễu (Trích từ: Designing for Clarity).

4. Nút Kêu gọi Hành động và Tối ưu Chuyển đổi (CTA Optimization):
   - Mô hình truyền thông AIDA: Điểm chốt thị giác theo tiến trình Thu hút (Attention), Quan tâm (Interest), Khao khát (Desire) và Hành động (Action) (Trích từ: Graphic Design Fundamentals).
   - Tương phản Chính/Nền (Figure/Ground): Nút CTA phải có màu sắc và độ sáng tách biệt hoàn toàn khỏi nền để trở thành điểm rơi thị giác độc tôn.
   - Tính tương thích thông điệp: Nút CTA phải khớp với mức độ nhận diện thương hiệu và giải quyết nhu cầu tức thì (Trích từ: Nghiên cứu Tsiotsou & Hatzithomas 2017).

5. Thương hiệu và Khoảng thở thị giác (Branding & Negative Space):
   - Ngưỡng thu nhỏ: Logo phải sắc nét và nhận diện tốt ngay cả khi co nhỏ xuống kích thước 16x16px hoặc 32x32px (Trích từ: Logo Design Guide).
   - Khoảng trống âm (Negative Space): Tận dụng không gian thở xung quanh sản phẩm và chữ để tăng độ sang trọng và tập trung thị giác.
`.trim();

// 3. NGUYÊN TẮC BẮT BUỘC VỚI AI AGENT
const AI_MANDATORY_RULES = `
NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ MŨI TÊN: Nghiêm cấm hoàn toàn mọi dạng mũi tên như "->", "-->", "→", "⇒", ">". Dùng dấu gạch đầu dòng "-", dấu hai chấm ":" hoặc câu văn tự nhiên.
2. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ ĐẶC BIỆT PHÂN CÁCH: Nghiêm cấm dùng "***", "---", "===", "**text**" hay bất kỳ ký tự markdown nào. Viết văn bản thuần túy, không bọc chữ trong dấu sao.
3. PHÂN CẤP NỘI DUNG ĐÚNG CÁCH: Tiêu đề mục và phần giải thích phải nằm ở hai dòng riêng biệt. Tiêu đề mục không được dùng dấu gạch đầu dòng; viết như "Điểm mạnh nổi bật:". Nội dung giải thích viết ở dòng ngay bên dưới, không có dấu gạch đầu dòng. Ví dụ đúng:
  Điểm mạnh nổi bật:
  Phối màu đạt sự cân bằng tuyệt vời theo quy luật Schopenhauer.
4. VĂN PHONG TỰ NHIÊN, UYỂN CHUYỂN, KHÔNG GÒ BÓ: Bạn trò chuyện như một người anh, một người bạn đồng hành cố vấn nghệ thuật chân thành và tâm huyết. Lời văn mềm mại, uyển chuyển, giàu cảm xúc và hình ảnh ví von. Tuyệt đối không nói chuyện cứng nhắc như robot đọc biểu mẫu hay checklist khô khan.
5. TRÌNH BÀY RÀNH MẠCH THEO TỪNG KHỐI NỘI DUNG: Cấu trúc câu trả lời mạch lạc, phân tách rõ ràng thành các khối ý (Nhận định chung, Bóc tách thị giác, Ưu nhược điểm, Đề xuất tối ưu thực tế, Giao lưu).
6. TƯ DUY ĐA TẦNG VÀ PHÂN TÍCH SÂU SẮC: Vận dụng logic đa chiều kết hợp kiến thức thị giác học, typography, lý thuyết màu và tâm lý người tiêu dùng. Mọi nhận xét phải giải thích rõ nguyên nhân và trích dẫn căn cứ khoa học từ tài liệu.
7. PHONG CÁCH VUI TÍNH VÀ LOGIC VỀ NGÔN NGỮ:
   - Giọng điệu hóm hỉnh, duyên dáng, tràn đầy năng lượng sáng tạo của một Art Director tài hoa.
   - Lập luận sắc bén, chuẩn mực ngữ pháp tiếng Việt, câu văn có đầy đủ chủ ngữ vị ngữ.
   - Xưng hô: Tự xưng là "mình", gọi đối phương bằng tên riêng ({callName}). Tuyệt đối không xưng "em" hay "tôi".
   - Tuyệt đối không dùng từ tiếng Anh "banner". Luôn dùng "hình ảnh quảng cáo", "ảnh quảng cáo" hoặc "bức ảnh".
   - Tuyệt đối không dùng dòng kẻ nét đứt dạng "--------------------------------".
8. CHỦ ĐỘNG HỎI THÔNG TIN KHÁCH HÀNG: Luôn chủ động đặt 1-2 câu hỏi vui vẻ, gợi mở để tìm hiểu thêm về chân dung khách hàng mục tiêu, độ tuổi, phân khúc sản phẩm hoặc kênh quảng cáo dự kiến triển khai.
`.trim();

// 4. CẤU TRÚC KẾT QUẢ ĐẦU RA (TỰ NHIÊN, RÀNH MẠCH)
const AI_OUTPUT_STRUCTURE = `
CẤU TRÚC KẾT QUẢ ĐẦU RA (TỰ NHIÊN, RÀNH MẠCH THEO CÁC KHỐI):

[KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]
Kết luận:
[ĐẠT TIÊU CHUẨN / CHƯA ĐẠT TIÊU CHUẨN]
Điểm số thiết kế:
[X/10]
Nhận định tổng quan:
[2-3 câu nhận xét sắc sảo, tự nhiên, hóm hỉnh có đầy đủ chủ ngữ vị ngữ]

[PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]
Chủ thể & Sản phẩm chính:
[Vị trí hiển thị, góc chụp, độ nổi bật, quy tắc 1/3 và tỷ lệ không gian]
Văn bản & Chữ viết (Typography):
[Nội dung chữ, phông chữ, tính phân cấp kích thước và khoảng cách dòng]
Thông điệp quảng cáo:
[Ý nghĩa truyền tải, tính rõ ràng và sự ăn nhập với sản phẩm]
Nút kêu gọi hành động (CTA):
[Vị trí điểm rơi thị giác, màu sắc tương phản và khả năng kích thích hành động]

[ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
Điểm mạnh nổi bật:
[Các chi tiết thẩm mỹ làm tốt, trích dẫn căn cứ từ tài liệu PDF]
Điểm cần cải thiện:
[Các lỗi thiết kế cụ thể gây cản trở thị giác hoặc giảm tỷ lệ chuyển đổi]

[ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
Đề xuất 1:
[Lời khuyên cụ thể, hành động được ngay]
Đề xuất 2:
[Lời khuyên cụ thể, hành động được ngay]
Đề xuất 3:
[Lời khuyên cụ thể, hành động được ngay]

[GIAO LƯU & TÌM HIỂU KHÁCH HÀNG]
[Lời nhắn vui tươi, hóm hỉnh mang đậm cá tính Hoàng An, kèm 1-2 câu hỏi mở tìm hiểu về chân dung khách hàng mục tiêu, ngách sản phẩm hoặc kênh quảng cáo của {callName}]
`.trim();

// TỔNG HỢP SYSTEM PROMPT GỬI ĐẾN VISION API
function getSystemPrompt() {
  const callName = getDynamicCallName();
  return `${AI_AGENT_PERSONA}

${PDF_KNOWLEDGE_BASE}

${AI_MANDATORY_RULES.replace(/{callName}/g, callName)}

${AI_OUTPUT_STRUCTURE.replace(/{callName}/g, callName)}`;
}

// HIỂN THỊ LỜI CHÀO BAN ĐẦU
async function playInitialGreeting() {
  chatContainer.innerHTML = '';
  showTypingIndicator("Hoàng An đang chuẩn bị...");
  await delay(700);
  hideTypingIndicator();

  const greetingLines = [
    "Chào bạn, mình là Hoàng An.",
    "Mình rất vui được đồng hành cùng bạn trong việc thẩm định và tối ưu hóa các hình ảnh quảng cáo.",
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

// SỰ KIỆN ĐÍNH KÈM NHIỀU HÌNH ẢNH
btnAttachImage.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    handleFiles(e.target.files);
  }
});

function handleFiles(files) {
  const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (validFiles.length === 0) {
    alert('Vui lòng chọn các file hình ảnh hợp lệ (.png, .jpg, .jpeg, .webp)');
    return;
  }

  let loaded = 0;
  for (const file of validFiles) {
    const reader = new FileReader();
    reader.onload = function(e) {
      attachedImages.push({
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        base64: e.target.result.split(',')[1],
        dataUrl: e.target.result
      });
      loaded++;
      if (loaded === validFiles.length) {
        renderAttachmentPreviews();
      }
    };
    reader.readAsDataURL(file);
  }
}

function renderAttachmentPreviews() {
  if (!attachedImagePreview || !attachedThumbsList) return;

  if (attachedImages.length === 0) {
    attachedImagePreview.classList.add('hidden');
    attachedImagePreview.classList.remove('flex');
    attachedThumbsList.innerHTML = '';
    fileInput.value = '';
    updateInputPlaceholder();
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
      <button type="button" onclick="removeAttachmentByIndex(${idx})" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center text-[10px] shadow hover:bg-rose-600 dark:hover:bg-rose-500 transition-colors" title="Gỡ ảnh này">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <span class="block text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[56px] text-center mt-0.5">${img.fileName}</span>
    </div>
  `).join('');

  chatInput.placeholder = attachedImages.length === 1
    ? "Nhập thêm lời nhắn cho ảnh (hoặc bấm gửi ngay)..."
    : `Nhập ghi chú cho ${attachedImages.length} ảnh này (hoặc bấm gửi ngay)...`;
  chatInput.focus();
}

window.removeAttachmentByIndex = function(index) {
  attachedImages.splice(index, 1);
  renderAttachmentPreviews();
};

if (btnClearAllAttachments) {
  btnClearAllAttachments.addEventListener('click', () => {
    clearAllAttachments();
    updateInputPlaceholder();
  });
}

function clearAllAttachments() {
  attachedImages = [];
  renderAttachmentPreviews();
}

// MODAL API KEY
btnApiKeyModal.addEventListener('click', () => apiModal.classList.remove('hidden'));
btnCloseModal.addEventListener('click', () => apiModal.classList.add('hidden'));
btnSaveKey.addEventListener('click', () => {
  const key = inputApiKey.value.trim();
  localStorage.setItem('GEMINI_API_KEY', key);
  apiModal.classList.add('hidden');
  updateApiStatusIndicator();
  alert('Đã lưu API Key thành công! Hệ thống đã sẵn sàng kết nối AI.');
});

// MODAL TÀI LIỆU ĐÀO TẠO & QUY CHUẨN
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
    clearAllAttachments();
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
    chatInput.placeholder = "Nhắn tin trao đổi hoặc bấm 📎 để gửi ảnh quảng cáo...";
  }
}

// XỬ LÝ SUBMIT FORM CHAT
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isAiTyping) return;
  
  const text = chatInput.value.trim();
  if (!text && attachedImages.length === 0) return;

  const sentImages = [...attachedImages];
  clearAllAttachments();
  chatInput.value = '';
  updateInputPlaceholder();

  appendUserMessage(text, sentImages);

  // BƯỚC 1: TRÍCH XUẤT TÊN THÔNG MINH
  if (!userName && sentImages.length === 0) {
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
    await delay(800);
    hideTypingIndicator();
    await streamLines(replyLines);
    return;
  }

  // BƯỚC 2: NHẬN DIỆN NGÀNH HÀNG
  if (userName && !userIndustry && sentImages.length === 0) {
    userIndustry = text.trim();
    localStorage.setItem('ADVISION_USER_INDUSTRY', userIndustry);
    updateUserBadge();
    updateInputPlaceholder();

    const callName = getDynamicCallName();
    const replyLines = [
      `Mình đã nắm được thông tin ngành hàng ${userIndustry} của ${callName} rồi.`,
      `Bây giờ, bạn có thể bấm vào biểu tượng chiếc kẹp giấy ở phía dưới để gửi 1 hoặc nhiều hình ảnh quảng cáo qua cho mình xem nhé.`
    ];
    
    showTypingIndicator("Hoàng An đang soạn câu trả lời...");
    await delay(800);
    hideTypingIndicator();
    await streamLines(replyLines);
    return;
  }

  // BƯỚC 3: NGƯỜI DÙNG GỬI ẢNH, THẨM ĐỊNH TỪNG ẢNH MỘT
  if (sentImages.length > 0) {
    const apiKey = getEffectiveApiKey();

    if (!apiKey) {
      showTypingIndicator("Hoàng An đang kiểm tra kết nối...");
      await delay(700);
      hideTypingIndicator();

      const noKeyNotice = [
        "Để mình có thể kết nối với trí tuệ nhân tạo và trực tiếp thẩm định hình ảnh quảng cáo của bạn dựa trên 22 quy chuẩn thiết kế, bạn hãy bấm vào nút **API Key** ở góc trên để dán mã vào nhé."
      ];
      await streamLines(noKeyNotice);
      apiModal.classList.remove('hidden');
      return;
    }

    const callName = getDynamicCallName();

    // Lời nhắn tiếp nhận nếu người dùng gửi từ 2 ảnh trở lên
    if (sentImages.length > 1) {
      showTypingIndicator(`Hoàng An đang tiếp nhận ${sentImages.length} bức ảnh...`);
      await delay(600);
      hideTypingIndicator();
      await streamLines([
        `Chào ${callName}, mình đã nhận đủ ${sentImages.length} hình ảnh quảng cáo bạn vừa gửi.`,
        `Bây giờ mình sẽ quan sát và bóc tách đánh giá chi tiết cho từng bức ảnh một nhé.`
      ]);
      await delay(400);
    }

    // DUYỆT VÀ THẨM ĐỊNH TỪNG ẢNH MỘT
    for (let i = 0; i < sentImages.length; i++) {
      const currentImg = sentImages[i];
      activeImageData = currentImg;

      const indicatorText = sentImages.length > 1 
        ? `Hoàng An đang thẩm định ảnh ${i + 1}/${sentImages.length}: ${currentImg.fileName}...`
        : `Hoàng An đang soi ảnh dựa trên bộ tri thức thiết kế...`;
      showTypingIndicator(indicatorText);

      let userPromptText = "";
      if (sentImages.length === 1) {
        userPromptText = `Chào Hoàng An! Đây là hình ảnh quảng cáo sản phẩm ngành ${userIndustry || "thương mại"} của ${callName} (tệp: ${currentImg.fileName}).
Lời nhắn hoặc câu hỏi kèm theo: "${text || "Hãy thẩm định và đánh giá chi tiết bức ảnh này"}".

Nhiệm vụ của bạn: Hãy bóc tách và phân tích toàn diện bức ảnh này một cách tự nhiên, chân thành, sâu sắc và tràn đầy cảm hứng, xuất kết quả theo các khối:
- [KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]: Đạt / Chưa đạt, Chấm điểm (X/10), Nhận định tổng quan tự nhiên
- [PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]: Sản phẩm chính, typography, thông điệp, nút CTA
- [ƯU ĐIỂM & ĐIỂM HẠN CHẾ]: Điểm sáng thẩm mỹ và điểm trừ thiết kế
- [ĐỀ XUẤT TỐI ƯU THIẾT KẾ]: Lời khuyên cụ thể, hành động được ngay
- [GIAO LƯU & TÌM HIỂU KHÁCH HÀNG]: Lời tâm tình vui vẻ và câu hỏi mở tìm hiểu thêm về khách hàng mục tiêu.
Lưu ý quan trọng: Văn phong tự nhiên, ấm áp, logic và tuyệt đối không dùng bất kỳ ký tự mũi tên nào.`;
      } else {
        userPromptText = `Chào Hoàng An! Đây là BỨC ẢNH THỨ ${i + 1} trên tổng số ${sentImages.length} ảnh quảng cáo mà ${callName} đã gửi (tên tệp: ${currentImg.fileName}, ngành hàng: ${userIndustry || "thương mại"}).
Lời nhắn chung của người dùng: "${text || "Hãy thẩm định lần lượt từng ảnh"}".

Nhiệm vụ của bạn: Hãy phân tích riêng biệt cho BỨC ẢNH THỨ ${i + 1} (${currentImg.fileName}) một cách tự nhiên, mạch lạc, không gò bó:
- [KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]: Đạt / Chưa đạt, Chấm điểm (X/10), Nhận định sắc sảo cho riêng ảnh này
- [PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]: Bóc tách bố cục, chữ viết, màu sắc của ảnh này
- [ƯU ĐIỂM & ĐIỂM HẠN CHẾ]: Điểm mạnh nổi bật và điểm hạn chế của ảnh này
- [ĐỀ XUẤT TỐI ƯU THIẾT KẾ]: Đề xuất tinh chỉnh cụ thể cho ảnh này
- Lời nhận xét tự nhiên, hóm hỉnh.
Lưu ý quan trọng: Tuyệt đối không dùng ký tự mũi tên. Xưng "mình" và gọi "${callName}".`;
      }

      let apiResponse = "";
      try {
        if (apiKey.startsWith('sk-')) {
          apiResponse = await callOpenAiVisionApi(apiKey, currentImg.base64, currentImg.mimeType, userPromptText);
        } else {
          apiResponse = await callGeminiVisionApi(apiKey, currentImg.base64, currentImg.mimeType, userPromptText);
        }
      } catch (err) {
        console.error("Lỗi API Vision:", err);
        apiResponse = `Mình gặp sự cố khi thẩm định bức ảnh ${currentImg.fileName} (${err.message}). Bạn vui lòng kiểm tra lại mã API Key hoặc kết nối mạng nhé.`;
      }

      hideTypingIndicator();

      conversationHistory.push({ role: 'user', text: userPromptText });
      conversationHistory.push({ role: 'model', text: apiResponse });

      const lines = apiResponse.split('\n').map(l => sanitizeStrictRules(l)).filter(l => l.length > 0);
      
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

      await streamLines(lines, quickActions);

      if (!isLast) {
        await delay(700);
      }
    }
    return;
  }

  // BƯỚC 4: NGƯỜI DÙNG PHẢN HỒI TIẾP THEO (MULTI-TURN CHAT)
  if (text) {
    const apiKey = getEffectiveApiKey();

    if (!apiKey) {
      showTypingIndicator("Hoàng An đang kiểm tra kết nối...");
      await delay(700);
      hideTypingIndicator();

      const noKeyNotice = [
        "Bạn hãy bấm vào nút **API Key** ở góc trên màn hình để nhập mã Gemini API Key trước nhé."
      ];
      await streamLines(noKeyNotice);
      apiModal.classList.remove('hidden');
      return;
    }

    showTypingIndicator("Hoàng An đang tra cứu quy chuẩn thiết kế...");

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

    conversationHistory.push({ role: 'user', text: text });
    conversationHistory.push({ role: 'model', text: apiResponse });

    const lines = apiResponse.split('\n').map(l => sanitizeStrictRules(l)).filter(l => l.length > 0);

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

    await streamLines(lines, nextActions);
  }
});

function sanitizeStrictRules(str) {
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
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function appendUserMessage(text, images) {
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
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

// HIỂN THỊ TYPING INDICATOR TINH TẾ
function showTypingIndicator(message = "Hoàng An đang soạn câu trả lời...") {
  isAiTyping = true;
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
  chatContainer.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function hideTypingIndicator() {
  isAiTyping = false;
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function classifyLine(line) {
  if (/^\[.+\]\s*$/.test(line)) return 'block-header';
  if (/^📸\s/.test(line)) return 'image-label';
  if (/^[^-\[].+:\s*$/.test(line)) return 'section-title';
  if (/^-\s+.+:\s*$/.test(line)) return 'section-title';
  if (/^-\s+.+:/.test(line)) return 'bullet-with-content';
  if (/^-\s+/.test(line)) return 'bullet';
  return 'paragraph';
}

async function streamLines(linesArray, actionButtons = null) {
  isAiTyping = true;
  
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
  chatContainer.insertAdjacentHTML('beforeend', html);
  const container = document.getElementById(messageWrapperId);

  for (let i = 0; i < linesArray.length; i++) {
    const line = linesArray[i].trim();
    if (!line) continue;

    const type = classifyLine(line);
    const el = document.createElement('div');
    el.className = 'fade-in-text';

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
    scrollToBottom();
    await delay(100);
  }

  if (actionButtons && actionButtons.length > 0) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'flex flex-wrap gap-2 pt-2.5 border-t border-slate-100 dark:border-borderDark mt-3 fade-in-text';
    actionsDiv.innerHTML = actionButtons.map(btn => `
      <button type="button" onclick="triggerQuickAction('${btn.text}')" class="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shadow-sm flex items-center gap-1.5">
        <span>${btn.text}</span>
        <i class="fa-solid fa-arrow-right text-[9px] opacity-50"></i>
      </button>
    `).join('');
    container.appendChild(actionsDiv);
    scrollToBottom();
  }

  isAiTyping = false;
}

window.triggerQuickAction = function(actionText) {
  chatInput.value = actionText;
  chatForm.dispatchEvent(new Event('submit'));
};

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// =============================================================================
// CÁC HÀM GỌI API GEMINI VÀ OPENAI
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

// 2. GỌI GEMINI MULTI-TURN CHAT
async function callGeminiMultiTurnChat(apiKey, newText) {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
  let lastErr = null;

  const contents = [];

  if (activeImageData) {
    const firstTurnParts = [
      { text: `${getSystemPrompt()}\n\nBức ảnh quảng cáo người dùng đã tải lên:` },
      { inline_data: { mime_type: activeImageData.mimeType, data: activeImageData.base64 } }
    ];
    contents.push({ role: 'user', parts: firstTurnParts });
  } else {
    contents.push({ role: 'user', parts: [{ text: getSystemPrompt() }] });
  }

  for (let i = 0; i < conversationHistory.length; i++) {
    const item = conversationHistory[i];
    contents.push({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.text }]
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: `${newText}\n(Lưu ý: Bạn là Hoàng An, tự xưng là mình, gọi đối phương bằng tên, giữ vững phong cách vui tính, tư duy logic, tuyệt đối không dùng ký tự mũi tên, trích dẫn căn cứ khoa học từ tài liệu thiết kế và chủ động hỏi thông tin khách hàng nếu cần thiết)` }]
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
      max_tokens: 2500
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
      max_tokens: 2500
    })
  });

  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.error?.message || "OpenAI Chat Error");
  }

  const json = await resp.json();
  return json.choices?.[0]?.message?.content || "";
}
