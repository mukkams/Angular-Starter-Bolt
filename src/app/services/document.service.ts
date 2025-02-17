import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  url: string;
  file: File;
  thumbnail?: string;
  summary?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents = new BehaviorSubject<Document[]>([]);
  documents$ = this.documents.asObservable();
  
  private selectedDocument = new BehaviorSubject<Document | null>(null);
  selectedDocument$ = this.selectedDocument.asObservable();

  private readonly OPEN_ROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly API_KEY = environment.openRouterApiKey;

  readonly models: AIModel[] = [
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4',
      description: 'Most capable OpenAI model for complex tasks'
    },
    {
      id: 'openai/gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Efficient version of GPT'
    },
    {
      id: 'deepseek/deepseek-r1-distill-llama-70b:free',
      name: 'Llama 2',
      description: 'Meta\'s open source large language model'
    },
    {
      id: 'anthropic/claude-3-sonnet',
      name: 'Claude 3',
      description: 'Anthropic\'s advanced language model'
    },
    {
      id: 'mistralai/mistral-large-2411',
      name: 'Mistral',
      description: 'Mistral\'s efficient language model'
    }
  ];

  constructor() {}

  addDocuments(files: File[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const newDocuments: Document[] = files.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        url: URL.createObjectURL(file),
        file: file
      }));

      this.documents.next([...this.documents.value, ...newDocuments]);
      resolve();
    });
  }

  selectDocument(document: Document) {
    this.selectedDocument.next(document);
  }

  removeDocument(id: string) {
    const updatedDocs = this.documents.value.filter(doc => doc.id !== id);
    this.documents.next(updatedDocs);
    
    if (this.selectedDocument.value?.id === id) {
      this.selectedDocument.next(updatedDocs[0] || null);
    }
  }

  reorderDocuments(documents: Document[]) {
    this.documents.next(documents);
  }

  async extractTextFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async summarizeDocument(documentText: string, modelId: string): Promise<string> {
    try {
      const response = await fetch(this.OPEN_ROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'StockTrac'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{
            role: 'user',
            content: `Please provide a concise summary of the following document: ${documentText}`
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  async updateDocumentSummary(documentId: string, summary: string) {
    const documents = this.documents.value;
    const updatedDocs = documents.map(doc => 
      doc.id === documentId ? { ...doc, summary } : doc
    );
    this.documents.next(updatedDocs);
    
    if (this.selectedDocument.value?.id === documentId) {
      const updatedDoc = updatedDocs.find(doc => doc.id === documentId);
      if (updatedDoc) {
        this.selectedDocument.next(updatedDoc);
      }
    }
  }
}