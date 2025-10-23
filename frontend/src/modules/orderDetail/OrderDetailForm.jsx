import React, { useEffect, useState } from "react";
import OrderDetailService from "./orderDetailService";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import "../../styles/orderdetail.css";

export default function OrderDetailForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    orderId: "",
    productId: "",
    quantity: "",
  });

  const [orders, setOrders] = useState([]); // first 10 active orders
  const [products, setProducts] = useState([]); // first 10 products

  // Fetch first 10 orders and products on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const ordersRes = await axiosClient.get(
          "http://localhost:8080/api/orders/active"
        );
        setOrders(ordersRes.data.slice(0, 10));

        const productsRes = await axiosClient.get(
          "http://localhost:8080/api/products"
        );
        setProducts(productsRes.data.slice(0, 10));
      } catch (error) {
        toast.error("❌ Lỗi khi tải danh sách đơn hoặc sản phẩm");
        console.error(error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Dynamic fetch for orderId or productId if typed outside first 10
    if (name === "orderId" && value) {
      if (!orders.find((o) => o.orderId === parseInt(value))) {
        try {
          const res = await axiosClient.get(
            `http://localhost:8080/api/orders/active/${value}`
          );
          setOrders((prev) => [...prev, res.data]);
        } catch (err) {
          console.warn("Order not found:", value);
        }
      }
    }

    if (name === "productId" && value) {
      if (!products.find((p) => p.productId === parseInt(value))) {
        try {
          const res = await axiosClient.get(
            `http://localhost:8080/api/products/${value}`
          );
          setProducts((prev) => [...prev, res.data]);
        } catch (err) {
          console.warn("Product not found:", value);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDetail = {
        orderId: parseInt(formData.orderId),
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
      };

      await OrderDetailService.createOrderDetail(newDetail);
      toast.success("✅ Thêm chi tiết đơn hàng thành công!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi thêm chi tiết đơn hàng!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thêm Chi tiết Đơn hàng</h2>
        <form onSubmit={handleSubmit} className="orderdetail-form">
          {/* Order ID */}
          <div className="form-group">
            <label>Mã đơn hàng</label>
            <input
              list="orders-list"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              required
              placeholder="Chọn hoặc nhập mã đơn..."
            />
            <datalist id="orders-list">
              {orders.map((o) => (
                <option key={o.orderId} value={o.orderId}>
                  {`#${o.orderId} - Ngày: ${o.orderDate}`}
                </option>
              ))}
            </datalist>
          </div>

          {/* Product ID */}
          <div className="form-group">
            <label>Sản phẩm</label>
            <input
              list="products-list"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              placeholder="Chọn hoặc nhập sản phẩm..."
            />
            <datalist id="products-list">
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {`${p.name} - (${p.productId})`}
                </option>
              ))}
            </datalist>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min={1}
              placeholder="Nhập số lượng"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              💾 Lưu
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              ❌ Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
