import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Send, Plus, Trash2, LayoutGrid, PaperclipIcon,
  TrendingUp, BarChart3, PiggyBank, Lightbulb, Target
} from 'lucide-react'
import { clsx } from '../utils/helpers'

const QUICK_PROMPTS = [
  { icon: BarChart3,  label: 'Spending summary',  text: 'Give me a breakdown of my spending this month' },
  { icon: Lightbulb,  label: 'Savings tip',        text: 'Give me a personalized savings tip based on my finances' },
  { icon: TrendingUp, label: 'Investments',         text: 'How are my investments performing this month?' },
  { icon: Target,     label: 'Set a budget',        text: 'Help me set a realistic monthly budget' },
  { icon: PiggyBank,  label: 'Savings goals',       text: 'What progress have I made on my savings goals?' },
]

const AI_RESPONSES = {
  spend: "Based on your recent transactions, here's your spending breakdown this month:\n\n• 🏠 Housing — $1,280 (42%)\n• 🍔 Food & Dining — $547 (18%)\n• 🚗 Transport — $365 (12%)\n• 🛍 Shopping — $290 (9%)\n• 💡 Utilities — $180 (6%)\n• 🎬 Entertainment — $140 (5%)\n• 📦 Other — $244 (8%)\n\nYou're 12% below last month's total — excellent progress! Your biggest win is dining out spending, which dropped by $85.",
  save: "Here are 3 personalized savings tips based on your financial profile:\n\n1. **50/30/20 Rule** — You're currently saving ~16%. Try to push toward 20% by cutting your entertainment budget by $60/month.\n\n2. **Subscription audit** — I spotted 3 recurring charges totaling $47/month. Review these — canceling even one could save $564/year.\n\n3. **Round-up savings** — Set up automatic round-ups on every purchase. Rounding to the nearest dollar could net ~$120/month in savings automatically.",
  invest: "Your portfolio performance this month:\n\n📈 **Total value**: $24,850 (+6.2% YTD)\n💚 **Best performer**: Tech stocks +18.4%\n📉 **Worst performer**: Bonds -1.2%\n\nYour current allocation:\n• Stocks — 60%\n• ETFs — 25%\n• Bonds — 10%\n• Crypto — 5%\n\nRecommendation: Consider rebalancing your bond allocation — at -1.2%, there may be better fixed-income alternatives worth exploring.",
  budget: "Let's build your budget! Based on your income and spending patterns, here's a recommended monthly allocation:\n\n• 🏠 Housing & utilities — $1,400 (35%)\n• 🍔 Food & dining — $500 (12.5%)\n• 🚗 Transportation — $350 (8.75%)\n• 🎯 Savings — $800 (20%)\n• 💊 Healthcare — $200 (5%)\n• 🎬 Entertainment — $200 (5%)\n• 📦 Other — $550 (13.75%)\n\nWant me to customize any of these categories?",
  savings: "Here's your savings goals progress:\n\n🏖 **Beach vacation** — $1,200 / $3,000 (40%) — 45 days remaining\n🚗 **New car** — $8,500 / $15,000 (57%) — 8 months remaining  \n🎓 **Emergency fund** — $6,000 / $10,000 (60%) — On track!\n\nAt your current savings rate of $680/month, you'll hit your emergency fund goal by March. The vacation fund needs a small boost — adding just $85/month would get you there on time.",
  default: [
    "Great question! I've analyzed your recent financial data and here's what I found: your overall financial health score is 78/100 — above average. Your strongest areas are consistent income and low credit card utilization. Want me to go deeper on any specific area?",
    "Looking at the big picture: your income vs expense ratio is healthy at 1.18x. That means for every dollar you earn, you spend $0.85 and save $0.15. The goal is to push that savings rate higher. Any specific aspect you'd like to explore?",
    "Based on patterns in your data, I've noticed 3 areas where you could optimize: reduce dining-out expenses (currently 18% of budget vs recommended 12%), consolidate 2 overlapping subscriptions, and your emergency fund is 60% funded — let's get that to 100% by Q2. Want a detailed plan for any of these?",
  ]
}

function getAIResponse(msg) {
  const l = msg.toLowerCase()
  if (l.includes('spend') || l.includes('expense') || l.includes('breakdown') || l.includes('summary')) return AI_RESPONSES.spend
  if (l.includes('saving tip') || l.includes('save money') || l.includes('tip')) return AI_RESPONSES.save
  if (l.includes('invest')) return AI_RESPONSES.invest
  if (l.includes('budget')) return AI_RESPONSES.budget
  if (l.includes('saving goal') || l.includes('progress') || l.includes('goals')) return AI_RESPONSES.savings
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)]
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')
}

