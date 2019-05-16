CREATE TABLE user_profiles(
    id SERIAL PRIMARY key,
    city VARCHAR(255),
    age INT,
    url VARCHAR(255),
    user_id INTEGER NOT NULL REFERENCES (users.id) UNIQUE
);