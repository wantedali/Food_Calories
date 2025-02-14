import React from "react";
import styles from "../../assets/styles/SignUp.module.css";

const SignUp = () => {
  return (
    <div className={styles.signUp}>
      {/* Left Side (Coffee Image) */}
      <div className={styles.leftSection}>
        <div className={styles.coffeeText}>
          <p>وجبتك بلقطة، صحتك بخيارك</p>
          <div className={styles.indicators}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.activeDot}></span>
          </div>
        </div>
      </div>

      {/* Right Side (Form Section) */}
      <div className={styles.rightSection}>
        <div className={styles.header}>
          <h2 className={styles.title}>إنشاء حساب</h2>
          <p className={styles.subtext}>
            لديك حساب بالفعل؟ <span className={styles.loginText}>تسجيل الدخول</span>
          </p>
        </div>

        {/* Form */}
        <form className={styles.form}>
          {/* First Name & Last Name (Aligned Properly) */}
<div className={styles.row}>
    {/* First Name - Right Side */}
<div className={styles.row}>
    {/* Last Name - Left Side */}
    <div className={styles.lastNameContainer}>
        <label className={styles.label}>الإسم الأخير</label>
        <input type="text" placeholder="الإسم الأخير" className={styles.lastNameInput} />
    </div>

    {/* First Name - Right Side */}
    <div className={styles.firstNameContainer}>
        <label className={styles.label}>الإسم الأول</label>
        <input type="text" placeholder="الإسم الأول" className={styles.firstNameInput} />
    </div>
</div>
</div>

          {/* Email Field */}
          <div className={styles.inputContainer}>
            <label className={styles.label}>البريد الإلكتروني</label>
            <input type="email" placeholder="البريد الإلكتروني" className={styles.inputField} />
          </div>

          {/* Password Field */}
          <div className={styles.inputContainer}>
            <label className={styles.label}>كلمة السر</label>
            <input type="password" placeholder="كلمة السر" className={styles.inputField} />
          </div>

          {/* Checkbox */}
          <div className={styles.checkboxContainer}>
            <input type="checkbox" id="terms" className={styles.checkbox} />
            <label htmlFor="terms" className={styles.shroot}>أوافق على الشروط والأحكام</label>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton}>إنشاء حساب</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;