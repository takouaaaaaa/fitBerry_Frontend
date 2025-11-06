import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {

  article: Article;
  loggedInNutritionistId = 1; // Change to actual logged-in user ID
  isSubmitting: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private articleService: ArticleService) {
    this.article = this.getEmptyArticle();
  }

  ngOnInit(): void {}

  // File handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('L\'image ne doit pas dépasser 10MB');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Veuillez sélectionner une image valide (PNG, JPG, GIF)');
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // Create article
  createArticle(): void {
    if (!this.article.titre || !this.article.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSubmitting = true;

    this.articleService.createWithFile(
      this.article,
      this.selectedFile,
      this.loggedInNutritionistId
    ).subscribe({
      next: (response: Article) => {
        console.log('Article créé avec succès', response);
        alert('Article créé avec succès!');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err: any) => {
        console.error('Erreur complète:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.error);
        alert(`Erreur de création: ${err.error?.message || err.message || "Impossible de créer l'article."}`);
        this.isSubmitting = false;
      }
    });
  }

  // Reset form
  private resetForm(): void {
    this.article = this.getEmptyArticle();
    this.selectedFile = null;
    this.imagePreview = null;
  }

  private getEmptyArticle(): Article {
    return {
      titre: '',
      description: '',
      imageURL: ''
    };
  }
}
