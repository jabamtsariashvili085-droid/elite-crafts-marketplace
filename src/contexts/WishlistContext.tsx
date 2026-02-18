import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
    savedIds: string[];
    addToWishlist: (id: string) => void;
    removeFromWishlist: (id: string) => void;
    toggleWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [savedIds, setSavedIds] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            try {
                setSavedIds(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse wishlist', e);
            }
        }
    }, []);

    // Save to localStorage whenever savedIds changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(savedIds));
    }, [savedIds]);

    const addToWishlist = (id: string) => {
        if (!savedIds.includes(id)) {
            setSavedIds(prev => [...prev, id]);
            toast({ title: 'პროდუქტი სურვილების სიაში დაემატა ❤️' });
        }
    };

    const removeFromWishlist = (id: string) => {
        setSavedIds(prev => prev.filter(item => item !== id));
        toast({ title: 'პროდუქტი ამოიშალა სურვილების სიიდან' });
    };

    const toggleWishlist = (id: string) => {
        if (savedIds.includes(id)) {
            removeFromWishlist(id);
        } else {
            addToWishlist(id);
        }
    };

    const isInWishlist = (id: string) => savedIds.includes(id);

    const clearWishlist = () => {
        setSavedIds([]);
        localStorage.removeItem('wishlist');
        toast({ title: 'სურვილების სია გასუფთავდა' });
    };

    return (
        <WishlistContext.Provider value={{ savedIds, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
