# 🛡️ AdVision Enterprise AI Platform

> **Hệ Thống Cố Vấn Thẩm Định & Đánh Giá Tiêu Chuẩn Hình Ảnh Quảng Cáo Ứng Dụng AI Agent Multimodal**

---

### 📌 GIỚI THIỆU DỰ ÁN
**AdVision Enterprise AI Platform** là nền tảng Web-based cao cấp hỗ trợ doanh nghiệp và nhà thiết kế thẩm định tiêu chuẩn hình ảnh banner quảng cáo bằng Trí tuệ Nhân tạo Đa phương thức (Multimodal Vision AI). Hệ thống được thiết kế theo giao diện **AI Agent Cố vấn Tương tác (ChatGPT Style)**, có khả năng giao tiếp trang trọng, xưng hô tôn trọng theo tên riêng của người dùng và bóc tách bố cục thị giác chuyên sâu.

---

### 🌐 HẠ TẦNG & TÊN MIỀN (DEPLOYMENT & DOMAIN)
* **Domain Chính thức (HTTPS Free Tier):** [https://ai-ad-image-analyzer-web.vercel.app](https://ai-ad-image-analyzer-web.vercel.app)
* **Mã nguồn GitHub:** [github.com/ieroxkuon/ai-ad-image-analyzer-web](https://github.com/ieroxkuon/ai-ad-image-analyzer-web)
* **Công nghệ:** HTML5, Tailwind CSS, Vanilla JavaScript Engine, Express Node.js Serverless.

---

### 🏛️ MÔ HÌNH QUẢN TRỊ AI AGENT (ADVISION MASTER)
1. **Vai trò:** Cố vấn Trưởng Thẩm định Thị giác & Giám đốc Nghệ thuật Thiết kế Quảng cáo (>110 từ).
2. **Quy tắc kỷ luật bắt buộc:** 
   - 🚫 Tuyệt đối **KHÔNG dùng ký tự mũi tên (`->`)** trong bài đánh giá.
   - 📦 Trả kết quả bóc tách theo **5 Khối văn bản chuyên biệt** (`[KHỐI 1]` đến `[KHỐI 5]`).
   - 💬 Tương tác xưng hô trân trọng và hỏi câu hỏi chiến lược mở ở cuối mỗi bài phân tích.

---

### 📁 CẤU TRÚC DỰ ÁN
```text
ai_ad_image_analyzer/
├── index.html              # Giao diện Web App Enterprise Dark Mode (SPA)
├── app.js                  # Frontend Application & Vision API Engine
├── server.js               # Express Node.js Server
├── vercel.json             # Cấu hình Serverless Deployment Vercel
├── README.md               # Tài liệu tổng quan dự án
├── docs/                   # Tài liệu kế hoạch & thiết kế kỹ thuật
│   └── KE_HOACH_HE_THONG_TUAN_2.md
├── scripts/                # Python Core AI Engine
│   └── AI_Ad_Image_Analyzer.py
└── images/                 # Hình ảnh mẫu nghiệm thu
```
