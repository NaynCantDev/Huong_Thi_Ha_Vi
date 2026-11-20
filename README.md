# Portfolio Vương Thị Hà Vi

Portfolio học phần *Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo* của Vương Thị Hà Vi (Sư phạm Âm nhạc). Chủ đề piano pastel: bàn phím chơi được, menu 9 phím là 9 trang theo thang âm Đô → Rê, hoa phượng rơi ở trang đầu.

Stack: Vite + React 19 + TypeScript, React Router, Motion, Lenis, CSS Modules.

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # vitest
npm run build    # xuất ra dist/
```

## Deploy Netlify

Đã có sẵn `netlify.toml` (build `npm run build`, publish `dist`, Node 24) và `public/_redirects` để F5 ở trang con không lỗi 404. Kết nối repo trên Netlify là chạy.

## Sửa nội dung

| Muốn sửa | Ở đâu |
|---|---|
| Chữ các bài (nguyên văn từ Google Sites) | `content/pages/*.md`, sau đó chạy `npm run content` |
| Ảnh | `content/assets/<trang>/`, sau đó chạy `npm run images` |
| Tên, MSV, học phần, giảng viên, **lớp**, mục tiêu Portfolio | `src/data/site.ts` |
| Tên, tóm tắt, mục tiêu/công cụ/kết quả của từng bài | `src/data/lessons.ts` |
| Tên trang, nốt nhạc, mô tả SEO | `src/data/pages.ts` |
| Màu, font, khoảng cách | `src/styles/tokens.css` |

Những đoạn có chú thích `VIẾT MỚI` là nội dung Claude soạn thêm (không có trên site gốc) — nên đọc lại và chỉnh theo ý Hà Vi.

## Cấu trúc

- `scripts/md-to-blocks.ts` — chuyển markdown thành JSON (giữ nguyên văn), có test so từng ký tự.
- `scripts/optimize-images.mjs` — chuyển ảnh sang WebP.
- `src/audio/piano.ts` — tiếng piano tổng hợp bằng Web Audio (chỉ kêu sau khi người xem bấm; nút loa để tắt).
- `src/pages/` — 9 trang; `src/components/` — phím đàn, menu thang âm, lightbox, bộ chọn p/mf/f…
