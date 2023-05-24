import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import { RightOutlined } from '@ant-design/icons';
import { formatMoney } from 'utils/helpers';
import { Link } from 'react-router-dom';

export default function BoxList(props) {
  const { initData, title, data, row, goto, money } = props;

  return (
    <CustomWork style={{ minHeight: `${row === 'column' && '490px'}` }}>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="header"
      >
        <CustomStyle className="title">{title}</CustomStyle>
        {goto && (
          <CustomStyle className="see-more">
            <Link to={goto} style={{ color: "#3d56a6" }}>
              Xem thêm
            </Link>
            <RightOutlined style={{ marginLeft: 5 }} />
          </CustomStyle>
        )}
      </CustomStyle>
      <Row
        style={{
          flexDirection: `${row}`,
          marginTop: `${row === 'column' && '45px'}`,
        }}
      >
        {initData.map(item => (
          <Col span={row == 'row' && 6}>
            <Link to={item.link}>
              <CustomStyle
                className="box"
                colorBox={item.colorBox}
                style={{ marginBottom: `${money && '40px'}` }}
              >
                <CustomStyle marginRight={{ xs: 's4' }}>
                  <img src={item.icon} alt="" />
                </CustomStyle>
                <CustomStyle
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <CustomStyle color="#828282" fontWeight={400}>
                    {item.title}
                  </CustomStyle>
                  <CustomStyle className="total" display="flex">
                    <span className="number">
                      {money
                        ? formatMoney(data[item.total] || 0)
                        : data[item.total] || 0}
                    </span>
                    {/* <span className="box">{item.percent}</span> */}
                  </CustomStyle>
                </CustomStyle>
              </CustomStyle>
            </Link>
          </Col>
        ))}
      </Row>
    </CustomWork>
  );
}

const CustomWork = styled.div`
  padding: 24px 21.15px 26px;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;

  .header {
    margin-bottom: 20px;

    .see-more {
      display: flex;
      align-items: center;
      color: #3d56a6;

      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .title {
    color: #333333;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
  }
  .box {
    display: flex;
    padding: 12px;

    &:hover {
      background: #f7f7f9;
      border-radius: 6px;
      cursor: pointer;
    }
  }
  .total {
    color: #333333;
    font-weight: 500;
    font-size: 22px;
    line-height: 26px;
  }
`;
