import { useState, useRef, useEffect } from 'react';
import { aiMockResponses, aiSuggestedPrompts } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, AlertTriangle, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

function timeNow() {
  return new Date().toISOString();
}

function getAiResponse(userText: string): string {
  const text = userText.toLowerCase();
  if (text.includes('hygiene') || text.includes('sanitation') || text.includes('clean')) return aiMockResponses.hygiene;
  if (text.includes('water')) return aiMockResponses.water;
  if (text.includes('electric') || text.includes('power')) return aiMockResponses.electricity;
  if (text.includes('maintenance') || text.includes('broken') || text.includes('repair')) return aiMockResponses.maintenance;
  if (text.includes('safety') || text.includes('security') || text.includes('danger')) return aiMockResponses.safety;
  if (text.includes('category') || text.includes('categor')) return aiMockResponses.category;
  if (text.includes('write') || text.includes('draft') || text.includes('complaint')) return aiMockResponses.write;
  return aiMockResponses.default;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      role: 'ai',
      content: "Hello! I'm your AI Assistant for ResolveEye. I can help you understand your problem, choose the right category, write a clear complaint, and suggest next steps. How can I help you today?",
      timestamp: timeNow(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timeNow(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        role: 'ai',
        content: getAiResponse(text),
        timestamp: timeNow(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  }

  function formatMessage(content: string) {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('---')) {
        return <hr key={i} className="my-3 border-border" />;
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 lg:px-6 lg:py-8">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl bg-sky-soft/30 border border-sky/20 p-4 mb-6">
        <AlertTriangle className="h-5 w-5 text-sky shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Simulated AI Assistant</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            This is a frontend demonstration. No real AI model is being used. All responses are predefined mock content.
          </p>
        </div>
      </div>

      <Card className="flex flex-col h-[calc(100vh-20rem)] min-h-[500px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-navy text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Sparkles className="h-5 w-5 text-sky" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">ResolveEye AI Assistant</p>
            <p className="text-xs text-white/50">Simulated • Always available</p>
          </div>
          <span className="rounded-full bg-emerald/20 px-2.5 py-1 text-xs font-semibold text-emerald flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            Online
          </span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
                msg.role === 'user' ? 'bg-navy text-white' : 'bg-sky-soft text-sky'
              )}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn(
                'max-w-[75%] rounded-2xl px-4 py-3',
                msg.role === 'user'
                  ? 'bg-navy text-white rounded-tr-sm'
                  : 'bg-white border border-border text-foreground rounded-tl-sm'
              )}>
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {formatMessage(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-soft text-sky shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white border border-border px-4 py-3.5">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="p-3 border-t border-border bg-background">
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">Suggested prompts:</p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground hover:border-sky/30 hover:bg-sky-soft/20 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-border bg-background flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !loading) sendMessage(input); }}
            placeholder="Ask about your issue..."
            disabled={loading}
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            size="icon"
            className="h-10 w-10 rounded-lg bg-navy hover:bg-navy-light"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
