import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number; // 0-indexed
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalElements,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const from = totalElements === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalElements);

  const pages = () => {
    const range: number[] = [];
    const delta = 2;
    const left = Math.max(0, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    for (let i = left; i <= right; i++) range.push(i);
    return range;
  };

  return (
    <div className="pagination">
      <span>
        {totalElements === 0
          ? 'No results'
          : `Showing ${from}–${to} of ${totalElements}`}
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        {pages().map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p + 1}
          </button>
        ))}
        <button
          className="page-btn"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
