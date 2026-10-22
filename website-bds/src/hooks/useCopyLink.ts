import { useCallback } from 'react';
import { useToast } from '../components/Toast';

// Nút "Chia sẻ": sao chép link (đường dẫn tương đối, ví dụ /du-an/abc-65), không chuyển trang
export function useCopyLink() {
  const showToast = useToast();

  return useCallback(
    async (path: string) => {
      try {
        await navigator.clipboard.writeText(location.origin + path);
        showToast('Đã sao chép liên kết dự án');
      } catch {
        showToast('Không thể sao chép liên kết', 'error');
      }
    },
    [showToast],
  );
}
