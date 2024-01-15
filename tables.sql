-- Ovdje samo čuvam podatke o tabelama

CREATE TABLE shoppers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shopper_name VARCHAR(255) NOT NULL
);

CREATE TABLE shopping_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    stock_count INT NOT NULL DEFAULT 0 CHECK (stock_count >= 0), -- Broj proizvoda 
    CONSTRAINT item_name UNIQUE (name) -- Jedinstveno ime za proizvod
);

CREATE TABLE shopping_lists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shopper_id INT NOT NULL,
    item_id INT NOT NULL,
    list_name VARCHAR(255),
    FOREIGN KEY (shopper_id) REFERENCES shoppers(id),
    FOREIGN KEY (item_id) REFERENCES shopping_items(id),
    CONSTRAINT shopper_item UNIQUE (shopper_id, item_id) -- Moze jedan proizvod po korisniku 
);