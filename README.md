# Website Bất Động Sản (website-bds)

Trang portal giới thiệu dự án bất động sản: tìm kiếm / lọc dự án theo tên, chủ đầu tư, khu vực, loại hình, trạng thái; hiển thị dự án nổi bật (HOT) và tin tức mới nhất. Giao diện responsive theo thiết kế Figma (desktop / tablet / mobile).

## Công nghệ sử dụng

| Hạng mục | Công nghệ |
| --- | --- |
| Ngôn ngữ | TypeScript 6 |
| UI framework | React 19 |
| Thư viện giao diện | MUI (Material UI) 9 + `@mui/icons-material`, styling bằng Emotion |
| Build tool / dev server | Vite 8 (`@vitejs/plugin-react`) |
| Gọi API | Axios (gắn Bearer token, tự thử lại GET khi lỗi mạng / 5xx, xoá token khi 401) |

## Cài đặt & chạy

Yêu cầu: Node.js (khuyến nghị bản LTS mới) và npm.

```bash
cd website-bds
npm install
npm run dev        # chạy dev server (mặc định http://localhost:5173)
```

Các lệnh khác:

```bash
npm run build      # kiểm tra kiểu (tsc) rồi build ra thư mục dist/
npm run typecheck  # chỉ kiểm tra kiểu TypeScript
npm run preview    # chạy thử bản build
```

## Biến môi trường

Khai báo trong `website-bds/.env`:

| Biến | Ý nghĩa | Giá trị hiện tại |
| --- | --- | --- |
| `VITE_API_URL` | Base URL của backend API | `/api` |

## Kết nối backend

Backend (môi trường UAT): `https://api-uat.vinhomes.biz.vn/hovixi/api/v1`.

- **Khi chạy dev**: `vite.config.ts` cấu hình proxy để tránh lỗi CORS:
  `/api/...` → `https://api-uat.vinhomes.biz.vn/hovixi/api/v1/...`
- **Khi deploy**: proxy của Vite không còn tác dụng. Cần cấu hình reverse proxy (Nginx…) trỏ `/api` về backend, hoặc đặt `VITE_API_URL` bằng URL đầy đủ của backend trước khi `npm run build` (backend phải cho phép CORS).

### Các API đang dùng (trang chủ)

| Endpoint | Module | Dùng cho |
| --- | --- | --- |
| `GET /portal/projects/search` | `projectApi.search` | Danh sách dự án (lọc + phân trang, 12 dự án/trang) |
| | `projectApi.getHotProjects` | Dự án HOT (`isHot=true`, `pageSize=100`) |
| `GET /portal/news/search` | `newsApi.search` | 4 tin tức mới nhất |
| `GET /portal/investor/list` | `investorApi.getList` | Ô chọn chủ đầu tư |
| `GET /master-data/list` | `masterDataApi.getByGroup` | Ô chọn khu vực / loại hình / trạng thái (`groupCode`: `PROJECT_REGION`, `PROJECT_TYPE`, `PROJECT_STATUS`) |

Mỗi lần tải trang chủ gửi 7 request (`/master-data/list` gọi 3 lần, `/portal/projects/search` gọi 2 lần). Phân trang backend đếm từ 0, UI đếm từ 1 (`projectApi` tự quy đổi). Sắp xếp mặc định: `createdAt:desc`.

Ở chế độ dev, `HomePage` log response ra console với tiền tố `[API]`.

## Cấu trúc thư mục

