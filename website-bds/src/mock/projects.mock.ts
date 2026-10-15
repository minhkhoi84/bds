import type { Project, HotProject } from '../types/project';

type ProjectTemplate = Omit<Project, 'id'>;

// 12 dự án gốc (đủ 1 trang)
const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    title: 'IMPERIA OCEAN CITY - THE PARKLAND',
    location: 'Văn Giang, Hưng Yên',
    description: 'Khu đô thị hiện đại, đáng sống, kiến tạo không gian sống xanh và tiện nghi dành cho cộng đồng cư dân văn minh.',
    thumbnail: '/images/project-1.jpg',
    type: 'high-rise',
    typeName: 'Dự Án Cao Tầng',
    isHot: true,
    isUpcoming: true,
  },
  {
    title: 'VINHOMES GRAND PARK',
    location: 'Nguyễn Xiển - Phước Thiện, Long Bình, TP. Hồ Chí Minh',
    description: 'Vinhomes Grand Park hứa hẹn trở thành điểm đến quốc tế mới "Thành phố triệu điểm đến" đối với du khách trong và ngoài nước.',
    thumbnail: '/images/project-2.jpg',
    type: 'high-rise',
    typeName: 'Dự Án Cao Tầng',
    isUpcoming: true,
  },
  {
    title: 'VINHOMES WONDER CITY',
    location: 'Đan Phượng, Hà Nội',
    description: 'Thành phố của những trải nghiệm thời thượng',
    thumbnail: '/images/project-3.jpg',
    type: 'low-rise',
    typeName: 'Dự Án Thấp Tầng',
  },
  {
    title: 'VINHOMES SMART CITY',
    location: 'Tây Mỗ - Đại Mỗ, Nam Từ Liêm, Hà Nội',
    description: 'Đại đô thị thông minh với hệ sinh thái tiện ích đồng bộ, công viên Nhật Bản rộng lớn và hạ tầng giao thông kết nối thuận tiện.',
    thumbnail: '/images/project-4.jpg',
    type: 'high-rise',
    typeName: 'Dự Án Cao Tầng',
    isHot: true,
  },
  {
    title: 'MASTERI GRAND COAST',
    location: 'Đan Phượng, Hà Nội',
    description: 'Tổ hợp căn hộ cao cấp ven hồ mang phong cách nghỉ dưỡng, tầm nhìn khoáng đạt và chuẩn dịch vụ quản lý quốc tế.',
    thumbnail: '/images/project-5.jpg',
    type: 'high-rise',
    typeName: 'Dự Án Cao Tầng',
    isUpcoming: true,
  },
  {
    title: 'CHARMORA CITY',
    location: 'Văn Giang, Hưng Yên',
    description: 'Khu nhà phố, biệt thự thấp tầng giữa không gian xanh, phù hợp cho gia đình nhiều thế hệ an cư lâu dài.',
    thumbnail: '/images/project-6.jpg',
    type: 'low-rise',
    typeName: 'Dự Án Thấp Tầng',
    isHot: true,
  },
  {
    title: 'MASTERI COSMO CENTRAL',
    location: 'Long Thành, Đồng Nai',
    description: 'Căn hộ cao cấp nằm tại trung tâm đô thị sân bay, đón đầu làn sóng phát triển hạ tầng khu vực phía Đông.',
    thumbnail: '/images/project-7.jpg',
    type: 'high-rise',
    typeName: 'Dự Án Cao Tầng',
  },
  {
    title: 'VINHOMES OCEAN PARK 2',
    location: 'Văn Giang, Hưng Yên',
    description: 'Thành phố biển hồ với quần thể biệt thự, liền kề và shophouse bao quanh biển hồ nước mặn rộng hàng chục hecta.',
    thumbnail: '/images/project-8.jpg',
    type: 'low-rise',
    typeName: 'Dự Án Thấp Tầng',
    isUpcoming: true,
  },
  {
    title: 'THE PRIVÉ QUẬN 2',
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    description: 'Tọa lạc bên bờ sông Sài Gòn, The Privé được định vị là dự án căn hộ cao cấp mang phong cách nghỉ dưỡng giữa lòng đô thị.',
    thumbnail: '/images/project-9.jpg',
    type: 'high-rise',
    typeName: 'Dự Án Cao Tầng',
    isHot: true,
    isUpcoming: true,
  },
  {
    title: 'ECOPARK SWAN LAKE',
    location: 'Văn Giang, Hưng Yên',
    description: 'Biệt thự đảo bên hồ Thiên Nga, không gian sống riêng tư, yên bình với cảnh quan được chăm chút đến từng chi tiết.',
    thumbnail: '/images/project-10.jpg',
    type: 'low-rise',
    typeName: 'Dự Án Thấp Tầng',
  },
  {
    title: 'SUN URBAN CITY',
    location: 'Phủ Lý, Hà Nam',
    description: 'Đô thị nghỉ dưỡng phong cách Nhật Bản với trục cảnh quan trung tâm và chuỗi tiện ích văn hóa - giải trí đa dạng.',
    thumbnail: '/images/project-11.jpg',
    type: 'low-rise',
    typeName: 'Dự Án Thấp Tầng',
    isHot: true,
  },
  {
    title: 'LUMIÈRE EVERGREEN',
    location: 'Tây Mỗ, Nam Từ Liêm, Hà Nội',
    description: 'Căn hộ xanh với thiết kế kiến trúc sinh thái, mỗi tầng đều có vườn treo và hệ thống tiện ích chăm sóc sức khỏe.',
    thumbnail: '/images/project-12.jpg',
    type: 'high-rise',
    typeName: 'Dự Án Cao Tầng',
  },
];

