import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, MoreVertical, ChevronDown, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Chat = ({ onSearch, activeSearch, user }) => {
    const greetingMessage = "Yo! 👋 I'm D-Bot 🤖✨\nEvents, timings, venue info—sab milega idhar!\nJust type, chill karo 😎";
    const [messages, setMessages] = useState([
        { role: 'ai', content: '', isTyping: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [greetingTyped, setGreetingTyped] = useState(false);
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

    // Typing animation for initial greeting - runs only once
    useEffect(() => {
        if (greetingTyped) return;

        // Personalized greeting if user is logged in
        const personalizedGreeting = user 
            ? `Hey ${user.displayName}! 👋 I'm D-Bot 🤖✨\nEvents, timings, venue info—sab milega idhar!\nJust type, chill karo 😎`
            : greetingMessage;

        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex < personalizedGreeting.length) {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[0] = {
                        ...updated[0],
                        content: personalizedGreeting.substring(0, currentIndex + 1)
                    };
                    return updated;
                });
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setMessages(prev => {
                    const updated = [...prev];
                    updated[0] = {
                        ...updated[0],
                        isTyping: false
                    };
                    return updated;
                });
                setGreetingTyped(true);
            }
        }, 30); // Adjust speed here (lower = faster)

        return () => clearInterval(typingInterval);
    }, [greetingTyped, user]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        const updatedMessages = [...messages, { role: 'user', content: userMessage }];
        
        setInput('');
        setMessages(updatedMessages);
        setIsLoading(true);
        if (onSearch) onSearch(userMessage);

        try {
            // Send conversation history along with the current question and user info
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat`, {
                question: userMessage,
                conversationHistory: updatedMessages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                user: user ? {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email
                } : null
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
                            <div style={{ 
                                width: '56px', 
                                height: '56px', 
                                background: 'white', 
                                borderRadius: '50%', 
                                padding: '3px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <DotLottieReact
                                        src="https://lottie.host/66820d8d-1f3c-4a45-a1fa-4bd93e53a3e6/sjq97NlXkQ.lottie"
                                        loop
                                        autoplay
                                        speed={1.5}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%',
                                            borderRadius: '50%'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', background: '#4ade80', borderRadius: '50%', border: '2px solid #1e88e5', zIndex: 10 }}></div>
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
                                    {msg.isTyping && idx === 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span>{msg.content}</span>
                                            <span style={{ 
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '16px',
                                                background: '#1e88e5',
                                                animation: 'blink 1s infinite',
                                                marginLeft: '2px'
                                            }}></span>
                                        </div>
                                    ) : (
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.5em' }} {...props} />,
                                                ul: ({ node, ...props }) => <ul style={{ margin: '0.5em 0', paddingLeft: '1.2em' }} {...props} />,
                                                li: ({ node, ...props }) => <li style={{ marginBottom: '0.2em' }} {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}

                                    {/* Event Sources / Cards */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div style={{
                                            marginTop: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            borderTop: '1px solid rgba(0,0,0,0.08)',
                                            paddingTop: '16px'
                                        }}>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                color: '#1e88e5',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                marginBottom: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <span style={{
                                                    width: '4px',
                                                    height: '4px',
                                                    background: '#1e88e5',
                                                    borderRadius: '50%',
                                                    display: 'inline-block'
                                                }}></span>
                                                Found {msg.sources.length} Event{msg.sources.length !== 1 ? 's' : ''}
                                            </div>
                                            {msg.sources.map((event, i) => {
                                                const details = event.event_details || {};
                                                const eventName = details.event_name || 'Event Name Unavailable';
                                                const eventDate = details.event_date && details.event_date !== 'N/A' ? details.event_date : null;
                                                const eventLocation = details.location && details.location !== 'N/A' ? details.location : null;
                                                const eventTime = details.event_time && details.event_time !== 'N/A' ? details.event_time : null;
                                                
                                                return (
                                                    <div key={i} style={{
                                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                                        border: '1px solid rgba(30, 136, 229, 0.15)',
                                                        borderRadius: '16px',
                                                        padding: '16px',
                                                        boxShadow: '0 4px 12px rgba(30, 136, 229, 0.08)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '10px',
                                                        transition: 'all 0.2s ease',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(30, 136, 229, 0.12)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 136, 229, 0.08)';
                                                    }}
                                                    >
                                                        <h4 style={{ 
                                                            margin: 0, 
                                                            fontSize: '1rem', 
                                                            color: '#1e88e5', 
                                                            fontWeight: 700,
                                                            lineHeight: '1.4',
                                                            letterSpacing: '-0.3px'
                                                        }}>
                                                            {eventName}
                                                        </h4>
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            flexDirection: 'column',
                                                            gap: '8px',
                                                            fontSize: '0.85rem',
                                                            color: '#555'
                                                        }}>
                                                            {eventDate && (
                                                                <div style={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: '8px',
                                                                    color: '#333'
                                                                }}>
                                                                    <span style={{ fontSize: '1rem' }}>📅</span>
                                                                    <span style={{ fontWeight: 500 }}>{eventDate}</span>
                                                                </div>
                                                            )}
                                                            {eventTime && (
                                                                <div style={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: '8px',
                                                                    color: '#333'
                                                                }}>
                                                                    <span style={{ fontSize: '1rem' }}>🕒</span>
                                                                    <span style={{ fontWeight: 500 }}>{eventTime}</span>
                                                                </div>
                                                            )}
                                                            {eventLocation && (
                                                                <div style={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: '8px',
                                                                    color: '#333'
                                                                }}>
                                                                    <span style={{ fontSize: '1rem' }}>📍</span>
                                                                    <span style={{ fontWeight: 500 }}>{eventLocation}</span>
                                                                </div>
                                                            )}
                                                            {!eventDate && !eventTime && !eventLocation && (
                                                                <div style={{ 
                                                                    fontSize: '0.8rem',
                                                                    color: '#999',
                                                                    fontStyle: 'italic'
                                                                }}>
                                                                    More details coming soon...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
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
                <div style={{
                    flex: 1,
                    background: '#f5f7f9',
                    borderRadius: '24px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid transparent',
                    transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1e88e5'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            fontSize: '0.95rem',
                            outline: 'none',
                            flex: 1
                        }}
                    />
                </div>
                <button 
                    type="submit" 
                    className="send-btn" 
                    disabled={isLoading || !input.trim()}
                    style={{
                        background: input.trim() 
                            ? 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)' 
                            : '#ccc',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Send size={20} fill="white" />
                </button>
            </form>

            <div style={{ 
                textAlign: 'center', 
                padding: '12px 0', 
                background: 'white',
                borderTop: '1px solid rgba(0,0,0,0.04)'
            }}>
                <p style={{ 
                    margin: 0, 
                    fontSize: '0.7rem', 
                    color: '#aaa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                }}>
                    Powered by <span style={{ fontWeight: 600, color: '#1e88e5' }}>SkyWeb</span>
                </p>
            </div>
        </div>
    );
};

export default Chat;
