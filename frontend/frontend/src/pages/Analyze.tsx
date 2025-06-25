import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Upload,
    Camera,
    Loader2,
    Utensils,
    Save,
    Scale,
    Edit2,
    Plus,
    Minus
} from 'lucide-react';
import styles from '../assets/styles/Analyze.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Hand } from 'lucide-react';

interface DetectedFood {
    id: string;
    name: string;
    details: string;
    portionSize: number;
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
}

function App() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
    const [editingPortionId, setEditingPortionId] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Manual meal state
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualMealName, setManualMealName] = useState('');
    const [manualPortion, setManualPortion] = useState('');
    const [manualType, setManualType] = useState<'size' | 'count'>('size');
    const [manualError, setManualError] = useState('');
    const [manualHistory, setManualHistory] = useState<{name: string, portion: string, type: string}[]>([]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                simulateAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                simulateAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setDetectedFoods([
                {
                    id: '1',
                    name: 'كبسة لحم',
                    details: 'طبق سعودي تقليدي',
                    portionSize: 350,
                    calories: 450,
                    carbs: 55,
                    protein: 25,
                    fats: 15
                },
                {
                    id: '2',
                    name: 'سلطة عربية',
                    details: 'طبق جانبي',
                    portionSize: 150,
                    calories: 120,
                    carbs: 15,
                    protein: 5,
                    fats: 8
                }
            ]);
        }, 3000);
    };

    const handlePortionChange = (id: string, newSize: number) => {
        setDetectedFoods(foods =>
            foods.map(food =>
                food.id === id
                    ? {
                        ...food,
                        portionSize: newSize,
                        calories: Math.round((food.calories * newSize) / food.portionSize),
                        carbs: Math.round((food.carbs * newSize) / food.portionSize),
                        protein: Math.round((food.protein * newSize) / food.portionSize),
                        fats: Math.round((food.fats * newSize) / food.portionSize)
                    }
                    : food
            )
        );
    };

    const getTotalNutrition = () => {
        return detectedFoods.reduce(
            (acc, food) => ({
                calories: acc.calories + food.calories,
                carbs: acc.carbs + food.carbs,
                protein: acc.protein + food.protein,
                fats: acc.fats + food.fats
            }),
            { calories: 0, carbs: 0, protein: 0, fats: 0 }
        );
    };

    // Manual meal logic
    const handleManualAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setManualError('');
        if (!manualMealName || !manualPortion) {
            setManualError('الرجاء إدخال جميع البيانات');
            return;
        }
        if (Number.isNaN(Number(manualPortion)) || Number(manualPortion) <= 0) {
            setManualError('الكمية يجب أن تكون رقم موجب');
            return;
        }
        setManualHistory(prev => [...prev, {
            name: manualMealName,
            portion: manualPortion,
            type: manualType === 'size' ? 'جرام' : 'عدد'
        }]);
        setManualMealName('');
        setManualPortion('');
        setManualError('');
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
                    <h1>مرحباً بك في لوحة التحكم</h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    >
                        ابدأ بتحليل وجبتك للحصول على معلومات تغذية دقيقة
                    </motion.p>
                </motion.div>

                <div className={styles.uploadSection} style={{ flexDirection: isMobile ? "column" : "row", display: "flex" }}>
                    {/* Upload half */}
                    <div style={{
                        flex: 1,
                        marginInlineEnd: isMobile ? 0 : "1rem",
                        marginBottom: isMobile ? "1.5rem" : 0,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "stretch"
                    }}>
                        <div className={isMobile ? styles.optionsContainerMobile : styles.optionsContainerDesktop}>
                            {isMobile && (
                                <div className={styles.uploadCard}>
                                    <input
                                        type="file"
                                        id="cameraUpload"
                                        accept="image/*"
                                        capture="environment"
                                        className={styles.fileInput}
                                        onChange={handleCameraCapture}
                                    />
                                    <motion.label
                                        htmlFor="cameraUpload"
                                        className={styles.uploadOption}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className={styles.uploadIcon}>
                                            <Camera className={styles.icon} />
                                        </div>
                                        <h3>التقط صورة مباشرة</h3>
                                        <p>استخدم الكاميرا لإلتقاط صورة لوجبتك</p>
                                    </motion.label>
                                </div>
                            )}
                            <div className={`${styles.uploadCard} ${!isMobile ? styles.fullWidthCard : ''}`}>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handleGalleryUpload}
                                />
                                <motion.label
                                    htmlFor="imageUpload"
                                    className={styles.uploadOption}
                                    whileHover={{ y: -5 }}
                                    onHoverStart={() => setIsHovered(true)}
                                    onHoverEnd={() => setIsHovered(false)}
                                >
                                    <motion.div
                                        className={styles.uploadIcon}
                                        animate={isHovered ? { y: [0, -20, 0] } : { y: 0 }}
                                        transition={{
                                            repeat: isHovered ? Infinity : 0,
                                            duration: 0.6,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Upload className={styles.icon} />
                                    </motion.div>
                                    <h3>اختر صورة من المعرض</h3>
                                    <p>اسحب الصورة هنا أو انقر للاختيار</p>
                                </motion.label>
                            </div>
                        </div>
                        {imagePreview && (
                            <div className={styles.previewSection}>
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview} alt="Preview" />
                                </div>
                                {isAnalyzing ? (
                                    <div className={styles.analyzing}>
                                        <Loader2 className={styles.spinnerIcon} />
                                        <p>جاري تحليل الوجبة...</p>
                                    </div>
                                ) : detectedFoods.length > 0 && (
                                    <div className={styles.results}>
                                        <div className={styles.resultHeader}>
                                            <Utensils className={styles.resultIcon} />
                                            <h2>نتائج التحليل</h2>
                                        </div>
                                        <div className={styles.detectedFoods}>
                                            {detectedFoods.map((food) => (
                                                <div key={food.id} className={styles.foodCard}>
                                                    <div className={styles.foodHeader}>
                                                        <h3>{food.name}</h3>
                                                        <span>{food.details}</span>
                                                    </div>
                                                    <div className={styles.portionSection}>
                                                        <div className={styles.portionHeader}>
                                                            <Scale className={styles.portionIcon} />
                                                            <span>حجم الوجبة</span>
                                                        </div>
                                                        {editingPortionId === food.id ? (
                                                            <div className={styles.portionEdit}>
                                                                <button
                                                                    className={styles.portionButton}
                                                                    onClick={() => handlePortionChange(food.id, Math.max(50, food.portionSize - 50))}
                                                                >
                                                                    <Minus className={styles.portionButtonIcon} />
                                                                </button>
                                                                <div className={styles.portionValue}>
                                                                    <input
                                                                        type="number"
                                                                        className={styles.portionInput}
                                                                        value={food.portionSize}
                                                                        min={1}
                                                                        onChange={e => {
                                                                            const value = parseInt(e.target.value, 10);
                                                                            if (!isNaN(value)) handlePortionChange(food.id, value);
                                                                        }}
                                                                        onBlur={e => setEditingPortionId(null)}
                                                                        onKeyDown={e => {
                                                                            if (e.key === 'Enter') setEditingPortionId(null);
                                                                        }}
                                                                    />
                                                                    <span className={styles.portionUnit}>جرام</span>
                                                                </div>
                                                                <button
                                                                    className={styles.portionButton}
                                                                    onClick={() => handlePortionChange(food.id, food.portionSize + 10)}
                                                                >
                                                                    <Plus className={styles.portionButtonIcon} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className={styles.portionDisplay}>
                                                                <span>{food.portionSize} جرام</span>
                                                                <button
                                                                    className={styles.editButton}
                                                                    onClick={() => setEditingPortionId(food.id)}
                                                                >
                                                                    <Edit2 className={styles.editIcon} />
                                                                    تعديل
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles.nutritionGrid}>
                                                        <div className={styles.nutritionItem}>
                                                            <h4>السعرات الحرارية</h4>
                                                            <p>{food.calories} كالوري</p>
                                                        </div>
                                                        <div className={styles.nutritionItem}>
                                                            <h4>الكربوهيدرات</h4>
                                                            <p>{food.carbs} جرام</p>
                                                        </div>
                                                        <div className={styles.nutritionItem}>
                                                            <h4>البروتين</h4>
                                                            <p>{food.protein} جرام</p>
                                                        </div>
                                                        <div className={styles.nutritionItem}>
                                                            <h4>الدهون</h4>
                                                            <p>{food.fats} جرام</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.totalNutrition}>
                                            <h3>إجمالي القيم الغذائية</h3>
                                            <div className={styles.nutritionGrid}>
                                                <div className={styles.nutritionItem}>
                                                    <h4>السعرات الكلية</h4>
                                                    <p>{getTotalNutrition().calories} كالوري</p>
                                                </div>
                                                <div className={styles.nutritionItem}>
                                                    <h4>مجموع الكربوهيدرات</h4>
                                                    <p>{getTotalNutrition().carbs} جرام</p>
                                                </div>
                                                <div className={styles.nutritionItem}>
                                                    <h4>مجموع البروتين</h4>
                                                    <p>{getTotalNutrition().protein} جرام</p>
                                                </div>
                                                <div className={styles.nutritionItem}>
                                                    <h4>مجموع الدهون</h4>
                                                    <p>{getTotalNutrition().fats} جرام</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className={styles.saveButton}>
                                            <Save className={styles.saveIcon} />
                                            حفظ في السجل
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Manual input half */}
                    <div style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "stretch"
                    }}>
                        <div className={styles.manualCard}>
                            {!showManualInput ? (
                                <button
                                    className={styles.manualCardButton}
                                    onClick={() => setShowManualInput(true)}
                                >
                                    <Hand className={styles.manualHandIcon} />
                                      <h3>ادخل وجبتك يدويا</h3>
                                    <p>اسحب الصورة هنا أو انقر للاختيار</p>
                                </button>
                            ) : (
                                <form
                                    onSubmit={handleManualAdd}
                                    className={styles.manualCardContent}
                                >
                                    <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                                        <label style={{color: "#fff", textAlign: "right", marginBottom: "0.2rem"}}>اسم الوجبة</label>
                                        <input
                                            type="text"
                                            value={manualMealName}
                                            onChange={e => setManualMealName(e.target.value)}
                                            placeholder="ادخل اسم الوجبة هنا"
                                            className={styles.manualInput}
                                            required
                                        />
                                    </div>
                                    <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                                        <label style={{color: "#fff", whiteSpace: "nowrap"}}>{manualType === 'size' ? "الوزن (جرام)" : "العدد"}</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={manualPortion}
                                            onChange={e => setManualPortion(e.target.value)}
                                            placeholder={manualType === 'size' ? "250" : "2"}
                                            className={styles.manualInput}
                                            style={{flex: 1, marginBottom: 0}}
                                        />
                                        <select
                                            value={manualType}
                                            onChange={e => setManualType(e.target.value as 'size' | 'count')}
                                            className={styles.manualSelect}
                                        >
                                            <option value="size">جرام</option>
                                            <option value="count">عدد</option>
                                        </select>
                                    </div>
                                    {manualError && (
                                        <div className={styles.manualError}>
                                            {manualError}
                                        </div>
                                    )}
                                    <button type="submit" className={styles.saveButton} style={{ fontWeight: 700, marginTop: 8 }}>
                                        <Save className={styles.saveIcon} />
                                       حلل الوجبة
                                    </button>
                                </form>
                            )}
                            {manualHistory.length > 0 && (
                                <div className={styles.manualHistoryCard}>
                                    <ul className={styles.manualHistoryList}>
                                        {manualHistory.map((item, idx) => (
                                            <li key={idx} className={styles.manualHistoryItem}>
                                                <span className={styles.manualHistoryName}>
                                                    {item.name}
                                                </span>
                                                <span className={styles.manualHistoryPortion}>
                                                    {item.portion} {item.type}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;