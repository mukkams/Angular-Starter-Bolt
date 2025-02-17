import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
  historicalData: HistoricalData[];
  chatMessages: ChatMessage[];
}

export interface HistoricalData {
  date: Date;
  price: number;
}

export interface ChatMessage {
  sender: 'user' | 'system';
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private stocks = new BehaviorSubject<StockData[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 173.50,
      change: 2.30,
      changePercent: 1.34,
      lastUpdated: new Date(),
      historicalData: this.generateHistoricalData(173.50),
      chatMessages: []
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 788.17,
      change: 15.23,
      changePercent: 1.97,
      lastUpdated: new Date(),
      historicalData: this.generateHistoricalData(788.17),
      chatMessages: []
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 147.68,
      change: -0.45,
      changePercent: -0.30,
      lastUpdated: new Date(),
      historicalData: this.generateHistoricalData(147.68),
      chatMessages: []
    },
    {
      symbol: 'META',
      name: 'Meta Platforms, Inc.',
      price: 502.30,
      change: 9.80,
      changePercent: 1.99,
      lastUpdated: new Date(),
      historicalData: this.generateHistoricalData(502.30),
      chatMessages: []
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 420.55,
      change: 6.75,
      changePercent: 1.63,
      lastUpdated: new Date(),
      historicalData: this.generateHistoricalData(420.55),
      chatMessages: []
    }
  ]);

  stocks$ = this.stocks.asObservable();

  constructor() {
    setInterval(() => this.updateStockPrices(), 5000);
  }

  private generateHistoricalData(currentPrice: number): HistoricalData[] {
    const data: HistoricalData[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5);

    let price = currentPrice * 0.4; // Start from 40% of current price
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Add some randomness and trend
      const trend = (i / totalDays) * currentPrice * 0.6; // Gradual increase
      const random = (Math.random() - 0.5) * currentPrice * 0.02; // Daily fluctuation
      price = price + trend/totalDays + random;
      
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Exclude weekends
        data.push({
          date: new Date(date),
          price: +price.toFixed(2)
        });
      }
    }

    return data;
  }

  private updateStockPrices() {
    const updatedStocks = this.stocks.value.map(stock => ({
      ...stock,
      price: this.simulatePriceChange(stock.price),
      change: this.calculateChange(stock.price),
      changePercent: this.calculateChangePercent(stock.price),
      lastUpdated: new Date(),
      historicalData: [...stock.historicalData, {
        date: new Date(),
        price: stock.price
      }]
    }));
    this.stocks.next(updatedStocks);
  }

  private simulatePriceChange(currentPrice: number): number {
    const changePercent = (Math.random() - 0.5) * 2;
    const change = currentPrice * (changePercent / 100);
    return +(currentPrice + change).toFixed(2);
  }

  private calculateChange(newPrice: number): number {
    return +(Math.random() * 10 - 5).toFixed(2);
  }

  private calculateChangePercent(newPrice: number): number {
    return +(Math.random() * 2 - 1).toFixed(2);
  }

  addChatMessage(symbol: string, message: string, sender: 'user' | 'system' = 'user') {
    const stocks = this.stocks.value;
    const stockIndex = stocks.findIndex(s => s.symbol === symbol);
    
    if (stockIndex !== -1) {
      const updatedStocks = [...stocks];
      updatedStocks[stockIndex] = {
        ...updatedStocks[stockIndex],
        chatMessages: [
          ...updatedStocks[stockIndex].chatMessages,
          {
            sender,
            message,
            timestamp: new Date()
          }
        ]
      };
      this.stocks.next(updatedStocks);
    }
  }
}