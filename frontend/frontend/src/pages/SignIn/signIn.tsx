import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import styles from '../../assets/styles/SignIn.module.css';

function App() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.patternOverlay}></div>
            <div className={styles.gridContainer}>
                {/* Left Side - Image */}
                <div className={styles.imageContainer}>
                    {/* <img src="https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&q=80" 
                         alt="Kebab skewers"
                         className={styles.image} /> */}
                    <div className={styles.imageOverlay}>
                        <h2 className={styles.arabicTitle}>وجبتك بلقطة،</h2>
                        <p className={styles.arabicSubtitle}>صحتك بخيارك</p>
                    </div>
                    <div className={styles.indicators}>
                        <span className={styles.indicator}></span>
                        <span className={styles.indicator}></span>
                        <span className={`${styles.indicator} ${styles.indicatorActive}`}></span>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className={styles.formContainer}>
                    {/* <div className={styles.logo}>SnB</div> */}
                    <div className={styles.formContent}>
                        <div className={styles.formHeader}>
                            <h1>مرحبا بك مرة اخري!</h1>
                            <p>
                                ليس لديك حساب؟{' '}
                                <a href="#" className={styles.link}>
                                    إنشاء حساب
                                </a>
                            </p>
                        </div>

                        <form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="البريد الإلكتروني"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.passwordContainer}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="كلمة السر"
                                        className={styles.input}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={styles.passwordToggle}
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                تسجيل الدخول
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;