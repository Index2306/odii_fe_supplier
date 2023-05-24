import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { mywalletActions as actions } from '.';
import { message } from 'antd';

const USER_SERVICE = 'user-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}supplier/transactions${payload}&transaction_type=sup_wallet`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDone(repos));
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* getDetail({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload}`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* getTimeline({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload}/timeline`;
  try {
    const repos = yield call(request, ...[requestURL, {}]);
    if (!isEmpty(repos)) {
      yield put(actions.getTimelineDone(repos));
    } else {
      yield put(actions.getTimelineError());
    }
  } catch (err) {
    yield put(actions.getTimelineError());
  }
}

export function* getBalance({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}me/balance`;
  try {
    const repos = yield call(request, ...[requestURL]);
    if (!isEmpty(repos)) {
      yield put(actions.getBalanceDone(repos));
    } else {
      yield put(actions.getBalanceError());
    }
  } catch (err) {
    yield put(actions.getBalanceError());
  }
}

export function* getDataBank({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}admin/banks?status=active`;
  try {
    const repos = yield call(request, ...[requestURL]);
    if (!isEmpty(repos)) {
      yield put(actions.getDataBankDone(repos));
    } else {
      yield put(actions.getDataBankError());
    }
  } catch (err) {
    yield put(actions.getDataBankError());
  }
}

export function* getBankSupplier({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}banks`;
  try {
    const repos = yield call(request, ...[requestURL]);
    if (!isEmpty(repos)) {
      yield put(actions.getBankSupplierDone(repos));
    } else {
      yield put(actions.getBankSupplierError());
    }
  } catch (err) {
    yield put(actions.getBankSupplierError());
  }
}

export function* SupplierAddBank({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}banks`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Thêm ngân hàng thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.SupplierAddBankDone(repos));
      yield put(actions.getBankSupplier());
    } else {
      yield put(actions.SupplierAddBankError());
    }
  } catch (err) {
    yield put(actions.SupplierAddBankError());
  }
}

export function* SupplierUpdateBank({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}bank/${payload.id}`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: payload.data }],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.SupplierUpdateBankDone(repos));
      yield put(actions.getBankSupplier());
    } else {
      yield put(actions.SupplierUpdateBankError());
    }
  } catch (err) {
    yield put(actions.SupplierUpdateBankError());
  }
}

export function* createBankTransaction({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/create-bank-transfer-transaction`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    if (!isEmpty(repos)) {
      yield put(actions.getDataCreateBankTransactionDone(repos));
    } else {
      yield put(actions.getDataCreateBankTransactionError());
    }
  } catch (err) {
    yield put(actions.getDataCreateBankTransactionError());
  }
}
export function* createBankTransactionWithdrawal({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/create-bank-transfer-transaction`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    if (!isEmpty(repos)) {
      yield put(actions.setStatusPendingWithdrawal(repos?.data?.id));
      yield put(actions.getDataCreateBankTransactionDone(repos));
    } else {
      yield put(actions.getDataCreateBankTransactionError());
    }
  } catch (err) {
    yield put(actions.getDataCreateBankTransactionError());
  }
}

export function* setStatusPendingWithdrawal({ payload }) {
  console.log('payload', payload);
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload}/set-transaction-pending`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    if (!isEmpty(repos)) {
      yield put(actions.setStatusPendingDone(repos));
    } else {
      yield put(actions.getStatusPendingError());
    }
  } catch (err) {
    yield put(actions.getStatusPendingError());
  }
}

export function* setStatusPending({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload.id}/set-transaction-pending`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    if (!isEmpty(repos)) {
      yield put(actions.setStatusPendingDone(repos));
    } else {
      yield put(actions.getStatusPendingError());
    }
  } catch (err) {
    yield put(actions.getStatusPendingError());
  }
}

export function* setStatusPendingList({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}transactions/${payload.id}/set-transaction-pending`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: payload.data }],
    );
    message.success('Cập nhật thành công !');
    if (!isEmpty(repos)) {
      const url = '?page=1&page_size=10';
      yield put(actions.getData(url));
      yield put(actions.setStatusPendingListDone(repos));
    } else {
      yield put(actions.getStatusPendingListError());
    }
  } catch (err) {
    yield put(actions.getStatusPendingListError());
  }
}

export function* deleteTransaction({ payload }) {
  yield delay(500);
  const requestURL = `${USER_SERVICE}seller/transactions/${payload.id}`;
  try {
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: payload.data }],
    );
    message.success('Hủy giao dịch trạng thái khởi tạo thành công!');
    if (!isEmpty(repos)) {
      // const url = '?page=1&page_size=10';
      // yield put(actions.getData(url));
      window.location.href = '/mywallet';
    } else {
      yield put(actions.getError());
    }
  } catch (err) {
    yield put(actions.getError());
  }
}

export function* mywalletSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getTimeline.type, getTimeline);

  yield takeLatest(actions.getBalance.type, getBalance);

  // get List Bank of Admin
  yield takeLatest(actions.getDataBank.type, getDataBank);

  // get List Bank and Add, Update Bank of Supplier
  yield takeLatest(actions.getBankSupplier.type, getBankSupplier);
  yield takeLatest(actions.SupplierAddBank.type, SupplierAddBank);
  yield takeLatest(actions.SupplierUpdateBank.type, SupplierUpdateBank);

  // Create and Pending Status of Transaction Deposit
  yield takeLatest(actions.createBankTransaction.type, createBankTransaction);
  yield takeLatest(actions.setStatusPending.type, setStatusPending);
  yield takeLatest(actions.setStatusPendingList.type, setStatusPendingList);

  // Create and Pending Status of Transaction Withdrawl
  yield takeLatest(
    actions.createBankTransactionWithdrawal.type,
    createBankTransactionWithdrawal,
  );
  yield takeLatest(
    actions.setStatusPendingWithdrawal.type,
    setStatusPendingWithdrawal,
  );

  // Delete
  yield takeLatest(actions.deleteTransaction.type, deleteTransaction);
}
