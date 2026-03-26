import React from 'react';
import styles from './index.module.scss';
import { getIcon } from '../icons';
import type { Feature } from '../../types';

interface FeaturesProps {
  features: Feature[];
}

const Features: React.FC<FeaturesProps> = ({ features }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>产品特色</h2>
      <div className={styles.featuresList}>
        {features.map(feature => (
          <div key={feature.id} className={styles.featureItem}>
            <div className={styles.featureIcon}>{getIcon(feature.iconKey)}</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Features.displayName = 'Features';

export default Features;
