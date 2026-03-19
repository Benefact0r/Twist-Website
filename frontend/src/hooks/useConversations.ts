import { useState, useCallback, useEffect } from 'react';
import { createRealtimeSocket, request } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'offer' | 'offer_accepted' | 'offer_declined' | 'system' | 'image';
  offer_id?: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  listing_id?: string;
  last_message_at: string;
  created_at: string;
}

export interface ConversationWithDetails extends Conversation {
  otherParticipant?: {
    id: string;
    username?: string;
    avatar_url?: string;
    full_name?: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await request<{ items: ConversationWithDetails[] }>('/conversations');
      setConversations(data.items || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getOrCreateConversation = useCallback(async (
    otherUserId: string,
    listingId?: string
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      // Build query for existing conversation
      const response = await request<{ conversation_id: string }>('/conversations', {
        method: 'POST',
        body: {
          other_user_id: otherUserId,
          listing_id: listingId || undefined,
        },
      });
      return response.conversation_id || null;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, [user]);

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    try {
      const data = await request<{ items: Message[] }>(`/conversations/${conversationId}/messages`);
      return data.items || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }, []);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    messageType: Message['message_type'] = 'text',
    offerId?: string
  ): Promise<Message | null> => {
    if (!user) return null;

    try {
      const data = await request<{ message: Message }>(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: {
          content,
          message_type: messageType,
          offer_id: offerId || undefined,
        },
      });
      return data.message as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [user]);

  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await request<void>(`/conversations/${conversationId}/read`, { method: 'POST' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const socket = createRealtimeSocket((payload) => {
      if (payload?.type === 'message' || payload?.type === 'offer_updated' || payload?.type === 'offer_received') {
        fetchConversations();
      }
    });

    return () => {
      socket?.close();
    };
  }, [user, fetchConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    fetchConversations,
    getOrCreateConversation,
    getMessages,
    sendMessage,
    markAsRead
  };
}
