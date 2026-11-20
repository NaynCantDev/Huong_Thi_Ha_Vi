# Portfolio Vương Thị Hà Vi — Thiết kế

Ngày: 2026-11-21 · Repo: https://github.com/NaynCantDev/Huong_Thi_Ha_Vi.git · Deploy: Netlify (Nayn tự làm)

## 1. Mục đích và lý do

Dựng lại portfolio học phần của **Vương Thị Hà Vi** (MSV 2552210219, Sư phạm Âm nhạc, ĐH Sư phạm Nghệ thuật Trung ương) thành một website cá nhân đẹp, có animation, thay cho bản Google Sites cũ. Web vừa là bài nộp học phần, vừa là **portfolio cá nhân** dùng lâu dài để giới thiệu năng lực.

Người dùng (Nayn) biết code và sẽ tự chỉnh sửa, nên ưu tiên **đẹp và chuyển động mượt** hơn sự đơn giản của mã nguồn.

## 2. Mục tiêu / không làm / thất bại

**Mục tiêu**
- Đủ 9 trang theo đề: Giới thiệu, Dự án (tổng quan), Bài 1–6 (mỗi bài 1 trang), Tổng kết.
- Trang chủ có: giới thiệu bản thân, mục tiêu học tập, **mục tiêu của Portfolio** (Câu 1).
- Chủ đề lấy từ chính con người Hà Vi: **piano** (mục tiêu rèn piano/thanh nhạc; Bài 2, 3, 5 đều xoay quanh piano) và **sân trường mùa hoa phượng** (ảnh banner).
- Animation bắt mắt, mượt, nhưng không rối; bố cục gọn.
- Có tương tác âm thanh kiểu 2 web tham khảo (phím đàn chơi được), làm bằng Web Audio, không cần file nhạc.

**Không làm**
- Báo cáo Word (Câu 4).
- CMS, backend, form liên hệ, đa ngôn ngữ.
- Deploy Netlify (chỉ chuẩn bị cấu hình để Nayn deploy).

**Thất bại dù vẫn "chạy được"**
- Trông giống template / giống 2 web tham khảo (sân khấu tím của Tuấn Anh, navy-vàng-guitar của Khải).
- Animation chạy liên tục khắp nơi, gây rối hoặc giật trên điện thoại.
- Âm thanh tự phát khi chưa bấm.
- Mất hoặc sai lệch nội dung bài làm của Hà Vi.
- Vỡ chữ tiếng Việt (font thiếu dấu).

**Yêu cầu của đề (nguyên văn tóm tắt)**: Portfolio tối thiểu 09 trang — Giới thiệu (About Me), Dự án (Projects) tổng quan, 06 trang bài tập (mỗi bài một trang), Tổng kết (Conclusion). Bước 1 (Câu 1): trang chủ giới thiệu bản thân, mục tiêu học tập và mục tiêu của Portfolio. Bước 2 (Câu 2): biên tập và trình bày lại kết quả Bài 1–6 vào các trang tương ứng. Bước 3 (Câu 3): trang tổng kết, rà soát toàn bộ sản phẩm. Câu 4 (báo cáo Word) nằm ngoài phạm vi.

## 3. Ràng buộc

- Nội dung nguồn: `content/` (đã thu thập, xem `content/README.md`). Văn bản giữ nguyên ý; chỉ chỉnh như mục 7.
- Deploy tĩnh trên Netlify: cần `netlify.toml` + rewrite SPA (`/* /index.html 200`).
- Chạy tốt trên điện thoại (≥ 360px), bàn phím điều hướng được, tôn trọng `prefers-reduced-motion`.
- Node 26 / npm 12 có sẵn trên máy.

## 4. Các cách đã cân nhắc

| Cách | Đánh đổi | Kết quả |
|---|---|---|
| HTML/CSS/JS thuần (như 2 web tham khảo) | Deploy đơn giản, nhưng animation chuyển trang và tái sử dụng thành phần kém | Không chọn |
| Astro dựng từ markdown | Ít lặp, nhưng animation tương tác phức tạp kém linh hoạt hơn React | Không chọn |
| **Vite + React + TypeScript + Motion** | Có bước build; đổi lại animation chuyển trang, layout animation, component tái sử dụng tốt nhất | **Nayn chọn** (ưu tiên đẹp + animation, người dùng biết code) |

