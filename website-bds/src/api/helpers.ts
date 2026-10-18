import type { ApiResponse, Paged } from "../types/api";

// Lỗi nghiệp vụ: backend trả HTTP 200 nhưng code !== "SUCCESS"
export class ApiError extends Error {
  readonly code: string;
  readonly requestId?: string;
  constructor(code: string, message: string, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.requestId = requestId;
  }
}

// Chỉ gửi param có giá trị: bỏ "", null, undefined (option "Tất cả" của dropdown là "")
export function cleanParams<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v != null)
  ) as Partial<T>;
}

// Kiểm tra code rồi trả về nguyên response
export function unwrap<T>(res: ApiResponse<T>): ApiResponse<T> {
  if (res?.code !== "SUCCESS") {
    throw new ApiError(res?.code ?? "UNKNOWN", res?.message || "Lỗi không xác định từ máy chủ", res?.requestId);
  }
  return res;
}

// Danh sách luôn nằm ở field `data`
export function toList<T>(res: ApiResponse<T[]>): T[] {
  const { data } = unwrap(res);
  return Array.isArray(data) ? data : [];
}

// Dựng phân trang từ totalElements/totalPages, không dùng res.pageSize (là số phần tử thực tế của trang).
// Không có kết quả backend trả totalPages = 0 -> ép về 1 để UI phân trang không vỡ.
export function normalizePaged<R, T>(res: ApiResponse<R[]>, map: (raw: R) => T): Paged<T> {
  const items = toList(res).map(map);
  const total = res.totalElements ?? items.length;
  const totalPages = Math.max(1, res.totalPages ?? 0);
  return { items, total, totalPages };
}
