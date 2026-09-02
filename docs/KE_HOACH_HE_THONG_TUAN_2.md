# 📑 BÁO CÁO THIẾT KẾ KỸ THUẬT & KẾ HOẠCH HỆ THỐNG TUẦN 2
## DỰ ÁN: HỆ THỐNG CỐ VẤN THẨM ĐỊNH & ĐÁNH GIÁ QUẢNG CÁO AI AGENT (ENTERPRISE EDITION)

> **Báo cáo Kỹ thuật Chuyên nghiệp:** Tài liệu trình bày kiến trúc tổng thể, mô hình đào tạo AI Agent, kịch bản tương tác và giải pháp hạ tầng điện toán đám mây $0 Budget cho Hệ thống Thẩm định Quảng cáo AI.

---

### 🏛️ 1. MÔ HÌNH HỆ THỐNG & ĐỊNH HƯỚNG SẢN PHẨM

Hệ thống được phát triển theo mô hình **AI Agent Cố vấn Tương tác (ChatGPT Style Interactive Platform)**. Ngay khi người dùng truy cập, hệ thống vận hành theo luồng xử lý:

```text
 ┌─────────────────────────────────────────────────────────────────────────┐
 │ GIAO DIỆN CHATBOT ENTERPRISE (SINGLE PAGE APPLICATION)                  │
 ├─────────────────────────────────────────────────────────────────────────┤
 │ 1. Khởi tạo & Chào hỏi ➔ Tự động xin Quý danh & Lĩnh vực sản phẩm       │
 │ 2. Lưu trữ Hồ sơ ➔ Xưng hô trân trọng & Cá nhân hóa hội thoại           │
 │ 3. Tiếp nhận Banner ➔ Mã hóa Base64 Data Stream siêu tốc                │
 │ 4. Thực thi AI Engine ➔ Thẩm định đa chiều qua Vision API Multimodal    │
 │ 5. Xuất kết quả ➔ Phân bóc 5 Khối tiêu chuẩn (Tuyệt đối KHÔNG dùng ->)  │
 └─────────────────────────────────────────────────────────────────────────┘
```

---

### 🧠 2. QUY CHUẨN ĐÀO TẠO & QUẢN TRỊ AI AGENT (GOVERNANCE SPEC)

#### 2.1 Định Hình Vai Trò (Persona Specification - 110+ Từ)
* **Tên đại diện:** **AdVision Master**
* **Chức danh:** Cố vấn Trưởng Thẩm định Thị giác Đồ họa & Giám đốc Nghệ thuật Thiết kế Marketing.
* **Mô tả vai trò:** Với hơn 15 năm kinh nghiệm quản trị chiến dịch thị giác, AdVision Master đóng vai trò người cố vấn cấp cao, bóc tách từng điểm ảnh, cấu trúc chữ, phân cấp font, luồng mắt đọc và tỷ lệ tương phản màu sắc của banner quảng cáo.

#### 2.2 Bộ Rào Chắn Kỷ Luật (Safety & Governance Guardrails)
1. 🚫 **Rào chắn Cấm Mũi Tên (`->`, `-->`, `⇒`):** Thuật toán tự động quét và loại bỏ 100% các ký tự mũi tên trong câu trả lời của AI.
2. 📦 **Định dạng 5 Khối Văn bản:** Bắt buộc phân chia bài thẩm định thành 5 khối độc lập (`[KHỐI 1]` đến `[KHỐI 5]`).
3. 🗣️ **Tác phong & Văn phong:** Trưởng thành, trang trọng, lịch sự, tri thức, sắc bén và giàu tính tư duy chuyển đổi.

---

### 🌐 3. THIẾT KẾ HẠ TẦNG CLOUD & TIẾN ĐỘ DEPLOY ($0 BUDGET)

* **Repository Quản lý Mã nguồn:** `github.com/ieroxkuon/ai-ad-image-analyzer-web`
* **Hạ tầng Serverless Cloud:** Vercel Hosting Engine
* **Đường dẫn Domain Chính thức:** **`https://ai-ad-image-analyzer-web.vercel.app`**
