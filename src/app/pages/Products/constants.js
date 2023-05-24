export const COMBINE_STATUS = {
  'inactive/inactive': {
    publish_status: 'pending_for_review',
    color: 'blue',
    width: '130px',
    label: 'Đang nháp',
    colorLabel: '#000',
    buttonText: 'Đăng bán',
  },
  'inactive/draft': {
    publish_status: 'pending_for_review',
    color: 'blue',
    width: '130px',
    label: 'Đang nháp',
    colorLabel: '#000',
    buttonText: 'Đăng bán',
  },
  'active/draft': {
    publish_status: 'pending_for_review',
    color: 'blue',
    width: '130px',
    label: 'Đang nháp',
    colorLabel: '#000',
    buttonText: 'Đăng bán',
  },
  'null/null': {
    publish_status: 'pending_for_review',
    color: 'blue',
    width: '130px',
    label: 'Đang nháp',
    colorLabel: '#000',
    buttonText: 'Đăng bán',
  },
  'inactive/pending_for_review': {
    publish_status: 'inactive',
    color: 'red',
    buttonText: 'Hủy duyệt',
    colorLabel: '#ff9877',
    label: 'Chờ duyệt',
  },
  'active/pending_for_review': {
    publish_status: 'inactive',
    color: 'red',
    buttonText: 'Hủy duyệt',
    colorLabel: '#ff9877',
    label: 'Chờ duyệt',
  },
  'active/active': {
    publish_status: 'inactive',
    color: 'red',
    buttonText: 'Hủy duyệt',
    colorLabel: 'greenMedium',
    label: 'Đã duyệt',
  },
  'inactive/rejected': {
    publish_status: 'pending_for_review',
    color: 'blue',
    width: '130px',
    buttonText: 'Đăng bán',
    colorLabel: 'redPrimary',
    label: 'Bị từ chối',
  },
  'active/inactive': {
    publish_status: 'pending_for_review',
    color: 'blue',
    width: '140px',
    buttonText: 'Đăng ký lại',
    colorLabel: 'grayBlue',
    label: 'Đã hủy',
  },
  'inactive/active': {
    publish_status: 'pending_for_review',
    color: 'blue',
    width: '140px',
    buttonText: 'Đăng ký lại',
    colorLabel: 'orange',
    label: 'Đã hủy',
  },
};