# Website Bất Động Sản (website-bds)

Trang portal giới thiệu dự án bất động sản: tìm kiếm / lọc dự án theo tên, chủ đầu tư, khu vực, loại hình, trạng thái; hiển thị dự án nổi bật (HOT) và tin tức mới nhất.

## Công nghệ sử dụng

| Hạng mục | Công nghệ |
| --- | --- |
| Ngôn ngữ | TypeScript 6 |
| UI framework | React 19 |
| Thư viện giao diện | MUI (Material UI) 9 + `@mui/icons-material`, styling bằng Emotion |
| Build tool / dev server | Vite 8 (`@vitejs/plugin-react`) |
| Gọi API | Axios (interceptor gắn Bearer token, xử lý lỗi 401) |
| Dữ liệu giả lập | Mock API nội bộ (`src/mock`), bật/tắt bằng biến môi trường |

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

| Biến | Ý nghĩa | Mặc định |
| --- | --- | --- |
| `VITE_API_URL` | Base URL của backend API | `/api` |
| `VITE_USE_MOCK` | `true` = dùng dữ liệu mock trong `src/mock`, `false` = gọi backend thật | `true` |

> Lưu ý: khi dùng `VITE_API_URL=/api` với backend thật, cần cấu hình proxy trong `vite.config.ts` (hoặc reverse proxy) trỏ `/api` về server backend.

## Cấu trúc thư mục

```
bds/
└── website-bds/
    ├── index.html              # HTML gốc, mount React vào #root
    ├── vite.config.ts          # Cấu hình Vite
    ├── tsconfig.json           # Cấu hình TypeScript
    ├── package.json
    ├── .env                    # Biến môi trường (API URL, bật/tắt mock)
    ├── public/
    │   └── images/             # Ảnh tĩnh: logo, hero banner (phục vụ trực tiếp theo /images/...)
    └── src/
        ├── main.tsx            # Điểm vào: ThemeProvider (MUI) + CssBaseline + App
        ├── App.tsx             # Bố cục trang: Header → Hero (SearchBar) → HomePage → Footer
        ├── theme.ts            # MUI theme + bảng màu thương hiệu (brand) lấy từ Figma
        ├── vite-env.d.ts       # Khai báo kiểu cho import.meta.env
        │
        ├── api/                # Tầng gọi API
        │   ├── axiosClient.ts  #   Axios instance: baseURL, timeout, token, xử lý 401
        │   ├── helpers.ts      #   cleanParams, toList, normalizePaged (chuẩn hoá response)
        │   ├── projectApi.ts   #   Tìm kiếm dự án    — POST /portal/projects/search
        │   ├── newsApi.ts      #   Tin tức           — POST /portal/news/search
        │   ├── investorApi.ts  #   Chủ đầu tư        — POST /portal/investor/list
        │   └── masterDataApi.ts#   Danh mục (khu vực, loại hình, trạng thái) — POST /master-data/list
        │
        ├── mock/               # Dữ liệu & API giả lập (dùng khi VITE_USE_MOCK=true)
        │   ├── mockApi.ts      #   Lọc, sắp xếp, phân trang giống backend
        │   ├── projects.ts     #   Dự án, chủ đầu tư, danh mục
        │   └── news.ts         #   Tin tức
        │
        ├── pages/
        │   └── HomePage.tsx    # Trang chủ: danh sách dự án, dự án HOT, tin tức, phân trang
        │
        ├── partials/           # Các phần bố cục lớn của trang
        │   ├── Header.tsx
        │   ├── Hero.tsx        #   Banner đầu trang, chứa SearchBar
        │   ├── SearchBar.tsx   #   Ô tìm kiếm + các bộ lọc
        │   └── Footer.tsx
        │
        ├── components/         # Component tái sử dụng
        │   ├── ProjectCard.tsx     # Thẻ dự án
        │   ├── HotProjectItem.tsx  # Mục dự án nổi bật
        │   ├── NewsCard.tsx        # Thẻ tin tức
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
        │   ├── constants.ts    #   PAGE_SIZE, SORT_NEWEST, USE_MOCK, GROUP_CODE...
        │   ├── format.ts       #   escapeHtml, formatDate (dd/mm/yyyy)
        │   ├── slug.ts         #   slugify tiếng Việt, URL chi tiết dự án
        │   └── dom.ts          #   Helper querySelector
        │
        └── assets/             # Ảnh/icon được import trong code (bundle qua Vite)
```

## Luồng dữ liệu

1. `App.tsx` giữ state `filters` dùng chung giữa `SearchBar` (trong Hero) và `HomePage`.
2. `SearchBar` lấy danh sách chủ đầu tư và danh mục qua `investorApi` / `masterDataApi` để đổ vào các ô chọn.
3. Khi bộ lọc thay đổi, `HomePage` gọi `projectApi.search(...)` để lấy danh sách dự án có phân trang; đồng thời tải dự án HOT và tin tức qua `newsApi`.
4. Mỗi module trong `api/` kiểm tra `USE_MOCK`: nếu `true` trả dữ liệu từ `mock/mockApi.ts`, ngược lại gọi backend qua `axiosClient` rồi chuẩn hoá response bằng `helpers.ts`.
