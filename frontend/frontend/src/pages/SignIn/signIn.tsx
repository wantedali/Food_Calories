import React, { useState, useEffect } from 'react'; 
import { Eye, ChefHat, ArrowLeft } from 'lucide-react';
import styles from '../../assets/styles/SignIn.module.css';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 

function App() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true, 
            easing: 'ease-in-out', 
        });
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: false,
      };

    return (
        <div className={styles.container} data-aos="fade-in">
            <div className={styles.patternOverlay}></div>
            <button className={styles.backButton} onClick={() => navigate("/")}>
                <ArrowLeft className={styles.backIcon} />
            </button>

            <div className={styles.gridContainer}>
                <div className={styles.imageContainer} data-aos="fade-right" data-aos-delay="200">
                        <Slider {...settings}>
                        <div>
                            <img src="/images/falafel.jpg" alt="Falafel" />
                        </div>
                        <div>
                            <img src="/images/hummus.jpg" alt="Hummus" />
                        </div>
                        <div>
                            <img src="/images/kebab.jpg" alt="Kebab" />
                        </div>
                        </Slider>
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
                                <a href="/SignUp" className={styles.link} >
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