import React from "react";
import Slider from "react-slick";
import styles from "../../assets/styles/SignUp.module.css";

const SignUp = () => {
  return (
    <div className={styles.signUp}>

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


      <div className={styles.rightSection}>
        <div className={styles.header}>
          <h2 className={styles.title}>إنشاء حساب</h2>
          <p className={styles.subtext}>
            لديك حساب بالفعل؟ <span className={styles.loginText}>تسجيل الدخول</span>
          </p>
        </div>


        <form className={styles.form}>

<div className={styles.row}>

<div className={styles.row}>

    <div className={styles.lastNameContainer}>
        <input type="text" placeholder="الإسم الأخير" className={styles.lastNameInput} />
    </div>


    <div className={styles.firstNameContainer}>
        <input type="text" placeholder="الإسم الأول" className={styles.firstNameInput} />
    </div>
</div>
</div>


          <div className={styles.inputContainer}>
            <input type="email" placeholder="البريد الإلكتروني" className={styles.inputField} />
          </div>


          <div className={styles.inputContainer}>
            <input type="password" placeholder="كلمة السر" className={styles.inputField} />
          </div>

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
