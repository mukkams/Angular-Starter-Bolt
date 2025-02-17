import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, StockData } from '../../services/stock.service';
import { Observable } from 'rxjs';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartTypeRegistry } from 'chart.js';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule]
})
export class StocksComponent {
  stocks$: Observable<StockData[]>;
  selectedStock: StockData | null = null;
  newMessage: string = '';

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(private stockService: StockService) {
    this.stocks$ = this.stockService.stocks$;
    this.stocks$.subscribe(stocks => {
      if (stocks.length && !this.selectedStock) {
        this.selectedStock = stocks[0];
      }
    });
  }

  getChangeColor(change: number): string {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getChangeIcon(change: number): string {
    return change >= 0 
      ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
      : 'M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6';
  }

  selectStock(stock: StockData) {
    this.selectedStock = stock;
  }

  getChartData(stock: StockData): ChartConfiguration<'line'>['data'] {
    return {
      datasets: [{
        data: stock.historicalData.map(data => ({
          x: data.date.getTime(),
          y: data.price
        })),
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      }],
      labels: stock.historicalData.map(data => data.date.toISOString())
    };
  }

  sendMessage() {
    if (this.selectedStock && this.newMessage.trim()) {
      this.stockService.addChatMessage(this.selectedStock.symbol, this.newMessage);
      
      // Simulate system response
      setTimeout(() => {
        const responses = [
          `The current trend for ${this.selectedStock?.name} looks positive based on technical analysis.`,
          `${this.selectedStock?.name}'s stock has shown significant volatility in recent trading sessions.`,
          `Analysts maintain a strong buy rating for ${this.selectedStock?.name}.`,
          `Recent market conditions suggest cautious trading for ${this.selectedStock?.name}.`
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.stockService.addChatMessage(this.selectedStock!.symbol, randomResponse, 'system');
      }, 1000);

      this.newMessage = '';
    }
  }
}