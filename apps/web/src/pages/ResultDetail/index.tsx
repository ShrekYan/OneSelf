import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useObserver } from 'mobx-react';

import styles from './index.module.scss';

/**
 * SVG 图标组件
 */
interface IconProps {
  className?: string;
}

const BackArrowIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const RightArrowIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckSuccessIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 68 46" fill="currentColor" stroke="none">
    <path d="M63.5 0L51.7 13.5L26.8 40.2L13.2 27.3L0 41.2L14.5 57.5L28.1 43.5L63.5 0Z" />
  </svg>
);

const InfoCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const RefreshIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const ResultDetailPage: React.FC = () => {
  const navigate = useNavigate();

  // 处理返回
  const handleBack = (): void => {
    navigate(-1);
  };

  // 处理完成返回首页
  const handleComplete = (): void => {
    navigate('/');
  };

  // 处理再买一笔
  const handleBuyAgain = (): void => {
    // 预留点击回调
  };

  // 处理换一换
  const handleRefresh = (): void => {
    // 预留点击回调
  };

  // 处理加自选
  const handleAddFavorite = (): void => {
    // 预留点击回调
  };

  return useObserver(() => (
    <div className={styles.resultDetailContainer}>
      {/* 导航栏背景 - 绝对坐标 top=88 */}
      <div className={styles.navBarBg} />

      {/* 返回图标 - top=111 left=20 */}
      <div className={styles.backIcon} onClick={handleBack}>
        <BackArrowIcon />
      </div>

      {/* 导航标题 - top=115 left=307 */}
      <div className={styles.navTitle}>购买成功</div>

      {/* 完成按钮 - top=118 left=664 */}
      <div className={styles.completeBtn} onClick={handleComplete}>完成</div>

      {/* 导航底部分割线 - top=175 */}
      <div className={styles.navDivider} />

      {/* 顶部橙色区域 - top=172 */}
      <div className={styles.topOrangeArea} />

      {/* 成功对勾容器 - top=199 left=321 */}
      <div className={styles.successIconWrapper}>
        <CheckSuccessIcon className={styles.successIcon} />
      </div>

      {/* 成功标题 - top=339 left=231 */}
      <div className={styles.successTitle}>投顾服务委托成功</div>

      {/* 订单时间 - top=391 left=255 */}
      <div className={styles.orderTime}>2020-11-11  09:00:00</div>

      {/* 白色卡片 - top=249 left=20 */}
      <div className={styles.contentCard} />

      {/* 订单信息卡片 - top=445 left=40 */}
      <div className={styles.orderInfoCard} />

      {/* 订单编号行背景 - top=533 left=50 */}
      <div className={styles.orderRowBg} />

      {/* 订单编号文字 - top=555 left=70 */}
      <div className={styles.orderLabel}>订单编号</div>

      {/* 右箭头 - top=559 left=666 */}
      <div className={styles.arrowRight}>
        <RightArrowIcon />
      </div>

      {/* 购买详情 - top=475 left=70 */}
      <div className={styles.buyDetail}>
        购买中欧汇利债券E &nbsp;&nbsp; 1,000.00元
      </div>

      {/* 提示区域 - top=639 left=70 */}
      <div className={styles.tipSection}>
        <div className={styles.tipDivider} />
        <div className={styles.tipContent}>
          <div className={styles.infoIcon}>
            <InfoCircleIcon />
          </div>
          <div className={styles.tipText}>
            资金将先冻结在超级滚钱宝中，冻结期间正常计算超级滚钱宝收益。预计2026-03-25起发起策略组合中全部基金购买申请，份额确认后开始计算投资收益
          </div>
        </div>
      </div>

      {/* 推荐区域 - top=936 left=20 */}
      <div className={styles.recommendSection}>
        <div className={styles.bgRect} />
        <div className={styles.recommendTitle}>大家也关注...</div>

        <div className={styles.fundItem}>
          <div className={styles.fundInfoGroup}>
            <div className={styles.fundName}>富国中证价值ETF联接C...</div>
            <div className={styles.tagsRow}>
              <span className={styles.tag}>文案文案</span>
              <span className={styles.tag}>文案文案</span>
              <span className={styles.tag}>文案文案</span>
            </div>
          </div>
          <div className={styles.increaseRate}>+2.20%</div>
          <div className={styles.periodText}>近一年</div>
          <div className={styles.addFavoriteIcon} onClick={handleAddFavorite}>
            <PlusCircleIcon />
          </div>
        </div>

        <div className={styles.refreshRow} onClick={handleRefresh}>
          <RefreshIcon className={styles.refreshIcon} />
          <span className={styles.refreshText}>换一换</span>
        </div>
      </div>

      {/* 占比文字 - top=1173 left=70 */}
      <div className={styles.proportionText}>
        投顾配置中，该基金占比0.76%
      </div>

      {/* 底部分隔 - top=1155 left=50 */}
      <div className={styles.bottomDivider} />

      {/* 底部操作栏 */}
      <div className={styles.bottomBar}>
        <div className={styles.buyAgainBtn} onClick={handleBuyAgain}>
          再买一笔
        </div>
        <div className={styles.safeArea} />
      </div>
    </div>
  ));
};

ResultDetailPage.displayName = 'ResultDetailPage';

export default ResultDetailPage;
