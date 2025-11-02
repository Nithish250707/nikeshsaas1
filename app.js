// Red Alert SaaS Application JavaScript

// Application Data
const appData = {
  keywords: [
    {
      id: 1,
      phrase: "project management software",
      subreddits: ["r/entrepreneur", "r/productivity"],
      alertsToday: 12,
      active: true
    },
    {
      id: 2,
      phrase: "CRM alternatives",
      subreddits: ["r/sales", "r/smallbusiness"],
      alertsToday: 8,
      active: true
    },
    {
      id: 3,
      phrase: "email marketing tools",
      subreddits: ["r/marketing", "r/ecommerce"],
      alertsToday: 5,
      active: false
    }
  ],
  alerts: [
    {
      id: 1,
      subreddit: "r/entrepreneur",
      sentiment: "Positive",
      intent: "High Intent",
      title: "Looking for a good project management tool for my startup - any recommendations?",
      author: "startupfounder23",
      timeAgo: "2h ago",
      upvotes: 47,
      comments: 23
    },
    {
      id: 2,
      subreddit: "r/SaaS",
      sentiment: "Neutral",
      intent: "Medium Intent",
      title: "Any recommendations for CRM software under $100/month for small team?",
      author: "salesmanager99",
      timeAgo: "5h ago",
      upvotes: 32,
      comments: 18
    },
    {
      id: 3,
      subreddit: "r/startups",
      sentiment: "Negative",
      intent: "High Intent",
      title: "Frustrated with current email marketing tool - what are you all using?",
      author: "marketingpro42",
      timeAgo: "1d ago",
      upvotes: 28,
      comments: 15
    },
    {
      id: 4,
      subreddit: "r/marketing",
      sentiment: "Positive",
      intent: "Medium Intent",
      title: "What CRM do you recommend for a growing agency?",
      author: "agencyowner",
      timeAgo: "3h ago",
      upvotes: 18,
      comments: 12
    }
  ],
  stats: {
    activeKeywords: { value: 12, change: "↑ 2 from last week" },
    newAlerts: { value: 47, change: "12% increase" },
    subreddits: { value: 23, change: "Across all keywords" },
    engagementRate: { value: "68%", change: "8% from last month" }
  }
};

// Application State
let currentView = 'landing';
let currentTab = 'alerts';
let currentFilter = 'all';
let isKeywordFormVisible = false;
let isInitialized = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  try {
    console.log('Red Alert application initializing...');
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
      console.log('Lucide icons initialized');
    }
    
    // Initialize dashboard content
    setTimeout(() => {
      renderAlerts();
      renderKeywords();
    }, 100);
    
    // Add fade-in animation to landing page
    const landingPage = document.getElementById('landing-page');
    if (landingPage) {
      landingPage.style.opacity = '0';
      landingPage.style.transform = 'translateY(20px)';
      setTimeout(() => {
        landingPage.style.transition = 'all 0.8s ease-out';
        landingPage.style.opacity = '1';
        landingPage.style.transform = 'translateY(0)';
      }, 100);
    }
    
    // Set up event listeners
    setupEventListeners();
    
    isInitialized = true;
    console.log('Application initialized successfully');
    
  } catch (error) {
    console.warn('Non-critical initialization error:', error);
    // Don't show error notification for initialization issues
  }
});

// Setup Event Listeners
function setupEventListeners() {
  // Filter button event listeners
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const filters = ['all', 'high-intent', 'positive', 'negative'];
      filterAlerts(filters[index], this);
    });
  });
  
  // Tab button event listeners
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const tabName = this.dataset.tab;
      if (tabName) {
        switchTab(tabName);
      }
    });
  });
  
  console.log('Event listeners set up successfully');
}

// View Switching Functions
function switchToDashboard() {
  try {
    console.log('Switching to dashboard...');
    const landingPage = document.getElementById('landing-page');
    const dashboard = document.getElementById('dashboard');
    
    if (!landingPage || !dashboard) {
      console.error('Could not find landing page or dashboard elements');
      return;
    }
    
    // Clear any existing transitions
    landingPage.style.transition = '';
    dashboard.style.transition = '';
    
    // Hide landing page
    landingPage.classList.add('hidden');
    
    // Show dashboard
    dashboard.classList.remove('hidden');
    dashboard.style.opacity = '1';
    dashboard.style.transform = 'translateY(0)';
    
    currentView = 'dashboard';
    
    // Re-initialize icons in dashboard
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
    
    console.log('Dashboard view activated');
    
  } catch (error) {
    console.error('Error switching to dashboard:', error);
  }
}

