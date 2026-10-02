CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) NOT NULL,


    expires BIGINT UNSIGNED NOT NULL,


    data MEDIUMTEXT NOT NULL,


    created_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,


    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    PRIMARY KEY (session_id),


    INDEX idx_sessions_expires (expires)
);




