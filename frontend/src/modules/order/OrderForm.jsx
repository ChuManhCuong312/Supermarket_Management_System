import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import OrderService from "./orderService";
import OrderDetailService from "../orderDetail/orderDetailService";
import { toast } from "react-toastify";
import "../../styles/order.css";

export default function OrderForm({ initialData, onSuccess, onCancel }) {
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

  // Order details state
  const [orderDetails, setOrderDetails] = useState([
    { productId: "", productInput: "", quantity: 1, unitPrice: 0 }
  ]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [custRes, empRes, prodRes] = await Promise.all([
          axiosClient.get("/customers?page=1&size=50"),
          axiosClient.get("/employees?page=0&size=50"),
          axiosClient.get("/products"),
        ]);
        setCustomers(custRes.data.data || []);
        setEmployees(empRes.data.data || []);
        // Handle products response - it might be an array directly
        const productsData = Array.isArray(prodRes.data)
          ? prodRes.data
          : (prodRes.data.data || []);
        setProducts(productsData);
      } catch (error) {
        toast.error("❌ Lỗi khi tải danh sách");
        console.error(error);
      }
    };
    fetchInitialData();
  }, []);

  // Handle initial data for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId?.toString() ?? "",
        employeeId: initialData.employeeId?.toString() ?? "",
        orderDate: initialData.orderDate ?? "",
        discount: initialData.discount?.toString() ?? "",
      });

      // Set display text for customer
      if (initialData.customerId && customers.length > 0) {
        const customer = customers.find(c => c.id === initialData.customerId);
        if (customer) {
          setCustomerInput(customer.id.toString());
        } else {
          axiosClient.get(`/customers/${initialData.customerId}`)
            .then(res => {
              if (res?.data) {
                setCustomers(prev => [...prev, res.data]);
                setCustomerInput(res.data.id.toString());
              }
            })
            .catch(() => {
              setCustomerInput(initialData.customerId.toString());
            });
        }
      }

      // Set display text for employee
      if (initialData.employeeId && employees.length > 0) {
        const employee = employees.find(e => e.id === initialData.employeeId);
        if (employee) {
          setEmployeeInput(employee.id.toString());
        } else {
          axiosClient.get(`/employees/${initialData.employeeId}`)
            .then(res => {
              if (res?.data) {
                setEmployees(prev => [...prev, res.data]);
                setEmployeeInput(res.data.id.toString());
              }
            })
            .catch(() => {
              setEmployeeInput(initialData.employeeId.toString());
            });
        }
      }
    } else {
      setFormData({
        customerId: "",
        employeeId: "",
        orderDate: "",
        discount: "",
      });
      setCustomerInput("");
      setEmployeeInput("");
    }
  }, [initialData, customers.length, employees.length]);

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
              if (prev.find(c => c.id === res.data.id)) {
                return prev;
              }
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
              if (prev.find(e => e.id === res.data.id)) {
                return prev;
              }
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

  // Handle product change for order details
  const handleProductChange = async (index, value) => {
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].productInput = value;

    // Extract ID from format "Name - (ID)" or just "ID"
    let inputId = null;

    // Try to match "Name - (ID)" format
    const formatMatch = value.match(/\((\d+)\)$/);
    if (formatMatch) {
      inputId = parseInt(formatMatch[1], 10);
    } else {
      // Try direct ID input
      const directMatch = value.match(/^\d+/);
      if (directMatch) {
        inputId = parseInt(directMatch[0], 10);
      }
    }

    if (inputId && !isNaN(inputId)) {
      newOrderDetails[index].productId = inputId.toString();

      const existingProduct = products.find(p => p.productId === inputId);

      if (existingProduct) {
        newOrderDetails[index].unitPrice = existingProduct.price || 0;
      } else {
        try {
          const res = await axiosClient.get(`/products/${inputId}`);
          if (res?.data) {
            setProducts(prev => {
              if (prev.find(p => p.productId === res.data.productId)) {
                return prev;
              }
              return [...prev, res.data];
            });
            newOrderDetails[index].unitPrice = res.data.price || 0;
          }
        } catch (err) {
          console.debug("Product not found:", inputId);
        }
      }
    } else {
      newOrderDetails[index].productId = "";
      newOrderDetails[index].unitPrice = 0;
    }

    setOrderDetails(newOrderDetails);
  };

  // Handle quantity change
  const handleQuantityChange = (index, value) => {
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].quantity = parseInt(value) || 1;
    setOrderDetails(newOrderDetails);
  };

  // Add new order detail row
  const handleAddOrderDetail = () => {
    setOrderDetails([
      ...orderDetails,
      { productId: "", productInput: "", quantity: 1, unitPrice: 0 }
    ]);
  };

  // Remove order detail row
  const handleRemoveOrderDetail = (index) => {
    if (orderDetails.length === 1) {
      toast.warn("⚠️ Phải có ít nhất một sản phẩm!");
      return;
    }
    const newOrderDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(newOrderDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId || !formData.employeeId) {
      toast.error("❌ Vui lòng chọn khách hàng và nhân viên hợp lệ!");
      return;
    }

    // Validate order details
    const validOrderDetails = orderDetails.filter(
      detail => detail.productId && detail.quantity > 0
    );

    if (validOrderDetails.length === 0) {
      toast.error("❌ Vui lòng thêm ít nhất một sản phẩm!");
      return;
    }

    try {
      const orderPayload = {
        customerId: parseInt(formData.customerId, 10),
        employeeId: parseInt(formData.employeeId, 10),
        orderDate: formData.orderDate,
        discount: parseFloat(formData.discount) || 0,
      };

      let savedOrder;

      if (initialData?.orderId) {
        // Update existing order
        await OrderService.updateOrder(initialData.orderId, orderPayload);
        savedOrder = { orderId: initialData.orderId };
        toast.success("✅ Cập nhật đơn hàng thành công!");
      } else {
        // Create new order
        savedOrder = await OrderService.createOrder(orderPayload);
        toast.success("✅ Thêm đơn hàng thành công!");

        // Add order details
        for (const detail of validOrderDetails) {
          const orderDetailPayload = {
            orderId: savedOrder.orderId,
            productId: parseInt(detail.productId, 10),
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            totalPrice: detail.quantity * detail.unitPrice,
          };

          await OrderDetailService.createOrderDetail(orderDetailPayload);
        }

        toast.success(`✅ Đã thêm ${validOrderDetails.length} sản phẩm vào đơn hàng!`);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi lưu đơn hàng!");
    }
  };

  // Calculate total for display
  const calculateTotal = () => {
    const subtotal = orderDetails.reduce(
      (sum, detail) => sum + (detail.quantity * detail.unitPrice),
      0
    );
    const discount = parseFloat(formData.discount) || 0;
    return subtotal - (subtotal * discount / 100);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
        <h2>{initialData ? "✏️ Cập nhật Đơn hàng" : "➕ Thêm Đơn hàng mới"}</h2>
        <form onSubmit={handleSubmit} className="order-form">
          {/* Customer */}
          <div className="form-group">
            <label>Khách hàng *</label>
            <input
              list="customer-list"
              name="customerInput"
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
              name="employeeInput"
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

          {/* Order Details Section */}
          {!initialData && (
            <>
              <hr style={{ margin: "20px 0", border: "1px solid #ddd" }} />
              <h3>🛒 Chi tiết đơn hàng</h3>

              {orderDetails.map((detail, index) => (
                <div key={index} style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h4 style={{ margin: 0 }}>Sản phẩm #{index + 1}</h4>
                    {orderDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOrderDetail(index)}
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
                    )}
                  </div>

                  <div className="form-group">
                    <label>Mã sản phẩm *</label>
                    <input
                      list={`product-list-${index}`}
                      value={detail.productInput}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      onFocus={() => {
                        if (products.length === 0) {
                          axiosClient
                            .get("/products")
                            .then((res) => {
                              const productsData = Array.isArray(res.data)
                                ? res.data
                                : (res.data.data || []);
                              setProducts(productsData);
                            })
                            .catch(() => toast.error("❌ Lỗi khi tải danh sách sản phẩm"));
                        }
                      }}
                      required
                      autoComplete="off"
                      placeholder="Nhập hoặc chọn sản phẩm"
                      style={{ width: "100%", padding: "10px", fontSize: "15px" }}
                    />
                    <datalist id={`product-list-${index}`}>
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
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
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

              <button
                type="button"
                onClick={handleAddOrderDetail}
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
                ➕ Thêm sản phẩm
              </button>

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
              </div>
            </>
          )}

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