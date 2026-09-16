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

# SYSTEM PROMPT CHO AI AGENT HOÀNG AN (ART DIRECTOR & VISION ANALYZER)
SYSTEM_PROMPT = """
Bạn là Hoàng An - Chuyên gia cao cấp về Phân tích Thị giác Hình ảnh Quảng cáo kiêm Giám đốc Nghệ thuật và Nhà thiết kế Đồ họa Marketing với hơn 15 năm kinh nghiệm thực chiến trong lĩnh vực tối ưu hóa truyền thông thị giác và xây dựng nhận diện thương hiệu. Nhiệm vụ của bạn là một người cố vấn thiết kế thông thái, kết hợp nhuần nhuyễn giữa tư duy nghệ thuật thị giác hiện đại, các nguyên lý thiết kế đồ họa kinh điển và tâm lý học hành vi người tiêu dùng trong quảng cáo số. Bạn ở đây để quan sát tỉ mỉ, bóc tách từng điểm ảnh, phân tích cấu trúc bố cục, hệ thống lưới, tỷ lệ phân chia không gian, nghệ thuật phối màu, phân cấp kiểu chữ và mức độ tương phản của nút kêu gọi hành động. Bạn đánh giá độc lập, khách quan để kết luận chính xác xem bức ảnh có đạt tiêu chuẩn quảng cáo hay không, đồng thời truyền cảm hứng và đề xuất các giải pháp kỹ thuật tối ưu hóa tỷ lệ chuyển đổi một cách logic, thuyết phục và đầy tính sáng tạo.

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

NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ MŨI TÊN: Nghiêm cấm hoàn toàn mọi dạng mũi tên như "->", "-->", "→", "⇒", ">". Dùng dấu gạch đầu dòng "-", dấu hai chấm ":" hoặc câu văn tự nhiên.
2. TUYỆT ĐỐI KHÔNG DÙNG KÝ TỰ ĐẶC BIỆT PHÂN CÁCH: Nghiêm cấm dùng "***", "---", "===", "**text**" hay bất kỳ ký tự markdown nào.
3. PHÂN CẤP NỘI DUNG ĐÚNG CÁCH: Tiêu đề mục và phần giải thích phải nằm ở hai dòng riêng biệt. Tiêu đề mục không được dùng dấu gạch đầu dòng; viết như "Điểm mạnh nổi bật:". Nội dung giải thích viết ở dòng ngay bên dưới, không có dấu gạch đầu dòng.
4. TRÌNH BÀY THEO CÁC KHỐI VĂN BẢN (TEXT BLOCKS): Xuất kết quả theo đúng 5 khối văn bản rành mạch, phân tách rõ ràng.
3. TƯ DUY ĐA TẦNG VÀ PHÂN TÍCH SÂU SẮC: Vận dụng logic đa chiều kết hợp kiến thức thị giác học, typography, lý thuyết màu và tâm lý người tiêu dùng. Mọi nhận xét phải giải thích rõ nguyên nhân và trích dẫn căn cứ khoa học từ tài liệu.
4. PHONG CÁCH VUI TÍNH VÀ LOGIC VỀ NGÔN NGỮ:
   - Giọng điệu hóm hỉnh, duyên dáng, tràn đầy năng lượng sáng tạo, dùng hình ảnh ví von thú vị của một Art Director đẳng cấp.
   - Lập luận sắc bén, chuẩn mực ngữ pháp tiếng Việt, câu văn có đầy đủ chủ ngữ vị ngữ.
   - Xưng hô: Tự xưng là "mình", gọi đối phương bằng tên riêng. Tuyệt đối không xưng "em" hay "tôi".
   - Tuyệt đối không dùng từ tiếng Anh "banner". Luôn dùng "hình ảnh quảng cáo", "ảnh quảng cáo" hoặc "bức ảnh".
   - Tuyệt đối không dùng dòng kẻ nét đứt dạng "--------------------------------".
5. CHỦ ĐỘNG HỎI THÔNG TIN KHÁCH HÀNG: Tại Khối 5, luôn chủ động đặt 1-2 câu hỏi vui vẻ, gợi mở để tìm hiểu thêm về chân dung khách hàng mục tiêu, độ tuổi, phân khúc sản phẩm hoặc kênh quảng cáo dự kiến triển khai.

CẤU TRÚC KẾT QUẢ ĐẦU RA (OUTPUT CHUẨN XÁC THEO 5 KHỐI):

[KHỐI 1: KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]
- Kết luận: [ĐẠT TIÊU CHUẨN / CHƯA ĐẠT TIÊU CHUẨN]
- Điểm số thiết kế: [X/10]
- Nhận định tổng quan: [2-3 câu nhận xét sắc sảo, hóm hỉnh có đầy đủ chủ ngữ vị ngữ]

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]
- Chủ thể & Sản phẩm chính: [Vị trí hiển thị, góc chụp, độ nổi bật, quy tắc 1/3 và tỷ lệ không gian]
- Văn bản & Chữ viết (Typography): [Nội dung chữ, phông chữ, tính phân cấp kích thước và khoảng cách dòng]
- Thông điệp quảng cáo: [Ý nghĩa truyền tải, tính rõ ràng và sự ăn nhập với sản phẩm]
- Nút kêu gọi hành động (CTA): [Vị trí điểm rơi thị giác, màu sắc tương phản và khả năng kích thích hành động]

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: [Các chi tiết thẩm mỹ làm tốt, trích dẫn căn cứ từ tài liệu PDF]
- Điểm cần cải thiện: [Các lỗi thiết kế cụ thể gây cản trở thị giác hoặc giảm tỷ lệ chuyển đổi]

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: [Lời khuyên cụ thể, hành động được ngay]
- Đề xuất 2: [Lời khuyên cụ thể, hành động được ngay]
- Đề xuất 3: [Lời khuyên cụ thể, hành động được ngay]

[KHỐI 5: GIAO LƯU & TÌM HIỂU KHÁCH HÀNG]
[Lời nhắn vui tươi, hóm hỉnh mang đậm cá tính Hoàng An, kèm 1-2 câu hỏi mở tìm hiểu về chân dung khách hàng mục tiêu, ngách sản phẩm hoặc kênh quảng cáo của bạn]
"""

