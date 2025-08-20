import { useState, useMemo } from "react";
import { EXPLORER_CONSTANTS } from "../constants/explorer";

export const usePagination = <T>(
  items: T[],
  itemsPerPage: number = EXPLORER_CONSTANTS.TRANSACTIONS_PER_PAGE
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return {
      currentItems,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem: Math.min(indexOfLastItem, items.length),
      totalItems: items.length,
    };
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, paginationData.totalPages));
  };

  return {
    currentPage,
    ...paginationData,
    handlePageChange,
    handlePrevPage,
    handleNextPage,
  };
};
