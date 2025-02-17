import React, { useState , useEffect } from "react";
import Slider from "react-slick";
import styles from "../../assets/styles/SignUp.module.css";
import { Eye, ChefHat, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css"; 

const SignUp = () => {
  const navigate = useNavigate(); 
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true, 
      easing: "ease-in-out", 
    });
  }, []);

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <div className={styles.signUp} data-aos="fade-in">
      {/* Left Section with Slider */}
             <button className={styles.backButton} onClick={() => navigate("/")}>
                  <ArrowLeft className={styles.backIcon} />
              </button>
      <div className={styles.leftSection} data-aos="fade-right" data-aos-delay="200">
        <Slider {...settings}>
          <div>
            <img src="/images/falafel.jpg" alt="Falafel" />
          </div>
          <div>
            <img src="/images/hummus.jpg" alt="Hummus" />
          </div>
          <div>
            <img src="/images/kebab.jpg" alt="Kebab" />
          </div>
        </Slider>
             <div className={styles.imageOverlay}>
                <h2 className={styles.arabicTitle}>،وجبتك بلقطة</h2>
                <p className={styles.arabicSubtitle}>صحتك بخيارك</p>
            </div>
      </div>

      {/* Right Section with Form */}
      <div className={styles.rightSection} data-aos="fade-left" data-aos-delay="200">
      <div className={styles.logo}>
                <ChefHat className={styles.logoIcon} />
                <span className={styles.logoText}>لقمتي</span>
            </div>
        <div className={styles.header}>
          <h2 className={styles.title}>إنشاء حساب</h2>
          <p className={styles.subtext}>
            لديك حساب بالفعل؟{" "}
            <span className={styles.loginText}  onClick={() => navigate("/signin")}>تسجيل الدخول</span>
          </p>
        </div>

        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.lastNameContainer}>
              <input
                type="text"
                placeholder="الإسم الأخير"
                className={styles.lastNameInput}
              />
            </div>
            <div className={styles.firstNameContainer}>
              <input
                type="text"
                placeholder="الإسم الأول"
                className={styles.firstNameInput}
              />
            </div>
          </div>

          <div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className={styles.inputField}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="كلمة السر"
              className={styles.inputField}
            />
          </div>

          <div className={styles.checkboxContainer}>
            <input type="checkbox" id="terms" className={styles.checkbox} />
            <label htmlFor="terms" className={styles.shroot}>
              أوافق على الشروط والأحكام
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            إنشاء حساب
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;