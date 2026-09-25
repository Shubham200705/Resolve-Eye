import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Issue, NotificationItem, ChatMessage } from '@/types';
import { mockIssues, mockNotifications, currentUser } from '@/data/mockData';

interface AppStore {
  issues: Issue[];
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  supportIssue: (id: string) => void;
  rateResolution: (id: string, rating: number) => void;
  addManagementResponse: (issueId: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  addChatMessage: (message: ChatMessage) => void;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const addIssue = useCallback((issue: Issue) => {
    setIssues((prev) => [issue, ...prev]);
  }, []);

  const updateIssue = useCallback((id: string, updates: Partial<Issue>) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const supportIssue = useCallback((id: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, supporters: i.hasSupported ? i.supporters - 1 : i.supporters + 1, hasSupported: !i.hasSupported }
          : i
      )
    );
  }, []);

  const rateResolution = useCallback((id: string, rating: number) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, resolutionRating: rating } : i)));
  }, []);

  const addManagementResponse = useCallback((issueId: string, message: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? {
              ...i,
              managementResponses: [
                ...i.managementResponses,
                {
                  id: `mr-${Date.now()}`,
                  issueId,
                  message,
                  author: 'Ravi Kumar',
                  authorRole: 'management',
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : i
      )
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        issues,
        notifications,
        chatMessages,
        addIssue,
        updateIssue,
        supportIssue,
        rateResolution,
        addManagementResponse,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        addChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}

export { currentUser };
