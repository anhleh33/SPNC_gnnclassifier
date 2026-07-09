CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password BYTEA NOT NULL,
    avatar_color CHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE classification_analyses (
    id SERIAL PRIMARY KEY,

    -- 👇 new human-readable identifier
    public_code TEXT NOT NULL UNIQUE,

    user_id INTEGER NOT NULL,

    image_path TEXT NOT NULL, -- 🔑 reference only

    label TEXT NOT NULL,
    confidence FLOAT NOT NULL,

    subject TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    grade INTEGER NOT NULL,

    model_variant TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE TABLE subject_sequences (
    subject_code TEXT PRIMARY KEY,
    last_number INTEGER NOT NULL
);