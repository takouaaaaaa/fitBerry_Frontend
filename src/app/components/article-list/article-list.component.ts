import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
})
export class ArticleListComponent implements OnInit { 
  
  articles: Article[] = [];
  
  loggedInNutritionistId = 1; 
  
  nutritionnisteIdFromUrl: number | null = null; 
  pageTitle = "Liste des articles"; 

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam) {
        this.nutritionnisteIdFromUrl = +idParam; 
        this.pageTitle = `Articles du Nutritionniste ${this.nutritionnisteIdFromUrl}`;
      } else {
        this.nutritionnisteIdFromUrl = null;
        this.pageTitle = "Tous les articles";
      }
      
      this.loadArticles(); 
    });
  }

  loadArticles(): void {
    if (this.nutritionnisteIdFromUrl) {
    
      this.articleService.getAllByNutritionniste(this.nutritionnisteIdFromUrl).subscribe({
        next: (data: Article[]) => this.articles = data,
        error: (err: any) => console.error('Erreur de chargement :', err)
      });
    } else {
    
      this.articleService.getAll().subscribe({
        next: (data: Article[]) => this.articles = data,
        error: (err: any) => console.error('Erreur de chargement :', err)
      });
    }
  }

  deleteArticle(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      
      this.articleService.delete(id, this.loggedInNutritionistId).subscribe({
        
        next: () => {
          console.log('Article supprimé avec succès');
          this.loadArticles(); 
        },
        
        error: (err: any) => { 
          console.error('Erreur lors de la suppression', err);
          alert("Erreur : Vous n'avez peut-être pas la permission de supprimer cet article.");
        }
      });
    }
  }

}