## 5. Công nghệ (đã chốt)

- **Vite + React 19 + TypeScript**.
- **React Router** (BrowserRouter). URL: `/`, `/du-an`, `/du-an/bai-1` … `/du-an/bai-6`, `/tong-ket`.
- **Motion** (`motion/react`) cho animation: chuyển trang, layout, reveal, gesture.
- **Lenis** cho cuộn mượt (tắt khi reduced motion).
- CSS: **CSS Modules + biến CSS** (token ở `src/styles/tokens.css`). Không dùng Tailwind để giữ CSS dễ đọc khi tự chỉnh.
- Font: Google Fonts tự host qua `@fontsource` (không phụ thuộc CDN).
- Âm thanh: Web Audio API, tự tổng hợp tiếng piano (nhiều họa âm + envelope tắt dần). Chỉ phát sau tương tác người dùng; có nút bật/tắt tiếng, nhớ lựa chọn bằng `localStorage`.
- Ảnh: chuyển PNG/JPG sang **WebP** (script một lần bằng `sharp`), lazy-load, có lightbox.
- Nội dung: chuyển `content/pages/*.md` thành **dữ liệu TypeScript có cấu trúc** (`src/content/*.ts`) để mỗi bài có bố cục riêng. `content/` giữ nguyên trong repo làm nguồn gốc.

## 6. Thiết kế hình ảnh

### Ý tưởng: "Tập nhạc mùa phượng"

Website như một tập bản nhạc piano của Hà Vi: giấy trắng mát, mực chàm, phím đàn đen trắng, điểm đỏ hoa phượng và xanh cột trường (lấy từ ảnh banner và ảnh chân dung). Chỗ táo bạo duy nhất là **cây đàn piano ở hero**; mọi thứ còn lại yên tĩnh, kỷ luật.

### Màu

| Tên | Hex | Vai trò |
|---|---|---|
| Giấy | `#F4F6F9` | Nền chính (trắng mát, không phải kem) |
| Phím trắng | `#FFFFFF` | Phím đàn, mặt thẻ ảnh |
| Mực chàm | `#1C2140` | Chữ, phím đen, khuông nhạc |
| Phượng | `#E5432D` | Điểm nhấn: nốt đang phát, trang hiện tại, CTA chính |
| Cột trường | `#2B6BE0` | Liên kết, focus ring, trạng thái tương tác phụ |
| Chì | `#6A7090` | Chữ phụ, dòng kẻ khuông nhạc mờ |

Dark mode: không làm (tập nhạc là giấy sáng; giữ một bản thiết kế chỉn chu).

### Chữ

- **Unbounded** (rộng, khối, như phím đàn) cho tên, tiêu đề trang. Dùng chính khối chữ làm hình: tên "Hà Vi" đặt lên khuông nhạc, các chữ nhún xuống như phím khi bấm.
- **Be Vietnam Pro** cho thân bài (thiết kế cho tiếng Việt, dấu chuẩn).
- Thang chữ theo tỉ lệ 1.25 (major third), thân 17–18px, dòng ≤ 72 ký tự, line-height 1.65.
- Tránh: chữ hoa toàn bộ cho nhãn, nhãn nhỏ trên mọi tiêu đề, chuỗi "A · B · C", mũi tên "→" sau nút, font mono cho nhãn.

### Thiết bị cấu trúc có ý nghĩa (không trang trí)

- **Thang âm điều hướng**: 9 trang = 9 nốt đi lên (Đô, Rê, Mi, Fa, Sol, La, Si, Đô, Rê). Thanh điều hướng có dải 9 phím nhỏ; phím của trang hiện tại tô đỏ phượng. Bấm phím = chuyển trang + phát nốt đó. Đi hết portfolio là đi hết một thang âm.
- **Cường độ cho cấp prompt (Bài 3)**: Cơ bản = *p*, Cải tiến = *mf*, Nâng cao = *f* — ký hiệu cường độ thật, thể hiện độ "mạnh" của prompt.
- Đánh số chỉ dùng ở nội dung thực sự là chuỗi: các bước Bài 1, thứ tự Bài 1–6, lịch họp Bài 4.

