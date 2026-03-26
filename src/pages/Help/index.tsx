/**
 * 帮助与常见问题页面
 * @description 展示常见问题解答，使用折叠面板展示问答内容
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import { Collapse } from 'antd-mobile';
import useHelpStore from './useStore';
import styles from './index.module.scss';

/**
 * 帮助与常见问题页面组件
 */
const Help: React.FC = () => {
  const store = useHelpStore();

  /**
   * 处理折叠面板变更
   */
  const handleCollapseChange = (key: string | string[] | null): void => {
    if (key === null) {
      store.setActiveKey(null);
    } else if (Array.isArray(key)) {
      store.setActiveKey(key[key.length - 1] || null);
    } else {
      store.setActiveKey(key);
    }
  };

  /**
   * 格式化回答文本，处理换行
   */
  const formatAnswer = (text: string): React.ReactNode => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return useObserver(() => {
    return (
      <div className={styles.container}>
        {/* 头部标题 */}
        <div className={styles.header}>
          <h1 className={styles.title}>帮助中心</h1>
          <p className={styles.subtitle}>常见问题解答，快速解决您的问题</p>
        </div>

        {/* FAQ 折叠面板 */}
        <div className={styles.faqContainer}>
          <Collapse
            accordion={true}
            activeKey={store.activeKey}
            onChange={handleCollapseChange}
          >
            {store.faqList.map(item => (
              <Collapse.Panel
                key={item.key}
                title={item.question}
                className={styles.faqItem}
              >
                {formatAnswer(item.answer)}
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>

        {/* 联系信息 */}
        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>联系方式</h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.label}>邮箱：</span>
              <span className={styles.value}>{store.contactInfo.email}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.label}>电话：</span>
              <span className={styles.value}>{store.contactInfo.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.label}>工作时间：</span>
              <span className={styles.value}>
                {store.contactInfo.workingHours}
              </span>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div className={styles.footer}>
          如果以上内容没有解决您的问题，欢迎通过上方联系方式联系我们
        </div>
      </div>
    );
  });
};

Help.displayName = 'Help';

export default Help;
