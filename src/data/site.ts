export const SITE = {
  name: 'Vương Thị Hà Vi',
  shortName: 'Hà Vi',
  studentId: '2552210219',
  major: 'Sư phạm Âm nhạc',
  school: 'Trường Đại học Sư phạm Nghệ thuật Trung ương',
  course: 'Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo',
  lecturer: 'Vũ Việt Hoàng',
  /** Điền tên lớp vào đây; để trống thì dòng "Lớp" được ẩn. */
  className: '',
  /** Ảnh dùng cho chia sẻ mạng xã hội (khóa ảnh trong src/assets/img). */
  ogImage: 'gioi-thieu/01-banner',

  // VIẾT MỚI — chưa có trên site gốc, cần Hà Vi duyệt.
  portfolioGoals: [
    {
      title: 'Lưu giữ hành trình học tập',
      text: 'Tập hợp sáu bài tập của học phần ở một nơi, theo đúng thứ tự đã làm, để tôi nhìn lại mình đã tiến bộ thế nào qua từng chương.',
    },
    {
      title: 'Cho thấy năng lực số gắn với âm nhạc',
      text: 'Ghi lại cách tôi dùng công cụ số và AI cho việc học piano, tìm tài liệu và thiết kế học liệu âm nhạc.',
    },
    {
      title: 'Làm hành trang cho nghề dạy nhạc',
      text: 'Dùng làm hồ sơ giới thiệu bản thân khi thực tập, xin việc, và tiếp tục bổ sung sản phẩm mới trong những năm học sau.',
    },
  ],
} as const
