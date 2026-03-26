import React from 'react';
import styles from './index.module.scss';

interface HeaderProps {
  appName: string;
  version: string;
}

const Header: React.FC<HeaderProps> = ({ appName, version }) => {
  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <svg
          className={styles.logo}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <h1 className={styles.appName}>{appName}</h1>
      <div className={styles.version}>{version}</div>
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
