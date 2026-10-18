import { useState } from 'react';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import type { SxProps, Theme } from '@mui/material/styles';
import { brand } from '../theme';

interface CoverImageProps {
  src?: string;
  alt: string;
  logoSize?: number;
  className?: string;
  sx?: SxProps<Theme>;
}

// Ảnh bìa: không có ảnh hoặc tải lỗi -> ô nền xám nhạt + logo nhỏ ở giữa
export default function CoverImage({ src, alt, logoSize = 40, className, sx }: CoverImageProps) {
  // Ghi nhớ src đã lỗi (không dùng boolean) để src mới tự thử tải lại
  const [failedSrc, setFailedSrc] = useState<string>();

  if (src && src !== failedSrc) {
    return <CardMedia component="img" image={src} alt={alt} loading="lazy" className={className} onError={() => setFailedSrc(src)} sx={sx} />;
  }

  return (
    <Box
      role="img"
      aria-label={alt}
      className={className}
      sx={[...(Array.isArray(sx) ? sx : [sx]), { display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: brand.grey100 }]}
    >
      <Box component="img" src="/images/logo.svg" alt="" sx={{ width: logoSize, height: logoSize, opacity: 0.5 }} />
    </Box>
  );
}
