import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from "../assets/styles/History.module.css";

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingScreen from "../components/LoadingScreen";

interface NutritionDetails {
  protein: number;
  carbs: number;
  fats: number;
}

interface MealCard {
  id: string;
  imageUrl: string;
  name: string;
  calories: number;
  nutritionDetails: NutritionDetails;
  date?: string;
  mealSize: number;
}

const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?name=Meal&background=D4B675&color=1B2537&rounded=true&size=256"; // Or any SVG/beautiful placeholder

const History: React.FC = () => {
  const hasLogged = useRef(false);

  useEffect(() => {
    const fetchUserHistory = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5062/api/History/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();

        // Main meals (with image)
        const analysisMeals = data.analysisHistories.map((meal: any) => ({
          id: meal.id,
          imageUrl: `data:${meal.imageContentType};base64,${meal.imageBase64}`,
          name: meal.mealName,
          calories: meal.calories,
          nutritionDetails: {
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fat
          },
          mealSize: 0,
          date: "" // or use backend date if available
        }));

        setMeals(analysisMeals);

        // Manual meals (no image)
        const manual = data.histories.map((meal: any) => ({
          id: meal.id.timestamp.toString(), // or a unique fallback
          imageUrl: PLACEHOLDER_IMG,
          name: meal.mealName,
          calories: meal.calories,
          nutritionDetails: {
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fat
          },
          mealSize: meal.wieght ?? 0,
          date: new Date(meal.date).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        }));

        setManualMeals(manual);

      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    };

    fetchUserHistory();
  }, []);



  const [meals, setMeals] = useState<MealCard[]>([]);
  const [manualMeals, setManualMeals] = useState<MealCard[]>([]);


  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleDelete = (id: string, type: "main" | "manual") => {
    setIsDeleting(id);
    setTimeout(() => {
      if (type === "main") {
        setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
      } else {
        setManualMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
      }
      setIsDeleting(null);
    }, 300);
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (value: number) => ({
      width: `${value}%`,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  };

  // Card renderer (to avoid code duplication)
  const renderMealCard = (
    meal: MealCard,
    index: number,
    type: "main" | "manual"
  ) => (
    <motion.div
      key={meal.id}
      className={`${styles.card} ${isDeleting === meal.id ? styles.deleting : ''}`}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0 8px 30px rgba(212, 182, 117, 0.4)" }}
    >
      <div className={styles.cardImageContainer}>
        <img
          src={meal.imageUrl}
          alt={`صورة ${meal.name}`}
          className={styles.cardImage}
        />
        {meal.date && (
          <div className={styles.dateTag}>{meal.date}</div>
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.calories}>
          <h3 className={styles.mealName}>{meal.name}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className={styles.caloriesBadge}>
              <span className={styles.caloriesValue}>{meal.calories}</span>
              <span className={styles.caloriesUnit}>سعرة حرارية</span>
            </div>
            <div className={styles.gramsBadge}>
              <span className={styles.gramsValue}>{meal.mealSize}</span>
              <span className={styles.gramsUnit}>جم</span>
            </div>
          </div>
        </div>

        <div className={styles.macroSummary}>
          <div className={styles.macroItem}>
            <span className={styles.macroLabel}>بروتين</span>
            <span className={styles.macroValue}>{meal.nutritionDetails.protein}غ</span>
          </div>
          <div className={styles.macroItem}>
            <span className={styles.macroLabel}>كربوهيدرات</span>
            <span className={styles.macroValue}>{meal.nutritionDetails.carbs}غ</span>
          </div>
          <div className={styles.macroItem}>
            <span className={styles.macroLabel}>دهون</span>
            <span className={styles.macroValue}>{meal.nutritionDetails.fats}غ</span>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            onClick={() => handleDelete(meal.id, type)}
            className={`${styles.button} ${styles.deleteButton}`}
            aria-label="حذف الوجبة"
          >
            <span>حذف</span>
          </button>
          <button
            onClick={() => toggleExpand(meal.id)}
            className={`${styles.button} ${styles.detailsButton} ${expandedId === meal.id ? styles.active : ''}`}
            aria-label="عرض التفاصيل"
          >
            <span>{expandedId === meal.id ? 'إغلاق' : 'التفاصيل'}</span>
          </button>
        </div>
        <div className={styles.addToMealButtons}>
          <button className={styles.addToMealButton}>إضافة الي وجبة الفطار</button>
          <button className={styles.addToMealButton}>إضافة الي وجبة الغذاء</button>
          <button className={styles.addToMealButton}>إضافة الي وجبة العشاء</button>
        </div>

        <AnimatePresence>
          {expandedId === meal.id && (
            <motion.div
              ref={detailsRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.expandedContent}
            >
              <h4 className={styles.nutritionTitle}>التفاصيل الغذائية</h4>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutrientBar}>
                  <div className={styles.nutrientLabel}>
                    <span>البروتين</span>
                    <span>{meal.nutritionDetails.protein}غ</span>
                  </div>
                  <div className={styles.progressContainer}>
                    <motion.div
                      className={`${styles.progressBar} ${styles.proteinBar}`}
                      custom={meal.nutritionDetails.protein / (meal.nutritionDetails.protein + meal.nutritionDetails.carbs + meal.nutritionDetails.fats) * 100}
                      variants={progressVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </div>
                </div>

                <div className={styles.nutrientBar}>
                  <div className={styles.nutrientLabel}>
                    <span>الكربوهيدرات</span>
                    <span>{meal.nutritionDetails.carbs}غ</span>
                  </div>
                  <div className={styles.progressContainer}>
                    <motion.div
                      className={`${styles.progressBar} ${styles.carbsBar}`}
                      custom={meal.nutritionDetails.carbs / (meal.nutritionDetails.protein + meal.nutritionDetails.carbs + meal.nutritionDetails.fats) * 100}
                      variants={progressVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </div>
                </div>

                <div className={styles.nutrientBar}>
                  <div className={styles.nutrientLabel}>
                    <span>الدهون</span>
                    <span>{meal.nutritionDetails.fats}غ</span>
                  </div>
                  <div className={styles.progressContainer}>
                    <motion.div
                      className={`${styles.progressBar} ${styles.fatsBar}`}
                      custom={meal.nutritionDetails.fats / (meal.nutritionDetails.protein + meal.nutritionDetails.carbs + meal.nutritionDetails.fats) * 100}
                      variants={progressVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className={styles.container}>
      <Navbar />
      <Sidebar />

      <div className={styles.wrapper}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={styles.sectionHeader}
        >
          <h1 className={styles.mainHeading}>سجل وجباتك السابقة</h1>
          <p className={styles.subHeading}>راجع وجباتك واستكشف معلوماتك الغذائية</p>
        </motion.div>

        {meals.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.emptyStateContent}>
              <img
                src="/empty-plate.svg"
                alt="صحن فارغ"
                className={styles.emptyStateImage}
              />
              <h2 className={styles.emptyStateText}>
                لا توجد وجبات محسوبة حالياً
              </h2>
              <p className={styles.emptyStateSubtext}>
                ابدأ بإضافة وجباتك لمتابعة نظامك الغذائي
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className={styles.grid}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            {meals.map((meal, i) => renderMealCard(meal, i, "main"))}
          </motion.div>
        )}

        {/* Manually Added Section */}
        {manualMeals.length > 0 && (
          <>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={styles.sectionHeader}
              style={{ marginTop: "3rem" }}
            >
              <h2 className={styles.mainHeading} style={{ fontSize: "2rem" }}>سجلات مضافة يدويا</h2>
              <p className={styles.subHeading}>كل الوجبات التي أدخلتها بنفسك</p>
            </motion.div>
            <motion.div
              className={styles.grid}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
            >
              {manualMeals.map((meal, i) => renderMealCard(meal, i, "manual"))}
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;