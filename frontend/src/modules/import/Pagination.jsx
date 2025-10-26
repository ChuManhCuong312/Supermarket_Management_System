import React from "react";

export default function Pagination({
    page,
    totalPages,
    totalItems,
    isSearching,
    handlePageChange,
}) {
    return (
        <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 0 || isSearching}>
                ← Trước
            </button>
            <span>
                {isSearching ? (
                    `Kết quả tìm kiếm: ${totalItems} phiếu`
                ) : (
                    `Trang ${page + 1} / ${totalPages || 1} (${totalItems} phiếu)`
                )}
            </span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1 || totalPages === 0 || isSearching}>
                Sau →
            </button>
        </div>
    );
}