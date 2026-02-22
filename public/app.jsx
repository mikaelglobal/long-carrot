const { useState, useEffect, useRef } = React;

function escapeHtml(text = '') {
  return text.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

function formatResponse(text = '') {
  let formatted = escapeHtml(text);
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\n/g, '<br>');
  return formatted;
}

function Header({ currentModel, onToggle, onSelect }) {
  return (
    <div className="header">
      <div className="header-content">
        <div className="logo-container">
          <img src="/static/images/MUMU_AI_0.png" alt="MUMU AI Logo" className="logo-image" />
          <div className="logo-text">MUMU AI</div>
        </div>
        <div className="header-info">
          <div className="header-title">Research Assistant</div>
          <div className="header-subtitle">Modular Unified Machine for Understanding</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div className="model-info-badge">
            <span className="status-dot"></span>
            <span id="currentModelDisplay">{currentModel === 'fom' ? 'FOM 1.0' : 'RVM 1.0'}</span>
          </div>

          <div className="model-toggle-container">
            <span className="toggle-label">FOM</span>
            <div className={"model-toggle" + (currentModel === 'rvm' ? ' active' : '')} id="modelToggle" onClick={onToggle}>
              <div className="toggle-slider"></div>
            </div>
            <span className="toggle-label">RVM</span>
          </div>

          <div className="model-selector">
            <button className={"model-btn" + (currentModel === 'fom' ? ' active' : '')} data-model="fom" onClick={() => onSelect('fom')} title="Fast Output Model">FOM 1.0</button>
            <button className={"model-btn" + (currentModel === 'rvm' ? ' active' : '')} data-model="rvm" onClick={() => onSelect('rvm')} title="Research Verifying Model">RVM 1.0</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Messages({ messages, onCopy, welcomeVisible, onQuickPrompt }) {
  const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, welcomeVisible]);

  return (
    <div className="messages-container" id="messagesContainer" ref={containerRef}>
      {welcomeVisible && (
        <div className="welcome-screen" id="welcomeScreen">
          <img src="/static/images/MUMU_AI_0.png" alt="MUMU AI" className="welcome-logo" />
          <h1 className="welcome-title">Welcome to MUMU AI</h1>
          <p className="welcome-subtitle">Your Advanced Research Companion</p>
          <p className="welcome-description">Powered by cutting-edge AI models, MUMU AI helps you with academic research, citation verification, and intelligent content generation for university projects.</p>
          <div className="quick-prompts">
            <div className="quick-prompt" onClick={() => onQuickPrompt('Explain quantum computing in simple terms')}>Explain quantum computing</div>
            <div className="quick-prompt" onClick={() => onQuickPrompt('Help me structure a research paper on climate change')}>Structure a research paper</div>
            <div className="quick-prompt" onClick={() => onQuickPrompt('Summarize recent AI developments')}>AI developments summary</div>
            <div className="quick-prompt" onClick={() => onQuickPrompt('Generate a thesis statement about renewable energy')}>Thesis statement help</div>
          </div>
        </div>
      )}

      {messages.map((m) => (
        <div className="message-group" key={m.id} id={m.id}>
          <div className={"message" + (m.role === 'user' ? ' user' : '')}>
            <div className="message-content">
              <div className={"bubble " + (m.role === 'user' ? 'user' : 'ai') } dangerouslySetInnerHTML={{__html: m.role === 'assistant' ? formatResponse(m.content) : escapeHtml(m.content)}} />
              <div className="message-actions">
                <button className="action-btn copy-btn" onClick={() => onCopy(m)} aria-label="Copy message">Copy</button>
                {m.role === 'assistant' && (
                  <div className="reactions">
                    <button className="reaction-btn thumbs-up" aria-label="Good response">👍</button>
                    <button className="reaction-btn thumbs-down" aria-label="Bad response">👎</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MemoriesPanel({ memories, total }) {
  return (
    <div className="memories-panel">
      <div className="memories-header">
        <div className="memories-title">Memory Bank</div>
        <div className="memories-subtitle">Interaction history stored for context</div>
      </div>

      <div className="memories-stats">
        <div className="stat-card"><span className="stat-value">{total}</span><span className="stat-label">Total Memories</span></div>
        <div className="stat-card"><span className="stat-value">{memories.length}</span><span className="stat-label">This Session</span></div>
      </div>

      <div className="memories-content">
        {memories.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">—</div><div className="empty-state-text">No memories yet.<br/>Start a conversation to build your memory bank.</div></div>
        ) : (
          memories.map(m => (
            <div className="memory-item" key={m.id}>
              <div className="memory-item-timestamp">{m.timeLabel}</div>
              <div className="memory-item-text"><strong>Q:</strong> {m.prompt}</div>
              <div className="memory-item-meta"><span className="memory-badge">{m.model}</span><span className="memory-badge">{m.tokens} tokens</span></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function InputArea({ value, onChange, onSend }) {
  const ref = useRef();

  useEffect(() => { if (ref.current) ref.current.style.height = 'auto'; }, [value]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <textarea id="promptInput" ref={ref} placeholder="Ask MUMU AI anything about your research..." rows={1} aria-label="Message input" value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown} />
        <button id="sendBtn" onClick={onSend} aria-label="Send message">Send</button>
      </div>
      <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
    </div>
  );
}

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [memories, setMemories] = useState([]);
  const [input, setInput] = useState('');
  const [currentModel, setCurrentModel] = useState('fom');
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // health check
    fetch('/api/health').catch(() => {});
  }, []);

  function addMemory(prompt, response, model='FOM') {
    const memory = { id: Date.now(), prompt: prompt.slice(0,80), full: response, tokens: Math.ceil(response.length/4), model, timeLabel: 'Just now'};
    setMemories(prev => [memory, ...prev].slice(0,50));
  }

  function onCopy(m) {
    const text = m.content || m.prompt || '';
    navigator.clipboard.writeText(text).catch(()=>{});
  }

  async function sendMessage() {
    const prompt = input.trim();
    if (!prompt || sending) return;
    setWelcomeVisible(false);

    const userMsg = { id: 'user-'+Date.now(), role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    const thinkingMsg = { id: 'thinking-'+Date.now(), role: 'assistant', content: 'thinking...' };
    setMessages(prev => [...prev, thinkingMsg]);

    try {
      const response = await fetch('/api/generate', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ prompt, model: currentModel }) });
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || data?.response || (data.error ? `Error: ${data.error}` : 'No response');

      setMessages(prev => prev.filter(m => m.id !== thinkingMsg.id).concat({ id: 'resp-'+Date.now(), role: 'assistant', content }));
      addMemory(prompt, content, data.selected_model_name || currentModel.toUpperCase());
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== thinkingMsg.id).concat({ id: 'resp-'+Date.now(), role: 'assistant', content: `Connection Error: ${err.message}` }));
    } finally {
      setSending(false);
    }
  }

  function onToggleModel() { setCurrentModel(prev => prev === 'fom' ? 'rvm' : 'fom'); }
  function onSelectModel(m) { setCurrentModel(m); }
  function onQuickPrompt(p) { setInput(p); setTimeout(() => sendMessage(), 50); }

  return (
    <div className="app-container">
      <div className="chat-section">
        <Header currentModel={currentModel} onToggle={onToggleModel} onSelect={onSelectModel} />
        <Messages messages={messages} onCopy={onCopy} welcomeVisible={welcomeVisible} onQuickPrompt={onQuickPrompt} />
        <InputArea value={input} onChange={setInput} onSend={sendMessage} />
      </div>
      <MemoriesPanel memories={memories} total={memories.length} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ChatApp />);
