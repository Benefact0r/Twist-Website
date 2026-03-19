import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Clock, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSupport } from '@/hooks/useSupport';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';

interface LiveChatProps {
  onActivate: () => void;
  onDeactivate: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  onActivate,
  onDeactivate,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { 
    tickets, 
    activeTicket, 
    setActiveTicket, 
    messages, 
    createTicket, 
    sendMessage, 
    fetchMessages,
    markMessagesAsRead 
  } = useSupport();
  
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages when ticket is selected
  useEffect(() => {
    if (activeTicket) {
      fetchMessages(activeTicket.id);
      markMessagesAsRead(activeTicket.id);
    }
  }, [activeTicket, fetchMessages, markMessagesAsRead]);

  const handleStartChat = async () => {
    if (!user) return;
    
    if (!subject.trim() || !description.trim()) return;
    
    setIsCreatingTicket(true);
    try {
      const ticket = await createTicket(subject, description, 'other', description);
      if (ticket) {
        setActiveTicket(ticket);
        setSubject('');
        setDescription('');
        onActivate();
      }
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeTicket || !input.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await sendMessage(activeTicket.id, input.trim());
      setInput('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateStr: string) => {
    return format(new Date(dateStr), 'HH:mm', {
      locale: language === 'ka' ? ka : enUS,
    });
  };

  // Not logged in
  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">
          {language === 'ka' ? 'შესვლა საჭიროა' : 'Login Required'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {language === 'ka' 
            ? 'ჩათით დასაკავშირებლად გთხოვთ შეხვიდეთ თქვენს ანგარიშში'
            : 'Please log in to your account to start a chat'}
        </p>
        <Button onClick={() => window.location.href = '/auth'}>
          {language === 'ka' ? 'შესვლა' : 'Log In'}
        </Button>
      </div>
    );
  }

  // Active chat view
  if (activeTicket) {
    return (
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="flex-shrink-0 p-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {language === 'ka' ? 'მხარდაჭერა' : 'Support'}
                </p>
                <p className="text-xs text-muted-foreground">
                  #{activeTicket.ticket_number}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTicket(null);
                onDeactivate();
              }}
            >
              {language === 'ka' ? 'დახურვა' : 'Close'}
            </Button>
          </div>
        </div>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {/* System welcome message */}
            <div className="flex justify-center">
              <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                {language === 'ka' 
                  ? 'საუბარი დაიწყო. ჩვენ მალე გიპასუხებთ!'
                  : 'Chat started. We\'ll respond shortly!'}
              </div>
            </div>
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.sender_type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2',
                    message.sender_type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      'text-xs mt-1',
                      message.sender_type === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    )}
                  >
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input */}
        <div className="flex-shrink-0 p-3 border-t bg-background">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={language === 'ka' ? 'დაწერეთ მესიჯი...' : 'Type a message...'}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isSending}
              size="icon"
              className="h-11 w-11 flex-shrink-0"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Start new chat / ticket list view
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Previous Chats */}
        {tickets.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">
              {language === 'ka' ? 'წინა საუბრები' : 'Previous Chats'}
            </h3>
            {tickets.slice(0, 5).map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => {
                  setActiveTicket(ticket);
                  onActivate();
                }}
                className="w-full flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-lg text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    #{ticket.ticket_number} • {ticket.status}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Start New Chat */}
        <div className="space-y-4 pt-4 border-t">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {language === 'ka' ? 'ახალი საუბარი' : 'New Chat'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ka' 
                ? 'აღწერეთ თქვენი პრობლემა და ჩვენ დაგეხმარებით'
                : 'Describe your issue and we\'ll help you'}
            </p>
          </div>
          
          <div className="space-y-3">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={language === 'ka' ? 'თემა (მაგ. გადახდის პრობლემა)' : 'Subject (e.g. Payment issue)'}
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'ka' ? 'აღწერეთ თქვენი პრობლემა დეტალურად...' : 'Describe your issue in detail...'}
              rows={3}
            />
            <Button
              onClick={handleStartChat}
              disabled={!subject.trim() || !description.trim() || isCreatingTicket}
              className="w-full"
            >
              {isCreatingTicket ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'ka' ? 'იქმნება...' : 'Creating...'}
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {language === 'ka' ? 'საუბრის დაწყება' : 'Start Chat'}
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {language === 'ka' 
              ? 'საშუალო პასუხის დრო: 5 წუთი'
              : 'Average response time: 5 minutes'}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
