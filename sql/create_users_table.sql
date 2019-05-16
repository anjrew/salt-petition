DROP TABLE if EXISTS  users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR,
    created_at CURRENT_TIMESTAMP(),
);