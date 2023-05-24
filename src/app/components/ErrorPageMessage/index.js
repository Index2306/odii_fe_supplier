import React from 'react';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

export function ErrorPageMessage({ message, onClick }) {
  const { t } = useTranslation();
  return (
    <Result
      status="warning"
      title={message || t('user.error')}
      extra={
        <Button type="primary" onClick={onClick}>
          {t('user.reload')}
        </Button>
      }
    />
  );
}

export function ErrorWrapper({ error, message, onClick, children }) {
  const { t } = useTranslation();
  if (error) {
    <Result
      status="warning"
      title={message || t('user.error')}
      extra={
        <Button type="primary" onClick={onClick}>
          {t('user.reload')}
        </Button>
      }
    />;
  }
  return children;
}
