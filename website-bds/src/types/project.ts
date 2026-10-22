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

// Tham số tìm kiếm phía UI: page đếm từ 1, projectApi tự đổi sang pageNumber đếm từ 0
export interface ProjectSearchParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  name?: string;
  investorId?: string | number;
  regionCode?: string;
  typeCode?: string;
  statusCode?: string;
  isHot?: boolean;
}

export interface HotProject {
  id: string | number;
  title: string;
  location: string;
  thumbnail: string;
}

// GET /portal/projects/detail (map từ RawProject trong api/mappers.ts)
export interface ProjectDetail {
  id: number;
  name: string;
  address: string;
  shortDescription: string;
  thumbnail: string; // ảnh banner, rỗng nếu backend không có ảnh
}
