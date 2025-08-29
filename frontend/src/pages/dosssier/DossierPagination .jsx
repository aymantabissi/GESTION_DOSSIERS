import React from 'react';
import { Pagination } from 'react-bootstrap';

const DossierPagination = ({ currentPage, totalPages, onPageChange, darkMode }) => {
  if (totalPages <= 1) return null;

  const paginationItems = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) endPage = Math.min(5, totalPages);
  if (currentPage > totalPages - 3) startPage = Math.max(totalPages - 4, 1);

  for (let page = startPage; page <= endPage; page++) {
    paginationItems.push(
      <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
        {page}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className={darkMode ? 'pagination-dark justify-content-center mt-3' : 'justify-content-center mt-3'}>
      <Pagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />
      {startPage > 1 && <>
        <Pagination.Item onClick={() => onPageChange(1)}>1</Pagination.Item>
        {startPage > 2 && <Pagination.Ellipsis />}
      </>}
      {paginationItems}
      {endPage < totalPages && <>
        {endPage < totalPages - 1 && <Pagination.Ellipsis />}
        <Pagination.Item onClick={() => onPageChange(totalPages)}>{totalPages}</Pagination.Item>
      </>}
      <Pagination.Next disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} />
    </Pagination>
  );
};

export default DossierPagination;
