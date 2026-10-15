import type { News } from "../types/news";

export const news: News[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: "The Privé - Biểu tượng sống ven sông tại Quận 2, một chuẩn sống mới dành cho giới thượng lưu",
  thumbnail: `https://picsum.photos/seed/news${i + 1}/640/400`,
  shortDescription:
    "Tọa lạc bên bờ Sài Gòn, The Privé Quận 2 được kiến tạo như một biểu tượng sống ven sông với không gian riêng tư, tiện ích đẳng cấp và tầm nhìn trọn vẹn ra dòng sông.",
  createdAt: new Date(Date.now() - (8 - i) * 86400000).toISOString(),
}));