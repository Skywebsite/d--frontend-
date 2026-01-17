import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { Mail, Lock, LogIn, UserPlus, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const languages = [
    { text: 'D-Bot', lang: 'EN' },
    { text: 'డి-బాట్', lang: 'TE' }, // Telugu
    { text: 'डी-बॉट', lang: 'HI' }, // Hindi
    { text: 'ডি-বট', lang: 'BN' }, // Bengali
    { text: 'டி-பாட்', lang: 'TA' }, // Tamil
    { text: 'ഡി-ബോട്ട്', lang: 'ML' }, // Malayalam
    { text: 'ડી-બોટ', lang: 'GU' }, // Gujarati
    { text: 'ಡಿ-ಬಾಟ್', lang: 'KN' }, // Kannada
    { text: 'ଡି-ବଟ୍', lang: 'OR' }, // Odia
    { text: 'ਡੀ-ਬੋਟ', lang: 'PA' }, // Punjabi
    { text: 'डी-बॉट', lang: 'MR' }  // Marathi
];

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentLangIndex, setCurrentLangIndex] = useState(0);

    // Rotate through languages
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLangIndex((prev) => (prev + 1) % languages.length);
        }, 2000); // Change every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                onAuthSuccess({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || email.split('@')[0],
                    photoURL: user.photoURL
                });
            } else {
                // Sign up
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                // Update display name if provided
                if (name) {
                    await user.updateProfile({ displayName: name });
                }
                onAuthSuccess({
                    uid: user.uid,
                    email: user.email,
                    displayName: name || email.split('@')[0],
                    photoURL: user.photoURL
                });
            }
        } catch (error) {
            setError(error.message);
            console.error('Auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            onAuthSuccess({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL
            });
        } catch (error) {
            setError(error.message);
            console.error('Google auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'hidden'
        }}>
            {/* Background Animation */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}>
                <DotLottieReact
                    src="https://lottie.host/1cee62b6-d9c1-4913-a7bb-d13315ca9ad0/HrIn0M4YBL.lottie"
                    loop
                    autoplay
                    style={{ 
                        width: '100%', 
                        height: '100%'
                    }}
                />
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '2.5rem 2.5rem 3rem',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    margin: '0 1rem',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* Animation at Top */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem'
                    }}>
                        <DotLottieReact
                            src="https://lottie.host/66820d8d-1f3c-4a45-a1fa-4bd93e53a3e6/sjq97NlXkQ.lottie"
                            loop
                            autoplay
                            speed={2.5}
                            style={{ 
                                width: '100%', 
                                height: '100%'
                            }}
                        />
                    </div>
                    
                    {/* D-Bot Text Below Animation with Language Flip */}
                    <div style={{
                        height: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        position: 'relative',
                        perspective: '1000px',
                        width: '100%',
                        overflow: 'hidden'
                    }}>
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={currentLangIndex}
                                className="iceberg-regular"
                                initial={{ rotateY: 90, opacity: 0 }}
                                animate={{ rotateY: 0, opacity: 1 }}
                                exit={{ rotateY: -90, opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                style={{ 
                                    margin: 0, 
                                    fontSize: '2.2rem', 
                                    fontWeight: 400, 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    letterSpacing: '0.5px',
                                    lineHeight: '1.2',
                                    position: 'absolute',
                                    transformStyle: 'preserve-3d',
                                    whiteSpace: 'nowrap',
                                    width: 'auto',
                                    minWidth: 'fit-content'
                                }}
                            >
                                {languages[currentLangIndex].text}
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                    <p style={{ 
                        margin: 0, 
                        color: '#666', 
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        fontWeight: 500
                    }}>
                        {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: '#fee',
                            color: '#c33',
                            padding: '0.875rem 1rem',
                            borderRadius: '10px',
                            marginBottom: '1.25rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.4',
                            border: '1px solid #fcc'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleEmailAuth} style={{ width: '100%' }}>
                    {!isLogin && (
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <UserPlus 
                                    size={18} 
                                    style={{ 
                                        position: 'absolute', 
                                        left: '14px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)', 
                                        color: '#999',
                                        zIndex: 1
                                    }} 
                                />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 2.75rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'all 0.2s ease',
                                        boxSizing: 'border-box',
                                        background: '#fafafa'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#1e88e5';
                                        e.target.style.background = '#fff';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(30, 136, 229, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.background = '#fafafa';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail 
                                size={18} 
                                style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: '#999',
                                    zIndex: 1
                                }} 
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxSizing: 'border-box',
                                    background: '#fafafa'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.background = '#fff';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.15)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.background = '#fafafa';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock 
                                size={18} 
                                style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: '#999',
                                    zIndex: 1
                                }} 
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxSizing: 'border-box',
                                    background: '#fafafa'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.background = '#fff';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.15)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.background = '#fafafa';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.9375rem 1.25rem',
                            background: loading 
                                ? '#ccc' 
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '1.25rem',
                            transition: 'all 0.3s ease',
                            boxShadow: loading 
                                ? 'none' 
                                : '0 4px 15px rgba(102, 126, 234, 0.4)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }
                        }}
                    >
                        <LogIn size={18} />
                        <span style={{ fontWeight: 600, letterSpacing: '0.3px' }}>
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </span>
                    </button>
                </form>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    margin: '1.75rem 0',
                    color: '#999'
                }}>
                    <div style={{ 
                        flex: 1, 
                        height: '1px', 
                        background: 'linear-gradient(to right, transparent, #e0e0e0)'
                    }}></div>
                    <span style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 600,
                        color: '#999',
                        padding: '0 0.75rem',
                        background: 'white',
                        borderRadius: '12px'
                    }}>OR</span>
                    <div style={{ 
                        flex: 1, 
                        height: '1px', 
                        background: 'linear-gradient(to left, transparent, #e0e0e0)'
                    }}></div>
                </div>

                <button
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.9375rem 1.25rem',
                        background: 'white',
                        color: '#333',
                        border: '1px solid #dadce0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 500,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.borderColor = '#c0c0c0';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            e.currentTarget.style.borderColor = '#dadce0';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                        }
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span style={{ color: '#3c4043', fontWeight: 500 }}>Continue with Google</span>
                </button>

                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setEmail('');
                            setPassword('');
                            setName('');
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#1e88e5',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            padding: '0.5rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = 'underline';
                            e.currentTarget.style.color = '#1565c0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = 'none';
                            e.currentTarget.style.color = '#1e88e5';
                        }}
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;

