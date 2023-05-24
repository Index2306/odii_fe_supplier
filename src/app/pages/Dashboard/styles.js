import styled from 'styled-components';
import { SectionWrapper } from 'styles/commons';
import Color from 'color';
import { StyleConstants } from 'styles/StyleConstants';
import { PageWrapper } from 'app/components';
import {
  Row,
  //  Col, Carousel, Tabs
} from 'antd';
import { wave } from 'assets/images/dashboards';

export const CustomDiv = styled.div`
  background-color: rgb(255, 255, 255);
  .notification-verify-info {
    position: fixed;
    width: 90%;
    height: 40px;
    z-index: 10;
    text-align: center;
    background: #3d56a6;
    box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.2);
    color: white;
    padding-top: 10px;
    .link {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-decoration-line: underline;
      cursor: pointer;
      color: #f2c94c;
    }
  }
`;

export const CustomDivDashBroad = styled.div`

  .notification-verify-info {
    position: fixed;
    width: 90%;
    height: 40px;
    z-index: 10;
    text-align: center;
    background: #3d56a6;
    box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.2);
    color: white;
    padding-top: 10px;
    .link {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-decoration-line: underline;
      cursor: pointer;
      color: #f2c94c;
    }
  }
`;

export const ListProduct = styled.div`
  margin-left: 23px;
  > * {
    :hover {
      background: ${({ theme }) => theme.backgroundBlue};
      border-radius: 6px;
    }
  }
  .add-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border-radius: 4px;
    color: ${({ theme }) => theme.grayBlue};
    background-color: ${({ theme }) => theme.backgroundBlue};
    border: 1px dashed #d9dbe2;
  }
  .ant-image,
  .ant-image-img {
    width: 45px;
    border-radius: 4px;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    :hover {
      color: ${({ theme }) => theme.darkBlue1};
      text-decoration: underline;
    }
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid #cccccc;
  background: white;
  height: 100%;
  width: 100%;
  padding: 39px 15px 24px 15px;
`;

export const ChartWrapper = styled.div`
  overflow: hidden;
  overflow-x: scroll;
  width: 100%;
  overflow-y: scroll;
  height: ${props => props.height || '310px'};
  .scroll-item {
    width: 100%;
    min-width: ${props => props.scrollItemWidth}px;
    height: 100%;
  }
`;
export const CustomSectionWrapper = styled(SectionWrapper)`
  border: none;
  margin-bottom: 35px;
  border: 1px solid #ebebf0;
  .title {
    font-weight: 500;
    font-size: 18px;
  }
  &:last-child {
    margin-bottom: 0px;
  }
  .tooltip {
    margin-left: 6px;
    margin-bottom: 7px;
    cursor: pointer;
  }
`;

export const WrapOrder = styled.div`
  display: flex;

  .ant-col:not(:last-child) & {
    margin-right: 34px;
    border-right: 1px solid ${({ theme }) => theme.stroke};
  }
  .number {
    line-height: 25px;
    font-size: 22px;
    margin-right: 6px;
    font-weight: 900;
  }
  .box {
    height: 18px;
    color: ${({ colorBox }) => colorBox || '#27AE60'};
    padding: 2px 4px;
    font-size: 12px;
    border-radius: 10px;
    background-color: ${({ colorBox }) =>
    Color(colorBox || '#27AE60').alpha(0.1)};
  }
`;

export const CustomPageWrapper = styled(PageWrapper)`
  width: ${StyleConstants.bodyWidth}px;
  margin: 0 auto 2.5rem;
  padding: 35px 1.5rem 46px;
`;

export const CustomWrapperPage = styled(PageWrapper)`
  width: ${StyleConstants.bodyWidth}px;
  margin: 0 auto;
  padding: 35px 1.5rem 1px;
`;

export const Banner = styled.div`
  color: #fff;
  display: flex;
  height: 120px;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 35px;
  position: relative;

  .background-header {
    position: relative;
  }
  .svg-image {
    position: absolute;
    right: 80px;
  }
  .image-text {
    position: absolute;
    left: 56px;
  }
  .image-icon {
    position: absolute;
    right: 14px;
    top: 12px;
  }
`;

