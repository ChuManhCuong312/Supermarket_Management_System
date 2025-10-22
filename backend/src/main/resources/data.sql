-- ========== DỮ LIỆU MẪU ==========

-- SUPPLIER
INSERT INTO supplier (company_name, phone, email, address, contact_person) VALUES
('Công ty TNHH Vinamilk', '0901234567', 'contact@vinamilk.com', '12 Nguyễn Du, Q.1, TP.HCM', 'Nguyễn Văn An'),
('Công ty Acecook Việt Nam', '0902345678', 'info@acecook.vn', '25 Trần Hưng Đạo, TP.HCM', 'Trần Thị Hoa'),
('Công ty CP Masan Consumer', '0903456789', 'masan@masan.vn', '45 Nguyễn Văn Linh, TP.Đà Nẵng', 'Phạm Văn Bình'),
('Công ty TNHH PepsiCo VN', '0904567890', 'sales@pepsico.vn', '99 Phan Xích Long, Q.Phú Nhuận, TP.HCM', 'Lê Thị Hồng'),
('Công ty TNHH Orion Food', '0905678901', 'orion@orion.vn', '3 Pasteur, TP.HCM', 'Đặng Quang Vinh'),
('Công ty CP Tân Hiệp Phát', '0906789012', 'support@thp.com', '219 Đại Lộ Bình Dương, Bình Dương', 'Nguyễn Minh Hoàng'),
('Công ty TNHH CP Vissan', '0907890123', 'contact@vissan.com.vn', '420 Lê Hồng Phong, TP.HCM', 'Trần Văn Tài'),
('Công ty CP Ba Huân', '0908901234', 'bahuan@bahuan.vn', '22 Trường Chinh, TP.HCM', 'Phạm Ngọc Hân'),
('Công ty CP CP Việt Nam', '0909012345', 'info@cpvietnam.com', '56 Lê Văn Lương, Hà Nội', 'Trần Quốc Trung'),
('Công ty Ajinomoto Việt Nam', '0910123456', 'contact@ajinomoto.vn', '30 Nguyễn Thị Minh Khai, TP.HCM', 'Nguyễn Thanh Tùng'),
('Công ty Kinh Đô', '0911234567', 'sales@kinhdo.vn', '123 Nguyễn Trãi, TP.HCM', 'Lê Thị Huyền'),
('Công ty CP Bibica', '0912345678', 'contact@bibica.com', '10 Lê Lợi, TP.HCM', 'Phan Thanh Bình'),
('Công ty CP Ace Mart', '0913456789', 'info@acemart.vn', '27 Lê Duẩn, TP.HCM', 'Nguyễn Hữu Phước'),
('Công ty CP Vifon', '0914567890', 'support@vifon.vn', '72 Hoàng Hoa Thám, TP.HCM', 'Trần Minh Tâm'),
('Công ty CP TH True Milk', '0915678901', 'info@thmilk.vn', 'Tòa nhà TH, Q.Cầu Giấy, Hà Nội', 'Hoàng Lan Anh');

-- PRODUCT
INSERT INTO product (name, barcode, category, price, stock, supplier_id) VALUES
('Sữa tươi Vinamilk 1L', '893456700001', 'Sữa', 33000, 120, 1),
('Mì Hảo Hảo Tôm Chua Cay', '893456700002', 'Mì ăn liền', 4500, 500, 2),
('Nước mắm Nam Ngư 500ml', '893456700003', 'Gia vị', 22000, 200, 3),
('Pepsi lon 330ml', '893456700004', 'Đồ uống', 9000, 350, 4),
('Bánh Chocopie hộp 360g', '893456700005', 'Bánh kẹo', 45000, 150, 5),
('Trà xanh Không Độ 455ml', '893456700006', 'Đồ uống', 10000, 250, 6),
('Xúc xích Vissan 500g', '893456700007', 'Thực phẩm chế biến', 65000, 80, 7),
('Trứng gà Ba Huân hộp 10 trứng', '893456700008', 'Thực phẩm tươi sống', 38000, 90, 8),
('Thịt heo xay CP 500g', '893456700009', 'Thực phẩm tươi sống', 70000, 60, 9),
('Bột ngọt Ajinomoto 454g', '893456700010', 'Gia vị', 27000, 110, 10),
('Bánh trung thu Kinh Đô thập cẩm', '893456700011', 'Bánh kẹo', 52000, 50, 11),
('Kẹo dẻo Bibica 200g', '893456700012', 'Bánh kẹo', 25000, 70, 12),
('Nước rửa chén Sunlight 750ml', '893456700013', 'Hóa phẩm', 40000, 130, 13),
('Cháo ăn liền Vifon thịt bằm', '893456700014', 'Thực phẩm ăn liền', 15000, 140, 14),
('Sữa tươi TH True Milk 180ml', '893456700015', 'Sữa', 10000, 300, 15);

