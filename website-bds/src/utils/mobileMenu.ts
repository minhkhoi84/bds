import { Offcanvas } from 'bootstrap';

// Mục menu tương ứng với URL: trang chủ, danh sách và chi tiết dự án đều tính là "DỰ ÁN"
function currentNav(pathname: string): string {
  if (pathname.startsWith('/gioi-thieu')) return 'gioi-thieu';
  if (pathname.startsWith('/tin-tuc')) return 'tin-tuc';
  return 'du-an';
}

export function initMobileMenu(): void {
  const menu = document.querySelector<HTMLElement>('#mobileMenu');
  if (!menu) return;

  const active = currentNav(location.pathname);
  menu.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((link) => {
    const isActive = link.dataset.nav === active;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });

  // Màn hình chuyển sang >= 768px khi menu đang mở thì đóng lại (menu chỉ dùng cho mobile)
  const desktop = window.matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', (e) => {
    if (e.matches) Offcanvas.getInstance(menu)?.hide();
  });
}
