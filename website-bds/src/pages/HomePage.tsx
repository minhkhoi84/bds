import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { projectApi } from '../api/projectApi';
import { newsApi } from '../api/newsApi';
import type { Project, ProjectSearchParams } from '../types/project';
import type { News } from '../types/news';
import ProjectCard from '../components/ProjectCard';
import HotProjectItem from '../components/HotProjectItem';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';
import { useToast } from '../components/Toast';
import { brand } from '../theme';

export type Filters = Required<Pick<ProjectSearchParams, 'name' | 'investorId' | 'regionCode' | 'typeCode' | 'statusCode'>>;

export const EMPTY_FILTERS: Filters = { name: '', investorId: '', regionCode: '', typeCode: '', statusCode: '' };

type ListStatus = 'loading' | 'error' | 'ready';

const debugLog = (label: string, data: unknown) => {
  if (import.meta.env.DEV) console.log(`[API] ${label}`, data);
};

function StatusMessage({ children, color = 'text.secondary' }: { children: ReactNode; color?: string }) {
  return <Typography sx={{ py: 5, textAlign: 'center', color }}>{children}</Typography>;
}

// filters do SearchBar (Bước 3) truyền xuống; đổi filters -> về trang 1
export default function HomePage({ filters = EMPTY_FILTERS }: { filters?: Filters }) {
  const showToast = useToast();
  const listRef = useRef<HTMLElement>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ListStatus>('loading');
  const [hotProjects, setHotProjects] = useState<Project[]>([]);
  const [news, setNews] = useState<News[]>([]);

  // Đổi bộ lọc -> về trang 1 (đặt lại ngay khi render để không gọi API thừa với trang cũ)
  const [prevFilters, setPrevFilters] = useState(filters);
  if (filters !== prevFilters) {
    setPrevFilters(filters);
    setPage(1);
  }

  /* ---------- Danh sách dự án + phân trang ---------- */
  useEffect(() => {
    let ignore = false; // tránh response cũ ghi đè response mới khi lọc nhanh
    setStatus('loading');
    projectApi
      .search({ page, ...filters })
      .then((res) => {
        debugLog('projectApi.search', res);
        if (ignore) return;
        setProjects(Array.isArray(res?.items) ? res.items : []);
        setTotalPages(res?.totalPages ?? 1);
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, [page, filters]);

  /* ---------- Dự án HOT + Tin tức (4 bài mới nhất) ---------- */
  useEffect(() => {
    // pageSize lớn để lấy "toàn bộ"; nếu backend giới hạn pageSize thì phải lặp qua các trang
    projectApi
      .search({ pageSize: 100, isHot: true })
      .then((res) => {
        debugLog('projectApi.search (hot)', res);
        setHotProjects(Array.isArray(res?.items) ? res.items : []);
      })
      .catch(console.error);
    newsApi
      .search()
      .then((res) => {
        debugLog('newsApi.search', res);
        setNews(Array.isArray(res?.items) ? res.items : []);
      })
      .catch(console.error);
  }, []);

  const goToPage = (p: number) => {
    setPage(p);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Nút "Chia sẻ": sao chép link dự án, không chuyển trang
  const handleShare = useCallback(
    async (_: Project, url: string) => {
      try {
        await navigator.clipboard.writeText(location.origin + url);
        showToast('Đã sao chép liên kết dự án');
      } catch {
        showToast('Không thể sao chép liên kết', 'error');
      }
    },
    [showToast],
  );

  let projectList: ReactNode;
  if (status === 'loading') {
    projectList = (
      <Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  } else if (status === 'error') {
    projectList = <StatusMessage color="error.main">Không tải được dữ liệu, vui lòng thử lại</StatusMessage>;
  } else if (projects.length === 0) {
    projectList = <StatusMessage>Không có dự án nào</StatusMessage>;
  } else {
    projectList = (
      <>
        <Grid container spacing={2}>
          {projects.map((p) => (
            <Grid key={p.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ProjectCard project={p} onShare={handleShare} />
            </Grid>
          ))}
        </Grid>
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      </>
    );
  }

  return (
    <Box component="main" sx={{ pb: 4 }}>
      <Container sx={{ maxWidth: { xs: 1440 }, px: { xs: 3 } }}>
        {/* Cột trái (danh sách + tin tức) | cột phải 280px (Dự án HOT); xếp dọc dưới 1200px */}
        <Stack direction={{ xs: 'column', xl: 'row' }} sx={{ alignItems: 'flex-start', gap: 3 }}>
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', xl: 'auto' } }}>
            <Stack component="section" ref={listRef} sx={{ gap: 2, pb: 4, scrollMarginTop: 80 }}>
              <Typography variant="sectionHeading">Danh sách dự án</Typography>
              {projectList}
            </Stack>

            <Stack component="section" sx={{ gap: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="sectionHeading">Tin tức</Typography>
                <Link
                  href="/tin-tuc"
                  underline="none"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 14, fontWeight: 500, color: brand.cyan, whiteSpace: 'nowrap', '&:hover': { opacity: 0.8 } }}
                >
                  Xem tất cả <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Link>
              </Stack>
              <Grid container spacing={2}>
                {news.map((n) => (
                  <Grid key={n.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                    <NewsCard news={n} />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Box>

          {/* minWidth 0: không để tên/địa chỉ dài kéo cột rộng quá 280px */}
          <Stack component="aside" sx={{ flex: { xl: '0 0 280px' }, width: { xs: '100%', xl: 'auto' }, minWidth: 0, gap: 2 }}>
            <Typography variant="sectionHeading">Dự án HOT</Typography>
            <Stack sx={{ gap: '14px' }}>
              {hotProjects.map((p) => (
                <HotProjectItem key={p.id} project={p} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
