import { Profile } from "./user";

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList?: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface MultipleArticles {
  articles: Article[];
  articleCount: number;
}

export interface ArticleFilter {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export interface MultipleComments {
  comments: Comment[];
}

export interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: Profile;
}

export interface CreateArticle {
  title: string;
  description: string;
  body: string;
  tagsList: string;
}
