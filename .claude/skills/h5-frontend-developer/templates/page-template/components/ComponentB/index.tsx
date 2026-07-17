import React from 'react';
import styles from './index.module.scss';

interface ListItem {
  id: string;
  title: string;
}

interface ComponentBProps {
  data: ListItem[];
  onItemClick: (id: string) => void;
}

const ComponentB: React.FC<ComponentBProps> = ({ data, onItemClick }) => {
  return (
    <div className={styles.componentBContainer}>
      {data.map((item) => (
        <div key={item.id} onClick={() => onItemClick(item.id)} className={styles.item}>
          {item.title}
        </div>
      ))}
    </div>
  );
};

ComponentB.displayName = 'ComponentB';

export default ComponentB;