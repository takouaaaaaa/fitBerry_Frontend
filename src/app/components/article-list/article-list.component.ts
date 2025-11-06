import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  articles: Article[] = [];
  loggedInNutritionistId = 1; // Change this to the actual logged-in user ID
  nutritionnisteIdFromUrl: number | null = null;
  pageTitle = "Liste des articles";

  // Modal state
  showModal = false;
  isEditMode = false;
  isSubmitting = false;
  isUploadingImage = false;
  currentArticle: Article = this.getEmptyArticle();

  // Image handling
  selectedFile: File | null = null;
  imagePreview: string | null = null;

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
        next: (data: Article[]) => {
          console.log('Articles loaded:', data);
          this.articles = data;
        },
        error: (err: any) => console.error('Erreur de chargement :', err)
      });
    } else {
      this.articleService.getAll().subscribe({
        next: (data: Article[]) => {
          console.log('Articles loaded:', data);
          this.articles = data;
        },
        error: (err: any) => console.error('Erreur de chargement :', err)
      });
    }
  }

  // Modal functions
  openCreateModal(): void {
    this.isEditMode = false;
    this.currentArticle = this.getEmptyArticle();
    this.selectedFile = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  openEditModal(article: Article): void {
    this.isEditMode = true;
    this.currentArticle = { ...article };
    this.selectedFile = null;
    this.imagePreview = article.imageURL ? this.getFullImageUrl(article.imageURL) : null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.currentArticle = this.getEmptyArticle();
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // File handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Veuillez sélectionner une image valide');
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.currentArticle.imageURL = '';
  }

  // Submit article (create or update)
  submitArticle(): void {
    if (!this.currentArticle.titre || !this.currentArticle.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSubmitting = true;

    // If a file is selected, upload it first
    if (this.selectedFile) {
      this.isUploadingImage = true;
      this.articleService.uploadImage(this.selectedFile).subscribe({
        next: (response: any) => {
          console.log('Image uploaded successfully:', response);
          this.currentArticle.imageURL = response.imageUrl;
          this.isUploadingImage = false;
          this.saveArticle();
        },
        error: (err: any) => {
          console.error('Erreur lors de l\'upload de l\'image', err);
          alert('Erreur lors de l\'upload de l\'image');
          this.isSubmitting = false;
          this.isUploadingImage = false;
        }
      });
    } else {
      // No new image selected, use existing one
      if (!this.currentArticle.imageURL) {
        this.currentArticle.imageURL = '';
      }
      this.saveArticle();
    }
  }

  private saveArticle(): void {
    if (this.isEditMode && this.currentArticle.id) {
      // Update existing article
      this.articleService.update(this.currentArticle.id, this.currentArticle, this.loggedInNutritionistId).subscribe({
        next: () => {
          console.log('Article mis à jour avec succès');
          this.loadArticles();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (err: any) => {
          console.error('Erreur lors de la mise à jour', err);
          alert("Erreur : Vous n'avez peut-être pas la permission de modifier cet article.");
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new article
      this.articleService.create(this.currentArticle, this.loggedInNutritionistId).subscribe({
        next: () => {
          console.log('Article créé avec succès');
          this.loadArticles();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (err: any) => {
          console.error('Erreur lors de la création', err);
          alert("Erreur : Impossible de créer l'article.");
          this.isSubmitting = false;
        }
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

  // Helper functions
  private getEmptyArticle(): Article {
    return {
      titre: '',
      description: '',
      imageURL: ''
    };
  }

  handleImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x300?text=Image+Non+Disponible';
  }

  getImageUrl(imageURL: string | undefined): string {
    if (!imageURL || imageURL.trim() === '') {
      return 'https://via.placeholder.com/400x300?text=Pas+d%27image';
    }
    return this.getFullImageUrl(imageURL);
  }

  private getFullImageUrl(imagePath: string): string {
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Return the path as is (proxy will handle routing to backend)
    return imagePath;
  }
}
