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
    Minus,
    Hand,
    X
} from 'lucide-react';
import styles from '../assets/styles/Analyze.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import SaveModal from '../components/SaveModal';

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

interface ManualMeal {
    name: string;
    portion: string;
    type: string;
}

function App() {
    const [activeMode, setActiveMode] = useState<'upload' | 'manual' | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
    const [editingPortionId, setEditingPortionId] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveModalType, setSaveModalType] = useState<'image' | 'manual'>('image');

    // Manual meal state
    const [manualMealDescription, setManualMealDescription] = useState('');
    const [manualError, setManualError] = useState('');
    const [manualHistory, setManualHistory] = useState<ManualMeal[]>([]);
    const [isAnalyzingManual, setIsAnalyzingManual] = useState(false);
    const [manualResults, setManualResults] = useState<DetectedFood[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

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

    const resetStates = () => {
        setImagePreview(null);
        setDetectedFoods([]);
        setManualMealDescription('');
        setManualResults([]);
        setManualError('');
        setIsAnalyzing(false);
        setIsAnalyzingManual(false);
    };

    const handleModeChange = (mode: 'upload' | 'manual') => {
        if (activeMode !== mode) {
            resetStates();
            setActiveMode(mode);
        }
    };

    const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleModeChange('upload');
            setImageFile(file); // ✅ store file for API
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                analyzeImage(file); // use real analysis
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleModeChange('upload');
            setImageFile(file); // ✅ store file for API
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                analyzeImage(file); // use real analysis
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async (file: File) => {
        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append("ImageFile", file);

            const response = await fetch('http://localhost:5062/api/FoodAnalysis/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("فشل في تحليل الصورة");
            }

            const data = await response.json();

            const analyzedItems = data.items.map((item: any, index: number) => ({
                id: `${Date.now()}-${index}`,
                name: item.name,
                details: '',
                portionSize: item.portionSizeGrams,
                calories: item.totalNutrition.calories,
                carbs: item.totalNutrition.carbs,
                protein: item.totalNutrition.protein,
                fats: item.totalNutrition.fat, // API returns 'fat'
            }));

            setDetectedFoods(analyzedItems);
        } catch (error) {
            console.error("Image analysis error:", error);
            alert("حدث خطأ أثناء تحليل الصورة");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getDefaultMealName = () => {
        if (detectedFoods.length === 1) return detectedFoods[0].name;
        return detectedFoods.map(f => f.name).join(' + ');
    };

    const getTotalWeight = () => {
        return detectedFoods.reduce((sum, food) => sum + food.portionSize, 0);
    };


    // Update the handleManualAnalysis function
    const handleManualAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!manualMealDescription.trim()) {
            setManualError('الرجاء وصف الوجبة');
            return;
        }

        handleModeChange('manual');
        setIsAnalyzingManual(true);
        setManualError('');
        setManualResults([]); // Clear previous results

        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("يجب تسجيل الدخول أولاً");
            }

            const response = await fetch('http://localhost:5062/api/FoodAnalysis/analyze-meal-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(manualMealDescription) // Send just the string as required
            });

            if (!response.ok) {
                throw new Error("فشل في تحليل الوجبة");
            }

            const data = await response.json();

            // Transform API response to our DetectedFood interface
            const analyzedFood: DetectedFood = {
                id: `manual-${Date.now()}`,
                name: data.name || manualMealDescription,
                details: 'وجبة مدخلة يدوياً',
                portionSize: data.estimatedSize || 100, // ✅ use estimatedSize from API
                calories: data.calories,
                carbs: data.carbs,
                protein: data.protein,
                fats: data.fat
            };

            setManualResults([analyzedFood]);

        } catch (error) {
            console.error("Error analyzing meal:", error);
            setManualError(
                error instanceof Error ? error.message : "حدث خطأ أثناء تحليل الوجبة"
            );
        } finally {
            setIsAnalyzingManual(false);
        }
    };

    const handlePortionChange = (id: string, newSize: number, isManual = false) => {
        const updateFunction = (foods: DetectedFood[]) =>
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
            );

        if (isManual) {
            setManualResults(updateFunction);
        } else {
            setDetectedFoods(updateFunction);
        }
    };

    const getTotalNutrition = (foods: DetectedFood[]) => {
        return foods.reduce(
            (acc, food) => ({
                calories: acc.calories + food.calories,
                carbs: acc.carbs + food.carbs,
                protein: acc.protein + food.protein,
                fats: acc.fats + food.fats
            }),
            { calories: 0, carbs: 0, protein: 0, fats: 0 }
        );
    };

    const handleSave = async (
        mealName: string,
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'history',
        weight?: number
    ) => {
        const mealTypeText = {
            breakfast: 'الفطار',
            lunch: 'الغداء',
            dinner: 'العشاء',
            history: 'السجل'
        };

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("يجب تسجيل الدخول أولاً");
            return;
        }

        const isManual = saveModalType === 'manual';
        const foods = isManual ? manualResults : detectedFoods;
        const total = getTotalNutrition(foods);
        const totalWeight = foods.reduce((sum, f) => sum + f.portionSize, 0);

        // ✅ Save to History
        if (mealType === 'history') {
            if (isManual && foods.length > 0) {
                // Save manual analysis to history
                try {
                    const res = await fetch('http://localhost:5062/api/History/basic', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            mealName,
                            calories: total.calories,
                            protein: total.protein,
                            carbs: total.carbs,
                            fat: total.fats,
                            wieght: weight || totalWeight
                        })
                    });

                    const resData = await res.text();
                    if (!res.ok) throw new Error(resData);

                    alert("✅ تم حفظ الوجبة في السجل (يدوياً)");
                } catch (err) {
                    console.error("Saving manual to history failed:", err);
                    alert("⚠️ فشل في حفظ الوجبة في السجل (يدوياً)");
                }
            } else if (!isManual && imageFile && foods.length > 0) {
                // Save image analysis to history
                const formData = new FormData();
                formData.append("Image", imageFile);
                formData.append("UserId", userId);
                formData.append("MealName", mealName);
                formData.append("Calories", total.calories.toString());
                formData.append("Protein", total.protein.toString());
                formData.append("Carbs", total.carbs.toString());
                formData.append("Fat", total.fats.toString());
                formData.append("Wieght", weight?.toString() || "0");

                try {
                    const res = await fetch('http://localhost:5062/api/History/analysis', {
                        method: 'POST',
                        body: formData
                    });

                    const text = await res.text();
                    if (!res.ok) throw new Error(text);

                    alert("✅ تم حفظ الوجبة في السجل (صورة)");
                } catch (err) {
                    console.error("Saving image meal failed:", err);
                    alert("⚠️ فشل في حفظ الوجبة من الصورة");
                }
            }
        }

        // ✅ Save to Meals (breakfast/lunch/dinner)
        else if (['breakfast', 'lunch', 'dinner'].includes(mealType) && foods.length > 0) {
            try {
                const res = await fetch('http://localhost:5062/api/Meals/AddMeal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        typeOfMeal: mealType,
                        food: {
                            name: mealName,
                            calories: total.calories,
                            protein: total.protein,
                            carbs: total.carbs,
                            fat: total.fats,
                            weight: weight || totalWeight
                        }
                    })
                });

                const resData = await res.json();
                if (!res.ok) throw new Error(resData.message || 'فشل في حفظ الوجبة');

                alert(`✅ تم حفظ الوجبة في ${mealTypeText[mealType]}`);
            } catch (err) {
                console.error("Saving meal failed:", err);
                alert("⚠️ فشل في حفظ الوجبة");
            }
        }

        // ✅ Fallback for any missed condition
        else {
            setManualHistory(prev => [
                ...prev,
                {
                    name: mealName,
                    portion: weight ? `${weight} جرام` : 'غير محدد',
                    type: mealTypeText[mealType]
                }
            ]);
        }
    };



    const openSaveModal = (type: 'image' | 'manual') => {
        setSaveModalType(type);
        setShowSaveModal(true);
    };

    const renderFoodResults = (foods: DetectedFood[], isManual = false) => (
        <div className={styles.results}>
            <div className={styles.resultHeader}>
                <Utensils className={styles.resultIcon} />
                <h2>نتائج التحليل</h2>
            </div>
            <div className={styles.detectedFoods}>
                {foods.map((food) => (
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
                                        onClick={() => handlePortionChange(food.id, Math.max(50, food.portionSize - 50), isManual)}
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
                                                if (!isNaN(value)) handlePortionChange(food.id, value, isManual);
                                            }}
                                            onBlur={() => setEditingPortionId(null)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') setEditingPortionId(null);
                                            }}
                                        />
                                        <span className={styles.portionUnit}>جرام</span>
                                    </div>
                                    <button
                                        className={styles.portionButton}
                                        onClick={() => handlePortionChange(food.id, food.portionSize + 10, isManual)}
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
                        <p>{getTotalNutrition(foods).calories} كالوري</p>
                    </div>
                    <div className={styles.nutritionItem}>
                        <h4>مجموع الكربوهيدرات</h4>
                        <p>{getTotalNutrition(foods).carbs} جرام</p>
                    </div>
                    <div className={styles.nutritionItem}>
                        <h4>مجموع البروتين</h4>
                        <p>{getTotalNutrition(foods).protein} جرام</p>
                    </div>
                    <div className={styles.nutritionItem}>
                        <h4>مجموع الدهون</h4>
                        <p>{getTotalNutrition(foods).fats} جرام</p>
                    </div>
                </div>
            </div>
            <button
                className={styles.saveButton}
                onClick={() => openSaveModal(isManual ? 'manual' : 'image')}
            >
                <Save className={styles.saveIcon} />
                حفظ الوجبة
            </button>
        </div>
    );

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

                <div className={styles.uploadSection}>
                    {/* Show both options when no mode is selected */}
                    {!activeMode && (
                        <div style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: "1.5rem",
                            width: "100%"
                        }}>
                            {/* Upload Section */}
                            <div style={{ flex: 1 }}>
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
                            </div>

                            {/* Manual Input Section */}
                            <div style={{ flex: 1 }}>
                                <div className={styles.manualCard}>
                                    <button
                                        className={styles.manualCardButton}
                                        onClick={() => handleModeChange('manual')}
                                    >
                                        <Hand className={styles.manualHandIcon} />
                                        <h3>وصف الوجبة يدوياً</h3>
                                        <p>اكتب وصف مفصل لوجبتك وسنحللها لك</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upload Mode - Full Width */}
                    {activeMode === 'upload' && (
                        <div style={{ width: "100%" }}>
                            <div className={styles.expandedSection}>
                                <div className={styles.sectionHeader}>
                                    <h2>تحليل الصورة</h2>
                                    <button
                                        onClick={() => setActiveMode(null)}
                                        className={styles.backButton}
                                    >
                                        <X size={20} />
                                        العودة للخيارات
                                    </button>
                                </div>

                                {!imagePreview && (
                                    <div className={styles.optionsContainerDesktop}>
                                        {isMobile && (
                                            <div className={styles.uploadCard}>
                                                <input
                                                    type="file"
                                                    id="cameraUpload2"
                                                    accept="image/*"
                                                    capture="environment"
                                                    className={styles.fileInput}
                                                    onChange={handleCameraCapture}
                                                />
                                                <motion.label
                                                    htmlFor="cameraUpload2"
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
                                        <div className={styles.uploadCard}>
                                            <input
                                                type="file"
                                                id="imageUpload2"
                                                accept="image/*"
                                                className={styles.fileInput}
                                                onChange={handleGalleryUpload}
                                            />
                                            <motion.label
                                                htmlFor="imageUpload2"
                                                className={styles.uploadOption}
                                                whileHover={{ y: -5 }}
                                            >
                                                <div className={styles.uploadIcon}>
                                                    <Upload className={styles.icon} />
                                                </div>
                                                <h3>اختر صورة من المعرض</h3>
                                                <p>اسحب الصورة هنا أو انقر للاختيار</p>
                                            </motion.label>
                                        </div>
                                    </div>
                                )}

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
                                        ) : detectedFoods.length > 0 && renderFoodResults(detectedFoods, false)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Manual Mode - Full Width */}
                    {activeMode === 'manual' && (
                        <div style={{ width: "100%" }}>
                            <div className={styles.expandedSection}>
                                <div className={styles.sectionHeader}>
                                    <h2>وصف الوجبة يدوياً</h2>
                                    <button
                                        onClick={() => setActiveMode(null)}
                                        className={styles.backButton}
                                    >
                                        <X size={20} />
                                        العودة للخيارات
                                    </button>
                                </div>

                                <div className={styles.manualInputSection}>
                                    <form onSubmit={handleManualAnalysis} className={styles.manualForm}>
                                        <div className={styles.inputGroup}>
                                            <label>وصف الوجبة</label>
                                            <textarea
                                                value={manualMealDescription}
                                                onChange={(e) => setManualMealDescription(e.target.value)}
                                                placeholder="اكتب وصف مفصل لوجبتك... مثال: طبق كبسة دجاج مع الأرز والخضار"
                                                className={styles.manualTextarea}
                                                rows={4}
                                                required
                                            />
                                        </div>

                                        {manualError && (
                                            <div className={styles.manualError}>
                                                {manualError}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className={styles.analyzeButton}
                                            disabled={isAnalyzingManual}
                                        >
                                            {isAnalyzingManual ? (
                                                <>
                                                    <Loader2 className={styles.spinnerIcon} size={16} />
                                                    جاري التحليل...
                                                </>
                                            ) : (
                                                <>
                                                    <Utensils size={16} />
                                                    حلل الوجبة
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Manual Analysis Results - will show automatically when API returns data */}
                                    {manualResults.length > 0 && (
                                        <div className={styles.manualResultsSection}>
                                            {renderFoodResults(manualResults, true)}
                                        </div>
                                    )}

                                    {/* History Display */}
                                    {manualHistory.length > 0 && (
                                        <div className={styles.manualHistoryCard}>
                                            <h4 className={styles.manualHistoryTitle}>الوجبات المحفوظة</h4>
                                            <ul className={styles.manualHistoryList}>
                                                {manualHistory.slice(-5).map((item, idx) => (
                                                    <li key={idx} className={styles.manualHistoryItem}>
                                                        <span className={styles.manualHistoryName}>
                                                            {item.name}
                                                        </span>
                                                        <span className={styles.manualHistoryPortion}>
                                                            {item.portion}
                                                        </span>
                                                        <span className={styles.manualHistoryType}>
                                                            {item.type}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <SaveModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSave}
                showWeightInput={saveModalType === 'image'}
                skipMealName={false} // ✅ allow entering name for both image and manual
                defaultMealName={getDefaultMealName()}
                defaultWeight={getTotalWeight()}
            />
        </div>
    );
}

export default App;