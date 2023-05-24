import React, { memo } from 'react';
import styled from 'styled-components';
import ColorPayBox from 'app/components/ColorPayBox';
import { useAccountDebtPeriodOverviewSlice } from 'app/pages/Accountant/AccountDebtPeriodOverview/slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectOverviewStats } from 'app/pages/Accountant/AccountDebtPeriodOverview/slice/selectors';
import { formatDateRange } from 'utils/helpers';

const dataOrder = [
  {
    label: 'Tổng công nợ chu kỳ hiện tại',
    total: 'debt_current_period',
    color: '#EF5816',
    tooltip: 'Tổng công nợ chu kỳ hiện tại',
    money: true,
  },
  {
    label: 'Tổng công nợ chu kỳ trước',
    total: 'debt_prev_period',
    color: '#1B78D4',
    tooltip: 'Tổng công nợ chu kỳ trước',
    money: true,
  },
  {
    label: 'Tổng đối soát và thanh toán chu kỳ trước',
    total: 'payout_prev_period',
    color: '#27AE60',
    tooltip: 'Tổng đối soát và thanh toán chu kỳ trước',
    money: true,
  },
];

export default memo(function PayBox() {
  const dispatch = useDispatch();
  const { actions } = useAccountDebtPeriodOverviewSlice();
  const overviewStats = useSelector(selectOverviewStats);

  React.useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = () => {
    dispatch(actions.getOverviewStats());
  };

  const convertData = React.useMemo(
    () => [
      {
        debt_current_period: overviewStats?.debt_current_period?.amount,
        debt_prev_period: overviewStats?.debt_prev_period?.amount,
        payout_prev_period: overviewStats?.payout_prev_period?.amount,
      },
    ],
    [overviewStats],
  );

  const convertTime = React.useMemo(
    () => [
      {
        debt_current_period: formatDateRange(
          overviewStats?.debt_current_period?.start_date,
          overviewStats?.debt_current_period?.end_date,
        ),
        debt_prev_period: formatDateRange(
          overviewStats?.debt_prev_period?.start_date,
          overviewStats?.debt_prev_period?.end_date,
        ),
        payout_prev_period: formatDateRange(
          overviewStats?.payout_prev_period?.start_date,
          overviewStats?.payout_prev_period?.end_date,
        ),
      },
    ],
    [overviewStats],
  );

  return (
    <CustomPay>
      <ColorPayBox
        initData={dataOrder}
        data={convertData[0]}
        cycle={convertTime[0]}
        styleBox={{ width: 320, height: 98 }}
        label="Tổng quan công nợ"
        goto="/accountant/debt-overview"
      />
    </CustomPay>
  );
});

const CustomPay = styled.div`
  margin-bottom: 24px;
`;
