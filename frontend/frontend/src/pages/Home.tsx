import React, { useState } from 'react';
import {
    Upload,
    Image as ImageIcon,
    Loader2,
    Utensils,
    Save,
} from 'lucide-react';
import styles from '../assets/styles/Home.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function App() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<any>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        // Simulate AI processing
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisResults({
                calories: 450,
                carbs: 55,
                protein: 25,
                fats: 15,
                foodName: 'كبسة لحم',
                details: 'طبق سعودي تقليدي'
            });
        }, 3000);
    };

    return (
        <div className={styles.container}>
            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1>مرحباً بك في لوحة التحكم</h1>
                    <p>ابدأ بتحليل وجبتك للحصول على معلومات تغذية دقيقة</p>
                </div>

                <div className={styles.uploadSection}>
                    <div className={styles.uploadCard}>
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            className={styles.fileInput}
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="imageUpload" className={styles.uploadLabel}>
                            <div className={styles.uploadIcon}>
                                {imagePreview ? (
                                    <ImageIcon className={styles.icon} />
                                ) : (
                                    <Upload className={styles.icon} />
                                )}
                            </div>
                            <h3>التقط صورة لوجبتك أو حمّلها من المعرض</h3>
                            <p>اسحب الصورة هنا أو انقر للاختيار</p>
                        </label>
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
                            ) : analysisResults && (
                                <div className={styles.results}>
                                    <div className={styles.resultHeader}>
                                        <Utensils className={styles.resultIcon} />
                                        <h2>نتائج التحليل</h2>
                                    </div>

                                    <div className={styles.foodName}>
                                        <h3>يبدو أنك تأكل</h3>
                                        <p>{analysisResults.foodName}</p>
                                        <span>{analysisResults.details}</span>
                                    </div>

                                    <div className={styles.nutritionGrid}>
                                        <div className={styles.nutritionItem}>
                                            <h4>السعرات الحرارية</h4>
                                            <p>{analysisResults.calories} كالوري</p>
                                        </div>
                                        <div className={styles.nutritionItem}>
                                            <h4>الكربوهيدرات</h4>
                                            <p>{analysisResults.carbs} جرام</p>
                                        </div>
                                        <div className={styles.nutritionItem}>
                                            <h4>البروتين</h4>
                                            <p>{analysisResults.protein} جرام</p>
                                        </div>
                                        <div className={styles.nutritionItem}>
                                            <h4>الدهون</h4>
                                            <p>{analysisResults.fats} جرام</p>
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
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;