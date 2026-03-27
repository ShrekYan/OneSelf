import React from 'react';
import styles from './index.module.scss';

interface DescriptionProps {
  description: string;
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
  return (
    <div className={styles.descriptionContainer}>
      <h2 className={styles.sectionTitle}>About Us</h2>
      <p className={styles.descriptionText}>{description}</p>
    </div>
  );
};

Description.displayName = 'Description';

export default Description;
