import React, { useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Space } from 'antd';
import { Form, Button } from 'app/components';
import { useMyWalletSlice } from '../slice';
import {
  CustomModalWithdrawal,
  CustomMenu,
  CustomBelanceAvailable,
  CustomBank,
  CustomUl,
} from '../styles';
import { successWithdrawal } from 'assets/images/icons';
import { LoadingOutlined } from '@ant-design/icons';
import {
  selectDataBalance,
  selectDataCreateBankTransaction,
} from '../slice/selectors';
import { CustomStyle } from 'styles/commons';
import { formatMoney } from 'utils/helpers';
import { InputMoney } from 'app/components/DataEntry/InputNumber';

const Item = Form.Item;

export default memo(function ModalWithdrawal({
  layout,
  // isLoading,
  dataBankVN,
  bank,
  isShowModalWithdrawal,
  setIsShowModalWithdrawal,
}) {
  const optionsAmount = [
    1000000,
    2000000,
    3000000,
    5000000,
    10000000,
    15000000,
  ];

  const dispatch = useDispatch();
  const dataBalance = useSelector(selectDataBalance);
  const dataCreateBankTransaction = useSelector(
    selectDataCreateBankTransaction,
  );
  const { actions } = useMyWalletSlice();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [suggestAmount, setSuggestAmount] = useState('');
  const [AmountShow, setAmountShow] = useState('');
  const [isShowError, setIsShowError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isShowSuggest, setIsShowSuggest] = useState(false);
  const [isShowSuggestInput, setIsShowSuggestInput] = useState(true);

  const handleCloseModal = () => {
    setIsShowModalWithdrawal(false);
    setIsShowSuggest(false);
    setAmount('');
    setAmountShow('');
    setIsDone(false);
    setIsShowError('');
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

  const goMyWallet = () => {
    window.location.href = '/mywallet';
  };

  const goNewTransaction = () => {
    // window.location.href = '/mywallet/withdrawal';
    setAmount('');
    setSuggestAmount('');
    setAmountShow('');
    setIsShowError('');
    setMessageError('');
    setIsDone(false);
    setIsShowSuggest(false);
    setIsShowSuggestInput(true);

    setIsShowModalWithdrawal(false);
  };

  const onFinishWithdrawal = async values => {
    setIsLoading(true);

    if (amount < 50000) {
      setMessageError('Vui lòng nhập hoặc chọn số tiền tối thiểu 50.000đ');
      setIsShowError(true);
      setIsLoading(false);
    }
    if (amount > dataBalance?.amount) {
      setMessageError('Số tiền rút vượt quá số dư hiện tại');
      setIsShowError(true);
      setIsLoading(false);
    }
    // if (amount > dataBalance?.amount_pending) {
    //   setMessageError('Tổng số tiền rút đang chờ xử lý vượt quá số dư hiện tại');
    //   setIsShowError(true);
    // }
    if (!amount) {
      setMessageError('Vui lòng nhập hoặc chọn số tiền muốn rút');
      setIsShowError(true);
      setIsLoading(false);
    }
    if (amount >= 50000 && amount <= dataBalance?.amount) {
      await dispatch(
        actions.createBankTransactionWithdrawal({
          data: {
            amount: amount,
            bank_id: bank.id,
            type: 'withdrawal',
          },
        }),
      );
      setIsShowError(false);
      setMessageError('');
      await setTimeout(() => {
        setIsLoading(false);
        setIsDone(true);
      }, 2000);
    }
  };
  return (
    <CustomModalWithdrawal
      name="modal-withdrawal"
      visible={isShowModalWithdrawal}
      footer={null}
      onCancel={handleCloseModal}
      afterClose={handleCloseModal}
    >
      {!isDone ? (
        <Form name="form-withdrawal" onFinish={onFinishWithdrawal}>
          <div className="modal-withdrawal__header">
            <div className="title">Rút tiền về tài khoản</div>
            <div className="desc">
              Vui lòng nhập số tiền bạn muốn rút. Không vượt quá số tiền hiện có
            </div>
          </div>
          <CustomBelanceAvailable>
            <div className="box-icon">
              <img
                src="https://s3.ap-southeast-1.amazonaws.com/odii.xyz/f04a7990373f4e748a5374285e4d5ebb-wallet.png"
                alt="logo"
              />
            </div>
            <div>
              <div className="title">Số dư tạm tính</div>
              <div className="belance">
                {dataBalance?.amount ? formatMoney(dataBalance?.amount) : '0 đ'}
              </div>
            </div>
          </CustomBelanceAvailable>
          <CustomBank className="justify-content-between">
            <div className="d-flex">
              <div className="bank-logo">
                <img
                  className="logo"
                  src={bank?.bank_data?.logo?.origin}
                  alt=""
                />
              </div>

              <div>
                <div className="bank-title">{bank?.bank_data?.title}</div>
                <div className="bank-sub_title">{bank.sub_title}</div>
              </div>
            </div>

            <div>
              <div className="bank-account__name">{bank.account_name}</div>
              <div className="bank-account__number">{bank.account_number}</div>
            </div>
          </CustomBank>
          <Item>
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
                <CustomStyle width={203}>
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
          </Item>
          {isShowError && <div className="alert-err">{messageError}</div>}
          <Button
            type="primary"
            className="btn-sm"
            width="100%"
            color="blue"
            htmlType="submit"
          >
            {isLoading && (
              <>
                <LoadingOutlined />
                &ensp;
              </>
            )}
            Xác nhận
          </Button>
        </Form>
      ) : (
        <div className="withdrawal-done">
          <div className="withdrawal-done__header">
            <img className="logo" src={successWithdrawal} alt="" />
            <div className="title">Yêu cầu rút tiền đang được xử lý</div>
            <div className="desc">
              Giao dịch rút tiền về tài khoản ngân hàng cá nhân của bạn đã được
              khởi tạo thành công và đang chờ admin xét duyệt !
            </div>
          </div>
          <div className="withdrawal-done__info">
            <div className="item">
              <div className="label">Mã giao dịch</div>
              <div> {dataCreateBankTransaction?.short_code}</div>
            </div>
            <div className="item">
              <div className="label">Số tiền giao dịch</div>
              <div className="item-amount">{formatMoney(amount)}</div>
            </div>
            <div className="item">
              <div className="label">Hình thức rút tiền</div>
              <div>Tài khoản ngân hàng</div>
            </div>
            {/* <div className="item">
                  <div className="label">Thời gian ghi nhận</div>
                  <div> {dataCreateBankTransaction?.created_at}</div>
                </div> */}
          </div>
          <CustomBank className="justify-content-between">
            <div className="d-flex">
              <div className="bank-logo">
                <img
                  className="logo"
                  src={bank?.bank_data?.logo?.origin}
                  alt=""
                />
              </div>

              <div>
                <div className="bank-title">{bank?.bank_data?.title}</div>
                <div className="bank-sub_title">{bank.sub_title}</div>
              </div>
            </div>

            <div>
              <div className="bank-account__name">{bank.account_name}</div>
              <div className="bank-account__number">{bank.account_number}</div>
            </div>
          </CustomBank>
          <div align="center">
            <Space align="center">
              <Button
                context="secondary"
                className="btn-sm"
                // width="123px"
                color="default"
                style={{
                  color: 'white',
                  background: '#6C798F',
                }}
                onClick={goNewTransaction}
              >
                Giao dịch mới
              </Button>
              <Button
                className="btn-sm"
                width="123px"
                color="blue"
                onClick={goMyWallet}
              >
                Kiểm tra ví
              </Button>
            </Space>
          </div>
        </div>
      )}
    </CustomModalWithdrawal>
  );
});
