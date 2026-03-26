import React from 'react';
import styles from './index.module.scss';

interface DescriptionProps {
  description: string;
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>关于我们</h2>
      <p className={styles.descriptionText}>{description}</p>
    </div>
  );
};

Description.displayName = 'Description';

export default Description;
