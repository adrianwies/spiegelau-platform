CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,


    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,


    description TEXT NULL,


    visible BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,


    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    UNIQUE KEY uq_categories_name (name),
    UNIQUE KEY uq_categories_slug (slug)
);




CREATE TABLE IF NOT EXISTS collections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,


    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,


    description TEXT NULL,


    visible BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,


    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    UNIQUE KEY uq_collections_name (name),
    UNIQUE KEY uq_collections_slug (slug)
);




