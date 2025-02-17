import React, { useEffect } from 'react';
import { ChefHat, Camera, Brain, Utensils, Star, Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from '../assets/styles/Splash.module.css';
import { useNavigate } from "react-router-dom";


function App() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }, []);

    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.patternOverlay}></div>

            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.logo}>
                        <ChefHat className={styles.logoIcon} />
                        <span className={styles.logoText}>لقمتي</span>
                    </div>
                    <div className={styles.navButtons}>
                        <button className={styles.loginButton} onClick={() => navigate("/signin")}>تسجيل الدخول</button>
                        <button className={styles.signupButton}>إنشاء حساب</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className={styles.hero}>
                <div className={styles.heroContent} data-aos="fade-left">
                    <h1 className={styles.title}>اكتشف مكونات طبقك المفضل</h1>
                    <p className={styles.subtitle}>
                        حلل صورة طعامك واحصل على معلومات تغذية دقيقة في ثوانٍ
                    </p>
                    <button className={styles.ctaButton}>
                        ابدأ الآن مجاناً
                    </button>
                </div>
                <div className={styles.heroImage} data-aos="fade-right">
                    <img
                        src="https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&q=80"
                        alt="Traditional Arabic Food"
                        className={styles.mainImage}
                    />
                </div>
            </main>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.statsContent}>
                    <div className={styles.statItem} data-aos="fade-up" data-aos-delay="0">
                        <h3>+١٠٠٠</h3>
                        <p>وصفة عربية</p>
                    </div>
                    <div className={styles.statItem} data-aos="fade-up" data-aos-delay="100">
                        <h3>٩٩٪</h3>
                        <p>دقة التحليل</p>
                    </div>
                    <div className={styles.statItem} data-aos="fade-up" data-aos-delay="200">
                        <h3>+٥٠٠٠</h3>
                        <p>مستخدم نشط</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <h2 className={styles.sectionTitle} data-aos="fade-up">مميزات تطبيقنا</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="0">
                        <Camera className={styles.featureIcon} />
                        <h3>تحليل سريع</h3>
                        <p>التقط صورة لطبقك واحصل على النتائج في ثوانٍ</p>
                    </div>
                    <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="100">
                        <Brain className={styles.featureIcon} />
                        <h3>ذكاء اصطناعي متقدم</h3>
                        <p>تحليل دقيق للمكونات والقيم الغذائية</p>
                    </div>
                    <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="200">
                        <Utensils className={styles.featureIcon} />
                        <h3>تخصص في المطبخ العربي</h3>
                        <p>قاعدة بيانات شاملة للأطباق العربية التقليدية</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className={styles.testimonials}>
                <h2 className={styles.sectionTitle} data-aos="fade-up">آراء المستخدمين</h2>
                <div className={styles.testimonialGrid}>
                    <div className={styles.testimonialCard} data-aos="fade-up" data-aos-delay="0">
                        <div className={styles.testimonialStars}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={styles.starIcon} />
                            ))}
                        </div>
                        <p>"تطبيق رائع ساعدني في تتبع نظامي الغذائي بسهولة"</p>
                        <div className={styles.testimonialAuthor}>
                            <span>سارة أحمد</span>
                            <span className={styles.testimonialRole}>خبيرة تغذية</span>
                        </div>
                    </div>
                    <div className={styles.testimonialCard} data-aos="fade-up" data-aos-delay="100">
                        <div className={styles.testimonialStars}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={styles.starIcon} />
                            ))}
                        </div>
                        <p>"دقة عالية في تحليل الأطباق العربية التقليدية"</p>
                        <div className={styles.testimonialAuthor}>
                            <span>محمد خالد</span>
                            <span className={styles.testimonialRole}>طاهي محترف</span>
                        </div>
                    </div>
                    <div className={styles.testimonialCard} data-aos="fade-up" data-aos-delay="200">
                        <div className={styles.testimonialStars}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={styles.starIcon} />
                            ))}
                        </div>
                        <p>"يساعدني في الحفاظ على نمط حياة صحي"</p>
                        <div className={styles.testimonialAuthor}>
                            <span>فاطمة علي</span>
                            <span className={styles.testimonialRole}>مدربة لياقة</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerMain}>
                        <div className={styles.footerBrand}>
                            <div className={styles.footerLogo}>
                                <ChefHat className={styles.logoIcon} />
                                <span className={styles.logoText}>لقمتي</span>
                            </div>
                            <p className={styles.footerDescription}>
                                منصة ذكية لتحليل الأطعمة وحساب السعرات الحرارية باستخدام تقنيات الذكاء الاصطناعي
                            </p>
                        </div>
                        <div className={styles.footerLinks}>
                            <div className={styles.footerSection}>
                                <h3>روابط سريعة</h3>
                                <ul>
                                    <li><a href="#">الرئيسية</a></li>
                                    <li><a href="#">المميزات</a></li>
                                    <li><a href="#">التسعير</a></li>
                                    <li><a href="#">تواصل معنا</a></li>
                                </ul>
                            </div>
                            <div className={styles.footerSection}>
                                <h3>الدعم</h3>
                                <ul>
                                    <li><a href="#">الأسئلة الشائعة</a></li>
                                    <li><a href="#">سياسة الخصوصية</a></li>
                                    <li><a href="#">الشروط والأحكام</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footerBottom}>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink}><Instagram /></a>
                            <a href="#" className={styles.socialLink}><Twitter /></a>
                            <a href="#" className={styles.socialLink}><Facebook /></a>
                            <a href="#" className={styles.socialLink}><Mail /></a>
                        </div>
                        <p className={styles.copyright}>
                            © ٢٠٢٤ لقمتي. جميع الحقوق محفوظة
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;