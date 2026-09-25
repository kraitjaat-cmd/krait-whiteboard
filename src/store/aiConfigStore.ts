import { useState, useEffect } from 'react';

export type AIProvider = 'built-in' | 'anthropic' | 'openai' | 'ollama' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  anthropicApiKey: string;
  anthropicModel: string;
  openaiApiKey: string;
  openaiModel: string;
  ollamaEndpoint: string;
  ollamaModel: string;
  customEndpoint: string;
}

const STORAGE_KEY = 'whiteboard_ai_config_v1';

const DEFAULT_CONFIG: AIConfig = {
  provider: 'built-in',
  anthropicApiKey: '',
  anthropicModel: 'claude-3-5-sonnet-20241022',
  openaiApiKey: '',
  openaiModel: 'gpt-4o',
  ollamaEndpoint: 'http://localhost:11434',
  ollamaModel: 'llama3',
  customEndpoint: '',
};

class AIConfigStore {
  private config: AIConfig;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AIConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Failed to load AI config from storage', e);
    }
    return DEFAULT_CONFIG;
  }

  private saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Failed to save AI config to storage', e);
    }
    this.notify();
  }

  public getState(): AIConfig {
    return this.config;
  }

  public setConfig(partial: Partial<AIConfig>) {
    this.config = { ...this.config, ...partial };
    this.saveConfig();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const aiConfigStore = new AIConfigStore();

export function useAIConfig(): AIConfig {
  const [config, setConfig] = useState<AIConfig>(aiConfigStore.getState());

  useEffect(() => {
    return aiConfigStore.subscribe(() => {
      setConfig(aiConfigStore.getState());
    });
  }, []);

  return config;
}
