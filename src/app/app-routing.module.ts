import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleFormComponent } from './components/article-form/article-form.component';
import { ArticleEditComponent } from './components/article-edit/article-edit.component';

const routes: Routes = [
 
  { path: 'articles', component: ArticleListComponent },
  
  
  { path: 'nutritionniste/:id/articles', component: ArticleListComponent },

  
  { path: 'articles/new', component: ArticleFormComponent },
  { path: 'articles/edit/:id', component: ArticleEditComponent },
  { path: '', redirectTo: 'articles', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }