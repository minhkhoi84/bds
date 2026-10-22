// GET /portal/contents/get (ContentResponse trên Swagger)
export type ContentType = "OVERVIEW" | "LOCATION" | "POLICY";

export interface FileInfo {
  id: number;
  originalName: string;
  contentType: string; // MIME, ví dụ image/jpeg
  fullLink: string;
}

export interface Content {
  id: number;
  refId: number;
  refType: string;
  contentType: ContentType;
  content: string | null; // HTML từ trình soạn thảo
  embedLocation: string | null; // chuỗi <iframe> Google Maps
  fileInfoList: FileInfo[] | null;
}
