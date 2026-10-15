// Loại dự án: Cao Tầng | Thấp Tầng
export type ProjectCategory = 'high-rise' | 'low-rise';

export interface Project {
  id: string | number;
  title: string;
  location: string;
  description: string;
  thumbnail: string;
  type: ProjectCategory;
  typeName: string;
  isHot?: boolean;
  isUpcoming?: boolean; // Sắp mở bán
}

export interface HotProject {
  id: string | number;
  title: string;
  location: string;
  thumbnail: string;
}
