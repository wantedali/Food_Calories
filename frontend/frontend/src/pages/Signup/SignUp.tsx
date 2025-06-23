import styles from '../../assets/styles/SignUp.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, ArrowLeft, Eye, EyeOff, User, Coffee, Lock } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const sliderImages = [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?q=80&w=1200&auto=format&fit=crop',
  ];

  const quotes = [
    {
      gold: "مطبخ الأصالة",
      white: "نكهات تراثية"
    },
    {
      gold: "لذة الطعام",
      white: "سر السعادة"
    },
    {
      gold: "وجبتك بلقطة",
      white: "صحتك بخيارك"
    },
    {
      gold: "طبق شهي",
      white: "لحياة صحية"
    }
  ];

  useEffect(() => {
    setIsVisible(true);

    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 700);

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);


  const isPasswordValid = (password: string) => {
    const lengthCheck = password.length >= 8;
    const upperCaseCheck = /[A-Z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lengthCheck && upperCaseCheck && numberCheck && specialCharCheck;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      setAlertMessage("يرجى الموافقة على الشروط والأحكام");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setAlertMessage("يرجى تعبئة جميع الحقول");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("كلمة المرور غير متطابقة");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!isPasswordValid(password)) {
      setAlertMessage("يجب أن تكون كلمة المرور 8 أحرف على الأقل، وتحتوي على حرف كبير، رقم، وحرف خاص");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5062/api/users/EmailValidation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        setAlertMessage("هذا الحساب موجود بالفعل");
        console.log(response)
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      const submitBtn = document.querySelector(`.${styles.submitButton}`) as HTMLButtonElement;
      if (submitBtn) {
        submitBtn.classList.add(styles.loading);
        setTimeout(() => {
          submitBtn.classList.remove(styles.loading);

          localStorage.setItem("signupData", JSON.stringify({
            name: name,
            email: email,
            password: password
          }));

          navigate("/info");

          console.log({ name, email, password, confirmPassword, agreeToTerms });
        }, 1500);
      }
    } catch (error) {
      setAlertMessage("فشل في الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>

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

          <h2 className={styles.formTitle}>انضم إلينا اليوم!</h2>
          <p className={styles.formSubtitle}> انشأ حسابك واكتشف عالم من النكهات</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">الاسم الكامل</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={18} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="أدخل اسمك الكامل"
                  ref={nameInputRef}
                  className={name ? styles.filledInput : ''}
                />
              </div>
            </div>

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

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="أعد إدخال كلمة المرور"
                  className={confirmPassword ? styles.filledInput : ''}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.termsCheck}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                />
                <span className={styles.checkmark}></span>
                أوافق على <a href="#" onClick={(e) => e.preventDefault()} className={styles.termsLink}>الشروط والأحكام</a>
              </label>
            </div>

            <button type="submit" className={styles.submitButton}>
              <span className={styles.buttonText}>إنشاء حساب</span>
              <span className={styles.loadingDots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </span>
            </button>

            <div className={styles.loginLink}>
              لديك حساب بالفعل؟ <a href="/SignIn">تسجيل الدخول</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;