### Bố cục

Căn trái cho chữ đọc; trung tâm chỉ dùng ở hero và đoạn kết.

Trang chủ:

```
┌──────────────────────────────────────────────┐
│ Hà Vi            [▮▯▮▯▮▯▮▯▮] thang 9 trang  🔈│
├──────────────────────────────────────────────┤
│  ════════ khuông nhạc ═════════   ┌────────┐ │
│  HÀ VI (Unbounded, rất lớn,        │ ảnh    │ │
│  nằm trên dòng kẻ)                 │ chân   │ │
│  Sinh viên Sư phạm Âm nhạc…        │ dung   │ │
│                                    └────────┘ │
│ ┌──────────── bàn phím 2 quãng tám ─────────┐ │
│ │ ▯▮▯▮▯▯▮▯▮▯▮▯▯▮▯▮▯▯▮▯▮▯▮▯  (chơi được)      │ │
│ └───────────────────────────────────────────┘ │
├──────────────────────────────────────────────┤
│ [ảnh banner sân trường hoa phượng, dải rộng]  │
│ Về mình: đoạn giới thiệu + ngành/trường/MSV   │
│ Mục tiêu học tập | Định hướng phát triển      │
│ Mục tiêu của Portfolio (3 ý)                  │
│ Lối vào Dự án: 6 bài như 6 trang nhạc         │
└──────────────────────────────────────────────┘
```

Trang Dự án ("Tập bản nhạc"): danh sách 6 bài theo hàng dọc, mỗi hàng là một khuông nhạc: số bài, chương, tên bài, kỹ năng, ảnh đại diện. Hover/focus một hàng phát nốt của bài đó và ảnh trượt ra.

Trang bài (khung chung):

```
┌──────────────────────────────────────────────┐
│ Bài 3 · Chương 3        (đầu trang)           │
│ Viết prompt hiệu quả cho tác vụ học tập       │
│ Mục tiêu | Công cụ | Kết quả  (tóm tắt ngắn)  │
├──────────────────────────────────────────────┤
│ Nội dung riêng từng bài (xem dưới)            │
├──────────────────────────────────────────────┤
│ ← Bài 2                         Bài 4 →       │
└──────────────────────────────────────────────┘
```

Nội dung riêng từng bài:
- **Bài 1** (File Explorer, 12 bước): bước tuần tự, mỗi bước một ảnh; trên desktop chữ bên trái dính (sticky), ảnh đổi theo bước khi cuộn.
- **Bài 2** (tìm và đánh giá tài liệu): 2 bảng 10 tài liệu; nhãn độ tin cậy Cao/Khá; bảng rộng cuộn ngang trên điện thoại, hoặc chuyển thành thẻ.
- **Bài 3** (viết prompt): 3 tác vụ; mỗi tác vụ có bộ chọn *p / mf / f* chuyển giữa 3 prompt + ảnh kết quả (layout animation); phần phân tích và mẹo bên dưới.
- **Bài 4** (họp trực tuyến): thông tin nhóm, lịch họp dạng dòng thời gian, biên bản, bảng phân công, đánh giá thành viên, bài học kinh nghiệm, ảnh dẫn chứng; nút tải file Word gốc.
- **Bài 5** (infographic piano): mục tiêu, quy trình, 2 hình kết quả; infographic phóng to được.
- **Bài 6** (an toàn và liêm chính học thuật): bài dài; mục lục dính bên cạnh, thanh tiến độ đọc là một dòng kẻ khuông nhạc chạy dần.
- **Tổng kết**: nội dung tổng kết; kết trang bằng một hợp âm kết (bấm để nghe), khép lại thang âm.

### Chuyển động

