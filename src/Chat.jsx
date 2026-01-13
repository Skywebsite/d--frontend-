import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, MoreVertical, ChevronDown, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const Chat = ({ onSearch, activeSearch }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm D-Bot, your smart event assistant. \n\nI can help you find upcoming events, check schedules, or answer questions about the venue." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Effect to handle external search selection
    useEffect(() => {
        if (activeSearch) {
            setInput(activeSearch);
        }
    }, [activeSearch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        if (onSearch) onSearch(userMessage);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat`, {
                question: userMessage
            });

            const { answer, sources } = response.data;

            setMessages(prev => [...prev, {
                role: 'ai',
                content: answer,
                sources: sources
            }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Sorry, I'm having trouble connecting to the brain right now. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card chat-container">
            {/* Tidio Style Header */}
            <div className="chat-header-bg">
                <div className="chat-header-content">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '42px', height: '42px', background: 'white', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="https://api.dicebear.com/9.x/bottts/svg?seed=dbot-v2" alt="Bot" style={{ width: '100%', borderRadius: '50%' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#4ade80', borderRadius: '50%', border: '2px solid #1e88e5' }}></div>
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>D-Bot</h2>
                            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>We're online!</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', opacity: 0.9 }}>
                        <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                        <ChevronDown size={20} style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* SVG Curve at the bottom of header */}
                <div className="chat-header-curve">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
                        <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#ffffff' }}></path>
                    </svg>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-list">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`message-bubble ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <div style={{ whiteSpace: 'pre-wrap', width: '100%' }}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.5em' }} {...props} />,
                                            ul: ({ node, ...props }) => <ul style={{ margin: '0.5em 0', paddingLeft: '1.2em' }} {...props} />,
                                            li: ({ node, ...props }) => <li style={{ marginBottom: '0.2em' }} {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="message-bubble message-ai" style={{ width: 'fit-content' }}>
                        <div className="typing">
                            <span>D-Bot is thinking</span>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="input-area">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Enter your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                    <Send size={20} fill="white" />
                </button>
            </form>

            <div style={{ textAlign: 'center', paddingBottom: '10px', background: 'white' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#ccc' }}>Powered by <span style={{ fontWeight: 600, color: '#999' }}>SkyWeb</span></p>
            </div>
        </div>
    );
};

export default Chat;
