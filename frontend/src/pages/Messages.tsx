import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, Image, MoreVertical, ArrowLeft, MessageCircle, Loader2, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { useToast } from '@/hooks/use-toast';
import { useConversations, Message, ConversationWithDetails } from '@/hooks/useConversations';
import { useOffers } from '@/hooks/useOffers';
import { request } from '@/lib/apiClient';
import { OfferMessageCard } from '@/components/offer/OfferMessageCard';

type ListingPreview = {
  id: string;
  title: string;
  price: number;
  images: string[];
};

export default function Messages() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { 
    conversations, 
    isLoading: conversationsLoading, 
    getMessages, 
    sendMessage: sendMessageToDb,
    markAsRead 
  } = useConversations();
  const { updateOfferStatus } = useOffers();
  
  const chatParam = searchParams.get('chat');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(chatParam);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [listingMap, setListingMap] = useState<Record<string, ListingPreview>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedChat = conversations.find(c => c.id === selectedConversation);

  // Auto-select conversation from URL param when conversations load
  useEffect(() => {
    if (chatParam && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(chatParam);
    }
  }, [chatParam, conversations, selectedConversation]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setIsLoadingMessages(true);
      getMessages(selectedConversation).then(msgs => {
        setMessages(msgs);
        setIsLoadingMessages(false);
        markAsRead(selectedConversation);
      });
    }
  }, [selectedConversation, getMessages, markAsRead]);

  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      scrollToBottom();
    }
  }, [selectedConversation, messages, scrollToBottom]);

  // Fetch listing previews used by conversations
  useEffect(() => {
    const listingIds = Array.from(new Set(conversations.map((c) => c.listing_id).filter(Boolean))) as string[];
    if (listingIds.length === 0) {
      setListingMap({});
      return;
    }

    const loadListings = async () => {
      const pairs = await Promise.all(
        listingIds.map(async (id) => {
          try {
            const data = await request<{ listing: ListingPreview }>(`/listings/${id}`, { auth: false });
            return [id, data.listing] as const;
          } catch {
            return null;
          }
        })
      );
      const next: Record<string, ListingPreview> = {};
      for (const pair of pairs) {
        if (!pair) continue;
        next[pair[0]] = pair[1];
      }
      setListingMap(next);
    };

    loadListings();
  }, [conversations]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: language === 'ka' ? 'არასწორი ფაილი' : 'Invalid file',
        description: language === 'ka' ? 'მხოლოდ სურათები' : 'Only images are allowed',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: language === 'ka' ? 'ფაილი ძალიან დიდია' : 'File too large',
        description: language === 'ka' ? 'მაქსიმუმ 2MB' : 'Maximum 2MB allowed',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImagePreview = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
      });
      return dataUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && !selectedFile) || isSending || !selectedConversation) return;

    setIsSending(true);
    
    try {
      // Upload image if selected
      if (selectedFile) {
        setIsUploadingImage(true);
        const imageUrl = await uploadImage(selectedFile);
        
        if (imageUrl) {
          const imageMessage = await sendMessageToDb(selectedConversation, imageUrl, 'image');
          if (imageMessage) {
            setMessages(prev => [...prev, imageMessage]);
          }
        } else {
          toast({
            title: language === 'ka' ? 'შეცდომა' : 'Error',
            description: language === 'ka' ? 'სურათის ატვირთვა ვერ მოხერხდა' : 'Failed to upload image',
            variant: 'destructive',
          });
        }
        clearImagePreview();
        setIsUploadingImage(false);
      }

      // Send text message if present
      if (messageInput.trim()) {
        const newMessage = await sendMessageToDb(selectedConversation, messageInput.trim());
        if (newMessage) {
          setMessages(prev => [...prev, newMessage]);
          setMessageInput('');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    
    setIsSending(false);
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    const success = await updateOfferStatus(offerId, action === 'accept' ? 'accepted' : 'declined');
    
    if (success) {
      toast({
        title: action === 'accept' 
          ? (language === 'ka' ? 'შეთავაზება მიღებულია' : 'Offer Accepted')
          : (language === 'ka' ? 'შეთავაზება უარყოფილია' : 'Offer Declined'),
        description: action === 'accept'
          ? (language === 'ka' ? 'მყიდველი გადამისამართდება გადახდაზე' : 'Buyer will be redirected to checkout')
          : undefined,
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getListingForConversation = (conv: ConversationWithDetails) => {
    if (conv.listing_id && listingMap[conv.listing_id]) {
      return listingMap[conv.listing_id];
    }
    return null;
  };

  const { isEmailVerified } = useAuth();

  // Login required
  if (!user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {language === 'ka' ? 'შესვლა საჭიროა' : 'Login Required'}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {language === 'ka' 
                ? 'შეტყობინებების სანახავად გთხოვთ შეხვიდეთ ანგარიშში' 
                : 'Please login to view your messages'}
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">
                {language === 'ka' ? 'შესვლა' : 'Login'}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Email verification guard
  if (!isEmailVerified) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <EmailVerificationBanner />
          </div>
        </div>
      </Layout>
    );
  }

  // Loading state
  if (conversationsLoading) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {language === 'ka' ? 'შეტყობინებები ცარიელია' : 'No messages yet'}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {language === 'ka' 
                ? 'დაიწყე საუბარი გამყიდველთან' 
                : 'Start a conversation by messaging a seller about an item'}
            </p>
            <Button size="lg" asChild>
              <Link to="/search">
                {language === 'ka' ? 'ნივთების ნახვა' : 'Browse Items'}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex">
        {/* Conversation list */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card",
            selectedConversation && "hidden md:flex"
          )}
        >
          <div className="p-4 border-b border-border">
            <h1 className="text-lg font-bold">
              {language === 'ka' ? 'შეტყობინებები' : 'Messages'}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const listing = getListingForConversation(conv);
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={cn(
                    "w-full p-3 md:p-4 flex gap-3 hover:bg-muted transition-colors text-left",
                    selectedConversation === conv.id && "bg-muted"
                  )}
                >
                  <div className="relative shrink-0">
                    {listing ? (
                      <img
                        src={listing.images[0]}
                        alt=""
                        className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-muted flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate text-sm">
                        {conv.otherParticipant?.full_name || conv.otherParticipant?.username || 'User'}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage?.content || (language === 'ka' ? 'ახალი საუბარი' : 'New conversation')}
                    </p>
                    {listing && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        Re: {listing.title}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="p-3 md:p-4 border-b border-border flex items-center gap-3 bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              {selectedChat && (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {selectedChat.listing_id && getListingForConversation(selectedChat) ? (
                    <Link
                      to={`/listing/${selectedChat.listing_id}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <img
                        src={getListingForConversation(selectedChat)?.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium truncate text-sm">
                          {selectedChat.otherParticipant?.full_name || selectedChat.otherParticipant?.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {getListingForConversation(selectedChat)?.title} • ₾{getListingForConversation(selectedChat)?.price}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium truncate text-sm">
                        {selectedChat.otherParticipant?.full_name || selectedChat.otherParticipant?.username}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    {language === 'ka' ? 'შეტყობინებები არ არის' : 'No messages yet'}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender_id === user?.id ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.message_type === 'offer' ? (
                      // Offer message card - parsed and formatted
                      <OfferMessageCard
                        content={msg.content}
                        isOwnMessage={msg.sender_id === user?.id}
                        timestamp={msg.created_at}
                        offerId={msg.offer_id || undefined}
                        onOfferUpdate={() => {
                          // Refresh messages after offer update
                          getMessages(selectedConversation!).then(setMessages);
                        }}
                      />
                    ) : msg.message_type === 'image' ? (
                      // Image message
                      <div
                        className={cn(
                          "max-w-[85%] md:max-w-[75%] rounded-2xl overflow-hidden",
                          msg.sender_id === user?.id
                            ? "rounded-br-md"
                            : "rounded-bl-md"
                        )}
                      >
                        <img
                          src={msg.content}
                          alt="Shared image"
                          className="max-w-full h-auto max-h-64 object-contain rounded-2xl"
                          loading="lazy"
                        />
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            msg.sender_id === user?.id
                              ? "text-muted-foreground text-right"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    ) : (
                      // Regular text message
                      <div
                        className={cn(
                          "max-w-[85%] md:max-w-[75%] px-4 py-2.5 rounded-2xl",
                          msg.sender_id === user?.id
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            msg.sender_id === user?.id
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-border bg-card safe-area-inset-bottom">
              {/* Image preview */}
              {imagePreview && (
                <div className="mb-2 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={clearImagePreview}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending || isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Image className="h-5 w-5" />
                  )}
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={language === 'ka' ? 'შეიყვანე შეტყობინება...' : 'Type a message...'}
                  className="flex-1"
                  disabled={isSending}
                />
                <Button type="submit" size="icon" disabled={(!messageInput.trim() && !selectedFile) || isSending} className="shrink-0">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/30">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'ka' ? 'აირჩიე საუბარი' : 'Select a conversation to start messaging'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
