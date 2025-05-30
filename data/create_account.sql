CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(15) UNIQUE,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance_in_nrs FLOAT,
    created_date DATE,
    is_active BOOLEAN,
    role VARCHAR(10) CHECK (role IN ('normal_user', 'premium_user'))
);
