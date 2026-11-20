import type { PageSlug } from '../content/types'

export type PageMeta = {
  slug: PageSlug
  path: string
  /** Full title used in <title> and headings. */
  title: string
  /** Short label used in the scale navigation tooltip. */
  navLabel: string
  /** Note played by this page's key; the nine pages climb a C major scale. */
  note: string
  /** Vietnamese solfège name of the note, for accessible labels. */
  solfege: string
  description: string
}

export const PAGES: PageMeta[] = [
  {
    slug: 'gioi-thieu',
    path: '/',
    title: 'Giới thiệu',
    navLabel: 'Giới thiệu',
    note: 'C4',
    solfege: 'Đô',
    description: 'Vương Thị Hà Vi, sinh viên Sư phạm Âm nhạc: giới thiệu bản thân, mục tiêu học tập và mục tiêu của portfolio.',
  },
  {
    slug: 'du-an',
    path: '/du-an',
    title: 'Dự án',
    navLabel: 'Dự án',
    note: 'D4',
    solfege: 'Rê',
    description: 'Tổng quan sáu bài tập của học phần, từ quản lý tệp đến sử dụng AI có trách nhiệm.',
  },
  {
    slug: 'bai-1',
    path: '/du-an/bai-1',
    title: 'Bài 1',
    navLabel: 'Bài 1',
    note: 'E4',
    solfege: 'Mi',
    description: 'Bài 1: thực hành quản lý tệp và thư mục trong File Explorer qua 12 bước.',
  },
  {
    slug: 'bai-2',
    path: '/du-an/bai-2',
    title: 'Bài 2',
    navLabel: 'Bài 2',
    note: 'F4',
    solfege: 'Fa',
    description: 'Bài 2: tìm kiếm và đánh giá nguồn thông tin học thuật về AI trong luyện tập piano và dạy âm nhạc.',
  },
  {
    slug: 'bai-3',
    path: '/du-an/bai-3',
    title: 'Bài 3',
    navLabel: 'Bài 3',
    note: 'G4',
    solfege: 'Sol',
    description: 'Bài 3: viết prompt hiệu quả cho ba tác vụ học piano, từ prompt cơ bản đến nâng cao.',
  },
  {
    slug: 'bai-4',
    path: '/du-an/bai-4',
    title: 'Bài 4',
    navLabel: 'Bài 4',
    note: 'A4',
    solfege: 'La',
    description: 'Bài 4: báo cáo tổ chức và tham gia cuộc họp nhóm trực tuyến trên Google Meet.',
  },
  {
    slug: 'bai-5',
    path: '/du-an/bai-5',
    title: 'Bài 5',
    navLabel: 'Bài 5',
    note: 'B4',
    solfege: 'Si',
    description: 'Bài 5: dùng ChatGPT và Canva tạo infographic "Bí quyết học piano hiệu quả cho người mới bắt đầu".',
  },
  {
    slug: 'bai-6',
    path: '/du-an/bai-6',
    title: 'Bài 6',
    navLabel: 'Bài 6',
    note: 'C5',
    solfege: 'Đô',
    description: 'Bài 6: an toàn và liêm chính học thuật khi sử dụng AI trong môi trường số.',
  },
  {
    slug: 'tong-ket',
    path: '/tong-ket',
    title: 'Tổng kết',
    navLabel: 'Tổng kết',
    note: 'D5',
    solfege: 'Rê',
    description: 'Tổng kết học phần: trải nghiệm, kỹ năng tích lũy, điều tâm đắc và định hướng tiếp theo.',
  },
]

export function getPage(slug: PageSlug): PageMeta {
  const p = PAGES.find((x) => x.slug === slug)
  if (!p) throw new Error(`Unknown page: ${slug}`)
  return p
}

export function getPageByPath(path: string): PageMeta | undefined {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path
  return PAGES.find((p) => p.path === clean)
}

export function getNeighbors(slug: PageSlug): { prev?: PageMeta; next?: PageMeta } {
  const i = PAGES.findIndex((p) => p.slug === slug)
  return { prev: PAGES[i - 1], next: PAGES[i + 1] }
}
