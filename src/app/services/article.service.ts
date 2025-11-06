import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = '/api/articles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.baseUrl);
  }

  getAllByNutritionniste(nutritionnisteId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/nutritionniste/${nutritionnisteId}`);
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }

  create(article: Article, nutritionnisteId: number): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/nutritionniste/${nutritionnisteId}`, article);
  }

  update(id: number, article: Article, nutritionnisteId: number): Observable<Article> {
    return this.http.put<Article>(`${this.baseUrl}/${id}/nutritionniste/${nutritionnisteId}`, article);
  }

  delete(id: number, nutritionnisteId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/nutritionniste/${nutritionnisteId}`);
  }

  // Upload image only - returns the image URL path
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(`${this.baseUrl}/upload-image`, formData);
  }

  // Create article with file upload
  createWithFile(article: Article, file: File | null, nutritionnisteId: number): Observable<Article> {
    const formData = new FormData();
    formData.append('titre', article.titre);
    formData.append('description', article.description);

    if (file) {
      formData.append('image', file);
    } else if (article.imageURL) {
      formData.append('imageURL', article.imageURL);
    }

    return this.http.post<Article>(`${this.baseUrl}/nutritionniste/${nutritionnisteId}`, formData);
  }

  // Update article with file upload
  updateWithFile(id: number, article: Article, file: File | null, nutritionnisteId: number): Observable<Article> {
    const formData = new FormData();
    formData.append('titre', article.titre);
    formData.append('description', article.description);

    if (file) {
      formData.append('image', file);
    } else if (article.imageURL) {
      formData.append('imageURL', article.imageURL);
    }

    return this.http.put<Article>(`${this.baseUrl}/${id}/nutritionniste/${nutritionnisteId}`, formData);
  }
}
