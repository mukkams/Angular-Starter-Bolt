import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage, ChatModel } from '../../services/chat.service';

@Component({
  selector: 'app-aichatbot',
  templateUrl: './aichatbot.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AIChatBotComponent implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  selectedModel: ChatModel;
  isLoading = false;
  error: string | null = null;

  constructor(public chatService: ChatService) {
    this.selectedModel = this.chatService.models[0];
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  async sendMessage() {
    if (!this.newMessage.trim() || this.isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: this.newMessage,
      model: this.selectedModel.name,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageText = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;
    this.error = null;

    try {
      const response = await this.chatService.sendMessage(messageText, this.selectedModel.id);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        model: this.selectedModel.name,
        timestamp: new Date()
      };

      this.messages.push(assistantMessage);
    } catch (error) {
      console.error('Failed to get response:', error);
      this.error = error instanceof Error ? error.message : 'An unexpected error occurred';
      this.messages.push({
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        model: this.selectedModel.name,
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
    }
  }

  selectModel(model: ChatModel) {
    this.selectedModel = model;
    this.error = null;
  }
}