import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HistoryIcon from '@mui/icons-material/History';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CoverImage from './CoverImage';
import type { Project } from '../types/project';
import { STATUS } from '../utils/constants';
import { projectDetailUrl, slugify } from '../utils/slug';
import { Link as RouterLink } from 'react-router-dom';
import { brand } from '../theme';

interface ProjectCardProps {
  project: Project;
  onShare: (project: Project, url: string) => void;
}

// Tag/badge trên ảnh: cao 30, padding 6/12, gap 4, chữ 12/500 trắng
const tagSx: SxProps<Theme> = {
  height: 30,
  px: '12px',
  gap: '4px',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '18px',
  color: '#fff',
  '& .MuiChip-label': { p: 0 },
  '& .MuiChip-icon': { m: 0, fontSize: 16, color: 'inherit' },
};

export default function ProjectCard({ project, onShare }: ProjectCardProps) {
  const url = projectDetailUrl(project.id, slugify(project.name));
  const isHighRise = project.typeCode === 'HIGH_RISE';
  const isUpcoming = project.statusCode === STATUS.COMING_SOON;

  return (
    <Card
      component="article"
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        pb: 2,
        borderColor: brand.border,
        borderRadius: '8px',
        transition: 'border-color .2s ease, box-shadow .2s ease, transform .2s ease',
        '&:hover': {
          borderColor: brand.blue,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
          '& .project-card__img': { transform: 'scale(1.04)' },
        },
      }}
    >
      {/* Ảnh 3:2 + tag loại dự án + hàng badge */}
      <Box
        component={RouterLink}
        to={url}
        sx={{ position: 'relative', display: 'block', aspectRatio: '352 / 234.67', overflow: 'hidden', bgcolor: brand.primary100 }}
      >
        <CoverImage
          className="project-card__img"
          src={project.thumbnail}
          alt={project.name}
          logoSize={48}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s ease' }}
        />
        <Chip
          icon={isHighRise ? <ApartmentIcon /> : <HolidayVillageIcon />}
          label={project.typeName}
          sx={{
            ...tagSx,
            position: 'absolute',
            top: 8,
            left: 8,
            borderRadius: '4px',
            bgcolor: isHighRise ? brand.cyan : brand.blue,
            // Figma: Inter Medium 11px, line-height 100%, Title case, primary/100
            fontSize: 11,
            fontWeight: 500,
            lineHeight: 1,
            color: brand.primary100,
            textTransform: 'capitalize',
          }}
        />
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', p: 1 }}>
          {project.isHot && (
            <Chip
              icon={<LocalFireDepartmentIcon />}
              label="Dự Án HOT"
              sx={{ ...tagSx, borderRadius: '100px', backdropFilter: 'blur(16px)', bgcolor: brand.hot, boxShadow: '0 4px 16px 0 rgba(255, 56, 60, 0.2)' }}
            />
          )}
          {isUpcoming && (
            <Chip
              icon={<HistoryIcon />}
              label="Sắp Mở Bán"
              sx={{
                ...tagSx,
                ml: 'auto', // đứng một mình vẫn nằm bên phải
                borderRadius: '100px',
                backdropFilter: 'blur(16px)',
                bgcolor: brand.upcoming,
                boxShadow: '0 4px 16px 0 rgba(255, 141, 40, 0.2)',
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, px: '12px', py: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography component="h3" noWrap sx={{ fontSize: 14, fontWeight: 700, lineHeight: '20px', textTransform: 'uppercase' }}>
              <Link component={RouterLink} to={url} underline="hover" sx={{ color: brand.blue }}>
                {project.name}
              </Link>
            </Typography>
            <Typography noWrap sx={{ fontSize: 12, lineHeight: '16px', color: brand.grey }}>
              {project.address}
            </Typography>
          </Box>
          {/* Luôn giữ 2 dòng để các card thẳng hàng */}
          <Typography sx={{ fontSize: 12, lineHeight: '16px', height: 32, color: brand.textDark, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
            {project.shortDescription}
          </Typography>
        </Box>

        <Button
          startIcon={<OpenInNewIcon />}
          onClick={() => onShare(project, url)}
          disableRipple
          sx={{
            alignSelf: 'flex-start',
            mt: 'auto',
            minWidth: 0,
            height: 24,
            p: 0,
            fontSize: 14,
            fontWeight: 500,
            color: brand.blue,
            '& .MuiButton-startIcon': { ml: 0, mr: '4px', '& svg': { fontSize: 16 } },
            '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
          }}
        >
          Chia sẻ
        </Button>
      </CardContent>
    </Card>
  );
}
