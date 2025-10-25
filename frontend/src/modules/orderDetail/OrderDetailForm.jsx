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
          setOrders(Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 10) : []);

          const productsRes = await axiosClient.get("/products");
          setProducts(Array.isArray(productsRes.data) ? productsRes.data.slice(0, 10) : []);
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? "Cập nhật Chi tiết Đơn hàng" : "Thêm Chi tiết Đơn hàng"}</h2>
        <form onSubmit={handleSubmit} className="orderdetail-form">
          {/* Order ID */}
          <div className="form-group">
            <label>Mã đơn hàng</label>
            <input
              list="orders-list"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              onFocus={() => {
                // ensure we have at least the first page of orders
                if (!orders || orders.length === 0) {
                  axiosClient
                    .get("http://localhost:8080/api/orders/active")
                    .then((res) => setOrders(Array.isArray(res.data) ? res.data.slice(0, 10) : []))
                    .catch(() => toast.error("❌ Lỗi khi tải danh sách đơn!"));
                }
              }}
              required
              autoComplete="off"
              placeholder="Nhập hoặc chọn mã đơn..."
              disabled={!!initialData}
            />
            {!initialData && (
              <datalist id="orders-list">
                {orders.map((o) => (
                  <option key={String(o.orderId)} value={String(o.orderId)}>
                    {`#${o.orderId} - Ngày: ${o.orderDate}`}
                  </option>
                ))}
              </datalist>
            )}
          </div>

          {/* Product ID */}
          <div className="form-group">
            <label>Sản phẩm</label>
            <input
              list="products-list"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              onFocus={() => {
                if (!products || products.length === 0) {
                  axiosClient
                    .get("http://localhost:8080/api/products")
                    .then((res) => setProducts(Array.isArray(res.data) ? res.data.slice(0, 10) : []))
                    .catch(() => toast.error("❌ Lỗi khi tải danh sách sản phẩm!"));
                }
              }}
              required
              placeholder="Chọn hoặc nhập sản phẩm..."
              autoComplete="off"
            />
            <datalist id="products-list">
              {products.map((p) => (
                <option key={String(p.productId)} value={String(p.productId)}>
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
