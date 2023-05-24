/* eslint-disable react-hooks/rules-of-hooks */
import React, { memo, useMemo, useState, useRef } from 'react';
import { Button, Form, Row } from 'antd';
import { logoSmall } from 'assets/images';
import { QRCodeSVG } from 'qrcode.react';
import moment from 'moment';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { selectDetail } from '../slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { selectData as selectListUser } from 'app/pages/Employees/slice/selectors';
import { useEmployeesSlice } from 'app/pages/Employees/slice';
import { useReactToPrint } from 'react-to-print';

export default memo(function formatExport({
  id,
  productList,
  setselectedProducts,
}) {
  const dispatch = useDispatch();
  const [products, setProducts] = useState();
  const data = useSelector(selectDetail);
  const [form] = Form.useForm();
  const { setFieldsValue, getFieldValue } = form;
  const listUser = useSelector(selectListUser);
  const employeesSlice = useEmployeesSlice();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'phieu_xuat',
    pageStyle: `@page {
      size: A4;
      margin: 20mm !important;
    }`,
  });

  React.useEffect(() => {
    if (products) {
      setselectedProducts(products);
    }
  }, [products]);

  React.useEffect(() => {
    if (productList) {
      setProducts(productList);
    }
  }, [productList]);

  React.useEffect(() => {
    if (isEmpty(listUser)) {
      dispatch(employeesSlice.actions.getData(''));
    }
  }, [listUser]);

  React.useEffect(() => {
    if (!isEmpty(data)) {
      setFieldsValue({
        reason: data?.reason || '',
        time_export: data?.time_export ? moment(data?.time_export) : null,
        created_at: moment(data?.created_at),
        user_export_id: data?.user_export_id || '',
        user_created_id: data?.user_created_id || '',
      });
      setProducts(data?.products || [{}]);
    }
  }, [data]);

  const formDetail = () => (
    <div style={{ marginLeft: '10px', fontSize: '14px' }}>
      <Row>
        <span>Người tạo:&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {listUser?.map(v => {
          if (v.id === getFieldValue('user_created_id'))
            return <span>{v.full_name}</span>;
        })}
      </Row>
      <Row>
        <span>Thời gian tạo:&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>
          {data?.created_at
            ? moment(data?.created_at).format('DD/MM/YYYY')
            : null}
        </span>
      </Row>
      <Row>
        <span>Lý do xuất kho:&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>{data?.reason}</span>
      </Row>
    </div>
  );

  return (
    <>
      <Button
        style={{
          margin: 'auto',
          display: 'block',
          float: 'right',
        }}
        className="btn-sm"
        color="blue"
        onClick={handlePrint}
      >
        Bắt đầu in
      </Button>
      <br />
      <br />
      <Div style={{ textAlign: 'center' }} ref={componentRef}>
        <h2>PHIẾU XUẤT KHO</h2>
        <div>
          Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{' '}
          {new Date().getFullYear()}
        </div>
        <br />
        {formDetail()}

        <table className="table-custom">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th style={{ width: '10%' }}>SL</th>
              <th>NSX</th>
              <th>HSD</th>
              <th>Mã Qr</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((record, i) => (
              <tr key={i}>
                <td className="center">{i + 1}</td>
                <td className="text-left">
                  <div className="product-name-wrapper">
                    <div className="product-name__text">
                      <div className="product-name">
                        {record?.variation?.productName}
                      </div>
                      <div className="product-name">
                        {record?.variation?.name}
                      </div>
                      <div className="product-sku">
                        {record?.variation?.sku || record?.product?.sku}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="center">{record?.total_quantity}</td>
                <td className="center">
                  {data?.products?.production_date
                    ? moment(data?.products?.production_date).format(
                        'DD/MM/YYYY',
                      )
                    : 'Không có'}
                </td>
                <td className="center">
                  {data?.products?.expiry_date
                    ? moment(data?.products?.expiry_date).format('DD/MM/YYYY')
                    : 'Không có'}
                </td>
                <td style={{ padding: '17px 7px' }}>
                  <div className="center" style={{ cursor: 'pointer' }}>
                    {record.code && (
                      <QRCodeSVG
                        value={record.code}
                        size={70}
                        bgColor={'#ffffff'}
                        fgColor={'#000000'}
                        level={'L'}
                        includeMargin={false}
                        imageSettings={{
                          src: logoSmall,
                          x: undefined,
                          y: undefined,
                          height: 16,
                          width: 16,
                          excavate: true,
                        }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right' }}>
          <div>
            Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{' '}
            {new Date().getFullYear()}
          </div>
          <strong>
            {' '}
            Người tạo phiếu &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{' '}
          </strong>
          <br />
          <i>
            (Ký, ghi rõ họ tên)&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{' '}
          </i>
        </div>
      </Div>
    </>
  );
});

const Div = styled.div`
    font-size: 14px;
    .table-custom {
      width: 715px;
      border: 1px solid black;
      margin: 10px 7px;
      font-size: 14px;
  
      th,
      td {
        border: 1px solid black;
        padding: 4px 6px;
        white-space: nowrap;
      }

      th {
        padding: 6px;
        font-size: 15px;
      }
  
      .center {
        text-align: center;
      }
  
      .text-left {
        text-align: left;
        width: 28%;
      }
  
      .product-name-wrapper {
        display: flex;
        align-items: center;
        .product-name__text {
          letter-spacing: 0.02rem;
          margin-left: 3px;
          .product-name {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
          }
        }
        .product-sku {
          font-size: 12px;
          color: ${({ theme }) => theme.gray3};
        }
      }
    }
  }
`;
