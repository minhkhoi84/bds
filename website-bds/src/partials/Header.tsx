import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { brand } from '../theme';

const NAV_ITEMS = [
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Dự án', href: '/du-an' },
  { label: 'Tin tức', href: '/tin-tuc' },
];

const navLinkSx = (active: boolean) => ({
  fontSize: 17,
  fontWeight: active ? 700 : 500,
  lineHeight: '25px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  color: active ? brand.blue : '#7c7d84',
  transition: 'color .2s ease',
  '&:hover': { color: brand.blue },
});

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

// Gộp header trong index.html cũ (desktop) + partials/header.html (nút toggle mobile) -> Drawer
export default function Header({ activeHref = '/du-an' }: { activeHref?: string }) {
  const [open, setOpen] = useState(false);

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
              <Link key={item.href} href={item.href} underline="none" sx={navLinkSx(item.href === activeHref)}>
                {item.label}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2 }}>
            {authButtons}
          </Stack>

          {/* Mobile: nút mở Drawer */}
          <IconButton aria-label="Mở menu" onClick={() => setOpen(true)} sx={{ display: { lg: 'none' }, color: brand.textDark }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Stack sx={{ width: 280, p: 3, gap: 3 }}>
          <IconButton aria-label="Đóng menu" onClick={() => setOpen(false)} sx={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          <Stack component="nav" sx={{ gap: 2.5 }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} underline="none" sx={navLinkSx(item.href === activeHref)}>
                {item.label}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
            {authButtons}
          </Stack>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
