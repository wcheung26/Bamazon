DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	price DECIMAL(11,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Bovi Flowers', 'Flowers', 129.00, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Fresh Roses', 'Flowers', 3.99, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Plastic Flowers', 'Flowers', 5.00, 28);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Drum Sticks', 'Music', 9.99, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Guitar', 'Music', 499.00, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Piano', 'Music', 2399.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Couch', 'Furniture', 89.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Desk', 'Furniture', 39.95, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Watch', 'Luxury', 2800.00, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Purse', 'Luxury', 3900.00, 30);

SELECT * FROM products;



CREATE TABLE departments (
	deparment_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	over_head_costs INTEGER(11) NOT NULL,
	PRIMARY KEY (deparment_id)
);

ALTER TABLE products
ADD product_sales INTEGER(11) DEFAULT 0;


INSERT INTO departments (department_name, over_head_costs)
VALUES ("Flowers", 800);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Music", 2300);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Furniture", 3000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Luxury", 4300);