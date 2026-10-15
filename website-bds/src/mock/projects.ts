import type { Project } from "../types/project";
import type { Investor, MasterDataItem } from "../types/masterData";

const NAMES = [
  "Vinhomes Grand Park", "Vinhomes Wonder City", "Imperia Ocean City - The Parkland",
  "Masteri Cosmo Central", "Charmora City", "Vinhomes Smart City",
  "Masteri West Heights", "Vinhomes Ocean Park",
];

export const investors: Investor[] = [
  { id: 1, name: "Vinhomes" },
  { id: 2, name: "Masterise Homes" },
  { id: 3, name: "Imperia Group" },
];
export const regions: MasterDataItem[] = [
  { code: "HN", value: "Hà Nội" },
  { code: "HCM", value: "TP. Hồ Chí Minh" },
  { code: "HY", value: "Hưng Yên" },
];
export const types: MasterDataItem[] = [
  { code: "HIGH_RISE", value: "Dự án Cao tầng" },
  { code: "LOW_RISE", value: "Dự án Thấp tầng" },
];
export const statuses: MasterDataItem[] = [
  { code: "OPEN", value: "Đang mở bán" },
  { code: "COMING_SOON", value: "Sắp mở bán" },
  { code: "HANDED_OVER", value: "Đã bàn giao" },
];

const typeNameOf = (code: string) => types.find((t) => t.code === code)?.value ?? "";

// 30 dự án, id càng lớn càng mới
export const projects: Project[] = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1;
  const typeCode = id % 2 ? "HIGH_RISE" : "LOW_RISE";
  return {
    id,
    name: NAMES[i % NAMES.length],
    thumbnail: `https://picsum.photos/seed/bds${id}/640/400`,
    address: "Nguyễn Xiển - Phước Thiện, Long Bình, TP. HCM",
    shortDescription:
      "Vinhomes Grand Park hứa hẹn trở thành điểm đến quốc tế mới với thành phố triệu dân đầu tiên, không gian xanh và tiện ích đồng bộ cho cộng đồng cư dân hiện đại.",
    investorId: (i % 3) + 1,
    regionCode: regions[i % 3].code,
    typeCode,
    typeName: typeNameOf(typeCode),
    statusCode: statuses[i % 3].code,
    isHot: id % 4 === 0,
    createdAt: new Date(Date.now() - (30 - id) * 86400000).toISOString(),
  };
});