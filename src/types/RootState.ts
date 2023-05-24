import { GlobalState } from 'app/pages/AppPrivate/slice/types';
import { AuthState } from 'app/pages/Auth/slice/types';
import { VerifyState } from 'app/pages/Verify/slice/types';
import { ProductsState } from 'app/pages/Products/slice/types';
import { CategoriesState } from 'app/pages/Categories/slice/types';
import { EmployeesState } from 'app/pages/Employees/slice/types';
import { MyProfileState } from 'app/pages/MyProfile/slice/types';
import { InfoBusinessState } from 'app/pages/InfoBusiness/slice/types';
import { MyWalletState } from 'app/pages/MyWallet/slice/types';
import { RevenueState } from 'app/pages/Revenue/slice/types';
import { TransactionsState } from 'app/pages/Accountant/Transactions/slice/types';
import { AccountantHandleDepositState } from 'app/pages/Accountant/AccountantHandleDeposit/slice/types';
import { AccountantHandleWithdrawalState } from 'app/pages/Accountant/AccountantHandleWithdrawal/slice/types';
import { AffiliateState } from 'app/pages/Accountant/AccountPartnership/slice/types';
import { DistributionsState } from 'app/pages/Distribution/slice/types';

import { ThemeState } from 'styles/theme/slice/types';

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  theme?: ThemeState;
  global?: GlobalState;
  auth?: AuthState;
  transactions?: TransactionsState;
  verify?: VerifyState;
  products?: ProductsState;
  categories?: CategoriesState;
  employees?: EmployeesState;
  mywallet?: MyWalletState;
  revenue?: RevenueState;
  myprofile?: MyProfileState;
  infobusiness?: InfoBusinessState;
  // warehousing?: WarehousingState;
  orders?: any;
  AccountantHandleDeposit?: AccountantHandleDepositState;
  AccountantHandleWithdrawal?: AccountantHandleWithdrawalState;
  affiliate?: AffiliateState;
  distribution?: DistributionsState;

  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
