import React from 'react';
import styles from './index.module.scss';

interface ComponentAProps {
  title: string;
}

const ComponentA: React.FC<ComponentAProps> = ({ title }) => {
  return (
    <div className={styles.componentAContainer}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
};

ComponentA.displayName = 'ComponentA';

export default ComponentA;