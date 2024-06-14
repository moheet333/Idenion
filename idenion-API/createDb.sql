CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT
);

CREATE TABLE ideas (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    videourl TEXT,
    description TEXT NOT NULL,
    author TEXT,
    areaofinterest TEXT[] NOT NULL,
    rating INT DEFAULT 0,
    numberofrating INT DEFAULT 0,
    thumbnail TEXT,
    publishdate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    userid INT REFERENCES users(id)
);

CREATE TABLE comments (
    commentid SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    commentdate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    userid INT REFERENCES users(id),
    ideaid INT REFERENCES ideas(id),
    likes INT[] DEFAULT '{}'
);