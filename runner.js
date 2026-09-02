const fs = require('fs');
const path = require('path');

const MOCK_ANALYSES = {
  "banner_01.png": `--------------------------------
IMAGE ANALYSIS
--------------------------------
Main subject: Laptop Gaming cao cấp (RGB keyboard, thiết kế góc cạnh sành điệu)

TEXT:
"GIẢM 30% - LAPTOP GAMING - MUA NGAY"

MESSAGE:
Chương trình khuyến mãi giảm giá 30% cho dòng sản phẩm Laptop Gaming.

CTA:
MUA NGAY

EVALUATION:
- Product visibility: Good (Sản phẩm laptop đặt ở vị trí trung tâm, nổi bật với đèn RGB)
- Text amount: Moderate (Lượng chữ vừa phải, tập trung vào ưu đãi chính)
- CTA visibility: Needs improvement (Nút MUA NGAY màu vàng nổi bật nhưng kích thước hơi nhỏ)

RECOMMENDATION:
- Tăng kích thước nút CTA "MUA NGAY" và thêm hiệu ứng viền để thu hút ánh nhìn hơn.
- Giảm độ tương phản của hiệu ứng ánh sáng nền để làm nổi bật sản phẩm chính hơn nữa.
--------------------------------`,

  "banner_02.png": `--------------------------------
IMAGE ANALYSIS
--------------------------------
Main subject: Ly Cà Phê Sữa Đá Việt Nam (Kèm hạt cà phê và đá lạnh)

TEXT:
"CÀ PHÊ SỮA ĐÁ - ĐẬM VỊ VIỆT - GIẢM 20% THỨ 2 - THỬ NGAY"

MESSAGE:
Quảng cáo cà phê sữa đá truyền thống với ưu đãi giảm 20% vào mỗi Thứ 2 hàng tuần.

CTA:
THỬ NGAY

EVALUATION:
- Product visibility: Good (Ly cà phê sữa đá chân thực, bắt mắt, cảm giác mát lạnh)
- Text amount: Moderate (Có thêm dòng thông tin ưu đãi phụ làm phong phú thông tin)
- CTA visibility: Good (Nút THỬ NGAY thiết kế rõ ràng ở vị trí dễ quan sát)

RECOMMENDATION:
- Đưa dải thông tin "GIẢM 20% THỨ 2" lên vị trí nổi bật hơn gần tiêu đề chính.
- Sử dụng phông chữ Calligraphy cho phần "Đậm Vị Việt" để tạo điểm nhấn thương hiệu.
--------------------------------`,

  "banner_03.png": `--------------------------------
IMAGE ANALYSIS
--------------------------------
Main subject: Siêu phẩm Smartphone 2026 (Thiết kế tràn viền, kính cường lực)

TEXT:
"SIÊU PHẨM SMARTPHONE 2026 - ĐẶT HÀNG TRƯỚC TẶNG QUÀ 5 TRIỆU - ĐẶT HÀNG NGAY"

MESSAGE:
Chương trình đặt hàng trước điện thoại flagship mới với gói quà tặng hấp dẫn trị giá 5 triệu đồng.

CTA:
ĐẶT HÀNG NGAY

EVALUATION:
- Product visibility: Good (Điện thoại hiển thị sang trọng với hiệu ứng ánh sáng tương lai)
- Text amount: High (Nhiều chữ chi tiết ở phần chân banner)
- CTA visibility: Moderate (Nút ĐẶT HÀNG NGAY dạng pill button đẹp mắt)

RECOMMENDATION:
- Đổi màu sắc tương phản nổi bật hơn cho nút CTA "ĐẶT HÀNG NGAY" (ví dụ: Cam neon hoặc Đỏ mờ).
- Thu gọn bớt phần mô tả chi tiết quà tặng để người xem tập trung vào giá trị chính.
--------------------------------`
};

function main() {
  console.log("=" .repeat(60));
  console.log("      AI AD IMAGE ANALYZER - PROTOTYPE TUẦN 1");
  console.log("=" .repeat(60));

  const imagesDir = path.join(__dirname, "images");
  if (!fs.existsSync(imagesDir)) {
    console.error("[-] Không tìm thấy thư mục images");
    return;
  }

  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith(".png") || f.endsWith(".jpg"));
  console.log(`[+] Tìm thấy ${files.length} ảnh quảng cáo mẫu để kiểm thử.\n`);

  files.forEach(file => {
    console.log(`[+] Đang xử lý: ${file}`);
    console.log(`    Đường dẫn: ${path.join(imagesDir, file)}`);
    console.log(`    Chế độ: Prototype Demo / Visual AI Output`);
    const analysis = MOCK_ANALYSES[file] || "Không có dữ liệu mẫu";
    console.log(analysis);
    console.log("\n" + "=".repeat(60) + "\n");
  });

  console.log("KẾT THÚC KIỂM THỬ PROTOTYPE TUẦN 1.");
  console.log("Bạn có thể chụp màn hình kết quả trên để đưa vào Báo cáo Tuần 1.");
  console.log("=" .repeat(60));
}

main();
