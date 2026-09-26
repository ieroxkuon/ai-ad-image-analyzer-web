#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
ADVISION AI - BỘ BIÊN DỊCH TRI THỨC QUY CHUẨN THIẾT KẾ (MASTER KNOWLEDGE COMPILER)
=============================================================================
Mục đích nghiên cứu:
- Tự động hóa tiền xử lý dữ liệu (Data Preprocessing Pipeline): Hợp nhất 22 quy chuẩn
  thẩm định thị giác đã chưng cất từ 16 tài liệu chuyên ngành PDF.
- Xuất bản tài liệu chuẩn hóa "Sổ Tay Quy Chuẩn Thẩm Định Thị Giác & Thiết Kế Quảng Cáo"
  dưới định dạng Markdown (để xuất sang PDF đưa lên Google Drive và nạp vào NotebookLM)
  và định dạng JSON cấu trúc (Machine-readable Knowledge Base).
=============================================================================
"""

import os
import sys
import json
import logging
from pathlib import Path
from datetime import datetime

# Cấu hình logging chuẩn mực
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("MasterKnowledgeCompiler")

# Đường dẫn thư mục
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DOCS_DIR = BASE_DIR / "docs"
TRAINING_DOCS_DIR = BASE_DIR / "trainingdocs"

RULES_JSON_PATH = DATA_DIR / "design_rules.json"
OUTPUT_MD_PATH = DOCS_DIR / "SO_TAY_QUY_CHUAN_THIET_KE.md"
OUTPUT_MASTER_JSON_PATH = DATA_DIR / "master_design_knowledge.json"


def load_design_rules(file_path: Path) -> dict:
    """Đọc và kiểm tra tính hợp lệ của bộ quy chuẩn thẩm định từ JSON."""
    if not file_path.exists():
        logger.error(f"Không tìm thấy file quy chuẩn tại: {file_path}")
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    rules = data.get("rules", [])
    logger.info(f"Đã nạp thành công {len(rules)} quy chuẩn thẩm định thị giác.")
    return data


def scan_source_documents(training_dir: Path) -> list:
    """Quét danh sách các tài liệu PDF chuyên ngành nguồn."""
    if not training_dir.exists():
        return []
    pdf_files = sorted([f.name for f in training_dir.glob("*.pdf")])
    logger.info(f"Tìm thấy {len(pdf_files)} tài liệu PDF nguồn trong thư mục {training_dir.name}.")
    return pdf_files


def generate_master_markdown(data: dict, pdf_sources: list) -> str:
    """Tạo nội dung cẩm nang nghiên cứu Markdown hoàn chỉnh có cấu trúc học thuật."""
    rules = data.get("rules", [])
    version = data.get("rulebook_version", "1.0")

    category_titles = {
        "layout_composition": "1. Bố Cục & Hệ Thống Lưới Thị Giác (Layout & Grid Systems)",
        "color_contrast": "2. Màu Sắc, Tương Phản & Độ Sáng (Color Science & Contrast)",
        "typography": "3. Nghệ Thuật Chữ & Phân Cấp Thị Giác (Typography & Hierarchy)",
        "cta_optimization": "4. Tối Ưu Điểm Chốt Hành Động (CTA Optimization & Conversion)",
        "branding": "5. Nhận Diện Thương Hiệu & Khoảng Thở (Branding & Negative Space)"
    }

    # Gom nhóm theo category
    grouped = {}
    for r in rules:
        cat = r.get("category", "other")
        grouped.setdefault(cat, []).append(r)

    now_str = datetime.now().strftime("%d/%m/%Y")

    lines = [
        "# 📘 SỔ TAY QUY CHUẨN THẨM ĐỊNH THỊ GIÁC & THIẾT KẾ QUẢNG CÁO SỐ",
        "> **Tài liệu nghiên cứu khoa học phục vụ Đồ án Tốt nghiệp & Nạp vào Google NotebookLM**",
        f"> **Phiên bản:** {version} | **Ngày cập nhật:** {now_str}",
        "",
        "---",
        "",
        "## 📑 LỜI MỞ ĐẦU",
        "Tài liệu này là công trình chưng cất tri thức khoa học thị giác từ 16 tài liệu chuyên ngành đồ họa, "
        "nghiên cứu tâm lý hành vi thị giác người tiêu dùng và các nguyên lý thiết kế kinh điển. "
        "Mỗi quy chuẩn được định nghĩa rõ ràng kèm theo ngưỡng định lượng (Threshold), mức độ nghiêm trọng (Severity) "
        "và nguồn trích dẫn học thuật minh bạch.",
        "",
        "---",
        "",
        "## 📚 DANH MỤC 16 TÀI LIỆU PDF NGUỒN ĐƯỢC CHƯNG CẤT",
        ""
    ]

    for idx, pdf in enumerate(pdf_sources, 1):
        lines.append(f"{idx}. `{pdf}`")

    lines.extend([
        "",
        "---",
        "",
        "## 📊 BẢNG TỔNG HỢP 22 QUY CHUẨN THẨM ĐỊNH THỊ GIÁC",
        "",
        "| STT | Mã Quy Chuẩn | Tiêu Đề Quy Chuẩn | Ngưỡng Tiêu Chuẩn (Threshold) | Mức Độ |",
        "| :-: | :--- | :--- | :--- | :-: |"
    ])

    for idx, r in enumerate(rules, 1):
        severity_badge = "🔴 Critical" if r.get("severity") == "critical" else "🟡 Moderate"
        lines.append(f"| {idx:02d} | `{r['rule_id']}` | **{r['title']}** | {r['threshold']} | {severity_badge} |")

    lines.extend([
        "",
        "---",
        "",
        "## 🔬 NỘI DUNG CHI TIẾT TỪNG PHÂN VÙNG QUY CHUẨN",
        ""
    ])

    rule_counter = 1
    for cat_key, cat_title in category_titles.items():
        cat_rules = grouped.get(cat_key, [])
        if not cat_rules:
            continue

        lines.extend([
            f"### {cat_title}",
            ""
        ])

        for r in cat_rules:
            lines.extend([
                f"#### Quy chuẩn #{rule_counter:02d}: {r['title']}",
                f"- **Mã quy chuẩn (Rule ID):** `{r['rule_id']}`",
                f"- **Mức độ ảnh hưởng:** `{r.get('severity', 'moderate').upper()}`",
                f"- **Ngưỡng định lượng bắt buộc:** `{r['threshold']}`",
                f"- **Giải thích nguyên lý:** {r['description']}",
                f"- **Tác động tới chuyển đổi (Impact):** {r.get('impact', 'Tối ưu hóa khả năng truyền đạt thông điệp và giảm tải nhận thức thị giác.')}",
                f"- **Căn cứ trích dẫn:** *{r['source_book']}* — {r['source_location']}",
                ""
            ])
            rule_counter += 1

    lines.extend([
        "---",
        "",
        "## 🤖 HƯỚNG DẪN TÍCH HỢP VỚI GOOGLE NOTEBOOKLM & GENERATIVE AI",
        "1. **Tải lên Google Drive:** Đặt file này dưới dạng PDF hoặc Google Doc trên thư mục Drive của bạn.",
        "2. **Nạp vào NotebookLM:** Truy cập https://notebooklm.google.com, tạo Notebook mới và chọn nguồn từ Google Drive.",
        "3. **Tự động sinh Prompt Tái thiết kế (Redesign Prompt):** Kết hợp các phát hiện vi phạm với bộ khung Generative Prompt (Midjourney / DALL-E 3) để tái sinh sản phẩm quảng cáo hoàn chỉnh.",
        ""
    ])

    return "\n".join(lines)


def main():
    logger.info("Bắt đầu quá trình biên dịch tài liệu nghiên cứu...")

    data = load_design_rules(RULES_JSON_PATH)
    pdf_sources = scan_source_documents(TRAINING_DOCS_DIR)

    # 1. Xuất file Markdown cẩm nang hoàn chỉnh
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    master_md = generate_master_markdown(data, pdf_sources)
    with open(OUTPUT_MD_PATH, "w", encoding="utf-8") as f:
        f.write(master_md)
    logger.info(f"Đã xuất bản cẩm nang cẩm nang nghiên cứu tại: {OUTPUT_MD_PATH}")

    # 2. Xuất file Master Knowledge JSON
    master_json = {
        "metadata": {
            "title": "AdVision Master Grounded Design Knowledge Base",
            "version": data.get("rulebook_version", "1.0"),
            "compiled_at": datetime.now().isoformat(),
            "total_rules": len(data.get("rules", [])),
            "source_pdfs": pdf_sources
        },
        "rules": data.get("rules", [])
    }
    with open(OUTPUT_MASTER_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(master_json, f, ensure_ascii=False, indent=2)
    logger.info(f"Đã xuất bản Master Knowledge JSON tại: {OUTPUT_MASTER_JSON_PATH}")

    print("\n✅ HOÀN TẤT BIÊN DỊCH TRI THỨC NGHIÊN CỨU!")
    print(f"📄 Markdown: {OUTPUT_MD_PATH}")
    print(f"📦 JSON:     {OUTPUT_MASTER_JSON_PATH}\n")


if __name__ == "__main__":
    main()
