CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,


    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,


    active BOOLEAN NOT NULL DEFAULT TRUE,


    last_login_at DATETIME NULL,


    created_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,


    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    UNIQUE KEY uq_admin_users_username (username),


    INDEX idx_admin_users_active (active)
);




