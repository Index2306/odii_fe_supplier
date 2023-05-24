import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import styled from 'styled-components/macro';
import { PageWrapper, Tabs } from 'app/components';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { messages } from './messages';
import { selectLoading } from './slice/selectors';
import {
  ListAffiliater,
  ListPayout,
  StatisticalAffiliate,
  TopAffiliater,
} from './Features/Components';

const { TabPane } = Tabs;

export function AccountPartnership({ history }) {
  const { t } = useTranslation();
  const isLoading = useSelector(selectLoading);

  // if (showEmptyPage) {
  //   return (
  //     <>
  //       <PageWrapper>
  //         <MyInfoAffiliate />
  //         <CustomTitle
  //           height="calc(100vh - 120px)"
  //           className="d-flex flex-column"
  //         >
  //           <CustomTitle>Tiếp thị người dùng</CustomTitle>
  //           <EmptyPage />
  //         </CustomTitle>
  //       </PageWrapper>
  //     </>
  //   );
  // }

  return (
    <PageWrapper>
      <div className="header">
        <CustomH3 className="title text-left" mb={{ xs: 's6' }}>
          {t(messages.title()).toUpperCase()}
        </CustomH3>
      </div>
      <Row gutter={[8, 8]}>
        <Col xs={24} xxl={12}>
          <StatisticalAffiliate t={t} isLoading={isLoading} />
        </Col>
        <Col xs={24} xxl={12}>
          <TopAffiliater t={t} messages={messages} isLoading={isLoading} />
        </Col>
      </Row>
      <CustomSectionWrapper>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Doanh sách thanh toán" key="1">
            <ListPayout isLoading={isLoading} />
          </TabPane>
          <TabPane tab="Danh sách đối tác" key="2">
            <ListAffiliater isLoading={isLoading} />
          </TabPane>
        </Tabs>
      </CustomSectionWrapper>
    </PageWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  .hide {
    visibility: hidden;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    .btn-cancel {
      background: #fff;
      &:hover {
        color: #fff;
        background: red;
      }
    }
    button {
      margin: auto;
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
      margin: auto;
    }
  }
`;
