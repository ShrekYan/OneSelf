import React from 'react';
import styles from './index.module.scss';
import { getIcon } from '../icons';
import type { Link } from '../../types';

interface LinksProps {
  links: Link[];
  onLinkClick: (id: string) => void;
}

const Links: React.FC<LinksProps> = ({ links, onLinkClick }) => {
  return (
    <div className={styles.linksContainer}>
      <h2 className={styles.sectionTitle}>联系我们</h2>
      {links.map(link => (
        <div
          key={link.id}
          className={styles.linkItem}
          onClick={() => onLinkClick(link.id)}
        >
          <div className={styles.linkLeft}>
            <div className={styles.linkIcon}>{getIcon(link.iconKey)}</div>
            <span className={styles.linkText}>{link.title}</span>
          </div>
          <svg
            className={styles.linkArrow}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      ))}
    </div>
  );
};

Links.displayName = 'Links';

export default Links;
