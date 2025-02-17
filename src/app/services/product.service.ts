import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Todo, CreateTodoInput } from '../models/todo.type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/product';
  private mockProducts: Todo[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'High-performance laptop with latest specs',
      barcode: 'LAP123456',
      rate: 1299.99,
      addedOn: new Date('2024-02-15'),
      modifiedOn: new Date('2024-02-15'),
    },
    {
      id: 2,
      name: 'Smartphone',
      description: 'Latest model with advanced camera system',
      barcode: 'PHN789012',
      rate: 999.99,
      addedOn: new Date('2024-02-14'),
      modifiedOn: new Date('2024-02-14'),
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      description: 'Noise-cancelling bluetooth headphones',
      barcode: 'AUD345678',
      rate: 199.99,
      addedOn: new Date('2024-02-13'),
      modifiedOn: new Date('2024-02-13'),
    },
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Todo[]> {
    // return this.http.get<Array<Todo>>(this.apiUrl);
    return of(this.mockProducts);
  }

  addProduct(product: CreateTodoInput): Observable<Todo> {
    const newProduct: Todo = {
      ...product,
      id: this.mockProducts.length + 1,
      addedOn: new Date(),
      modifiedOn: new Date(),
    };
    this.mockProducts.push(newProduct);
    return of(newProduct);
  }

  updateProduct(id: number, product: Partial<Todo>): Observable<Todo> {
    const index = this.mockProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProducts[index] = {
        ...this.mockProducts[index],
        ...product,
        modifiedOn: new Date(),
      };
      return of(this.mockProducts[index]);
    }
    throw new Error('Product not found');
  }

  deleteProduct(id: number): Observable<void> {
    const index = this.mockProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Product not found');
  }
}