import React, { useState, useEffect, useRef } from 'react';
import styles from "../../src/assets/styles/Info.module.css";
import { useNavigate } from 'react-router-dom';

const signupData = JSON.parse(localStorage.getItem("signupData") || "{}");

interface UserInfo {
  age: number;
  weight: number;
  height: number;
  gender: number;
  bodyFat: number | null;
  activityLevel: number;
  goal: number;
  howFast: number;
  caloriesNum: number;
}

interface NumericSpinnerProps {
  value: number | null;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  label: string;
  optional?: boolean;
}

const NumericSpinner: React.FC<NumericSpinnerProps> = ({ value, onChange, min, max, step, unit, label, optional = false }) => {
  const [currentValue, setCurrentValue] = useState<number | null>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (newValue: number) => {
    const limitedValue = Math.max(min, Math.min(max, newValue));
    setCurrentValue(limitedValue);
    onChange(limitedValue);
  };

  const increment = () => {
    if (currentValue !== null) {
      handleChange(parseFloat((currentValue + step).toFixed(1)));
    } else {
      handleChange(min);
    }
  };

  const decrement = () => {
    if (currentValue !== null) {
      handleChange(parseFloat((currentValue - step).toFixed(1)));
    } else {
      handleChange(max);
    }
  };

  const startIncrement = () => {
    increment();
    timerRef.current = setInterval(increment, 200);
  };

  const startDecrement = () => {
    decrement();
    timerRef.current = setInterval(decrement, 200);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // useEffect(() => {
  //   console.log("Updated caloriesNum:", UserInfo.caloriesNum);
  // }, [UserInfo.caloriesNum]);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <div className={styles.spinnerContainer}>
      <label className={styles.spinnerLabel}>
        {label}
        {optional && <span className={styles.optionalLabel}> (اختياري)</span>}
      </label>
      <div className={styles.spinnerWrapper}>
        <button
          className={styles.spinnerButton}
          onMouseDown={startIncrement}
          onMouseUp={stopTimer}
          onMouseLeave={stopTimer}
          onTouchStart={startIncrement}
          onTouchEnd={stopTimer}
          aria-label="Increase value"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M7 14l5-5 5 5z" />
          </svg>
        </button>

        <div className={styles.spinnerValueContainer}>
          <input
            type="number"
            value={currentValue ?? ''}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            min={min}
            max={max}
            step={step}
            className={styles.spinnerInput}
          />
          <span className={styles.spinnerUnit}>{unit}</span>
        </div>

        <button
          className={styles.spinnerButton}
          onMouseDown={startDecrement}
          onMouseUp={stopTimer}
          onMouseLeave={stopTimer}
          onTouchStart={startDecrement}
          onTouchEnd={stopTimer}
          aria-label="Decrease value"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Info: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: 25,
    weight: 70,
    height: 170,
    gender: 0,
    bodyFat: 30,
    activityLevel: 1.2,
    goal: 1,
    howFast: 1,
    caloriesNum: 0,
  });

  const goalOptions = [
    { label: "زيادة الوزن", value: 2 }, // Gain = 2
    { label: "إنقاص الوزن", value: 0 }, // Lose = 0
    { label: "الحفاظ على الوزن الحالي", value: 1 }, // Maintain = 1
  ];

  const activityLevels = [
    { label: "خامل (Sedentary) - لا يوجد تمرين أو نشاط قليل جداً", value: 1.2 }, // 3.0 / 2.5 = 1.2
    { label: "نشاط خفيف (Lightly Active) - تمرين 1-3 أيام أسبوعياً", value: 1.4 }, // 3.5 / 2.5 = 1.4
    { label: "نشاط متوسط (Moderately Active) - تمرين 3-5 أيام أسبوعياً", value: 1.6 }, // 4.0 / 2.5 = 1.6
    { label: "نشاط عالي (Very Active) - تمرين 6-7 أيام أسبوعياً", value: 1.8 }, // 4.5 / 2.5 = 1.8
    { label: "نشاط شديد جداً (Super Active) - تمرين شاق جداً يومياً", value: 2.0 }, // 5.0 / 2.5 = 2.0
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'activityLevel') {
      const selected = activityLevels.find(level => level.label === value);
      if (selected) {
        setUserInfo(prev => ({
          ...prev,
          [name]: selected.value
        }));
      }
    } else if (name === 'goal') {
      const selected = goalOptions.find(option => option.label === value);
      if (selected) {
        setUserInfo(prev => ({
          ...prev,
          [name]: selected.value
        }));
      }
    } else {
      setUserInfo(prev => ({
        ...prev,
        [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value,
      }));
    }
  };
  const handleNumericChange = (field: keyof UserInfo) => (value: number) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else if (step === 6) {
      // When clicking next on Goal Question (step 6), submit the data
      await handleSubmit();
      // Then move to Calorie Target (step 7)
      setStep(7);
    } else {
      // When clicking next on Calorie Target (step 7), navigate to home
      navigate("/home");
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    console.log("caloriesNum updated:", userInfo.caloriesNum);
  }, [userInfo.caloriesNum]);

  // Add this useEffect to track caloriesNum changes
  useEffect(() => {
    console.log("caloriesNum updated:", userInfo.caloriesNum);
  }, [userInfo.caloriesNum]);

  // Update your handleSubmit function:
  const handleSubmit = async () => {
    const signupData = JSON.parse(localStorage.getItem("signupData") || "{}");

    const fullUserData = {
      userData: signupData,
      age: userInfo.age,
      weight: userInfo.weight,
      height: userInfo.height,
      gender: userInfo.gender,
      bodyFat: userInfo.bodyFat,
      activityLevel: userInfo.activityLevel,
      goal: userInfo.goal,
      howFast: userInfo.howFast
    };

    try {
      const response = await fetch("http://localhost:5062/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fullUserData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("API Response:", responseData);

        // Correct the path to calorieGoal based on your actual response structure
        const calorieGoal = responseData.calorieGoal || responseData.user?.calorieGoal;

        if (calorieGoal) {
          console.log("Updating caloriesNum with:", calorieGoal);
          setUserInfo(prev => ({
            ...prev,
            caloriesNum: calorieGoal
          }));
        }
      } else {
        console.error("Failed to register user");
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStepClass = (stepNumber: number) => {
    if (stepNumber === step) return `${styles.questionContainer} ${styles.active}`;
    if (stepNumber < step) return `${styles.questionContainer} ${styles.completed}`;
    return styles.questionContainer;
  };

  return (
    <div className={styles.questionsPage}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>رحلتك نحو صحة أفضل تبدأ هنا! </h1>
        <p className={styles.welcomeText}>ساعدنا في معرفة جسمك أكثر لنصمم لك خطة غذائية متكاملة تناسب احتياجاتك الفريدة.</p>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${((step + 1) / 8) * 100}%` }}></div>
      </div>

      <div className={styles.questionsSlider}>
        {/* Age Question */}
        <div className={getStepClass(0)}>
          <h2 className={styles.questionTitle}>كم عمرك؟</h2>
          <p className={styles.questionDescription}>
            العمر عامل مهم في تحديد احتياجاتك الغذائية اليومية
          </p>
          <NumericSpinner
            value={userInfo.age}
            onChange={handleNumericChange('age')}
            min={10}
            max={100}
            step={1}
            unit="سنة"
            label="العمر"
          />
        </div>

        {/* Weight Question */}
        <div className={getStepClass(1)}>
          <h2 className={styles.questionTitle}>ما هو وزنك الحالي؟</h2>
          <p className={styles.questionDescription}>
            معرفة وزنك يساعدنا في حساب احتياجاتك من السعرات الحرارية بدقة
          </p>
          <NumericSpinner
            value={userInfo.weight}
            onChange={handleNumericChange('weight')}
            min={30}
            max={250}
            step={0.1}
            unit="كجم"
            label="الوزن"
          />
        </div>

        {/* Height Question */}
        <div className={getStepClass(2)}>
          <h2 className={styles.questionTitle}>ما هو طولك؟</h2>
          <p className={styles.questionDescription}>
            الطول مع الوزن يساعدنا في حساب مؤشر كتلة الجسم
          </p>
          <NumericSpinner
            value={userInfo.height}
            onChange={handleNumericChange('height')}
            min={100}
            max={250}
            step={0.5}
            unit="سم"
            label="الطول"
          />
        </div>

        {/* Body Fat Question (Optional) */}
        <div className={getStepClass(3)}>
          <h2 className={styles.questionTitle}>ما هي نسبة الدهون في جسمك؟</h2>
          <p className={styles.questionDescription}>
            معرفة نسبة الدهون تساعد في تحديد خطة غذائية أكثر دقة
          </p>
          <NumericSpinner
            value={userInfo.bodyFat}
            onChange={handleNumericChange('bodyFat')}
            min={3}
            max={60}
            step={0.1}
            unit="%"
            label="نسبة الدهون"
            optional={true}
          />
        </div>

        {/* Activity Level Question */}
        <div className={getStepClass(4)}>
          <h2 className={styles.questionTitle}>ما هو مستوى نشاطك البدني؟</h2>
          <p className={styles.questionDescription}>
            يؤثر مستوى نشاطك على احتياجاتك اليومية من السعرات الحرارية
          </p>
          <div className={styles.selectContainer}>
            <select
              name="activityLevel"
              value={activityLevels.find(level => level.value === userInfo.activityLevel)?.label || ''}
              onChange={(e) => {
                const selected = activityLevels.find(level => level.label === e.target.value);
                if (selected) {
                  setUserInfo(prev => ({ ...prev, activityLevel: selected.value }));
                }
              }}
              className={styles.selectInput}
            >
              {activityLevels.map((level, index) => (
                <option key={index} value={level.label}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender Question */}
        <div className={getStepClass(5)}>
          <h2 className={styles.questionTitle}>ما هو جنسك؟</h2>
          <p className={styles.questionDescription}>
            الاحتياجات الغذائية تختلف بين الذكور والإناث
          </p>
          <div className={styles.radioButtons}>
            <label className={userInfo.gender === 0 ? `${styles.radioLabel} ${styles.selected}` : styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={userInfo.gender === 0}
                onChange={() => setUserInfo(prev => ({ ...prev, gender: 0 }))}
                className={styles.radioInput}
              />
              ذكر
            </label>
            <label className={userInfo.gender === 1 ? `${styles.radioLabel} ${styles.selected}` : styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={userInfo.gender === 1}
                onChange={() => setUserInfo(prev => ({ ...prev, gender: 1 }))}
                className={styles.radioInput}
              />
              أنثى
            </label>
          </div>
        </div>

        {/* Goal Question */}
        <div className={getStepClass(6)}>
          <h2 className={styles.questionTitle}>ما هو هدفك؟</h2>
          <p className={styles.questionDescription}>
            حدد هدفك لنساعدك في تحقيقه من خلال خطة غذائية مناسبة
          </p>
          <div className={styles.selectContainer}>
            <select
              name="goal"
              value={goalOptions.find(option => option.value === userInfo.goal)?.label || ''}
              onChange={(e) => {
                const selected = goalOptions.find(option => option.label === e.target.value);
                if (selected) {
                  setUserInfo(prev => ({ ...prev, goal: selected.value }));
                }
              }}
              className={styles.selectInput}
            >
              {goalOptions.map((option, index) => (
                <option key={index} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calorie Target */}
        <div className={getStepClass(7)}>
          <h2 className={styles.questionTitle}>هدف السعرات الحرارية اليومية</h2>
          <div className={styles.calorieTarget}>
            <p className={styles.calorieText}>
              بناءً على معلوماتك الشخصية وهدفك، نقترح عليك الاستهلاك اليومي التالي:
            </p>
            <div className={styles.calorieNumber}>
              {Math.floor(userInfo.caloriesNum)} سعرة حرارية
            </div>
            <p className={styles.calorieNote}>
              هذا تقدير مبدئي يعتمد على معدل الأيض الأساسي. قد تحتاج للتعديل حسب مستوى نشاطك اليومي وأهدافك الخاصة.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.navigationButtons}>
        {step > 0 && (
          <button className={styles.prevButton} onClick={handlePrev}>
            السابق
          </button>
        )}
        <button className={styles.nextButton} onClick={handleNext}>
          {step === 7 ? 'إنهاء' : 'التالي'}
        </button>
      </div>
    </div>
  );
};

export default Info;