import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
}

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly OPEN_ROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly API_KEY = environment.openRouterApiKey;

  readonly models: ChatModel[] = [
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

  async sendMessage(message: string, modelId: string): Promise<string> {
    try {
      const response = await fetch(this.OPEN_ROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'StockTrac',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: message }],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(errorData.error?.message || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('API call failed:', error);
      throw error instanceof Error ? error : new Error('Failed to communicate with the API');
    }
  }
}