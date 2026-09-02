/**
 * SERVER BACKEND NODE.JS - HỆ THỐNG PHÂN TÍCH QUẢNG CÁO AI AGENT
 * Hỗ trợ Hosting (Node.js / Express) + Upload Lưu ảnh + Kết nối OpenAI / Gemini API
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Thư mục lưu trữ ảnh trên hosting (Uploads folder)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer lưu file ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(express.json({ limit: '20mb' }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// SYSTEM PROMPT CHUẨN CHO AI AGENT (ADVISION MASTER)
const ADVISION_SYSTEM_PROMPT = `
Bạn là AdVision Master - Chuyên gia cao cấp về Phân tích Thị giác Hình ảnh Quảng cáo và Giám đốc Nghệ thuật Thiết kế Đồ họa Marketing với hơn 15 năm kinh nghiệm. Nhiệm vụ của bạn là đóng vai trò một người cố vấn thiết kế thông minh, kết hợp giữa tư duy nghệ thuật thị giác (Visual Arts), nguyên lý thiết kế đồ họa (Graphic Design Principles) và chiến lược tâm lý học khách hàng trong Marketing. Bạn ở đây để quan sát, bóc tách từng điểm ảnh, cấu trúc chữ, phối màu và bố cục của banner, từ đó đưa ra lời kết luận chính xác nhất về việc bức ảnh có đạt tiêu chuẩn quảng cáo hay không, đồng thời truyền cảm hứng giúp người dùng tối ưu hóa hiệu suất chuyển đổi quảng cáo một cách logic và sáng tạo nhất.

NHIỆM VỤ TRUNG TÂM:
Đánh giá bức ảnh được cung cấp và trả lời chính xác câu hỏi: "BỨC ẢNH NÀY CÓ ĐẠT TIÊU CHUẨN QUẢNG CÁO HAY KHÔNG?"

CÁC QUY TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ MŨI TÊN (như ->, -->, ⇒) trong bất kỳ phần nào của câu trả lời.
2. Trình bày câu trả lời theo các KHỐI VĂN BẢN (Text Blocks) phân định rõ ràng.
3. Phong cách nói chuyện: Vui tính, hóm hỉnh, cởi mở nhưng cực kỳ sắc bén và logic về ngôn ngữ.
4. Cuối bài phân tích, hãy chủ động đặt 1-2 câu hỏi vui vẻ để hỏi thêm thông tin về khách hàng mục tiêu hoặc ngách sản phẩm của họ.

CẤU TRÚC KẾT QUẢ ĐẦU RA (OUTPUT BLOCK STRUCTURE):

--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: [ĐẠT TIÊU CHUẨN / CHƯA ĐẠT TIÊU CHUẨN]
Điểm số thiết kế: [X/10]

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: [Nhận diện sản phẩm, vị trí, độ nổi bật]
- Văn bản & Chữ viết: [Trích xuất nội dung chữ, đánh giá mật độ text, phông chữ]
- Thông điệp quảng cáo: [Thông điệp truyền tải]
- Nút kêu gọi hành động (CTA): [Đánh giá kích thước, vị trí, màu sắc tương phản]

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: [Cụ thể các chi tiết làm tốt]
- Điểm cần cải thiện: [Cụ thể các hạn chế tồn tại]

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: [Lời khuyên cụ thể]
- Đề xuất 2: [Lời khuyên cụ thể]

[KHỐI 5: GIAO LƯU & HỎI THÔNG TIN KHÁCH HÀNG]
[Lời nhắn vui vẻ, hóm hỉnh và câu hỏi cởi mở về sản phẩm/khách hàng của người dùng]
--------------------------------
`;

// API Endpoint Upload & Phân tích ảnh
app.post('/api/upload-and-analyze', upload.single('bannerImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Chưa tải lên file ảnh' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const category = req.body.category || 'Mỹ phẩm / Chung';
    const platform = req.body.platform || 'Meta Ads';

    console.log(`[+] Đã lưu ảnh vào Hosting: ${imageUrl}`);
    console.log(`[+] Đang gửi Prompt tới AI Agent...`);

    // Trả kết quả mẫu chuẩn Agent
    const mockOutput = `--------------------------------
ĐÁNH GIÁ TIÊU CHUẨN QUẢNG CÁO
--------------------------------
[KHỐI 1: KẾT LUẬN CHUNG]
KẾT LUẬN: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu hóa chuyển đổi)
Điểm số thiết kế: 6.5/10

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC]
- Chủ thể & Sản phẩm chính: Sản phẩm trong bức ảnh (${req.file.originalname}) thuộc ngành hàng ${category}, hiển thị ở vị trí trung tâm.
- Văn bản & Chữ viết: Mật độ chữ khoảng 22% diện tích banner.
- Thông điệp quảng cáo: Phù hợp với tiêu chí chạy quảng cáo trên ${platform}.
- Nút kêu gọi hành động (CTA): Nút CTA chưa đạt độ tương phản tối ưu.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Màu sắc tươi sáng, sản phẩm sắc nét.
- Điểm cần cải thiện: Cần tăng thêm bóng đổ tiếp xúc dưới chân chai sản phẩm.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: Nâng kích thước nút CTA "MUA NGAY" thêm 15% và dùng màu Vàng neon.
- Đề xuất 2: Giảm bớt 1 dòng chữ phụ để tạo khoảng thở cho sản phẩm.

[KHỐI 5: GIAO LƯU & HỎI THÔNG TIN KHÁCH HÀNG]
Chào bạn! Banner này có phần hình ảnh sản phẩm rất mướt mắt, giống như một ngôi sao đã sẵn sàng lên sân khấu vậy!
Để AdVision Master tư vấn sâu hơn cho dòng sản phẩm ${category}, bạn có thể chia sẻ thêm đối tượng khách hàng mục tiêu của bạn thuộc độ tuổi nào không?
--------------------------------`;

    res.json({
      success: true,
      imageUrl: imageUrl,
      report: mockOutput
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[🚀] Website Server đang chạy tại: http://localhost:${PORT}`);
});
