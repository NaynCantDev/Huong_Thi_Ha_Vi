import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section style={{ maxWidth: 'var(--content)', margin: '0 auto', padding: 'var(--space-3xl) var(--gutter)' }}>
      <title>Không tìm thấy trang — Vương Thị Hà Vi</title>
      <h1>Trang này không có trong tập nhạc</h1>
      <p style={{ marginTop: 'var(--space-m)' }}>
        Địa chỉ có thể đã gõ sai. <Link to="/">Về trang Giới thiệu</Link> hoặc <Link to="/du-an">xem các bài tập</Link>.
      </p>
    </section>
  )
}
