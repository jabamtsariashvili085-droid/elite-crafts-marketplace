-- Insert 3 default hero slides (Granite, Furniture, CNC)
-- Run this in Supabase SQL Editor

INSERT INTO public.hero_slides 
(image, title_ka, title_en, title_ru, subtitle_ka, subtitle_en, subtitle_ru, link, sort_order)
VALUES
(
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop&q=80',
  'გრანიტი და ქვა', 'Granite & Stone', 'Гранит и камень',
  'უმაღლესი ხარისხის ბუნებრივი ქვის ნაკეთობები', 'Premium quality natural stone products', 'Изделия из натурального камня премиум-класса',
  '/granite',
  1
),
(
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop&q=80',
  'ავეჯი და დიზაინი', 'Furniture & Design', 'Мебель и дизайн',
  'თანამედროვე და კლასიკური ავეჯი თქვენი სახლისთვის', 'Modern and classic furniture for your home', 'Современная и классическая мебель для вашего дома',
  '/furniture',
  2
),
(
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&h=1080&fit=crop&q=80',
  'CNC სერვისი', 'CNC Services', 'Услуги ЧПУ',
  'ინოვაციური CNC ტექნოლოგიით დამზადებული დეკორაციები', 'Decorations made with innovative CNC technology', 'Декор, изготовленный с использованием инновационных технологий ЧПУ',
  '/cnc',
  3
);
