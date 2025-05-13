// Model Context Protocol (MCP) Implementation
class ModelContextProtocol {
    constructor() {
        this.models = new Map();
        this.activeModel = null;
        this.context = new Map();
    }

    // Register a new AI model
    registerModel(name, model) {
        if (!model || typeof model.generate !== 'function') {
            throw new Error('Invalid model implementation');
        }
        this.models.set(name, model);
        if (!this.activeModel) {
            this.activeModel = name;
        }
    }

    // Switch between available models
    switchModel(modelName) {
        if (!this.models.has(modelName)) {
            throw new Error(`Model ${modelName} not found`);
        }
        this.activeModel = modelName;
        return this.getActiveModel();
    }

    // Get the currently active model
    getActiveModel() {
        return this.models.get(this.activeModel);
    }

    // Add context for the AI
    addContext(key, value) {
        this.context.set(key, value);
    }

    // Get context
    getContext(key) {
        return this.context.get(key);
    }

    // Clear context
    clearContext() {
        this.context.clear();
    }

    // Generate response using active model
    async generate(prompt, options = {}) {
        const model = this.getActiveModel();
        if (!model) {
            throw new Error('No active model available');
        }

        // Merge context with options
        const contextData = Object.fromEntries(this.context);
        const mergedOptions = {
            ...options,
            context: contextData
        };

        return await model.generate(prompt, mergedOptions);
    }
}

// Example model implementations
class OpenAIModel {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(prompt, options) {
        // Implementation for OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: options.model || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: options.context?.systemPrompt || '' },
                    { role: 'user', content: prompt }
                ],
                temperature: options.temperature || 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

class HuggingFaceModel {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(prompt, options) {
        // Implementation for Hugging Face API
        const response = await fetch('https://api-inference.huggingface.co/models/' + options.model, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    temperature: options.temperature || 0.7,
                    max_length: options.maxLength || 100
                }
            })
        });

        const data = await response.json();
        return data[0].generated_text;
    }
}

// Cohere Model Implementation (Free tier available)
class CohereModel {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(prompt, options) {
        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: options.maxTokens || 100,
                temperature: options.temperature || 0.7,
                model: options.model || 'command'
            })
        });

        const data = await response.json();
        return data.generations[0].text;
    }
}

// Stability AI Model Implementation (Free credits available)
class StabilityAIModel {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(prompt, options) {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: options.cfgScale || 7,
                height: options.height || 1024,
                width: options.width || 1024,
                steps: options.steps || 30
            })
        });

        const data = await response.json();
        return data.artifacts[0].base64;
    }
}

// Replicate Model Implementation (Free tier available)
class ReplicateModel {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(prompt, options) {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: options.model || "stability-ai/stable-diffusion",
                input: {
                    prompt: prompt,
                    ...options
                }
            })
        });

        const data = await response.json();
        return data.output;
    }
}

// Ollama Model Implementation (Local, free)
class OllamaModel {
    constructor() {
        this.baseUrl = 'http://localhost:11434/api';
    }

    async generate(prompt, options) {
        const response = await fetch(`${this.baseUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || 'llama2',
                prompt: prompt,
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 100
            })
        });

        const data = await response.json();
        return data.response;
    }
}

// LocalAI Model Implementation (Local, free)
class LocalAIModel {
    constructor() {
        this.baseUrl = 'http://localhost:8080/v1';
    }

    async generate(prompt, options) {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: options.context?.systemPrompt || '' },
                    { role: 'user', content: prompt }
                ],
                temperature: options.temperature || 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Export the MCP and model implementations
export { 
    ModelContextProtocol, 
    OpenAIModel, 
    HuggingFaceModel,
    CohereModel,
    StabilityAIModel,
    ReplicateModel,
    OllamaModel,
    LocalAIModel
}; 