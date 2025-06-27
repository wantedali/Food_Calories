import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/LoadingScreen.module.css'; // Correct CSS Modules import

const messages = [
    'جاري تحميل البيانات...',
    'جاري تحضير الوجبات...',
    'جاري حساب السعرات الحرارية...',
    'تقريباً انتهينا...'
];

const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.loadingScreen}>
            <div className={styles.backgroundPattern} />

            {/* Floating Emojis */}
            <div className={styles.floatingElement}>🍽️</div>
            <div className={styles.floatingElement}>🥗</div>
            <div className={styles.floatingElement}>🍎</div>
            <div className={styles.floatingElement}>🥘</div>

            <div className={styles.loadingContainer}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoIcon} />
                    <h1 className={styles.logoText}>لُقمتي</h1>
                    <p className={styles.logoSubtitle}>تطبيق تتبع الوجبات</p>
                </div>

                <div className={styles.loadingAnimation}>
                    <div className={styles.loadingDots}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </div>

                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar} />
                    </div>

                    <div className={styles.loadingText}>{messages[messageIndex]}</div>
                    <div className={styles.loadingSubtext}>يرجى الانتظار بينما نحضر وجباتك</div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