- **Một khoảnh khắc mở màn** ở trang chủ: khuông nhạc vẽ từ trái sang, chữ tên rơi vào dòng kẻ như nốt, bàn phím trượt lên. Khoảng 1.2s, chạy một lần.
- **Chuyển trang**: một phím đàn nhấn xuống ở thanh thang âm, nội dung trang cũ mờ đi, trang mới trượt nhẹ lên (≈ 350ms).
- **Phản hồi tương tác**: phím nhún khi bấm, nốt nhạc bay lên khuông từ phím vừa bấm, bộ chọn *p/mf/f* đổi nội dung bằng layout animation, lightbox mở từ vị trí ảnh.
- Không gắn hiệu ứng fade-in cho mọi section. Reveal khi cuộn chỉ cho ảnh lớn.
- `prefers-reduced-motion`: tắt Lenis, tắt bay nốt và mở màn; chuyển trang chỉ còn fade.

### Âm thanh

- Tắt tiếng mặc định cho đến khi người xem bấm phím lần đầu (bấm phím = đồng ý nghe).
- Nút loa ở thanh điều hướng để tắt hẳn; nhớ lựa chọn.
- Bàn phím hero: chuột/chạm, và phím máy tính (A W S E D F T G Y H U J K…).

## 7. Nội dung

- Văn bản lấy từ `content/pages/*.md` và `content/embeds/*.html`.
- **Giữ nguyên tuyệt đối văn bản bài làm** (Nayn chốt): không sửa chính tả, dấu cách, không gộp đoạn lặp, giữ các chỗ mâu thuẫn trong Bài 4. Chỉ được đổi cách trình bày (bố cục, kiểu chữ, chia khối). Bài 3: mục II.2 hiển thị đúng như gốc; phần kết quả kèm ảnh (II.3) dùng bộ chọn *p / mf / f*, chữ vẫn nguyên văn.
- **Ảnh giữ nguyên** (Nayn chốt): ảnh Bài 3 không cắt; ảnh Meet Bài 4 giữ nguyên và có nút tải file Word gốc.
- **Thông tin học phần** (Nayn chốt): học phần "Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo", giảng viên hướng dẫn Vũ Việt Hoàng; lớp để trống (ẩn nếu trống), khai báo trong một file dữ liệu để dễ sửa.
- **Viết mới (Claude soạn, đánh dấu để Hà Vi/Nayn duyệt):** "Mục tiêu của Portfolio" ở trang chủ; tóm tắt 1–2 câu cho mỗi bài ở trang Dự án; câu dẫn ngắn ở đầu mỗi trang bài.
- **Ảnh banner** (sân trường hoa phượng): *quyết định của Claude* — đặt thành một dải ảnh rộng mở đầu phần "Về mình", cuộn có parallax nhẹ; đồng thời làm ảnh og. Hero giữ nền giấy để cây đàn nổi bật.
- **Khối tóm tắt đầu trang bài (Mục tiêu | Công cụ | Kết quả)**: *quyết định của Claude* — lấy từ nội dung bài nếu có; bài nào không ghi rõ (Bài 1, 4, 6) thì Claude soạn từ nội dung bài và đánh dấu "viết mới". Component chấp nhận thiếu trường. Nhãn chương: Bài 1, 2, 3, 5 có ghi chương; Bài 4 và 6 suy ra là Chương 4 và Chương 6 theo thứ tự trong trang Tổng kết, đánh dấu để duyệt.
- Ảnh: dùng `content/assets/`. Logo lá của Google Sites bỏ.
- SEO cơ bản: title/description mỗi trang, ảnh og từ banner.

## 8. Phần để người dựng tự quyết

- Cấu trúc thư mục `src/`, tên component.
- Thuật toán tổng hợp tiếng piano (chỉ cần nghe ấm, không chói).
- Mức breakpoints, chi tiết spacing theo token.
- Cách chuyển bảng Bài 2 trên điện thoại (cuộn ngang hay thẻ).
- Cách test: build + lint + kiểm tra trực quan trên trình duyệt (desktop và mobile).
