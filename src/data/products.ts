export interface Product {
  id: string;
  category: 'granite' | 'furniture' | 'cnc';
  subcategory: string;
  title_ka: string;
  title_ru: string;
  title_en: string;
  description_ka: string;
  description_ru: string;
  description_en: string;
  price: number;
  dimensions: string;
  material: string;
  image: string;
  images?: string[] | null;
  featured: boolean;
}

export const products: Product[] = [
  // Granite - Kitchen
  { id: '1', category: 'granite', subcategory: 'kitchen', title_ka: 'თეთრი მარმარილოს ნიჟარა', title_ru: 'Белая мраморная столешница', title_en: 'White Marble Countertop', description_ka: 'მაღალი ხარისხის თეთრი მარმარილოს ნიჟარა', description_ru: 'Высококачественная белая мраморная столешница', description_en: 'High quality white marble countertop', price: 2500, dimensions: '240x60x3 cm', material: 'Marble', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', featured: true },
  { id: '2', category: 'granite', subcategory: 'kitchen', title_ka: 'შავი გრანიტის ნიჟარა', title_ru: 'Чёрная гранитная столешница', title_en: 'Black Granite Countertop', description_ka: 'ელეგანტური შავი გრანიტის ნიჟარა', description_ru: 'Элегантная чёрная гранитная столешница', description_en: 'Elegant black granite countertop', price: 3200, dimensions: '300x65x3 cm', material: 'Granite', image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop', featured: true },
  { id: '3', category: 'granite', subcategory: 'kitchen', title_ka: 'ნაცრისფერი გრანიტი', title_ru: 'Серый гранит', title_en: 'Grey Granite Countertop', description_ka: 'თანამედროვე ნაცრისფერი გრანიტის ნიჟარა', description_ru: 'Современная серая гранитная столешница', description_en: 'Modern grey granite countertop', price: 2800, dimensions: '260x60x3 cm', material: 'Granite', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop', featured: false },
  // Granite - Bathroom
  { id: '4', category: 'granite', subcategory: 'bathroom', title_ka: 'აბაზანის მარმარილოს ნიჟარა', title_ru: 'Мраморная столешница для ванной', title_en: 'Bathroom Marble Countertop', description_ka: 'ელეგანტური აბაზანის ნიჟარა', description_ru: 'Элегантная столешница для ванной', description_en: 'Elegant bathroom countertop', price: 1800, dimensions: '120x50x3 cm', material: 'Marble', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop', featured: true },
  { id: '5', category: 'granite', subcategory: 'bathroom', title_ka: 'გრანიტის აბაზანის ზედაპირი', title_ru: 'Гранитная поверхность для ванной', title_en: 'Granite Bathroom Surface', description_ka: 'გრანიტის ზედაპირი აბაზანისთვის', description_ru: 'Гранитная поверхность для ванной', description_en: 'Granite surface for bathroom', price: 1500, dimensions: '100x45x3 cm', material: 'Granite', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop', featured: false },
  // Granite - Bar
  { id: '6', category: 'granite', subcategory: 'bar', title_ka: 'ბარის გრანიტის ზედაპირი', title_ru: 'Гранитная барная стойка', title_en: 'Granite Bar Counter', description_ka: 'სტილური ბარის ნიჟარა', description_ru: 'Стильная барная стойка', description_en: 'Stylish bar counter', price: 3500, dimensions: '200x45x4 cm', material: 'Granite', image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=400&fit=crop', featured: true },
  // Granite - Fireplace
  { id: '7', category: 'granite', subcategory: 'fireplace', title_ka: 'მარმარილოს ბუხარი', title_ru: 'Мраморный камин', title_en: 'Marble Fireplace', description_ka: 'კლასიკური მარმარილოს ბუხარი', description_ru: 'Классический мраморный камин', description_en: 'Classic marble fireplace', price: 4500, dimensions: '150x120x20 cm', material: 'Marble', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&h=400&fit=crop', featured: true },
  // Furniture - Living Room
  { id: '8', category: 'furniture', subcategory: 'living', title_ka: 'თანამედროვე დივანი', title_ru: 'Современный диван', title_en: 'Modern Sofa', description_ka: 'კომფორტული თანამედროვე დივანი', description_ru: 'Комфортный современный диван', description_en: 'Comfortable modern sofa', price: 3800, dimensions: '240x90x85 cm', material: 'Fabric/Wood', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop', featured: true },
  { id: '9', category: 'furniture', subcategory: 'living', title_ka: 'ყავის მაგიდა', title_ru: 'Кофейный столик', title_en: 'Coffee Table', description_ka: 'მუხის ხის ყავის მაგიდა', description_ru: 'Кофейный столик из дуба', description_en: 'Oak wood coffee table', price: 1200, dimensions: '120x60x45 cm', material: 'Oak Wood', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&h=400&fit=crop', featured: false },
  // Furniture - Bedroom
  { id: '10', category: 'furniture', subcategory: 'bedroom', title_ka: 'მასიური ხის საწოლი', title_ru: 'Кровать из массива дерева', title_en: 'Solid Wood Bed', description_ka: 'ხის მასალისგან დამზადებული საწოლი', description_ru: 'Кровать из массива дерева', description_en: 'Bed made from solid wood', price: 4200, dimensions: '200x160x120 cm', material: 'Walnut Wood', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop', featured: true },
  { id: '11', category: 'furniture', subcategory: 'bedroom', title_ka: 'კარადა', title_ru: 'Шкаф', title_en: 'Wardrobe', description_ka: 'ფართო კარადა სარკეებით', description_ru: 'Просторный шкаф с зеркалами', description_en: 'Spacious wardrobe with mirrors', price: 3500, dimensions: '240x60x220 cm', material: 'MDF/Wood', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&h=400&fit=crop', featured: false },
  // Furniture - Kitchen
  { id: '12', category: 'furniture', subcategory: 'kitchen', title_ka: 'სამზარეულოს კარადა', title_ru: 'Кухонный шкаф', title_en: 'Kitchen Cabinet', description_ka: 'თანამედროვე სამზარეულოს კარადა', description_ru: 'Современный кухонный шкаф', description_en: 'Modern kitchen cabinet', price: 5500, dimensions: '300x60x220 cm', material: 'MDF/Wood', image: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=400&fit=crop', featured: true },
  // Furniture - Dining
  { id: '13', category: 'furniture', subcategory: 'dining', title_ka: 'სასადილო მაგიდა', title_ru: 'Обеденный стол', title_en: 'Dining Table', description_ka: 'მუხის სასადილო მაგიდა 6 სკამით', description_ru: 'Дубовый обеденный стол с 6 стульями', description_en: 'Oak dining table with 6 chairs', price: 4800, dimensions: '180x90x75 cm', material: 'Oak Wood', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop', featured: true },
  // Furniture - Office
  { id: '14', category: 'furniture', subcategory: 'office', title_ka: 'სამუშაო მაგიდა', title_ru: 'Рабочий стол', title_en: 'Office Desk', description_ka: 'ერგონომიული სამუშაო მაგიდა', description_ru: 'Эргономичный рабочий стол', description_en: 'Ergonomic office desk', price: 2200, dimensions: '160x80x75 cm', material: 'Wood/Metal', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop', featured: false },
  // Furniture - Kids
  { id: '15', category: 'furniture', subcategory: 'kids', title_ka: 'ბავშვის საწოლი', title_ru: 'Детская кровать', title_en: 'Kids Bed', description_ka: 'ფერადი ბავშვის საწოლი', description_ru: 'Цветная детская кровать', description_en: 'Colorful kids bed', price: 1800, dimensions: '180x90x100 cm', material: 'Pine Wood', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&h=400&fit=crop', featured: false },
];

export const getProductTitle = (product: Product, lang: string) => {
  switch (lang) {
    case 'ru': return product.title_ru;
    case 'en': return product.title_en;
    default: return product.title_ka;
  }
};

export const getProductDescription = (product: Product, lang: string) => {
  switch (lang) {
    case 'ru': return product.description_ru;
    case 'en': return product.description_en;
    default: return product.description_ka;
  }
};
