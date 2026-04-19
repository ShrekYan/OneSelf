/**
 * 帮助与常见问题页面
 * @description 展示常见问题解答，使用折叠面板展示问答内容
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import { Collapse } from 'antd-mobile';
import { useHelpStore } from './useStore';
import { handleEmailClick, handlePhoneClick } from './handle';
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

  /**
   * 处理邮箱点击
   */
  const onEmailClick = (): void => {
    handleEmailClick(store.contactInfo.email);
  };

  /**
   * 处理电话点击
   */
  const onPhoneClick = (): void => {
    handlePhoneClick(store.contactInfo.phone);
  };

  return useObserver(() => {
    return (
      <div className={styles.helpContainer}>
        {/* Header Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>Help Center</h1>
          <p className={styles.subtitle}>
            Frequently asked questions to quickly solve your problems
          </p>
        </div>

        {/* FAQ Collapse Panel */}
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

        {/* Contact Information */}
        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>Contact Us</h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem} onClick={onEmailClick}>
              <span className={styles.label}>Email: </span>
              <span className={styles.value}>{store.contactInfo.email}</span>
            </div>
            <div className={styles.contactItem} onClick={onPhoneClick}>
              <span className={styles.label}>Phone: </span>
              <span className={styles.value}>{store.contactInfo.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.label}>Working Hours: </span>
              <span className={styles.value}>
                {store.contactInfo.workingHours}
              </span>
            </div>
          </div>
        </div>

        {/* Version Information */}
        <div className={styles.versionSection}>
          <h3 className={styles.versionTitle}>Version Information</h3>
          <div className={styles.versionInfo}>
            <div className={styles.versionItem}>
              <span className={styles.label}>Current Version: </span>
              <span className={styles.value}>{store.appVersion.version}</span>
            </div>
            <div className={styles.versionItem}>
              <span className={styles.label}>Build Date: </span>
              <span className={styles.value}>{store.appVersion.buildDate}</span>
            </div>
            <div className={styles.versionItem}>
              <span className={styles.label}>Last Updated: </span>
              <span className={styles.value}>
                {store.appVersion.updateDate}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          If the above content doesn't solve your problem, please feel free to
          contact us through the information above
        </div>
      </div>
    );
  });
};

Help.displayName = 'Help';

export default Help;
