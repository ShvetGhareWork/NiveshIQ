'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
    symbol: string;
    name: string;
    price: number;
    change_percent: number;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (stock: WishlistItem) => void;
    removeFromWishlist: (symbol: string) => void;
    isInWishlist: (symbol: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('niveshiq_wishlist');
        if (saved) {
            try {
                setWishlist(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse wishlist from localStorage', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('niveshiq_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (stock: WishlistItem) => {
        setWishlist(prev => {
            if (prev.find(item => item.symbol === stock.symbol)) return prev;
            return [...prev, stock];
        });
    };

    const removeFromWishlist = (symbol: string) => {
        setWishlist(prev => prev.filter(item => item.symbol !== symbol));
    };

    const isInWishlist = (symbol: string) => {
        return wishlist.some(item => item.symbol === symbol);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
