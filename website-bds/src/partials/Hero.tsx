import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { brand } from '../theme';

function SlideDots({ sx }: { sx?: object }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: '6px', ...sx }}>
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            width: i === 0 ? 28 : 8,
            height: 8,
            borderRadius: i === 0 ? '10px' : '50%',
            bgcolor: i === 0 ? brand.cyanDot : 'rgba(255, 255, 255, 0.6)',
            transition: 'all .3s ease',
            cursor: 'pointer',
          }}
        />
      ))}
    </Stack>
  );
}

// >= 992px: banner 500px + khung (chấm slide + search) đặt tuyệt đối tại top 401px
// 768–991px: xếp chồng, khung đè lên banner 99px
// < 768px (Figma iPhone 16): banner 4:5, chấm slide nằm trên ảnh, dải search full width ngay dưới banner
export default function Hero({ children }: { children: ReactNode }) {
  return (
    <Box component="section" sx={{ position: 'relative', width: '100%', height: { xs: 'auto', lg: 567 } }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'auto', md: 500 },
          aspectRatio: { xs: '4 / 5', md: 'auto' },
          bgcolor: '#166b86',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="/images/hero-banner.svg"
          alt="Dự án nổi bật"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
        <SlideDots sx={{ display: { xs: 'flex', md: 'none' }, position: 'absolute', left: 0, right: 0, bottom: 16 }} />
      </Box>

      <Container
        sx={{
          maxWidth: { xs: 'none', md: 1440 },
          px: { xs: 0, md: 3 },
          pt: { xs: 0, md: 3 },
          pb: { xs: 2, md: 3 },   // mobile: 16px như Figma, desktop giữ 24px như cũ
          position: { xs: 'relative', lg: 'absolute' },
          top: { lg: 401 },
          left: 0,
          right: 0,
          mt: { xs: 0, md: '-99px', lg: 0 },
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <SlideDots sx={{ display: { xs: 'none', md: 'flex' } }} />
        {children}
      </Container>
    </Box>
  );
}
