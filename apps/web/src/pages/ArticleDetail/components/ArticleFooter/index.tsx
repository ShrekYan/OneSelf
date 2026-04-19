import React from 'react';
import styles from './index.module.scss';

interface ArticleFooterProps {
  authorBio?: string;
}

const ArticleFooter: React.FC<ArticleFooterProps> = ({ authorBio }) => {
  if (!authorBio) {
    return null;
  }

  return (
    <div className={styles.articleFooterContainer}>
      <div className={styles.authorBio}>
        <div className={styles.label}>About the Author</div>
        <div className={styles.bio}>{authorBio}</div>
      </div>
    </div>
  );
};

ArticleFooter.displayName = 'ArticleFooter';

export default ArticleFooter;
