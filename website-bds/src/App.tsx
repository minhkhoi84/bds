import { useState } from 'react';
import { ToastProvider } from './components/Toast';
import Header from './partials/Header';
import Hero from './partials/Hero';
import SearchBar from './partials/SearchBar';
import Footer from './partials/Footer';
import HomePage, { EMPTY_FILTERS, type Filters } from './pages/HomePage';

export default function App() {
  // SearchBar (trong Hero) và danh sách dự án dùng chung bộ lọc
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  return (
    <ToastProvider>
      <Header />
      <Hero>
        <SearchBar value={filters} onChange={setFilters} />
      </Hero>
      <HomePage filters={filters} />
      <Footer />
    </ToastProvider>
  );
}
