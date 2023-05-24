import moment from 'moment';

export const getDebtPeriodByKey = debtPeriodKey => {
  const debtPeriod = {};
  const keySeparator = '_';
  const keyParts = debtPeriodKey.split(keySeparator);
  debtPeriod.debt_period_start = moment(keyParts[0]);
  debtPeriod.debt_period_end = moment(keyParts[1]);
  debtPeriod.payout_period_start = debtPeriod.debt_period_end
    .clone()
    .add(2, 'days');
  debtPeriod.payout_period_end = debtPeriod.payout_period_start
    .clone()
    .add(6, 'days');
  return debtPeriod;
};
