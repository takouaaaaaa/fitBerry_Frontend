import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router'; 
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
})
export class ArticleEditComponent implements OnInit {
  
  
  loggedInNutritionistId = 1; 

  article: Article | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const articleId = +idParam;
      this.articleService.getById(articleId).subscribe({
        next: (data) => {
          this.article = data;
        },
        error: (err) => {
          console.error("Erreur lors du chargement de l'article", err);
          alert("Article non trouvé.");
          this.router.navigate(['/articles']); 
        }
      });
    } else {
      this.router.navigate(['/articles']);
    }
  }

  updateArticle(): void {
    if (this.article) {
      this.articleService.update(this.article.id!, this.article, this.loggedInNutritionistId).subscribe({
        
        next: () => {
          console.log('Article mis à jour avec succès');
          this.router.navigate(['/articles']);
        },

        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
          alert("Erreur : Vous n'avez peut-être pas la permission de modifier cet article.");
        }
      });
    }
  }
}