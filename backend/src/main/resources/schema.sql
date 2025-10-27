CREATE DATABASE supermarket_management;
USE supermarket_management;

-- 1. SUPPLIER
CREATE TABLE supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100) NOT NULL
);

-- 2. PRODUCT
CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(12,2) CHECK (price >= 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
    supplier_id INT,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- 3. CUSTOMER
CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) CHECK (LENGTH(phone) >= 9),
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255),
    membership_type VARCHAR(50) DEFAULT 'Thường',
    points INT DEFAULT 0
);

-- 4. EMPLOYEE
CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    phone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    salary DECIMAL(12,2) CHECK (salary >= 0),
    shift VARCHAR(50)
);

-- 5. ORDERS
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    order_date DATE NOT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0,
    discount DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- 6. ORDER_DETAIL
CREATE TABLE order_detail (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT CHECK (quantity > 0),
    unit_price DECIMAL(12,2) CHECK (unit_price >= 0),
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- 7. IMPORT
CREATE TABLE import (
    import_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    import_date DATE NOT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pending',
    note TEXT,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
        ON UPDATE CASCADE ON DELETE SET NULL
);
CREATE TABLE import2 (
    import_id INT AUTO_INCREMENT PRIMARY KEY,
    import_date DATE NOT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0 CHECK (total_amount >= 0),
    note TEXT
);
CREATE TABLE import_detail2 (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    import_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

    FOREIGN KEY (import_id) REFERENCES import2(import_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
/////trigger
DELIMITER $$

CREATE TRIGGER trg_update_product_stock_after_import
AFTER INSERT ON import_detail2
FOR EACH ROW
BEGIN
    UPDATE product
    SET stock = stock + NEW.quantity
    WHERE product_id = NEW.product_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER trg_update_product_stock_after_import_delete
AFTER DELETE ON import_detail2
FOR EACH ROW
BEGIN
    UPDATE product
    SET stock = stock - OLD.quantity
    WHERE product_id = OLD.product_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER trg_update_product_stock_after_import_update
AFTER UPDATE ON import_detail2
FOR EACH ROW
BEGIN
    UPDATE product
    SET stock = stock - OLD.quantity + NEW.quantity
    WHERE product_id = NEW.product_id;
END$$

DELIMITER ;