export const PROJECTS_PER_PAGE = 12;
const TOTAL_MOCK_PROJECTS = 240; // 20 trang x 12 mục

// Sinh 240 dự án từ 12 mẫu, mỗi trang xoay vòng thứ tự để các trang trông khác nhau
export const MOCK_PROJECTS: Project[] = Array.from({ length: TOTAL_MOCK_PROJECTS }, (_, index) => {
  const page = Math.floor(index / PROJECTS_PER_PAGE);
  const template = PROJECT_TEMPLATES[(index + page * 5) % PROJECT_TEMPLATES.length];
  return { id: index + 1, ...template };
});

export const MOCK_HOT_PROJECTS: HotProject[] = [
  {
    id: 101,
    title: 'Vinhomes Smart City',
    location: 'Đại Mỗ, Hà Nội',
    thumbnail: '/images/hot-1.jpg',
  },
  {
    id: 102,
    title: 'Masteri Grand Coast',
    location: 'Đan Phượng, Hà Nội',
    thumbnail: '/images/hot-2.jpg',
  },
  {
    id: 103,
    title: 'Masteri Cosmo Central',
    location: 'Long Thành, TP. Hồ Chí Minh',
    thumbnail: '/images/hot-3.jpg',
  },
  {
    id: 104,
    title: 'Charmora City',
    location: 'Văn Giang, Hưng Yên',
    thumbnail: '/images/hot-4.jpg',
  },
  {
    id: 105,
    title: 'Vinhomes Grand Park',
    location: 'Đại Mỗ, Hà Nội',
    thumbnail: '/images/hot-5.jpg',
  },
  {
    id: 106,
    title: 'Masteri Cosmo Central',
    location: 'Long Thành, TP. Hồ Chí Minh',
    thumbnail: '/images/hot-3.jpg',
  },
  {
    id: 107,
    title: 'Charmora City',
    location: 'Văn Giang, Hưng Yên',
    thumbnail: '/images/hot-4.jpg',
  },
  {
    id: 108,
    title: 'Vinhomes Grand Park',
    location: 'Đại Mỗ, Hà Nội',
    thumbnail: '/images/hot-5.jpg',
  },
];
