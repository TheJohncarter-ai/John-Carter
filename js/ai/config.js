// AI Model Configuration
const AI_CONFIG = {
    // OpenAI Configuration
    openai: {
        apiKey: '', // Add your OpenAI API key here
        defaultModel: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
    },

    // Hugging Face Configuration
    huggingface: {
        apiKey: process.env.HUGGINGFACE_API_KEY,
        defaultModel: 'gpt2',
        maxLength: 100,
        temperature: 0.7
    },

    // Cohere Configuration (Free tier available)
    cohere: {
        apiKey: '', // Add your Cohere API key here
        defaultModel: 'command',
        maxTokens: 100,
        temperature: 0.7,
        baseUrl: 'https://api.cohere.ai/v1'
    },

    // Stability AI Configuration
    stability: {
        apiKey: process.env.STABILITY_API_KEY,
        defaultModel: 'stable-diffusion-xl-1024-v1-0',
        cfgScale: 7,
        height: 1024,
        width: 1024,
        steps: 30
    },

    // Replicate Configuration
    replicate: {
        apiKey: process.env.REPLICATE_API_KEY,
        defaultModel: 'stability-ai/stable-diffusion',
        maxTokens: 100,
        temperature: 0.7
    },

    // Ollama Configuration (Free, local)
    ollama: {
        defaultModel: 'llama2',
        maxTokens: 100,
        temperature: 0.7,
        baseUrl: 'http://localhost:11434/api'
    },

    // LocalAI Configuration (Free, local)
    localai: {
        defaultModel: 'gpt-3.5-turbo',
        maxTokens: 100,
        temperature: 0.7,
        baseUrl: 'http://localhost:8080/v1'
    },

    // Default context settings
    defaultContext: {
        systemPrompt: 'You are an AI assistant for the Life Management Dashboard. You can help with task management, scheduling, and providing insights.',
        maxContextLength: 2000
    },

    // Model availability settings
    modelAvailability: {
        openai: false,  // Set to true when API key is added
        huggingface: true,
        cohere: true,   // Using Cohere's free tier
        stability: true,
        replicate: true,
        ollama: false,  // Local model not available
        localai: false  // Local model not available
    },

    // Permissions and Security
    permissions: {
        allowInterfaceChanges: true,    // Allow AI to modify UI
        allowBackendAccess: true,       // Allow AI to access backend functions
        maxRequestsPerMinute: 60,       // Rate limiting
        allowedActions: [
            'updateUI',
            'modifyLayout',
            'accessData',
            'suggestChanges',
            'executeCommands'
        ]
    },

    // Backend Integration
    backend: {
        endpoints: {
            aiChat: '/api/ai/chat',
            uiUpdate: '/api/ui/update',
            dataAccess: '/api/data',
            systemCommands: '/api/system'
        },
        authentication: {
            required: true,
            method: 'token'
        }
    }
};

// Initialize AI Service
function initializeAIService() {
    // Get Cohere API key from environment or prompt user
    const cohereKey = prompt("Please enter your Cohere API key (get a free key from cohere.ai):");
    if (cohereKey) {
        AI_CONFIG.cohere.apiKey = cohereKey;
        AI_CONFIG.modelAvailability.cohere = true;
        console.log('Cohere AI model initialized');
    } else {
        console.warn('No Cohere API key provided. AI features will be limited.');
    }
}

// Export configuration
export default AI_CONFIG;
export { initializeAIService }; 