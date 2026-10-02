CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,


    sku VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,


    name VARCHAR(255) NOT NULL,
    channel VARCHAR(100) NULL,


    category_id BIGINT UNSIGNED NULL,
    collection_id BIGINT UNSIGNED NULL,


    presentation VARCHAR(255) NULL,


    short_description TEXT NULL,
    description LONGTEXT NULL,


    specifications JSON NULL,
    recommended_for JSON NULL,


    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    offer_price DECIMAL(10,2) NULL,
    stock INT NOT NULL DEFAULT 0,


    featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_new BOOLEAN NOT NULL DEFAULT FALSE,
    offer BOOLEAN NOT NULL DEFAULT FALSE,
    visible BOOLEAN NOT NULL DEFAULT TRUE,


    status ENUM(
        'draft',
        'published',
        'archived'
    ) NOT NULL DEFAULT 'draft',


    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,


    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    published_at DATETIME NULL,


    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,


    CONSTRAINT fk_products_collection
        FOREIGN KEY (collection_id)
        REFERENCES collections(id)
        ON DELETE SET NULL,


    INDEX idx_products_category_id (category_id),
    INDEX idx_products_collection_id (collection_id),
    INDEX idx_products_status (status),
    INDEX idx_products_visible (visible)
);




