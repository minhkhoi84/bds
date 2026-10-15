import type { Paged } from "../types/api";

// Bỏ tham số rỗng để không gửi investorId: "" lên server
export function cleanParams<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v != null)
  ) as Partial<T>;
}

// Response của backend chưa biết trước nên để any, chỉnh lại khi có Swagger
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrap = (res: any) => res?.data ?? res;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toList<T>(res: any): T[] {
  const d = unwrap(res);
  return Array.isArray(d) ? d : d?.items ?? d?.content ?? d?.records ?? [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizePaged<T>(res: any, pageSize: number): Paged<T> {
  const d = unwrap(res);
  const items = toList<T>(res);
  const total: number = d?.total ?? d?.totalItems ?? d?.totalElements ?? items.length;
  const totalPages: number = d?.totalPages ?? Math.max(1, Math.ceil(total / pageSize));
  return { items, total, totalPages };
}