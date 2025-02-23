import React, { useState } from 'react';
import {
    Home,
    Camera,
    History,
    Book,
    Lightbulb,
    Settings,
} from 'lucide-react';
import styles from "../assets/styles/Sidebar.module.css";

const Sidebar: React.FC = () => {
    // Move useState inside the component
    const [selectedTab, setSelectedTab] = useState('home');

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
                <button
                    className={`${styles.sidebarButton} ${selectedTab === 'home' ? styles.active : ''}`}
                    onClick={() => setSelectedTab('home')}
                >
                    <Home className={styles.sidebarIcon} />
                    <span>الرئيسية</span>
                </button>
                <button
                    className={`${styles.sidebarButton} ${selectedTab === 'analyze' ? styles.active : ''}`}
                    onClick={() => setSelectedTab('analyze')}
                >
                    <Camera className={styles.sidebarIcon} />
                    <span>تحليل الوجبة</span>
                </button>
                <button
                    className={`${styles.sidebarButton} ${selectedTab === 'history' ? styles.active : ''}`}
                    onClick={() => setSelectedTab('history')}
                >
                    <History className={styles.sidebarIcon} />
                    <span>سجل الأطعمة</span>
                </button>
                <button
                    className={`${styles.sidebarButton} ${selectedTab === 'recipes' ? styles.active : ''}`}
                    onClick={() => setSelectedTab('recipes')}
                >
                    <Book className={styles.sidebarIcon} />
                    <span>وصفاتي</span>
                </button>
                <button
                    className={`${styles.sidebarButton} ${selectedTab === 'tips' ? styles.active : ''}`}
                    onClick={() => setSelectedTab('tips')}
                >
                    <Lightbulb className={styles.sidebarIcon} />
                    <span>نصائح غذائية</span>
                </button>
                <button
                    className={`${styles.sidebarButton} ${selectedTab === 'settings' ? styles.active : ''}`}
                    onClick={() => setSelectedTab('settings')}
                >
                    <Settings className={styles.sidebarIcon} />
                    <span>الإعدادات</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;