import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Lightbulb,
    Heart,
    Apple,
    Droplets,
    Clock,
    Utensils,
    Activity,
    Shield,
    Sun,
    Moon,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import styles from '../assets/styles/Tips.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface Tip {
    id: string;
    title: string;
    description: string;
    category: 'nutrition' | 'health' | 'lifestyle' | 'exercise';
    icon: React.ReactNode;
    details: string[];
}

const Tips: React.FC = () => {
    const [expandedTip, setExpandedTip] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const tips: Tip[] = [
        {
            id: '1',
            title: 'شرب الماء بانتظام',
            description: 'اشرب 8-10 أكواب من الماء يومياً للحفاظ على ترطيب الجسم',
            category: 'health',
            icon: <Droplets className={styles.tipIcon} />,
            details: [
                'يساعد الماء في تحسين عملية الهضم',
                'يحافظ على نضارة البشرة',
                'يساعد في إزالة السموم من الجسم',
                'يحسن من وظائف الكلى والكبد'
            ]
        },
        {
            id: '2',
            title: 'تناول الفواكه والخضراوات',
            description: 'احرص على تناول 5 حصص من الفواكه والخضراوات يومياً',
            category: 'nutrition',
            icon: <Apple className={styles.tipIcon} />,
            details: [
                'غنية بالفيتامينات والمعادن الأساسية',
                'تحتوي على الألياف المفيدة للهضم',
                'تقوي جهاز المناعة',
                'تقلل من خطر الإصابة بالأمراض المزمنة'
            ]
        },
        {
            id: '3',
            title: 'تناول وجبات منتظمة',
            description: 'حافظ على تناول 3 وجبات رئيسية و2 وجبة خفيفة صحية',
            category: 'nutrition',
            icon: <Clock className={styles.tipIcon} />,
            details: [
                'يحافظ على مستوى السكر في الدم',
                'يساعد في التحكم في الوزن',
                'يحسن من مستوى الطاقة',
                'يمنع الإفراط في تناول الطعام'
            ]
        },
        {
            id: '4',
            title: 'ممارسة الرياضة بانتظام',
            description: 'اهدف لممارسة 30 دقيقة من النشاط البدني يومياً',
            category: 'exercise',
            icon: <Activity className={styles.tipIcon} />,
            details: [
                'يقوي عضلة القلب والأوعية الدموية',
                'يساعد في حرق السعرات الحرارية',
                'يحسن من الحالة المزاجية',
                'يقوي العظام والعضلات'
            ]
        },
        {
            id: '5',
            title: 'النوم الكافي',
            description: 'احصل على 7-9 ساعات من النوم الجيد كل ليلة',
            category: 'lifestyle',
            icon: <Moon className={styles.tipIcon} />,
            details: [
                'يساعد في تجديد خلايا الجسم',
                'يحسن من وظائف المخ والذاكرة',
                'يقوي جهاز المناعة',
                'يساعد في التحكم في الوزن'
            ]
        },
        {
            id: '6',
            title: 'تقليل السكريات المضافة',
            description: 'قلل من تناول المشروبات الغازية والحلويات المصنعة',
            category: 'nutrition',
            icon: <Shield className={styles.tipIcon} />,
            details: [
                'يقلل من خطر الإصابة بالسكري',
                'يساعد في فقدان الوزن',
                'يحسن من صحة الأسنان',
                'يقلل من التهابات الجسم'
            ]
        },
        {
            id: '7',
            title: 'التعرض لأشعة الشمس',
            description: 'احصل على 15-20 دقيقة من أشعة الشمس يومياً',
            category: 'health',
            icon: <Sun className={styles.tipIcon} />,
            details: [
                'يساعد في إنتاج فيتامين د',
                'يحسن من الحالة المزاجية',
                'يقوي العظام',
                'ينظم دورة النوم الطبيعية'
            ]
        },
        {
            id: '8',
            title: 'تناول البروتين في كل وجبة',
            description: 'احرص على تضمين مصدر للبروتين في كل وجبة رئيسية',
            category: 'nutrition',
            icon: <Utensils className={styles.tipIcon} />,
            details: [
                'يساعد في بناء وإصلاح العضلات',
                'يزيد من الشعور بالشبع',
                'يحافظ على مستوى السكر في الدم',
                'يساعد في حرق السعرات الحرارية'
            ]
        }
    ];

    const categories = [
        { id: 'all', name: 'جميع النصائح', icon: <Lightbulb /> },
        { id: 'nutrition', name: 'التغذية', icon: <Apple /> },
        { id: 'health', name: 'الصحة العامة', icon: <Heart /> },
        { id: 'exercise', name: 'الرياضة', icon: <Activity /> },
        { id: 'lifestyle', name: 'نمط الحياة', icon: <Moon /> }
    ];

    const filteredTips = selectedCategory === 'all' 
        ? tips 
        : tips.filter(tip => tip.category === selectedCategory);

    const toggleTip = (tipId: string) => {
        setExpandedTip(expandedTip === tipId ? null : tipId);
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <Sidebar />

            <main className={styles.mainContent}>
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={styles.pageHeader}
                >
                    <h1>نصائح غذائية وصحية</h1>
                    <p>اكتشف أفضل النصائح للحفاظ على صحتك ونمط حياة صحي</p>
                </motion.div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className={styles.categoriesSection}
                >
                    <h2>التصنيفات</h2>
                    <div className={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                className={`${styles.categoryCard} ${
                                    selectedCategory === category.id ? styles.active : ''
                                }`}
                                onClick={() => setSelectedCategory(category.id)}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category.icon}
                                <span>{category.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                    className={styles.tipsSection}
                >
                    <h2>النصائح ({filteredTips.length})</h2>
                    <div className={styles.tipsGrid}>
                        {filteredTips.map((tip, index) => (
                            <motion.div
                                key={tip.id}
                                className={styles.tipCard}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={styles.tipHeader}>
                                    <div className={styles.tipIconContainer}>
                                        {tip.icon}
                                    </div>
                                    <div className={styles.tipInfo}>
                                        <h3>{tip.title}</h3>
                                        <p>{tip.description}</p>
                                    </div>
                                    <button
                                        className={styles.expandButton}
                                        onClick={() => toggleTip(tip.id)}
                                    >
                                        {expandedTip === tip.id ? (
                                            <ChevronUp className={styles.expandIcon} />
                                        ) : (
                                            <ChevronDown className={styles.expandIcon} />
                                        )}
                                    </button>
                                </div>
                                
                                {expandedTip === tip.id && (
                                    <motion.div
                                        className={styles.tipDetails}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4>الفوائد:</h4>
                                        <ul>
                                            {tip.details.map((detail, index) => (
                                                <li key={index}>{detail}</li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
                    className={styles.healthQuote}
                >
                    <div className={styles.quoteContent}>
                        <Lightbulb className={styles.quoteIcon} />
                        <blockquote>
                            "الصحة هي التاج على رؤوس الأصحاء لا يراه إلا المرضى"
                        </blockquote>
                        <cite>مثل عربي</cite>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Tips;
