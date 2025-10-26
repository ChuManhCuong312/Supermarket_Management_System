// src/components/AddEditModal.js
import React from "react";

export default function AddEditModal({
    showAddBox,
    setShowAddBox,
    isEditing,
    newImport,
    handleSupplierSearch,
    errors,
    supplierSuggestions,
    handleSelectSupplier,
    handleNewChange,
    handleSaveImport,
}) {
    return (
        showAddBox && (
            <div className="modal-overlay" onClick={() => setShowAddBox(false)}>
                <div className="form-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="form-modal-header">
                        <h3>{isEditing ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}</h3>
                        <button className="close-btn" onClick={() => setShowAddBox(false)}>✕</button>
                    </div>
                    <form onSubmit={handleSaveImport}>
                        <div className="form-modal-body">
                            <div className="form-group">
                                <label>Tên Nhà cung cấp <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={newImport.supplierName}
                                    onChange={handleSupplierSearch}
                                    placeholder="Nhập tên nhà cung cấp để tìm kiếm"
                                    required
                                />
                                {errors.supplierName && <p className="error-text">{errors.supplierName}</p>}
                                {supplierSuggestions.length > 0 && (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', border: '1px solid #ddd', maxHeight: '150px', overflowY: 'auto' }}>
                                        {supplierSuggestions.map(supplier => (
                                            <li
                                                key={supplier.supplierId}
                                                onClick={() => handleSelectSupplier(supplier)}
                                                style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                            >
                                                {supplier.companyName} ({supplier.supplierId})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Ngày nhập <span className="required">*</span></label>
                                <input
                                    type="date"
                                    value={newImport.importDate}
                                    onChange={e => handleNewChange("importDate", e.target.value)}
                                    required
                                />
                                {errors.importDate && <p className="error-text">{errors.importDate}</p>}
                            </div>
                            <div className="form-group">
                                <label>Tổng tiền (₫) <span className="required">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newImport.totalAmount}
                                    onChange={e => handleNewChange("totalAmount", e.target.value)}
                                    placeholder="Nhập tổng tiền"
                                    required
                                />
                                {errors.totalAmount && <p className="error-text">{errors.totalAmount}</p>}
                            </div>
                            <div className="form-group">
                                <label>Trạng thái <span className="required">*</span></label>
                                <select
                                    value={newImport.status}
                                    onChange={e => handleNewChange("status", e.target.value)}
                                    required
                                >
                                    <option value="">-- Chọn trạng thái --</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                {errors.status && <p className="error-text">{errors.status}</p>}
                            </div>
                            <div className="form-group">
                                <label>Ghi chú</label>
                                <textarea
                                    value={newImport.note}
                                    onChange={e => handleNewChange("note", e.target.value)}
                                    placeholder="Nhập ghi chú (tùy chọn)"
                                    rows="3"
                                />
                                {errors.note && <p className="error-text">{errors.note}</p>}
                            </div>
                        </div>
                        <div className="form-modal-footer">
                            <button type="button" className="btn-cancel" onClick={() => setShowAddBox(false)}>
                                Hủy
                            </button>
                            <button type="submit" className="btn-save">
                                {isEditing ? "Cập nhật" : "Lưu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}