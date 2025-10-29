import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import OrderService from "./orderService";
import { toast } from "react-toastify";

export default function DeleteOrderModal({ orderId, onSuccess, onCancel }) {
  const handleCancel = async () => {
    confirmAlert({
      title: "Xác nhận hủy đơn hàng",
      message: "Hủy đơn hàng sẽ hoàn trả số lượng sản phẩm về kho. Bạn có chắc chắn?",
      buttons: [
        {
          label: "Có, hủy đơn hàng",
          onClick: async () => {
            try {
              await OrderService.cancelOrder(orderId);
              toast.success("✅ Đã hủy đơn hàng và hoàn trả kho!");
              if (onSuccess) onSuccess();
            } catch (error) {
              console.error(error);
              toast.error("❌ Lỗi khi hủy đơn hàng!");
            }
          }
        },
        {
          label: "Không",
          onClick: () => {}
        }
      ]
    });
  };

  const handleHide = async () => {
    confirmAlert({
      title: "Xác nhận lưu trữ đơn hàng",
      message: "Lưu trữ đơn hàng sẽ KHÔNG hoàn trả số lượng sản phẩm. Bạn có chắc chắn?",
      buttons: [
        {
          label: "Có, lưu trữ",
          onClick: async () => {
            try {
              await OrderService.hideOrder(orderId);
              toast.success("✅ Đã lưu trữ đơn hàng!");
              if (onSuccess) onSuccess();
            } catch (error) {
              console.error(error);
              toast.error("❌ Lỗi khi lưu trữ đơn hàng!");
            }
          }
        },
        {
          label: "Không",
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <style>{`
          .react-confirm-alert-overlay {
            z-index: 10000 !important;
          }
          .react-confirm-alert {
            z-index: 10001 !important;
          }
        `}</style>
        <h2>Xóa đơn hàng #{orderId}</h2>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Vui lòng chọn phương thức xóa:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "15px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            🔄 Hủy đơn hàng (Hoàn trả kho)
          </button>

          <button
            onClick={handleHide}
            style={{
              padding: "15px",
              backgroundColor: "#9e9e9e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            📦 Lưu trữ đơn hàng (Không hoàn trả)
          </button>

          <button
            onClick={onCancel}
            style={{
              padding: "15px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            ❌ Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}