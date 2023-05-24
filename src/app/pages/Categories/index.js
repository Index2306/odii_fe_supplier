/**
 *
 * Categories
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Switch, Space } from 'antd';
import { isEmpty } from 'lodash';
import { Button, Table, PageWrapper, Link } from 'app/components';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useCategoriesSlice } from './slice';
import { FilterBar } from './Features';
import { selectLoading, selectData, selectPagination } from './slice/selectors';
import { messages } from './messages';
import Confirm from 'app/components/Modal/Confirm';

export function Categories({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useCategoriesSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);

  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [newStatus, setNewStatus] = React.useState({});

  React.useEffect(() => {
    gotoPage();
  }, []);

  const gotoPage = ({ p = pagination.page } = {}) => {
    dispatch(actions.getData({ page: p }));
  };

  const onPageChange = ({ current }) => {
    gotoPage({ p: current });
  };

  const handleStatus = () => {
    dispatch(
      actions.update({
        id: detail.id,
        data: {
          ...detail,
          status: newStatus.id,
        },
      }),
    );
    setNewStatus('');
    toggleConfirmModal(true);
  };

  const toggleConfirmModal = needRefresh => {
    if (needRefresh === true) gotoPage();
    if (isShowConfirmStatus) setDetail({});
    setIsShowConfirmStatus(!isShowConfirmStatus);
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box stt">STT</div>
          </div>
        ),
        width: 60,
        dataIndex: 'key',
        key: 'key',
        render: (_, v, i) => i + 1,
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">ID</div>
      //       {/* <div className="addition"></div> */}
      //     </div>
      //   ),
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tên</div>
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        width: 170,
        render: (text, record) => (
          <Link
            style={{ textDecoration: 'none' }}
            to={`/categories/${record.id}/detail`}
          >
            {text}
          </Link>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Thumb</div>
          </div>
        ),
        dataIndex: 'thumb',
        key: 'thumb',
        width: 150,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Mô tả</div>
          </div>
        ),
        dataIndex: 'description',
        key: 'description',
        width: 250,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">ID Cha</div>
          </div>
        ),
        dataIndex: 'parent_id',
        key: 'parent_id',
        width: 70,
        align: 'center',
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Status</div>
          </div>
        ),
        dataIndex: 'parent_id',
        key: 'parent_id',
        width: 100,
        align: 'center',
        render: () => (
          <Switch
            checkedChildren="Active"
            unCheckedChildren="DeActive"
            defaultChecked
          />
        ),
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">ID Danh mục con</div>
      //     </div>
      //   ),
      //   dataIndex: 'child_id',
      //   key: 'child_id',
      //   width: 300,
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Action</div>
          </div>
        ),
        key: 'action',
        width: 200,
        align: 'center',
        render: (_, record) => (
          <Space size="middle">
            <Link
              style={{ textDecoration: 'none' }}
              to={`/categories/uc/${record.id}`}
            >
              Edit
            </Link>
          </Space>
        ),
      },
    ],
    [data],
  );
  const goCreate = () => {
    history.push(`/categories/uc`);
  };
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {},
  //   onSelect: (record, selected, selectedRows) => {},
  //   onSelectAll: (selected, selectedRows, changeRows) => {},
  // };
  return (
    <PageWrapper>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <FilterBar isLoading={isLoading} gotoPage={gotoPage} />
      </CustomSectionWrapper>
      <CustomSectionWrapper className="">
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <CustomHeader className="header d-flex justify-content-between">
                  <CustomH3 className="title text-left">
                    {t(messages.title()).toUpperCase()}
                  </CustomH3>

                  <div className="d-flex justify-content-end">
                    {/* <CustomStyle pb={{ xs: 's5' }} fontWeight="bold">
                     Thời gian
                   </CustomStyle> */}
                    <Button
                      className="btn-sm "
                      onClick={goCreate}
                      color="green"
                      disabled={isLoading}
                    >
                      Tạo mới
                    </Button>
                  </div>
                </CustomHeader>
                {isEmpty(data) || (
                  <Table
                    className="custom tableCategory"
                    columns={columns}
                    rowClassName="pointer"
                    dataSource={data || []}
                    scroll={{ x: 1100, y: 1000 }}
                    onChange={onPageChange}
                    // onRow={record => ({
                    //   onClick: goDetail(record),
                    // })}
                    hideExpandIcon
                    defaultExpandAllRows={true}
                    expandIconAsCell={false}
                    // expandIconColumnIndex={-1}
                    // indentSize={15}
                    // rowSelection={{ ...rowSelection }}
                    pagination={{
                      showSizeChanger: false,
                      // hideOnSinglePage: true,
                      pageSize: 10,
                      total: pagination ?? 0,
                      showTotal: total => <b>Hiển thị {total} trên tổng 10</b>,
                    }}
                    rowKey={record => record.id}
                  />
                )}
              </div>
            </Col>
          </Row>
        </Spin>
      </CustomSectionWrapper>
      {isShowConfirmStatus && (
        <Confirm
          data={detail}
          title={`Xác nhận '${newStatus.name}'`}
          isModalVisible={isShowConfirmStatus}
          handleCancel={toggleConfirmModal}
          handleConfirm={handleStatus}
        />
      )}
    </PageWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  .tableCategory tr td:first-child {
    padding: 16px 0;
  }
  /* .ant-table-row-expand-icon { */
  /* visibility: hidden; */
  /* } */
`;

const CustomHeader = styled.div`
  margin-bottom: 12px;
`;
