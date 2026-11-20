import { getBlocks, inlineText } from '../content/load'
import type { Block } from '../content/types'

export type LessonSlug = 'bai-1' | 'bai-2' | 'bai-3' | 'bai-4' | 'bai-5' | 'bai-6'

export type LessonMeta = {
  slug: LessonSlug
  number: number
  /** Chapter label for lists and navigation. */
  chapter: string
  /** True when the source page does not name the chapter and it was inferred from the order of exercises. */
  chapterInferred?: boolean
  /** Short title for lists and prev/next links. */
  title: string
  /** One sentence for the Projects page. */
  summary: string
  goal?: string
  tools?: string
  result?: string
  /** Image key used as thumbnail on the Projects page. */
  cover?: string
  /** How many source blocks (after the scraped "Bài n" title) form the lesson's own heading. */
  lead: number
  /** Fields written new for this site (not on the original Google Site) — to be reviewed. */
  newCopy: Array<'title' | 'summary' | 'goal' | 'tools' | 'result'>
}

// VIẾT MỚI: title, summary, goal, tools, result của mọi bài (trừ khi ghi chú khác) — cần Hà Vi duyệt.
export const LESSONS: LessonMeta[] = [
  {
    slug: 'bai-1',
    number: 1,
    chapter: 'Chương 1',
    title: 'Thực hành quản lý tệp và thư mục',
    summary: 'Mười hai bước làm việc với tệp và thư mục trong File Explorer, từ tạo mới đến khôi phục từ Thùng rác.',
    goal: 'Thành thạo các thao tác cơ bản với tệp và thư mục trên Windows.',
    tools: 'File Explorer, Thùng rác (Recycle Bin)',
    result: '12 bước thao tác, mỗi bước có ảnh chụp màn hình.',
    cover: 'bai-1/02-buoc-02',
    lead: 2,
    newCopy: ['summary', 'goal', 'tools', 'result'],
  },
  {
    slug: 'bai-2',
    number: 2,
    chapter: 'Chương 2',
    title: 'Tìm kiếm và đánh giá nguồn thông tin học thuật',
    summary: 'Tìm mười tài liệu về AI hỗ trợ luyện tập piano và dạy âm nhạc, rồi đánh giá độ tin cậy của từng nguồn.',
    goal: 'Biết tìm, chọn lọc và đánh giá độ tin cậy của nguồn học thuật.',
    tools: 'Google Scholar, Google Search, VJOL, các tạp chí giáo dục',
    result: 'Hai bảng tổng hợp và đánh giá 10 tài liệu tham khảo.',
    lead: 3,
    newCopy: ['summary', 'goal', 'result'],
  },
  {
    slug: 'bai-3',
    number: 3,
    chapter: 'Chương 3',
    title: 'Viết prompt hiệu quả cho các tác vụ học tập',
    summary: 'Ba tác vụ học piano, mỗi tác vụ viết prompt ở ba mức cơ bản, cải tiến, nâng cao và so sánh kết quả.',
    // goal: lấy nguyên văn mục "I. Mục tiêu" của bài
    goal: 'Phát triển kỹ năng viết Prompt hiệu quả để tận dụng tối đa khả năng của các mô hình ngôn ngữ lớn',
    tools: 'ChatGPT',
    result: '9 prompt và 9 kết quả, kèm phân tích và mẹo viết prompt.',
    cover: 'bai-3/03-tac-vu-1-nang-cao',
    lead: 2,
    newCopy: ['summary', 'tools', 'result'],
  },
  {
    slug: 'bai-4',
    number: 4,
    chapter: 'Chương 4',
    chapterInferred: true,
    title: 'Tổ chức và tham gia cuộc họp trực tuyến',
    summary: 'Báo cáo cuộc họp nhóm trên Google Meet: kế hoạch, biên bản, phân công, đánh giá thành viên và bài học kinh nghiệm.',
    goal: 'Rèn kỹ năng tổ chức và tham gia một cuộc họp trực tuyến chuyên nghiệp.',
    tools: 'Google Meet, Zalo',
    result: 'Báo cáo nhóm hoàn chỉnh kèm ảnh dẫn chứng cuộc họp.',
    cover: 'bai-4/02-docx-image',
    lead: 2,
    newCopy: ['summary', 'goal', 'result'],
  },
  {
    slug: 'bai-5',
    number: 5,
    chapter: 'Chương 5',
    title: 'Infographic: bí quyết học piano cho người mới',
    summary: 'Dùng ChatGPT lên ý tưởng và Canva Magic Design dựng bố cục cho infographic năm bí quyết học piano.',
    goal: 'Dùng AI hỗ trợ lên ý tưởng và thiết kế một sản phẩm nội dung số.',
    tools: 'ChatGPT, Canva Magic Design',
    result: 'Infographic “Bí quyết học piano hiệu quả cho người mới bắt đầu”.',
    cover: 'bai-5/02-hinh-5-2-infographic',
    lead: 1,
    newCopy: ['title', 'summary', 'goal', 'result'],
  },
  {
    slug: 'bai-6',
    number: 6,
    chapter: 'Chương 6',
    chapterInferred: true,
    title: 'An toàn và liêm chính học thuật trong môi trường số',
    summary: 'Phân tích việc dùng AI trong học đại học, ghi lại quá trình làm bài có AI hỗ trợ và đặt ra tám nguyên tắc cá nhân.',
    goal: 'Sử dụng AI trung thực, minh bạch và có trách nhiệm trong học tập.',
    tools: 'ChatGPT (OpenAI)',
    result: 'Bài phân tích, bộ 8 nguyên tắc cá nhân và nội dung infographic.',
    lead: 1,
    newCopy: ['summary', 'goal', 'result'],
  },
]

export function getLesson(slug: LessonSlug): LessonMeta {
  const l = LESSONS.find((x) => x.slug === slug)
  if (!l) throw new Error(`Unknown lesson: ${slug}`)
  return l
}

/** The scraper added the Google Sites page title ("Bài 1") as an h1; the layout shows that itself. */
function withoutPageTitle(slug: LessonSlug): Block[] {
  const blocks = getBlocks(slug)
  const first = blocks[0]
  if (first?.type === 'heading' && first.level === 1 && /^Bài \d$/.test(inlineText(first.c).trim())) {
    return blocks.slice(1)
  }
  return blocks
}

/** Source blocks shown in the lesson header (chapter line, title). */
export function lessonLead(slug: LessonSlug): Block[] {
  return withoutPageTitle(slug).slice(0, getLesson(slug).lead)
}

/** Everything after the header. */
export function lessonBody(slug: LessonSlug): Block[] {
  return withoutPageTitle(slug).slice(getLesson(slug).lead)
}
