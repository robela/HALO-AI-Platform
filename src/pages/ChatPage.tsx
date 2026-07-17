import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Plus, Trash2, Download, Copy, Check,
  MessageSquare, Bot, User, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatStore } from '@/stores/chatStore'
import { chatService } from '@/services/chatService'
import { generateId, cn } from '@/lib/utils'
import type { Conversation, ChatMessage } from '@/types'
import { formatDistanceToNow } from 'date-fns'

function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3 group', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
        isUser
          ? 'bg-gradient-to-br from-halo-500 to-violet-600 text-white'
          : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-border',
      )}>
        {isUser ? <User className="size-4" /> : <Bot className="size-4 text-halo-400" />}
      </div>

      <div className={cn('max-w-[75%] space-y-1', isUser ? 'items-end' : 'items-start', 'flex flex-col')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm',
          isUser
            ? 'bg-gradient-to-br from-halo-500 to-violet-600 text-white rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm',
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className={cn('prose prose-sm', message.isStreaming && 'typing-cursor')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className={cn('flex items-center gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}>
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex h-full flex-col border-r border-border w-64 shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className="text-sm font-semibold">Conversations</span>
        <Button variant="ghost" size="icon-sm" onClick={onNew}>
          <Plus className="size-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <MessageSquare className="size-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all',
                  activeId === conv.id
                    ? 'bg-primary/15 border border-primary/20 text-primary'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground',
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{conv.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {conv.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id) }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function ChatPage() {
  const {
    conversations, activeConversationId, isStreaming,
    setActiveConversation, addConversation, deleteConversation,
    addMessage, setStreaming, appendStreamingContent, setStreamingContent,
    getActiveConversation, updateLastMessage,
  } = useChatStore()

  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeConversation = getActiveConversation()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages, isStreaming])

  const createNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    addConversation(newConv)
  }, [addConversation])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return

    let convId = activeConversationId
    if (!convId) {
      const newConv: Conversation = {
        id: generateId(),
        title: input.slice(0, 50),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addConversation(newConv)
      convId = newConv.id
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    addMessage(convId, userMessage)
    setInput('')

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(convId, assistantMessage)
    setStreaming(true)
    setStreamingContent('')

    try {
      const { preferences } = (await import('@/stores/settingsStore')).useSettingsStore.getState()
      let fullContent = ''

      if (preferences.streamingEnabled) {
        const stream = chatService.streamMessage({ message: input, conversationId: convId, stream: true })
        for await (const chunk of stream) {
          fullContent += chunk
          appendStreamingContent(chunk)
          updateLastMessage(convId, fullContent)
        }
      } else {
        const response = await chatService.sendMessage({ message: input, conversationId: convId })
        fullContent = response.message.content
        updateLastMessage(convId, fullContent)
      }

      // Mark message as no longer streaming
      updateLastMessage(convId, fullContent)
    } catch {
      updateLastMessage(convId, '_Error: Could not reach the AI service. Please check your API endpoint in Settings._')
    } finally {
      setStreaming(false)
    }
  }, [input, isStreaming, activeConversationId, addConversation, addMessage, setStreaming, setStreamingContent, appendStreamingContent, updateLastMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleExport = async () => {
    if (!activeConversationId) return
    try {
      const blob = await chatService.exportConversation(activeConversationId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `conversation-${activeConversationId}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // fallback: export from store
      const data = JSON.stringify(activeConversation, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `conversation-${activeConversationId}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar toggle for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-0 top-1/2 z-10 md:hidden translate-x-full -translate-y-1/2 rounded-r-lg bg-card border border-border border-l-0 p-1.5"
      >
        <ChevronRight className={cn('size-4 transition-transform', sidebarOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ConversationList
              conversations={conversations}
              activeId={activeConversationId}
              onSelect={setActiveConversation}
              onNew={createNewConversation}
              onDelete={deleteConversation}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            <ChevronRight className={cn('size-4 transition-transform', sidebarOpen && 'rotate-180')} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            {activeConversationId && (
              <Button variant="ghost" size="icon-sm" onClick={handleExport} title="Export conversation">
                <Download className="size-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" onClick={createNewConversation}>
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-6">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="flex h-full min-h-[60vh] items-center justify-center">
              <div className="text-center max-w-md space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-halo-500/20 to-violet-600/20 border border-halo-500/20">
                  <Bot className="size-8 text-halo-400" />
                </div>
                <h3 className="text-lg font-semibold">HALO AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Ask anything about your data, get support in African languages,
                  or connect to your enterprise knowledge base.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['How does the IVR system work?', 'Summarize the latest report', 'Translate to Amharic', 'Check system status'].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-left hover:border-halo-500/40 hover:bg-accent transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {activeConversation.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="relative max-w-3xl mx-auto">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message HALO AI... (Enter to send, Shift+Enter for newline)"
              className="min-h-[52px] max-h-40 pr-14 resize-none rounded-xl"
              rows={1}
            />
            <Button
              size="icon"
              variant={input.trim() ? 'gradient' : 'ghost'}
              onClick={() => void handleSend()}
              disabled={!input.trim() || isStreaming}
              className="absolute right-2 bottom-2"
            >
              {isStreaming ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            HALO AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
