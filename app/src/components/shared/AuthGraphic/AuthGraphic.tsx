import React from 'react';
import styles from './AuthGraphic.module.css'; // We will create this CSS file next

// Import the image (path relative to this new component)
import graphicImage from "../../../assets/images/role-selection-graphic.png";

interface AuthGraphicProps {
    title?: string;
    imageSrc?: string;
    heading?: string;
    description?: string;
    activeDotIndex?: number;
}

/**
 * A reusable component for the left-hand graphic panel used on login/signup pages.
 */
const AuthGraphic: React.FC<AuthGraphicProps> = ({
    title = "Medicore", // Default title
    imageSrc = graphicImage, // Default image
    heading = "Smarter Care Starts Here",
    description = "MediCore unites patients and professionals — simplifying care, records, and billing.",
}) => {
    return (
        <div className={styles.leftSection}>
            <h1 className={styles.leftTitle}>{title}</h1>
            <img
                src={imageSrc}
                alt="Healthcare illustration"
                className={styles.image}
            />
            <h2 className={styles.leftSubtitle}>{heading}</h2>
            <p className={styles.leftText}>
                {description}
            </p>
            {/* Carousel dots (optional visual element) */}
            <div className={styles.carouselDots}>
                <div className={`${styles.dot} ${styles.activeDot}`}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        </div>
    );
};

export default AuthGraphic;