import { useEffect, useMemo, useState } from 'react';
import { MessageSquareText, SendHorizonal, X, Sparkles, Copy, RotateCcw } from 'lucide-react';
import { profile } from '../data/profile';
import { education } from '../data/education';
import { skills } from '../data/skills';
import { projects } from '../data/projects';

const DEFAULT_SUGGESTIONS = [
  'INSPECT THE ARCHIVE',
  'ASK A TECHNICAL QUESTION',
  'EXPLAIN SOMETHING',
  'TELL ME ABOUT VANTA'
];

function buildKnowledgeResponse(question) {
  const q = question.toLowerCase();

  if (q.includes('om sai') || q.includes('omsai')) {
    return `${profile.displayName} is ${profile.fullName}. I am a Computer Science undergraduate at ${profile.university}, currently in my ${profile.semester}.`;
  }

  if (q.includes('study') || q.includes('university') || q.includes('degree') || q.includes('education')) {
    return `I am pursuing a ${profile.title} at ${education.university}. The programme is currently in the ${education.semester}, with expected graduation in ${education.expectedGraduation}.`;
  }

  if (q.includes('course') || q.includes('module') || q.includes('work')) {
    return `Current coursework includes: ${education.coursework.join(', ')}.`;
  }

  if (q.includes('skill') || q.includes('technology') || q.includes('programming')) {
    return `Current technical skills include: ${skills.programmingLanguages.join(', ')}, database experience with ${skills.databases.join(', ')}, and tools such as ${skills.tools.join(', ')}.`;
  }

  if (q.includes('project') || q.includes('vanta') || q.includes('line editor')) {
    const vanta = projects[0];
    const lineEditor = projects[1];
    return `${vanta.title}: ${vanta.description}. ${lineEditor.title}: ${lineEditor.description}`;
  }

  if (q.includes('github')) {
    return `GitHub profile: ${profile.github}.`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone')) {
    return `Email: ${profile.email}. Phone: ${profile.phone}.`;
  }

  return 'The archive contains no record of that. Adriel is currently operating in local archive mode; connect VITE_ADRIEL_ENDPOINT for general technical questions.';
}

export default function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to the archive. I am Adriel. Ask me about OMSAI, the work documented here, or anything else you wish to investigate.'
    }
  ]);

  const suggestionList = useMemo(() => DEFAULT_SUGGESTIONS, []);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('adriel:open', open);
    return () => window.removeEventListener('adriel:open', open);
  }, []);

  const sendQuestion = async (value = question) => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    setError('');
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);
    setQuestion('');

    const endpoint = import.meta.env.VITE_ADRIEL_ENDPOINT;
    if (!endpoint) {
      setMessages((current) => [...current, { role: 'assistant', text: buildKnowledgeResponse(trimmed) }]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', text: trimmed }] })
      });
      if (!response.ok) throw new Error('Response unavailable');
      const payload = await response.json();
      setMessages((current) => [...current, { role: 'assistant', text: payload.message || payload.text || 'Adriel returned no readable response.' }]);
    } catch {
      setError('Adriel could not reach the archive intelligence service. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = async (text) => { await navigator.clipboard?.writeText(text); };
  const clearConversation = () => setMessages([{ role: 'assistant', text: 'Welcome to the archive. I am Adriel. Ask me about OMSAI, the work documented here, or anything else you wish to investigate.' }]);

  return (
    <div className="portfolio-assistant">
      {isOpen ? (
        <div className="assistant-panel adriel-panel" role="dialog" aria-label="Adriel archival intelligence">
          <div className="assistant-header">
            <div className="assistant-title-wrap">
              <Sparkles size={16} />
              <span>Adriel <small>ARCHIVAL INTELLIGENCE / ONLINE</small></span>
            </div>
            <div className="assistant-header-actions">
              <button type="button" className="assistant-clear" onClick={clearConversation} aria-label="Clear Adriel conversation" title="Clear conversation"><RotateCcw size={14} /></button>
              <button type="button" className="assistant-close" onClick={() => setIsOpen(false)} aria-label="Close Adriel">
              <X size={16} />
              </button>
            </div>
          </div>

          <div className="assistant-suggestions" aria-label="Suggested questions">
            {suggestionList.map((item) => (
              <button key={item} type="button" onClick={() => sendQuestion(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="assistant-chat" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`assistant-message assistant-message--${message.role}`}>
                {message.text}
                {message.role === 'assistant' && <button type="button" className="assistant-copy" onClick={() => copyMessage(message.text)} aria-label="Copy Adriel response"><Copy size={12} /></button>}
              </div>
            ))}
            {isLoading && <div className="assistant-message assistant-message--assistant assistant-loading">Adriel is listening<span>...</span></div>}
          </div>

          {error && <p className="assistant-error" role="alert">{error}</p>}

          <div className="assistant-input-row">
            <input
              type="text"
              aria-label="Ask Adriel a question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendQuestion();
              }}
              placeholder="Ask Adriel anything…"
            />
            <button type="button" onClick={() => sendQuestion()} aria-label="Send question">
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="assistant-toggle" onClick={() => setIsOpen(true)} aria-label="Open portfolio assistant">
          <MessageSquareText size={18} />
          <span>Open Adriel <small>A / ARCHIVE INTELLIGENCE</small></span>
        </button>
      )}
    </div>
  );
}
