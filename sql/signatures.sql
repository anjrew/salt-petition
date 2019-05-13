-- We we are going to set up the tabl we'll need for parts 1 and 2

DROP TABLE if EXISTS  signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL
);

