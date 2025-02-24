import React, { useState } from 'react';
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
}

const History: React.FC = () => {
  const [meals, setMeals] = useState<MealCard[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      name:"كيك",
      calories: 450,
      nutritionDetails: {
        protein: 25,
        carbs: 55,
        fats: 15
      }
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        name:"سلطة",
        calories: 450,
        nutritionDetails: {
          protein: 25,
          carbs: 55,
          fats: 15
        }
      },
      {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name:"سلطة",
        calories: 450,
        nutritionDetails: {
          protein: 25,
          carbs: 55,
          fats: 15
        }
      },
      {
        id: '4',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1698867575634-d39ef95fa6a7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name:"سلطة",
        calories: 450,
        nutritionDetails: {
          protein: 25,
          carbs: 55,
          fats: 15
        }
      }
  ]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
          <div className={styles.emptyState}>
            <h2 className={styles.emptyStateText}>
              لا توجد وجبات محسوبة
            </h2>
          </div>
        ) : (
          <motion.div 
            className={styles.grid}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            {meals.map((meal) => (
              <motion.div
                key={meal.id}
                className={styles.card}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div>
                  <img
                    src={meal.imageUrl}
                    alt="صورة الوجبة"
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.calories}>
                    <p> الوجبة: {meal.name}</p>
                    <p>السعرات الحرارية: {meal.calories}</p>
                  </div>

                  <div className={styles.buttonContainer}>
                    <button
                      onClick={() => handleDelete(meal.id)}
                      className={styles.button}
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => toggleExpand(meal.id)}
                      className={styles.button}
                    >
                      التفاصيل
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedId === meal.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.expandedContent}
                      >
                        <div className={styles.nutritionInfo}>
                          <p>البروتين: {meal.nutritionDetails.protein} جرام</p>
                          <p>الكربوهيدرات: {meal.nutritionDetails.carbs} جرام</p>
                          <p>الدهون: {meal.nutritionDetails.fats} جرام</p>
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