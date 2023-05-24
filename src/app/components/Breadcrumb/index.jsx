/**
 *
 * Breadcrumb
 *
 */
import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components/macro';
import { Breadcrumb as B } from 'antd';
import { useSelector } from 'react-redux';
import { styledSystem } from 'styles/theme/utils';
import { Link, BoxColor } from 'app/components';
import { isEmpty } from 'lodash';
// import { useRouteMatch } from 'react-router-dom';
import { StyleConstants } from 'styles/StyleConstants';
import { CustomStyle } from 'styles/commons';
import { selectBreadcrumb } from 'app/pages/AppPrivate/slice/selectors';
import constants from 'assets/constants';

const { Item } = B;
const Breadcrumb = ({ location }) => {
  // const useRouteMatch1 = useRouteMatch('/products/uc/:id?');
  const dataBreadcrumb = useSelector(selectBreadcrumb);
  const [state, setState] = useState({
    url: null,
    menus: [],
    title: '',
    fixWidth: false,
  });

  useEffect(() => {
    const url = window.location.pathname;
    // if (url === state.url || isEmpty(dataBreadcrumb)) return;
    // const id = match?.params?.id; // is update
    let obj = [];
    switch (url) {
      case '/products':
        break;
      case '/categories':
        break;
      default:
        break;
    }

    setState({
      url,
      menus: obj,
      ...dataBreadcrumb,
    });
  }, [dataBreadcrumb, location]);

  const BoxStatus = text => {
    const currentStatus = constants.COMMON_STATUS.find(v => v.id === text);
    return (
      <BoxColor
        fontWeight="medium"
        colorValue={currentStatus?.color}
        width="120px"
      >
        {currentStatus?.name || ''}
      </BoxColor>
    );
  };
  return (
    isEmpty(state.menus) || (
      <CustomStyle
        bg="whitePrimary"
        py={{ xs: 's4' }}
        borderBottom="1px solid"
        borderColor="gray4"
        padding="12px 24px"
      >
        <WrapperBreadcrumb fixWidth={state.fixWidth}>
          <CustomBreadcrumb>
            {state.menus.map((item, key) => (
              <Item key={key}>
                {item.link ? (
                  <Link to={item.link}> {item.name}</Link>
                ) : (
                  item.name
                )}
              </Item>
            ))}
          </CustomBreadcrumb>
          <div className="d-flex justify-content-between">
            <CustomStyle
              fontSize={{ xs: 'f4' }}
              mt={{ xs: 's3' }}
              fontWeight="bold"
            >
              {state.title}
              &ensp;
              {state.status && BoxStatus(state.status)}
            </CustomStyle>
            {state.actions && <CustomStyle>{state.actions}</CustomStyle>}
          </div>
        </WrapperBreadcrumb>
      </CustomStyle>
    )
  );
};

const CustomBreadcrumb = styledSystem(styled(B)`
  /* background: #ffffff; */
  /* border-radius: 4px; */
  /* padding: 12px 24px 16px; */
  /* border: 1px solid #ffffff; */
  font-size: 12px;
  & + div {
    margin-top: 0;
    margin-bottom: -5px;
    min-height: 27px;
    & > div:first-child {
      margin-top: 0;
      margin-right: 100px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      & + div {
        margin-top: -14px;
        flex-shrink: 0;
      }
    }
  }
`);

const WrapperBreadcrumb = styledSystem(styled.div`
  /* border-radius: 4px; */
  max-width: ${({ fixWidth }) =>
    fixWidth ? `${StyleConstants.bodyWidth}px` : 'auto'};
  margin: 0 auto;
  padding: 0 ${({ fixWidth }) => (fixWidth ? '0' : '24px')};
  /* border: 1px solid ${({ theme }) => theme.stroke}; */
`);

export default memo(Breadcrumb);
