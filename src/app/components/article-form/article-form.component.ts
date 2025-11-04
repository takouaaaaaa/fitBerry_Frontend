import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  
})
export class ArticleFormComponent {

  
  article: Article = {
    titre: '',
    description: '',
    imageURL: ''
    
  };

  
  loggedInNutritionistId = 1;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  createArticle(): void {
    
    this.articleService.create(this.article, this.loggedInNutritionistId).subscribe({
      
    
      next: () => {
        console.log('Article créé avec succès');
        this.router.navigate(['/articles']);
      },
      
      
      error: (err) => {
        console.error('Erreur lors de la création', err);
        alert("Erreur : Impossible de créer l'article.");
      }
    });
  }
}