import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleFormComponent } from './components/article-form/article-form.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { AccueilComponent } from './components/accueil/accueil.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: 'create-article', component: ArticleFormComponent },
  { path: 'nutritionniste/:id/articles', component: ArticleListComponent },
  { path: 'client-profile', component: ClientProfileComponent },
  { path: 'client/:id/profile', component: ClientProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
