import React, { useEffect, useState } from 'react';
import { X, Save, Clock, Sun, Moon } from 'lucide-react';
import styles from '../assets/styles/Analyze.module.css';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealName: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'history', weight?: number) => void;
  showWeightInput?: boolean;
  skipMealName?: boolean;
  defaultMealName?: string;     // <-- Add this
  defaultWeight?: number;       // <-- Add this
}

const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  showWeightInput = false,
  skipMealName = false,
  defaultMealName,
  defaultWeight
}) => {
  const [mealName, setMealName] = useState(defaultMealName || '');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'history'>('history');
  const [weight, setWeight] = useState<number | undefined>(defaultWeight || 0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMealName(defaultMealName || '');
      setWeight(defaultWeight || 0);
    }
  }, [isOpen, defaultMealName, defaultWeight]);

  const handleSave = () => {
    if (!skipMealName && !mealName.trim()) {
      setError('الرجاء إدخال اسم الوجبة');
      return;
    }

    const finalMealName = skipMealName ? 'وجبة محللة من الصورة' : mealName;
    onSave(finalMealName, mealType, weight);
    setMealName('');
    setWeight(undefined);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>حفظ الوجبة</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {!skipMealName && (
            <div className={styles.inputGroup}>
              <label>اسم الوجبة</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="ادخل اسم الوجبة"
                className={styles.modalInput}
              />
            </div>
          )}


          <div className={styles.inputGroup}>
            <label>نوع الوجبة</label>
            <div className={styles.mealTypeGrid}>
              <button
                type="button"
                className={`${styles.mealTypeButton} ${mealType === 'breakfast' ? styles.active : ''}`}
                onClick={() => setMealType('breakfast')}
              >
                <Sun size={20} />
                فطار
              </button>
              <button
                type="button"
                className={`${styles.mealTypeButton} ${mealType === 'lunch' ? styles.active : ''}`}
                onClick={() => setMealType('lunch')}
              >
                <Clock size={20} />
                غداء
              </button>
              <button
                type="button"
                className={`${styles.mealTypeButton} ${mealType === 'dinner' ? styles.active : ''}`}
                onClick={() => setMealType('dinner')}
              >
                <Moon size={20} />
                عشاء
              </button>
              <button
                type="button"
                className={`${styles.mealTypeButton} ${mealType === 'history' ? styles.active : ''}`}
                onClick={() => setMealType('history')}
              >
                <Save size={20} />
                السجل فقط
              </button>
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            إلغاء
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            <Save size={16} />
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;