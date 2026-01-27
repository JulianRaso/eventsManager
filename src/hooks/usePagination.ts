import { useMemo, useState } from "react";

interface UsePaginationProps<T> {
  data: T[] | undefined;
  limit?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  pages: number[];
  currentItems: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export default function usePagination<T>({
  data,
  limit = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil((data?.length ?? 0) / limit),
    [data?.length, limit]
  );

  const pages = useMemo(() => {
    const pagesArray: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }, [totalPages]);

  const currentItems = useMemo(() => {
    if (!data) return [];
    const lastIndex = currentPage * limit;
    const firstIndex = lastIndex - limit;
    return data.slice(firstIndex, lastIndex);
  }, [data, currentPage, limit]);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    pages,
    currentItems,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
  };
}
