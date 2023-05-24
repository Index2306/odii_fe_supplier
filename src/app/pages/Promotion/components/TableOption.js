import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Table, Spin, Row, Col } from 'antd';
import { selectLoading } from '../slice/selectors';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { isNumber } from 'lodash';
import { Button } from 'app/components';
import { DeleteOutlined } from '@ant-design/icons';
import request from 'utils/request';

export default function TableVarient(props) {
  const {
    data,
    setOption,
    actionCollape,
    products,
    setProducts,
    idInventory,
    setIdInventory,
    isCheckOption,
  } = props;
  const isLoading = useSelector(selectLoading);
  const [vari, setVari] = React.useState(data.slice(0));

  React.useEffect(() => {
    if (!actionCollape || data) {
      setVari(data.slice(0));
    }
  }, [actionCollape, data, idInventory]);

  const handleUpdate = (type, index, record) => e => {
    if (record.promotion_product_id !== idInventory.id) {
      setIdInventory({ id: record.promotion_product_id });
    }
    const newOption = vari.slice(0);
    const value = e?.target?.value ?? e;

    if (isNumber(value)) {
      newOption[index] = {
        ...newOption[index],
        [type]: value,
      };
    } else {
      newOption[index] = {
        ...newOption[index],
        [type]: '',
      };
    }

    if (type === 'value' && value > 100) {
      newOption[index] = {
        ...newOption[index],
        [type]: 0,
      };
    }

    setOption(newOption);
    setVari(newOption);
    products.forEach((item, i) => {
      if (item.id === record.promotion_product_id) {
        setProducts(
          [...products].fill({ ...item, option: newOption }, i, i + 1),
        );
      }
    });
  };

  const handleDelOption = async record => {
    const arrPrt = products.map(item => {
      if (item.id === record.promotion_product_id) {
        const newOption = item.option.filter(i => i.id !== record.id);

        return { ...item, option: newOption };
      }
      return item;
    });

    await request(`user-service/supplier/promotion/${record.id}/option`, {
      method: 'delete',
    });

    setProducts(arrPrt);
  };

  React.useEffect(() => {
    if (data) {
      setVari(data.slice(0));
    }
  }, [actionCollape, data]);

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Sản phẩm</div>
          </div>
        ),
        dataIndex: 'variation',
        key: 'variation',
        width: 250,
        render: (text, record, index) => <></>,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giá NCC</div>
          </div>
        ),
        dataIndex: 'origin_supplier_price',
        key: 'origin_supplier_price',
        width: 100,
        render: (text, record, index) => <></>,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số lượng từ</div>
          </div>
        ),
        dataIndex: 'quantity_from',
        key: 'quantity_from',
        width: 100,
        render: (text, record, index) => (
          <>
            <InputMoney
              // {...layout}
              placeholder="Nhập số lượng"
              value={text}
              onChange={handleUpdate('quantity_from', index, record)}
            />
          </>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Số lượng đến</div>
          </div>
        ),
        dataIndex: 'quantity_to',
        key: 'quantity_to',
        width: 100,
        render: (text, record, index) => (
          <>
            <InputMoney
              // {...layout}
              placeholder="Nhập số lượng"
              value={text}
              onChange={handleUpdate('quantity_to', index, record)}
            />
          </>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giảm giá %</div>
          </div>
        ),
        dataIndex: 'value',
        key: 'value',
        width: 100,
        render: (text, record, index) => (
          <>
            <InputMoney
              // {...layout}
              className={record?.isErrorValue ? 'varidate-value' : ''}
              placeholder="Giảm giá"
              value={text}
              onChange={handleUpdate('value', index, record)}
            />
          </>
        ),
      },

      {
        title: '',
        key: 'status',
        dataIndex: 'status',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (text, record, index) =>
          record?.id &&
          !isCheckOption && (
            <Button
              color="white"
              className="btn btn-delete"
              onClick={() => handleDelOption(record)}
            >
              <DeleteOutlined /> <span>Xóa</span>
            </Button>
          ),
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
                rowSelection={true}
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

  .btn {
    height: 36px;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    span {
      font-weight: 500;
      margin-left: 6px;
    }
    &-delete {
      color: #eb5757;
    }
    &-lockup {
      color: #3d56a6;
    }
  }
  .varidate-value {
    border: '1px solid red';
  }
`;
