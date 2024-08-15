env info:
PORT=3005
JWT_SECRET=MEGAGIGA
JWT_EXPIRES=300d

/...User table.../
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL, 
    role VARCHAR(50)
);

-- Category table
CREATE TABLE categories (
    categoryid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Types table
CREATE TABLE types (
    typeid SERIAL PRIMARY KEY,
    name VARCHAR(50)  NOT NULL UNIQUE
);

-- Excursions table
CREATE TABLE tours (
    tourid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categoryid INT REFERENCES categories(categoryid) ON DELETE SET NULL,
    duration INTERVAL NOT NULL,
    description TEXT,
    image VARCHAR(255),
    max_participants INT DEFAULT 15 
);


-- Excursion prices table
CREATE TABLE tour_prices (
    priceid SERIAL PRIMARY KEY,
    tourid INT REFERENCES tours(tourid) ON DELETE CASCADE,
    typeid INT REFERENCES types(typeid) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL
);


CREATE TABLE group_pricing (
    group_pricingid SERIAL PRIMARY KEY,
    tourid INT REFERENCES tours(tourid) ON DELETE CASCADE,
    base_price DECIMAL(10, 2) NOT NULL,
    additional_price DECIMAL(10, 2) NOT NULL,
    
);


-- Excursion dates table
CREATE TABLE tour_dates (
    dateid SERIAL PRIMARY KEY,
    tourid INT REFERENCES tours(tourid) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    
);



CREATE TABLE reservations (
    reservationid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    tourid INT REFERENCES tours(tourid) ON DELETE CASCADE,
    dateid INT REFERENCES tour_dates(dateid) ON DELETE CASCADE,
    number_of_people INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE reservations
ADD CONSTRAINT fk_dateid
FOREIGN KEY (dateid)
REFERENCES tour_dates(dateid)
ON UPDATE CASCADE;


-- Create the comments table
CREATE TABLE comments (
    commentid SERIAL PRIMARY KEY,
    tourid INT NOT NULL,
    userid INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourid) REFERENCES tours(tourid) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

-- Create the ratings table with updated constraints
CREATE TABLE ratings (
    ratingid SERIAL PRIMARY KEY,
    tourid INT NOT NULL,
    userid INT NOT NULL,
    rating NUMERIC(2, 1) CHECK (rating IN (1.0, 2.0, 3.0, 4.0, 5.0)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commentid INT,
    FOREIGN KEY (tourid) REFERENCES tours(tourid) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (commentid) REFERENCES comments(commentid) ON DELETE CASCADE
);



