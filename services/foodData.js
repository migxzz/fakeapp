// Dados de exemplo para o aplicativo de vendas de comidas

export const featuredItems = [
  {
    id: 'f1',
    title: 'Promoções da Semana',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 'f2',
    title: 'Pratos Especiais',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1374&auto=format&fit=crop',
  },
  {
    id: 'f3',
    title: 'Combos Família',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1381&auto=format&fit=crop',
  },
  {
    id: 'f4',
    title: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1364&auto=format&fit=crop',
  },
];

export const foodItems = [
  {
    id: '1',
    name: 'Hambúrguer Artesanal',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop',
    description: 'Hambúrguer artesanal com 180g de carne, queijo cheddar, bacon crocante, alface, tomate e molho especial.',
    category: 'Lanches',
    ingredients: ['Pão brioche', 'Carne bovina', 'Queijo cheddar', 'Bacon', 'Alface', 'Tomate', 'Molho especial'],
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1470&auto=format&fit=crop',
    description: 'Pizza tradicional italiana com molho de tomate, mussarela fresca, manjericão e azeite de oliva extra virgem.',
    category: 'Pizzas',
    ingredients: ['Massa artesanal', 'Molho de tomate', 'Mussarela', 'Manjericão', 'Azeite de oliva'],
  },
  {
    id: '3',
    name: 'Salada Caesar',
    price: 24.90,
    image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?q=80&w=1470&auto=format&fit=crop',
    description: 'Salada fresca com alface romana, croutons, parmesão, frango grelhado e molho caesar.',
    category: 'Saladas',
    ingredients: ['Alface romana', 'Croutons', 'Parmesão', 'Frango grelhado', 'Molho caesar'],
  },
  {
    id: '4',
    name: 'Sushi Combo',
    price: 62.90,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1470&auto=format&fit=crop',
    description: 'Combinação de 20 peças de sushi incluindo uramaki, niguiri e sashimi.',
    category: 'Japonesa',
    ingredients: ['Arroz japonês', 'Peixe fresco', 'Nori', 'Pepino', 'Cream cheese', 'Abacate'],
  },
  {
    id: '5',
    name: 'Macarrão à Carbonara',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1471&auto=format&fit=crop',
    description: 'Espaguete com molho cremoso de ovos, queijo pecorino, pancetta e pimenta preta.',
    category: 'Massas',
    ingredients: ['Espaguete', 'Ovos', 'Queijo pecorino', 'Pancetta', 'Pimenta preta'],
  },
  {
    id: '6',
    name: 'Açaí na Tigela',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1615213612138-4d1195b8f8d7?q=80&w=1374&auto=format&fit=crop',
    description: 'Tigela de açaí cremoso com granola, banana, morango e mel.',
    category: 'Sobremesas',
    ingredients: ['Açaí', 'Granola', 'Banana', 'Morango', 'Mel'],
  },
];

export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'lanches', name: 'Lanches' },
  { id: 'pizzas', name: 'Pizzas' },
  { id: 'saladas', name: 'Saladas' },
  { id: 'japonesa', name: 'Japonesa' },
  { id: 'massas', name: 'Massas' },
  { id: 'sobremesas', name: 'Sobremesas' },
];