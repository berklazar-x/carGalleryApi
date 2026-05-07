-- ============================================================
-- CarGallery - Neon PostgreSQL Schema
-- Bu dosyayı Neon SQL Editor'da çalıştırın
-- ============================================================

-- Brands tablosu
CREATE TABLE IF NOT EXISTS "Brands" (
    "Id"          SERIAL PRIMARY KEY,
    "BrandName"   TEXT NOT NULL,
    "IsDeleted"   BOOLEAN NOT NULL DEFAULT FALSE,
    "UpdateDate"  TIMESTAMP,
    "CreatedDate" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Users tablosu
CREATE TABLE IF NOT EXISTS "Users" (
    "Id"           SERIAL PRIMARY KEY,
    "Username"     TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role"         TEXT NOT NULL DEFAULT 'user',
    "CreatedDate"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreateUserId" INTEGER NOT NULL DEFAULT 0,
    "UpdateDate"   TIMESTAMP,
    "UpdateUserId" INTEGER,
    "IsActive"     BOOLEAN NOT NULL DEFAULT TRUE,
    "IsDeleted"    BOOLEAN NOT NULL DEFAULT FALSE
);

-- Cars tablosu
CREATE TABLE IF NOT EXISTS "Cars" (
    "Id"           SERIAL PRIMARY KEY,
    "BrandId"      INTEGER REFERENCES "Brands"("Id") ON DELETE RESTRICT,
    "Model"        TEXT NOT NULL,
    "Year"         INTEGER NOT NULL,
    "Price"        NUMERIC NOT NULL,
    "ImageUrl"     TEXT,
    "Color"        TEXT,
    "Stock"        INTEGER NOT NULL DEFAULT 0,
    "ImageUrls"    TEXT,
    "CreatedDate"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreateUserId" INTEGER NOT NULL DEFAULT 0,
    "UpdateDate"   TIMESTAMP,
    "UpdateUserId" INTEGER,
    "IsActive"     BOOLEAN NOT NULL DEFAULT TRUE,
    "IsDeleted"    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS "IX_Cars_BrandId" ON "Cars"("BrandId");

-- Favorites tablosu
CREATE TABLE IF NOT EXISTS "Favorites" (
    "Id"           SERIAL PRIMARY KEY,
    "UserId"       INTEGER NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "CarId"        INTEGER NOT NULL REFERENCES "Cars"("Id") ON DELETE CASCADE,
    "AddedPrice"   NUMERIC NOT NULL DEFAULT 0,
    "CreatedDate"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreateUserId" INTEGER NOT NULL DEFAULT 0,
    "UpdateDate"   TIMESTAMP,
    "UpdateUserId" INTEGER,
    "IsActive"     BOOLEAN NOT NULL DEFAULT TRUE,
    "IsDeleted"    BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE("UserId", "CarId")
);
