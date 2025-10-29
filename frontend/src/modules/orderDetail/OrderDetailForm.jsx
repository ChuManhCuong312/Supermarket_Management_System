import React, { useEffect, useState } from "react";
import OrderDetailService from "./orderDetailService";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import "../../styles/orderdetail.css";

export default function OrderDetailForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    orderId: "",
    productId: "",
    quantity: "",
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Prefill form if editing or reset when adding
  useEffect(() => {
    if (initialData) {
      setFormData({
        orderId: initialData.orderId ?? "",
        productId: initialData.productId ?? "",
        quantity: initialData.quantity ?? "",
      });
    } else {
      setFormData({ orderId: "", productId: "", quantity: "" });
    }
  }, [initialData]);

  // Fetch initial active orders & products
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch only active orders (deletedType = null)
        const ordersRes = await axiosClient.get("/orders/active");
        const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        setOrders(ordersData.slice(0, 10));
        console.log("Loaded orders:", ordersData.slice(0, 10));

        // Products endpoint returns: { data: [...], currentPage, totalItems, totalPages }
        const productsRes = await axiosClient.get("/products?page=1&size=50");
        const productsData = productsRes.data?.data || []; // Extract from 'data' field
        setProducts(Array.isArray(productsData) ? productsData.slice(0, 10) : []);
        console.log("Loaded products:", productsData.slice(0, 10));
      } catch (error) {
        toast.error("❌ Lỗi khi tải danh sách đơn hoặc sản phẩm");
        console.error(error);
      }
    };

    fetchInitialData();
  }, []);

  // Handle input changes + dynamic fetch for single order/product id
  const handleChange = async (e) => {
    const { name } = e.target;
    const rawValue = e.target.value ?? "";
    const value = rawValue.trim();

    // ✅ Handle quantity logic first
    if (name === "quantity") {
      if (value === "") {
        // Allow user to clear and retype
        setFormData((prev) => ({ ...prev, quantity: "" }));
        return;
      }

      const num = parseInt(value, 10);
      if (!isNaN(num) && num < 1) {
        // If < 1, reset immediately to 1
        setFormData((prev) => ({ ...prev, quantity: "1" }));
        toast.warn("⚠️ Số lượng phải lớn hơn hoặc bằng 1");
        return;
      }

      // Otherwise accept valid number
      setFormData((prev) => ({ ...prev, quantity: value }));
      return;
    }

    // update input text immediately
    setFormData((prev) => ({ ...prev, [name]: value }));

    // if user types an orderId not in current `orders` list, fetch it
    if (name === "orderId" && value !== "") {
      const intId = parseInt(value, 10);
      if (!Number.isNaN(intId) && !orders.find((o) => Number(o.orderId) === intId)) {
        try {
          // Fetch single active order by ID
          const res = await axiosClient.get(`/orders/active/${intId}`);
          // Check if the order is active
          if (res?.data) {
            if (res.data.deletedType !== null && res.data.deletedType !== undefined) {
              toast.error("❌ Đơn hàng này đã bị hủy hoặc ẩn. Vui lòng chọn đơn hàng khác!");
              setFormData((prev) => ({ ...prev, orderId: "" }));
              return;
            }
            setOrders((prev) => {
              if (prev.find((p) => Number(p.orderId) === Number(res.data.orderId))) return prev;
              return [...prev, res.data];
            });
          }
        } catch (err) {
          console.debug("Order not found or not active:", value, err?.response?.status);
          if (err?.response?.status === 404) {
            toast.warn("⚠️ Không tìm thấy đơn hàng hoạt động với mã này");
          }
        }
      }
    }

    // same behavior for productId: fetch single product if typed and not in list
    if (name === "productId" && value !== "") {
      const intId = parseInt(value, 10);
      if (!Number.isNaN(intId) && !products.find((p) => Number(p.productId) === intId)) {
        try {
          const res = await axiosClient.get(`/products/${intId}`);
          if (res?.data) {
            setProducts((prev) => {
              if (prev.find((p) => Number(p.productId) === Number(res.data.productId))) return prev;
              return [...prev, res.data];
            });
          }
        } catch (err) {
          console.debug("Product not found:", value, err?.response?.status);
        }
      }
    }
  };

  // submit handler (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the order is active before submitting
    const selectedOrder = orders.find(o => Number(o.orderId) === Number(formData.orderId));
    if (selectedOrder && selectedOrder.deletedType !== null && selectedOrder.deletedType !== undefined) {
      toast.error("❌ Không thể thao tác trên đơn hàng đã bị hủy hoặc ẩn!");
      return;
    }

    try {
      const payload = {
        orderId: parseInt(formData.orderId, 10),
        productId: parseInt(formData.productId, 10),
        quantity: parseInt(formData.quantity, 10),
      };

      if (initialData?.orderDetailId) {
        await OrderDetailService.updateOrderDetail(initialData.orderDetailId, payload);
        toast.success("✅ Cập nhật chi tiết đơn hàng thành công!");
      } else {
        await OrderDetailService.createOrderDetail(payload);
        toast.success("✅ Thêm chi tiết đơn hàng thành công!");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      // Better error message extraction
      let errorMsg = "Lỗi không xác định";
      if (error?.response?.data) {
        errorMsg = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || JSON.stringify(error.response.data);
      } else if (error?.message) {
        errorMsg = error.message;
      }
      toast.error(`❌ ${errorMsg}`);
    }
  };

  // Handler to load orders on focus
  const handleOrdersFocus = async () => {
    if (orders.length === 0 && !loadingOrders) {
      setLoadingOrders(true);
      try {
        const res = await axiosClient.get("/orders/active");
        const ordersData = Array.isArray(res.data) ? res.data : [];
        setOrders(ordersData.slice(0, 10));
      } catch (error) {
        toast.error("❌ Lỗi khi tải danh sách đơn!");
        console.error(error);
      } finally {
        setLoadingOrders(false);
      }
    }
  };

  // Handler to load products on focus
  const handleProductsFocus = async () => {
    if (products.length === 0 && !loadingProducts) {
      setLoadingProducts(true);
      try {
        const res = await axiosClient.get("/products?page=1&size=10");
        const productsData = res.data?.data || []; // Extract from 'data' field
        setProducts(Array.isArray(productsData) ? productsData.slice(0, 10) : []);
      } catch (error) {
        toast.error("❌ Lỗi khi tải danh sách sản phẩm!");
        console.error(error);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  return (
    <div className="orderdetail-modal-overlay">
      <div className="orderdetail-modal-content">
        <h2>{initialData ? "Cập nhật Chi tiết Đơn hàng" : "Thêm Chi tiết Đơn hàng"}</h2>
        <form onSubmit={handleSubmit} className="orderdetail-form">
          {/* Order ID */}
          <div className="form-group">
            <label>Mã đơn hàng *</label>
            <input
              list="orders-list"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              onFocus={handleOrdersFocus}
              required
              autoComplete="off"
              placeholder="Nhập hoặc chọn mã đơn..."
              disabled={!!initialData}
            />
            {!initialData && (
              <datalist id="orders-list">
                {orders.map((o) => (
                  <option key={`order-${o.orderId}`} value={String(o.orderId)}>
                    {`#${o.orderId} - Ngày: ${o.orderDate}`}
                  </option>
                ))}
              </datalist>
            )}
          </div>

          {/* Product ID */}
          <div className="form-group">
            <label>Sản phẩm *</label>
            <input
              list="products-list"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              onFocus={handleProductsFocus}
              required
              placeholder="Chọn hoặc nhập sản phẩm..."
              autoComplete="off"
            />
            <datalist id="products-list">
              {products.map((p) => (
                <option key={`product-${p.productId}`} value={String(p.productId)}>
                  {`${p.name} - (${p.productId})`}
                </option>
              ))}
            </datalist>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Số lượng *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={() => {
                // If user leaves blank → auto reset to 1
                if (formData.quantity === "") {
                  setFormData((prev) => ({ ...prev, quantity: "1" }));
                }
              }}
              required
              min={1}
              placeholder="Nhập số lượng"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              💾 {initialData ? "Cập nhật" : "Lưu"}
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