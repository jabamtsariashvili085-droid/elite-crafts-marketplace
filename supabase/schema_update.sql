-- Run this in your Supabase SQL Editor

-- 1. Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  author_name TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT FALSE
);

-- Enable RLS for Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for Reviews
CREATE POLICY "Allow public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- 2. Create Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT
);

-- Enable RLS for Articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policies for Articles
CREATE POLICY "Allow public read articles" ON articles FOR SELECT USING (true);
