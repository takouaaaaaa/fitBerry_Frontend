import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = 'http://localhost:8080/api/articles';

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
}