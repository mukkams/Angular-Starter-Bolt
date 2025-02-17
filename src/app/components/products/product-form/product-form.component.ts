import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, CreateTodoInput } from '../../../models/todo.type';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductFormComponent implements OnInit {
  @Input() editProduct: Todo | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateTodoInput>();

  product: CreateTodoInput = {
    name: '',
    description: '',
    barcode: '',
    rate: 0
  };

  get isEditMode(): boolean {
    return !!this.editProduct;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Edit Product' : 'Add New Product';
  }

  ngOnInit() {
    if (this.editProduct) {
      this.product = {
        name: this.editProduct.name,
        description: this.editProduct.description,
        barcode: this.editProduct.barcode,
        rate: this.editProduct.rate
      };
    }
  }

  onSubmit() {
    if (this.isValid()) {
      this.save.emit(this.product);
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }

  private isValid(): boolean {
    return !!(this.product.name && 
              this.product.description && 
              this.product.barcode && 
              this.product.rate > 0);
  }
}