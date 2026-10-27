# Website Bất Động Sản (website-bds)

Trang portal giới thiệu dự án bất động sản: tìm kiếm / lọc dự án theo tên, chủ đầu tư, khu vực, loại hình, trạng thái; hiển thị dự án nổi bật (HOT) và tin tức mới nhất. Giao diện responsive theo thiết kế Figma (desktop / tablet / mobile).

## Công nghệ sử dụng

| Hạng mục | Công nghệ |
| --- | --- |
| Ngôn ngữ | TypeScript 6 |
| UI framework | React 19 |
| Thư viện giao diện | MUI (Material UI) 9 + `@mui/icons-material`, styling bằng Emotion |
| Build tool / dev server | Vite 8 (`@vitejs/plugin-react`) |
| Routing | React Router 7 (`react-router-dom`) |
| Gọi API | Axios (gắn Bearer token, tự thử lại GET khi lỗi mạng / 5xx, xoá token khi 401) |
| Lọc HTML | DOMPurify (nội dung từ trình soạn thảo của admin) |

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

### Các API đang dùng

**Trang chủ (`/`)**

| Endpoint | Module | Dùng cho |
| --- | --- | --- |
| `GET /portal/projects/search` | `projectApi.search` | Danh sách dự án (lọc + phân trang, 12 dự án/trang) |
| | `projectApi.getHotProjects` | Dự án HOT (`isHot=true`, `pageSize=100`) |
| `GET /portal/news/search` | `newsApi.search` | 4 tin tức mới nhất |
| `GET /portal/investor/list` | `investorApi.getList` | Ô chọn chủ đầu tư |
| `GET /master-data/list` | `masterDataApi.getByGroup` | Ô chọn khu vực / loại hình / trạng thái (`groupCode`: `PROJECT_REGION`, `PROJECT_TYPE`, `PROJECT_STATUS`) |

Mỗi lần tải trang chủ gửi 7 request (`/master-data/list` gọi 3 lần, `/portal/projects/search` gọi 2 lần). Phân trang backend đếm từ 0, UI đếm từ 1 (`projectApi` tự quy đổi). Sắp xếp mặc định: `createdAt:desc`.

**Trang chi tiết dự án (`/du-an/:slugId/:tab?`)**

| Endpoint | Module | Dùng cho |
| --- | --- | --- |
| `GET /portal/projects/detail?id=` | `projectApi.getDetail` | Thông tin dự án (không tồn tại → HTTP 404, hiện "Không tìm thấy dự án") |
| `GET /portal/contents/get` | `contentApi.getProjectContent` | Nội dung từng tab (`refType=PROJECT`, `contentType`: `OVERVIEW` / `LOCATION` / `POLICY`); chưa nhập nội dung → `data: null` |

Ở chế độ dev, `HomePage` log response ra console với tiền tố `[API]`.

## Cấu trúc thư mục

```
bds/
├── README.md
└── website-bds/
    ├── index.html                  # HTML gốc, mount React vào #root
    ├── vite.config.ts              # Cấu hình Vite + proxy /api về backend UAT
    ├── tsconfig.json               # Cấu hình TypeScript
    ├── package.json
    ├── .env                        # Biến môi trường (VITE_API_URL)
    │
    ├── public/
    │   └── images/                 # Ảnh tĩnh, phục vụ trực tiếp theo /images/...
    │       ├── logo.svg
    │       ├── logo_2.svg
    │       └── hero-banner.svg
    │
    └── src/
        ├── main.tsx                # Điểm vào: ThemeProvider (MUI) + CssBaseline + App
        ├── App.tsx                 # Router + bố cục chung: Header → <Routes> → Footer
        ├── theme.ts                # MUI theme, breakpoint, bảng màu thương hiệu (brand) từ Figma
        ├── vite-env.d.ts           # Khai báo kiểu cho import.meta.env
        │
        ├── api/                    # Tầng gọi API
        │   ├── axiosClient.ts      #   Axios instance: baseURL, timeout 10s, token, retry, xử lý 401
        │   ├── helpers.ts          #   cleanParams, unwrap, toList, normalizePaged (chuẩn hoá response)
        │   ├── projectApi.ts       #   Dự án, dự án HOT, chi tiết — /portal/projects/search, /detail
        │   ├── contentApi.ts       #   Nội dung dự án theo tab    — /portal/contents/get
        │   ├── newsApi.ts          #   Tin tức                    — /portal/news/search
        │   ├── investorApi.ts      #   Chủ đầu tư                 — /portal/investor/list
        │   └── masterDataApi.ts    #   Danh mục                   — /master-data/list
        │
        ├── pages/                  # Mỗi file ứng với một route
        │   ├── HomePage.tsx        #   "/" — danh sách dự án, dự án HOT, tin tức, phân trang
        │   └── ProjectDetailPage.tsx   # "/du-an/:slugId/:tab?" — chi tiết dự án + thanh tab
        │
        ├── partials/               # Các khối bố cục lớn của trang
        │   ├── Header.tsx
        │   ├── Hero.tsx            #   Banner đầu trang chủ, chứa SearchBar
        │   ├── SearchBar.tsx       #   Ô tìm kiếm + bộ lọc (tải dữ liệu cho các ô chọn)
        │   └── Footer.tsx
        │
        ├── components/             # Component tái sử dụng
        │   ├── ProjectCard.tsx     #   Thẻ dự án
        │   ├── HotProjectItem.tsx  #   Mục dự án nổi bật
        │   ├── NewsCard.tsx        #   Thẻ tin tức
        │   ├── ProjectLocation.tsx #   Nội dung tab "Vị trí" (ảnh bản đồ, mô tả, Google Maps)
        │   ├── CoverImage.tsx      #   Ảnh bìa, hiện logo thay thế khi không có ảnh / ảnh lỗi
        │   ├── FilterFields.tsx    #   Các ô chọn bộ lọc dùng trong SearchBar
        │   ├── Pagination.tsx      #   Phân trang
        │   └── Toast.tsx           #   ToastProvider + hook useToast (MUI Snackbar)
        │
        ├── hooks/                  # Custom hook
        │   └── useCopyLink.ts      #   Sao chép link dự án vào clipboard + hiện toast
        │
        ├── types/                  # Kiểu dữ liệu TypeScript
        │   ├── api.ts              #   Paged<T>
        │   ├── project.ts          #   Project, ProjectDetail, ProjectSearchParams
        │   ├── content.ts          #   Content, ContentType, FileInfo
        │   ├── news.ts             #   News
        │   └── masterData.ts       #   Investor, MasterDataItem
        │
        ├── utils/                  # Hàm tiện ích
        │   ├── constants.ts        #   PAGE_SIZE, SORT_NEWEST, STATUS, GROUP_CODE
        │   ├── format.ts           #   escapeHtml, formatDate (dd/mm/yyyy)
        │   ├── slug.ts             #   slugify tiếng Việt, projectDetailUrl, parseProjectId
        │   ├── locationHtml.ts     #   Tách / lọc HTML tab Vị trí (DOMPurify), kiểm tra link Google Maps
        │   └── dom.ts              #   Helper querySelector (qs)
        │
        └── assets/                 # Ảnh/icon import trong code (bundle qua Vite)
            ├── hero.png
            └── icons/
                └── hot.svg
```

