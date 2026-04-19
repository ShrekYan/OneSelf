import React from 'react';
import styles from './index.module.scss';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  // 这里简化处理，将内容按行分割渲染
  // 实际项目中可以根据需要使用 markdown-it 或 react-markdown 渲染
  const lines = content.split('\n').filter(line => line.trim() !== '');

  const renderLine = (line: string, index: number) => {
    if (line.startsWith('# ')) {
      return <h1 key={index}>{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index}>{line.slice(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={index}>{line.slice(4)}</h3>;
    }
    if (line.startsWith('```')) {
      return null; // 简化处理，跳过代码块标记
    }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    return <p key={index}>{line}</p>;
  };

  return (
    <div className={styles.articleContentContainer}>
      <div className={styles.content}>
        {lines.map((line, index) => renderLine(line, index))}
      </div>
    </div>
  );
};

ArticleContent.displayName = 'ArticleContent';

export default ArticleContent;
