-- We we are going to set up the tabl we'll need for parts 1 and 2

DROP TABLE if EXISTS  signatures;
CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    user_id INT NOT NULL UNIQUE
);


