import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const AIAssistant = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'გამარჯობა! მე ვარ Elite Works-ის ასისტენტი. რით შემიძლია დაგეხმაროთ?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('chat-assistant', {
                body: { prompt: userMsg }
            });

            if (error) {
                console.error('Supabase function error:', error);
                throw new Error(error.message || 'Unknown error');
            }

            if (!data || !data.response) {
                console.error('Invalid response format:', data);
                throw new Error('პასუხის ფორმატი არასწორია');
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response
            }]);
        } catch (error: any) {
            console.error('Error calling AI:', error);
            const errorMsg = error.message?.includes('404')
                ? 'ფუნქცია ვერ მოიძებნა (404). გთხოვთ დაარეფრეშოთ ან თავიდან დაადეპლოოთ.'
                : `უკაცრავად, ხარვეზია: ${error.message || 'კავშირის პრობლემა'}`;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMsg
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gold-gradient text-accent-foreground flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold tracking-tight">Elite AI Assistant</p>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] opacity-80 uppercase tracking-widest font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-gold text-primary-foreground rounded-tr-none shadow-md shadow-gold/20'
                                        : 'bg-muted/50 border border-border rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted/50 border border-border p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => setInput('გრანიტის ნიჟარები')}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border bg-muted/30 text-[11px] hover:border-gold transition-colors"
                            >
                                ✨ გრანიტის ნიჟარები
                            </button>
                            <button
                                onClick={() => setInput('პარამეტრული დიზაინი')}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border bg-muted/30 text-[11px] hover:border-gold transition-colors"
                            >
                                🎨 CNC დეკორი
                            </button>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border bg-background/50">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="დაწერეთ შეტყობინება..."
                                    className="bg-muted/30 border-border rounded-xl h-10 px-4 text-sm focus-visible:ring-gold"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-10 w-10 shrink-0 bg-gold hover:bg-gold/90 text-primary-foreground rounded-xl"
                                    disabled={isLoading}
                                >
                                    <Send size={18} />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-background border border-border text-foreground rotate-90' : 'bg-gold-gradient text-accent-foreground glow-gold'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-gold border-2 border-background"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default AIAssistant;