-- CUSTOMER
INSERT INTO customer (name, phone, email, address, membership_type, points) VALUES
('Nguyễn Thị Lan', '0909876543', 'lan.nguyen@gmail.com', '12 Nguyễn Trãi, TP.HCM', 'Vàng', 520),
('Trần Văn Hùng', '0912345670', 'hung.tran@yahoo.com', '45 Lý Thường Kiệt, Hà Nội', 'Bạc', 240),
('Phạm Thị Hạnh', '0938765432', 'hanh.pham@gmail.com', '67 Nguyễn Huệ, Đà Nẵng', 'Thường', 120),
('Lê Văn Minh', '0907654321', 'minh.le@gmail.com', '23 Trần Hưng Đạo, TP.HCM', 'Bạc', 310),
('Vũ Thị Hoa', '0912233445', 'hoa.vu@gmail.com', '5 Bạch Mai, Hà Nội', 'Vàng', 600),
('Ngô Văn Phúc', '0923344556', 'phuc.ngo@gmail.com', '77 Hai Bà Trưng, TP.HCM', 'Kim Cương', 1050),
('Đinh Thị Mai', '0903344556', 'mai.dinh@gmail.com', '89 Lê Duẩn, Đà Nẵng', 'Thường', 80),
('Trần Quốc Cường', '0934455667', 'cuong.tran@gmail.com', '12 Nguyễn Văn Cừ, TP.HCM', 'Bạc', 250),
('Hoàng Văn Quân', '0915566778', 'quan.hoang@gmail.com', '10 Nguyễn Tri Phương, Huế', 'Thường', 90),
('Phạm Thu Trang', '0926677889', 'trang.pham@gmail.com', '21 Võ Văn Kiệt, TP.HCM', 'Vàng', 580),
('Nguyễn Đức Anh', '0937788990', 'anh.nguyen@gmail.com', '9 Trần Bình Trọng, Hà Nội', 'Kim Cương', 1300),
('Lê Hồng Nhung', '0908899001', 'nhung.le@gmail.com', '33 Nguyễn Văn Linh, Đà Nẵng', 'Bạc', 270),
('Trần Minh Tâm', '0919900112', 'tam.tran@gmail.com', '54 Lê Lợi, TP.HCM', 'Thường', 60),
('Phan Quang Vinh', '0920011223', 'vinh.phan@gmail.com', '67 Phan Chu Trinh, Hà Nội', 'Bạc', 340),
('Đỗ Kim Oanh', '0931122334', 'oanh.do@gmail.com', '88 Pasteur, TP.HCM', 'Vàng', 470);

-- EMPLOYEE
INSERT INTO employee (name, position, phone, email, salary, shift) VALUES
('Nguyễn Văn Nam', 'Thu ngân', '0901122334', 'nam.nguyen@supermart.vn', 8500000, 'Ca sáng'),
('Trần Thị Hòa', 'Bán hàng', '0912233445', 'hoa.tran@supermart.vn', 7800000, 'Ca chiều'),
('Phạm Văn Dũng', 'Quản lý', '0923344556', 'dung.pham@supermart.vn', 15000000, 'Hành chính'),
('Lê Thị Mai', 'Bán hàng', '0934455667', 'mai.le@supermart.vn', 7800000, 'Ca tối'),
('Nguyễn Văn Tài', 'Kho hàng', '0945566778', 'tai.nguyen@supermart.vn', 9000000, 'Ca sáng'),
('Vũ Hồng Sơn', 'Bảo vệ', '0956677889', 'son.vu@supermart.vn', 6500000, 'Ca đêm'),
('Trần Quốc Huy', 'Thu ngân', '0967788990', 'huy.tran@supermart.vn', 8200000, 'Ca chiều'),
('Lê Thanh Hà', 'Bán hàng', '0978899001', 'ha.le@supermart.vn', 7800000, 'Ca sáng'),
('Phan Minh Tuấn', 'Quản lý', '0989900112', 'tuan.phan@supermart.vn', 15500000, 'Hành chính'),
('Đỗ Hồng Phúc', 'Kho hàng', '0990011223', 'phuc.do@supermart.vn', 9100000, 'Ca tối'),
('Nguyễn Thị Thu', 'Thu ngân', '0901123456', 'thu.nguyen@supermart.vn', 8300000, 'Ca sáng'),
('Phạm Anh Duy', 'Bảo vệ', '0912234567', 'duy.pham@supermart.vn', 6700000, 'Ca tối'),
('Lê Thị Hương', 'Bán hàng', '0923345678', 'huong.le@supermart.vn', 7700000, 'Ca chiều'),
('Trần Đức Mạnh', 'Kho hàng', '0934456789', 'manh.tran@supermart.vn', 8900000, 'Ca sáng'),
('Nguyễn Phương Thảo', 'Thu ngân', '0945567890', 'thao.nguyen@supermart.vn', 8400000, 'Ca tối');

