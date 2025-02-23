import React from 'react';
import {
    ChefHat,
    Instagram,
    Twitter,
    Facebook,
    Mail
} from 'lucide-react';
import styles from "../assets/styles/Footer.module.css";

const Sidebar: React.FC = () => {

    return (
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
        </footer>);
};

export default Sidebar;