function switchToLanding() {
  try {
    console.log('Switching to landing page...');
    const landingPage = document.getElementById('landing-page');
    const dashboard = document.getElementById('dashboard');
    
    if (!landingPage || !dashboard) {
      console.error('Could not find landing page or dashboard elements');
      return;
    }
    
    // Clear any existing transitions
    landingPage.style.transition = '';
    dashboard.style.transition = '';
    
    // Hide dashboard
    dashboard.classList.add('hidden');
    
    // Show landing page
    landingPage.classList.remove('hidden');
    landingPage.style.opacity = '1';
    landingPage.style.transform = 'translateY(0)';
    
    currentView = 'landing';
    
    // Re-initialize icons in landing page
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
    
    console.log('Landing page view activated');
    
  } catch (error) {
    console.error('Error switching to landing page:', error);
  }
}

// Tab Switching with proper event handling
function switchTab(tabName) {
  try {
    console.log(`Switching to tab: ${tabName}`);
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      }
    });
    
    // Update tab content  
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(`${tabName}-content`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
    
    currentTab = tabName;
    
    // Re-initialize icons for the new tab content
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
    
    console.log(`Tab switched to: ${tabName}`);
    
  } catch (error) {
    console.error('Error switching tabs:', error);
  }
}

// Alert Filtering with proper button handling
function filterAlerts(filter, buttonElement) {
  try {
    console.log(`Filtering alerts by: ${filter}`);
    currentFilter = filter;
    
    // Update filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (buttonElement) {
      buttonElement.classList.add('active');
    }
    
    // Re-render alerts with filter
    renderAlerts();
    
    console.log(`Alerts filtered by: ${filter}`);
    
  } catch (error) {
    console.error('Error filtering alerts:', error);
  }
}

// Render Alerts with proper filtering
function renderAlerts() {
  try {
    console.log('Rendering alerts...');
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) {
      console.warn('Alerts list element not found');
      return;
    }
    
    let filteredAlerts = appData.alerts;
    
    // Apply filter
    if (currentFilter !== 'all') {
      filteredAlerts = appData.alerts.filter(alert => {
        switch (currentFilter) {
          case 'high-intent':
            return alert.intent === 'High Intent';
          case 'positive':
            return alert.sentiment === 'Positive';
          case 'negative':
            return alert.sentiment === 'Negative';
          default:
            return true;
        }
      });
    }
    
    console.log(`Rendering ${filteredAlerts.length} filtered alerts`);
    
    alertsList.innerHTML = filteredAlerts.map(alert => `
      <div class="alert-card" style="animation: fadeIn 0.3s ease-out">
        <div class="alert-header">
          <span class="subreddit-badge">${alert.subreddit}</span>
          <span class="subreddit-badge sentiment-${alert.sentiment.toLowerCase()}">${alert.sentiment}</span>
          <span class="subreddit-badge intent-${alert.intent.toLowerCase().replace(' ', '-')}">${alert.intent}</span>
        </div>
        <h4 class="alert-title">${alert.title}</h4>
        <div class="alert-meta">
          <span>u/${alert.author}</span>
          <span>${alert.timeAgo}</span>
          <div class="alert-stats">
            <i data-lucide="arrow-up"></i>
            <span>${alert.upvotes}</span>
          </div>
          <div class="alert-stats">
            <i data-lucide="message-circle"></i>
            <span>${alert.comments}</span>
          </div>
        </div>
        <div class="alert-actions">
          <button class="btn-view" onclick="viewPost(${alert.id})">View Post</button>
          <button class="btn-engage" onclick="engagePost(${alert.id})">Engage</button>
        </div>
      </div>
    `).join('');
    
    // Re-initialize icons
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
    
    console.log('Alerts rendered successfully');
    
  } catch (error) {
    console.error('Error rendering alerts:', error);
  }
}

// Alert Actions
function viewPost(alertId) {
  try {
    console.log(`Viewing post: ${alertId}`);
    const alert = appData.alerts.find(a => a.id === alertId);
    if (alert) {
      window.open(`https://reddit.com/${alert.subreddit}`, '_blank');
      showNotification(`Opening ${alert.subreddit} post`, 'info');
    }
  } catch (error) {
    console.error('Error viewing post:', error);
  }
}

