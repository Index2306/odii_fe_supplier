import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken } from './slice/selectors';
import { Helmet } from 'react-helmet-async';

interface Props {
  path: string;
  exact: boolean;
  title?: string;
  component: any;
}

const AuthRoute = ({ component: Component, title, ...rest }: Props) => {
  const AccessToken = useSelector(selectAccessToken);

  return (
    <>
      <Helmet title={title} />
      <Route
        {...rest}
        render={(matchProps: any) => {
          if (!AccessToken) {
            window.location.replace('/auth/signin');
            return null;
          }
          return <Component {...matchProps} />;
        }}
      />
    </>
  );
};

export default AuthRoute;
