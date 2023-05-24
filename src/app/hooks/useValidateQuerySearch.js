import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';

export function useValidateQuerySearch(searchSchema) {
  const { search, pathname } = useLocation();
  return useMemo(() => {
    const searchParams = new URLSearchParams(search);
    let isValid = true;
    for (let key of searchParams.keys()) {
      if (!searchSchema[key]) {
        searchParams.delete(key);
        isValid = false;
      } else {
        if (
          searchSchema[key].test &&
          !searchSchema[key].test(searchParams.get(key))
        ) {
          isValid = false;
          searchSchema[key].required
            ? searchParams.set(key, searchSchema[key].default)
            : searchParams.delete(key);
        }
      }
    }

    const validSearchKeys = Object.keys(searchSchema);
    validSearchKeys.forEach(key => {
      if (!searchParams.has(key) && searchSchema[key].required) {
        isValid = false;
        searchParams.set(key, searchSchema[key].default);
      }
    });
    const queryData = {};
    searchParams.forEach((value, key) => {
      queryData[key] = value;
    });
    return { isValid, to: `${pathname}?${searchParams.toString()}`, queryData };
  }, [search, searchSchema]);
}

export function useShouldRedirectToLastPage(paginatedData) {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (paginatedData?.pagination) {
      const { page, last_page } = paginatedData.pagination;
      if ((!page || last_page < page) && last_page !== 0) {
        const search = new URLSearchParams(location.search);
        search.set('page', last_page);
        history.replace(`${location.pathname}?${search.toString()}`);
      }
    }
  }, [paginatedData]);
  return location;
}
export function useHandleChangePage(notNeedRedirect) {
  const history = useHistory();
  const location = useLocation();
  if (notNeedRedirect) return;
  return (pagination, pS) => {
    let current = pagination;
    let pageSize = pS;
    if (typeof pagination === 'object' && pagination !== null) {
      current = pagination.current;
      pageSize = pagination.pageSize;
    }
    const search = getSearchUrl(location.search, {
      page: current,
      page_size: pageSize,
    });
    history.push(`${location.pathname}?${search}`);
  };
}

export function getSearchUrl(curSearch, params) {
  const searchParams = new URLSearchParams(curSearch);
  Object.keys(params).forEach(key => {
    searchParams.set(key, params[key]);
  });
  return searchParams.toString();
}
