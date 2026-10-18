import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CoverImage from './CoverImage';
import type { News } from '../types/news';
import { formatDate } from '../utils/format';
import { brand } from '../theme';

const clamp2 = { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' } as const;

export default function NewsCard({ news }: { news: News }) {
  return (
    <Card
      component="a"
      href={`/tin-tuc/${news.id}`}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        pb: 2,
        borderColor: brand.grey200,
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'border-color .2s ease, box-shadow .2s ease, transform .2s ease',
        '&:hover': { borderColor: brand.blue, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)', transform: 'translateY(-2px)' },
      }}
    >
      <CoverImage
        src={news.thumbnail}
        alt={news.title}
        logoSize={40}
        sx={{ aspectRatio: '3 / 2', objectFit: 'cover', bgcolor: brand.primary100 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: '12px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography component="h3" sx={{ ...clamp2, height: 36, fontSize: 14, fontWeight: 600, lineHeight: '18px', color: brand.blue }}>
            {news.title}
          </Typography>
          <Typography component="span" sx={{ fontSize: 12, lineHeight: '16px', color: brand.grey }}>
            {formatDate(news.createdAt)}
          </Typography>
        </Box>
        <Typography sx={{ ...clamp2, height: 32, fontSize: 13, fontWeight: 500, lineHeight: '16px', color: brand.grey500 }}>
          {news.shortDescription}
        </Typography>
      </Box>
    </Card>
  );
}
