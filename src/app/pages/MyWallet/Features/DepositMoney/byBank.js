import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { formatMoney } from 'utils/helpers';
// import { useTranslation } from 'react-i18next';
import {
  Row,
  Col,
  Form as F,
  Tabs,
  Modal,
  notification,
  Dropdown,
  Skeleton,
} from 'antd';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import {
  selectLoading,
  selectDataBank,
  selectDataCreateBankTransaction,
} from '../../slice/selectors';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMyWalletSlice } from '../../slice';
import { Form, Button, LoadingIndicator, Image } from 'app/components';
import {
  SectionWrapper,
  CustomH3,
  CustomH2,
  CustomStyle,
} from 'styles/commons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CustomTabs, CustomBank, CustomMenu } from '../../styles';

const Item = F.Item;
const { TabPane } = Tabs;

function Bank({ match, history }) {
  // const { t } = useTranslation();
  const dispatch = useDispatch();
  const dataBanks = useSelector(selectDataBank);
  const dataCreateBankTransaction = useSelector(
    selectDataCreateBankTransaction,
  );

  const { actions } = useMyWalletSlice();
  const isLoading = useSelector(selectLoading);

  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [bank, setBank] = useState('');
  const [amount, setAmount] = useState('');
  const [suggestAmount, setSuggestAmount] = useState('');
  const [AmountShow, setAmountShow] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const [isShowError, setIsShowError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isShowSuggest, setIsShowSuggest] = useState(false);
  const [isShowSuggestInput, setIsShowSuggestInput] = useState(true);

  useEffect(() => {
    dispatch(actions.getDataBank({}));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(actions.getDataBankDone({}));
    };
  }, []);

  const optionsAmount = [
    1000000,
    2000000,
    3000000,
    5000000,
    10000000,
    15000000,
  ];

  const goModalChose = dataBank => {
    setIsShow(true);
    setBank(dataBank);
  };
  const goSetStatusPending = () => {
    setIsShowModalConfirm(true);
    dispatch(
      actions.setStatusPending({
        id: dataCreateBankTransaction?.id,
        data: {},
      }),
    );
  };

  const onClose = () => {
    setIsShowSuggest(false);
    setIsShow(false);
  };

  const onCloseModalConfirm = () => {
    setIsShowModalConfirm(false);
    setIsDone(false);
  };

  const menu = isShowSuggestInput ? (
    <CustomMenu className="c">
      <div className="options-suggest">
        {suggestAmount
          ? suggestAmount.map((option, index) => (
              <>
                <div
                  key={option}
                  className={
                    amount === option.amount
                      ? 'option-suggest selected'
                      : 'option-suggest'
                  }
                  onClick={() => goSetAmount(option.amount)}
                >
                  {option.current_format}
                </div>
              </>
            ))
          : ''}
      </div>
    </CustomMenu>
  ) : (
    <></>
  );

  // Suggest Amount
  const functSuggestAmount = amount =>
    [100000, 1000000, 10000000]
      .map(
        i =>
          parseInt(amount * i * 10, 10) /
          Math.pow(10, amount?.toString().length),
      )
      .map(i => ({
        amount: i,
        current_format: formatMoney(i),
      }));

  const goSetAmount = value => {
    setAmount(value);
    setIsShowSuggest(false);
    setAmountShow(value);
  };

  const goSetAmountSuggest = value => {
    setAmount(value);
    setAmountShow(value);
    setIsShowSuggest(true);
    if (0 < value && value < 1000000) {
      setSuggestAmount(functSuggestAmount(value));
    }
    if (value === 0 || value === '' || value === null || isNaN(value)) {
      setSuggestAmount([]);
      setIsShowSuggest(false);
    }
  };

  const handleDelete = record => {
    dispatch(
      actions.deleteTransaction({
        id: record?.id,
        data: {
          is_delete: true,
        },
      }),
    );
  };

  const clear = () => {
    setIsDisabled(true);
    setBank('');
    setAmount('');
    setIsDone(false);
    setIsShowModalConfirm(false);
    setActiveKey(1);
  };

  const goMyWallet = () => {
    clear();
    window.location.href = '/mywallet';
  };

  const goNewTransaction = () => {
    clear();
    window.location.href = '/mywallet/deposit';
  };
  const copyToClipboard = values => {
    const content = {
      message: 'Copy thành công !',
      description: 'Nội dung:' + values,
      duration: 2,
    };
    notification.open(content);
  };

  // Tab
  const tab1 = () => {
    return (
      <div className="d-flex">
        <div className={isDone ? 'number-circle done' : 'number-circle'}>1</div>
        <div>Chọn tài khoản</div>
      </div>
    );
  };
  const tab2 = () => {
    return (
      <div className="d-flex">
        <div
          className={isDisabled ? 'number-circle disabled' : 'number-circle '}
        >
          2
        </div>
        <div>Xác nhận</div>
      </div>
    );
  };

  const layout = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 24, sm: 12, md: 10 },
  };

  const onFinish = async values => {
    setIsLoadingBtn(true);
    if (amount < 50000) {
      setMessageError('Vui lòng nhập hoặc chọn số tiền tối thiểu 50.000đ');
      setIsShowError(true);
      setIsLoadingBtn(false);
    }
    if (!amount) {
      setMessageError('Vui lòng nhập hoặc chọn số tiền muốn rút');
      setIsShowError(true);
      setIsLoadingBtn(false);
    }
    if (amount >= 50000) {
      await dispatch(
        actions.createBankTransaction({
          data: {
            amount: amount,
            bank_id: bank.id,
            type: 'deposit',
          },
        }),
      );
      await setTimeout(() => {
        setIsLoadingBtn(false);
        setActiveKey('2');
        setIsShowError(false);
        setMessageError('');
        setIsShow(false);
        setIsDone(true);
        setIsDisabled(false);
      }, 2000);
    }
  };

  return (
    <>
      <SectionWrapper>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 16 }} />
        ) : (
          <>
            <CustomH3 mb={{ xs: 's4' }}>Chuyển khoản ngân hàng</CustomH3>
            <p>
              Vui lòng chọn và chuyển khoản đến một trong các tài khoản chính
              thức của Odii sau đây :
            </p>
            <div>
              <CustomTabs defaultActiveKey={activeKey} activeKey={activeKey}>
                <TabPane tab={tab1()} key="1">
                  {dataBanks
                    ? dataBanks.map((dataBank, index) => (
                        <CustomBank
                          key={index}
                          className="justify-content-between"
                        >
                          <div className="d-flex">
                            <div className="bank-logo">
                              <img
                                className="logo"
                                src={dataBank?.bank_data?.logo?.origin}
                                alt={dataBank?.bank_data?.title}
                              ></img>
                            </div>
                            <div>
                              <div className="bank-title">
                                {dataBank?.bank_data?.title}
                              </div>
                              <div className="bank-sub_title">
                                {dataBank.sub_title}
                              </div>
                            </div>
                          </div>
                          <CustomButton
                            context="secondary"
                            // color="default"
                            className="btn-sm mr-2"
                            onClick={() => {
                              goModalChose(dataBank);
                            }}
                          >
                            Nạp tiền
                          </CustomButton>
                        </CustomBank>
                      ))
                    : ''}
                </TabPane>
                <TabPane tab={tab2()} key="2" disabled={isDisabled}>
                  <div className="title-confirm">
                    Xác nhận thông tin nạp tiền
                  </div>
                  <CustomBank className="justify-content-between">
                    <div className="d-flex">
                      <div className="bank-logo">
                        <img
                          className="logo"
                          src={bank?.bank_data?.logo?.origin}
                          alt={bank?.bank_data?.title}
                        ></img>
                      </div>
                      <div>
                        <div className="bank-title">
                          {bank?.bank_data?.title}
                        </div>
                        <div className="bank-sub_title">{bank?.sub_title}</div>
                      </div>
                    </div>
                    <div className="right">
                      <div className="amount-title">Số tiền nạp</div>
                      <div className="amount">{formatMoney(amount)}</div>
                    </div>
                  </CustomBank>
                  <Row className="info-bank" gutter={8}>
                    <Col xs={24} lg={12}>
                      <div className="title">Số tài khoản</div>
                      <div className="bank bank-number">
                        <div className="content">{bank?.account_number}</div>
                        <CopyToClipboard text={bank?.account_number}>
                          <button
                            className="btn-copy"
                            onClick={() =>
                              copyToClipboard(bank?.account_number)
                            }
                          >
                            <CopyOutlined />
                          </button>
                        </CopyToClipboard>
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="title">Tên tài khoản</div>
                      <div className="bank bank-text">
                        <div className="content">{bank?.account_name}</div>
                        <CopyToClipboard text={bank?.account_name}>
                          <button
                            className="btn-copy"
                            onClick={() => copyToClipboard(bank?.account_name)}
                          >
                            <CopyOutlined />
                          </button>
                        </CopyToClipboard>
                      </div>
                    </Col>
                  </Row>
                  <div className="info-bank">
                    <div className="title">Mã chuyển khoản</div>
                    <div className="bank bank-text">
                      <div className="content">
                        {dataCreateBankTransaction?.short_code}
                      </div>
                      <CopyToClipboard
                        text={dataCreateBankTransaction?.short_code}
                      >
                        <button
                          className="btn-copy"
                          onClick={() =>
                            copyToClipboard(
                              dataCreateBankTransaction?.short_code,
                            )
                          }
                        >
                          <CopyOutlined />
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <div className="note">
                    {bank?.thumb && (
                      <div className="info-bank">
                        <div className="title">Mã QR</div>
                        <div className="text-center" label="Mã QR" {...layout}>
                          <Image
                            name="thumb"
                            size="500x500"
                            src={bank?.thumb?.location || bank?.thumb?.origin}
                            alt="qrBank"
                          />
                        </div>
                      </div>
                    )}
                    <div className="guide">
                      <span className="bold">Lưu ý: </span> Bạn thực hiện chuyển
                      khoản vào tài khoản Admin bên trên với nội dung và số tiền
                      đã chọn, sau khi chuyển khoản thành công hãy bấm nút{' '}
                      <span className="bold">"Đã chuyển xong"</span> để xác
                      nhận.
                    </div>
                  </div>
                </TabPane>
              </CustomTabs>
            </div>
          </>
        )}
      </SectionWrapper>
      {isDone === true ? (
        <Row className="justify-content-end">
          <Col>
            <Button
              context="secondary"
              color="default"
              className="btn-sm"
              style={{
                marginRight: '12px',
                color: 'white',
                background: '#6C798F',
              }}
              // onClick={goMyWallet}
              onClick={() => handleDelete(dataCreateBankTransaction)}
            >
              Hủy
            </Button>
          </Col>
          <Col>
            <Button
              color="blue"
              className="btn-sm"
              onClick={goSetStatusPending}
            >
              Đã chuyển xong
            </Button>
          </Col>
        </Row>
      ) : (
        ''
      )}
      <CustomModal
        name="modal_choseMoney"
        visible={isShow}
        footer={null}
        onCancel={onClose}
      >
        <Form name="normal_form" className="chose-form" onFinish={onFinish}>
          <CustomItem>
            <CustomH2 className="title">Nạp tiền vào tài khoản</CustomH2>
            <p className="content">Vui lòng nhập số tiền bạn muốn nạp</p>
          </CustomItem>

          <CustomItem>
            <CustomUl>
              {optionsAmount
                ? optionsAmount.map((option, index) => (
                    <li
                      key={index}
                      className={amount === option ? 'selected' : ''}
                      onClick={() => goSetAmount(option)}
                    >
                      {formatMoney(option)}
                    </li>
                  ))
                : ''}
              <Dropdown
                overlay={menu}
                trigger={['click']}
                visible={isShowSuggest}
                onVisibleChange={value => {
                  setIsShowSuggestInput(value);
                }}
              >
                <CustomStyle width={210}>
                  <InputMoney
                    size="large"
                    // type="number"
                    placeholder="Nhập số tiền ..."
                    value={AmountShow}
                    onChange={goSetAmountSuggest}
                  />
                </CustomStyle>
              </Dropdown>
            </CustomUl>
          </CustomItem>
          {isShowError && <div className="alert-err">{messageError}</div>}
          <CustomItem>
            <Button
              type="primary"
              className="btn-sm"
              color="blue"
              width="97%"
              htmlType="submit"
            >
              {isLoadingBtn && (
                <>
                  <LoadingOutlined />
                  &ensp;
                </>
              )}
              Tiếp theo
            </Button>
          </CustomItem>
        </Form>
      </CustomModal>
      <CustomModal
        name="modal_confirm"
        visible={isShowModalConfirm}
        footer={null}
        onCancel={onCloseModalConfirm}
      >
        {isLoading && <LoadingIndicator />}
        <Form
          name="normal_form"
          className="chose-form"
          onFinish={goNewTransaction}
        >
          <CustomItem>
            <CustomH2 className="title">
              Hệ thống đang xác thực giao dịch
            </CustomH2>
            <p className="content">
              Vui lòng chờ Admin xác nhận số dư tài khoản thành công, tài khoản
              của bạn sẽ được tăng thêm số dư tương ứng !
            </p>
          </CustomItem>
          <CustomItem>
            <Button
              type="primary"
              className="btn-sm"
              color="blue"
              width="97%"
              onClick={goNewTransaction}
            >
              Thực hiện giao dịch mới
            </Button>
          </CustomItem>
          <CustomItem>
            <Button
              context="secondary"
              className="btn-sm"
              color="default"
              style={{
                marginTop: '12px',
                color: 'white',
                background: '#6C798F',
              }}
              width="97%"
              onClick={goMyWallet}
            >
              Trở về ví của bạn
            </Button>
          </CustomItem>
        </Form>
      </CustomModal>
    </>
  );
}
export default Bank;

