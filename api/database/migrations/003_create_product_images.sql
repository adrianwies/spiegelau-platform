CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,


    product_id BIGINT UNSIGNED NOT NULL,


    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,


    position INT NOT NULL DEFAULT 0,


    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,


    INDEX idx_product_images_product (product_id),
    INDEX idx_product_images_position (position)
);




