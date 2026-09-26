# 🛡️ AdVision Enterprise AI Platform

> **Hệ Thống Cố Vấn Thẩm Định & Đánh Giá Tiêu Chuẩn Hình Ảnh Quảng Cáo Ứng Dụng AI Agent Multimodal**
> **Sinh viên thực hiện:** Trần Thái Cương — MSSV: 2255010026

---

### 📌 GIỚI THIỆU DỰ ÁN
**AdVision Enterprise AI Platform** là nền tảng Web-based cao cấp hỗ trợ doanh nghiệp và nhà thiết kế thẩm định tiêu chuẩn hình ảnh banner quảng cáo bằng Trí tuệ Nhân tạo Đa phương thức (Multimodal Vision AI). Hệ thống được thiết kế theo giao diện **AI Agent Cố vấn Tương tác (ChatGPT / Studio Style)** với Persona **Nguyễn Hoàng An**, có khả năng giao tiếp trang trọng, xưng hô tôn trọng theo tên riêng của người dùng và bóc tách bố cục thị giác chuyên sâu dựa trên 22 quy chuẩn thiết kế chưng cất từ 16 tài liệu nghiên cứu chuyên ngành.

---

### 🌐 HẠ TẦNG & TÊN MIỀN (DEPLOYMENT & DOMAIN)
* **Domain Chính thức (HTTPS Free Tier):** [https://ai-ad-image-analyzer-web.vercel.app](https://ai-ad-image-analyzer-web.vercel.app)
* **Mã nguồn GitHub:** [github.com/ieroxkuon/ai-ad-image-analyzer-web](https://github.com/ieroxkuon/ai-ad-image-analyzer-web)
* **Công nghệ:** HTML5, Tailwind CSS, Vanilla JavaScript Modular Architecture, Express Node.js Serverless.

---

### 🏛️ MÔ HÌNH QUẢN TRỊ AI AGENT (ADVISION MASTER)
1. **Vai trò:** Cố vấn Trưởng Thẩm định Thị giác & Giám đốc Nghệ thuật Thiết kế Quảng cáo (>110 từ).
2. **Quy tắc kỷ luật bắt buộc:** 
   - 🚫 Tuyệt đối **KHÔNG dùng ký tự mũi tên (`->`)** trong bài đánh giá.
   - 📦 Trả kết quả bóc tách theo **5 Khối văn bản chuyên biệt** (`[KHỐI 1]` đến `[KHỐI 5]`).
   - 💬 Tương tác xưng hô trân trọng và hỏi câu hỏi chiến lược mở ở cuối mỗi bài phân tích.

---

### 📁 KIẾN TRÚC MÃ NGUỒN & CẤU TRÚC THƯ MỤC CHUẨN (MODULAR ARCHITECTURE)
Hệ thống được tổ chức theo kiến trúc phân tách trách nhiệm (Separation of Concerns), dễ nghiên cứu và mở rộng theo từng tuần:

```text
ai_ad_image_analyzer/
│
├── index.html                     # Giao diện Web App SPA (HTML5 Semantic)
├── server.js                      # Express API Server (Node.js backend)
├── vercel.json                    # Cấu hình Serverless Deployment Vercel
├── package.json                   # Cấu hình dự án & thư viện Node.js
├── requirements.txt               # Thư viện Python cho mô hình AI
├── README.md                      # Tài liệu tổng quan dự án
│
├── data/                          # [TẦNG DỮ LIỆU CỐT LÕI - Single Source of Truth]
│   └── design_rules.json          # 22 quy chuẩn thẩm định thị giác chưng cất từ 16 PDF
│
├── js/                            # [TẦNG LOGIC FRONTEND - Mô-đun hóa độc lập]
│   ├── config.js                  # Hằng số, API Key mặc định, cấu hình mô hình AI
│   ├── rulesService.js            # Quản lý nạp và tra cứu 22 quy chuẩn thiết kế
│   ├── personaPrompt.js           # Persona Hoàng An, System Prompts, xử lý tên & ngành hàng
│   ├── apiService.js              # Xử lý kết nối Vision AI (Gemini, OpenAI, Fallback)
│   ├── uiController.js            # Quản lý DOM, Modal, Preview nhiều ảnh, Streaming text
│   └── app.js                     # [BỘ ĐIỀU PHỐI CHÍNH - Controller] ~250 dòng sạch sẽ
│
├── scripts/                       # [TẦNG KHOA HỌC & NGHIÊN CỨU AI]
│   └── AI_Ad_Image_Analyzer.py    # Script phân tích hình ảnh độc lập bằng Python
│
├── docs/                          # [TÀI LIỆU KỸ THUẬT & THIẾT KẾ HỆ THỐNG]
│   ├── KE_HOACH_HE_THONG_TUAN_2.md
│   └── KE_HOACH_TRAIN_AI_AGENT.md
│
├── trainingdocs/                  # 16 tài liệu PDF nghiên cứu chuyên ngành đồ họa & quảng cáo
└── images/                        # Hình ảnh mẫu nghiệm thu thực nghiệm
```

---

### 🚀 LỘ TRÌNH PHÁT TRIỂN CÁC MÔ-ĐUN TƯƠNG LAI
Nhờ cấu trúc mô-đun hóa, việc bổ sung tính năng theo các tuần tiếp theo sẽ diễn ra độc lập:
1. **Tuần 3 - Trích xuất Bounding Box:** Thêm `js/visionInspector.js` để đánh dấu vùng vi phạm quy chuẩn lên ảnh.
2. **Tuần 4 - Động cơ Chấm điểm Định lượng:** Thêm `js/scoringEngine.js` tính điểm 5 trụ cột và vẽ biểu đồ Radar.
3. **Tuần 5 - Báo cáo & Thử nghiệm A/B:** Thêm `js/reportExporter.js` xuất file PDF báo cáo kiểm định.
4. **Tuần 6 - Lưu trữ Lịch sử Đồ án:** Thêm `js/historyStorage.js` đồng bộ dữ liệu vào SQLite.
