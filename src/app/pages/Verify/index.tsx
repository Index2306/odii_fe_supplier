/**
 *
 * Verify
 *
 */
import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import VerifyInvite from './Features/Verify-Invite';
import VerifyLayout from 'app/components/Verify/Layout';
// import { useGlobalSlice } from 'app/pages/AppPrivate/slice';
// import { useDispatch } from 'react-redux';
// import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
// import { useSelector } from 'react-redux';
// import 'assets/scss/pages/verify.scss';
enum verifyType {
  VERIFY_INVITE = 'invitation',
}

enum verifyLayout {
  VERIFY = 'verify',
  VERIFY_INVITE = 'invitation',
}
interface Props {
  history?: any;
  location?: {
    search: string | null;
  };
  match?: {
    params: {
      type?: verifyType | null;
    };
  };
}
export interface AuditCompareRouteParams {
  type: string;
}

export function Verify({ history, location, match }: Props) {
  const type = match?.params?.type ?? verifyType.VERIFY_INVITE;
  // const { t, i18n } = useTranslation();
  // const dispatch = useDispatch();
  // const userInfo = useSelector(selectCurrentUser);
  // const { actions } = useGlobalSlice();

  const [layout, setLayout] = React.useState(verifyLayout.VERIFY);

  React.useEffect(() => {
    if (type === verifyType.VERIFY_INVITE) {
      setLayout(verifyLayout.VERIFY_INVITE);
    }
  }, [type]);

  // React.useEffect(() => {
  //   if (userInfo && userInfo.status === 'active') {
  //     window.location.href = '/';
  //   }
  // }, [userInfo]);

  return <>{layout && <VerifyLayout>{renderComponent(type)}</VerifyLayout>}</>;
}

const renderComponent = (type: verifyType) => {
  switch (type) {
    case verifyType.VERIFY_INVITE:
      return <VerifyInvite />;
    default:
      return <VerifyInvite />;
  }
};
