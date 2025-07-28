'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Code, FileText, Bot } from "lucide-react"

export default function Home() {
  const [input, setInput] = useState("")
  const [showCards, setShowCards] = useState(true)
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const cards = [
    {
      label: "DSA Practice",
      icon: <Code className="w-5 h-5 text-white" />,
      bg: "bg-[#2A2A2A]",
      text: "text-white",
      route: "/dsa"
    },
    {
      label: "Mock Interviews",
      icon: <FileText className="w-5 h-5 text-white" />,
      bg: "bg-[#2A2A2A]",
      text: "text-white",
      route: "/mock"
    },
    {
      label: "Resume Review",
      icon: <FileText className="w-5 h-5 text-white" />,
      bg: "bg-[#2A2A2A]",
      text: "text-white",
      route: "/resume"
    },
    {
      label: "AI Interview Copilot",
      icon: <Bot className="w-5 h-5 text-black" />,
      bg: "bg-gradient-to-br from-pink-300 via-purple-300 to-lime-200",
      text: "text-gray-900",
      route: "/"
    }
  ]

  const handleCardClick = (route: string) => {
    if (route === "/") {
      setShowCards(prev => !prev)
    } else {
      router.push(route)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userInput = input
    setMessages(prev => [...prev, { sender: "user", text: userInput }])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "This is a dummy AI response." }
      ])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex flex-col justify-between flex-1 px-6 py-6 bg-background font-sans overflow-y-auto h-screen relative">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between sticky top-0 z-10 bg-background pb-2">
        <div>
          {messages.length === 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-1 font-medium">Hello Anwesha!</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                How can I assist you today?
              </h1>
            </>
          )}
        </div>

        {!showCards && (
          <div
            className="cursor-pointer rounded-full p-3 shadow-md transition hover:scale-105"
            onClick={() => setShowCards(true)}
            style={{
              background: "linear-gradient(to bottom right, #f9a8d4, #d8b4fe, #d9f99d)"
            }}
          >
            <Bot className="w-5 h-5 text-black" />
          </div>
        )}
      </div>

      {/* Cards */}
      {showCards && (
        <div className="overflow-x-auto sm:overflow-visible mb-6">
          <div className="flex sm:justify-center gap-6 min-w-max sm:min-w-0 px-2">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`min-w-[240px] sm:w-[240px] h-[220px] rounded-2xl p-4 flex flex-col justify-between shrink-0 shadow-md cursor-pointer transition-transform duration-200 hover:scale-105 ${card.bg}`}
                onClick={() => handleCardClick(card.route)}
              >
                <div className="bg-black/10 p-2 rounded-xl w-fit">
                  {card.icon}
                </div>
                <div>
                  <h2 className={`text-base font-semibold ${card.text}`}>{card.label}</h2>
                  <p className={`text-sm ${card.text} opacity-70`}>Click to start</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg text-sm max-w-[75%] ${
              msg.sender === "user"
                ? "self-end bg-primary text-white"
                : "self-start bg-muted text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="self-start text-muted-foreground text-sm px-4 py-2 rounded-lg bg-muted animate-pulse w-fit">
            AI is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 bg-[#2A2A2A] px-4 py-3 rounded-xl mt-6 sticky bottom-4">
        <input
          className="flex-1 bg-transparent outline-none text-sm font-medium text-white placeholder:text-muted-foreground"
          placeholder="Ask Copilot anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90"
          onClick={handleSend}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
