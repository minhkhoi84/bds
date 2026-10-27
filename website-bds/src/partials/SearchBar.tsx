import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { isCancel } from 'axios';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { investorApi } from '../api/investorApi';
import { masterDataApi } from '../api/masterDataApi';
import { GROUP_CODE } from '../utils/constants';
import FilterFields, { fieldSx, type FilterOptions, type Option } from '../components/FilterFields';
import { brand } from '../theme';
import type { Filters } from '../pages/HomePage';

interface SearchBarProps {
  value: Filters;
  onChange: Dispatch<SetStateAction<Filters>>;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const theme = useTheme();
  // Mobile < 768px (theme md = 768); noSsr để lần render đầu không nháy layout desktop
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Sang >= 768px thì đóng lại, quay về mobile không tự bung ra
  if (!isMobile && isFilterOpen) setIsFilterOpen(false);
  const [keyword, setKeyword] = useState(value.name);
  const [options, setOptions] = useState<FilterOptions>({
    investorId: [],
    regionCode: [],
    typeCode: [],
    statusCode: [],
  });

  // Nạp dữ liệu cho 4 dropdown
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const toOptions = <T,>(list: T[], v: keyof T, l: keyof T): Option[] =>
      list.map((i) => ({ value: String(i[v]), label: String(i[l]) }));

    Promise.all([
      investorApi.getList(signal),
      masterDataApi.getByGroup(GROUP_CODE.REGION, signal),
      masterDataApi.getByGroup(GROUP_CODE.TYPE, signal),
      masterDataApi.getByGroup(GROUP_CODE.STATUS, signal),
    ])
      .then(([investors, regions, types, statuses]) =>
        setOptions({
          investorId: toOptions(investors, 'id', 'name'),
          regionCode: toOptions(regions, 'code', 'value'),
          typeCode: toOptions(types, 'code', 'value'),
          statusCode: toOptions(statuses, 'code', 'value'),
        }),
      )
      .catch((err) => {
        if (!isCancel(err)) console.error('Không tải được dữ liệu bộ lọc', err);
      });
    return () => controller.abort();
  }, []);

  // Không đổi thì trả lại state cũ -> không gọi lại API
  const applyName = (name: string) => onChange((prev) => (prev.name === name ? prev : { ...prev, name }));

  // Gõ tên: debounce 400ms
  useEffect(() => {
    const t = window.setTimeout(() => applyName(keyword.trim()), 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const keywordField = (
    <TextField
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="Tìm kiếm dự án"
      sx={{ ...fieldSx, flexGrow: 1, gridColumn: { xs: '1 / -1', lg: 'auto' } }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: isMobile ? 24 : 18, color: isMobile ? brand.blue : '#8c94a0' }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        applyName(keyword.trim());
      }}
      sx={
        isMobile
          ? { p: '16px 8px', background: brand.gradient }
          : {
              p: 3,
              borderRadius: '16px',
              background: brand.gradient,
              boxShadow: '0 0 16px 0 rgba(42, 82, 190, 0.2)',
            }
      }
    >
      {isMobile ? (
        // Mobile (Figma): hàng ô tìm kiếm + nút phễu/X; bấm nút thì dải xanh mở rộng tại chỗ, hiện lưới 2x2
        <>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            {keywordField}
            <IconButton
              aria-label={isFilterOpen ? 'Đóng bộ lọc' : 'Mở bộ lọc'}
              aria-expanded={isFilterOpen}
              aria-controls="mobile-filter-fields"
              onClick={() => setIsFilterOpen((open) => !open)}
              sx={{
                width: 46,
                height: 46,
                flexShrink: 0,
                borderRadius: '8px',
                bgcolor: '#fff',
                color: brand.blue,
                '&:hover': { bgcolor: brand.primary100 },
              }}
            >
              {isFilterOpen ? <CloseIcon /> : <FilterAltOutlinedIcon />}
            </IconButton>
          </Stack>
          <Collapse in={isFilterOpen} id="mobile-filter-fields">
            {/* Chọn là lọc ngay, cùng hành vi desktop */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', pt: 2 }}>
              <FilterFields value={value} onChange={onChange} options={options} />
            </Box>
          </Collapse>
        </>
      ) : (
        <Box
          sx={{
            display: 'grid',
            alignItems: 'center',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              lg: 'minmax(0, 2fr) repeat(4, minmax(0, 1fr))',
              xl: 'minmax(0, 1fr) repeat(4, 200px)',
            },
          }}
        >
          {keywordField}
          <FilterFields value={value} onChange={onChange} options={options} />
        </Box>
      )}
    </Box>
  );
}
