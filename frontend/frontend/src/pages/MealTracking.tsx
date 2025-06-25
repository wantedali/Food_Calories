import React, { useState } from 'react';
import { Plus, Trash2, UtensilsCrossed, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from '../assets/styles/MealTracking.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface Meal {
  id: string;
  name: string;
  calories: number;
  portion: string;
}

interface MealSection {
  title: string;
  meals: Meal[];
  icon: React.ReactNode;
}

const sampleMeals = [
  { name: 'كبسة لحم', calories: 650, portion: '300 جرام' },
  { name: 'شاورما دجاج', calories: 450, portion: '250 جرام' },
  { name: 'مندي لحم', calories: 550, portion: '350 جرام' },
  { name: 'برجر دجاج', calories: 380, portion: '180 جرام' },
  { name: 'مجبوس سمك', calories: 420, portion: '280 جرام' },
  { name: 'مضغوط لحم', calories: 580, portion: '320 جرام' },
  { name: 'رز بخاري', calories: 320, portion: '200 جرام' },
  { name: 'مشاوي مشكل', calories: 750, portion: '400 جرام' },
  { name: 'سلطة عربية', calories: 120, portion: '150 جرام' },
  { name: 'حمص', calories: 250, portion: '200 جرام' },
];

function MealTrack() {
  // Daily calorie limit (this would normally come from user profile/settings)
  const dailyCalorieLimit = 2200;

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

  const addRandomMeal = (sectionIndex: number) => {
    const randomMeal = sampleMeals[Math.floor(Math.random() * sampleMeals.length)];
    const updatedSections = [...mealSections];
    updatedSections[sectionIndex].meals.push({
      id: Date.now().toString(),
      ...randomMeal
    });

    setMealSections(updatedSections);
  };

  const removeMeal = (sectionIndex: number, mealId: string) => {
    const updatedSections = [...mealSections];
    updatedSections[sectionIndex].meals = updatedSections[sectionIndex].meals.filter(
      meal => meal.id !== mealId
    );
    setMealSections(updatedSections);
  };

  const calculateTotalCalories = () => {
    return mealSections.reduce((total, section) => {
      return total + section.meals.reduce((sectionTotal, meal) => sectionTotal + meal.calories, 0);
    }, 0);
  };

  const calculateSectionCalories = (meals: Meal[]) => {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  };

  const totalCalories = calculateTotalCalories();
  const calorieProgress = (totalCalories / dailyCalorieLimit) * 100;
  const remainingCalories = dailyCalorieLimit - totalCalories;
  const isExceeded = totalCalories > dailyCalorieLimit;

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
                <span>الحد اليومي: {dailyCalorieLimit} كالوري</span>
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
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addRandomMeal(sectionIndex)}
                className={styles.addButton}
              >
                <Plus size={20} />
                إضافة وجبة
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MealTrack;