import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../AppPrivate/slice/selectors';
import { isEmpty } from 'lodash';

export function HomePage({ history }) {
  const currentUser = useSelector(selectCurrentUser);

  React.useEffect(() => {
    if (!isEmpty(currentUser)) {
      if (currentUser?.supplier_status === 'active') {
        history.push('/dashboard');
      } else {
        history.push('/');
      }
    }
  }, [currentUser]);

  return (
    <>
      <Helmet>
        {/* <title>Home Page</title> */}
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      {/* <span>HomePage container</span> */}
    </>
  );
}
