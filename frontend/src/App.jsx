import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
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
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/order-details" element={<OrderDetailList />} />
        <Route path="/imports" element={<ImportList />} />
        <Route path="/suppliers" element={<SupplierList />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
