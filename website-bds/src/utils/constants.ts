export const PAGE_SIZE = 12;
export const SORT_NEWEST = "createdAt:desc";
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const STATUS = { COMING_SOON: "COMING_SOON" } as const;

export const GROUP_CODE = {
  REGION: "PROJECT_REGION",
  TYPE: "PROJECT_TYPE",
  STATUS: "PROJECT_STATUS",
} as const;

export type GroupCode = (typeof GROUP_CODE)[keyof typeof GROUP_CODE];