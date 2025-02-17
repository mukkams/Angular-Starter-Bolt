import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DashboardData {
  totalStocks: number;
  totalValue: number;
  performanceToday: number;
  topPerformers: {
    symbol: string;
    name: string;
    change: number;
  }[];
  recentActivities: {
    id: string;
    type: 'buy' | 'sell' | 'alert';
    description: string;
    timestamp: Date;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardData = new BehaviorSubject<DashboardData | null>(null);
  dashboardData$ = this.dashboardData.asObservable();

  constructor() {}

  async fetchDashboardData(): Promise<void> {
    try {      
      // Simulating API call with mock data
      const response = await new Promise<DashboardData>((resolve) => {
        setTimeout(() => {
          resolve({
            totalStocks: 15,
            totalValue: 250000,
            performanceToday: 2.5,
            topPerformers: [
              { symbol: 'AAPL', name: 'Apple Inc.', change: 3.2 },
              { symbol: 'NVDA', name: 'NVIDIA Corporation', change: 4.5 },
              { symbol: 'MSFT', name: 'Microsoft Corporation', change: 2.8 }
            ],
            recentActivities: [
              {
                id: '1',
                type: 'buy',
                description: 'Purchased 10 shares of AAPL at $175.50',
                timestamp: new Date()
              },
              {
                id: '2',
                type: 'alert',
                description: 'NVDA reached target price of $800',
                timestamp: new Date(Date.now() - 3600000)
              },
              {
                id: '3',
                type: 'sell',
                description: 'Sold 5 shares of MSFT at $420.30',
                timestamp: new Date(Date.now() - 7200000)
              }
            ]
          });
        }, 1000); // Simulate network delay
      });

      this.dashboardData.next(response);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}