## Luồng dữ liệu

### Routing

`App.tsx` bọc toàn bộ ứng dụng trong `BrowserRouter` + `ToastProvider`, `Header` và `Footer` dùng chung cho mọi trang:

| Route | Nội dung |
| --- | --- |
| `/` | `Home`: `Hero` (chứa `SearchBar`) + `HomePage` |
| `/du-an/:slugId/:tab?` | `ProjectDetailPage` |
| `*` | Thông báo "Không tìm thấy trang" |

URL chi tiết có dạng `/du-an/{slug}-{id}/{tab}`, ví dụ `/du-an/vinhomes-ocean-park-65/vi-tri` (tạo bằng `projectDetailUrl`, lấy id bằng `parseProjectId` trong `utils/slug.ts`).

> Khi deploy, server cần trả `index.html` cho mọi đường dẫn (SPA fallback) để vào thẳng `/du-an/...` không bị 404.

### Trang chủ

1. `Home` (trong `App.tsx`) giữ state `filters` dùng chung giữa `SearchBar` (trong Hero) và `HomePage`.
2. `SearchBar` lấy danh sách chủ đầu tư và danh mục qua `investorApi` / `masterDataApi` để đổ vào các ô chọn.
3. Khi bộ lọc thay đổi, `HomePage` quay về trang 1 và gọi `projectApi.search(...)` để lấy danh sách dự án có phân trang. Dự án HOT và tin tức được tải một lần khi vào trang.
4. Nút "Chia sẻ" trên thẻ dự án dùng `useCopyLink` để sao chép link chi tiết vào clipboard và hiện toast.

### Trang chi tiết dự án

1. `ProjectDetailPage` lấy `id` từ `slugId` rồi gọi `projectApi.getDetail(id)`.
2. Tự sửa URL: thiếu / sai tab → chuyển về `tong-quan`; slug không khớp tên dự án (ví dụ dự án đổi tên) → chuyển sang URL đúng (`replace`, không thêm lịch sử).
3. Thanh tab: Tổng quan (`tong-quan`), Vị trí (`vi-tri`), Phân khu (`phan-khu`), Mặt bằng quỹ căn (`mat-bang-quy-can`), Quỹ căn (`quy-can`), Chính sách bán hàng (`chinh-sach-ban-hang`), Tin tức (`tin-tuc`). Hiện mới làm tab **Vị trí**, các tab khác hiện "đang được cập nhật".
4. Tab Vị trí (`ProjectLocation`) gọi `contentApi.getProjectContent(id, 'LOCATION')`, rồi `utils/locationHtml.ts`:
   - lọc HTML bằng DOMPurify, tách ảnh bản đồ lớn, ảnh cột phải và phần mô tả;
   - chỉ nhận `embedLocation` là link Google Maps (`https://.../maps...`), lấy `src` thay vì chèn nguyên `<iframe>`.

### Tầng API

Các module trong `api/` gọi backend qua `axiosClient`, rồi chuẩn hoá response bằng `helpers.ts` (`unwrap` ném lỗi khi `code` khác `SUCCESS`; ảnh lấy từ `fileInfo.fullLink`, mô tả tin tức từ `shortContent`).

## Responsive

Breakpoint tự định nghĩa trong `theme.ts` (theo Bootstrap): `sm` 576px, `md` 768px, `lg` 992px, `xl` 1200px, `xxl` 1400px.

- Dự án HOT: nằm ở cột phải 280px từ `xl` (≥ 1200px), xếp dưới nội dung ở màn nhỏ hơn, ẩn trên mobile (< 576px).
- Tin tức: lưới 4 cột (`lg`), 2 cột (`sm`); trên mobile chuyển sang vuốt ngang (card rộng 240px).
