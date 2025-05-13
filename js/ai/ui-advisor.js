import aiService from './service.js';

class UIAdvisor {
    constructor() {
        this.recommendations = null;
    }

    async getUIRecommendations() {
        const prompt = `Given a personal life management dashboard, provide specific UI/UX recommendations for:
        1. Minimalistic design principles
        2. Dynamic content loading patterns
        3. Progressive disclosure of features
        4. Color scheme and typography
        5. Layout and spacing
        6. Interactive elements
        Focus on creating a clean, uncluttered interface that reveals functionality as needed.`;

        try {
            const response = await aiService.generateResponse(prompt, {
                temperature: 0.7,
                maxTokens: 500
            });
            this.recommendations = JSON.parse(response);
            return this.recommendations;
        } catch (error) {
            console.error('Error getting UI recommendations:', error);
            return this.getDefaultRecommendations();
        }
    }

    getDefaultRecommendations() {
        return {
            design: {
                minimalistic: true,
                colorScheme: {
                    primary: '#2196F3',
                    secondary: '#4CAF50',
                    background: '#FFFFFF',
                    text: '#212121',
                    accent: '#FF4081'
                },
                typography: {
                    fontFamily: 'Inter, sans-serif',
                    baseSize: '16px',
                    headingScale: 1.2
                }
            },
            layout: {
                maxWidth: '1200px',
                spacing: {
                    base: '1rem',
                    large: '2rem'
                },
                grid: {
                    columns: 12,
                    gap: '1rem'
                }
            },
            interactions: {
                animations: {
                    duration: '0.3s',
                    easing: 'ease-in-out'
                },
                transitions: {
                    fade: true,
                    slide: true
                }
            },
            progressiveDisclosure: {
                initialView: ['calendar', 'tasks'],
                secondaryView: ['health', 'finance'],
                tertiaryView: ['projects', 'social']
            }
        };
    }
}

export default new UIAdvisor(); 