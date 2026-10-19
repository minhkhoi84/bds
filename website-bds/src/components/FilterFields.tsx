import type { Dispatch, SetStateAction } from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { Filters } from '../pages/HomePage';

export interface Option {
  value: string;
  label: string;
}

export type SelectKey = Exclude<keyof Filters, 'name'>;

export type FilterOptions = Record<SelectKey, Option[]>;

export const SELECTS: { key: SelectKey; placeholder: string }[] = [
  { key: 'investorId', placeholder: 'Tất cả chủ đầu tư' },
  { key: 'regionCode', placeholder: 'Tất cả khu vực' },
  { key: 'typeCode', placeholder: 'Tất cả loại hình' },
  { key: 'statusCode', placeholder: 'Tất cả trạng thái' },
];

// Ô trắng cao 46, bo 8, viền trong suốt, focus viền + bóng xanh
export const fieldSx = {
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

interface FilterFieldsProps {
  value: Filters;
  onChange: Dispatch<SetStateAction<Filters>>;
  options: FilterOptions;
}

// 4 dropdown dùng chung cho lưới desktop và lưới mở rộng trên mobile (trả về fragment để nằm thẳng trong grid/Stack của nơi gọi)
export default function FilterFields({ value, onChange, options }: FilterFieldsProps) {
  return (
    <>
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
    </>
  );
}
