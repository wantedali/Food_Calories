import React from 'react';
import { ChefHat, Home, Camera, History, Book, Lightbulb, Settings, Utensils, Calendar, TrendingUp, Clock, Repeat, Beef, Heading as Bread, Locate as Avocado } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from '../assets/styles/Home.module.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useRef, useEffect, useState } from 'react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {

  const name = localStorage.getItem("name");
  console.log(name);

  // Mock user data - in a real app, this would come from your auth system
  const userData = {
    name: name,
    greeting: 'صباح الخير' // Change based on time of day
  };

  // Mock data for demonstration
  const dashboardData = {
    totalMeals: 47,
    averageCalories: 2150,
    mostFrequentFood: 'كبسة لحم',
    lastMeal: {
      name: 'شاورما دجاج',
      calories: 450,
      time: 'منذ ساعتين'
    },
    macronutrients: {
      protein: 30,
      carbs: 45,
      fats: 25
    }
  };

  // Chart configuration
  const chartData = {
    labels: ['البروتين', 'الكربوهيدرات', 'الدهون'],
    datasets: [
      {
        data: [
          dashboardData.macronutrients.protein,
          dashboardData.macronutrients.carbs,
          dashboardData.macronutrients.fats
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

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Add Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>{userData.greeting}، {userData.name}</h1>
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
                <span className={styles.number}>{dashboardData.totalMeals}</span>
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
                <span className={styles.number}>{dashboardData.averageCalories}</span>
                <span className={styles.unit}>كالوري</span>
              </div>
              <p className={styles.cardSubtext}>خلال آخر ٣٠ يوم</p>
            </div>
          </div>

          {/* Most Frequent Food Card */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardIcon}>
              <Repeat className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3>الوجبة الأكثر تكراراً</h3>
              <div className={styles.cardValue}>
                <span className={styles.foodName}>{dashboardData.mostFrequentFood}</span>
              </div>
              <p className={styles.cardSubtext}>تم تناولها ١٢ مرة</p>
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
                <span className={styles.foodName}>{dashboardData.lastMeal.name}</span>
                <span className={styles.calories}>{dashboardData.lastMeal.calories} كالوري</span>
              </div>
              <p className={styles.cardSubtext}>{dashboardData.lastMeal.time}</p>
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
                  <p>{dashboardData.macronutrients.protein}%</p>
                </div>
              </div>
              <div className={styles.macronutrientItem} style={{ backgroundColor: 'rgba(139, 94, 52, 0.1)' }}>
                <div className={styles.macronutrientIcon}>
                  <Bread className={styles.icon} />
                </div>
                <div className={styles.macronutrientInfo}>
                  <h3>الكربوهيدرات</h3>
                  <p>{dashboardData.macronutrients.carbs}%</p>
                </div>
              </div>
              <div className={styles.macronutrientItem} style={{ backgroundColor: 'rgba(193, 120, 23, 0.1)' }}>
                <div className={styles.macronutrientIcon}>
                  <Avocado className={styles.icon} />
                </div>
                <div className={styles.macronutrientInfo}>
                  <h3>الدهون</h3>
                  <p>{dashboardData.macronutrients.fats}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;