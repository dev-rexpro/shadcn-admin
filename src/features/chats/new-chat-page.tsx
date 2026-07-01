import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { 
  Plus, Mic, AudioLines, Lightbulb, Sparkles, Component, ArrowUp, 
  ChevronDown, ChevronUp, Pencil, Copy, Volume2, Info, ThumbsUp, ThumbsDown, PlayCircle, RefreshCw
} from 'lucide-react'

const suggestions = [
  { title: 'Overcome procrastination', description: 'give me tips' },
  { title: 'Show me a code snippet', description: "of a website's sticky header" },
  { title: 'Give me ideas', description: "for what to do with my kids' art" },
]

type Message = {
  role: 'user' | 'ai'
  content: string
  model?: string
  time?: string
  tokens?: number
  thought?: string
  followUps?: string[]
}

const AiMessage = ({ msg }: { msg: Message }) => {
  const [isThoughtOpen, setIsThoughtOpen] = useState(true)

  return (
    <div className='flex w-full flex-col gap-3'>
      {/* Header Info */}
      <div className='flex items-baseline gap-2'>
        <span className='font-semibold text-foreground'>{msg.model}</span>
        <span className='text-xs text-muted-foreground'>
          {msg.time} | {msg.tokens} Tokens
        </span>
      </div>

      {/* Reasoning / Thought Block */}
      {msg.thought && (
        <div className='flex flex-col gap-2'>
          <button 
            onClick={() => setIsThoughtOpen(!isThoughtOpen)}
            className='flex w-fit items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            Thought for less than a second
            {isThoughtOpen ? <ChevronUp className='h-3 w-3' /> : <ChevronDown className='h-3 w-3' />}
          </button>
          
          {isThoughtOpen && (
            <div className='whitespace-pre-wrap border-l-2 py-1 pl-4 text-sm text-muted-foreground'>
              {msg.thought}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className='prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground'>
        {msg.content}
      </div>

      {/* Action Bar */}
      <div className='mt-2 flex items-center gap-1 text-muted-foreground'>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><Pencil className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><Copy className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><Volume2 className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><Info className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><ThumbsUp className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><ThumbsDown className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><PlayCircle className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-8 w-8 hover:text-foreground'><RefreshCw className='h-4 w-4' /></Button>
      </div>

      {/* Follow Up Section */}
      {msg.followUps && msg.followUps.length > 0 && (
        <div className='mt-4 flex flex-col gap-3'>
          <span className='text-sm font-medium text-foreground'>Follow up</span>
          <div className='flex flex-col gap-3'>
            {msg.followUps?.map((q, i) => (
              <button 
                key={i} 
                className='text-left text-sm text-muted-foreground transition-colors hover:text-foreground'
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function NewChatPage() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isGenerating])

  const handleSend = () => {
    if (!inputValue.trim() || isGenerating) return

    const newUserMsg: Message = { role: 'user', content: inputValue.trim() }
    setMessages((prev) => [...prev, newUserMsg])
    setInputValue('')
    setIsGenerating(true)

    setTimeout(() => {
      const time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      const tokens = Math.floor(Math.random() * 200) + 50 

      const newAiMsg: Message = {
        role: 'ai',
        model: 'Masbro 4 (120B24E) Thinker',
        time: `Today at ${time}`,
        tokens: tokens,
        thought: `"User asks in Indonesian: "5000/100-10+10x100 berapa" meaning "What is 5000/100 - 10 + 10 x 100?" We need to compute following order of operations (PEMDAS). So compute:\n\n5000/100 = 50\n10 x 100 = 1000\nThen expression: 50 - 10 + 1000 = (50 - 10) + 1000 = 40 + 1000 = 1040.\n\nThus answer is 1040.\n\nWe should respond in Indonesian, concise. Also maybe show steps."`,
        content: "Berikut urutan perhitungannya (mengikuti aturan operasi matematika PEMDAS):\n\n1. **Pembagian:** 5000 ÷ 100 = 50\n2. **Perkalian:** 10 × 100 = 1000\n\nSekarang substitusi ke dalam persamaan:\n\n50 - 10 + 1000\n\n3. **Pengurangan dulu (atau cukup menggabungkan karena bersifat left-to-right):**\n   50 - 10 = 40\n4. **Penjumlahan:**\n   40 + 1000 = 1040\n\n**Jadi, hasilnya adalah 1040.**",
        followUps: [
          "Bisakah Anda menjelaskan aturan PEMDAS secara lebih detail?",
          "Bagaimana cara menghitung persamaan itu menggunakan Python?",
          "Berikan contoh soal lain yang melibatkan pembagian, perkalian, penjumlahan, dan pengurangan.",
          "Jika saya menambahkan tanda kurung, apakah urutan operasinya berubah?"
        ]
      }
      setMessages((prev) => [...prev, newAiMsg])
      setIsGenerating(false)
    }, 1500)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const inputAreaJSX = (
    <div className='w-full'>
      <div className='relative flex w-full flex-col rounded-2xl border border-input bg-background px-3 py-2 shadow-sm transition-shadow focus-within:ring-1 focus-within:ring-ring'>
        <textarea
          rows={1}
          placeholder='How can I help you today?'
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          className='mb-1 min-h-[40px] w-full resize-none border-0 bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground max-h-[200px]'
        />
        <div className='flex items-center justify-between px-1 pb-1'>
          <div className='flex items-center gap-1'>
            <Button variant='ghost' size='icon' className='h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground'>
              <Plus className='h-5 w-5' />
            </Button>
            <Button variant='ghost' size='icon' className='h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground'>
              <Component className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' className='h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground'>
              <Mic className='h-5 w-5' />
            </Button>
            <Button
              size='icon'
              onClick={handleSend}
              disabled={!inputValue.trim() || isGenerating}
              className='h-9 w-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
            >
              {inputValue ? <ArrowUp className='h-4 w-4' /> : <AudioLines className='h-4 w-4' />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const isChatStarted = messages.length > 0

  return (
    <>
      {/* Jika komponen Header ini punya z-index bawaan, pastikan dia lebih besar dari 0 */}
      <Header fixed>
        <Search className='me-auto' />
      </Header>

      <Main className='flex min-h-0 flex-1 flex-col overflow-hidden'>
        
        {!isChatStarted ? (
          <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-4'>
            <div className='m-auto w-full max-w-3xl pb-20'>
              <div className='mb-8 flex items-center justify-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                  <Sparkles className='h-5 w-5 fill-current' />
                </div>
                <h3 className='text-[28px] font-normal tracking-tight text-foreground'>
                  Masbro 4 (17B16E) Omni
                </h3>
              </div>

              <div className='mb-10'>
                {inputAreaJSX}
              </div>

              <div className='w-full pl-8 md:pl-12'>
                <div className='mb-4 flex items-center gap-2 text-[13px] font-medium text-muted-foreground'>
                  <Lightbulb className='h-4 w-4' />
                  <span>Suggested</span>
                </div>
                <div className='flex flex-col gap-4'>
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setInputValue(item.title + ' ' + item.description)}
                      className='group flex cursor-pointer flex-col'
                    >
                      <span className='text-[17px] leading-tight text-foreground group-hover:underline'>
                        {item.title}
                      </span>
                      <span className='mt-0.5 text-[13px] leading-tight text-muted-foreground'>
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
            <div className='flex-1 min-h-0 overflow-y-auto pb-6 pt-4'>
              <div className='mx-auto flex w-full max-w-4xl flex-col gap-10 px-4'>
                {messages.map((msg, index) => (
                  <div key={index} className='flex w-full flex-col'>
                    {msg.role === 'user' ? (
                      <div className='flex w-full justify-end'>
                        <div className='max-w-[70%] rounded-2xl bg-muted/50 px-5 py-3 text-foreground'>
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <AiMessage msg={msg} />
                    )}
                  </div>
                ))}
                
                {isGenerating && (
                  <div className='flex w-full flex-col gap-1'>
                    <div className='mb-2 text-[13px] font-medium text-muted-foreground'>
                      Masbro 4 (120B24E) Thinker | Generating...
                    </div>
                    <div className='flex gap-1 py-2'>
                      <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground'></span>
                      <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-75'></span>
                      <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-150'></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className='shrink-0 border-t border-border/40 bg-background/80 px-4 py-4 backdrop-blur-md'>
              <div className='mx-auto w-full max-w-4xl'>
                {inputAreaJSX}
                <p className='mt-3 text-center text-[12px] text-muted-foreground'>
                  AI can make mistakes. Consider verifying important information.
                </p>
              </div>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}