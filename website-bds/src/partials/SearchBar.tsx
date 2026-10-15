import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { investorApi } from '../api/investorApi';
import { masterDataApi } from '../api/masterDataApi';
import { GROUP_CODE } from '../utils/constants';
import type { Filters } from '../pages/HomePage';

interface Option {
  value: string;
  label: string;
}

type SelectKey = Exclude<keyof Filters, 'name'>;

const SELECTS: { key: SelectKey; placeholder: string }[] = [
  { key: 'investorId', placeholder: 'Tất cả chủ đầu tư' },
  { key: 'regionCode', placeholder: 'Tất cả khu vực' },
  { key: 'typeCode', placeholder: 'Tất cả loại hình' },
  { key: 'statusCode', placeholder: 'Tất cả trạng thái' },
];

// Ô trắng cao 46, bo 8, viền trong suốt, focus viền + bóng xanh
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 46,
    borderRadius: '8px',
    bgcolor: '#fff',
    fontSize: 14,
    color: '#495057',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: 'transparent' },
    '&.Mui-focused fieldset': { borderColor: '#1e56cf', borderWidth: 1 },
    '&.Mui-focused': { boxShadow: '0 0 0 2px rgba(30, 86, 207, 0.3)' },
  },
  '& input::placeholder': { color: '#8c94a0', opacity: 1 },
};

interface SearchBarProps {
  value: Filters;
  onChange: Dispatch<SetStateAction<Filters>>;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [keyword, setKeyword] = useState(value.name);
  const [options, setOptions] = useState<Record<SelectKey, Option[]>>({
    investorId: [],
    regionCode: [],
    typeCode: [],
    statusCode: [],
  });

  // Nạp dữ liệu cho 4 dropdown
  useEffect(() => {
    const toOptions = <T,>(list: T[], v: keyof T, l: keyof T): Option[] =>
      list.map((i) => ({ value: String(i[v]), label: String(i[l]) }));

    Promise.all([
      investorApi.getList(),
      masterDataApi.getByGroup(GROUP_CODE.REGION),
      masterDataApi.getByGroup(GROUP_CODE.TYPE),
      masterDataApi.getByGroup(GROUP_CODE.STATUS),
    ])
      .then(([investors, regions, types, statuses]) =>
        setOptions({
          investorId: toOptions(investors, 'id', 'name'),
          regionCode: toOptions(regions, 'code', 'value'),
          typeCode: toOptions(types, 'code', 'value'),
          statusCode: toOptions(statuses, 'code', 'value'),
        }),
      )
      .catch((err) => console.error('Không tải được dữ liệu bộ lọc', err));
  }, []);

  // Không đổi thì trả lại state cũ -> không gọi lại API
  const applyName = (name: string) => onChange((prev) => (prev.name === name ? prev : { ...prev, name }));

  // Gõ tên: debounce 400ms
  useEffect(() => {
    const t = window.setTimeout(() => applyName(keyword.trim()), 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        applyName(keyword.trim());
      }}
      sx={{
        p: 3,
        borderRadius: '16px',
        background: 'linear-gradient(90deg, #2a52be 0%, #00b4d8 100%)',
        boxShadow: '0 0 16px 0 rgba(42, 82, 190, 0.2)',
      }}
    >
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
        <TextField
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm dự án"
          sx={{ ...fieldSx, gridColumn: { xs: '1 / -1', lg: 'auto' } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#8c94a0' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {SELECTS.map(({ key, placeholder }) => (
          <FormControl key={key} sx={fieldSx}>
            <Select
              value={String(value[key])}
              displayEmpty
              onChange={(e) => onChange((prev) => ({ ...prev, [key]: e.target.value }))}
              inputProps={{ 'aria-label': placeholder }}
            >
              <MenuItem value="">{placeholder}</MenuItem>
              {options[key].map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>
    </Box>
  );
}
