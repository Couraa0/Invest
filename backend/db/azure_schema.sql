-- ==========================================
-- INVESTAI - AZURE SQL DATABASE SCHEMA
-- ==========================================

-- 1. USERS & PROFILES
CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL, -- Nullable for Google Login
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(MAX) NULL,
    auth_provider VARCHAR(50) DEFAULT 'local', -- 'local' or 'google'
    google_id VARCHAR(255) NULL UNIQUE,
    risk_profile VARCHAR(50) DEFAULT 'Moderat', -- Konservatif, Moderat, Agresif
    membership_level VARCHAR(50) DEFAULT 'Basic', -- Basic, Pro, Premium
    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. PAPER TRADING (SIMULATOR)
-- ==========================================

CREATE TABLE Portfolios (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
    cash_balance DECIMAL(18, 2) NOT NULL DEFAULT 100000000.00, -- Default saldo awal 100 juta
    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Holdings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    portfolio_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Portfolios(id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL, -- Contoh: BBCA, GOTO
    average_price DECIMAL(18, 2) NOT NULL,
    total_lots INT NOT NULL DEFAULT 0,
    updated_at DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_Portfolio_Stock UNIQUE (portfolio_id, stock_symbol)
);

CREATE TABLE Transactions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    portfolio_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Portfolios(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL')),
    stock_symbol VARCHAR(10) NOT NULL,
    lot_count INT NOT NULL,
    price_per_share DECIMAL(18, 2) NOT NULL,
    total_value DECIMAL(18, 2) NOT NULL, -- lot_count * 100 * price_per_share
    transaction_date DATETIME2 DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. ACADEMY
-- ==========================================

CREATE TABLE Courses (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50), -- Pemula, Menengah, Mahir
    is_premium BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Course_Modules (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    course_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_body TEXT,
    sequence_order INT NOT NULL,
    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE User_Course_Progress (
    user_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
    course_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Courses(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Enrolled', -- Enrolled, Completed
    progress_percentage INT DEFAULT 0,
    last_accessed DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id)
);

CREATE TABLE User_Watched_Videos (
    user_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
    video_id VARCHAR(50) NOT NULL,
    watched_at DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, video_id)
);

-- ==========================================
-- 4. MENTORSHIP (AI CHAT)
-- ==========================================

CREATE TABLE Mentorship_Sessions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Session',
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Mentorship_Messages (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    session_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Mentorship_Sessions(id) ON DELETE CASCADE,
    sender_role VARCHAR(50) NOT NULL CHECK (sender_role IN ('user', 'ai', 'system')),
    content TEXT NOT NULL,
    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
);
