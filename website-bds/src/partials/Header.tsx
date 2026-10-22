import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { brand } from '../theme';

// match: các tiền tố pathname thuộc mục đó (tô mục đang chọn ở menu mobile)
const NAV_ITEMS = [
  { label: 'Giới thiệu', href: '/gioi-thieu', match: ['/gioi-thieu'] },
  { label: 'Dự án', href: '/du-an', match: ['/du-an', '/project'] },
  { label: 'Tin tức', href: '/tin-tuc', match: ['/tin-tuc', '/news'] },
];

const isActive = (pathname: string, match: string[]) => match.some((m) => pathname.startsWith(m));

// Chưa có API đếm người online -> số cố định theo Figma
const ONLINE_COUNT = 100;
const ONLINE_DOT = '#1fc8a0';

// 3 mục cùng màu xám, di chuột vào thì chuyển xanh
const navLinkSx = {
  fontSize: 17,
  fontWeight: 500,
  lineHeight: '25px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  color: '#7c7d84',
  transition: 'color .2s ease',
  '&:hover': { color: brand.blue, fontWeight: 700 }, // Figma: primary/base, Bold
  // Giữ sẵn bề rộng của chữ Bold để hover không làm menu xô lệch
  display: 'inline-flex',
  flexDirection: 'column',
  '&::after': {
    content: 'attr(data-text)',
    fontWeight: 700,
    height: 0,
    overflow: 'hidden',
    visibility: 'hidden',
    pointerEvents: 'none',
  },
} as const;

const registerSx = {
  p: 0,
  minWidth: 0,
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1,
  color: brand.textDark,
  whiteSpace: 'nowrap',
  '&:hover': { bgcolor: 'transparent', color: '#1e50bc' },
};

const loginSx = {
  px: 2,
  py: '11px',
  fontSize: 15,
  fontWeight: 600,
  lineHeight: 1,
  color: brand.primary100,
  whiteSpace: 'nowrap',
  borderRadius: '8px',
  background: brand.gradient,
  transition: 'opacity .25s ease, transform .15s ease',
  '&:hover': { opacity: 0.92, transform: 'translateY(-1px)' },
};

// Menu mobile dạng bottom sheet (Figma Frame 219)
const sheetLinkSx = (active: boolean) => ({
  fontSize: 14,
  lineHeight: '16px',
  textTransform: 'uppercase',
  color: active ? brand.blue : '#495057',
  fontWeight: active ? 700 : 400,
});

// Figma Frame 26 / Frame 4: Fill, cao 40, padding 11/16, radius 8
const sheetBtnSx = { flex: 1, minWidth: 0, height: 40, py: '11px', px: 2, borderRadius: '8px', fontSize: 15, lineHeight: 1 };

// Gộp header trong index.html cũ (desktop) + partials/header.html (nút toggle mobile) -> Drawer
export default function Header() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  // Hamburger chỉ hiện khi < lg; lên lg (menu ngang) thì tự đóng sheet
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { pathname } = useLocation();

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  const authButtons = (
    <>
      <Button href="/dang-ky" disableRipple sx={registerSx}>
        Đăng ký
      </Button>
      <Button href="/dang-nhap" sx={loginSx}>
        Đăng nhập
      </Button>
    </>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: '#fff', color: 'inherit', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)' }}
    >
      <Container>
        <Toolbar disableGutters sx={{ minHeight: { xs: 64 }, height: 64, justifyContent: 'space-between' }}>
          <Box component="a" href="/" sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Box component="img" src="/images/logo.svg" alt="Realestate Logo" sx={{ width: 46, height: 46, objectFit: 'contain', display: 'block' }} />
          </Box>

          {/* Desktop (>= 992px) */}
          <Stack component="nav" direction="row" sx={{ display: { xs: 'none', lg: 'flex' }, gap: 4 }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} underline="none" data-text={item.label} sx={navLinkSx}>
                {item.label}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2 }}>
            {authButtons}
          </Stack>

          {/* Mobile: (< 768px: số người online) + nút mở Drawer */}
          <Stack direction="row" sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}>
            <Stack direction="row" sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: ONLINE_DOT,
                  boxShadow: `0 0 0 3px ${ONLINE_DOT}33`,
                }}
              />
              <Typography sx={{ fontSize: 15, lineHeight: 1, color: brand.textDark, whiteSpace: 'nowrap' }}>
                {ONLINE_COUNT} người đang Online
              </Typography>
            </Stack>
            <IconButton aria-label="Mở menu" onClick={() => setOpen(true)} sx={{ color: brand.textDark }}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            // Figma Frame 219: vertical, padding 16, gap 16, radius 6, shadow 0 4 16 #7C7D84 25%
            sx: {
              bgcolor: '#fff',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              boxShadow: '0 4px 16px rgba(124, 125, 132, 0.25)',
              gap: 2,
              pt: 2,
              px: 2,
              pb: 4, // 16px theo Figma + 16px vùng an toàn dưới cùng
            },
          },
        }}
      >
        {/* Figma Frame 222: gap 16, padding-bottom 16, viền dưới 1px gradient #C9CACC mờ hai đầu */}
        <Stack
          component="nav"
          sx={{
            gap: 2,
            pb: 2,
            borderBottom: '1px solid',
            borderImage: 'linear-gradient(90deg, rgba(201, 202, 204, 0), #c9cacc, rgba(201, 202, 204, 0)) 1',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              underline="none"
              onClick={() => setOpen(false)}
              sx={sheetLinkSx(isActive(pathname, item.match))}
            >
              {item.label}
            </Link>
          ))}
        </Stack>
        {/* Figma Frame 28: horizontal, gap 16 */}
        <Stack direction="row" sx={{ gap: 2 }}>
          <Button
            href="/dang-ky"
            variant="text"
            disableRipple
            sx={{ ...sheetBtnSx, fontWeight: 500, color: '#495057', '&:hover': { bgcolor: 'transparent', color: brand.blue } }}
          >
            Đăng ký
          </Button>
          <Button
            href="/dang-nhap"
            variant="contained"
            disableElevation
            sx={{ ...sheetBtnSx, fontWeight: 600, color: '#fff', background: brand.gradient, '&:hover': { opacity: 0.92 } }}
          >
            Đăng nhập
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