export const CustomSectionWrapper2 = styled(SectionWrapper)`
  padding: 0px;
  margin-bottom: 35px;
  background: none;
  border: none;
  .title {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 18px;
  }
  .viewMore {
    color: #5b86e5;
    line-height: 22px;
  }
  .list-video {
    justify-content: space-between;
    align-items: center;
    .item-video {
      padding: 17px 15px;
      background: #ffffff;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      border-radius: 4px;
      .iframe {
        border-radius: 3px;
        margin-bottom: 16px;
      }
    }
  }
  .containerSection {
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #ffffff;
    border-radius: 4px;
    padding: 29px 25px 0;
  }

  .news-item {
    display: flex;
    margin-bottom: 20px;
    &:hover {
      cursor: pointer;
      .news-title {
        color: ${({ theme }) => theme.primary};
      }
    }
    .time {
      display: flex;
      color: ${({ theme }) => theme.gray3};
      font-size: 12px;
      .time_read {
        position: relative;
        padding-left: 14px;
        ::before {
          content: ' ';
          left: 0;
          top: 50%;
          position: absolute;
          transform: translate(0, -50%);
          width: 5px;
          border-radius: 10px;
          height: 5px;
          background: #e0e0e0;
        }
      }
    }
  }
`;

export const CustomRow = styled(Row)`
  margin: 0 !important;
  .left {
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
    border-radius: 4px 0px 0px 4px;
    border: 1px solid #ebebf0;
    border-right: none;
  }
  .right {
    background: #f7f7f9;
    box-sizing: border-box;
    padding: 18px 20px 12px !important;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
    border-radius: 0px 4px 4px 0px;
    border: 1px solid #ebebf0;
    border-left: none;
    .title {
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: #333333;
    }
    .top {
      .title {
        margin-bottom: 18px;
      }
    }
    .bottom {
      .title {
        margin-top: 24px;
        margin-bottom: 12px;
      }
    }

    .item {
      width: 100px;
      height: 130px;
      text-align: center;
      padding-top: 18px;
      background: linear-gradient(
          180deg,
          #ffffff 0%,
          rgba(255, 255, 255, 0.96) 100%
        ),
        #ebebee;
      box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.1);
      border-radius: 10px;

      /* @keyframes effect {
        0% {
          transform: translateX(10px);
        }
        100% {
          transform: translateX(-20px);
        }
      } */
      .box {
        position: relative;
        margin: 0 auto 16px;
        width: 45px;
        height: 45px;
        padding: 3px;
        border: 1px solid #ecf0f7;
        box-sizing: border-box;
        border-radius: 10px;
        .image {
          padding: 9px;
        }
        .effect-wave {
          /* position: relative; */
          position: absolute;
          /* bottom: 0px; */
          /* left: -20px; */
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #ffe7d9;
          div {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background-image: url(${wave});
            background-position: center;
            background-repeat: no-repeat;
            /* animation: effect 1s infinite linear alternate; */
          }
        }
        .number-percent {
          font-weight: 900;
          font-size: 12px;
          line-height: 15px;
          position: absolute;
          top: 16px;
          left: 0;
          right: 0;
        }
      }

      .title {
        font-weight: normal;
        font-size: 10px;
        margin-bottom: 6px;
      }
      .number {
        font-weight: 800;
        font-size: 18px;
        line-height: 16px;
      }
      .status {
        font-weight: bold;
        font-size: 12px;
        line-height: 16px;
      }
    }

    .line {
      min-height: 36px;
      &:not(:last-child) {
        border-bottom: 1px dashed #bac6e2;
      }
    }
    .desc-chart {
      margin-left: 32px;
    }
    .color {
      margin: auto 8px auto 0;
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
    .green {
      background: #35b26f;
    }
    .yellow {
      background: #f2ce54;
    }
    .pink {
      background: #ec7c7d;
    }
    .gray {
      background: #a08ff5;
    }

    .content-percent {
      align-items: center;
    }
  }
`;
