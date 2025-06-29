import React, { useState, useEffect } from 'react';
import { ChefHat, Utensils, TrendingUp, Repeat, Clock, Beef, Heading as Bread, Locate as Avocado } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from '../assets/styles/Home.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingScreen from "../components/LoadingScreen";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({});

  interface DashboardData {
    mostFrequentFood?: string;  // Add ? to make it optional
    macronutrients?: {
      protein: number;
      carbs: number;
      fats: number;
    };
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5062/api/users/getUser?id=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);

        // Calculate macronutrient percentages
        const totalMacros = data.todayMeals.totalProtein + data.todayMeals.totalCarbs + data.todayMeals.totalFat;
        const proteinPercentage = Math.round((data.todayMeals.totalProtein / totalMacros) * 100);
        const carbsPercentage = Math.round((data.todayMeals.totalCarbs / totalMacros) * 100);
        const fatsPercentage = Math.round((data.todayMeals.totalFat / totalMacros) * 100);

        setDashboardData(prev => ({
          ...prev,
          macronutrients: {
            protein: proteinPercentage,
            carbs: carbsPercentage,
            fats: fatsPercentage
          }
        }));

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  if (!userData) {
    return null;
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  };

  // Get last meal time
  const getLastMealTime = () => {
    if (!userData.todayMeals) return 'لا توجد وجبات اليوم';

    const meals = [
      ...userData.todayMeals.breakfast.items,
      ...userData.todayMeals.lunch.items,
      ...userData.todayMeals.dinner.items
    ];

    if (meals.length === 0) return 'لا توجد وجبات اليوم';

    const lastMeal = meals.reduce((latest, meal) => {
      // Assuming meal has a timestamp property - adjust based on your actual data structure
      return latest; // Simplified - you might need to compare dates
    }, meals[0]);

    return 'الأخيرة'; // Simplified - implement actual time difference calculation
  };

  // Chart configuration
  const chartData = {
    labels: ['البروتين', 'الكربوهيدرات', 'الدهون'],
    datasets: [
      {
        data: [
          dashboardData.macronutrients?.protein || 0,
          dashboardData.macronutrients?.carbs || 0,
          dashboardData.macronutrients?.fats || 0
        ],
        backgroundColor: ['#D4B675', '#8B5E34', '#C17817'],
        borderColor: ['rgba(212, 182, 117, 0.2)', 'rgba(139, 94, 52, 0.2)', 'rgba(193, 120, 23, 0.2)'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const getMostFrequentCategory = () => {
    if (!userData?.todayMeals) return 'غير متاح';

    const meals = [
      ...userData.todayMeals.breakfast.items,
      ...userData.todayMeals.lunch.items,
      ...userData.todayMeals.dinner.items
    ];

    if (meals.length === 0) return 'لا توجد وجبات';

    // Calculate totals
    const totals = meals.reduce((acc, meal) => {
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    // Determine dominant category
    const max = Math.max(totals.protein, totals.carbs, totals.fat);

    if (max === totals.protein) return 'غني بالبروتين';
    if (max === totals.carbs) return 'غني بالكربوهيدرات';
    return 'غني بالدهون';
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Sidebar />

      <main className={styles.mainContent}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>{getGreeting()}، {userData.name}</h1>
            <p className={styles.welcomeSubtitle}>نتمنى لك يوماً صحياً ومليئاً بالطاقة</p>
          </div>
          <div className={styles.welcomeDecoration}>
            <ChefHat className={styles.welcomeIcon} />
          </div>
        </div>

        <div className={styles.pageHeader}>
          <h1>لوحة المعلومات</h1>
          <p>نظرة عامة على نشاطك الغذائي</p>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Total Meals Card */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardIcon}>
              <Utensils className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3>إجمالي الوجبات</h3>
              <div className={styles.cardValue}>
                <span className={styles.number}>
                  {userData.todayMeals ?
                    userData.todayMeals.breakfast.items.length +
                    userData.todayMeals.lunch.items.length +
                    userData.todayMeals.dinner.items.length : 0}
                </span>
                <span className={styles.unit}>وجبة</span>
              </div>
              <p className={styles.cardSubtext}>تم تحليلها حتى الآن</p>
            </div>
          </div>

          {/* Average Calories Card */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardIcon}>
              <TrendingUp className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3>متوسط السعرات اليومية</h3>
              <div className={styles.cardValue}>
                <span className={styles.number}>{Math.round(userData.calorieGoal)}</span>
                <span className={styles.unit}>كالوري</span>
              </div>
              <p className={styles.cardSubtext}>الهدف اليومي</p>
            </div>
          </div>

          {/* Most Frequent Food Card*/}
          <div className={styles.dashboardCard}>
            <div className={styles.cardIcon}>
              <Repeat className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3>النمط الغذائي اليوم</h3>
              <div className={styles.cardValue}>
                <span className={styles.foodName}>
                  {getMostFrequentCategory()}
                </span>
              </div>
              <p className={styles.cardSubtext}>
                {userData?.todayMeals ?
                  `بناءً على ${userData.todayMeals.breakfast.items.length +
                  userData.todayMeals.lunch.items.length +
                  userData.todayMeals.dinner.items.length} وجبة` :
                  'لا توجد بيانات'}
              </p>
            </div>
          </div>

          {/* Last Analyzed Meal Card */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardIcon}>
              <Clock className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3>آخر وجبة تم تحليلها</h3>
              <div className={styles.cardValue}>
                {userData.todayMeals && (
                  <>
                    <span className={styles.foodName}>
                      {userData.todayMeals.dinner.items.length > 0 ?
                        userData.todayMeals.dinner.items[0].name :
                        userData.todayMeals.lunch.items.length > 0 ?
                          userData.todayMeals.lunch.items[0].name :
                          userData.todayMeals.breakfast.items.length > 0 ?
                            userData.todayMeals.breakfast.items[0].name :
                            'لا توجد وجبات'}
                    </span>
                    <span className={styles.calories}>
                      {userData.todayMeals.dinner.items.length > 0 ?
                        `${userData.todayMeals.dinner.items[0].calories} كالوري` :
                        userData.todayMeals.lunch.items.length > 0 ?
                          `${userData.todayMeals.lunch.items[0].calories} كالوري` :
                          userData.todayMeals.breakfast.items.length > 0 ?
                            `${userData.todayMeals.breakfast.items[0].calories} كالوري` :
                            ''}
                    </span>
                  </>
                )}
              </div>
              <p className={styles.cardSubtext}>{getLastMealTime()}</p>
            </div>
          </div>
        </div>

        {/* Macronutrients Chart Section */}
        <div className={styles.macronutrientsSection}>
          <h2>توزيع العناصر الغذائية اليوم</h2>
          <div className={styles.macronutrientsContent}>
            <div className={styles.chartContainer}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className={styles.macronutrientsList}>
              <div className={styles.macronutrientItem} style={{ backgroundColor: 'rgba(212, 182, 117, 0.1)' }}>
                <div className={styles.macronutrientIcon}>
                  <Beef className={styles.icon} />
                </div>
                <div className={styles.macronutrientInfo}>
                  <h3>البروتين</h3>
                  <p>{dashboardData.macronutrients?.protein || 0}%</p>
                </div>
              </div>
              <div className={styles.macronutrientItem} style={{ backgroundColor: 'rgba(139, 94, 52, 0.1)' }}>
                <div className={styles.macronutrientIcon}>
                  <Bread className={styles.icon} />
                </div>
                <div className={styles.macronutrientInfo}>
                  <h3>الكربوهيدرات</h3>
                  <p>{dashboardData.macronutrients?.carbs || 0}%</p>
                </div>
              </div>
              <div className={styles.macronutrientItem} style={{ backgroundColor: 'rgba(193, 120, 23, 0.1)' }}>
                <div className={styles.macronutrientIcon}>
                  <Avocado className={styles.icon} />
                </div>
                <div className={styles.macronutrientInfo}>
                  <h3>الدهون</h3>
                  <p>{dashboardData.macronutrients?.fats || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;