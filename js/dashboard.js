import aiService from './ai/service.js';

// Dashboard Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeEventListeners();
    initializeAnimations();
    initializeDarkMode();
    initializeAI();
});

// Charts Initialization
function initializeCharts() {
    // Nutrition Chart
    const nutritionCtx = document.getElementById('nutritionChart')?.getContext('2d');
    if (nutritionCtx) {
        new Chart(nutritionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Protein', 'Carbs', 'Fats'],
                datasets: [{
                    data: [30, 50, 20],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Budget Chart
    const budgetCtx = document.getElementById('budgetChart')?.getContext('2d');
    if (budgetCtx) {
        new Chart(budgetCtx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses', 'Savings'],
                datasets: [{
                    label: 'Monthly Overview',
                    data: [4000, 2800, 1200],
                    backgroundColor: ['#4CAF50', '#FF5252', '#2196F3']
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Event Listeners
function initializeEventListeners() {
    // Module Toggles
    document.querySelectorAll('.module-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Task Checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const task = e.target.closest('.task-item');
            if (e.target.checked) {
                task.classList.add('completed');
            } else {
                task.classList.remove('completed');
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Progress Bars Animation
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function calculateProgress(current, total) {
    return Math.round((current / total) * 100);
}

// API Integration Example
async function fetchUserData() {
    try {
        const response = await fetch('/api/user-data');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

function updateDashboard(data) {
    // Update various dashboard elements with the fetched data
    if (data.tasks) updateTasks(data.tasks);
    if (data.events) updateEvents(data.events);
    if (data.stats) updateStats(data.stats);
}

// Example function to update tasks
function updateTasks(tasks) {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <h4>${task.title}</h4>
                <p>${task.description}</p>
            </div>
            <span class="task-due-date">${formatDate(task.dueDate)}</span>
        </div>
    `).join('');
}

// Example function to update events
function updateEvents(events) {
    const eventList = document.querySelector('.event-list');
    if (!eventList) return;

    eventList.innerHTML = events.map(event => `
        <div class="event-item">
            <div class="event-date">
                <span class="day">${new Date(event.date).getDate()}</span>
                <span class="month">${new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="event-details">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
            </div>
        </div>
    `).join('');
}

// Example function to update statistics
function updateStats(stats) {
    Object.entries(stats).forEach(([key, value]) => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            element.textContent = value;
        }
    });
}

// Dark Mode Implementation
function initializeDarkMode() {
    // Set dark theme as default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Add theme toggle button if it doesn't exist
    if (!document.getElementById('theme-toggle')) {
        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.className = 'theme-toggle-btn';
        toggle.innerHTML = `
            <span class="light-icon">☀️</span>
            <span class="dark-icon">🌙</span>
        `;
        document.body.appendChild(toggle);
    }

    // Add toggle event listener
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update charts with new theme colors
        updateChartsTheme(newTheme);
    });

    // Initialize charts with dark theme
    updateChartsTheme('dark');
}

function updateChartsTheme(theme) {
    // Update chart colors based on theme
    const chartColors = {
        light: {
            text: '#212121',
            grid: '#E0E0E0',
            background: '#ffffff'
        },
        dark: {
            text: '#ffffff',
            grid: '#2d2d2d',
            background: '#1a1a1a'
        }
    };

    Chart.instances.forEach(chart => {
        const config = chart.config;
        
        // Update chart text and grid colors
        if (config.options.scales) {
            Object.values(config.options.scales).forEach(scale => {
                scale.grid.color = chartColors[theme].grid;
                scale.ticks.color = chartColors[theme].text;
            });
        }
        
        // Update legend text color
        if (config.options.plugins?.legend) {
            config.options.plugins.legend.labels.color = chartColors[theme].text;
        }

        // Update chart background
        if (config.options.plugins?.legend) {
            config.options.plugins.legend.labels.boxWidth = 20;
            config.options.plugins.legend.labels.padding = 20;
        }
        
        chart.update();
    });
}

// AI Chat Implementation
async function sendToAI() {
    const input = document.getElementById('aiInput');
    const content = document.getElementById('aiDialogContent');
    
    if (input.value.trim() === '') return;

    const userMessage = input.value;
    
    // Add user message to chat
    content.innerHTML += `
        <div class="message user-message">
            <strong>You:</strong> ${userMessage}
        </div>
    `;

    try {
        // Show loading indicator
        content.innerHTML += `
            <div class="message ai-message" id="ai-typing">
                <strong>AI:</strong> <em>Thinking...</em>
            </div>
        `;

        // Get AI response
        const response = await aiService.generateResponse(userMessage, {
            context: {
                userPreferences: {
                    theme: document.documentElement.getAttribute('data-theme'),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                currentView: getCurrentView(),
                activeFeatures: getActiveFeatures()
            }
        });

        // Remove loading indicator
        document.getElementById('ai-typing').remove();

        // Add AI response to chat
        content.innerHTML += `
            <div class="message ai-message">
                <strong>AI:</strong> ${response}
            </div>
        `;

        // Check if AI suggests interface changes
        if (response.includes('UI_UPDATE:')) {
            const changes = parseUIChanges(response);
            if (changes) {
                await handleUIChanges(changes);
            }
        }

        // Clear input
        input.value = '';
        
        // Scroll to bottom
        content.scrollTop = content.scrollHeight;
    } catch (error) {
        console.error('AI Chat Error:', error);
        content.innerHTML += `
            <div class="message error-message">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

// Helper function to get current dashboard view
function getCurrentView() {
    const activeNav = document.querySelector('.nav-link.active');
    return activeNav ? activeNav.textContent.trim() : 'Dashboard';
}

// Helper function to get active features
function getActiveFeatures() {
    return {
        calendar: true,
        tasks: true,
        messages: true,
        documents: true,
        aiAssistant: true
    };
}

// Parse UI update suggestions from AI response
function parseUIChanges(response) {
    const match = response.match(/UI_UPDATE:(.*?)END_UPDATE/s);
    if (match) {
        try {
            return JSON.parse(match[1]);
        } catch (error) {
            console.error('Failed to parse UI changes:', error);
            return null;
        }
    }
    return null;
}

// Handle UI changes suggested by AI
async function handleUIChanges(changes) {
    try {
        await aiService.updateInterface(changes);
        // Refresh relevant parts of the UI
        updateDashboardElements();
    } catch (error) {
        console.error('Failed to apply UI changes:', error);
    }
}

// Update dashboard elements
function updateDashboardElements() {
    // Update charts
    if (window.balanceChart) {
        window.balanceChart.update();
    }
    if (window.budgetChart) {
        window.budgetChart.update();
    }
    
    // Update calendar if available
    if (window.calendar) {
        window.calendar.refetchEvents();
    }
}

// Initialize AI features
async function initializeAI() {
    try {
        // Add initial context
        aiService.addContext('userPreferences', {
            theme: document.documentElement.getAttribute('data-theme'),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });

        // Set up AI model selection if available
        const modelSelector = document.getElementById('ai-model-selector');
        if (modelSelector) {
            modelSelector.addEventListener('change', (e) => {
                aiService.switchModel(e.target.value);
            });
        }

        // Initialize AI-powered features
        await initializeAIFeatures();
        
        console.log('AI features initialized successfully');
    } catch (error) {
        console.error('AI initialization error:', error);
    }
}

// Initialize AI-powered features
async function initializeAIFeatures() {
    // Add event listeners for AI chat
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendToAI();
            }
        });
    }

    // Initialize AI insights
    updateAIInsights();
}

// Update AI insights periodically
function updateAIInsights() {
    setInterval(async () => {
        try {
            const insights = await aiService.generateResponse('Generate dashboard insights', {
                context: {
                    view: 'insights',
                    dataType: 'analytics'
                }
            });
            
            const insightsContainer = document.querySelector('.ai-suggestions');
            if (insightsContainer && insights) {
                insightsContainer.innerHTML = insights;
            }
        } catch (error) {
            console.error('Failed to update AI insights:', error);
        }
    }, 300000); // Update every 5 minutes
}

// Export functions
export {
    sendToAI,
    initializeAI,
    handleUIChanges
}; 