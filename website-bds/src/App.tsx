import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { ToastProvider } from './components/Toast';
import Header from './partials/Header';
import Hero from './partials/Hero';
import SearchBar from './partials/SearchBar';
import Footer from './partials/Footer';
import HomePage, { EMPTY_FILTERS, type Filters } from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function Home() {
  // SearchBar (trong Hero) và danh sách dự án dùng chung bộ lọc
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  return (
    <>
      <Hero>
        <SearchBar value={filters} onChange={setFilters} />
      </Hero>
      <HomePage filters={filters} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/du-an/:slugId/:tab?" element={<ProjectDetailPage />} />
          <Route path="*" element={<Typography sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>Không tìm thấy trang</Typography>} />
        </Routes>
        <Footer />
      </ToastProvider>
    </BrowserRouter>
  );
}