export default function ChatPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chats, setChats] = useState([{ id: 1, label: '💬 Welcome conversation', active: true }])
  const [showQuick, setShowQuick] = useState(true)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    const name = user?.fullName?.split(' ')[0] || 'there'
    setTimeout(() => {
      setMessages([{
        id: Date.now(), role: 'ai',
        text: `Hey ${name}! 👋 I'm your FinTrack AI assistant. I can help you understand your spending, analyze investments, set budgets, and reach your savings goals. What would you like to explore today?`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 300)
  }, [user])

  const sendMessage = useCallback((text) => {
    const msg = (text || input).trim()
    if (!msg || isTyping) return

    setMessages(prev => [...prev, {
      id: Date.now(), role: 'user', text: msg,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }])
    setInput('')
    setShowQuick(false)
    if (textareaRef.current) { textareaRef.current.style.height = 'auto' }

    setIsTyping(true)
    const delay = 1000 + Math.random() * 700

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai', text: getAIResponse(msg),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }])
      setIsTyping(false)
    }, delay)
  }, [input, isTyping])

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const autoResize = e => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const newChat = () => {
    const id = Date.now()
    setChats(prev => [{ id, label: '💬 New conversation', active: true }, ...prev.map(c => ({ ...c, active: false }))])
    setMessages([])
    setShowQuick(true)
    setTimeout(() => {
      const name = user?.fullName?.split(' ')[0] || 'there'
      setMessages([{
        id: Date.now(), role: 'ai',
        text: `Starting a new conversation! How can I help you with your finances today, ${name}?`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 200)
  }

  const handleLogout = () => { logout(); navigate('/') }

  const initial = user?.fullName?.[0]?.toUpperCase() || 'U'
  const avatarColor = user?.avatarColor || '#6366f1'

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-black/90 backdrop-blur-xl flex-shrink-0 z-10">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight">
          <span className="w-2 h-2 rounded-full bg-white" />
          FinTrack
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
            <LayoutGrid size={14} /> Dashboard
          </Link>
          <button onClick={handleLogout} className="text-sm border border-white/[0.1] text-white/40 hover:text-white hover:border-white/25 px-3.5 py-1.5 rounded-lg transition-all duration-200">
            Sign out
          </button>
        </div>
      </nav>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-56 bg-white/[0.01] border-r border-white/[0.06] flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-white/[0.06]">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2.5 px-1 font-mono">Conversations</p>
            <button onClick={newChat}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-dashed border-white/10
                         text-white/40 hover:text-white hover:border-white/25 hover:bg-white/[0.04] text-xs font-medium transition-all duration-200">
              <Plus size={12} /> New chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {chats.map(chat => (
              <button key={chat.id} onClick={() => setChats(prev => prev.map(c => ({ ...c, active: c.id === chat.id })))}
                className={clsx(
                  'w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all duration-150 mb-1',
                  'whitespace-nowrap overflow-hidden text-ellipsis',
                  chat.active
                    ? 'bg-white/[0.08] border border-white/10 text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
                )}>
                {chat.label}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                   style={{ background: avatarColor }}>
                {initial}
              </div>
              <span className="text-xs font-medium text-white truncate flex-1">{user?.fullName || 'User'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Chat header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-base flex-shrink-0">
              🤖
            </div>
            <div>
              <p className="font-display font-bold text-sm">FinTrack AI</p>
              <p className="text-[11px] text-white/30">Your personal finance assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </div>
              <button onClick={() => { setMessages([]); setShowQuick(true) }}
                className="w-8 h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all duration-200">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {messages.map(msg => (
              <div key={msg.id} className={clsx('flex gap-3 max-w-[78%] animate-slide-up', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '')}>
                <div className={clsx(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1',
                  msg.role === 'ai' ? 'bg-white/[0.06] border border-white/[0.08] text-base' : 'text-black'
                )} style={msg.role === 'user' ? { background: avatarColor } : {}}>
                  {msg.role === 'ai' ? '🤖' : initial}
                </div>
                <div>
                  <div className={clsx(
                    'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'ai'
                      ? 'bg-white/[0.04] border border-white/[0.07] text-white rounded-tl-sm'
                      : 'bg-white text-black rounded-tr-sm font-normal'
                  )} dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                  <p className="text-[10px] text-white/20 mt-1.5 px-1">{msg.time}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-slide-up">
                <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-base mt-1">🤖</div>
                <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] rounded-tl-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {showQuick && messages.length <= 1 && (
            <div className="px-6 pb-3 flex gap-2 flex-wrap">
              {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
                <button key={label} onClick={() => sendMessage(text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07]
                             rounded-lg text-xs text-white/50 hover:text-white hover:border-white/20 hover:bg-white/[0.07]
                             transition-all duration-150">
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-6 pb-5 pt-2 flex-shrink-0">
            <div className="flex items-end gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3
                            focus-within:border-white/20 transition-all duration-200">
              <button className="text-white/20 hover:text-white/50 transition-colors pb-0.5 flex-shrink-0">
                <PaperclipIcon size={16} />
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); autoResize(e) }}
                onKeyDown={handleKey}
                placeholder="Ask anything about your finances…"
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/20
                           resize-none max-h-28 leading-relaxed"
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black
                           hover:bg-white/90 transition-all duration-200 active:scale-95
                           disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0">
                <Send size={13} />
              </button>
            </div>
            <p className="text-[10px] text-white/15 text-center mt-2">
              FinTrack AI may make mistakes. Verify important financial decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