-- ORDERS
INSERT INTO orders (customer_id, employee_id, order_date, total_amount, discount) VALUES
(1, 1, '2025-10-01', 125000, 5.0),
(2, 2, '2025-10-02', 78000, 0),
(3, 3, '2025-10-03', 98000, 10.0),
(4, 4, '2025-10-04', 55000, 0),
(5, 5, '2025-10-05', 320000, 15.0),
(6, 6, '2025-10-06', 110000, 0),
(7, 7, '2025-10-07', 42000, 0),
(8, 8, '2025-10-08', 255000, 5.0),
(9, 9, '2025-10-09', 120000, 0),
(10, 10, '2025-10-10', 65000, 0),
(11, 11, '2025-10-11', 190000, 5.0),
(12, 12, '2025-10-12', 75000, 0),
(13, 13, '2025-10-13', 285000, 10.0),
(14, 14, '2025-10-14', 300000, 5.0),
(15, 15, '2025-10-15', 115000, 0);

-- ORDER_DETAIL
INSERT INTO order_detail (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 33000),
(2, 2, 5, 4500),
(3, 4, 6, 9000),
(4, 3, 2, 22000),
(5, 5, 4, 45000),
(6, 6, 10, 10000),
(7, 8, 1, 38000),
(8, 9, 2, 70000),
(9, 10, 3, 27000),
(10, 11, 1, 52000),
(11, 12, 2, 25000),
(12, 13, 2, 40000),
(13, 14, 5, 15000),
(14, 15, 3, 10000),
(15, 7, 1, 65000);

-- IMPORT
INSERT INTO import (supplier_id, import_date, total_amount, status, note) VALUES
(1, '2025-09-28', 1500000, 'Completed', 'Nhập sữa Vinamilk'),
(2, '2025-09-29', 950000, 'Completed', 'Nhập mì Hảo Hảo'),
(3, '2025-09-30', 800000, 'Completed', 'Nhập nước mắm Nam Ngư'),
(4, '2025-10-01', 600000, 'Pending', 'Chờ nhập Pepsi'),
(5, '2025-10-02', 1200000, 'Completed', 'Nhập bánh Chocopie'),
(6, '2025-10-03', 850000, 'Completed', 'Nhập trà Không Độ'),
(7, '2025-10-04', 750000, 'Completed', 'Nhập xúc xích Vissan'),
(8, '2025-10-05', 900000, 'Completed', 'Nhập trứng Ba Huân'),
(9, '2025-10-06', 1150000, 'Pending', 'Chờ nhập thịt heo CP'),
(10, '2025-10-07', 500000, 'Completed', 'Nhập bột ngọt Ajinomoto'),
(11, '2025-10-08', 950000, 'Completed', 'Nhập bánh trung thu Kinh Đô'),
(12, '2025-10-09', 700000, 'Pending', 'Nhập kẹo Bibica'),
(13, '2025-10-10', 650000, 'Completed', 'Nhập nước rửa chén Sunlight'),
(14, '2025-10-11', 480000, 'Completed', 'Nhập cháo Vifon'),
(15, '2025-10-12', 1000000, 'Completed', 'Nhập sữa TH True Milk');
