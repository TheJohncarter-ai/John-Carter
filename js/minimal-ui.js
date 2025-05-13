import uiAdvisor from './ai/ui-advisor.js';

class MinimalUI {
    constructor() {
        this.recommendations = null;
        this.currentView = 'initial';
        this.initialize();
    }

    async initialize() {
        // Get UI recommendations from AI
        this.recommendations = await uiAdvisor.getUIRecommendations();
        
        // Initialize UI components
        this.initializeNavigation();
        this.initializeContentAreas();
        this.initializeProgressiveDisclosure();
        this.initializeScrollHandling();
        
        // Show initial view
        this.showView('initial');
    }

    initializeNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'nav';
        nav.innerHTML = `
            <div class="container">
                <div class="nav-content">
                    <button class="btn menu-toggle">☰</button>
                    <div class="nav-links">
                        <button class="btn" data-view="calendar">Calendar</button>
                        <button class="btn" data-view="tasks">Tasks</button>
                        <button class="btn" data-view="more">More</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertBefore(nav, document.body.firstChild);

        // Add event listeners
        nav.querySelectorAll('[data-view]').forEach(button => {
            button.addEventListener('click', () => {
                this.showView(button.dataset.view);
            });
        });
    }

    initializeContentAreas() {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
            <div class="content-area" id="calendar-view"></div>
            <div class="content-area" id="tasks-view"></div>
            <div class="content-area" id="more-view"></div>
        `;
        document.body.appendChild(container);
    }

    initializeProgressiveDisclosure() {
        const panel = document.createElement('div');
        panel.className = 'feature-panel';
        panel.innerHTML = `
            <div class="panel-content">
                <h3>Additional Features</h3>
                <div class="feature-list">
                    <button class="btn" data-feature="health">Health</button>
                    <button class="btn" data-feature="finance">Finance</button>
                    <button class="btn" data-feature="projects">Projects</button>
                    <button class="btn" data-feature="social">Social</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Add event listeners
        document.querySelector('.menu-toggle').addEventListener('click', () => {
            panel.classList.toggle('visible');
        });

        panel.querySelectorAll('[data-feature]').forEach(button => {
            button.addEventListener('click', () => {
                this.loadFeature(button.dataset.feature);
                panel.classList.remove('visible');
            });
        });
    }

    initializeScrollHandling() {
        let lastScroll = 0;
        const nav = document.querySelector('.nav');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                nav.classList.remove('hidden');
                return;
            }
            
            if (currentScroll > lastScroll && !nav.classList.contains('hidden')) {
                nav.classList.add('hidden');
            } else if (currentScroll < lastScroll && nav.classList.contains('hidden')) {
                nav.classList.remove('hidden');
            }
            
            lastScroll = currentScroll;
        });
    }

    async showView(viewName) {
        // Hide all content areas
        document.querySelectorAll('.content-area').forEach(area => {
            area.classList.remove('visible');
        });

        // Show selected view
        const view = document.getElementById(`${viewName}-view`);
        if (view) {
            view.classList.add('visible');
            await this.loadViewContent(viewName);
        }
    }

    async loadViewContent(viewName) {
        const view = document.getElementById(`${viewName}-view`);
        if (!view) return;

        view.classList.add('loading');
        
        try {
            // Simulate content loading
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Load content based on view
            switch (viewName) {
                case 'calendar':
                    view.innerHTML = this.getCalendarContent();
                    break;
                case 'tasks':
                    view.innerHTML = this.getTasksContent();
                    break;
                case 'more':
                    view.innerHTML = this.getMoreContent();
                    break;
            }
        } finally {
            view.classList.remove('loading');
        }
    }

    async loadFeature(featureName) {
        const container = document.createElement('div');
        container.className = 'feature-container';
        container.innerHTML = `<div class="loading"></div>`;
        
        document.querySelector('.container').appendChild(container);
        
        try {
            // Simulate feature loading
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Load feature content
            container.innerHTML = this.getFeatureContent(featureName);
        } catch (error) {
            console.error(`Error loading feature ${featureName}:`, error);
            container.remove();
        }
    }

    // Content templates
    getCalendarContent() {
        return `
            <div class="card">
                <h2>Calendar</h2>
                <div class="calendar-grid">
                    <!-- Calendar content will be dynamically loaded -->
                </div>
            </div>
        `;
    }

    getTasksContent() {
        return `
            <div class="card">
                <h2>Tasks</h2>
                <div class="task-list">
                    <!-- Task list will be dynamically loaded -->
                </div>
            </div>
        `;
    }

    getMoreContent() {
        return `
            <div class="card">
                <h2>Additional Features</h2>
                <div class="feature-grid">
                    <button class="btn" data-feature="health">Health</button>
                    <button class="btn" data-feature="finance">Finance</button>
                    <button class="btn" data-feature="projects">Projects</button>
                    <button class="btn" data-feature="social">Social</button>
                </div>
            </div>
        `;
    }

    getFeatureContent(featureName) {
        const templates = {
            health: `
                <div class="card">
                    <h2>Health & Wellness</h2>
                    <div class="health-metrics">
                        <!-- Health content will be dynamically loaded -->
                    </div>
                </div>
            `,
            finance: `
                <div class="card">
                    <h2>Financial Overview</h2>
                    <div class="finance-summary">
                        <!-- Finance content will be dynamically loaded -->
                    </div>
                </div>
            `,
            projects: `
                <div class="card">
                    <h2>Projects</h2>
                    <div class="project-list">
                        <!-- Project content will be dynamically loaded -->
                    </div>
                </div>
            `,
            social: `
                <div class="card">
                    <h2>Social Connections</h2>
                    <div class="social-feed">
                        <!-- Social content will be dynamically loaded -->
                    </div>
                </div>
            `
        };

        return templates[featureName] || '<p>Feature not available</p>';
    }
}

// Initialize the UI
document.addEventListener('DOMContentLoaded', () => {
    new MinimalUI();
}); 