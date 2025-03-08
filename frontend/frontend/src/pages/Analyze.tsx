import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Image as ImageIcon,
    Loader2,
    Utensils,
    Save,
    Scale,
    Edit2,
    Plus,
    Minus,
    Camera
} from 'lucide-react';
import styles from '../assets/styles/Home.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

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
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });

        console.log("Camera Stream:", stream); // Debugging log

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
            };

            setIsCameraActive(true);
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("لم نتمكن من الوصول إلى الكاميرا. يرجى التحقق من الإذن.");
    }
};

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            
            tracks.forEach(track => {
                track.stop();
            });
            
            videoRef.current.srcObject = null;
            setIsCameraActive(false);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw video frame to canvas
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convert canvas to data URL
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                setImagePreview(imageDataUrl);
                
                // Stop camera
                stopCamera();
                
                // Process the image
                simulateAnalysis();
            }
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

    return (
        <div className={styles.container}>
            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
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
                    <div className={styles.optionsContainer}>
                        {/* Camera Option */}
                        <div className={styles.uploadCard}>
                            <motion.div
                                className={styles.uploadOption}
                                whileHover={{ y: -5 }}
                                onClick={startCamera}
                            >
                                <div className={styles.uploadIcon}>
                                    <Camera className={styles.icon} />
                                </div>
                                <h3>التقط صورة مباشرة</h3>
                                <p>استخدم الكاميرا لإلتقاط صورة لوجبتك</p>
                            </motion.div>
                        </div>

                        {/* Upload Option */}
                        <div className={styles.uploadCard}>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={handleImageUpload}
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
                                    animate={isHovered ? { y: [0, -5, 0] } : { y: 0 }}
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

                    {/* Camera View */}
                    {isCameraActive && (
                        <div className={styles.cameraContainer}>
                            <div className={styles.videoWrapper}>
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline
                                    className={styles.cameraVideo}
                                />
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </div>
                            <div className={styles.cameraControls}>
                                <button 
                                    className={styles.captureButton}
                                    onClick={captureImage}
                                >
                                    <div className={styles.captureButtonInner}></div>
                                </button>
                                <button 
                                    className={styles.cancelButton}
                                    onClick={stopCamera}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    )}

                    {imagePreview && !isCameraActive && (
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
                                                                <span className={styles.portionNumber}>{food.portionSize}</span>
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
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;