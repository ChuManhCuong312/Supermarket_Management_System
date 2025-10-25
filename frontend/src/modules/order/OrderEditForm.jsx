import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import OrderService from "./orderService";
import OrderDetailService from "../orderDetail/orderDetailService";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../../styles/order.css";

export default function OrderEditForm({ orderId, onSuccess, onCancel }) {
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    customerId: "",
    employeeId: "",
    orderDate: "",
    discount: "",
  });

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerInput, setCustomerInput] = useState("");
  const [employeeInput, setEmployeeInput] = useState("");

  // Order details state - existing and new
  const [existingOrderDetails, setExistingOrderDetails] = useState([]);
  const [newOrderDetails, setNewOrderDetails] = useState([]);
  const [deletedOrderDetailIds, setDeletedOrderDetailIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch order data and its details
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);

        // Fetch order
        const orderRes = await axiosClient.get(`/orders/active/${orderId}`);
        const order = orderRes.data;
        setOrderData(order);

        setFormData({
          customerId: order.customerId?.toString() ?? "",
          employeeId: order.employeeId?.toString() ?? "",
          orderDate: order.orderDate ?? "",
          discount: order.discount?.toString() ?? "",
        });

        // Fetch order details
        const detailsRes = await OrderDetailService.searchOrderDetailsByPage(
          orderId,
          null,
          0,
          100
        );
        setExistingOrderDetails(detailsRes.content || []);

        // Fetch customers, employees, products
        const [custRes, empRes, prodRes] = await Promise.all([
          axiosClient.get("/customers?page=1&size=10"),
          axiosClient.get("/employees?page=0&size=10"),
          axiosClient.get("/products"),
        ]);

        const customersData = custRes.data.data || [];
        const employeesData = empRes.data.data || [];
        const productsData = Array.isArray(prodRes.data)
          ? prodRes.data
          : (prodRes.data.data || []);

        setCustomers(customersData);
        setEmployees(employeesData);
        // Only show first 10 products initially
        setProducts(productsData.slice(0, 10));

        // Set display inputs
        const customer = customersData.find(c => c.id === order.customerId);
        if (customer) {
          setCustomerInput(customer.id.toString());
        }

        const employee = employeesData.find(e => e.id === order.employeeId);
        if (employee) {
          setEmployeeInput(employee.id.toString());
        }

      } catch (error) {
        toast.error("❌ Lỗi khi tải thông tin đơn hàng");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const handleCustomerChange = async (e) => {
    const value = e.target.value;
    const idMatch = value.match(/^\d+/);
    const inputId = idMatch ? parseInt(idMatch[0], 10) : null;

    if (inputId && !isNaN(inputId)) {
      setCustomerInput(inputId.toString());
      setFormData(prev => ({ ...prev, customerId: inputId.toString() }));

      const existingCustomer = customers.find(c => c.id === inputId);
      if (!existingCustomer) {
        try {
          const res = await axiosClient.get(`/customers/${inputId}`);
          if (res?.data) {
            setCustomers(prev => {
              if (prev.find(c => c.id === res.data.id)) return prev;
              return [...prev, res.data];
            });
          }
        } catch (err) {
          console.debug("Customer not found:", inputId);
        }
      }
    } else {
      setCustomerInput(value);
      setFormData(prev => ({ ...prev, customerId: "" }));
    }
  };

  const handleEmployeeChange = async (e) => {
    const value = e.target.value;
    const idMatch = value.match(/^\d+/);
    const inputId = idMatch ? parseInt(idMatch[0], 10) : null;

    if (inputId && !isNaN(inputId)) {
      setEmployeeInput(inputId.toString());
      setFormData(prev => ({ ...prev, employeeId: inputId.toString() }));

      const existingEmployee = employees.find(emp => emp.id === inputId);
      if (!existingEmployee) {
        try {
          const res = await axiosClient.get(`/employees/${inputId}`);
          if (res?.data) {
            setEmployees(prev => {
              if (prev.find(e => e.id === res.data.id)) return prev;
              return [...prev, res.data];
            });
          }
        } catch (err) {
          console.debug("Employee not found:", inputId);
        }
      }
    } else {
      setEmployeeInput(value);
      setFormData(prev => ({ ...prev, employeeId: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle existing order detail changes
  const handleExistingDetailChange = (index, field, value) => {
    const newDetails = [...existingOrderDetails];
    if (field === "quantity") {
      newDetails[index].quantity = parseInt(value) || 1;
    }
    setExistingOrderDetails(newDetails);
  };

  // Delete existing order detail (mark for deletion, don't delete immediately)
  const handleDeleteExistingDetail = (orderDetailId, index) => {
    // Mark for deletion
    setDeletedOrderDetailIds(prev => [...prev, orderDetailId]);

    // Remove from UI
    const updatedDetails = existingOrderDetails.filter((_, i) => i !== index);
    setExistingOrderDetails(updatedDetails);

    toast.info("🗑️ Đã đánh dấu xóa. Nhấn 'Cập nhật' để lưu thay đổi.");
  };

  // Handle new order detail product change
  const handleNewDetailProductChange = async (index, value) => {
    const newDetails = [...newOrderDetails];
    newDetails[index].productInput = value;

    let inputId = null;
    const formatMatch = value.match(/\((\d+)\)$/);
    if (formatMatch) {
      inputId = parseInt(formatMatch[1], 10);
    } else {
      const directMatch = value.match(/^\d+/);
      if (directMatch) {
        inputId = parseInt(directMatch[0], 10);
      }
    }

    if (inputId && !isNaN(inputId)) {
      newDetails[index].productId = inputId.toString();

      const existingProduct = products.find(p => p.productId === inputId);
      if (existingProduct) {
        newDetails[index].unitPrice = existingProduct.price || 0;
      } else {
        // Product not in list, fetch it
        try {
          const res = await axiosClient.get(`/products/${inputId}`);
          if (res?.data) {
            setProducts(prev => {
              if (prev.find(p => p.productId === res.data.productId)) return prev;
              return [...prev, res.data];
            });
            newDetails[index].unitPrice = res.data.price || 0;
          }
        } catch (err) {
          console.debug("Product not found:", inputId);
          toast.warn(`⚠️ Không tìm thấy sản phẩm với mã ${inputId}`);
        }
      }
    } else {
      newDetails[index].productId = "";
      newDetails[index].unitPrice = 0;
    }

    setNewOrderDetails(newDetails);
  };

  const handleNewDetailQuantityChange = (index, value) => {
    const newDetails = [...newOrderDetails];
    newDetails[index].quantity = parseInt(value) || 1;
    setNewOrderDetails(newDetails);
  };

  const handleAddNewDetail = () => {
    setNewOrderDetails([
      ...newOrderDetails,
      { productId: "", productInput: "", quantity: 1, unitPrice: 0 }
    ]);
  };

  const handleRemoveNewDetail = (index) => {
    const newDetails = newOrderDetails.filter((_, i) => i !== index);
    setNewOrderDetails(newDetails);
  };

  // Calculate total amount for display
  const calculateTotal = () => {
    // Sum existing order details
    const existingTotal = existingOrderDetails.reduce(
      (sum, detail) => sum + (detail.quantity * detail.unitPrice),
      0
    );

    // Sum new order details
    const newTotal = newOrderDetails.reduce(
      (sum, detail) => sum + (detail.quantity * detail.unitPrice),
      0
    );

    const subtotal = existingTotal + newTotal;
    const discount = parseFloat(formData.discount) || 0;
    return subtotal - (subtotal * discount / 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId || !formData.employeeId) {
      toast.error("❌ Vui lòng chọn khách hàng và nhân viên hợp lệ!");
      return;
    }

    // Show confirmation dialog using react-confirm-alert
    const confirmMessage =
      `Số chi tiết đơn hàng hiện tại: ${existingOrderDetails.length}\n` +
      `Số chi tiết đơn hàng sẽ xóa: ${deletedOrderDetailIds.length}\n` +
      `Số chi tiết đơn hàng mới: ${newOrderDetails.filter(d => d.productId).length}`;

    confirmAlert({
      title: "Xác nhận cập nhật đơn hàng",
      message: confirmMessage,
      buttons: [
        {
          label: "Có, cập nhật",
          onClick: async () => {
            try {
              // Update order basic info
              const orderPayload = {
                customerId: parseInt(formData.customerId, 10),
                employeeId: parseInt(formData.employeeId, 10),
                orderDate: formData.orderDate,
                discount: parseFloat(formData.discount) || 0,
              };

              await OrderService.updateOrder(orderId, orderPayload);

              // Delete marked order details
              for (const orderDetailId of deletedOrderDetailIds) {
                await OrderDetailService.deleteOrderDetail(orderDetailId);
              }

              // Update existing order details
              for (const detail of existingOrderDetails) {
                const payload = {
                  orderId: orderId,
                  productId: detail.productId,
                  quantity: detail.quantity,
                };
                await OrderDetailService.updateOrderDetail(detail.orderDetailId, payload);
              }

              // Add new order details
              const validNewDetails = newOrderDetails.filter(
                detail => detail.productId && detail.quantity > 0
              );

              for (const detail of validNewDetails) {
                const payload = {
                  orderId: orderId,
                  productId: parseInt(detail.productId, 10),
                  quantity: detail.quantity,
                  unitPrice: detail.unitPrice,
                  totalPrice: detail.quantity * detail.unitPrice,
                };
                await OrderDetailService.createOrderDetail(payload);
              }

              toast.success("✅ Cập nhật đơn hàng thành công!");
              if (onSuccess) onSuccess();
            } catch (error) {
              console.error(error);
              toast.error("❌ Lỗi khi cập nhật đơn hàng!");
            }
          }
        },
        {
          label: "Không",
          onClick: () => {
            toast.info("Đã hủy cập nhật.");
          }
        }
      ]
    });
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
        <style>{`
          .react-confirm-alert-overlay {
            z-index: 10000 !important;
          }
          .react-confirm-alert {
            z-index: 10001 !important;
          }
        `}</style>
        <h2>✏️ Cập nhật Đơn hàng #{orderId}</h2>
        <form onSubmit={handleSubmit} className="order-form">
          {/* Order ID - Read Only */}
          <div className="form-group">
            <label>Mã đơn hàng</label>
            <input
              type="text"
              value={orderId}
              readOnly
              style={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}
            />
          </div>

          {/* Customer */}
          <div className="form-group">
            <label>Khách hàng *</label>
            <input
              list="customer-list"
              value={customerInput}
              onChange={handleCustomerChange}
              required
              autoComplete="off"
              placeholder="Nhập hoặc chọn mã khách hàng"
            />
            <datalist id="customer-list">
              {customers.map((c) => (
                <option
                  key={`customer-${c.id}`}
                  value={`${c.id} - ${c.name} (${c.phone})`}
                />
              ))}
            </datalist>
          </div>

          {/* Employee */}
          <div className="form-group">
            <label>Nhân viên *</label>
            <input
              list="employee-list"
              value={employeeInput}
              onChange={handleEmployeeChange}
              required
              autoComplete="off"
              placeholder="Nhập hoặc chọn mã nhân viên"
            />
            <datalist id="employee-list">
              {employees
                .filter((e) => e && e.id !== undefined && e.id !== null)
                .map((e) => (
                  <option
                    key={`employee-${e.id}`}
                    value={`${e.id} - ${e.name} (${e.phone})`}
                  />
                ))}
            </datalist>
          </div>

          {/* Order Date */}
          <div className="form-group">
            <label>Ngày mua *</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Discount */}
          <div className="form-group">
            <label>Giảm giá (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <hr style={{ margin: "20px 0", border: "1px solid #ddd" }} />

          {/* Existing Order Details */}
          <h3>🛒 Chi tiết đơn hàng hiện tại</h3>
          {existingOrderDetails.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
              Không có chi tiết đơn hàng. Nhấn "Thêm sản phẩm mới" bên dưới để thêm sản phẩm.
            </p>
          ) : (
            existingOrderDetails.map((detail, index) => (
              <div key={detail.orderDetailId} style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0 }}>Chi tiết #{detail.orderDetailId}</h4>
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingDetail(detail.orderDetailId, index)}
                    style={{
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                    title="Đánh dấu xóa (sẽ xóa khi nhấn Cập nhật)"
                  >
                    🗑️ Xóa
                  </button>
                </div>

                <div className="form-group">
                  <label>Mã sản phẩm</label>
                  <input
                    type="text"
                    value={detail.productId}
                    readOnly
                    style={{ backgroundColor: "#e0e0e0" }}
                  />
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "10px"
                }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      Số lượng *
                    </label>
                    <input
                      type="number"
                      value={detail.quantity}
                      onChange={(e) => handleExistingDetailChange(index, "quantity", e.target.value)}
                      min="1"
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      Đơn giá
                    </label>
                    <input
                      type="text"
                      value={detail.unitPrice.toLocaleString() + "đ"}
                      readOnly
                      style={{
                        backgroundColor: "#f0f0f0",
                        width: "100%",
                        padding: "10px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                        textAlign: "right"
                      }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold", fontSize: "16px" }}>
                  Thành tiền: {(detail.quantity * detail.unitPrice).toLocaleString()}đ
                </div>
              </div>
            ))
          )}

          {/* New Order Details */}
          {newOrderDetails.length > 0 && (
            <>
              <h3 style={{ marginTop: "20px" }}>➕ Thêm sản phẩm mới</h3>
              {newOrderDetails.map((detail, index) => (
                <div key={index} style={{
                  border: "1px solid #4CAF50",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f1f8f4"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h4 style={{ margin: 0 }}>Sản phẩm mới #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewDetail(index)}
                      style={{
                        background: "#ff4444",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "3px",
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Mã sản phẩm *</label>
                    <input
                      list={`new-product-list-${index}`}
                      value={detail.productInput}
                      onChange={(e) => handleNewDetailProductChange(index, e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="Nhập hoặc chọn sản phẩm"
                      style={{ width: "100%", padding: "10px", fontSize: "15px" }}
                    />
                    <datalist id={`new-product-list-${index}`}>
                      {products
                        .filter((p) => p && p.productId !== undefined && p.productId !== null)
                        .map((p) => (
                          <option
                            key={`product-${p.productId}`}
                            value={`${p.name} - (${p.productId})`}
                          />
                        ))}
                    </datalist>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginBottom: "10px"
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                        Số lượng *
                      </label>
                      <input
                        type="number"
                        value={detail.quantity}
                        onChange={(e) => handleNewDetailQuantityChange(index, e.target.value)}
                        min="1"
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                        Đơn giá
                      </label>
                      <input
                        type="text"
                        value={detail.unitPrice.toLocaleString() + "đ"}
                        readOnly
                        style={{
                          backgroundColor: "#f0f0f0",
                          width: "100%",
                          padding: "10px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          boxSizing: "border-box",
                          textAlign: "right"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold", fontSize: "16px" }}>
                    Thành tiền: {(detail.quantity * detail.unitPrice).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </>
          )}

          <button
            type="button"
            onClick={handleAddNewDetail}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "20px"
            }}
          >
            ➕ Thêm sản phẩm mới
          </button>

          {/* Total Amount Display */}
          <div style={{
            backgroundColor: "#e3f2fd",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold" }}>
              <span>Tổng cộng:</span>
              <span>{calculateTotal().toLocaleString()}đ</span>
            </div>
            {formData.discount > 0 && (
              <div style={{ fontSize: "14px", color: "#666", marginTop: "5px", textAlign: "right" }}>
                (Đã áp dụng giảm giá {formData.discount}%)
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              💾 Cập nhật
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