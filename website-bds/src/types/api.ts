export interface Paged<T> {
  items: T[];
  total: number;
  totalPages: number;
}

// Khung response chung của backend (HTTP 200 cả khi lỗi nghiệp vụ -> xem `code`)
export interface ApiResponse<T> {
  code: string;
  message: string;
  requestId?: string;
  serverTime?: string;
  pageNumber?: number | null;
  pageSize?: number | null; // số phần tử thực tế của trang, KHÔNG phải pageSize đã xin
  totalElements?: number | null;
  totalPages?: number | null;
  data: T;
}

export interface RawFileInfo {
  fullLink?: string | null;
}

// Dữ liệu thô backend trả về, chỉ khai báo các field đang dùng
export interface RawProject {
  id: number;
  code?: string;
  name: string;
  address?: string | null;
  shortDescription?: string | null;
  investorId?: number | null;
  regionCode?: string | null;
  typeCode?: string | null;
  typeName?: string | null;
  statusCode?: string | null;
  statusName?: string | null;
  isHot?: boolean | null;
  fileInfo?: RawFileInfo | null;
}

export interface RawNews {
  id: number;
  title: string;
  shortContent?: string | null;
  createdAt: string;
  fileInfo?: RawFileInfo | null;
}

export interface RawInvestor {
  id: number;
  code?: string;
  name: string;
}

export interface RawMasterData {
  groupCode?: string;
  code: string;
  value: string;
  sortOrder?: number | null;
}
