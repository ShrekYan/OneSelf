import React from 'react';
import { LoadingConst } from './constant';
import { getSizeClass } from './handle';

interface LoadingProps {
  tip?: string;
  size?: 'small' | 'middle' | 'large';
}

const Loading: React.FC<LoadingProps> = ({
  tip = LoadingConst.DEFAULT_TIP,
  size = LoadingConst.SIZE.LARGE,
}) => {
  const sizeValue = getSizeClass(size);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'transparent',
          padding: '24px 32px',
          borderRadius: '12px',
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            width: sizeValue,
            height: sizeValue,
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        {tip && <div style={{ fontSize: '14px', color: '#666666' }}>{tip}</div>}
      </div>
    </div>
  );
};

export default Loading;
