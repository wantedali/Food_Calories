import React, { useState, useEffect } from 'react';
import { Trash2, UtensilsCrossed, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from '../assets/styles/MealTracking.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingScreen from "../components/LoadingScreen";

interface Meal {
  id: string;
  name: string;
  calories: number;
  portion: string;
  weight: number; // Add this line
}

interface MealSection {
  title: string;
  meals: Meal[];
  icon: React.ReactNode;
}

interface MealItemAPI {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weight: number; // Add this line
}

interface MealSectionAPI {
  items: MealItemAPI[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface DailyMealsAPI {
  id: string;
  userId: string | null;
  date: string;
  breakfast: MealSectionAPI;
  lunch: MealSectionAPI;
  dinner: MealSectionAPI;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface ApiResponse {
  daily: DailyMealsAPI;
}

function MealTrack() {
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mealSections, setMealSections] = useState<MealSection[]>([
    {
      title: 'وجبة الإفطار',
      meals: [],
      icon: <UtensilsCrossed className={styles.mealIcon} />,
    },
    {
      title: 'وجبة الغداء',
      meals: [],
      icon: <UtensilsCrossed className={styles.mealIcon} />,
    },
    {
      title: 'وجبة العشاء',
      meals: [],
      icon: <UtensilsCrossed className={styles.mealIcon} />,
    },
  ]);
  const [deletingMealId, setDeletingMealId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("لم يتم العثور على معرف المستخدم");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [userResponse, mealsResponse] = await Promise.all([
          fetch(`http://localhost:5062/api/users/getUser?id=${userId}`),
          fetch(`http://localhost:5062/api/Meals/Get-Meals?userId=${userId}`),
          new Promise(resolve => setTimeout(resolve, 1000)) // Minimum loading time
        ]);

        if (!userResponse.ok || !mealsResponse.ok) {
          throw new Error("فشل في جلب البيانات");
        }

        const [userData, mealsData]: [any, ApiResponse] = await Promise.all([
          userResponse.json(),
          mealsResponse.json()
        ]);

        setCalorieGoal(userData.calorieGoal);

        const transformedSections = [
          {
            title: 'وجبة الإفطار',
            meals: mealsData.daily.breakfast.items.map(item => ({
              id: item.id,
              name: item.name,
              calories: item.calories,
              portion: `${item.weight || 0} جرام`, // Use actual weight from API
              weight: item.weight || 0 // Store the numeric value
            })),
            icon: <UtensilsCrossed className={styles.mealIcon} />,
          },
          {
            title: 'وجبة الغداء',
            meals: mealsData.daily.lunch.items.map(item => ({
              id: item.id,
              name: item.name,
              calories: item.calories,
              portion: `${item.weight || 0} جرام`, // Use actual weight from API
              weight: item.weight || 0 // Store the numeric value
            })),
            icon: <UtensilsCrossed className={styles.mealIcon} />,
          },
          {
            title: 'وجبة العشاء',
            meals: mealsData.daily.dinner.items.map(item => ({
              id: item.id,
              name: item.name,
              calories: item.calories,
              portion: `${item.weight || 0} جرام`, // Use actual weight from API
              weight: item.weight || 0 // Store the numeric value
            })),
            icon: <UtensilsCrossed className={styles.mealIcon} />,
          }
        ];

        setMealSections(transformedSections);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ في جلب البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeMeal = async (sectionIndex: number, mealId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setAlertMessage("يجب تسجيل الدخول أولاً");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      setDeletingMealId(mealId);

      const mealTypes = ["Breakfast", "Lunch", "Dinner"];
      const mealType = mealTypes[sectionIndex];

      const response = await fetch(
        `http://localhost:5062/api/Meals/remove-food?userId=${userId}&mealType=${mealType}&foodId=${mealId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) throw new Error("Failed to delete meal");

      const result = await response.json();

      if (result.message === "Food removed") {
        setAlertMessage("تم حذف الوجبة بنجاح");
        setShowAlert(true);

        const updatedSections = [...mealSections];
        updatedSections[sectionIndex].meals = updatedSections[sectionIndex].meals.filter(
          meal => meal.id !== mealId
        );
        setMealSections(updatedSections);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error removing meal:", error);
      setAlertMessage("فشل في حذف الوجبة، يرجى المحاولة مرة أخرى");
      setShowAlert(true);
    } finally {
      setTimeout(() => {
        setShowAlert(false);
        setDeletingMealId(null);
      }, 3000);
    }
  };

  const calculateTotalCalories = () => {
    return mealSections.reduce((total, section) => {
      return total + section.meals.reduce((sectionTotal, meal) => sectionTotal + meal.calories, 0);
    }, 0);
  };

  const calculateSectionCalories = (meals: Meal[]) => {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.errorContainer}>
            <h2>حدث خطأ</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalCalories = calculateTotalCalories();
  const calorieGoalInt = Math.floor(calorieGoal ?? 0);
  const safeGoal = Math.max(calorieGoalInt, 1);
  const calorieProgress = Math.round((totalCalories / safeGoal) * 100);
  const remainingCalories = calorieGoalInt - totalCalories;
  const isExceeded = totalCalories > calorieGoalInt;

  const getProgressStatus = () => {
    if (isExceeded) {
      return {
        icon: <AlertTriangle className={styles.statusIcon} />,
        text: 'تم تجاوز الحد اليومي',
        className: styles.exceeded
      };
    } else if (calorieProgress >= 90) {
      return {
        icon: <AlertTriangle className={styles.statusIcon} />,
        text: 'قريب من الحد اليومي',
        className: styles.warning
      };
    } else if (calorieProgress >= 70) {
      return {
        icon: <Target className={styles.statusIcon} />,
        text: 'في المسار الصحيح',
        className: styles.onTrack
      };
    } else {
      return {
        icon: <CheckCircle className={styles.statusIcon} />,
        text: 'أداء ممتاز',
        className: styles.excellent
      };
    }
  };

  const progressStatus = getProgressStatus();

  return (
    <div className={styles.container}>
      <Navbar />
      <Sidebar />

      {/* Alert overlay */}
      {showAlert && (
        <div className={styles.alertOverlay}>
          <div className={styles.alert}>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>تتبع الوجبات اليومية</h1>
          <div className={styles.calorieTracker}>
            <div className={styles.totalCalories}>
              <span>إجمالي السعرات الحرارية اليوم:</span>
              <span className={styles.calorieNumber}>{totalCalories}</span>
              <span className={styles.calorieUnit}>كالوري</span>
            </div>

            <div className={styles.calorieLimit}>
              <div className={styles.limitInfo}>
                <span>الحد اليومي: {calorieGoalInt} كالوري</span>
                <span className={`${styles.remainingCalories} ${isExceeded ? styles.exceeded : ''}`}>
                  {isExceeded ? `زيادة: ${Math.abs(remainingCalories)}` : `متبقي: ${remainingCalories}`} كالوري
                </span>
              </div>

              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${isExceeded ? styles.exceededFill : ''}`}
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  ></div>
                  {isExceeded && (
                    <div
                      className={styles.exceededIndicator}
                      style={{ width: `${Math.min(calorieProgress - 100, 50)}%` }}
                    ></div>
                  )}
                </div>
                <span className={styles.progressPercentage}>
                  {Math.round(calorieProgress)}%
                </span>
              </div>

              <div className={`${styles.statusIndicator} ${progressStatus.className}`}>
                {progressStatus.icon}
                <span>{progressStatus.text}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionsGrid}>
          {mealSections.map((section, sectionIndex) => (
            <div key={section.title} className={styles.mealSection}>
              <div className={styles.sectionHeader}>
                {section.icon}
                <h2>{section.title}</h2>
                <div className={styles.sectionCalories}>
                  <span>{calculateSectionCalories(section.meals)}</span>
                  <span className={styles.calorieUnit}>كالوري</span>
                </div>
              </div>

              <div className={styles.mealsList}>
                {section.meals.map(meal => (
                  <div key={meal.id} className={styles.mealItem}>
                    <div className={styles.mealInfo}>
                      <h3>{meal.name}</h3>
                      <p>{meal.portion}</p>
                    </div>
                    <div className={styles.mealActions}>
                      <span className={styles.mealCalories}>{meal.calories} كالوري</span>
                      <button
                        onClick={() => removeMeal(sectionIndex, meal.id)}
                        className={styles.removeButton}
                        disabled={deletingMealId === meal.id}
                      >
                        {deletingMealId === meal.id ? 'جاري الحذف...' : <Trash2 size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MealTrack;