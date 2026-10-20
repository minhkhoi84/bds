import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { brand } from '../theme';

const MAP_LINK = "https://www.google.com/maps/place/Vinhomes+Ocean+Park,+Gia+L%C3%A2m,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam/@20.9943553,105.947541,15z";
const MAP_EMBED = "https://www.google.com/maps?q=20.9948063,105.9464883&z=15&output=embed";

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

// Tiêu đề "Danh mục" / "Kết nối" (Frame 86 / 87: tiêu đề + nội dung, gap 16)
const titleSx = { fontSize: 20, fontWeight: 500, lineHeight: '20px', color: '#fff' };
// Figma: icon 24 x 24
const contactIconSx = { fontSize: 24, flexShrink: 0 };
const contactRowSx = { alignItems: 'center', gap: '10px' };

export default function Footer() {
  return (
    <Box component="footer" sx={{ background: brand.gradient, color: '#fff' }}>
      <Container sx={{ maxWidth: { xs: 1440 }, px: { xs: 2, md: 4 }, py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Frame 85: 3 cột, Fill x 234 hug, space-between; xếp dọc dưới 992px */}
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ justifyContent: 'space-between', alignItems: 'stretch', gap: 4 }}>
          {/* Frame 84 (rộng 373): Frame 24 (logo + giới thiệu) + Frame 83 (liên hệ), gap 16 */}
          <Stack sx={{ width: { md: 373 }, maxWidth: { md: 373 }, flexShrink: 0, gap: 2 }}>
            {/* Frame 24: dọc, gap 16 */}
            <Stack sx={{ gap: 2, alignItems: 'flex-start' }}>
              <Box component="a" href="/" sx={{ display: 'inline-block' }}>
                <Box component="img" src="/images/logo_2.svg" alt="Realestate" sx={{ width: { xs: 40, md: 38 }, height: { xs: 40, md: 38 }, display: 'block' }} />
              </Box>
              {/* Figma: Inter Medium, grey/100, khung 373 (đúng 2 dòng) */}
              <Typography
                sx={{
                  maxWidth: 373,
                  fontSize: { xs: 17, md: 16 },
                  fontWeight: { xs: 600, md: 500 },
                  lineHeight: { xs: '26px', md: '24px' },
                  color: brand.grey100,
                }}
              >
                Nền tảng công nghệ tiên phong &amp; dẫn đầu
                <br />
                lĩnh vực kinh doanh bất động sản tại Việt Nam
              </Typography>
            </Stack>

            {/* Frame 83: dọc, gap 8 — mỗi dòng icon 24 + chữ */}
            <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0, gap: 1, fontSize: { xs: 15, md: 13 }, lineHeight: { xs: '23px', md: '20px' }, color: '#fff' }}>
              <Stack component="li" direction="row" sx={contactRowSx}>
                <SmartphoneOutlinedIcon sx={contactIconSx} />
                <span>0972 72 9999</span>
              </Stack>
              <Stack component="li" direction="row" sx={contactRowSx}>
                <EmailOutlinedIcon sx={contactIconSx} />
                <Link href="mailto:Contact@gmail.com" underline="none" sx={{ color: '#fff' }}>
                  Contact@gmail.com
                </Link>
              </Stack>
              <Stack component="li" direction="row" sx={contactRowSx}>
                <LocationOnOutlinedIcon sx={contactIconSx} />
                <Link href={MAP_LINK} target="_blank" rel="noopener noreferrer" underline="none" sx={{ color: '#fff' }}>
                  SB24-36, Sao Biển 24, KĐT Vinhomes Ocean Park,
                  <br />
                  Xã Gia Lâm, TP Hà Nội, Việt Nam
                </Link>
              </Stack>
            </Stack>
          </Stack>

          {/* Frame 89: rộng 280, cao Fill (234) — Frame 86 (Danh mục) + Frame 87 (Kết nối) */}
          <Stack sx={{ flex: { lg: '0 0 280px' }, gap: 4 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography component="h4" sx={titleSx}>
                Danh mục
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {FOOTER_LINKS.map((l) => (
                  <Box component="li" key={l.href}>
                    <Link
                      href={l.href}
                      underline="none"
                      sx={{
                        fontSize: 16,
                        lineHeight: '24px',
                        color: '#fff',
                        transition: 'color .2s ease, padding-left .2s ease',
                        '&:hover': { color: '#fff', pl: '4px' },
                      }}
                    >
                      • {l.label}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Stack>
            <Stack sx={{ gap: 2 }}>
              <Typography component="h4" sx={titleSx}>
                Kết nối
              </Typography>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
                {SOCIALS.map((s) => (
                  <Box
                    key={s.label}
                    component="a"
                    href="#"
                    aria-label={s.label}
                    sx={{
                      width: 26,
                      height: 26,
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
            </Stack>
          </Stack>

          {/* Cột 3: bản đồ Google Maps nhúng, cao 234 + link mở ngoài */}
          <Stack sx={{ flex: { lg: '0 0 380px' }, width: { xs: '100%', lg: 'auto' }, gap: 1 }}>
            <Box
              sx={{
                height: 234,
                borderRadius: '8px',
                overflow: 'hidden',
                bgcolor: 'rgba(255, 255, 255, 0.15)', // nền chờ khi bản đồ chưa tải
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              }}
            >
              <Box
                component="iframe"
                src={MAP_EMBED}
                title="Bản đồ Vinhomes Ocean Park"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sx={{ border: 0, width: '100%', height: '100%', display: 'block' }}
              />
            </Box>
            <Link
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ alignSelf: 'flex-end', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 13, color: '#fff' }}
            >
              Xem trên Google Maps <OpenInNewIcon sx={{ fontSize: 14 }} />
            </Link>
          </Stack>
        </Stack>

        {/* Frame 79: Fill x 42 hug, viền trên 1px #EEF0FD, padding trên 16 */}
        <Box sx={{ pt: 2, borderTop: `1px solid ${brand.primary100}` }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: '25px', color: brand.grey100 }}>
            &copy; 2026 - Realestate. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
