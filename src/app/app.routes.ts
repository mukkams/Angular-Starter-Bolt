import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { AIChatBotComponent } from './components/aichatbot/aichatbot.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stocks', component: StocksComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'chat', component: AIChatBotComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'products', component: ProductsComponent }
];