"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Send,
  Plus,
  Clock,
  MapPin,
  Star,
  Mic,
  Phone,
  Globe,
  Building,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useSpeechToText } from "@/hooks/useSpeechToText"
import { useIsMobile } from "@/hooks/use-mobile"

interface UserType {
  name: string
  email: string
  avatar?: string
  uid: string
}

interface SupplierField {
  label: string
  value: string
  type: "text" | "badge" | "rating" | "price" | "location" | "time"
}

interface Message {
  id: string
  type: string
  content: string
  timestamp: Date
  suppliers?: Supplier[]
}

interface Supplier {
  id: string
  name: string
  fields: SupplierField[]
}

interface Chat {
  id: string
  title: string
  messages: Message[]
}

interface ChatPageProps {
  user: UserType
  chats: Chat[]
  activeChat: string | null
  messages: Message[]
  currentMessage: string
  search: string
  isAssistantTyping: boolean
  renamingChatId: string | null
  renameValue: string
  onViewChange: (view: "landing" | "login" | "signup" | "chat") => void
  onLogout: () => void
  onChatSelect: (chatId: string) => void
  onCreateNewChat: () => void
  onSendMessage: () => void
  onMessageChange: (message: string) => void
  onSearchChange: (search: string) => void
  onStartRename: (chat: Chat) => void
  onRenameChange: (value: string) => void
  onRenameSave: (chatId: string) => void
  onRenameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, chatId: string) => void
  setRenamingChatId: (id: string | null) => void
}

// Reusable style constants
const STYLE_CONSTANTS = {
  avatarBase: "w-10 h-10 bg-zinc-800 border border-zinc-700",
  dropdownBase: "bg-zinc-900 border-zinc-800",
}

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center space-x-1 px-2 py-1">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
)

// Logo Image component
const LogoImage = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer circle with gradient */}
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="url(#gradient1)"
      stroke="url(#gradient2)"
      strokeWidth="2"
    />
    
    {/* Inner geometric pattern */}
    <path
      d="M12 10L20 10L18 14L16 12L14 14L12 10Z"
      fill="white"
      opacity="0.9"
    />
    <path
      d="M10 16L14 12L16 14L18 12L22 16L20 20L16 18L12 20L10 16Z"
      fill="white"
      opacity="0.7"
    />
    <circle
      cx="16"
      cy="16"
      r="3"
      fill="white"
    />
    
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#1D4ED8", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#2563EB", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
  </svg>
)

// User Avatar Dropdown component
const UserAvatarDropdown = ({ user, onLogout }: { user: UserType; onLogout: () => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className={STYLE_CONSTANTS.avatarBase}>
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className={STYLE_CONSTANTS.dropdownBase} align="end" forceMount>
      <div className="flex flex-col space-y-1 p-2">
        <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
        <p className="text-xs leading-none text-zinc-400">{user?.email}</p>
      </div>
      <DropdownMenuSeparator className="bg-zinc-800" />
      <DropdownMenuItem onClick={onLogout} className="text-white hover:bg-zinc-800 cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

interface ContactButtonProps {
  type: 'email' | 'phone' | 'website'
  value: string
}

const ContactButton = ({ type, value }: ContactButtonProps) => {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return Mail
      case 'phone':
        return Phone
      case 'website':
        return Globe
      default:
        return Mail
    }
  }

  const getHref = () => {
    const cleanValue = value.trim()
    switch (type) {
      case 'email':
        if (cleanValue.includes('@')) {
          return `mailto:${cleanValue}`
        }
        return '#'
      case 'phone':
        const phoneNumber = cleanValue.replace(/[^\d+()-]/g, '')
        if (phoneNumber) {
          return `tel:${phoneNumber}`
        }
        return '#'
      case 'website':
        if (cleanValue.startsWith('http://') || cleanValue.startsWith('https://')) {
          return cleanValue
        } else if (cleanValue.includes('.')) {
          return `https://${cleanValue}`
        }
        return '#'
      default:
        return '#'
    }
  }

  const getTitle = () => {
    const cleanValue = value.trim()
    switch (type) {
      case 'email':
        return `Send email to ${cleanValue}`
      case 'phone':
        return `Call ${cleanValue}`
      case 'website':
        return `Visit website: ${cleanValue}`
      default:
        return ''
    }
  }

  const handleClick = () => {
    try {
      const href = getHref()
      if (href && href !== '#') {
        window.open(href, '_blank')
      }
    } catch (error) {
      console.error('Error opening contact link:', error)
    }
  }

  const Icon = getIcon()

  return (
    <Button 
      size="sm" 
      variant="ghost" 
      className="p-1 h-6 w-6 text-zinc-400 hover:text-white"
      onClick={handleClick}
      title={getTitle()}
    >
      <Icon className="w-3 h-3" />
    </Button>
  )
}

