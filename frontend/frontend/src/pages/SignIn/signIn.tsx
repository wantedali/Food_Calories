import React, { useState, useEffect } from 'react'; // Import useEffect
import { Eye, ChefHat, ArrowLeft } from 'lucide-react';
import styles from '../../assets/styles/SignIn.module.css';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS

function App() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration
            once: true, // Only animate once
            easing: 'ease-in-out', // Smooth easing
        });
    }, []);

    return (
        <div className={styles.container} data-aos="fade-in">
            <div className={styles.patternOverlay}></div>
            {/* Back Button */}
            <button className={styles.backButton} onClick={() => navigate("/")}>
                <ArrowLeft className={styles.backIcon} />
            </button>

            <div className={styles.gridContainer}>
                {/* Left Side - Image */}
                <div className={styles.imageContainer} data-aos="fade-right" data-aos-delay="200">
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
                <div className={styles.formContainer} data-aos="fade-left" data-aos-delay="200">
                    {/* Logo */}
                    <div className={styles.logo}>
                        <ChefHat className={styles.logoIcon} />
                        <span className={styles.logoText}>لقمتي</span>
                    </div>

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
                                <a href="#" className={styles.forgotPasswordLink}>
                                    نسيت كلمة السر؟
                                </a>
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