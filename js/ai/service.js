import { 
    ModelContextProtocol, 
    OpenAIModel, 
    HuggingFaceModel,
    CohereModel,
    StabilityAIModel,
    ReplicateModel,
    OllamaModel,
    LocalAIModel
} from './mcp.js';
import AI_CONFIG, { initializeAIService } from './config.js';

class AIService {
    constructor() {
        this.mcp = new ModelContextProtocol();
        this.config = AI_CONFIG;
        this.permissions = AI_CONFIG.permissions;
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
        
        // Initialize the service
        this.initialize();
    }

    async initialize() {
        // Initialize AI configuration
        initializeAIService();
        
        // Initialize models
        this.initializeModels();
        
        // Set up rate limiting
        this.resetRequestCount();
    }

    initializeModels() {
        // Initialize available models based on configuration
        Object.entries(this.config.modelAvailability).forEach(([model, isAvailable]) => {
            if (isAvailable) {
                this.initializeModel(model);
            }
        });
    }

    initializeModel(modelName) {
        const config = this.config[modelName];
        if (!config) return;

        try {
            const model = this.createModelInstance(modelName, config);
            if (model) {
                this.mcp.registerModel(modelName, model);
                console.log(`${modelName} model initialized successfully`);
            }
        } catch (error) {
            console.error(`Failed to initialize ${modelName} model:`, error);
        }
    }

    createModelInstance(modelName, config) {
        switch (modelName) {
            case 'openai':
                return new OpenAIModel(config.apiKey);
            case 'cohere':
                return new CohereModel(config.apiKey);
            case 'ollama':
                return new OllamaModel();
            case 'localai':
                return new LocalAIModel();
            default:
                return null;
        }
    }

    // Permission checking
    checkPermission(action) {
        return this.permissions.allowedActions.includes(action);
    }

    // Rate limiting
    checkRateLimit() {
        const now = Date.now();
        const timeWindow = 60000; // 1 minute
        
        if (now - this.lastRequestTime > timeWindow) {
            this.resetRequestCount();
        }
        
        return this.requestCount < this.permissions.maxRequestsPerMinute;
    }

    resetRequestCount() {
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
    }

    // Set the active model
    setActiveModel(modelName) {
        return this.mcp.switchModel(modelName);
    }

    // Add context for AI interactions
    addContext(key, value) {
        this.mcp.addContext(key, value);
    }

    // Generate AI response with permission checking
    async generateResponse(prompt, options = {}) {
        try {
            // Check permissions
            if (!this.checkPermission('accessData')) {
                throw new Error('AI does not have permission to access data');
            }

            // Check rate limit
            if (!this.checkRateLimit()) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            // Increment request count
            this.requestCount++;

            // Generate response
            const response = await this.mcp.generate(prompt, {
                ...options,
                temperature: options.temperature || this.config.openai.temperature
            });

            return response;
        } catch (error) {
            console.error('AI generation error:', error);
            throw error;
        }
    }

    // Generate task suggestions
    async generateTaskSuggestions(context) {
        const prompt = `Based on the following context, suggest 3 relevant tasks:\n${JSON.stringify(context)}`;
        return await this.generateResponse(prompt, {
            temperature: 0.8,
            maxTokens: 200
        });
    }

    // Generate schedule optimization
    async optimizeSchedule(schedule) {
        const prompt = `Optimize the following schedule for better productivity:\n${JSON.stringify(schedule)}`;
        return await this.generateResponse(prompt, {
            temperature: 0.7,
            maxTokens: 300
        });
    }

    // Generate health recommendations
    async generateHealthRecommendations(healthData) {
        const prompt = `Based on the following health data, provide personalized recommendations:\n${JSON.stringify(healthData)}`;
        return await this.generateResponse(prompt, {
            temperature: 0.6,
            maxTokens: 250
        });
    }

    // Update UI with permission checking
    async updateInterface(changes) {
        if (!this.checkPermission('updateUI')) {
            throw new Error('AI does not have permission to modify the interface');
        }

        try {
            const response = await fetch(this.config.backend.endpoints.uiUpdate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(changes)
            });

            return await response.json();
        } catch (error) {
            console.error('Failed to update interface:', error);
            throw error;
        }
    }

    // Execute backend commands with permission checking
    async executeCommand(command) {
        if (!this.checkPermission('executeCommands')) {
            throw new Error('AI does not have permission to execute commands');
        }

        try {
            const response = await fetch(this.config.backend.endpoints.systemCommands, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command })
            });

            return await response.json();
        } catch (error) {
            console.error('Failed to execute command:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const aiService = new AIService();
export default aiService; 