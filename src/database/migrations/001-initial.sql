CREATE TABLE bakers (
  id VARCHAR PRIMARY KEY,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  rating REAL DEFAULT(0),
  collectionStart INTEGER NOT NULL,
  collectionEnd INTEGER NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL
);

CREATE TABLE members (
  id VARCHAR PRIMARY KEY,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL
);

CREATE TABLE products (
  id VARCHAR PRIMARY KEY,
  type VARCHAR NOT NULL,
  duration INTEGER NOT NULL,
  bakerId VARCHAR NOT NULL,
  FOREIGN KEY (bakerId) REFERENCES bakers (id)
);

CREATE TABLE orders (
  id VARCHAR PRIMARY KEY,
  memberId VARCHAR NOT NULL,
  bakerId VARCHAR NOT NULL,
  productId VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  payment VARCHAR NOT NULL,
  collectionTime INTEGER NOT NULL,
  FOREIGN KEY (memberId) REFERENCES member (id)
  FOREIGN KEY (bakerId) REFERENCES baker (id)
  FOREIGN KEY (productId) REFERENCES product (id)
);