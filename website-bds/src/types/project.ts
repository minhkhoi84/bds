// Khớp với dữ liệu mà src/api/projectApi.ts đang dùng
export interface Project {
  id: number | string;
  name: string;
  address: string;
  shortDescription: string;
  thumbnail: string;
  investorId: number | string;
  regionCode: string;
  typeCode: string; // HIGH_RISE | LOW_RISE
  typeName: string;
  statusCode: string; // OPEN | COMING_SOON | HANDED_OVER
  isHot?: boolean;
  createdAt: string;
}

export interface ProjectSearchParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  name?: string;
  investorId?: number | string;
  regionCode?: string;
  typeCode?: string;
  statusCode?: string;
  isHot?: boolean;
}
