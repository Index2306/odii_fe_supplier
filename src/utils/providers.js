import req from './request';

export function getLocation(params) {
  // params.type = country || province || ward || district
  return req('common-service/location-country', { params });
}

export function getStores() {
  // params.type = country || province || ward || district
  return req('product-service/seller/stores', {});
}
export function getSuggestCategory(value) {
  return req('/product-service/categories-listing-v2', {
    params: { is_leaf: true, keyword: value },
  });
}
export function getSuggestCategoryByName(value) {
  return req('/product-service/categories-listing-v2-product', {
    params: { is_leaf: true, keyword: value },
  });
}

export function getSalesChannels(channel = 'lazada') {
  return req(`/sales-channels-service/${channel}/category`, {});
}

export function getAttributes(channel = 'lazada', id) {
  return req(
    `/sales-channels-service/${channel}/category/attributes?cat_id=${id}`,
    {},
  );
}
