import React from "react";
import { ChefHat } from "lucide-react";
import styles from "../assets/styles/Navbar.module.css";

interface NavbarProps {
    showButtons?: boolean; // Optional prop to show/hide buttons
    onLoginClick?: () => void; // Optional callback for login button
    onSignUpClick?: () => void; // Optional callback for sign-up button
}

const Navbar: React.FC<NavbarProps> = ({ showButtons = false, onLoginClick, onSignUpClick }) => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <div className={styles.logo}>
                    <ChefHat className={styles.logoIcon} />
                    <span className={styles.logoText}>لقمتي</span>
                </div>

                {showButtons && (
                    <div className={styles.navButtons}>
                        <button className={styles.loginButton} onClick={onLoginClick}>
                            تسجيل الدخول
                        </button>
                        <button className={styles.signupButton} onClick={onSignUpClick}>
                            إنشاء حساب
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;