import React, { useState, useEffect, useRef } from 'react';
import styles from "../../src/assets/styles/Info.module.css";
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  age: number;
  weight: number;
  height: number;
  gender: string;
  bodyFat: number | null;
  activityLevel: string;
  goal: string;
  dailyCalorieTarget: number;
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
    gender: '',
    bodyFat: 30,
    activityLevel: 'sedentary',
    goal: 'maintain',
    dailyCalorieTarget: 2000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value,
    }));
  };

  const handleNumericChange = (field: keyof UserInfo) => (value: number) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleSubmit();
      navigate("/home")
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting user info:', userInfo);
  };

  const getStepClass = (stepNumber: number) => {
    if (stepNumber === step) return `${styles.questionContainer} ${styles.active}`;
    if (stepNumber < step) return `${styles.questionContainer} ${styles.completed}`;
    return styles.questionContainer;
  };

  return (
    <div className={styles.questionsPage}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>مرحباً بك في لوحة التحكم</h1>
        <p className={styles.welcomeText}>ابدأ بتحليل وجبتك للحصول على معلومات تغذية دقيقة</p>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${(step / 7) * 100}%` }}></div>
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
              value={userInfo.activityLevel} 
              onChange={handleInputChange}
              className={styles.selectInput}
            >
              <option value="sedentary">خامل (Sedentary) - لا يوجد تمرين أو نشاط قليل جداً</option>
              <option value="lightly">نشاط خفيف (Lightly Active) - تمرين 1-3 أيام أسبوعياً</option>
              <option value="moderately">نشاط متوسط (Moderately Active) - تمرين 3-5 أيام أسبوعياً</option>
              <option value="very">نشاط عالي (Very Active) - تمرين 6-7 أيام أسبوعياً</option>
              <option value="super">نشاط شديد جداً (Super Active) - تمرين شاق جداً يومياً</option>
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
            <label className={userInfo.gender === 'Male' ? `${styles.radioLabel} ${styles.selected}` : styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={userInfo.gender === 'Male'}
                onChange={handleInputChange}
                className={styles.radioInput}
              />
              ذكر
            </label>
            <label className={userInfo.gender === 'Female' ? `${styles.radioLabel} ${styles.selected}` : styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={userInfo.gender === 'Female'}
                onChange={handleInputChange}
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
              value={userInfo.goal} 
              onChange={handleInputChange}
              className={styles.selectInput}
            >
              <option value="gain">زيادة الوزن</option>
              <option value="lose">إنقاص الوزن</option>
              <option value="maintain">الحفاظ على الوزن الحالي</option>
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
              {userInfo.dailyCalorieTarget} سعرة حرارية
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