function engagePost(alertId) {
  try {
    console.log(`Engaging with post: ${alertId}`);
    const alert = appData.alerts.find(a => a.id === alertId);
    if (alert) {
      showNotification('Engagement suggestions: "Have you considered trying [your solution]? I had a similar challenge and found it really helpful for..."', 'info');
    }
  } catch (error) {
    console.error('Error engaging with post:', error);
  }
}

// Keyword Management Functions
function toggleKeywordForm() {
  try {
    console.log('Toggling keyword form...');
    const form = document.getElementById('keyword-form');
    if (!form) {
      console.warn('Keyword form not found');
      return;
    }
    
    isKeywordFormVisible = !isKeywordFormVisible;
    
    if (isKeywordFormVisible) {
      form.classList.remove('hidden');
      form.style.opacity = '1';
      form.style.transform = 'translateY(0)';
      
      // Focus on first input
      const firstInput = form.querySelector('input');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
      
      console.log('Keyword form shown');
    } else {
      form.classList.add('hidden');
      // Clear form
      form.querySelectorAll('input').forEach(input => input.value = '');
      console.log('Keyword form hidden');
    }
    
  } catch (error) {
    console.error('Error toggling keyword form:', error);
  }
}

function addKeyword() {
  try {
    console.log('Adding new keyword...');
    const phraseInput = document.getElementById('keyword-phrase');
    const subredditsInput = document.getElementById('keyword-subreddits');
    
    if (!phraseInput || !subredditsInput) {
      console.warn('Form inputs not found');
      return;
    }
    
    const phrase = phraseInput.value.trim();
    const subredditsText = subredditsInput.value.trim();
    
    if (!phrase || !subredditsText) {
      showNotification('Please fill in both fields', 'error');
      return;
    }
    
    if (phrase.length < 3) {
      showNotification('Keyword phrase must be at least 3 characters', 'error');
      return;
    }
    
    // Parse subreddits
    const subreddits = subredditsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s.startsWith('r/') ? s : `r/${s}`);
    
    if (subreddits.length === 0) {
      showNotification('Please enter at least one subreddit', 'error');
      return;
    }
    
    // Create new keyword
    const newKeyword = {
      id: Math.max(...appData.keywords.map(k => k.id)) + 1,
      phrase: phrase,
      subreddits: subreddits,
      alertsToday: 0,
      active: true
    };
    
    // Add to data
    appData.keywords.push(newKeyword);
    
    // Re-render keywords
    renderKeywords();
    
    // Hide form
    toggleKeywordForm();
    
    // Show success feedback
    showNotification(`Keyword "${phrase}" added successfully!`, 'success');
    
    console.log('Keyword added:', newKeyword);
    
  } catch (error) {
    console.error('Error adding keyword:', error);
    showNotification('Error adding keyword. Please try again.', 'error');
  }
}

function renderKeywords() {
  try {
    console.log('Rendering keywords...');
    const keywordsList = document.getElementById('keywords-list');
    if (!keywordsList) {
      console.warn('Keywords list element not found');
      return;
    }
    
    if (appData.keywords.length === 0) {
      keywordsList.innerHTML = '<div class="no-keywords">No keywords added yet. Click "Add Keyword" to get started.</div>';
      return;
    }
    
    keywordsList.innerHTML = appData.keywords.map(keyword => `
      <div class="keyword-item" style="animation: fadeIn 0.3s ease-out" data-keyword-id="${keyword.id}">
        <div class="keyword-info">
          <h4>${keyword.phrase}</h4>
          <div class="keyword-subreddits">${keyword.subreddits.join(', ')}</div>
          <div class="keyword-stats">${keyword.alertsToday} alerts today</div>
        </div>
        <div class="keyword-controls">
          <label class="keyword-toggle">
            <input type="checkbox" ${keyword.active ? 'checked' : ''} onchange="toggleKeyword(${keyword.id}, this)">
            <span class="toggle-slider"></span>
          </label>
          <button class="btn-delete" onclick="deleteKeyword(${keyword.id})" title="Delete keyword">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `).join('');
    
    // Re-initialize icons
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
    
    console.log(`Rendered ${appData.keywords.length} keywords`);
    
  } catch (error) {
    console.error('Error rendering keywords:', error);
  }
}

