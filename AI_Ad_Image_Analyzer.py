"""
=============================================================================
HỆ THỐNG PHÂN TÍCH VÀ ĐÁNH GIÁ HÌNH ẢNH QUẢNG CÁO BẰNG AI (AI AD IMAGE ANALYZER)
PROTOTYPE TUẦN 1: Phân tích sơ bộ hình ảnh quảng cáo bằng Vision AI / Multimodal AI
=============================================================================
Mục đích:
- Kiểm tra khả năng ứng dụng AI trong việc đọc, hiểu nội dung hình ảnh quảng cáo,
  trích xuất chữ (text), nhận biết sản phẩm, thông điệp, nút kêu gọi hành động (CTA),
  và đưa ra nhận xét, đề xuất tối ưu hóa sơ bộ.
=============================================================================
"""

import os
import sys
import json
import warnings
from pathlib import Path
from PIL import Image

# Fix UTF-8 encoding on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ẩn các cảnh báo deprecation không cần thiết để output sạch sẽ
warnings.filterwarnings("ignore")

# Thử import google.generativeai nếu có
HAS_GEMINI = False
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

# Prompt hệ thống đặc chế cho AI Agent (AdVision Master) theo chỉ đạo của Người hướng dẫn
SYSTEM_PROMPT = """
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
"""

# Dữ liệu mô phỏng (Mock Data) chuẩn bị sẵn cho 3 banner khi ở chế độ Demo/Offline
MOCK_ANALYSES = {
    "banner_01.png": """--------------------------------
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
- CTA visibility: Needs improvement (Nút MUA NGAY màu vàng nổi bật nhưng kích thước hơi nhỏ so với tổng thể banner)

RECOMMENDATION:
- Tăng kích thước nút CTA "MUA NGAY" và thêm hiệu ứng viền để thu hút ánh nhìn hơn.
- Giảm độ tương phản của hiệu ứng ánh sáng nền để làm nổi bật sản phẩm chính hơn nữa.
--------------------------------""",

    "banner_02.png": """--------------------------------
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
--------------------------------""",

    "banner_03.png": """--------------------------------
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
- CTA visibility: Moderate (Nút ĐẶT HÀNG NGAY dạng pill button đẹp mắt nhưng màu sắc tiệp với phông nền)

RECOMMENDATION:
- Đổi màu sắc tương phản nổi bật hơn cho nút CTA "ĐẶT HÀNG NGAY" (ví dụ: Cam neon hoặc Đỏ mờ).
- Thu gọn bớt phần mô tả chi tiết quà tặng để người xem tập trung vào giá trị chính "QUÀ 5 TRIỆU".
--------------------------------"""
}

# Tự động đọc file .env nếu có
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip("'\"")

def analyze_banner_with_gemini(image_path: str, api_key: str) -> str:
    """Gửi ảnh quảng cáo tới Google Gemini Vision API để phân tích."""
    genai.configure(api_key=api_key)
    
    # Danh sách các tên mô hình hỗ trợ vision thực tế
    models_to_try = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest']
    img = Image.open(image_path)
    
    last_error = None
    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content([SYSTEM_PROMPT, img])
            if response and response.text:
                return response.text
        except Exception as e:
            last_error = e
            continue
            
    raise last_error or Exception("Không thể gọi Gemini API")

def analyze_banner(image_path: str) -> str:
    """Phân tích ảnh quảng cáo (Tự động dùng Gemini API nếu có Key, hoặc chạy Demo Mock)."""
    file_name = os.path.basename(image_path)
    
    # Kiểm tra biến môi trường
    api_key = (
        os.environ.get("GEMINI_API_KEY") 
        or os.environ.get("GOOGLE_API_KEY") 
        or os.environ.get("API_KEY")
    )
    
    # Nạp lại từ .env nếu chưa tìm thấy key
    if not api_key:
        env_file = Path(__file__).parent / ".env"
        if env_file.exists():
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        val = v.strip().strip("'\"")
                        if val:
                            os.environ[k.strip()] = val
            api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    print(f"\n[+] Đang xử lý: {file_name}")
    print(f"    Đường dẫn: {image_path}")
    
    if api_key and HAS_GEMINI:
        try:
            print("    Chế độ: AI Vision API (Google Gemini Real Call)...")
            result = analyze_banner_with_gemini(image_path, api_key)
            return result
        except Exception as e:
            print(f"    [!] Lỗi khi gọi API thực tế: {e}")
            print("    [!] Tự động chuyển sang chế độ Demo kết quả.")
    elif not api_key:
        print("    [i] Chưa phát hiện GEMINI_API_KEY trong môi trường hoặc file .env.")
    
    # Chế độ Demo / Mock
    print("    Chế độ: Demo / Mock Analysis (Dữ liệu mẫu)...")
    if file_name in MOCK_ANALYSES:
        return MOCK_ANALYSES[file_name]
    else:
        # Generic mock cho file ảnh bất kỳ
        return f"""--------------------------------
IMAGE ANALYSIS
--------------------------------
Main subject: Quảng cáo sản phẩm ({file_name})

TEXT:
"KHUYẾN MÃI ĐẶC BIỆT - MUA NGAY"

MESSAGE:
Quảng cáo sản phẩm thương mại.

CTA:
MUA NGAY

EVALUATION:
- Product visibility: Good
- Text amount: Moderate
- CTA visibility: Needs improvement

RECOMMENDATION:
- Nâng cao kích thước nút CTA.
- Tối ưu tương phản màu sắc chữ.
--------------------------------"""

def main():
    print("=" * 60)
    print("      AI AD IMAGE ANALYZER - PROTOTYPE TUẦN 1")
    print("=" * 60)
    
    # Xác định thư mục chứa ảnh quảng cáo mẫu
    base_dir = Path(__file__).parent
    images_dir = base_dir / "images"
    
    if not images_dir.exists():
        print(f"[-] Không tìm thấy thư mục ảnh: {images_dir}")
        return
        
    # Danh sách các ảnh mẫu
    banner_files = sorted(list(images_dir.glob("*.png")) + list(images_dir.glob("*.jpg")))
    
    if not banner_files:
        print(f"[-] Không có file ảnh .png hay .jpg nào trong thư mục: {images_dir}")
        return
        
    print(f"Tìm thấy {len(banner_files)} ảnh quảng cáo mẫu để kiểm thử.")
    
    # Nếu người dùng truyền 1 tham số đường dẫn ảnh từ dòng lệnh
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
        if os.path.exists(target_path):
            banner_files = [Path(target_path)]
    
    # Vòng lặp đọc và phân tích từng ảnh
    for img_path in banner_files:
        result = analyze_banner(str(img_path))
        print(result)
        
    print("=" * 60)
    print(" KẾT THÚC KIỂM THỬ PROTOTYPE TUẦN 1")
    print(" Bạn có thể chụp màn hình kết quả trên để đưa vào Báo cáo Tuần 1.")
    print("=" * 60)

if __name__ == "__main__":
    main()
