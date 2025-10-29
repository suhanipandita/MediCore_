import React from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  id: string; // Make id mandatory for accessibility
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`${styles.inputGroup} ${containerClassName}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;