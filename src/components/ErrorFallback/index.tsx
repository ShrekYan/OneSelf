import React from "react";
import { Button, Space } from "antd-mobile";
import { ErrorFallbackConst } from "./constant";
import { handleRetry, handleRefresh } from "./handle";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
      padding: "20px"
    }}>
      <div style={{
        textAlign: "center",
        background: "#ffffff",
        padding: "40px 20px",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        width: "100%"
      }}>
        <div style={{
          fontSize: "64px",
          color: "#ff4d4f",
          marginBottom: "16px"
        }}>
          {ErrorFallbackConst.ERROR_ICON}
        </div>
        <h1 style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#333333",
          marginBottom: "12px"
        }}>
          {ErrorFallbackConst.DEFAULT_ERROR_TITLE}
        </h1>
        <div style={{
          background: "#fff2f0",
          color: "#ff4d4f",
          padding: "12px 16px",
          borderRadius: "6px",
          fontSize: "14px",
          lineHeight: 1.5,
          marginBottom: "24px",
          textAlign: "left",
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #ffccc7"
        }}>
          {error.message}
        </div>

        <Space block>
          <Button
            color="primary"
            size="large"
            onClick={() => handleRetry(resetErrorBoundary)}
          >
            {ErrorFallbackConst.RETRY_BUTTON_TEXT}
          </Button>
          <Button
            size="large"
            onClick={handleRefresh}
          >
            {ErrorFallbackConst.REFRESH_BUTTON_TEXT}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ErrorFallback;
