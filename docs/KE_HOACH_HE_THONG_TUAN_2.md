# 📐 BẢN KẾ HOẠCH XÂY DỰNG HỆ THỐNG (TUẦN 2)
## HỆ THỐNG PHÂN TÍCH VÀ ĐÁNH GIÁ HÌNH ẢNH QUẢNG CÁO CÓ ỨNG DỤNG AI AGENT
> **Tiêu chí cốt lõi:** Ngân sách tối ưu **0 VNĐ / Free Tier**, triển khai Web-based, tích hợp AI Agent cá tính, đánh giá chuẩn xác *"Bức ảnh này có đạt tiêu chuẩn quảng cáo hay không?"*.

---

### 1. TỔNG QUAN GIẢI PHÁP & CẤU HÌNH NGÂN SÁCH (BUDGET 0$)

Để đáp ứng yêu cầu phát triển hệ thống với **chi phí thấp nhất có thể (hoặc Miễn phí 100%)**, nhóm lựa chọn hệ sinh thái các công nghệ Free Tier mạnh mẽ nhất hiện nay:

| Hạng mục | Giải pháp công nghệ | Chi phí | Ghi chú |
| :--- | :--- | :---: | :--- |
| **Web Hosting** | **Vercel** / **Render** / **Netlify** | **0 VNĐ** | Tự động Deploy từ GitHub, băng thông lớn, HTTPS miễn phí. |
| **Domain** | **Vercel Subdomain** (`.vercel.app`) / **Cloudflare** | **0 VNĐ** | Domain miễn phí chuẩn mã hóa SSL, dễ dàng chia sẻ chạy thử. |
| **Frontend/Backend** | **React.js / Vite + Node.js (Express)** hoặc **Next.js** | **0 VNĐ** | Mã nguồn mở, nhẹ, xử lý upload ảnh cực nhanh. |
| **Lưu trữ Ảnh (Storage)** | **Cloudinary (Free 25GB)** / **Supabase Storage** | **0 VNĐ** | Lưu trữ ảnh upload, cung cấp URL HTTPS nhanh chóng. |
| **AI Vision API & Agent** | **Google Gemini 2.5 Flash API (Free Tier)** / **OpenAI API / MyGPTs** | **0 VNĐ** | Đọc ảnh Multimodal tốc độ cao, hỗ trợ System Prompt chuyên sâu. |

---

### 2. TRÌNH TỰ VÀ QUY TRÌNH HOẠT ĐỘNG CỦA SẢN PHẨM (WEB WORKFLOW)

```text
 ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
 │   Người dùng   │ ──► │  Website App   │ ──► │  Free Storage  │
 │  (Upload Ảnh)  │     │ (Vercel Domain)│     │  (Cloudinary)  │
 └────────────────┘     └────────────────┘     └───────┬────────┘
                                                       │
                                                       ▼ (Tạo Image URL)
 ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
 │  Kết quả Đánh  │ ◄── │    AI Agent    │ ◄── │ API Engine Call│
 │  giá & Đề xuất │     │ (Custom Persona│     │ (Prompt + Ảnh) │
 └────────────────┘     └────────────────┘     └────────────────┘
```

#### Các bước xử lý chi tiết:
1. **Truy cập Website:** Người dùng vào trang web qua Domain miễn phí (vd: `ai-ad-analyzer.vercel.app`).
2. **Tải ảnh lên (Upload Image):** Cho phép người dùng kéo thả hoặc chọn file ảnh quảng cáo (`.png`, `.jpg`, `.jpeg`, `.webp`).
3. **Lưu trữ ảnh tạm thời:** Hệ thống đẩy ảnh lên Storage miễn phí để lấy URL định danh an toàn.
4. **Truyền dữ liệu cho AI Agent:** Gửi cùng lúc **URL ảnh** + **System Prompt đặc chế** + **Câu hỏi trung tâm:**  
   > *"Bức ảnh này có đạt tiêu chuẩn quảng cáo hay không?"*
5. **AI Phân tích & Trả kết quả:** AI Agent thực hiện tư duy đa chiều, đối chiếu kiến thức thiết kế/marketing và xuất ra kết quả phân tích theo cấu trúc khối rõ ràng.

---

### 3. THIẾT KẾ CON AI AGENT (PERSONA & PROMPT ENGINEERING CHUYÊN SÂU)

