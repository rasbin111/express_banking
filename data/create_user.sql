CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password VARCHAR(200) NOT NULL DEFAULT 'password',
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    secret_mfa TEXT,
    role VARCHAR(20) CHECK (role in ('admin', 'moderator', 'normal_user'))
);