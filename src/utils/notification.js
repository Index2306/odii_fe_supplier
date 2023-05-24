import { notification } from 'antd';

notification.config({
  // placement: 'bottomRight',
  // bottom: 50,
  duration: 3.5,
  // rtl: true,
});
export default function openNotification(type, description, message, duration) {
  notification[type]({
    description,
    message: message || type,
    duration,
  });
}
