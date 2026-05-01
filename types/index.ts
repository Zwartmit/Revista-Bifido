export interface Character {
  id: string;
  name: string;
  slug: string;
  description: string;
  religion: string;
  age: string;
  favoriteColor: string;
  image: string;
  biography?: string;
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
  section: string;       // = author.slug (character slug)
  characterId: string;   // = author.slug
  featured?: boolean;
}
