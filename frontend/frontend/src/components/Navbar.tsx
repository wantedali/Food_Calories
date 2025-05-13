import React from "react";
import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import styles from "../assets/styles/Navbar.module.css";
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    showButtons?: boolean;
    onLoginClick?: () => void; 
    onSignUpClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = (
    { showButtons = false, onLoginClick, onSignUpClick }) => {
            const navigate = useNavigate();
    return (
        
        <motion.nav
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={styles.navbar} 
        >
            <div className={styles.navContent}>
                <div className={styles.logo}>
                    <ChefHat className={styles.logoIcon} />
                    <span className={styles.logoText}>لقمتي</span>
                </div>
                <div>
                    <button className={styles.logout}  onClick={() => navigate("/")}>
                        تسجيل الخروج
                    </button>
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
        </motion.nav>
    );
};

export default Navbar;