function toggleKeyword(keywordId, toggleElement) {
  try {
    console.log(`Toggling keyword: ${keywordId}`);
    const keyword = appData.keywords.find(k => k.id === keywordId);
    if (keyword) {
      keyword.active = toggleElement.checked;
      
      // Show feedback
      const status = keyword.active ? 'activated' : 'deactivated';
      showNotification(`Keyword "${keyword.phrase}" ${status}`, keyword.active ? 'success' : 'info');
      
      console.log(`Keyword ${keywordId} ${status}`);
    }
  } catch (error) {
    console.error('Error toggling keyword:', error);
  }
}

function deleteKeyword(keywordId) {
  try {
    console.log(`Deleting keyword: ${keywordId}`);
    const keyword = appData.keywords.find(k => k.id === keywordId);
    if (!keyword) {
      console.warn('Keyword not found');
      return;
    }
    
    if (confirm(`Are you sure you want to delete the keyword "${keyword.phrase}"?`)) {
      // Remove from data
      const initialLength = appData.keywords.length;
      appData.keywords = appData.keywords.filter(k => k.id !== keywordId);
      
      if (appData.keywords.length < initialLength) {
        // Re-render keywords
        renderKeywords();
        
        // Show feedback
        showNotification(`Keyword "${keyword.phrase}" deleted`, 'info');
        
        console.log(`Keyword ${keywordId} deleted successfully`);
      } else {
        console.warn('Keyword deletion failed');
        showNotification('Error deleting keyword. Please try again.', 'error');
      }
    }
  } catch (error) {
    console.error('Error deleting keyword:', error);
    showNotification('Error deleting keyword. Please try again.', 'error');
  }
}

// Header Action Functions
function showNotifications() {
  console.log('Showing notifications...');
  showNotification('You have 3 new high-intent alerts ready for engagement!', 'info');
}

function showSettings() {
  console.log('Opening settings...');
  showNotification('Settings panel would open here with account preferences, notification settings, and billing options.', 'info'); 
}

function showUserMenu() {
  console.log('Opening user menu...');
  showNotification('User menu: Profile settings, billing, help center, and logout options would appear here.', 'info');
}

function showAnalytics() {
  console.log('Opening analytics...');
  showNotification('Full analytics dashboard would show detailed keyword performance, engagement metrics, and ROI tracking.', 'info');
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
  try {
    console.log(`Showing notification: ${type} - ${message}`);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i data-lucide="x"></i>
        </button>
      </div>
    `;
    
    // Add styles
    const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      min-width: 300px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      transition: opacity 0.2s;
      flex-shrink: 0;
    `;
    
    // Add animation styles if not exists
    if (!document.querySelector('#notification-animation')) {
      const style = document.createElement('style');
      style.id = 'notification-animation';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Initialize icons
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
    
    console.log('Notification shown successfully');
    
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Enhanced Button Interactions
document.addEventListener('click', function(e) {
  try {
    // Add click ripple effect to buttons
    if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('no-ripple')) {
      createRipple(e);
    }
    
    // Log button clicks for debugging
    if (e.target.tagName === 'BUTTON') {
      console.log('Button clicked:', e.target.textContent.trim(), e.target.className);
    }
  } catch (error) {
    // Silently handle ripple errors
    console.warn('Button interaction error:', error);
  }
});

function createRipple(event) {
  try {
    const button = event.currentTarget || event.target;
    
    // Don't add ripple if button already has one
    if (button.querySelector('.ripple')) {
      return;
    }
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    circle.style.cssText += `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      background-color: rgba(255, 255, 255, 0.3);
      pointer-events: none;
    `;
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-animation')) {
      const rippleStyle = document.createElement('style');
      rippleStyle.id = 'ripple-animation';
      rippleStyle.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(rippleStyle);
    }
    
    // Ensure button has relative positioning
    const buttonPosition = window.getComputedStyle(button).position;
    if (buttonPosition !== 'relative' && buttonPosition !== 'absolute') {
      button.style.position = 'relative';
    }
    
    button.appendChild(circle);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (circle.parentElement) {
        circle.remove();
      }
    }, 600);
    
  } catch (error) {
    // Silently handle ripple errors
    console.warn('Ripple effect error:', error);
  }
}

