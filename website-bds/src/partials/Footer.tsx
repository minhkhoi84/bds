import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import { brand } from '../theme';

const SOCIAL_BLUE = '#1e56cf';

// Icon mạng xã hội giữ nguyên SVG gốc (Material Icons không có TikTok)
const SOCIALS = [
  {
    label: 'Facebook',
    icon: (
      <svg width="16" height="16" fill={SOCIAL_BLUE} viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg width="16" height="16" fill={SOCIAL_BLUE} viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg width="16" height="16" fill="none" stroke={SOCIAL_BLUE} strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
    ),
  },
  {
    label: 'TikTok',
    icon: (
      <svg width="15" height="15" fill={SOCIAL_BLUE} viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
    ),
  },
  {
    label: 'X',
    icon: (
      <svg width="14" height="14" fill={SOCIAL_BLUE} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    ),
  },
];

const FOOTER_LINKS = [
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Dự án', href: '/du-an' },
  { label: 'Liên hệ', href: '/lien-he' },
];

const titleSx = { fontSize: 16, fontWeight: 700, mb: '12px', color: '#fff' };
const contactIconSx = { fontSize: 18, flexShrink: 0 };

export default function Footer() {
  return (
    <Box component="footer" sx={{ background: brand.gradient, color: '#fff' }}>
      <Container sx={{ maxWidth: { xs: 1440 }, px: { xs: 2, md: 4 }, py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 3 cột, space-between; xếp dọc dưới 992px */}
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ justifyContent: 'space-between', alignItems: 'stretch', gap: 4 }}>
          {/* Cột 1: logo + giới thiệu + liên hệ */}
          <Box>
            <Box component="a" href="/" sx={{ display: 'inline-block', mb: 2 }}>
              <svg width="42" height="38" viewBox="0 0 40 34" fill="none" style={{ display: 'block' }}>
                <rect x="2" y="14" width="6" height="20" rx="2" fill="#ffffff" />
                <path d="M12 6C12 4.89543 12.8954 4 14 4H16.5L19 1.5C19.3787 1.12132 20 1.3891 20 1.92487V32C20 33.1046 19.1046 34 18 34H14C12.8954 34 12 33.1046 12 32V6Z" fill="#ffffff" />
                <rect x="23" y="10" width="6" height="24" rx="2" fill="#ffffff" />
              </svg>
            </Box>
            <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
              Nền tảng công nghệ tiên phong &amp; dẫn đầu
              <br />
              lĩnh vực kinh doanh bất động sản tại Việt Nam
            </Typography>
            <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0, gap: 1, fontSize: 13, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.95)' }}>
              <Stack component="li" direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <SmartphoneOutlinedIcon sx={contactIconSx} />
                <span>0972 72 9999</span>
              </Stack>
              <Stack component="li" direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <EmailOutlinedIcon sx={contactIconSx} />
                <Link href="mailto:Contact@gmail.com" underline="none" sx={{ color: '#fff' }}>
                  Contact@gmail.com
                </Link>
              </Stack>
              <Stack component="li" direction="row" sx={{ alignItems: 'flex-start', gap: 1 }}>
                <LocationOnOutlinedIcon sx={{ ...contactIconSx, mt: '2px' }} />
                <span>SB24-36, Sao Biển 24, KĐT Vinhomes Ocean Park, Xã Gia Lâm, TP Hà Nội, Việt Nam</span>
              </Stack>
            </Stack>
          </Box>

          {/* Cột 2: Danh mục + Kết nối, rộng 280 */}
          <Stack sx={{ flex: { lg: '0 0 280px' }, gap: 4 }}>
            <Box>
              <Typography component="h4" sx={titleSx}>
                Danh mục
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {FOOTER_LINKS.map((l) => (
                  <Box component="li" key={l.href} sx={{ mb: '6px' }}>
                    <Link
                      href={l.href}
                      underline="none"
                      sx={{
                        fontSize: 13,
                        color: 'rgba(255, 255, 255, 0.85)',
                        transition: 'color .2s ease, padding-left .2s ease',
                        '&:hover': { color: '#fff', pl: '4px' },
                      }}
                    >
                      • {l.label}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography component="h4" sx={titleSx}>
                Kết nối
              </Typography>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                {SOCIALS.map((s) => (
                  <Box
                    key={s.label}
                    component="a"
                    href="#"
                    aria-label={s.label}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform .2s ease, opacity .2s ease',
                      '&:hover': { transform: 'translateY(-2px)', opacity: 0.9 },
                    }}
                  >
                    {s.icon}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>

          {/* Cột 3: bản đồ, cao 234 */}
          <Box
            sx={{
              flex: { lg: '0 0 380px' },
              width: { xs: '100%', lg: 'auto' },
              height: 234,
              borderRadius: '8px',
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.15)', // nền chờ khi ảnh chưa có
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
            }}
          >
            <Box
              component="img"
              src="/images/footer-map.png"
              alt="Bản đồ Vinhomes Ocean Park"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        </Stack>

        {/* Bản quyền: viền trên 1px, padding trên 16 */}
        <Box sx={{ pt: 2, borderTop: '1px solid #eef0fd' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
            &copy; 2026 - Realestate. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
