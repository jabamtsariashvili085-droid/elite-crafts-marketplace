
-- Table for main categories
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- e.g. 'granite'
    label_ka TEXT NOT NULL,
    label_en TEXT,
    label_ru TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for subcategories
CREATE TABLE IF NOT EXISTS public.product_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name TEXT REFERENCES public.product_categories(name) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. 'kitchen'
    label_ka TEXT NOT NULL,
    label_en TEXT,
    label_ru TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_name, name)
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_subcategories ENABLE ROW LEVEL SECURITY;

-- Dynamic policies for public read
CREATE POLICY "Allow public read on categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on subcategories" ON public.product_subcategories FOR SELECT USING (true);

-- Admin policies (assuming authenticated users are admins)
CREATE POLICY "Allow all on categories for authenticated" ON public.product_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all on subcategories for authenticated" ON public.product_subcategories FOR ALL USING (auth.role() = 'authenticated');

-- Initial seeding
INSERT INTO public.product_categories (name, label_ka, label_en, label_ru, sort_order)
VALUES 
    ('granite', 'გრანიტი', 'Granite', 'Гранит', 1),
    ('furniture', 'ავეჯი', 'Furniture', 'Мебель', 2),
    ('cnc', 'CNC', 'CNC', 'CNC', 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.product_subcategories (category_name, name, label_ka, label_en, label_ru, sort_order)
VALUES
    ('granite', 'kitchen', 'სამზარეულო', 'Kitchen', 'Кухня', 1),
    ('granite', 'bathroom', 'აბაზანა', 'Bathroom', 'Вანная', 2),
    ('granite', 'bar', 'ბარი', 'Bar', 'Бар', 3),
    ('granite', 'fireplace', 'ბუხარი', 'Fireplace', 'Камин', 4),
    ('furniture', 'living', 'მისაღები', 'Living Room', 'Гостиная', 1),
    ('furniture', 'bedroom', 'საძინებელი', 'Bedroom', 'Спальня', 2),
    ('furniture', 'kitchen', 'სამზარეულო', 'Kitchen', 'Куხნა', 3),
    ('furniture', 'dining', 'სასადილო', 'Dining Room', 'Столовая', 4),
    ('furniture', 'office', 'სამუშაო ოთახი', 'Office', 'Офис', 5),
    ('furniture', 'kids', 'ბავშვის ოთახი', 'Kids Room', 'Детская', 6),
    ('cnc', 'reception', 'რეცეფცია', 'Reception', 'Ресепшн', 1),
    ('cnc', 'wall', 'კედლის პანელი', 'Wall Panel', 'Настенная панель', 2),
    ('cnc', 'parametric', 'პარამეტრული დიზაინი', 'Parametric Design', 'Параметрический дизайн', 3),
    ('cnc', 'decor', 'დეკორაცია', 'Decor', 'Декор', 4),
    ('cnc', 'table', 'პარამეტრული მაგიდა', 'Parametric Table', 'Параметрический стол', 5)
ON CONFLICT (category_name, name) DO NOTHING;
