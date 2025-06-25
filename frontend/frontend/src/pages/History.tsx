import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from "../assets/styles/History.module.css";

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

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
}

const History: React.FC = () => {
  const [meals, setMeals] = useState<MealCard[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      name: "كيك",
      calories: 450,
      date: "٢٣ فبراير ٢٠٢٥",
      nutritionDetails: {
        protein: 25,
        carbs: 55,
        fats: 15
      }
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      name: "سلطة خضراء",
      calories: 320,
      date: "٢٢ فبراير ٢٠٢٥",
      nutritionDetails: {
        protein: 18,
        carbs: 30,
        fats: 12
      }
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      name: "طبق خضروات",
      calories: 280,
      date: "٢١ فبراير ٢٠٢٥",
      nutritionDetails: {
        protein: 12,
        carbs: 45,
        fats: 8
      }
    },
    {
      id: '4',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1698867575634-d39ef95fa6a7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      name: "وجبة فواكه",
      calories: 180,
      date: "٢٠ فبراير ٢٠٢٥",
      nutritionDetails: {
        protein: 5,
        carbs: 100,
        fats: 25
      }
    }
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleDelete = (id: string) => {
    setIsDeleting(id);
    setTimeout(() => {
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
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
            {meals.map((meal) => (
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
                    <div className={styles.caloriesBadge}>
                      <span className={styles.caloriesValue}>{meal.calories}</span>
                      <span className={styles.caloriesUnit}>سعرة حرارية</span>
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
                      onClick={() => handleDelete(meal.id)}
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
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;