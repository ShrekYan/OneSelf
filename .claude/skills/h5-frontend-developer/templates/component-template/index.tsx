import React from 'react';
import styles from './index.module.scss';

interface ComponentNameProps {
  title: string;
  description?: string;
}

const ComponentName: React.FC<ComponentNameProps> = ({ title, description }) => {
  return (
    <div className={styles.componentNameContainer}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

ComponentName.displayName = 'ComponentName';

export default ComponentName;