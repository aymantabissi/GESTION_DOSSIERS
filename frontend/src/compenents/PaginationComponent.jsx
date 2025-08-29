import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ totalItems, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null; // Ma kaynch pagination ila page wa7da

  const pageNumbers = [...Array(totalPages).keys()].map(n => n + 1);

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1} 
      />
      <Pagination.Prev 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
      {pageNumbers.map(number => (
        <Pagination.Item
          key={number}
          active={currentPage === number}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
      />
      <Pagination.Last 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages} 
      />
    </Pagination>
  );
};

export default PaginationComponent;
