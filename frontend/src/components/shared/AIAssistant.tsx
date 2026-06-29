'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Minimize2, Maximize2, Zap } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  text: string
  timestamp: string
  confidence?: number
}

const QUICK_PROMPTS = [
  'Show me critical risk alerts',
  'Who are our top 3 suppliers?',
  'What is the current supply chain health?',
  'Summarize active negotiations',
  'Any disruptions I should know about?',
  'Generate executive briefing',
]

const AI_RESPONSES: Record<string, string> = {
  'show me critical risk alerts': 'There is currently 1 critical alert active: OFAC sanctions match for AsiaTrade Co. (78% SDN confidence). The Risk & Compliance Agent has blocked engagement and escalated to legal. Additionally, factory fire risk in Shenzhen is elevated at 94% probability — the Alternative Supplier Agent has already identified TaipeiTech Corp as a backup.',
  'who are our top 3 suppliers?': 'Based on combined delivery, quality, ESG, and risk scores:\n1. CapEx Solutions (Germany) — Score 95/100. 98% on-time delivery, ISO certified.\n2. VoltX Energy (South Korea) — Score 92/100. Battery cells at $48/unit, 13% below market.\n3. Nordic Metals (Norway) — Score 90/100. ESG leader at 94/100. Rare earth materials.',
  'what is the current supply chain health?': 'Supply Chain Health Score: 92/100 (Healthy). Key metrics: 128 active suppliers, 92.6% on-time delivery, $1.25M inventory value, 3 open negotiations. Elevated disruption risk score of 46/100 due to Shenzhen factory fire. Monthly savings tracking at $84K vs $150K target (63%).',
  'summarize active negotiations': 'Three active negotiations:\n1. VoltX Energy — Battery Cells. Round 2. Current price $48/unit (target $44). 60% progress.\n2. Nordic Metals — Rare Earth. Final round. $124/kg. 88% progress — near close.\n3. SinoTech Ltd. — Semiconductors. Round 1. $2.40/unit. 25% progress.\nNegotiation Agent is autonomously managing all three.',
  'any disruptions i should know about?': 'Three active disruption events:\n1. CRITICAL: Factory fire at Shenzhen Industrial Zone — SinoTech Ltd. at 45% capacity. Alternative Supplier Agent activated TaipeiTech Corp.\n2. HIGH: Rotterdam port dockworkers strike — EuroMetals AG shipment rerouted via Hamburg, delay reduced from 10 to 3 days.\n3. MEDIUM: Taiwan Strait tension — Global Parts Ltd. risk elevated. 3 backup PCB suppliers pre-qualified.',
  'generate executive briefing': 'EXECUTIVE BRIEFING — March 21, 2026\n\nSupply chain under elevated risk but under control. Factory fire in Shenzhen threatens semiconductor supply — AI has activated backup supplier. Battery cell negotiation achieving 13% below market at $48/unit. Critical: AsiaTrade Co. sanctions match requires legal decision today. Monthly savings at $84K. Three approvals pending executive sign-off. Supply chain health: 92/100.',
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key.split(' ')[0]) && lower.includes(key.split(' ')[key.split(' ').length - 1])) {
      return response
    }
  }
  // Fuzzy match
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    const words = key.split(' ')
    const matches = words.filter(w => lower.includes(w)).length
    if (matches >= 2) return response
  }
  return `I processed your query about "${input}". Based on current procurement data: supply chain health is 92/100, we have 3 critical approvals pending, the Disruption Agent is monitoring 3 active events, and our AI agents are autonomously managing 14 open cases. Would you like me to run a specific agent analysis?`
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hello, I am your SupplyGuardian AI Assistant. I can answer questions about your supply chain, run agent analyses, explain AI decisions, and generate executive briefings. How can I help?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 1.0,
    }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text?: string) {
    const query = (text || input).trim()
    if (!query) return

    const userMsg: Message = {
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

    const aiText = getAIResponse(query)
    const aiMsg: Message = {
      role: 'ai',
      text: aiText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 0.85 + Math.random() * 0.12,
    }
    setMessages(prev => [...prev, aiMsg])
    setThinking(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-dark) 100%)' }}
      >
        <Bot size={24} style={{ color: 'var(--brand-carbon)' }} />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
          style={{ background: 'var(--brand-red)', color: 'white', fontSize: '9px' }}>
          3
        </span>
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all"
      style={{
        width: minimized ? '280px' : '380px',
        height: minimized ? '52px' : '540px',
        background: 'var(--brand-surface)',
        border: '1px solid var(--brand-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)', borderBottom: '1px solid var(--brand-border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--brand-gold)' }}>
            <Bot size={14} style={{ color: 'var(--brand-carbon)' }} />
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>AI Procurement Assistant</div>
            {!minimized && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand-green)' }} />
                <span className="text-xs" style={{ color: 'var(--brand-green)', fontSize: '10px' }}>Online</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setMinimized(!minimized)} className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ color: 'var(--brand-text-dim)' }}>
            {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </button>
          <button onClick={() => setOpen(false)} className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ color: 'var(--brand-text-dim)' }}>
            <X size={12} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'var(--brand-gold)' }}>
                    <Bot size={12} style={{ color: 'var(--brand-carbon)' }} />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className="rounded-xl px-3 py-2 inline-block text-left"
                    style={{
                      background: msg.role === 'user' ? 'rgba(201,168,76,0.15)' : 'var(--brand-surface-light)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(201,168,76,0.3)' : 'var(--brand-border)'}`,
                    }}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--brand-text)' }}>
                      {msg.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <span style={{ fontSize: '10px', color: 'var(--brand-text-dim)' }}>{msg.timestamp}</span>
                    {msg.confidence && (
                      <span style={{ fontSize: '10px', color: 'var(--brand-green)' }}>
                        {Math.round(msg.confidence * 100)}% conf.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'var(--brand-gold)' }}>
                  <Bot size={12} style={{ color: 'var(--brand-carbon)' }} />
                </div>
                <div className="rounded-xl px-3 py-2" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
                  <span className="ai-thinking text-xs">Analyzing procurement data...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 py-2 flex gap-1.5 overflow-x-auto flex-shrink-0"
            style={{ borderTop: '1px solid var(--brand-border)' }}>
            {QUICK_PROMPTS.slice(0, 3).map(p => (
              <button
                key={p}
                onClick={() => send(p)}
                className="flex-shrink-0 px-2 py-1 rounded-lg text-xs transition-all whitespace-nowrap"
                style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)' }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--brand-border)' }}>
            <input
              className="sg-input flex-1 text-xs"
              placeholder="Ask about suppliers, risks, negotiations..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={() => send()}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--brand-gold)', color: 'var(--brand-carbon)' }}
            >
              <Send size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
