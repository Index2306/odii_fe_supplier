import * as React from 'react';
import styled from 'styled-components';
// import { defaultImage } from 'assets/images';
import { useSelector } from 'react-redux';
import { CustomStyle } from 'styles/commons';
import { Table, Spin, Row, Col, Tooltip } from 'antd';
import { DatePicker, InputNumber } from 'app/components';
// import { selectLoading } from '../slice/selectors';
import { formatMoney } from 'utils/helpers';
// import constants from 'assets/constants';
// import { EditOutlined } from '@ant-design/icons';
import { isNumber } from 'lodash';
import { DeleteOutlined, WarningTwoTone } from '@ant-design/icons';

export default function TableVarient(props) {
  const { data, setVariant } = props;
  const isLoading = false;
  const [vari, setVari] = React.useState(data.slice(0));

  const columns = React.useMemo(
    () => [
      {
        title: 'STT',
        width: '5%',
        align: 'center',
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
        render: (text, record) => {
          const options = [record.option_1, record.option_2, record.option_3];
          return (
            <CustomStyle textAlign="center">
              {options.filter(item => item).join(' - ')}
            </CustomStyle>
          );
        },
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
        width: '15%',
        dataIndex: 'total_quantity',
        key: 'total_quantity',
        render: (text, record) => (
          <InputNumber
            disabled={false}
            placeholder="Số lượng nhập"
            value={text}
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày sản xuất</div>
          </div>
        ),
        dataIndex: 'top_category',
        key: 'top_category',
        width: '16%',
        render: (text, record) => (
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Nếu có"
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày hết hạn</div>
          </div>
        ),
        dataIndex: 'top_category',
        key: 'top_category',
        width: '16%',
        render: (text, record) => (
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Nếu có"
          />
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mã QR code</div>
          </div>
        ),
        key: 'qrcode',
        dataIndex: 'qrcode',
        width: '15%',
        render: (text, _, index) => {
          return <div className=""></div>;
        },
      },
      {
        title: '',
        key: 'status',
        dataIndex: 'status',
        width: '5%',
        render: (text, _, index) => <DeleteOutlined />,
      },
    ],
    [data, vari],
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
                rowSelection={false}
              ></Table>
            </div>
          </Col>
        </Row>
      </Spin>
    </TableVarientCustom>
  );
}

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
    right: -25px;
    z-index: 1;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
`;
