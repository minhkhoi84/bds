import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Project } from '../types/project';
import { projectDetailUrl, slugify } from '../utils/slug';
import { brand } from '../theme';

// 1 item cột "Dự án HOT": ảnh 72x72 + tên + địa chỉ, gap 10
// (gộp hotProjectItem.ts và renderHotProjectItem trong projectCard.ts cũ)
export default function HotProjectItem({ project }: { project: Project }) {
  return (
    <Box
      component="a"
      href={projectDetailUrl(project.id, slugify(project.name))}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        '&:hover .hot-item__name': { color: brand.blue },
      }}
    >
      <Box
        component="img"
        src={project.thumbnail}
        alt={project.name}
        loading="lazy"
        sx={{ flexShrink: 0, width: 72, height: 72, objectFit: 'cover', borderRadius: '4px', bgcolor: brand.primary100 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <Typography
          component="h4"
          className="hot-item__name"
          noWrap
          sx={{ fontSize: 14, fontWeight: 500, lineHeight: '18px', color: brand.textDark, transition: 'color .2s ease' }}
        >
          {project.name}
        </Typography>
        <Typography noWrap sx={{ fontSize: 12, lineHeight: '16px', color: brand.grey }}>
          {project.address}
        </Typography>
      </Box>
    </Box>
  );
}
