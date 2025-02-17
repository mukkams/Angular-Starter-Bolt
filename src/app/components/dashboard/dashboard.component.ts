import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData } from '../../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  dashboardData$: Observable<DashboardData | null>;
  isLoading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {
    this.dashboardData$ = this.dashboardService.dashboardData$;
  }

  async ngOnInit() {
    try {
      await this.dashboardService.fetchDashboardData();
    } catch (error) {
      this.error = 'Failed to load dashboard data. Please try again later.';
      console.error('Dashboard initialization error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}