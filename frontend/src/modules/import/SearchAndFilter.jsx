import React from "react";

export default function SearchAndFilter({
    searchSupplierName,
    setSearchSupplierName,
    searchSupplierId,
    setSearchSupplierId,
    handleSearchBySupplierName,
    handleSearchBySupplierId,
    isSearching,
    handleClearSearch,
    setShowAddBox,
    setIsEditing,
    setEditingId,
    setNewImport,
    setErrors,
    setSupplierSuggestions,
}) {
    const handleSearch = () => {
        const id = searchSupplierId.trim();
        const name = searchSupplierName.trim();
        if (id !== "") {
            handleSearchBySupplierId();
        } else if (name !== "") {
            handleSearchBySupplierName();
        } else {
            // Assuming showModal is available, but since it's not in props, you may need to adjust
            // For now, alert as placeholder
            alert("Vui lòng nhập ID hoặc tên nhà cung cấp để tìm kiếm.");
        }
    };

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
            {/* Search Inputs */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: '2',
                minWidth: '600px'
            }}>
                <label style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                    🔍 Tìm kiếm
                </label>
                <input
                    type="text"
                    placeholder="Nhập ID nhà cung cấp..."
                    value={searchSupplierId}
                    onChange={(e) => setSearchSupplierId(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
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
                <input
                    type="text"
                    placeholder="Nhập tên nhà cung cấp..."
                    value={searchSupplierName}
                    onChange={(e) => setSearchSupplierName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
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
                <button onClick={handleSearch} className="btn" style={{
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
                    whiteSpace: 'nowrap',
                    color: 'white',
                    backgroundColor: '#10b981',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                ➕ Thêm mới
            </button>
        </div>
    );
}