export interface Blog {
  title: string;
  description: string;
  author: string;
  date: string;
  category: Category;
  image: string;
  id: string;
}

export interface Category {
  payment: string;
  crypto: string;
  development: string;
}
