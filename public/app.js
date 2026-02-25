// ============ STATE MANAGEMENT ============
let currentModel = 'fom';
let messages = [];
let memories = [];
let isSending = false;
let memoryCount = 0;

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const chatViewport = document.getElementById('chatViewport');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const memoriesContainer = document.getElementById('memoriesContainer');
const modelStatus = document.getElementById('modelStatus');

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    // Focus input
    userInput.focus();
    
    // Add event listeners
    userInput.addEventListener('input', autoResizeTextarea);
    userInput.addEventListener('keydown', handleKeyDown);
    sendBtn.addEventListener('click', sendMessage);
    
    // Model switcher listeners
    document.querySelectorAll('.model-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchModel(this.dataset.model, this);
        });
    });
    
    // Keyboard shortcut: / to focus input
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== userInput) {
            e.preventDefault();
            userInput.focus();
        }
    });
    
    // Check API health
    checkHealth();
    
    // Add quick prompts
    addQuickPrompts();
});

// ============ UI UTILITIES ============
function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// ============ MODEL SWITCHING ============
function switchModel(model, element) {
    if (!element) return;
    
    document.querySelectorAll('.model-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
    currentModel = model;
    
    modelStatus.textContent = model === 'fom' ? 'FOM 1.0 Active' : 'RVM 1.0 Active';
    
    // Add system message
    appendMessage('ai', `Switched to ${model === 'fom' ? 'Fast Output Model (FOM 1.0)' : 'Research Verifying Model (RVM 1.0)'} for optimized responses.`);
}

// ============ MESSAGE HANDLING ============
function appendMessage(role, content, isHtml = false) {
    const row = document.createElement('div');
    row.className = `msg-row ${role}`;
    
    let displayContent = content;
    if (!isHtml) {
        displayContent = content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
    
    row.innerHTML = `
        <div class="msg-header">
            <div class="msg-avatar">${role === 'ai' ? 'M' : 'U'}</div>
            <span>${role === 'ai' ? 'MUMU RESEARCH ASSISTANT' : 'RESEARCHER'}</span>
        </div>
        <div class="msg-content">${displayContent}</div>
    `;
    
    chatContainer.appendChild(row);
    
    // Store message
    messages.push({ role, content });
    
    // Scroll to bottom
    scrollToBottom();
    
    return row;
}

function scrollToBottom() {
    chatViewport.scrollTo({
        top: chatViewport.scrollHeight,
        behavior: 'smooth'
    });
}

function showThinking() {
    const row = document.createElement('div');
    row.className = 'msg-row ai';
    row.id = 'thinkingIndicator';
    row.innerHTML = `
        <div class="msg-header">
            <div class="msg-avatar">M</div>
            <span>MUMU RESEARCH ASSISTANT</span>
        </div>
        <div class="msg-content">
            <div class="thinking-indicator">
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
            </div>
        </div>
    `;
    chatContainer.appendChild(row);
    scrollToBottom();
}

function removeThinking() {
    const thinking = document.getElementById('thinkingIndicator');
    if (thinking) thinking.remove();
}

// ============ MEMORY MANAGEMENT ============
function addMemory(prompt, response, model) {
    const memory = {
        id: Date.now(),
        prompt: prompt.substring(0, 60) + (prompt.length > 60 ? '...' : ''),
        response: response.substring(0, 80) + (response.length > 80 ? '...' : ''),
        model: model.toUpperCase(),
        tokens: Math.ceil(response.length / 4),
        timestamp: new Date()
    };
    
    memories.unshift(memory);
    if (memories.length > 20) memories.pop();
    
    updateMemoriesDisplay();
}

function updateMemoriesDisplay() {
    if (memories.length === 0) {
        memoriesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <div>No memories yet.<br>Start a conversation to build context.</div>
            </div>
        `;
        return;
    }
    
    memoriesContainer.innerHTML = memories.map(m => `
        <div class="memory-card" onclick="loadMemory(${m.id})">
            <div class="memory-title">${escapeHtml(m.prompt)}</div>
            <div class="memory-preview">${escapeHtml(m.response)}</div>
            <div class="memory-stats">
                <span class="memory-badge">${m.model}</span>
                <span class="memory-badge">${m.tokens} tokens</span>
            </div>
        </div>
    `).join('');
}

// Make loadMemory globally accessible
window.loadMemory = function(id) {
    const memory = memories.find(m => m.id === id);
    if (memory) {
        userInput.value = memory.prompt;
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
        userInput.focus();
    }
};

// Make startNewChat globally accessible
window.startNewChat = function() {
    chatContainer.innerHTML = `
        <div class="msg-row ai">
            <div class="msg-header">
                <div class="msg-avatar">M</div>
                <span>MUMU RESEARCH ASSISTANT</span>
            </div>
            <div class="msg-content">
                Hello. I am the Modular Unified Machine for Understanding. How can I assist with your academic research today?
            </div>
        </div>
    `;
    messages = [];
};

// ============ API COMMUNICATION ============
async function sendMessage() {
    const prompt = userInput.value.trim();
    if (!prompt || isSending) return;

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show user message
    appendMessage('user', prompt);
    
    // Show thinking indicator
    showThinking();
    
    // Disable send button
    isSending = true;
    sendBtn.disabled = true;
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                model: currentModel
            })
        });
        
        const data = await response.json();
        removeThinking();
        
        if (response.ok && !data.error) {
            const content = data.choices?.[0]?.message?.content || 
                           data.response || 
                           'No response received';
            
            appendMessage('ai', content);
            
            // Add to memory
            const modelName = data.selected_model_name || (currentModel === 'fom' ? 'FOM 1.0' : 'RVM 1.0');
            addMemory(prompt, content, modelName);
            
        } else {
            appendMessage('ai', `Error: ${data.error || 'Failed to generate response'}`);
        }
    } catch (error) {
        removeThinking();
        appendMessage('ai', `Connection Error: ${error.message}. Please check your network and try again.`);
    } finally {
        isSending = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// ============ HEALTH CHECK ============
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (!data.api_key_set) {
            console.warn('API key not configured');
            appendMessage('ai', '⚠️ System Notice: API key not configured. Please contact your administrator.');
        }
    } catch (err) {
        console.error('Health check failed:', err);
    }
}

// ============ QUICK PROMPTS ============
function addQuickPrompts() {
    const quickPrompts = [
        "Explain quantum entanglement in simple terms",
        "Help me structure a research paper on climate change",
        "Summarize recent breakthroughs in AI",
        "Generate a thesis statement about renewable energy"
    ];

    setTimeout(() => {
        if (messages.length === 0) {
            const welcomeMsg = document.querySelector('.msg-row.ai');
            if (welcomeMsg) {
                const quickDiv = document.createElement('div');
                quickDiv.className = 'quick-prompts';
                quickDiv.innerHTML = quickPrompts.map(p => 
                    `<div class="quick-prompt" onclick="useQuickPrompt('${p.replace(/'/g, "\\'")}')">${p}</div>`
                ).join('');
                welcomeMsg.querySelector('.msg-content').appendChild(quickDiv);
            }
        }
    }, 100);
}

// Make useQuickPrompt globally accessible
window.useQuickPrompt = function(prompt) {
    userInput.value = prompt;
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
    sendMessage();
};

// ============ UTILITY FUNCTIONS ============
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}