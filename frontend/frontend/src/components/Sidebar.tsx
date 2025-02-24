import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Home,
    Camera,
    History,
    Book,
    Lightbulb,
    Settings,
} from "lucide-react";
import styles from "../assets/styles/Sidebar.module.css";

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
                <NavLink
                    to="/Home"
                    className={({ isActive }) =>
                        `${styles.sidebarButton} ${isActive ? styles.active : ""}`
                    }
                >
                    <Home className={styles.sidebarIcon} />
                    <span>الرئيسية</span>
                </NavLink>

                <NavLink
                    to="/Analyze"
                    className={({ isActive }) =>
                        `${styles.sidebarButton} ${isActive ? styles.active : ""}`
                    }
                >
                    <Camera className={styles.sidebarIcon} />
                    <span>تحليل الوجبة</span>
                </NavLink>

                <NavLink
                    to="/History"
                    className={({ isActive }) =>
                        `${styles.sidebarButton} ${isActive ? styles.active : ""}`
                    }
                >
                    <History className={styles.sidebarIcon} />
                    <span>سجل الأطعمة</span>
                </NavLink>

                <NavLink
                    to="/Recipes"
                    className={({ isActive }) =>
                        `${styles.sidebarButton} ${isActive ? styles.active : ""}`
                    }
                >
                    <Book className={styles.sidebarIcon} />
                    <span>وصفاتي</span>
                </NavLink>

                <NavLink
                    to="/Tips"
                    className={({ isActive }) =>
                        `${styles.sidebarButton} ${isActive ? styles.active : ""}`
                    }
                >
                    <Lightbulb className={styles.sidebarIcon} />
                    <span>نصائح غذائية</span>
                </NavLink>

                <NavLink
                    to="/Settings"
                    className={({ isActive }) =>
                        `${styles.sidebarButton} ${isActive ? styles.active : ""}`
                    }
                >
                    <Settings className={styles.sidebarIcon} />
                    <span>الإعدادات</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
