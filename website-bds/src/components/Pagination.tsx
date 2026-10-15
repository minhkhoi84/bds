import MenuItem from '@mui/material/MenuItem';
import PaginationItem from '@mui/material/PaginationItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { brand } from '../theme';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// Luôn hiện 3 trang đầu, trang cuối và các trang kề trang hiện tại
// VD: trang 1 -> 1 2 3 ... 20 | trang 10 -> 1 2 3 ... 9 10 11 ... 20
function getPageItems(page: number, total: number): (number | '...')[] {
  const nums = [...new Set([1, 2, 3, total, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: (number | '...')[] = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push('...');
    out.push(n);
  });
  return out;
}

// Ô trang (Frame 75): 32x32 hug, padding 6, bo 6, nền primary/100
const itemSx = {
  m: 0,
  minWidth: 32,
  height: 32,
  p: '6px',
  borderRadius: '6px',
  border: `1px solid ${brand.grey100}`,
  bgcolor: brand.primary100,
  fontSize: 12,
  fontWeight: 500,
  color: brand.textDark,
  '& .MuiPaginationItem-icon': { fontSize: 16 },
  '&:hover': { color: brand.blue, borderColor: brand.blue, bgcolor: brand.primary100 },
  '&.Mui-selected, &.Mui-selected:hover': { color: '#fff', bgcolor: brand.blue, borderColor: brand.blue },
  '&.Mui-disabled': { color: '#b0b3bb', opacity: 1 },
  '&.MuiPaginationItem-ellipsis': { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
};

const slots = {
  first: KeyboardDoubleArrowLeftIcon,
  previous: KeyboardArrowLeftIcon,
  next: KeyboardArrowRightIcon,
  last: KeyboardDoubleArrowRightIcon,
};

// Frame 74: Fill x 36 hug, space-between — Trái: "Trang [select] Của N" | Phải: « ‹ 1 2 3 … N › »
export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <Stack
      component="nav"
      aria-label="Phân trang dự án"
      direction="row"
      sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, minHeight: 36, fontSize: 14, color: brand.textDark }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        Trang
        <Select
          size="small"
          value={page}
          onChange={(e) => onChange(Number(e.target.value))}
          sx={{ minWidth: 72, height: 36, fontSize: 14, borderRadius: '6px' }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
        Của {totalPages}
      </Stack>

      <Stack component="ul" direction="row" sx={{ flexWrap: 'wrap', gap: '6px', listStyle: 'none', p: 0, m: 0 }}>
        <li><PaginationItem type="first" slots={slots} disabled={isFirst} onClick={() => onChange(1)} sx={itemSx} aria-label="Trang đầu" /></li>
        <li><PaginationItem type="previous" slots={slots} disabled={isFirst} onClick={() => onChange(page - 1)} sx={itemSx} aria-label="Trang trước" /></li>
        {getPageItems(page, totalPages).map((it, i) => (
          <li key={it === '...' ? `ellipsis-${i}` : it}>
            {it === '...' ? (
              <PaginationItem type="start-ellipsis" sx={itemSx} />
            ) : (
              <PaginationItem
                type="page"
                page={it}
                selected={it === page}
                onClick={() => onChange(it)}
                sx={itemSx}
                aria-current={it === page ? 'page' : undefined}
              />
            )}
          </li>
        ))}
        <li><PaginationItem type="next" slots={slots} disabled={isLast} onClick={() => onChange(page + 1)} sx={itemSx} aria-label="Trang sau" /></li>
        <li><PaginationItem type="last" slots={slots} disabled={isLast} onClick={() => onChange(totalPages)} sx={itemSx} aria-label="Trang cuối" /></li>
      </Stack>
    </Stack>
  );
}
