import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const RecentSearches = ({ searches, onSelect }) => {
    if (!searches || searches.length === 0) return null;

    return (
        <div className="recent-searches-container" style={{
            minWidth: '200px',
            textAlign: 'left',
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px'
        }}>
            <h3 style={{
                color: 'white',
                fontSize: '0.9rem',
                margin: '0 0 10px 0',
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'flex-start'
            }}>
                <Clock size={14} /> Recent Searches
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                {searches.map((term, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(term)}
                        style={{
                            color: 'rgba(255,255,255,0.9)',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(4px)',
                            padding: '8px 16px',
                            borderRadius: '20px 4px 20px 20px',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.2s ease'
                        }}
                        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
                    >
                        {term}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecentSearches;
