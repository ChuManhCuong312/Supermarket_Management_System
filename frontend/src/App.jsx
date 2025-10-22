import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./modules/customer/CustomerList";
import EmployeeList from "./modules/employee/EmployeeList";
import ImportList from "./modules/import/ImportList";
import OrderDetailList from "./modules/orderDetail/OrderDetailList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Trang chính</h1>} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/imports" element={<ImportList />} />
        <Route path="/orderdetails" element={<OrderDetailList />} />
      </Routes>
    </Router>
  );
}
