import { useEffect, useMemo, useState } from 'react';
import { isCancel } from 'axios';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { contentApi } from '../api/contentApi';
import type { Content } from '../types/content';
import { mapEmbedSrc, splitLocationContent } from '../utils/locationHtml';
import { brand } from '../theme';

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; content: Content | null };

// Định dạng HTML của trình soạn thảo theo Figma (chữ 14px, xám đậm, danh sách chấm tròn)
const richTextSx = {
  fontSize: 14,
  lineHeight: '22px',
  color: brand.textDark,
  overflowWrap: 'anywhere',
  '& p': { m: 0, mb: 1 },
  '& ul, & ol': { m: 0, mb: 1.5, pl: 2.5 },
  '& li': { lineHeight: '24px' },
  '& h2, & h3, & h4': { m: 0, mt: 2, mb: 1, fontSize: 16, lineHeight: '22px', fontWeight: 700, color: brand.blue },
  '& a': { color: brand.blue },
  '& img': { display: 'block', maxWidth: '100%', height: 'auto', borderRadius: '16px', my: 1.5 },
  '& > :first-child': { mt: 0 },
  '& > :last-child': { mb: 0 },
} as const;

function Message({ children, color = 'text.secondary' }: { children: string; color?: string }) {
  return <Typography sx={{ py: 8, textAlign: 'center', color }}>{children}</Typography>;
}

// Tab "Vị trí": GET /portal/contents/get?contentType=LOCATION
export default function ProjectLocation({ projectId, projectName }: { projectId: number; projectName: string }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    contentApi
      .getProjectContent(projectId, 'LOCATION', controller.signal)
      .then((content) => setState({ status: 'ready', content }))
      .catch((err) => {
        if (isCancel(err)) return;
        console.error(err);
        setState({ status: 'error' });
      });
    return () => controller.abort();
  }, [projectId]);

  const content = state.status === 'ready' ? state.content : null;
  const { mapSrc, sideSrc, bodyHtml } = useMemo(() => splitLocationContent(content), [content]);
  const embedSrc = useMemo(() => mapEmbedSrc(content?.embedLocation), [content]);

  if (state.status === 'loading') {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (state.status === 'error') return <Message color="error.main">Không tải được thông tin vị trí, vui lòng thử lại</Message>;
  if (!mapSrc && !sideSrc && !bodyHtml && !embedSrc) return <Message>Chưa có thông tin vị trí</Message>;

  return (
    <Stack component="section" aria-label="Vị trí dự án" sx={{ gap: 3 }}>
      {mapSrc && (
        <Box
          component="img"
          src={mapSrc}
          alt={`Bản đồ vị trí ${projectName}`}
          loading="lazy"
          sx={{ display: 'block', width: '100%', height: 'auto', borderRadius: '16px' }}
        />
      )}
      {/* Figma: chữ bên trái, ảnh vệ tinh bên phải (xếp chồng < 992px); không có ảnh -> chữ full chiều rộng */}
      {(bodyHtml || sideSrc) && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: bodyHtml && sideSrc ? 'repeat(2, minmax(0, 1fr))' : '1fr' },
            alignItems: 'start',
            gap: 3,
          }}
        >
          {/* bodyHtml đã qua DOMPurify */}
          {bodyHtml && <Box sx={richTextSx} dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
          {sideSrc && (
            <Box
              component="img"
              src={sideSrc}
              alt={`Ảnh vệ tinh khu vực ${projectName}`}
              loading="lazy"
              sx={{ display: 'block', width: '100%', height: 'auto', borderRadius: '16px' }}
            />
          )}
        </Box>
      )}
      {/* Google Map cuối trang: src đã kiểm tra chỉ là Google Maps (mapEmbedSrc) */}
      {embedSrc && (
        <Box
          component="iframe"
          src={embedSrc}
          title={`Bản đồ Google Maps ${projectName}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          sx={{ display: 'block', width: '100%', height: { xs: 300, md: 400, lg: 472 }, border: 0, borderRadius: '16px' }}
        />
      )}
    </Stack>
  );
}
