// src/components/SearchAndFilter.js
import React from "react";

export default function SearchAndFilter({
    searchSupplierName,
    setSearchSupplierName,
    handleSearchBySupplierName,
    isSearching,
    handleClearSearch,
    setShowAddBox,
    setIsEditing,
    setEditingId,
    setNewImport,
    setErrors,
    setSupplierSuggestions,
}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '1rem',
            gap: '1rem',
            flexWrap: 'wrap'
        }}>
            {/* Search by Supplier Name */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: '1',
                minWidth: '300px'
            }}>
                <label style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                    🔍 Tìm kiếm:
                </label>
                <input
                    type="text"
                    placeholder="Nhập tên nhà cung cấp..."
                    value={searchSupplierName}
                    onChange={(e) => setSearchSupplierName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchBySupplierName();
                        }
                    }}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px',
                        minWidth: '180px',
                        flex: '1'
                    }}
                />
                <button onClick={handleSearchBySupplierName} className="btn" style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                }}>
                    Tìm kiếm
                </button>
                {isSearching && (
                    <button onClick={handleClearSearch} className="btn" style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}>
                        ✕ Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Add Button */}
            <button
                onClick={() => {
                    setIsEditing(false);
                    setEditingId(null);
                    setNewImport({
                        supplierId: "",
                        supplierName: "",
                        importDate: "",
                        totalAmount: "",
                        status: "Pending",
                        note: "",
                    });
                    setErrors({});
                    setSupplierSuggestions([]);
                    setShowAddBox(true);
                }}
                className="btn add-btn"
                style={{
                    whiteSpace: 'nowrap'
                }}
            >
                ➕ Thêm mới
            </button>
        </div>
    );
}