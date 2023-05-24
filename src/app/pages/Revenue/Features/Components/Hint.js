import React from 'react';
// import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import { SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';

export default function PaymentInfo({ data, isLoading }) {
  // const { t } = useTranslation();

  const pageContent = (
    <>
      <SectionHint>
        <div className="hint-tilte">Giao dịch cần xử lý</div>
        <div className="hint-content">
          <span className="label">Nội dung: </span>Giao dịch này đã được Odii
          đánh dấu cần kiểm tra. Vui lòng liên hệ phía Odii để xác nhận thông
          tin
        </div>
      </SectionHint>
    </>
  );

  return (
    <SectionWrapperHint className="box-df">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 1 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapperHint>
  );
}

export const SectionWrapperHint = styled(SectionWrapper)`
  width: 660px;
  background: #fff8e3;
  margin-left: auto;
  margin-right: auto;
`;

export const SectionHint = styled.div`
  .hint-tilte {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #f2994a;
    margin-bottom: 8px;
  }
  .label {
    font-weight: 500;
    color: #333333;
  }
  .hint-content {
    font-size: 14px;
    line-height: 18px;
    color: #333333;
  }
`;
