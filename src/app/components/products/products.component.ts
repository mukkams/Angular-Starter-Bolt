import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo, CreateTodoInput } from '../../models/todo.type';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from './product-form/product-form.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [CommonModule, ProductFormComponent]
})
export class ProductsComponent implements OnInit {
  products: Todo[] = [];
  loading = false;
  error: string | null = null;
  showProductForm = false;
  selectedProduct: Todo | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  openProductForm(product?: Todo) {
    this.selectedProduct = product || null;
    this.showProductForm = true;
  }

  closeProductForm() {
    this.showProductForm = false;
    this.selectedProduct = null;
  }

  onSaveProduct(productData: CreateTodoInput) {
    if (this.selectedProduct) {
      // Update existing product
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeProductForm();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.error = 'Failed to update product. Please try again.';
        }
      });
    } else {
      // Add new product
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeProductForm();
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.error = 'Failed to add product. Please try again.';
        }
      });
    }
  }

  deleteProduct(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.error = 'Failed to delete product. Please try again.';
        }
      });
    }
  }
}