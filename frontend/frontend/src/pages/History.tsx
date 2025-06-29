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

interface AddMealRequest {
  userId: string;
  typeOfMeal: "Breakfast" | "Lunch" | "Dinner";
  food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    weight: number; // Add this line
  };
}


const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?name=Meal&background=D4B675&color=1B2537&rounded=true&size=256";

const History: React.FC = () => {
  const [meals, setMeals] = useState<MealCard[]>([]);
  const [manualMeals, setManualMeals] = useState<MealCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [activeMealButton, setActiveMealButton] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserHistory = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5062/api/History/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();

        const analysisMeals = data.analysisHistories.map((meal: any) => ({
          id: meal.id,
          imageUrl: meal.imageBase64
            ? `data:${meal.imageContentType || 'image/jpeg'};base64,${meal.imageBase64}`
            : PLACEHOLDER_IMG,
          name: meal.mealName || "وجبة غير معروفة",
          calories: meal.calories ?? 0,
          nutritionDetails: {
            protein: meal.protein ?? 0,
            carbs: meal.carbs ?? 0,
            fats: meal.fat ?? 0,
          },
          mealSize: meal.wieght ?? 0,
          date: meal.date
            ? new Date(meal.date).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
            : ""
        }));

        setMeals(analysisMeals);

        const manual = data.histories.map((meal: any) => ({
          id: meal.id,
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  const handleDelete = async (id: string, type: "main" | "manual") => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const deleteType = type === "main" ? "Meal" : "manualMeal";
    setIsDeleting(id);

    try {
      const response = await fetch(`http://localhost:5062/api/History/remove-history?userId=${userId}&historyId=${id}&type=${deleteType}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete history item");

      const result = await response.text();

      if (result.includes("successfully")) {
        console.log("✅ success");
        setAlertMessage("تم حذف الوجبة من السجل بنجاح");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);

        if (type === "main") {
          setMeals(prev => prev.filter(m => m.id !== id));
        } else {
          setManualMeals(prev => prev.filter(m => m.id !== id));
        }
      } else {
        console.warn("⚠️ Unexpected response:", result);
        setAlertMessage("فشل في حذف الوجبة الرجاء إعادة المحاولة");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("❌ Error deleting item:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddToMeal = async (meal: MealCard, mealType: "Breakfast" | "Lunch" | "Dinner") => {
    const buttonId = `${meal.id}-${mealType}`;
    setActiveMealButton(buttonId);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setAlertMessage("يجب تسجيل الدخول أولاً");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const request: AddMealRequest = {
        userId,
        typeOfMeal: mealType,
        food: {
          name: meal.name,
          calories: meal.calories,
          protein: meal.nutritionDetails.protein,
          carbs: meal.nutritionDetails.carbs,
          fat: meal.nutritionDetails.fats,
          weight: meal.mealSize // Add the weight from the meal card
        }
      };

      const response = await fetch('http://localhost:5062/api/Meals/AddMeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) throw new Error("Failed to add meal");

      const result = await response.json();

      if (result.message === "food added") {
        setAlertMessage(`تم إضافة الوجبة إلى ${mealType === "Breakfast" ? "الفطور" : mealType === "Lunch" ? "الغداء" : "العشاء"} بنجاح`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      setAlertMessage("فشل إضافة الوجبة، يرجى المحاولة مرة أخرى");  
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setActiveMealButton(null);
    }
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

  const renderMealCard = (meal: MealCard, index: number, type: "main" | "manual") => (
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
        <img src={meal.imageUrl} alt={`صورة ${meal.name}`} className={styles.cardImage} />
        {meal.date && <div className={styles.dateTag}>{meal.date}</div>}
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
          <button onClick={() => handleDelete(meal.id, type)} className={`${styles.button} ${styles.deleteButton}`}>
            حذف
          </button>
          <button
            onClick={() => toggleExpand(meal.id)}
            className={`${styles.button} ${styles.detailsButton} ${expandedId === meal.id ? styles.active : ''}`}
          >
            {expandedId === meal.id ? 'إغلاق' : 'التفاصيل'}
          </button>
        </div>

        <div className={styles.addToMealButtons}>
          <button
            className={`${styles.addToMealButton} ${activeMealButton === `${meal.id}-Breakfast` ? styles.buttonLoading : ''
              }`}
            onClick={() => handleAddToMeal(meal, "Breakfast")}
            disabled={activeMealButton === `${meal.id}-Breakfast`}
          >
            {activeMealButton === `${meal.id}-Breakfast` ? (
              <>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
              </>
            ) : (
              "إضافة الي وجبة الفطار"
            )}
          </button>

          <button
            className={`${styles.addToMealButton} ${activeMealButton === `${meal.id}-Lunch` ? styles.buttonLoading : ''
              }`}
            onClick={() => handleAddToMeal(meal, "Lunch")}
            disabled={activeMealButton === `${meal.id}-Lunch`}
          >
            {activeMealButton === `${meal.id}-Lunch` ? (
              <>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
              </>
            ) : (
              "إضافة الي وجبة الغذاء"
            )}
          </button>

          <button
            className={`${styles.addToMealButton} ${activeMealButton === `${meal.id}-Dinner` ? styles.buttonLoading : ''
              }`}
            onClick={() => handleAddToMeal(meal, "Dinner")}
            disabled={activeMealButton === `${meal.id}-Dinner`}
          >
            {activeMealButton === `${meal.id}-Dinner` ? (
              <>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
              </>
            ) : (
              "إضافة الي وجبة العشاء"
            )}
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
                {["protein", "carbs", "fats"].map((key) => {
                  const label = key === "protein" ? "البروتين" : key === "carbs" ? "الكربوهيدرات" : "الدهون";
                  const value = meal.nutritionDetails[key as keyof NutritionDetails];
                  const percent = value / (meal.nutritionDetails.protein + meal.nutritionDetails.carbs + meal.nutritionDetails.fats) * 100;
                  const barClass = key === "protein" ? styles.proteinBar : key === "carbs" ? styles.carbsBar : styles.fatsBar;

                  return (
                    <div key={key} className={styles.nutrientBar}>
                      <div className={styles.nutrientLabel}>
                        <span>{label}</span>
                        <span>{value}غ</span>
                      </div>
                      <div className={styles.progressContainer}>
                        <motion.div
                          className={`${styles.progressBar} ${barClass}`}
                          custom={percent}
                          variants={progressVariants}
                          initial="hidden"
                          animate="visible"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.container}>
      {/* Add this alert overlay */}

      {showAlert && (
        <div className={styles.alertOverlay}>
          <div className={styles.alert}>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      <Navbar />
      <Sidebar />

      <div className={styles.wrapper}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
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
              <h2 className={styles.emptyStateText}>لا توجد وجبات محسوبة حالياً</h2>
              <p className={styles.emptyStateSubtext}>ابدأ بإضافة وجباتك لمتابعة نظامك الغذائي</p>
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
