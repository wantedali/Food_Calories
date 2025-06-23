import styles from '../../assets/styles/SignIn.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, ArrowLeft, Eye, EyeOff, Coffee, Lock } from 'lucide-react';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const sliderImages = [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?q=80&w=1200&auto=format&fit=crop',
  ];

  const quotes = [
    { gold: "وجبتك بلقطة", white: "صحتك بخيارك" },
    { gold: "مطبخ الأصالة", white: "نكهات تراثية" },
    { gold: "لذة الطعام", white: "سر السعادة" },
    { gold: "طبق شهي", white: "لحياة صحية" },
  ];

  useEffect(() => {
    setIsVisible(true);

    setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 700);

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitBtn = document.querySelector(`.${styles.submitButton}`) as HTMLButtonElement;
    if (submitBtn) submitBtn.classList.add(styles.loading);

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5062/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (!response.ok) {
        setAlertMessage("فشل تسجيل الدخول: تحقق من البريد وكلمة المرور");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        console.log("Login successful:", result);
        if (rememberMe) {
          localStorage.setItem("token", result.token);
        }
        navigate("/Home");
      }
    } catch (err) {
      setAlertMessage("لقد أدخلت البريد الكتروني او كلمة السر بطريقة خاطئة");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      if (submitBtn) submitBtn.classList.remove(styles.loading);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      {/* Add this alert overlay */}
      {showAlert && (
        <div className={styles.alertOverlay}>
          <div className={styles.alert}>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}
      <div className={`${styles.leftSection} ${isVisible ? styles.fadeInRight : ''}`}>
        <div className={styles.slider}>
          {sliderImages.map((src, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentSlide ? styles.activeSlide : ''}`}
            >
              <img src={src} alt={`Middle Eastern Food ${index + 1}`} />
            </div>
          ))}
          <div className={styles.arabicStatement}>
            <span className={styles.goldText}>{quotes[currentSlide].gold}</span>
            <span className={styles.whiteText}>{quotes[currentSlide].white}</span>
          </div>
        </div>
        <div className={styles.sliderDots}>
          {sliderImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
      <div className={`${styles.rightSection} ${isVisible ? styles.fadeInLeft : ''}`}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <ChefHat size={24} />
              <span>لقمتي</span>
            </div>
            <button className={styles.backButton} onClick={() => navigate("/")}>
              <ArrowLeft size={20} />
            </button>
          </div>

          <h2 className={styles.formTitle}>مرحبا بك مرة أخرى!</h2>
          <p className={styles.formSubtitle}>سجل دخولك للاستمتاع بألذ الوجبات</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">البريد الإلكتروني</label>
              <div className={styles.inputWrapper}>
                <Coffee className={styles.inputIcon} size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="أدخل بريدك الإلكتروني"
                  ref={emailInputRef}
                  className={email ? styles.filledInput : ''}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">كلمة المرور</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="أدخل كلمة المرور"
                  className={password ? styles.filledInput : ''}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className={styles.checkmark}></span>
                  تذكرني
                </label>
              </div>
              <a href="#" className={styles.forgotPassword}>نسيت كلمة المرور؟</a>
            </div>

            <button type="submit" className={styles.submitButton} onClick={() => navigate("/home")}>
              <span className={styles.buttonText}>تسجيل الدخول</span>
              <span className={styles.loadingDots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </span>
            </button>


            <div className={styles.loginLink}>
              ليس لديك حساب؟ <a href="/SignUp">إنشاء حساب</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
