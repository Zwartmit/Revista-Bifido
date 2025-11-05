export interface Mascot {
  id: string;
  name: string;
  section: string;
  slug: string;
  description: string;
  religion: string;
  age: string;
  favoriteColor: string;
  image: string;
  color: {
    primary: string;
    secondary: string;
    dark: string;
  };
  position: [number, number, number]; // Posición 3D
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  featuredImage: string;
  section: string;
  mascotId: string;
}

export interface Section {
  id: string;
  name: string;
  slug: string;
  mascotId: string;
  description: string;
}
