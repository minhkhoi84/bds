import { useEffect, useState, type ReactNode } from 'react';
import { Link as RouterLink, NavLink, Navigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ControlCameraOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { projectApi } from '../api/projectApi';
import CoverImage from '../components/CoverImage';
import ProjectLocation from '../components/ProjectLocation';
import { useCopyLink } from '../hooks/useCopyLink';
import type { ProjectDetail } from '../types/project';
import { parseProjectId, projectDetailUrl, slugify } from '../utils/slug';
import { brand } from '../theme';

// slug nằm trên URL: /du-an/{slug}-{id}/{tab}
export const PROJECT_TABS = [
  { slug: 'tong-quan', label: 'Tổng quan', icon: <ControlCameraOutlinedIcon /> },
  { slug: 'vi-tri', label: 'Vị trí', icon: <LocationOnOutlinedIcon /> },
  { slug: 'phan-khu', label: 'Phân khu', icon: <ExploreOutlinedIcon /> },
  { slug: 'mat-bang-quy-can', label: 'Mặt bằng quỹ căn', icon: <MapOutlinedIcon /> },
  { slug: 'quy-can', label: 'Quỹ căn', icon: <HomeWorkOutlinedIcon /> },
  { slug: 'chinh-sach-ban-hang', label: 'Chính sách bán hàng', icon: <ArticleOutlinedIcon /> },
  { slug: 'tin-tuc', label: 'Tin tức', icon: <LanguageOutlinedIcon /> },
] as const;

type TabSlug = (typeof PROJECT_TABS)[number]['slug'];
const DEFAULT_TAB: TabSlug = 'tong-quan';
const isTabSlug = (s?: string): s is TabSlug => PROJECT_TABS.some((t) => t.slug === s);

type LoadState = { status: 'loading' } | { status: 'notFound' } | { status: 'error' } | { status: 'ready'; project: ProjectDetail };

function StatusMessage({ children, color = 'text.secondary' }: { children: ReactNode; color?: string }) {
  return <Typography sx={{ py: 8, textAlign: 'center', color }}>{children}</Typography>;
}

// Figma "Chi tiết dự án": dải gradient, mục đang chọn là viên thuốc nền xanh đậm + viền trắng mờ.
// Màn hẹp: cuộn ngang, tab đang chọn tự cuộn vào giữa.
function ProjectTabs({ baseUrl, active }: { baseUrl: string; active: TabSlug }) {
  return (
    <Box
      component="nav"
      aria-label="Thông tin dự án"
      sx={{
        position: 'relative', // làm mốc offsetLeft cho các tab
        display: 'flex',
        gap: 1,
        p: 1,
        borderRadius: '8px',
        background: brand.gradient,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {PROJECT_TABS.map((t) => {
        const isActive = t.slug === active;
        return (
          <Box
            key={t.slug}
            component={NavLink}
            to={`${baseUrl}/${t.slug}`}
            ref={(el: HTMLElement | null) => {
              // Chỉ cuộn ngang thanh tab (scrollIntoView sẽ kéo cả trang xuống)
              const bar = el?.parentElement;
              if (isActive && el && bar) bar.scrollLeft = el.offsetLeft - (bar.clientWidth - el.offsetWidth) / 2;
            }}
            sx={{
              flex: { xl: 1 },
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              height: 40,
              px: 2,
              borderRadius: '100px',
              border: '1px solid',
              borderColor: isActive ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
              bgcolor: isActive ? 'rgba(30, 64, 160, 0.6)' : 'transparent',
              color: '#fff',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'background-color .2s ease',
              '&:hover': { bgcolor: isActive ? undefined : 'rgba(255, 255, 255, 0.12)' },
              '& svg': { fontSize: 18 },
            }}
          >
            {t.icon}
            {t.label}
          </Box>
        );
      })}
    </Box>
  );
}

// Nội dung từng tab: mới làm "Vị trí", tab khác -> khung chờ
function TabContent({ tab, project }: { tab: TabSlug; project: ProjectDetail }) {
  if (tab === 'vi-tri') return <ProjectLocation projectId={Number(project.id)} projectName={project.name} />;
  const label = PROJECT_TABS.find((t) => t.slug === tab)?.label;
  return <StatusMessage>Nội dung "{label}" đang được cập nhật</StatusMessage>;
}

export default function ProjectDetailPage() {
  const { slugId, tab } = useParams();
  const id = parseProjectId(slugId);
  const copyLink = useCopyLink();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    if (id == null) return;
    let ignore = false;
    setState({ status: 'loading' });
    window.scrollTo(0, 0);
    projectApi
      .getDetail(id)
      .then((project) => {
        if (!ignore) setState({ status: 'ready', project });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setState({ status: isAxiosError(err) && err.response?.status === 404 ? 'notFound' : 'error' });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const project = state.status === 'ready' ? state.project : null;

  useEffect(() => {
    if (project) document.title = `${project.name} | Website Bất Động Sản`;
  }, [project]);

  if (id == null) return <StatusMessage>Không tìm thấy dự án</StatusMessage>;

  // Thiếu/sai tab -> về Tổng quan; sai slug (đổi tên dự án) -> sửa lại URL cho đúng tên mới
  const activeTab = isTabSlug(tab) ? tab : DEFAULT_TAB;
  if (project) {
    const canonical = projectDetailUrl(project.id, slugify(project.name), activeTab);
    if (tab !== activeTab || slugId !== `${slugify(project.name)}-${project.id}`) return <Navigate to={canonical} replace />;
  } else if (tab != null && !isTabSlug(tab)) {
    return <Navigate to={projectDetailUrl(id, slugId?.replace(/-?\d+$/, '') ?? '', DEFAULT_TAB)} replace />;
  }

  let body: ReactNode;
  if (state.status === 'loading') {
    body = (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  } else if (state.status === 'notFound') {
    body = <StatusMessage>Không tìm thấy dự án</StatusMessage>;
  } else if (state.status === 'error') {
    body = <StatusMessage color="error.main">Không tải được dữ liệu, vui lòng thử lại</StatusMessage>;
  } else {
    const p = state.project;
    const baseUrl = projectDetailUrl(p.id, slugify(p.name));
    body = (
      <Stack sx={{ gap: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ alignItems: { xs: 'stretch', md: 'flex-start' }, gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="sectionHeading" component="h1" sx={{ overflowWrap: 'anywhere' }}>
              {p.name}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 14, lineHeight: '20px', color: brand.grey500 }}>
              Theo dõi thông tin chi tiết và bảng giá, mặt bằng, tiến độ và chính sách bán hàng dự án {p.name}.
            </Typography>
          </Box>
          <Button
            startIcon={<OpenInNewIcon />}
            onClick={() => copyLink(baseUrl)}
            sx={{
              alignSelf: { xs: 'flex-start', md: 'center' },
              flexShrink: 0,
              height: 40,
              px: 2,
              borderRadius: '8px',
              fontSize: 14,
              fontWeight: 500,
              color: '#fff',
              background: brand.gradient,
              '& .MuiButton-startIcon svg': { fontSize: 16 },
              '&:hover': { opacity: 0.92 },
            }}
          >
            Chia sẻ
          </Button>
        </Stack>

        {/* API chi tiết chỉ trả 1 ảnh (fileInfo) -> chưa làm slider */}
        <CoverImage
          src={p.thumbnail}
          alt={p.name}
          logoSize={64}
          sx={{ width: '100%', aspectRatio: { xs: '4 / 3', md: '1140 / 593' }, objectFit: 'cover', borderRadius: '16px' }}
        />

        <ProjectTabs baseUrl={baseUrl} active={activeTab} />

        <TabContent tab={activeTab} project={p} />
      </Stack>
    );
  }

  return (
    <Box component="main" sx={{ py: 2, pb: 4 }}>
      <Container>
        <Breadcrumbs sx={{ mb: 2, fontSize: 12, '& .MuiBreadcrumbs-separator': { mx: '4px' } }}>
          <Link component={RouterLink} to="/" underline="hover" sx={{ color: brand.blue }}>
            Dự án
          </Link>
          {project && (
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: brand.textDark }}>{project.name}</Typography>
          )}
        </Breadcrumbs>
        {body}
      </Container>
    </Box>
  );
}
