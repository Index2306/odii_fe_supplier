import * as React from 'react';
import styled from 'styled-components';
// import { defaultImage } from 'assets/images';
import { useSelector } from 'react-redux';
import { CustomStyle } from 'styles/commons';
import { Table, Spin, Row, Col, InputNumber, Tooltip } from 'antd';
// import { Image, BoxColor, Button } from 'app/components';
import { selectLoading } from '../slice/selectors';
import { formatMoney } from 'utils/helpers';
// import constants from 'assets/constants';
// import { EditOutlined } from '@ant-design/icons';
import { isNumber } from 'lodash';
import { WarningTwoTone } from '@ant-design/icons';

export default function TableVarient(props) {
  const {
    data,
    setVariant,
    actionCollape,
    setIdInventory,
    idInventory,
  } = props;
  const isLoading = useSelector(selectLoading);
  const [vari, setVari] = React.useState(data.slice(0));

  const handleUpdate = (value, id, product_stock_id, type) => {
    if (product_stock_id !== idInventory) {
      setIdInventory({ id: product_stock_id });
    }
    if (isNumber(value)) {
      const handleVariations = vari.map(item => ({
        ...item,
        total_quantity:
          item.id === id && type === 'total_quantity'
            ? value
            : item['total_quantity'],
        real_quantity:
          item.id === id && type === 'real_quantity'
            ? value
            : item['real_quantity'],
      }));
      setVari(handleVariations);
      setVariant(handleVariations);
    }
  };

  React.useEffect(() => {
    if (data && !isLoading) {
      setVari(data);
    }
  }, [actionCollape, data]);

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Biến thể</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        // width: 170,
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Ngành hàng
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: '12%',
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Biến thể
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: '7%',
        render: (text, record) => (
          <CustomStyle textAlign="center">
            {record.option_1} - {record.option_2} {record.option_3}
          </CustomStyle>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle className="title-box" pl={{ xs: 's4' }}>
              Tồn kho
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: '7%',
        dataIndex: 'total_quantity',
        key: 'total_quantity',
        render: (text, record) => (
          <CustomStyle
            justifyContent="center"
            display="flex"
            alignItems="center"
            position="relative"
          >
            <InputNumber
              type="number"
              value={text || 0}
              onChange={e =>
                handleUpdate(
                  e,
                  record.id,
                  record.product_stock_id,
                  'total_quantity',
                )
              }
            />
            <div className="warning-icon">
              {record.zero_quantity_warn && (
                <>
                  <Tooltip title="Hết hàng">
                    <WarningTwoTone twoToneColor="#f10202" />
                  </Tooltip>
                </>
              )}
              {!record.zero_quantity_warn && record.low_quantity_warn && (
                <>
                  <Tooltip title="Sắp hết hàng">
                    <WarningTwoTone twoToneColor="#f3b506" />
                  </Tooltip>
                </>
              )}
            </div>
          </CustomStyle>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Lượt chọn</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: '7%',
        dataIndex: 'real_quantity',
        key: 'real_quantity',
        render: (text, record) => (
          <CustomStyle
            justifyContent="center"
            display="flex"
            alignItems="center"
            position="relative"
          >
            <InputNumber
              type="number"
              value={text || 0}
              onChange={e =>
                handleUpdate(
                  e,
                  record.id,
                  record.product_stock_id,
                  'real_quantity',
                )
              }
            />
          </CustomStyle>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Kho lấy hàng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: 120,
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Kho trả hàng</div>
      //       {/* <div className="addition"></div> */}
      //     </div>
      //   ),
      //   width: 120,
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giá NCC</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: '8%',
        dataIndex: 'origin_supplier_price',
        key: 'origin_supplier_price',
        render: text =>
          text && (
            <CustomStyle textAlign="left" fontWeight={500}>
              {formatMoney(text)}
            </CustomStyle>
          ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giá Gợi ý</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: '8%',
        dataIndex: 'recommend_retail_price',
        key: 'recommend_retail_price',
        render: text =>
          text && (
            <CustomStyle textAlign="left" fontWeight={500}>
              {formatMoney(text)}
            </CustomStyle>
          ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        width: '10%',
      },
    ],
    [vari],
  );

  return (
    <TableVarientCustom>
      <Spin tip="Đang tải..." spinning={isLoading || data ? false : true}>
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <Table
                columns={columns}
                dataSource={vari}
                pagination={false}
                rowSelection={true}
              ></Table>
            </div>
          </Col>
        </Row>
      </Spin>
    </TableVarientCustom>
  );
}

// const WrapperOption = styled.div`
//   .ant-image {
//     width: 32px;
//     border-radius: 4px;
//   }
//   .ant-list-item-meta {
//     align-items: center;
//   }
//   .ant-list-item-meta-title > * {
//     overflow: hidden;
//     /* text-align: justify; */
//     display: -webkit-box;
//     -webkit-box-orient: vertical;
//     text-overflow: ellipsis;
//     line-height: 18px; /* fallback */
//     max-height: 36px;
//     -webkit-line-clamp: 2; /* number of lines to show */
//   }
//   .ant-list-item-meta-description {
//     font-weight: 400;
//     font-size: 12;
//     color: rgba(0, 0, 0, 0.4);
//   }

//   .ant-list-item-meta-avatar {
//     margin-right: 6px;
//   }

//   .ant-image-img {
//     width: 35px;
//   }
// `;

const TableVarientCustom = styled.div`
  .ant-list-item {
    padding: 5px 30px;
  }
  .ant-table-thead {
    display: none;
  }
  .ant-table-selection-column {
    opacity: 0;
  }
  .ant-table-tbody > tr {
    height: 44px;
  }
  .ant-table-tbody > tr > td {
    padding: 0px 10px !important;
    border-bottom: 1px solid #fff !important;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #f6f6fb !important;
  }
  .warning-icon {
    position: absolute;
    right: 10px;
    top: 4px;
    z-index: 1;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
`;