```
bds/
└── website-bds/
    ├── index.html              # HTML gốc, mount React vào #root
    ├── vite.config.ts          # Cấu hình Vite + proxy /api về backend UAT
    ├── tsconfig.json           # Cấu hình TypeScript
    ├── package.json
    ├── .env                    # Biến môi trường (VITE_API_URL)
    ├── public/
    │   └── images/             # Ảnh tĩnh: logo, hero banner (phục vụ trực tiếp theo /images/...)
    └── src/
        ├── main.tsx            # Điểm vào: ThemeProvider (MUI) + CssBaseline + App
        ├── App.tsx             # Bố cục trang: Header → Hero (SearchBar) → HomePage → Footer
        ├── theme.ts            # MUI theme + bảng màu thương hiệu (brand) lấy từ Figma
        ├── vite-env.d.ts       # Khai báo kiểu cho import.meta.env
        │
        ├── api/                # Tầng gọi API
        │   ├── axiosClient.ts  #   Axios instance: baseURL, timeout 10s, token, retry, xử lý 401
        │   ├── helpers.ts      #   cleanParams, toList, normalizePaged (chuẩn hoá response)
        │   ├── projectApi.ts   #   Dự án, dự án HOT — GET /portal/projects/search
        │   ├── newsApi.ts      #   Tin tức          — GET /portal/news/search
        │   ├── investorApi.ts  #   Chủ đầu tư       — GET /portal/investor/list
        │   └── masterDataApi.ts#   Danh mục         — GET /master-data/list
        │
        ├── pages/
        │   └── HomePage.tsx    # Trang chủ: danh sách dự án, dự án HOT, tin tức, phân trang
        │
        ├── partials/           # Các phần bố cục lớn của trang
        │   ├── Header.tsx
        │   ├── Hero.tsx        #   Banner đầu trang, chứa SearchBar
        │   ├── SearchBar.tsx   #   Ô tìm kiếm + các bộ lọc (tải dữ liệu cho ô chọn)
        │   └── Footer.tsx
        │
        ├── components/         # Component tái sử dụng
        │   ├── ProjectCard.tsx     # Thẻ dự án
        │   ├── HotProjectItem.tsx  # Mục dự án nổi bật
        │   ├── NewsCard.tsx        # Thẻ tin tức
        │   ├── CoverImage.tsx      # Ảnh bìa, hiển thị logo thay thế khi không có ảnh / ảnh lỗi
        │   ├── FilterFields.tsx    # Các ô chọn bộ lọc dùng trong SearchBar
        │   ├── Pagination.tsx      # Phân trang
        │   └── Toast.tsx           # ToastProvider + hook useToast (MUI Snackbar)
        │
        ├── types/              # Kiểu dữ liệu TypeScript
        │   ├── api.ts          #   Paged<T>
        │   ├── project.ts      #   Project, ProjectSearchParams
        │   ├── news.ts         #   News
        │   └── masterData.ts   #   Investor, MasterDataItem
        │
        ├── utils/              # Hàm tiện ích
        │   ├── constants.ts    #   PAGE_SIZE, SORT_NEWEST, STATUS, GROUP_CODE
        │   ├── format.ts       #   escapeHtml, formatDate (dd/mm/yyyy)
        │   ├── slug.ts         #   slugify tiếng Việt, URL chi tiết dự án
        │   └── dom.ts          #   Helper querySelector
        │
        └── assets/             # Ảnh/icon được import trong code (bundle qua Vite)
```

## Luồng dữ liệu

1. `App.tsx` giữ state `filters` dùng chung giữa `SearchBar` (trong Hero) và `HomePage`.
2. `SearchBar` lấy danh sách chủ đầu tư và danh mục qua `investorApi` / `masterDataApi` để đổ vào các ô chọn.
3. Khi bộ lọc thay đổi, `HomePage` quay về trang 1 và gọi `projectApi.search(...)` để lấy danh sách dự án có phân trang. Dự án HOT và tin tức được tải một lần khi vào trang.
4. Các module trong `api/` gọi backend qua `axiosClient`, rồi chuẩn hoá response bằng `helpers.ts` (ví dụ ảnh lấy từ `fileInfo.fullLink`, mô tả tin tức từ `shortContent`).

## Responsive

Breakpoint tự định nghĩa trong `theme.ts` (theo Bootstrap): `sm` 576px, `md` 768px, `lg` 992px, `xl` 1200px, `xxl` 1400px.

- Dự án HOT: nằm ở cột phải 280px từ `xl` (≥ 1200px), xếp dưới nội dung ở màn nhỏ hơn, ẩn trên mobile (< 576px).
- Tin tức: lưới 4 cột (`lg`), 2 cột (`sm`); trên mobile chuyển sang vuốt ngang (card rộng 240px).
