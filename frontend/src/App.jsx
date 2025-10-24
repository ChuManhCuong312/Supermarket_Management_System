import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./modules/customer/CustomerList";
import EmployeeList from "./modules/employee/EmployeeList";
import OrderList from "./modules/order/OrderList";
import ImportList from "./modules/import/ImportList";
import OrderDetailList from "./modules/orderDetail/OrderDetailList";
import SupplierList from "./modules/supplier/SupplierList"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <Routes>
         <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/order-details" element={<OrderDetailList />} />
        <Route path="/imports" element={<ImportList />} />
        <Route path="/suppliers" element={<SupplierList />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}
