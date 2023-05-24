import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
import { tooltip } from 'assets/images/dashboards';
import { Row, Tooltip } from 'antd';
import { formatMoney } from 'utils/helpers';
// import constants from 'assets/constants';
import { CaretUpOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function ColorPayBox(props) {
  const { initData, styleBox, data, label, time, predata, cycle, goto } = props;

  return (
    <CustomBoxColor>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="header"
      >
        <CustomStyle className="title">{label}</CustomStyle>
        {goto && (
          <CustomStyle className="see-more">
            <Link to={goto} style={{ color: '#3d56a6' }}>
              Xem thêm
            </Link>
            <RightOutlined style={{ marginLeft: 5 }} />
          </CustomStyle>
        )}
      </CustomStyle>
      <Row
        className="content"
        justify={time ? 'space-around' : 'space-between'}
      >
        {initData.map(fieldInfo => (
          <CustomStyle className="box" style={styleBox}>
            <div
              className="line"
              style={{ background: `${fieldInfo.color || '#fff'}` }}
            ></div>
            <CustomStyle className="item">
              <CustomStyle className="header">
                {fieldInfo.label}
                <Tooltip placement="right" title={fieldInfo.tooltip}>
                  <img className="tooltip" src={tooltip} alt="" />
                </Tooltip>
              </CustomStyle>
              <CustomStyle
                className="total"
                style={{ color: `${fieldInfo.textColor || fieldInfo.color}` }}
              >
                {fieldInfo.money
                  ? formatMoney(data[fieldInfo.total] || 0)
                  : data[fieldInfo.total] || 0}
              </CustomStyle>
              {time && (
                <CustomStyle className="note">
                  So với cùng kỳ trước :
                  <CustomStyle
                    className="text"
                    style={{
                      color: `${
                        predata[fieldInfo.total] < 0 ? 'red' : 'green'
                      }`,
                    }}
                  >
                    <CustomStyle
                      className={
                        predata[fieldInfo.total] < 0 ? 'icon rotate' : 'icon'
                      }
                    >
                      <CaretUpOutlined />
                    </CustomStyle>
                    {Math.abs(predata[fieldInfo.total]).toFixed(0)}%
                  </CustomStyle>
                </CustomStyle>
              )}
              {cycle && (
                <CustomStyle
                  className="note"
                  style={{ justifyContent: 'normal' }}
                >
                  Chu kỳ:
                  <CustomStyle
                    className="text"
                    style={{ color: '#828282', marginLeft: '8px' }}
                  >
                    {cycle[fieldInfo.total]}
                  </CustomStyle>
                </CustomStyle>
              )}
            </CustomStyle>
          </CustomStyle>
        ))}
      </Row>
    </CustomBoxColor>
  );
}

const CustomBoxColor = styled.div`
  .title {
    color: #333333;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 16px;
  }
  .see-more {
    display: flex;
    align-items: center;
    color: #3d56a6;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .content {
    .box {
      border: 1px solid #efefef;
      box-shadow: 0px 4px 4px rgba(183, 183, 183, 0.25);
      border-radius: 6px;
    }
    .line {
      border-radius: 6px 6px 0px 0px;
      height: 4px;
      z-index: 1;
      width: 100%;
    }
    .item {
      background: #fff;
      width: 100%;
      height: 100%;
      padding: 12px 12px 11px 20px;

      .header {
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        color: #333333;

        .tooltip {
          cursor: pointer;
          margin-left: 6px;
        }
      }

      .total {
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        letter-spacing: 0.01em;
        margin-top: 12px;
      }

      .note {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #828282;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .text {
          display: flex;
          align-items: center;

          .icon {
            width: 14px !important;
          }
          .rotate {
            transform: rotate(-180deg);
          }
        }
      }
    }
  }
`;
