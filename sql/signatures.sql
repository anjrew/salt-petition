-- We we are going to set up the tabl we'll need for parts 1 and 2

DROP TABLE if EXISTS  signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    -- Only use before part 3.
    -- first VARCHAR(255) NOT NULL,
    -- last VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL,
    user_id INT NOT NULL UNIQUE
);