const CustomButton = styled(Button)`
  width: 110px;
  color: #3d56a6;
  font-weight: 500;
  margin: auto 0;
  border: 1px solid #3d56a6;
  &:hover {
    color: white;
  }
`;

const CustomModal = styled(Modal)`
  .hide {
    visibility: hidden;
  }
  .alert-err {
    margin-top: -20px;
    text-align: center;
    color: #ff4d4f;
  }
  .ant-modal {
    &-content {
      min-width: 564px;
      border-radius: 6px;
    }
    &-body {
      padding: 35px 44px;
    }
  }
`;
const CustomItem = styled(Item)`
  text-align: center;
  margin-bottom: 0;
  .title {
    font-weight: bold;
    font-size: 30px;
    line-height: 35px;
    color: #3d56a6;
    margin-bottom: 4px;
  }
  .content {
    line-height: 22px;
    letter-spacing: 0.03em;
    color: #333333;
    margin-bottom: 24px;
  }
`;

const CustomUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    list-style: none;
    padding: 9px 13px;
    background: #f7f7f9;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    border-radius: 6px;
    min-width: 102px;
    margin-right: 15px;
    margin-bottom: 14px;
    &.selected {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
    &:hover {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
    &:active {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
  }
  input {
    /* max-width: 208px; */
    height: 36px;
    /* border: 1px solid #ebebf0; */
    /* border-radius: 6px; */
    &::placeholder {
      color: #828282;
    }
  }
`;
