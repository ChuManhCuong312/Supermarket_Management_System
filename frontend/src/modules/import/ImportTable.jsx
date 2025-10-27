import React from "react";
export default function ImportTable({
    imports,
    supplierNames,
    handleSortByDate,
    sortDate,
    handleSortByAmount,
    sortAmount,
    handleEdit,
    handleDelete,
}) {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID Nhà cung cấp</th>
                        <th>Tên Nhà cung cấp</th>
                        <th
                            style={{ cursor: "pointer", userSelect: "none" }}
                            onClick={handleSortByDate}
                        >
                            Ngày nhập{" "}
                            <span style={{ fontSize: "14px" }}>
                                {sortDate === "asc" ? "▲" : "▼"}
                            </span>
                        </th>
                        <th
                            style={{ cursor: "pointer", userSelect: "none" }}
                            onClick={handleSortByAmount}
                        >
                            Tổng tiền{" "}
                            <span style={{ fontSize: "14px" }}>
                                {sortAmount === "asc" ? "▲" : "▼"}
                            </span>
                        </th>
                        <th>Trạng thái</th>
                        <th>Ghi chú</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {imports.length > 0 ? imports.map(i => (
                        <tr key={i.importId}>
                            <td>{i.importId}</td>
                            <td>{i.supplier_id}</td>
                            <td>{supplierNames[i.supplier_id] || "Đang tải..."}</td>
                            <td>{new Date(i.import_date).toLocaleDateString("vi-VN")}</td>
                            <td>{parseFloat(i.total_amount)?.toLocaleString("vi-VN")} ₫</td>
                            <td>
                                <span className={`status-badge status-${i.status?.toLowerCase()}`}>
                                    {i.status}
                                </span>
                            </td>
                            <td>{i.note}</td>
                            <td>
                                <div className="action-buttons">
                                    <button onClick={() => handleEdit(i)} className="edit-btn" title="Chỉnh sửa">
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(i.importId)} className="delete-btn" title="Xóa">
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="8" className="no-data">Không có dữ liệu nhập kho</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}