'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    link?: string;
    read: boolean;
    timestamp: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (noti: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    deleteNotification: (id: string) => void;
    markAllAsRead: () => void;
    clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('niveshiq-notifications');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('niveshiq-notifications', JSON.stringify(notifications));
        }
    }, [notifications, isLoaded]);

    const addNotification = (noti: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
        const newNoti: Notification = {
            ...noti,
            id: Date.now().toString(),
            read: false,
            timestamp: new Date()
        };
        setNotifications(prev => [newNoti, ...prev].slice(0, 50)); // Keep last 50
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, deleteNotification, markAllAsRead, clearAllNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
}