const renderFieldValue = (field: SupplierField) => {
  switch (field.type) {
    case "badge":
      if (field.value === "N/A") {
        return <span className="text-sm text-zinc-400">N/A</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {field.value.split(",").map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-zinc-800 text-zinc-300 border-zinc-700">
              {item.trim()}
            </Badge>
          ))}
        </div>
      )
    case "rating":
      if (field.value === "N/A") {
        return <span className="text-sm text-zinc-400">N/A</span>
      }
      return (
        <div className="flex items-center space-x-1">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium">{field.value}</span>
        </div>
      )
    case "location":
      return (
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-zinc-400" />
          <span className="text-sm">{field.value}</span>
        </div>
      )
    case "time":
      return (
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span className="text-sm">{field.value}</span>
        </div>
      )
    case "price":
      return <span className="text-sm font-medium text-green-400">{field.value}</span>
    default:
      return <span className="text-sm">{field.value}</span>
  }
}

export default function ChatPage({
  user,
  chats,
  activeChat,
  messages,
  currentMessage,
  search,
  isAssistantTyping,
  renamingChatId,
  renameValue,
  onViewChange,
  onLogout,
  onChatSelect,
  onCreateNewChat,
  onSendMessage,
  onMessageChange,
  onSearchChange,
  onStartRename,
  onRenameChange,
  onRenameSave,
  onRenameKeyDown,
  setRenamingChatId,
}: ChatPageProps) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const renameInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    isSupported: isSpeechSupported,
    isRecording,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechToText()

  // Update currentMessage when transcript changes (only if recording and not assistant typing)
  useEffect(() => {
    if (isRecording && !isAssistantTyping) {
      onMessageChange(transcript)
    }
  }, [transcript, isRecording, isAssistantTyping, onMessageChange])

  // Optionally clear transcript when message is sent
  useEffect(() => {
    if (!currentMessage && !isRecording) {
      setTranscript("")
    }
  }, [currentMessage, isRecording, setTranscript])

  // When recording ends and transcript is available, set it as the message and focus input (only if not assistant typing)
  useEffect(() => {
    if (!isRecording && transcript && !isAssistantTyping) {
      onMessageChange(transcript)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isRecording, transcript, isAssistantTyping, onMessageChange])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, activeChat, isAssistantTyping])

  useEffect(() => {
    if (renamingChatId && renameInputRef.current) {
      renameInputRef.current.focus()
    }
  }, [renamingChatId])

  // Filter chats for display:
  const filteredChats = chats.filter(chat => chat.title.toLowerCase().includes(search.toLowerCase()))

  // Mobile chat selection handler
  const handleMobileChatSelect = (chatId: string) => {
    onChatSelect(chatId)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const handleOutsideClick = () => setSidebarOpen(false)
      document.addEventListener('click', handleOutsideClick)
      return () => document.removeEventListener('click', handleOutsideClick)
    }
  }, [isMobile, sidebarOpen])

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <button
            onClick={() => onViewChange('landing')}
            className="focus:outline-none"
            aria-label="Go to home page"
            type="button"
          >
            <LogoImage className="h-6 md:h-8 w-auto cursor-pointer" />
          </button>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {isMobile && activeChat && (
            <h1 className="text-sm md:text-xl font-semibold truncate max-w-32">
              {chats.find(c => c.id === activeChat)?.title || "Chat"}
            </h1>
          )}
          <UserAvatarDropdown user={user} onLogout={onLogout} />
        </div>
      </header>
      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          ${isMobile 
            ? `fixed left-0 top-0 h-full w-80 bg-zinc-900 border-r border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }` 
            : 'w-[340px] bg-zinc-900 border-r border-zinc-800'
          } flex flex-col
        `}>
          {isMobile && (
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold">My Chats</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          {!isMobile && (
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-lg font-semibold">My Chats</h2>
              <div className="flex items-center space-x-2">
                <Button size="icon" className="bg-zinc-800 rounded-full p-0 w-8 h-8 flex items-center justify-center text-white" onClick={onCreateNewChat}>
                  <Plus className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Mobile new chat button */}
          {isMobile && (
            <div className="px-4 py-2">
              <Button 
                className="w-full bg-zinc-800 text-white rounded-lg flex items-center justify-center space-x-2" 
                onClick={() => {
                  onCreateNewChat()
                  setSidebarOpen(false)
                }}
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </Button>
            </div>
          )}
          
          {/* Tabs */}
          <div className="flex items-center px-4 md:px-6 space-x-2 mb-3">
            <Button size="sm" className="bg-zinc-800 text-white rounded-full px-4 py-1 text-xs font-semibold">
              CHATS <span className="ml-2 bg-zinc-800 rounded px-2">{chats.length}</span>
            </Button>
          </div>
          
          {/* Search and filter */}
          <div className="flex items-center px-4 md:px-6 mb-3 space-x-2">
            <div className="flex-1 relative">
              <input
                className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 text-sm border-none outline-none placeholder-zinc-400"
                placeholder="Search..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>
            <Button size="icon" className="bg-zinc-800 rounded-lg p-0 w-8 h-8 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Button>
          </div>
          
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`mb-2 rounded-xl px-3 py-3 cursor-pointer transition-colors ${
                  activeChat === chat.id ? "bg-zinc-800" : "hover:bg-zinc-800/70"
                }`}
                onClick={() => handleMobileChatSelect(chat.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {renamingChatId === chat.id ? (
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(e) => onRenameChange(e.target.value)}
                        onBlur={() => onRenameSave(chat.id)}
                        onKeyDown={e => onRenameKeyDown(e, chat.id)}
                        className="font-medium text-sm truncate text-white bg-zinc-800 border border-zinc-700 rounded px-2 py-1 w-32 outline-none"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center group/chat-title">
                        <span
                          className="font-medium text-sm truncate text-white group-hover:text-white cursor-pointer"
                          onClick={e => { e.stopPropagation(); onStartRename(chat); }}
                          title="Click to rename"
                        >
                          {chat.title}
                        </span>
                        <button
                          className="ml-1 opacity-0 group-hover/chat-title:opacity-100 text-zinc-400 hover:text-white transition"
                          onClick={e => { e.stopPropagation(); onStartRename(chat); }}
                          tabIndex={-1}
                          title="Rename"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3h3" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400">{chat.messages.length} messages</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
        
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-zinc-950">
          {/* Chat Title Bar */}
          {!isMobile && (
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
              <h1 className="text-xl font-semibold">{chats.find(c => c.id === activeChat)?.title || "Select a chat"}</h1>
            </div>
          )}
          
          {/* Messages Area */}
          <div className="flex-1 flex flex-col px-4 md:px-8 py-4 md:py-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
                No messages yet.
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div
                    key={`${message.id}_${message.type}_${message.timestamp?.toString() || ''}_${idx}`}
                    className={`mb-4 md:mb-6 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type !== 'user' && (
                      <div className="flex-shrink-0 mr-2 md:mr-3 flex items-start">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border border-zinc-700 shadow-md">
                          {/* AI Robot Icon */}
                          <svg className="w-4 h-4 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
                              fill="currentColor"
                            />
                            <circle cx="9" cy="12" r="1" fill="currentColor"/>
                            <circle cx="15" cy="12" r="1" fill="currentColor"/>
                            <path 
                              d="M8 19C8 17.5 9.5 16 12 16C14.5 16 16 17.5 16 19" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                              strokeLinecap="round"
                              fill="none"
                            />
                            <rect 
                              x="6" 
                              y="8" 
                              width="12" 
                              height="8" 
                              rx="4" 
                              stroke="currentColor" 
                              strokeWidth="1.5"
                              fill="none"
                            />
                            <path 
                              d="M9 8V6C9 5.5 9.5 5 10 5H14C14.5 5 15 5.5 15 6V8" 
                              stroke="currentColor" 
                              strokeWidth="1.5"
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end max-w-xs md:max-w-xl' : 'items-start max-w-full'}`}>
                      <div
                        className={`rounded-2xl px-3 md:px-5 py-3 md:py-4 text-sm md:text-base shadow-lg transition-colors duration-150 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white self-end border border-blue-700 hover:shadow-blue-700/30'
                            : 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-white self-start border border-zinc-700 hover:shadow-black/20'
                        } hover:brightness-105`}
                      >
                        {message.content}
                      </div>
                      
                      {/* Supplier Results Section */}
                      {message.suppliers && message.suppliers.length > 0 && (
                        <div className="mt-4 w-full max-w-full">
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <div className="p-2 bg-zinc-800 rounded-lg">
                              <Building className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg md:text-xl font-semibold text-white">Top Supplier Matches</h3>
                              <p className="text-xs md:text-sm text-zinc-400">Found {message.suppliers.length} suppliers matching your criteria</p>
                            </div>
                          </div>
                          
                          {/* Supplier Cards Grid - Mobile responsive */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                            {message.suppliers.map((supplier) => (
                              <Card
                                key={supplier.id}
                                className="bg-zinc-900 border-zinc-700 hover:border-zinc-600 transition-all duration-200 hover:shadow-lg"
                              >
                                <CardHeader className="pb-2 md:pb-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <CardTitle className="text-sm md:text-base font-semibold text-white mb-1 leading-tight">
                                        {supplier.name}
                                      </CardTitle>
                                      {supplier.fields.find((f: SupplierField) => f.label === "Location") && (
                                        <div className="flex items-center gap-1 text-xs md:text-sm text-zinc-400">
                                          <MapPin className="w-3 h-3" />
                                          <span className="truncate">{supplier.fields.find((f: SupplierField) => f.label === "Location")?.value}</span>
                                        </div>
                                      )}
                                    </div>
                                    {supplier.fields.find((f: SupplierField) => f.label === "Rating") && (
                                      <div className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg ml-2">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="text-xs md:text-sm font-medium text-white">
                                          {supplier.fields.find((f: SupplierField) => f.label === "Rating")?.value}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-2 md:space-y-3 pt-0">
                                  {/* Price Range */}
                                  {supplier.fields.find((f: SupplierField) => f.label === "Price Range") && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs md:text-sm text-zinc-400">Price Range</span>
                                      <span className="text-xs md:text-sm font-medium text-green-400 truncate ml-2">
                                        {supplier.fields.find((f: SupplierField) => f.label === "Price Range")?.value}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* Lead Time */}
                                  {supplier.fields.find((f: SupplierField) => f.label === "Lead Time") && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs md:text-sm text-zinc-400">Lead Time</span>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-zinc-400" />
                                        <span className="text-xs md:text-sm text-white">
                                          {supplier.fields.find((f: SupplierField) => f.label === "Lead Time")?.value}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Response Time */}
                                  {supplier.fields.find((f: SupplierField) => f.label === "Response Time") && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs md:text-sm text-zinc-400">Response Time</span>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-zinc-400" />
                                        <span className="text-xs md:text-sm text-white">
                                          {supplier.fields.find((f: SupplierField) => f.label === "Response Time")?.value}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Contact Information */}
                                  <div className="grid grid-cols-1 gap-2 pt-2 border-t border-zinc-800">
                                    {supplier.fields
                                      .filter((f: SupplierField) => f.label === "Email" || f.label === "Phone" || f.label === "Website")
                                      .map((field: SupplierField, index: number) => (
                                        <div key={index} className="flex items-center justify-between text-xs">
                                          <span className="text-zinc-400 capitalize">{field.label}:</span>
                                          <div className="flex items-center gap-1">
                                            <span className="text-white truncate max-w-20">{field.value}</span>
                                            <ContactButton 
                                              type={field.label.toLowerCase() as 'email' | 'phone' | 'website'} 
                                              value={field.value} 
                                            />
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  
                                  {/* Other Fields */}
                                  {supplier.fields
                                    .filter((f: SupplierField) => !["Location", "Rating", "Price Range", "Lead Time", "Response Time", "Email", "Phone", "Website"].includes(f.label))
                                    .map((field: SupplierField, index: number) => (
                                      <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs md:text-sm font-medium text-zinc-300">{field.label}:</span>
                                        </div>
                                        <div className="pl-0">
                                          {renderFieldValue(field)}
                                        </div>
                                      </div>
                                    ))}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 ml-2 md:ml-3 flex items-start">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-blue-700 shadow-md">
                          {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isAssistantTyping && (
                  <div className="mb-4 md:mb-6 flex justify-start">
                    <div className="flex-shrink-0 mr-2 md:mr-3 flex items-start">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border border-zinc-700 shadow-md">
                        {/* AI Robot Icon */}
                        <svg className="w-4 h-4 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
                            fill="currentColor"
                          />
                          <circle cx="9" cy="12" r="1" fill="currentColor"/>
                          <circle cx="15" cy="12" r="1" fill="currentColor"/>
                          <path 
                            d="M8 19C8 17.5 9.5 16 12 16C14.5 16 16 17.5 16 19" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            strokeLinecap="round"
                            fill="none"
                          />
                          <rect 
                            x="6" 
                            y="8" 
                            width="12" 
                            height="8" 
                            rx="4" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path 
                            d="M9 8V6C9 5.5 9.5 5 10 5H14C14.5 5 15 5.5 15 6V8" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col items-start max-w-full">
                      <div className="rounded-2xl px-3 md:px-5 py-3 md:py-4 text-sm md:text-base shadow-lg transition-colors duration-150 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white self-start border border-zinc-700 hover:shadow-black/20 hover:brightness-105">
                        <TypingIndicator />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input Bar */}
          <div className="px-4 md:px-8 py-4 md:py-6 border-t border-zinc-800 bg-zinc-900">
            <div className="flex items-center space-x-2 md:space-x-3">
              <input
                ref={inputRef}
                className={`flex-1 h-10 md:h-12 bg-zinc-800 border-none rounded-lg px-3 md:px-4 text-sm md:text-base text-white placeholder-zinc-400 outline-none ${
                  isAssistantTyping ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder={isAssistantTyping ? "Assistant is typing..." : "Ask questions, or type '/' for commands"}
                value={currentMessage}
                onChange={e => onMessageChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !isAssistantTyping) onSendMessage() }}
                disabled={isAssistantTyping}
              />
              <Button
                size="icon"
                className={`bg-zinc-800 rounded-lg p-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white ${
                  isRecording ? 'animate-pulse bg-blue-700' : ''
                } ${isAssistantTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={isRecording ? stopListening : startListening}
                type="button"
                title={isRecording ? "Stop recording" : "Start voice input"}
                disabled={!isSpeechSupported || isAssistantTyping}
              >
                <Mic className={`w-4 h-4 md:w-5 md:h-5 ${isRecording ? 'text-blue-400' : 'text-white'}`} />
              </Button>
              <Button 
                size="icon" 
                className={`bg-zinc-800 rounded-lg p-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white ${
                  isAssistantTyping ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={onSendMessage}
                disabled={isAssistantTyping || !currentMessage.trim()}
              >
                <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </Button>
            </div>
            {!isSpeechSupported && (
              <div className="text-xs text-red-400 mt-2">Voice input is not supported in this browser.</div>
            )}
            {speechError && (
              <div className="text-xs text-red-400 mt-2">{speechError}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
