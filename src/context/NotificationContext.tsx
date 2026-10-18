import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { AppNotificationItem } from '../types';

interface NotificationContextType {
  notifications: AppNotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notif: Omit<AppNotificationItem, 'id' | 'userId' | 'createdAt' | 'isRead'>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const list: AppNotificationItem[] = [];
        snap.forEach(d => {
          list.push({ id: d.id, ...d.data() } as AppNotificationItem);
        });

        // If no notifications exist for new user, seed welcome notifications
        if (list.length === 0) {
          const welcomeNotifs = [
            {
              userId: user.uid,
              title: 'Welcome to YouthPath!',
              message: 'Get started by exploring 14+ career paths or building your AI-enhanced professional resume.',
              type: 'learning_milestone' as const,
              isRead: false,
              link: '/careers',
              createdAt: new Date().toISOString(),
            },
            {
              userId: user.uid,
              title: 'Complete Your Career Profile',
              message: 'Adding your technical skills and preferred roles unlocks higher-accuracy job recommendations.',
              type: 'resume_tip' as const,
              isRead: false,
              link: '/profile',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ];

          for (const item of welcomeNotifs) {
            try {
              const ref = await addDoc(collection(db, 'notifications'), item);
              list.push({ id: ref.id, ...item });
            } catch {
              list.push({ id: Math.random().toString(), ...item });
            }
          }
        }

        setNotifications(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.warn('Notifications fetch fallback:', err);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    if (user) {
      try {
        await updateDoc(doc(db, 'notifications', id), { isRead: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `notifications/${id}`);
      }
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    if (user) {
      for (const n of notifications) {
        if (!n.isRead) {
          try {
            await updateDoc(doc(db, 'notifications', n.id), { isRead: true });
          } catch {
            // continue
          }
        }
      }
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (user) {
      try {
        await deleteDoc(doc(db, 'notifications', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `notifications/${id}`);
      }
    }
  };

  const addNotification = async (notif: Omit<AppNotificationItem, 'id' | 'userId' | 'createdAt' | 'isRead'>) => {
    if (!user) return;
    const newItem: Omit<AppNotificationItem, 'id'> = {
      ...notif,
      userId: user.uid,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    try {
      const ref = await addDoc(collection(db, 'notifications'), newItem);
      setNotifications(prev => [{ id: ref.id, ...newItem }, ...prev]);
    } catch {
      setNotifications(prev => [{ id: Math.random().toString(), ...newItem }, ...prev]);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
