import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { brand } from '../theme';

// Banner 500px + khung (chấm slide + search) đặt tuyệt đối tại top 401px; < 992px xếp chồng, đè lên banner 99px
export default function Hero({ children }: { children: ReactNode }) {
  return (
    <Box component="section" sx={{ position: 'relative', width: '100%', height: { xs: 'auto', lg: 567 } }}>
      <Box sx={{ height: { xs: 320, md: 500 }, bgcolor: '#166b86', overflow: 'hidden' }}>
        <Box
          component="img"
          src="/images/hero-banner.svg"
          alt="Dự án nổi bật"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
      </Box>

      <Container
        sx={{
          maxWidth: { xs: 1440 },
          p: { xs: 3 },
          position: { xs: 'relative', lg: 'absolute' },
          top: { lg: 401 },
          left: 0,
          right: 0,
          mt: { xs: '-99px', lg: 0 },
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
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
        {children}
      </Container>
    </Box>
  );
}
