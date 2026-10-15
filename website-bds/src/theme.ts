import { createTheme } from '@mui/material/styles';

// Design token chuyển từ scss/_variables.scss (đã xoá) + mã Figma Inspect của các component.
// _variables.scss cũ chỉ "ước lượng từ ảnh" ($primary #1f57c3, gradient #2457c5 → #04b4dc)
// nên theme lấy mã Figma (#2a52be, #00b4d8).
export const brand = {
  blue: '#2a52be',
  cyan: '#00abdf',
  cyanDot: '#009ce4', // chấm slide đang chọn
  hot: '#ff383c', // Accents/Red
  upcoming: '#ff8d28', // Accents/Orange
  gradient: 'linear-gradient(90deg, #2a52be 0%, #00b4d8 100%)',
  primary100: '#eef0fd',
  grey100: '#f0f1f1',
  grey200: '#c9cacc',
  grey500: '#595a60',
  grey: '#7c7d84',
  textDark: '#38393d',
  border: '#e5e7eb',
} as const;

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
  }
  interface TypographyVariants {
    sectionHeading: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    sectionHeading?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    sectionHeading: true;
  }
}

// $container-max-widths của Bootstrap (padding-x = $container-padding-x / 2 = 1rem)
const containerMaxWidths = { sm: 540, md: 720, lg: 960, xl: 1140, xxl: 1440 } as const;

const baseTheme = createTheme({
  // Giữ mốc breakpoint của thiết kế cũ (Bootstrap): 768 / 992 / 1200 để layout không đổi
  breakpoints: {
    values: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 },
  },
  palette: {
    primary: { main: brand.blue, contrastText: '#ffffff' },
    secondary: { main: '#6b7280' }, // $secondary
    error: { main: '#e5252a' }, // $danger
    info: { main: '#19b5e5' }, // $brand-cyan
    text: { primary: '#1f2937', secondary: brand.grey },
    divider: brand.border,
    background: { default: '#ffffff', paper: '#ffffff' },
  },
  shape: { borderRadius: 6 }, // $border-radius
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif', // $font-family-sans-serif
    fontSize: 14,
    body1: { fontSize: '0.875rem', lineHeight: 1.5 }, // $font-size-base, line-height Bootstrap
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 500 },
    // Tiêu đề khu vực: DANH SÁCH DỰ ÁN / DỰ ÁN HOT / TIN TỨC (.section-heading)
    sectionHeading: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 24,
      fontWeight: 700,
      lineHeight: '29px',
      textTransform: 'uppercase',
      color: brand.blue,
      margin: 0,
    },
  },
});

export const theme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        a: { color: 'inherit' },
        img: { maxWidth: '100%' },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: { sectionHeading: 'h2' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    // Thay .container của Bootstrap: max-width tăng theo từng breakpoint
    MuiContainer: {
      defaultProps: { maxWidth: false },
      styleOverrides: {
        root: {
          paddingLeft: '1rem',
          paddingRight: '1rem',
          ...Object.fromEntries(
            Object.entries(containerMaxWidths).map(([bp, width]) => [
              baseTheme.breakpoints.up(bp as keyof typeof containerMaxWidths),
              { maxWidth: width, paddingLeft: '1rem', paddingRight: '1rem' },
            ]),
          ),
        },
      },
    },
  },
});