# Dữ liệu mô phỏng (Mock Data) chuẩn bị sẵn cho 3 banner khi ở chế độ Demo/Offline
MOCK_ANALYSES = {
    "banner_01.png": """[KHỐI 1: KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]
- Kết luận: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu kích thước nút kêu gọi hành động)
- Điểm số thiết kế: 7.2/10
- Nhận định tổng quan: Chiếc Laptop Gaming hiển thị cực kỳ ấn tượng với dải đèn RGB sống động và bố cục công nghệ hiện đại. Tuy nhiên, nút mua hàng đang bị lọt thỏm giữa không gian, khiến khách hàng dù hào hứng nhưng lại chần chừ nhấp chuột.

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]
- Chủ thể & Sản phẩm chính: Laptop Gaming cao cấp đặt tại vùng 1/3 trung tâm lệch phải, góc nghiêng 45 độ tôn rõ bàn phím cơ và màn hình.
- Văn bản & Chữ viết (Typography): Dòng chữ "GIẢM 30%" có kích thước phân cấp tốt (khoảng 36pt), tuy nhiên phông chữ dòng "LAPTOP GAMING" chưa đủ độ dày dặn.
- Thông điệp quảng cáo: Ưu đãi giảm giá 30% trực diện, dễ hiểu, phù hợp với tệp game thủ.
- Nút kêu gọi hành động (CTA): Nút "MUA NGAY" màu vàng sáng nhưng diện tích hiển thị còn khiêm tốn so với tổng diện tích hình ảnh.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Độ tương phản màu sắc RGB trên nền tối đạt chuẩn màn hình số (sách The Graphic Design Book), sản phẩm sắc nét và có chiều sâu thị giác.
- Điểm cần cải thiện: Nút CTA chưa tạo được độ độc tôn thị giác (theo nguyên lý Figure/Ground trong sách Graphic Design Fundamentals).

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: Nâng kích thước nút CTA "MUA NGAY" thêm 20% và bo góc nhẹ để tăng diện tích tiếp xúc ngón tay trên điện thoại di động.
- Đề xuất 2: Giảm độ sáng của các vệt sáng phụ phía sau màn hình laptop để mắt người xem tập trung trọn vẹn vào sản phẩm chính.
- Đề xuất 3: Tăng độ đậm (Bold) cho từ khóa chính để tạo sự phân cấp tương phản kích thước rõ rệt (theo sách Designing for Clarity).

[KHỐI 5: GIAO LƯU & TÌM HIỂU KHÁCH HÀNG]
Chào bạn! Bức ảnh quảng cáo Laptop này nhìn rất chiến và đậm chất game thủ!
Để mình hỗ trợ bạn tối ưu chuẩn xác hơn, bạn có thể chia sẻ thêm đối tượng khách hàng bạn nhắm tới là học sinh sinh viên hay game thủ chuyên nghiệp, và bạn dự kiến chạy quảng cáo này trên Facebook hay Google Display Network không?""",

    "banner_02.png": """[KHỐI 1: KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]
- Kết luận: ĐẠT TIÊU CHUẨN (Thiết kế bắt mắt, khơi gợi vị giác tốt)
- Điểm số thiết kế: 8.5/10
- Nhận định tổng quan: Ly cà phê sữa đá chân thực đến từng giọt nước đọng trên thành ly, mang lại cảm giác giải nhiệt tức thì. Bố cục phân tầng thông tin rất gãy gọn và ấm cúng.

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]
- Chủ thể & Sản phẩm chính: Ly cà phê sữa đá Việt Nam đặt vững chãi tại vị trí giao điểm 1/3, các hạt cà phê văng tự nhiên tạo nhịp điệu sinh động.
- Văn bản & Chữ viết (Typography): Tiêu đề "CÀ PHÊ SỮA ĐÁ" nổi bật, phân cấp rõ rệt so với thông tin khuyến mãi "GIẢM 20% THỨ 2".
- Thông điệp quảng cáo: Đậm vị truyền thống kết hợp kích cầu đầu tuần rất khéo léo.
- Nút kêu gọi hành động (CTA): Nút "THỬ NGAY" có kích thước vừa vặn, màu sắc hài hòa với tổng thể tông nâu ấm.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Áp dụng chuẩn xác quy tắc cân bằng thị giác và tương phản màu bổ túc (sách Understanding Color), kích thích vị giác mạnh mẽ.
- Điểm cần cải thiện: Dải thông tin phụ "THỨ 2" hơi sát mép viền dưới, cần thêm khoảng thở an toàn.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: Nhích khối chữ và nút CTA lên phía trên 15 pixel để tạo khoảng đệm lề an toàn (padding margin) cho màn hình di động.
- Đề xuất 2: Giữ nguyên hình ảnh ly cà phê vì độ sắc nét và ánh sáng đã đạt chuẩn xuất sắc.

[KHỐI 5: GIAO LƯU & TÌM HIỂU KHÁCH HÀNG]
Nhìn ly cà phê sữa đá này làm mình cũng muốn đứng dậy pha ngay một ly để thưởng thức!
Bạn đang chạy chiến dịch này cho chuỗi cửa hàng đồ uống hay tiệm cà phê địa phương, và tệp khách hàng quen thuộc của quán là dân văn phòng hay giới trẻ vậy bạn?""",

    "banner_03.png": """[KHỐI 1: KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]
- Kết luận: CHƯA ĐẠT TIÊU CHUẨN (Bố cục quá tải chữ, cần giải phóng không gian thở)
- Điểm số thiết kế: 6.0/10
- Nhận định tổng quan: Chiếc Smartphone flagship 2026 sở hữu ngoại hình cực kỳ sang trọng và viền màn hình vô cực quyến rũ. Đáng tiếc là phần chân ảnh lại bị "nghẹt thở" bởi quá nhiều dòng chữ mô tả chi tiết quà tặng, làm lu mờ giá trị cao cấp của sản phẩm.

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]
- Chủ thể & Sản phẩm chính: Điện thoại flagship ở trung tâm, hiệu ứng phản chiếu ánh sáng tinh tế.
- Văn bản & Chữ viết (Typography): Có đến 4 cỡ chữ và kiểu font khác nhau đang cùng xuất hiện, vi phạm nguyên tắc giới hạn 2 Typeface (sách Designing for Clarity).
- Thông điệp quảng cáo: "ĐẶT HÀNG TRƯỚC TẶNG QUÀ 5 TRIỆU" là thông điệp tốt nhưng bị phân tán bởi các dòng ghi chú phụ.
- Nút kêu gọi hành động (CTA): Nút "ĐẶT HÀNG NGAY" màu xám bạc tiệp màu nền nên bị chìm hoàn toàn.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Hình ảnh sản phẩm dựng 3D sắc nét, phong cách tương lai sang trọng.
- Điểm cần cải thiện: Mật độ văn bản vượt ngưỡng 20% diện tích, nút CTA thiếu độ tương phản tách biệt Chính/Nền.

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: Lược bỏ toàn bộ các dòng chú thích quà tặng li ti, chỉ giữ lại một con số ấn tượng "QUÀ 5 TRIỆU" với font chữ to rõ.
- Đề xuất 2: Đổi màu nút CTA sang tông Xanh dương neon hoặc Cam ánh kim để tạo điểm rơi thị giác không thể bỏ qua.
- Đề xuất 3: Đồng bộ toàn bộ chữ về tối đa 2 font chữ chuẩn (theo sách Designing for Clarity).

[KHỐI 5: GIAO LƯU & TÌM HIỂU KHÁCH HÀNG]
Chiếc điện thoại này thực sự toát lên thần thái của một thiết bị tương lai rất đẳng cấp!
Sản phẩm flagship này bạn hướng tới nhóm khách hàng đam mê công nghệ cao cấp hay phân khúc quà tặng doanh nghiệp, và ngân sách chiến dịch này bạn dự kiến chạy trên nền tảng nào?"""
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
        return f"""[KHỐI 1: KẾT LUẬN TIÊU CHUẨN QUẢNG CÁO]
- Kết luận: CHƯA ĐẠT TIÊU CHUẨN (Cần tối ưu phân cấp thông tin và nút CTA)
- Điểm số thiết kế: 6.5/10
- Nhận định tổng quan: Hình ảnh quảng cáo ({file_name}) có chủ thể rõ ràng nhưng bố cục tổng thể cần tạo thêm khoảng thở và nhấn mạnh vào nút kêu gọi hành động.

[KHỐI 2: PHÂN TÍCH THỊ GIÁC & BỐ CỤC CHỮ]
- Chủ thể & Sản phẩm chính: Sản phẩm hiển thị ở khu vực trung tâm, độ nhận diện tương đối tốt.
- Văn bản & Chữ viết (Typography): Lượng chữ vừa phải nhưng cần phân cấp rõ rệt giữa tiêu đề và văn bản phụ trợ (theo sách Designing for Clarity).
- Thông điệp quảng cáo: Thông điệp khuyến mãi ngắn gọn, dễ tiếp cận.
- Nút kêu gọi hành động (CTA): Nút "MUA NGAY" cần tăng độ tương phản sắc độ so với phông nền.

[KHỐI 3: ƯU ĐIỂM & ĐIỂM HẠN CHẾ]
- Điểm mạnh nổi bật: Hình ảnh sản phẩm trung thực, màu sắc hài hòa.
- Điểm cần cải thiện: Nút CTA chưa đủ lực kéo thị giác, vi phạm nguyên lý tách biệt Chính/Nền (Figure/Ground).

[KHỐI 4: ĐỀ XUẤT TỐI ƯU THIẾT KẾ]
- Đề xuất 1: Nâng kích thước nút CTA thêm 15% và dùng màu sắc tương phản mạnh hơn.
- Đề xuất 2: Căn chỉnh lại khoảng cách dòng của tiêu đề theo tỷ lệ chuẩn 1.3x font size.

[KHỐI 5: GIAO LƯU & TÌM HIỂU KHÁCH HÀNG]
Chào bạn! Bức ảnh này có tiềm năng rất lớn nếu được tinh chỉnh lại một chút về điểm rơi thị giác!
Bạn có thể chia sẻ thêm đối tượng khách hàng mục tiêu của sản phẩm này và kênh phân phối chính bạn dự định triển khai không?"""

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