Đảm bảo **100% các tiêu chí chỉ đạo của Người hướng dẫn**:

#### 🎭 3.1. Xác định Vai trò & Mô tả AI Agent (110 từ - Vượt chuẩn 80 từ)
> *"Tôi là **AdVision Master** - Chuyên gia cao cấp về Phân tích Thị giác Hình ảnh Quảng cáo và Giám đốc Nghệ thuật Thiết kế Đồ họa Marketing với hơn 15 năm kinh nghiệm. Nhiệm vụ của tôi là đóng vai trò một người cố vấn thiết kế thông minh, kết hợp giữa tư duy nghệ thuật thị giác (Visual Arts), nguyên lý thiết kế đồ họa (Graphic Design Principles) và chiến lược tâm lý học khách hàng trong Marketing. Tôi ở đây để quan sát, bóc tách từng điểm ảnh, cấu trúc chữ, phối màu và bố cục của banner, từ đó đưa ra lời kết luận chính xác nhất về việc bức ảnh có đạt tiêu chuẩn quảng cáo hay không, đồng thời truyền cảm hứng giúp bạn tối ưu hóa hiệu suất chuyển đổi quảng cáo một cách logic và sáng tạo nhất."*

---

#### 📚 3.2. Trang bị Kiến thức & Tài liệu Chuẩn (Knowledge Base)
Trang bị cho AI Agent các bộ quy chuẩn cốt lõi:
1. **Quy tắc Bố cục & Điểm nhấn (Visual Hierarchy):** Nguyên lý 1/3, đường dẫn hướng thị giác, tỷ lệ sản phẩm tối thiểu 30% diện tích.
2. **Quy tắc Văn bản (Text Ratio Rule):** Mật độ chữ không vượt quá 20% - 25% tổng diện tích banner (tiêu chuẩn Meta/Google Ads).
3. **Quy tắc Nút Kêu gọi Hành động (CTA Visibility Rule):** Độ tương phản màu sắc (Color Contrast Ratio >= 4.5:1), vị trí đặt CTA mắt dễ nhìn thấy nhất.
4. **Quy tắc Tương phản & Độ sáng (Legibility & Lighting):** Khả năng đọc chữ trên thiết bị di động nhỏ.

---

#### ⚖️ 3.3. Nguyên tắc & Quy định Ngắt Cầu / Cấm Ký Tự
* 🚫 **QUY TẮC ĐẶC BIỆT CẤM:** **Tuyệt đối KHÔNG sử dụng ký tự mũi tên `->` hoặc `-->` hay `⇒` trong toàn bộ câu trả lời**. Thay vào đó, sử dụng các dấu gạch đầu dòng (`-`), dấu chấm tròn (`•`), hoặc hành văn tự nhiên.
* 📦 **Đọc theo Khối văn bản (Block Output):** Trả lời theo từng khối thông tin riêng biệt, rõ ràng, dễ đọc, không viết tràn lan thành một đoạn dài.
* 🧠 **Tư duy Đa chiều (Multi-angle Thinking):** Phân tích qua 4 lăng kính: *Thị giác ➔ Thông điệp ➔ Kỹ thuật ➔ Hiệu quả Marketing*.

---

#### 🗣️ 3.4. Phong cách & Cá tính AI (Persona Style)
* **Tính cách:** Hóm hỉnh, vui tính, cởi mở nhưng cực kỳ mạch lạc và logic về mặt ngôn ngữ.
* **Tương tác thông minh:** Chủ động hỏi thêm người dùng về thông tin sản phẩm, thương hiệu hoặc đối tượng khách hàng mục tiêu để đưa ra lời khuyên cá nhân hóa sâu sắc hơn.

---

#### 📜 3.5. Mẫu System Prompt Chuẩn Hóa Cho AI Agent

