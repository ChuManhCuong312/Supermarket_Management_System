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
                                <label>
                                    Tên Nhà cung cấp <span className="required">*</span>
                                </label>
                                <div className="input-wrapper" style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type="text"
                                        value={newImport.supplierName}
                                        onChange={handleSupplierSearch}
                                        placeholder="Nhập tên nhà cung cấp"
                                        required
                                        autoComplete="off"
                                        style={{
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                    {errors.supplierName && (
                                        <p className="error-text" style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
                                            {errors.supplierName}
                                        </p>
                                    )}

                                    {supplierSuggestions.length > 0 && (
                                        <ul
                                            style={{
                                                listStyle: "none",
                                                padding: 0,
                                                margin: 0,
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                backgroundColor: "#fff",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                                maxHeight: "150px",
                                                overflowY: "auto",
                                                zIndex: 10,
                                            }}
                                        >
                                            {supplierSuggestions.map((supplier) => (
                                                <li
                                                    key={supplier.supplierId}
                                                    onClick={() => handleSelectSupplier(supplier)}
                                                    onMouseDown={(e) => e.preventDefault()} // tránh mất focus khi click
                                                    style={{
                                                        padding: "0.5rem",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #eee",
                                                    }}
                                                >
                                                    {supplier.companyName} ({supplier.supplierId})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Ngày nhập <span className="required">*</span></label>
                                <div className="input-wrapper">
                                    <input
                                        type="date"
                                        value={newImport.importDate}
                                        onChange={e => handleNewChange("importDate", e.target.value)}
                                        required
                                    />
                                    {errors.importDate && (
                                        <p className="error-text">{errors.importDate}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Tổng tiền (₫) <span className="required">*</span></label>
                                <div className="input-wrapper">
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
                                {errors.status && <p className="error-text" style={{ fontSize: 'small', color: 'red' }}>{errors.status}</p>}
                            </div>
                            <div className="form-group">
                                <label>Ghi chú</label>
                                <textarea
                                    value={newImport.note}
                                    onChange={e => handleNewChange("note", e.target.value)}
                                    placeholder="Nhập ghi chú (tùy chọn)"
                                    rows="3"
                                />
                                {errors.note && <p className="error-text" style={{ fontSize: 'small', color: 'red' }}>{errors.note}</p>}
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