// Form validation
function validateKeywordForm() {
  try {
    const phraseInput = document.getElementById('keyword-phrase');
    const subredditsInput = document.getElementById('keyword-subreddits');
    
    if (!phraseInput || !subredditsInput) return false;
    
    const phrase = phraseInput.value.trim();
    const subreddits = subredditsInput.value.trim();
    
    // Real-time validation feedback
    if (phrase.length > 0 && phrase.length < 3) {
      phraseInput.style.borderColor = '#EF4444';
      return false;
    } else {
      phraseInput.style.borderColor = '#d1d5db';
    }
    
    if (subreddits.length > 0 && subreddits.length < 2) {
      subredditsInput.style.borderColor = '#EF4444';
      return false;
    } else {
      subredditsInput.style.borderColor = '#d1d5db';
    }
    
    return phrase.length >= 3 && subreddits.length >= 2;
  } catch (error) {
    console.warn('Form validation error:', error);
    return false;
  }
}

// Add real-time validation to form inputs
document.addEventListener('input', function(e) {
  try {
    if (e.target.id === 'keyword-phrase' || e.target.id === 'keyword-subreddits') {
      validateKeywordForm();
    }
  } catch (error) {
    console.warn('Input validation error:', error);
  }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  try {
    // ESC key to close forms/modals
    if (e.key === 'Escape') {
      if (isKeywordFormVisible) {
        toggleKeywordForm();
      }
    }
    
    // Tab switching with keyboard (Alt + number)
    if (e.altKey && currentView === 'dashboard') {
      switch (e.key) {
        case '1':
          switchTab('alerts');
          break;
        case '2':
          switchTab('keywords');
          break;
        case '3':
          switchTab('analytics');
          break;
      }
    }
  } catch (error) {
    console.warn('Keyboard navigation error:', error);
  }
});

// Enhanced hover effects
document.addEventListener('mouseover', function(e) {
  try {
    if (e.target.classList.contains('feature-card') || 
        e.target.classList.contains('pricing-card') ||
        e.target.classList.contains('stat-card') ||
        e.target.classList.contains('alert-card') ||
        e.target.classList.contains('keyword-item')) {
      e.target.style.transition = 'transform 0.2s ease';
      e.target.style.transform = 'translateY(-2px)';
    }
  } catch (error) {
    console.warn('Hover effect error:', error);
  }
});

document.addEventListener('mouseout', function(e) {
  try {
    if (e.target.classList.contains('feature-card') || 
        e.target.classList.contains('pricing-card') ||
        e.target.classList.contains('stat-card') ||
        e.target.classList.contains('alert-card') ||
        e.target.classList.contains('keyword-item')) {
      e.target.style.transform = 'translateY(0)';
    }
  } catch (error) {
    console.warn('Hover effect error:', error);
  }
});

// Performance monitoring
let performanceMetrics = {
  pageLoadTime: 0,
  interactionCount: 0,
  lastInteraction: Date.now()
};

window.addEventListener('load', function() {
  try {
    performanceMetrics.pageLoadTime = performance.now();
    console.log(`Page loaded in ${performanceMetrics.pageLoadTime.toFixed(2)}ms`);
  } catch (error) {
    console.warn('Performance monitoring error:', error);
  }
});

document.addEventListener('click', function() {
  try {
    performanceMetrics.interactionCount++;
    performanceMetrics.lastInteraction = Date.now();
  } catch (error) {
    console.warn('Interaction tracking error:', error);
  }
});

// Remove global error handler to prevent persistent error messages
// Only log errors to console for debugging

console.log('Red Alert application loaded successfully');

// Show/hide notifications dropdown
function showNotifications() {
    document.getElementById('notifications-dropdown').classList.toggle('hidden');
    document.getElementById('settings-modal').classList.add('hidden');
    document.getElementById('user-menu').classList.add('hidden');
}

// Show/hide settings modal
function showSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('notifications-dropdown').classList.add('hidden');
    document.getElementById('user-menu').classList.add('hidden');
}
function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

// Show/hide user menu
function showUserMenu() {
    document.getElementById('user-menu').classList.toggle('hidden');
    document.getElementById('notifications-dropdown').classList.add('hidden');
    document.getElementById('settings-modal').classList.add('hidden');
}

// Simple logout function
function logout() {
    alert('Logged out!');
    document.getElementById('user-menu').classList.add('hidden');
}

// Hide dropdowns/modals when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.notification-container') &&
        !event.target.closest('#notifications-dropdown')) {
        document.getElementById('notifications-dropdown').classList.add('hidden');
    }
    if (!event.target.closest('.settings-icon') &&
        !event.target.closest('#settings-modal')) {
        document.getElementById('settings-modal').classList.add('hidden');
    }
    if (!event.target.closest('.user-avatar') &&
        !event.target.closest('#user-menu')) {
        document.getElementById('user-menu').classList.add('hidden');
    }
});