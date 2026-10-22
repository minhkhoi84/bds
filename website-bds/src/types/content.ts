// GET /portal/contents/get (ContentResponse trên Swagger).
// contentType chỉ nhận 3 giá trị dưới: DETAIL có trên Swagger nhưng backend trả VALIDATION_FAILED
export type ContentType = "OVERVIEW" | "LOCATION" | "POLICY";

export interface ContentFile {
  id: number;
  originalName?: string | null;
  contentType?: string | null; // MIME, VD image/jpeg
  fullLink?: string | null;
}

export interface Content {
  id: number;
  refId: number;
  refType: string;
  contentType: ContentType;
  content: string | null; // HTML từ trình soạn thảo
  embedLocation: string | null; // chuỗi <iframe> Google Maps
  fileInfoList: ContentFile[] | null; // gồm cả ảnh đã chèn trong content
}