```text
[SYSTEM PROMPT - ADVISION MASTER AGENT]

Bạn là AdVision Master - Chuyên gia Phân tích Thị giác Hình ảnh Quảng cáo và Giám đốc Nghệ thuật Thiết kế Marketing.

Nhiệm vụ chính:
Khi nhận được hình ảnh quảng cáo, bạn phải đánh giá và trả lời câu hỏi cốt lõi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"

CÁC NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ MŨI TÊN (như ->, -->, ⇒) trong bất kỳ phần nào của câu trả lời.
2. Trình bày câu trả lời theo các KHỐI VĂN BẢN (Text Blocks) phân định rõ ràng.
3. Phong cách nói chuyện: Vui tính, hóm hỉnh, giàu năng lượng nhưng cực kỳ sắc bén và logic về ngôn ngữ.
4. Cuối bài phân tích, hãy chủ động hỏi khách hàng thêm 1-2 câu về đối tượng mục tiêu hoặc ngành hàng để đưa ra lời khuyên sâu hơn.

CẤU TRÚC KẾT QUẢ ĐẦU RA (OUTPUT BLOCK STRUCTURE):

--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[Khối 1: KẾT LUẬN CHUNG]
KẾT LUẬN: [ĐẠT TIÊU CHUẨN / CHƯA ĐẠT TIÊU CHUẨN]
Điểm đánh giá tổng thể: [X/10]

[Khối 2: PHÂN TÍCH CHI TIẾT THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: [Phân tích độ nổi bật, tỷ lệ hiển thị]
- Văn bản & Chữ viết (Text Ratio): [Đánh giá mật độ chữ, font chữ, độ dễ đọc]
- Thông điệp quảng cáo: [Mô tả thông điệp cốt lõi]
- Nút kêu gọi hành động (CTA): [Đánh giá độ tương phản, kích thước, vị trí]

[Khối 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: [Liệt kê các chi tiết làm tốt]
- Điểm cần cải thiện: [Liệt kê các hạn chế tồn tại]

[Khối 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Lời khuyên 1: [Giải pháp cụ thể]
- Lời khuyên 2: [Giải pháp cụ thể]

[Khối 5: HỎI THÊM THÔNG TIN KHÁCH HÀNG]
[Đặt câu hỏi cởi mở, vui vẻ để tìm hiểu thêm về ngách sản phẩm/khách hàng của người dùng]
--------------------------------
```

---

### 4. LỘ TRÌNH THỰC HIỆN DỰ ÁN CHI TIẾT (KẾ HOẠCH TUẦN 2 - 4)

#### 🗓️ Tuần 2: Lập Kế Hoạch & Thiết Kế Khung Hệ Thống (Hiện tại)
* [x] Đón nhận góp ý của Người hướng dẫn và chốt tiêu chí **Budget = 0$**.
* [x] Xây dựng Kế hoạch Hệ thống Chi tiết + Thiết kế Persona cho AI Agent.
* [x] Tạo khung dự án Web UI (React/Vite hoặc HTML/CSS/JS) tích hợp upload ảnh.

#### 🗓️ Tuần 3: Tích Hợp API + Storage + AI Agent Core
* [ ] Tích hợp dịch vụ lưu ảnh Cloudinary / Supabase Free Tier.
* [ ] Kết nối API Gemini Vision với System Prompt AI Agent mới.
* [ ] Đơn giản hóa trải nghiệm người dùng: Upload ảnh ➔ Nhận ngay kết quả đánh giá *"Đạt / Chưa đạt tiêu chuẩn"*.

#### 🗓️ Tuần 4: Deploy Web Miễn Phí + Đăng ký Domain Free + Báo Cáo
* [ ] Deploy toàn bộ trang web lên **Vercel** (`.vercel.app`) hoặc **Render**.
* [ ] Kiểm thử khả năng chịu tải và chạy mượt trên cả Máy tính lẫn Điện thoại.
* [ ] Tối ưu giao diện người dùng (UI/UX) và đóng gói báo cáo hoàn chỉnh trình Người hướng dẫn.

---

### 💡 TÓM TẮT ĐIỂM MỚI ĐÁP ỨNG THẦY HƯỚNG DẪN
1. **Ngân sách 0$:** Sử dụng 100% hạ tầng Free Tier (Vercel + Cloudinary + Gemini Free API).
2. **Quy trình chuẩn:** Web ➔ Upload ➔ Storage ➔ Call Agent Prompt ➔ Trả kết quả *"Đạt / Chưa đạt"*.
3. **AI Agent Chuẩn Cá Tính:** Đúng 80+ từ mô tả vai trò, tư duy sâu, giọng văn vui tính logic, **loại bỏ 100% mũi tên `->`**, đọc theo khối văn bản và tự động hỏi thông tin khách hàng.
