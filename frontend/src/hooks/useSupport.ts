import { useState, useEffect, useCallback } from 'react';
import { request } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_email: string;
  user_phone?: string;
  subject: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: string;
  status: string;
  listing_id?: string;
  order_id?: string;
  conversation_id?: string;
  page_url?: string;
  assigned_to?: string;
  first_response_at?: string;
  resolved_at?: string;
  satisfaction?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'user' | 'agent' | 'system' | 'bot';
  content: string;
  is_internal_note: boolean;
  read_by_user: boolean;
  read_by_agent: boolean;
  attachments?: any;
  quick_replies?: any;
  created_at: string;
}

export interface FAQ {
  id: string;
  question_ka: string;
  question_en: string;
  answer_ka: string;
  answer_en: string;
  category: string;
  subcategory?: string;
  tags: string[];
  view_count: number;
  helpful_yes: number;
  helpful_no: number;
  last_viewed?: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSupport = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await request<{ items: SupportTicket[] }>('/support/tickets');
      setTickets(data.items || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(
    async (ticketId: string) => {
      if (!user) return;

      try {
        const data = await request<{ items: SupportMessage[] }>(`/support/tickets/${ticketId}/messages`);
        setMessages(data.items || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    [user],
  );

  const createTicket = useCallback(
    async (subject: string, description: string, category: string = 'other', initialMessage?: string) => {
      if (!user) return null;

      try {
        const data = await request<{ ticket: SupportTicket }>('/support/tickets', {
          method: 'POST',
          body: {
            subject,
            description,
            category,
            page_url: window.location.href,
            initial_message: initialMessage,
            user_email: user.email || '',
          },
        });

        await fetchTickets();
        return data.ticket;
      } catch (error) {
        console.error('Error creating ticket:', error);
        return null;
      }
    },
    [user, fetchTickets],
  );

  const sendMessage = useCallback(
    async (ticketId: string, content: string) => {
      if (!user) return null;

      try {
        const data = await request<{ message: SupportMessage }>(`/support/tickets/${ticketId}/messages`, {
          method: 'POST',
          body: { content },
        });

        setMessages((prev) => [...prev, data.message]);
        return data.message;
      } catch (error) {
        console.error('Error sending message:', error);
        return null;
      }
    },
    [user],
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const data = await request<{ count: number }>('/support/tickets-unread-count');
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user]);

  const markMessagesAsRead = useCallback(
    async (ticketId: string) => {
      if (!user) return;

      try {
        await request<void>(`/support/tickets/${ticketId}/read`, {
          method: 'POST',
        });
        await fetchUnreadCount();
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    },
    [user, fetchUnreadCount],
  );

  const rateTicket = useCallback(
    async (ticketId: string, satisfaction: number, feedback?: string) => {
      if (!user) return;

      try {
        await request(`/support/tickets/${ticketId}/rating`, {
          method: 'PATCH',
          body: { satisfaction, feedback },
        });
        await fetchTickets();
      } catch (error) {
        console.error('Error rating ticket:', error);
      }
    },
    [user, fetchTickets],
  );

  useEffect(() => {
    if (!user) return;
    fetchTickets();
    fetchUnreadCount();
  }, [user, fetchTickets, fetchUnreadCount]);

  return {
    tickets,
    activeTicket,
    setActiveTicket,
    messages,
    unreadCount,
    isLoading,
    createTicket,
    sendMessage,
    fetchMessages,
    markMessagesAsRead,
    rateTicket,
    fetchTickets,
  };
};

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [popularFaqs, setPopularFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFaqs = useCallback(async (category?: string) => {
    setIsLoading(true);
    try {
      const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
      const data = await request<{ items: FAQ[] }>(`/support/faqs${query}`, { auth: false });
      setFaqs(data.items || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPopularFaqs = useCallback(async () => {
    try {
      const data = await request<{ items: FAQ[] }>('/support/faqs?popular=1', { auth: false });
      setPopularFaqs(data.items || []);
    } catch (error) {
      console.error('Error fetching popular FAQs:', error);
      setPopularFaqs([]);
    }
  }, []);

  const searchFaqs = useCallback(async (query: string) => {
    if (query.length < 2) return [];

    try {
      const data = await request<{ items: FAQ[] }>(
        `/support/faqs?q=${encodeURIComponent(query)}`,
        { auth: false },
      );
      return data.items || [];
    } catch (error) {
      console.error('Error searching FAQs:', error);
      return [];
    }
  }, []);

  const trackFaqView = useCallback(async (faqId: string) => {
    try {
      await request<void>(`/support/faqs/${faqId}/view`, {
        method: 'POST',
        auth: false,
      });
    } catch (error) {
      console.error('Error tracking FAQ view:', error);
    }
  }, []);

  const submitFaqFeedback = useCallback(async (faqId: string, isHelpful: boolean) => {
    try {
      await request<void>(`/support/faqs/${faqId}/feedback`, {
        method: 'POST',
        auth: false,
        body: { is_helpful: isHelpful },
      });
    } catch (error) {
      console.error('Error submitting FAQ feedback:', error);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
    fetchPopularFaqs();
  }, [fetchFaqs, fetchPopularFaqs]);

  return {
    faqs,
    popularFaqs,
    isLoading,
    fetchFaqs,
    searchFaqs,
    trackFaqView,
    submitFaqFeedback,
  };
};
