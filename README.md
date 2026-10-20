# Website Bất Động Sản (website-bds)

Website giới thiệu dự án bất động sản: danh sách dự án có tìm kiếm và bộ lọc, dự án HOT, tin tức.
Dữ liệu lấy từ API thật (Swagger, môi trường UAT). Giao diện dựng theo Figma "Website BĐS",
có bản desktop (frame 1440px) và mobile (frame iPhone 16, 393px).

## Công nghệ

| Hạng mục | Dùng gì |
|---|---|
| Build / dev server | [Vite](https://vite.dev) 8 |
| Ngôn ngữ | TypeScript 6 (strict theo `tsconfig.json`, chỉ type-check, Vite lo build) |
| UI | Bootstrap 5.3 (SCSS + JS: offcanvas, toast), Bootstrap Icons |
| Style | SCSS (Sass), biến Bootstrap ghi đè trong `_variables.scss` |
| HTML | Trang `.html` tĩnh + [vite-plugin-handlebars](https://github.com/alexlafroscia/vite-plugin-handlebars) cho partial |
| Gọi API | Axios (interceptor: token, retry khi lỗi mạng / 5xx / timeout) |
| Font | Inter (Google Fonts) |

Không dùng React hay framework UI khác: DOM được render bằng template string trong TypeScript.

## Chạy dự án

Yêu cầu: Node.js 20 trở lên (đã chạy với Node 24).

```bash
cd website-bds
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check (tsc) rồi build ra website-bds/dist
npm run preview   # xem bản build
```

> Mọi lệnh `npm` chạy **trong thư mục `website-bds/`**, không chạy ở thư mục gốc repo.
> Cài package ở thư mục gốc sẽ khiến Vite báo lỗi "outside of Vite serving allow list"
> (ví dụ với font của bootstrap-icons).

## Cấu hình API

File `website-bds/.env`:

```env
VITE_API_URL=/api
```

Khi chạy dev, Vite proxy `/api` sang backend để tránh CORS (xem `vite.config.ts`):

```
/api/*  →  https://api-uat.vinhomes.biz.vn/hovixi/api/v1/*
```

Sửa `.env` thì phải khởi động lại `npm run dev`. Khi deploy, cần cấu hình reverse proxy `/api`
tương tự trên server, hoặc đặt `VITE_API_URL` thành URL đầy đủ của backend (backend phải cho phép CORS).

### Endpoint đang dùng

| Endpoint | File | Dùng cho |
|---|---|---|
| `GET /portal/projects/search` | `api/projectApi.ts` | Danh sách dự án (phân trang, lọc), dự án HOT (`isHot=true`) |
| `GET /portal/news/search` | `api/newsApi.ts` | 4 tin tức mới nhất |
| `GET /portal/investor/list` | `api/investorApi.ts` | Dropdown "Chủ đầu tư" |
| `GET /master-data/list?groupCode=...` | `api/masterDataApi.ts` | Dropdown khu vực / loại hình / trạng thái (`PROJECT_REGION`, `PROJECT_TYPE`, `PROJECT_STATUS`) |

Quy ước với backend:
- Phân trang: UI đếm trang từ 1, backend đếm từ 0 (`pageNumber = page - 1`).
- Param rỗng (option "Tất cả…") không được gửi lên (`cleanParams`).
- Backend trả HTTP 200 nhưng `code !== "SUCCESS"` được coi là lỗi (`ApiError` trong `api/helpers.ts`).
- Dữ liệu thô (`Raw*` trong `types/api.ts`) được chuyển sang kiểu dùng ở UI qua `api/mappers.ts`.

## Cấu trúc thư mục

```
bds/
└── website-bds/
    ├── index.html              # Trang chủ: header, hero + tìm kiếm, danh sách dự án, dự án HOT, tin tức, footer
    ├── vite.config.ts          # Plugin handlebars, cấu hình SCSS, proxy /api
    ├── tsconfig.json
    ├── .env                    # VITE_API_URL
    ├── public/
    │   └── images/             # logo.svg, hero-banner.svg (phục vụ nguyên trạng tại /images/...)
    └── src/
        ├── main.ts             # Điểm vào: import SCSS + Bootstrap, nạp dữ liệu, gắn sự kiện
        ├── api/
        │   ├── axiosClient.ts  # Axios instance: baseURL, timeout, token, retry
        │   ├── helpers.ts      # ApiError, cleanParams, normalizePaged, toList
        │   ├── mappers.ts      # Raw API -> kiểu dùng ở UI
        │   └── *Api.ts         # Mỗi file một nhóm endpoint (project, news, investor, masterData)
        ├── components/         # Hàm trả về chuỗi HTML: projectCard, newsCard, pagination, thumb...
        ├── partials/           # Partial handlebars (header, footer, search-bar)
        ├── pages/              # Script riêng theo trang
        ├── scss/
        │   ├── _variables.scss # Ghi đè biến Bootstrap (màu, font, container)
        │   ├── _base.scss      # Layout chung của trang
        │   ├── main.scss       # Thứ tự import: variables -> bootstrap -> base -> components
        │   └── components/     # Mỗi khối giao diện một file: header, hero, project-card, sidebar, news-card, footer
        ├── types/              # Kiểu dữ liệu: api (raw), project, news, masterData
        ├── utils/              # constants, format (escapeHtml, formatDate), slug, toast, mobileMenu, debounce, dom
        └── assets/             # Icon, ảnh được import qua bundler
```

## Luồng chạy trang chủ

`main.ts`, khi `DOMContentLoaded`:

1. Gắn sự kiện: chia sẻ dự án (copy link), bộ lọc, nút "Thử lại", menu mobile.
2. Nạp dữ liệu bộ lọc (chủ đầu tư + 3 nhóm master data), lỗi thì hiện toast có nút "Thử lại".
3. Nạp danh sách dự án, dự án HOT và tin tức song song; mỗi khối có trạng thái
   đang tải (skeleton) / lỗi / rỗng riêng.

Tìm kiếm và lọc:
- Ô tìm kiếm chỉ gọi API khi nhấn Enter.
- Đổi dropdown thì áp dụng ngay (kèm từ khóa đang có), luôn quay về trang 1.
- Request danh sách cũ bị hủy (`AbortController`) khi có request mới.

## Responsive

Mốc theo Bootstrap: mobile `< 768px` (`md`), tablet `768–991px`, desktop `>= 992px`.

| Khối | Mobile (< 768px) | Desktop |
|---|---|---|
| Header | Logo + "100 người đang Online" + nút hamburger | Logo, menu giữa, Đăng ký / Đăng nhập bên phải |
| Menu | Offcanvas mở từ dưới lên (`#mobileMenu`), mục đang chọn theo URL, tự đóng khi màn hình >= 768px | Menu ngang |
| Hero | Banner 4:5, khung tìm kiếm nằm dưới banner | Banner 500px, khung tìm kiếm đè lên banner |
| Bộ lọc | Ẩn, bấm nút phễu để mở lưới 2x2 | Luôn hiện 4 dropdown cùng hàng |

Khi sửa giao diện mobile, giữ nguyên desktop: viết style trong `@media (max-width: 767.98px)`
hoặc dùng class `d-md-*` của Bootstrap. Các class / id mà `main.ts` dùng
(`.hero-search-box`, `.search-field select`, `.search-field-name input`, `#project-list-container`,
`#project-pagination`, `#hot-projects-container`, `#news-list-container`, `#mobileMenu`)
không được đổi tên.

## Quy ước code

- Chuỗi từ API luôn qua `escapeHtml` trước khi chèn vào HTML.
- Ảnh lỗi / thiếu dùng `thumb()` + `bindThumbFallback()` để hiện ảnh thay thế.
- Thông báo dùng `showToast()` (Bootstrap Toast), không dùng `alert`.
- Comment viết tiếng Việt, ngắn, giải thích lý do.

## Hiện trạng / việc còn dở

- Mới có trang chủ (`index.html`). Link chi tiết dự án (`/project-detail.html?id=...&slug=...`)
  và các trang `/gioi-thieu`, `/tin-tuc`, `/dang-ky`, `/dang-nhap` chưa có trang tương ứng.
- Header đang viết thẳng trong `index.html`; `src/partials/*.html` và `src/pages/home.ts`
  chưa được trang nào dùng. Khi thêm trang mới nên chuyển header/footer sang partial
  (`{{> header}}`) để không phải sửa nhiều chỗ.
- Số "100 người đang Online" đang ghi cứng, chưa có API.
- Mục "DỰ ÁN" trên menu desktop đang gắn `active` cứng trong HTML (menu mobile thì tính theo URL).
