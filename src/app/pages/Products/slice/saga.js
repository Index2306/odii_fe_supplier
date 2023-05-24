import {
  call,
  put,
  takeLatest,
  delay,
  select,
  throttle,
  all,
} from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { productsActions as actions } from '.';
import { selectDetail } from './selectors';
import notification from 'utils/notification';
import { roundMoney } from 'utils/helpers';
import constants from 'assets/constants';

const PRODUCT_SERVICE = 'product-service/';

export function* getData({ payload }) {
  yield delay(500);
  const requestURL = `${PRODUCT_SERVICE}supplier/products${payload}`;
  try {
    // Call our request helper (see 'utils/request')
    let repos = yield call(request, ...[requestURL, { isCheckRefresh: true }]);
    // const repos = {}
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
  const requestURL = `${PRODUCT_SERVICE}supplier/product/${payload}/detail`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, {}]);
    // const repos = {}
    if (!isEmpty(repos)) {
      yield put(actions.getDetailDone(repos.data));
    } else {
      yield put(actions.getDetailError());
    }
  } catch (err) {
    yield put(actions.getDetailError());
  }
}

export function* getDetails({ payload }) {
  yield delay(500);
  const requestURL = id => `${PRODUCT_SERVICE}supplier/product/${id}/detail`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield all(
      payload.map(id =>
        (function* () {
          try {
            return yield call(request, ...[requestURL(id), {}]);
          } catch (e) {
            return e; // **
          }
        })(),
      ),
    );
    const handleRepos = repos?.map(item => {
      const data = item.data;
      const variations = data.variations?.map(v => {
        return {
          ...v,
          retail_price:
            v.retail_price ||
            v.origin_supplier_price +
              roundMoney(
                v.origin_supplier_price * constants.PERCENT_MONEY.retail_price,
              ),
          retail_price_compare_at:
            v.retail_price_compare_at ||
            v.origin_supplier_price +
              roundMoney(
                v.origin_supplier_price *
                  constants.PERCENT_MONEY.retail_price_compare_at,
              ),
        };
      });
      return { ...data, variations };
    });
    // const repos = {}
    if (!isEmpty(repos)) {
      handleRepos.forceUpdate = payload.forceUpdate;
      yield put(actions.getDetailsDone(handleRepos));
    } else {
      yield put(actions.getDetailsError());
    }
  } catch (err) {
    yield put(actions.getDetailsError());
  }
}

export function* updateAndCreate({ payload }) {
  const { id, data, push } = payload;
  // const requestURL = `${PRODUCT_SERVICE}supplier/product/${payload.id}`;
  const requestURL = `${PRODUCT_SERVICE}supplier/product${id ? `/${id}` : ''}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: id ? 'put' : 'post', data: data }],
    );
    // const repos = {}
    notification('success', 'Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateAndCreateDone());
    } else {
      yield put(actions.updateAndCreateError());
    }
    if (id) {
      const oldData = yield select(selectDetail);
      yield put(
        actions.getDetailDone({
          ...oldData,
          ...data,
        }),
      );
      // window.location.reload();
    } else {
      push('/products');
    }
  } catch (err) {
    yield put(actions.updateAndCreateError());
  }
}

export function* updateQuantity({ payload }) {
  const { id, data } = payload;
  const requestURL = `${PRODUCT_SERVICE}supplier/product-quantity${
    id ? `/${id}` : ''
  }`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: data }],
    );
    // const repos = {}
    notification('success', 'Thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateQuantityDone());
    } else {
      yield put(actions.updateQuantityError());
    }
  } catch (err) {
    yield put(actions.updateAndCreateError());
  }
}
export function* cloneProduct({ payload }) {
  const { id, push, onSuccessCallback } = payload;
  // const requestURL = `${PRODUCT_SERVICE}supplier/product/${payload.id}`;
  const requestURL = `${PRODUCT_SERVICE}supplier/product/clone/${id}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: 'post', data: {} }],
    );
    if (!isEmpty(repos)) {
      yield put(actions.cloneProductDone());
      if (onSuccessCallback) onSuccessCallback();
    } else {
      yield put(actions.cloneProductError());
    }
    // const repos = {}
    notification('success', 'Thành công !');
    push('/products');
  } catch (err) {
    yield put(actions.cloneProductError());
  }
}

export function* cancelProduct({ payload }) {
  const { id, push, onSuccessCallback } = payload;
  // const requestURL = `${PRODUCT_SERVICE}supplier/product/${payload.id}`;
  const requestURL = `${PRODUCT_SERVICE}supplier/product/${id}`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, ...[requestURL, { method: 'delete' }]);
    if (!isEmpty(repos)) {
      yield put(actions.cancelProductDone());
      if (onSuccessCallback) onSuccessCallback();
    } else {
      yield put(actions.cancelProductError());
    }
    // const repos = {}
    notification('success', 'Thành công !');
    push('/products');
  } catch (err) {
    yield put(actions.cancelProductError());
  }
}
export function* updateState({ payload }) {
  const { id, data, onSuccess } = payload;
  const requestURL = `${PRODUCT_SERVICE}supplier/product-publishstate/${id}`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(
      request,
      ...[requestURL, { method: 'put', data: data }],
    );
    // const repos = {}
    notification('success', 'Cập nhật trạng thái thành công !');
    if (!isEmpty(repos)) {
      yield put(actions.updateStateDone());
      if (onSuccess) onSuccess();
    } else {
      yield put(actions.updateStateError());
    }
  } catch (err) {
    yield put(actions.updateStateError());
  }
}
export function* productsSaga() {
  yield takeLatest(actions.getData.type, getData);
  yield takeLatest(actions.getDetail.type, getDetail);
  yield takeLatest(actions.getDetails.type, getDetails);
  yield throttle(5000, actions.updateAndCreate.type, updateAndCreate);
  yield throttle(5000, actions.cloneProduct.type, cloneProduct);
  yield throttle(5000, actions.cancelProduct.type, cancelProduct);
  yield throttle(5000, actions.updateQuantity.type, updateQuantity);
  yield throttle(5000, actions.updateState.type, updateState);
}
