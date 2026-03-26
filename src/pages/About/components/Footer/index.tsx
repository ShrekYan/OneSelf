import React from 'react';
import styles from './index.module.scss';

interface FooterProps {
  copyright: string;
}

const Footer: React.FC<FooterProps> = ({ copyright }) => {
  return (
    <div className={styles.container}>
      <p className={styles.copyright}>{copyright}</p>
    </div>
  );
};

Footer.displayName = 'Footer';

export default Footer;
