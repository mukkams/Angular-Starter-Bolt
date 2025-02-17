import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentService, Document, AIModel } from '../../services/document.service';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgxDropzoneModule,
    PdfViewerModule,
    CdkDrag,
    CdkDropList,
    FormsModule
  ]
})
export class DocumentsComponent implements OnInit {
  documents$: Observable<Document[]>;
  selectedDocument$: Observable<Document | null>;
  isDragging = false;
  uploadProgress = 0;
  zoomLevel = 1;
  selectedModel: AIModel;
  isGeneratingSummary = false;
  error: string | null = null;

  constructor(public documentService: DocumentService) {
    this.documents$ = this.documentService.documents$;
    this.selectedDocument$ = this.documentService.selectedDocument$;
    this.selectedModel = this.documentService.models[0];
  }

  ngOnInit() {}

  async onSelect(event: { addedFiles: File[] }) {
    const validFiles = event.addedFiles.filter(file => 
      file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== event.addedFiles.length) {
      alert('Some files were skipped. Only PDF files under 10MB are allowed.');
    }

    if (validFiles.length > 0) {
      try {
        await this.documentService.addDocuments(validFiles);
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('An error occurred while uploading files. Please try again.');
      }
    }
  }

  onDrop(event: CdkDragDrop<Document[]>) {
    const documents = [...(this.documentService.documents$ as any).value];
    moveItemInArray(documents, event.previousIndex, event.currentIndex);
    this.documentService.reorderDocuments(documents);
  }

  selectDocument(document: Document) {
    this.documentService.selectDocument(document);
  }

  removeDocument(id: string, event: Event) {
    event.stopPropagation();
    this.documentService.removeDocument(id);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.2, 3);
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.5);
  }

  resetZoom() {
    this.zoomLevel = 1;
  }

  selectAIModel(model: AIModel) {
    this.selectedModel = model;
  }

  async generateSummary(document: Document) {
    if (!document || this.isGeneratingSummary) return;

    this.isGeneratingSummary = true;
    this.error = null;

    try {
      // Extract text from the PDF
      const documentText = await this.documentService.extractTextFromPDF(document.file);
      
      if (!documentText.trim()) {
        throw new Error('No text content found in the PDF');
      }

      // Generate summary using the selected AI model
      const summary = await this.documentService.summarizeDocument(documentText, this.selectedModel.id);
      await this.documentService.updateDocumentSummary(document.id, summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      this.error = error instanceof Error ? error.message : 'Failed to generate summary. Please try again.';
    } finally {
      this.isGeneratingSummary = false;
    }
  }
}