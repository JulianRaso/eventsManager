import { useEffect, useMemo, useState } from "react";

export type PageSize = number | null;

interface UsePaginationProps<T> {
  data: T[] | undefined;
  /** Cantidad por página. `null` = sin límite (mostrar todo). */
  limit?: PageSize;
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
  /** true cuando hay más de una página (útil para ocultar controles). */
  isPaginated: boolean;
}

export default function usePagination<T>({
  data,
  limit = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const showAll = limit == null || limit <= 0;
  const pageSize = showAll ? Math.max(data?.length ?? 0, 1) : limit;

  const totalPages = useMemo(() => {
    if (showAll) return 1;
    return Math.max(1, Math.ceil((data?.length ?? 0) / pageSize));
  }, [data?.length, pageSize, showAll]);

  // Si cambia el límite o los datos y la página actual queda fuera de rango
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const pages = useMemo(() => {
    const pagesArray: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }, [totalPages]);

  const currentItems = useMemo(() => {
    if (!data) return [];
    if (showAll) return data;
    const lastIndex = currentPage * pageSize;
    const firstIndex = lastIndex - pageSize;
    return data.slice(firstIndex, lastIndex);
  }, [data, currentPage, pageSize, showAll]);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const isPaginated = !showAll && (data?.length ?? 0) > pageSize;

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
    isPaginated,
  };
}
