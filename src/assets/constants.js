/* eslint-disable import/no-anonymous-default-export */

import {
  // shopify,
  shopee,
  lazada,
  tiktok,
  delivered,
  shipped,
} from 'assets/images/platform';
// import { constants } from 'buffer';

export default {
  roles: {
    owner: 'owner',
    superAdmin: 'super_admin',

    partnerProduct: 'partner_product',
    partnerOrder: 'partner_order',
    partnerBalance: 'partner_balance',
    partnerMember: 'partner_member',
    partnerSource: 'partner_source',
    partnerWarehouse: 'partner_warehouse',
    partnerChiefWarehouse: 'partner_chief_warehouse',

    adminProduct: 'admin_product',
    adminOrder: 'admin_order',
    adminUser: 'admin_user',
    adminBalance: 'admin_balance',
  },

  ERRORS__AUTH: {
    invalid_recaptcha_token: 'Có lỗi xảy ra vui lòng thử lại sau!',
    EMAIL_NOT_FOUND: 'Tài khoản email không tồn tại',
    email_not_found: 'Tài khoản email không tồn tại!',
    user_activated: 'Tài khoản đã được kích hoạt thành công từ trước',
    get_social_info_error:
      'Không thể lấy thông tin từ tài khoản mạng xã hội của bạn',
    user_does_not_exist: 'Tài khoản không tồn tại',
    domain_does_not_exist: 'Tên miền không tồn tại',
    you_are_not_supplier: 'Tài khoản không phải là Supplier',
    supplier_pending_for_review: 'Tài khoản Supplier đang được review',
    invalid_account_type: 'Tài khoản không hợp lệ',
    password_incorrect: 'Mật khẩu không chính xác',
    wrong_account_or_password: 'Tài khoản hoặc mật khẩu không chính xác',
    user_already_exist: 'Người dùng đã tồn tại',
    registered_gmail_linked_to_facebook:
      'Gmail liên kết với tài khoản Facebook này đã được sử dụng, vui lòng lấy lại mật khẩu hoặc đăng ký bằng tài khoản Facebook khác',
    SOCIAL_EMAIL_NOT_FOUND:
      'Tài khoản Facebook này chưa được liên kết với gmail, vui lòng liên kết gmail hoặc đăng ký bằng tài khoản Facebook khác',
    USER_INACTIVE:
      'Tài khoản đã bị Vô hiệu hóa, vui lòng liên hệ Admin để được hỗ trợ.',
    user_inactive:
      'Tài khoản đã bị Vô hiệu hóa, vui lòng liên hệ Admin để được hỗ trợ.',
    INVALID_PASSWORD: 'Mật khẩu không chính xác ',
    invalid_password: 'Mật khẩu không chính xác ',
    user_already_supplier: 'Bạn đã là 1 nhà cung cấp, vui lòng đăng nhập',
    supplier_status_inactive: 'Tài khoản đã bị vô hiệu hóa',
    user_status_inactive: 'Tài khoản đã bị vô hiệu hóa',
    pending_for_review: 'Tài khoản đang chờ được duyệt',
    pending_for_active:
      'Vui lòng kiểm tra email xác thực tài khoản trong hộp thư và kích hoạt tài khoản',
    '"old_password" length must be at least 8 characters long':
      ' Mật khẩu cũ không chính xác',
    '"email" must be a valid email': 'Email không hợp lệ',
    'new password must be different from last 4 passwords':
      'Mật khẩu mới không trùng 4 mật khẩu cũ gần nhất',
    supplier_has_reached_maximum:
      'Số tài khoản supplier hoạt động đã đạt mức tối đa cho phép của gói, vui lòng liên hệ admin để được hỗ trợ',
    subscription_has_expired: 'Gói đăng ký đã hết hạn',
  },
  ACCOUNTANT_STATUS: [
    { id: 'succeeded', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'secondary2' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'blackPrimary' },
    { id: 'cancelled', name: 'Đã hủy', color: 'blackPrimary' },

    { id: 'confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'reject', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'rejected', name: 'Đã từ chối', color: 'blackPrimary' },

    { id: 'accountant_confirm', name: 'Đang duyệt', color: 'primary' },
    { id: 'chief_accountant_confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'accountant_confirmed', name: 'Đang duyệt', color: 'primary' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'blackPrimary' },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
  ],
  TRANSACTION_STATUS: [
    { id: 'succeeded', name: 'Đã thanh toán', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'secondary2' },
    { id: 'cancelled', name: 'Đã hủy', color: 'secondary2' },
    { id: 'confirmed', name: 'Chờ thanh toán', color: 'primary' },
  ],

  PROMOTION_STATUS: [
    { id: 'active', name: 'Đang hiệu lực', color: 'primary' },
    { id: 'awaiting', name: 'Khởi tạo', color: 'gray1' },
    { id: 'expired', name: 'Hết hiệu lực', color: 'secondary2' },
  ],

  COMMON_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending_for_review', name: 'Đang chờ', color: 'primary' },
    {
      id: 'pending_for_review_after_update',
      name: 'Chờ duyệt lại',
      color: 'primary',
    },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'succeeded', name: 'Thành công', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'failed', name: 'Đã hủy', color: 'secondary2' },
    { id: 'reject', name: 'Đã từ chối', color: 'secondary2' },
    { id: 'cancelled', name: 'Đã hủy', color: 'secondary2' },

    { id: 'platform_cancelled', name: 'Đã từ chối', color: 'secondary2' },
    { id: 'platform_confirmed', name: 'Đã duyệt', color: 'greenMedium' },

    { id: 'accountant_confirm', name: 'Đang chờ', color: 'primary' },
    { id: 'chief_accountant_confirm', name: 'Đã duyệt', color: 'greenMedium' },

    { id: 'accountant_confirmed', name: 'Đang chờ', color: 'primary' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'secondary2' },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },

    { id: 'seller_cancelled', name: 'Seller đã hủy', color: 'blackPrimary' },
    {
      id: 'platform_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'seller_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },

    {
      id: 'supplier_cancelled',
      name: 'Supplier đã hủy',
      color: 'blackPrimary',
    },
    {
      id: 'platform_cancelled',
      name: 'Hệ thống đã hủy',
      color: 'blackPrimary',
    },
    {
      id: 'supplier_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },

    { id: 'rejected', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'completed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
  ],
  EMPLOYEE_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Dừng hoạt động', color: 'secondary2' },
    { id: true, name: 'Hoạt động', color: 'greenMedium' },
    { id: false, name: 'Dừng hoạt động', color: 'secondary2' },
  ],
  ORDER_STATUS: [
    { id: 'OPEN', name: 'Đang chờ', color: 'darkBlue2' },
    { id: 'CLOSE', name: 'Đã hoàn thành', color: 'greenMedium1' },
    { id: 'CANCELED', name: 'Đã huỷ', color: 'secondary2' },
  ],
  ORDER_PAYMENT_STATUS: [
    { id: 'PENDING', name: 'Đang chờ', color: 'darkBlue2' },
    { id: 'PARTIAL_PAID', name: 'Thanh toán 1 phần', color: 'grayBlue' },
    {
      id: 'PAID',
      name: 'Đã thanh toán',
      color: 'greenMedium1',
    },
    { id: 'PARTIAL_REFUNDED', name: 'Hoàn trả 1 phần', color: 'secondary2' },
    { id: 'SELLER_CANCELED', name: 'Seller huỷ', color: 'secondary2' },
    { id: 'REFUNDED', name: 'Đã hoàn tiền', color: 'secondary2' },
    { id: 'VOIDED', name: 'Vô hiệu', color: 'secondary2' },
  ],

  ORDER_FULFILLMENT_STATUS: {
    PENDING: { id: 'pending', name: 'Đang chờ', color: 'grayBlue' },
    SELLER_CONFIRM: {
      id: 'seller_confirm',
      name: 'Chờ xử lý',
      color: 'grayBlue',
    },
    SELLER_CONFIRMED: {
      id: 'seller_confirmed',
      name: 'Chờ xác nhận',
      color: 'grayBlue',
    },
    SELLER_IGNORED: {
      id: 'seller_ignored',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SELLER_CANCELLED: {
      id: 'seller_cancelled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SUPPLIER_CONFIRM: {
      id: 'supplier_confirm',
      name: 'Chờ xử lý',
      color: 'grayBlue',
    },
    SUPPLIER_CONFIRMED: {
      id: 'supplier_confirmed',
      name: 'Đang cung cấp',
      color: 'grayBlue',
    },
    SUPPLIER_PACKED: {
      id: 'supplier_packed',
      name: 'Đã đóng hàng',
      color: 'grayBlue',
    },
    SELLER_DELIVERED: {
      id: 'seller_delivered',
      name: 'seller đã nhận hàng',
      color: 'greenMedium1',
    },
    PLATFORM_DELIVERED: {
      id: 'platform_delivered',
      name: 'Đã cung cấp',
      color: 'greenMedium1',
    },
    PLATFORM_CANCELLED: {
      id: 'platform_cancelled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SUPPLIER_DELIVERED: {
      id: 'supplier_delivered',
      name: 'Đã giao cho vận chuyển',
      color: 'greenMedium1',
    },
    READY_TO_SHIP: {
      id: 'ready_to_ship',
      name: 'Đang vận chuyển',
      color: 'greenMedium1',
    },
    SUP_REJECTED: {
      id: 'sup_rejected',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SUP_CANCELLED: {
      id: 'sup_cancelled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    BUYER_CANCELLED: {
      id: 'buyer_cancelled',
      name: 'Người mua huỷ',
      color: 'secondary2',
    },
    COMPLETED: { id: 'completed', name: 'Đã giao hàng', color: 'greenMedium1' },
    FULFILLED: { id: 'fulfilled', name: 'Hoàn thành', color: 'greenMedium1' },
    CANCEL: { id: 'cancel', name: 'Đã hủy', color: '#8D8D8D' },
  },

  ORDER_SUPPLIER_CANCEL_STATUS: {
    SELLER_CANCELLED: {
      id: 'seller_cancelled',
      name: 'Seller',
      color: '#8D8D8D',
    },
    PLATFORM_CANCELLED: {
      id: 'platform_cancelled',
      name: 'Kênh bán huỷ',
      color: '#8D8D8D',
    },
    SUP_REJECTED: {
      id: 'sup_rejected',
      name: 'Nhà cung cấp',
      color: '#8D8D8D',
    },
    SUP_CANCELLED: {
      id: 'sup_cancelled',
      name: 'Nhà cung cấp',
      color: '#8D8D8D',
    },
  },

  ORDER_SUPPLIER_FULFILLMENT_STATUS: {
    PENDING: { id: 'pending', name: 'Đang chờ', color: 'grayBlue' },
    SELLER_CONFIRM: {
      id: 'seller_confirm',
      name: 'Chờ Seller xác nhận  ',
      color: 'grayBlue',
    },
    SELLER_CONFIRMED: {
      id: 'seller_confirmed',
      name: 'Chờ NCC xác nhận',
      color: 'grayBlue',
    },
    SELLER_IGNORED: {
      id: 'seller_ignored',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SELLER_CANCELLED: {
      id: 'seller_cancelled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SUPPLIER_CONFIRM: {
      id: 'supplier_confirm',
      name: 'Chờ NCC xác nhận',
      color: 'grayBlue',
    },
    SUPPLIER_CONFIRMED: {
      id: 'supplier_confirmed',
      name: 'Chờ NCC đóng gói',
      color: 'grayBlue',
    },
    SUPPLIER_PACKED: {
      id: 'supplier_packed',
      name: 'Đã đóng hàng',
      color: 'grayBlue',
    },
    SELLER_DELIVERED: {
      id: 'seller_delivered',
      name: 'seller đã nhận hàng',
      color: 'greenMedium1',
    },
    PLATFORM_DELIVERED: {
      id: 'platform_delivered',
      name: 'Đã giao vận chuyển',
      color: 'greenMedium1',
    },
    PLATFORM_CANCELLED: {
      id: 'platform_cancelled',
      name: 'Kênh bán huỷ',
      color: '#8D8D8D',
    },
    SUPPLIER_DELIVERED: {
      id: 'supplier_delivered',
      name: 'Đã giao vận chuyển',
      color: 'greenMedium1',
    },
    READY_TO_SHIP: {
      id: 'ready_to_ship',
      name: 'Sẵn sàng giao',
      color: 'greenMedium1',
    },
    SUP_REJECTED: {
      id: 'sup_rejected',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SUP_CANCELLED: {
      id: 'sup_cancelled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    BUYER_CANCELLED: {
      id: 'buyer_cancelled',
      name: 'Người mua huỷ',
      color: 'secondary2',
    },
    COMPLETED: { id: 'completed', name: 'Đã giao hàng', color: 'greenMedium1' },
    FULFILLED: { id: 'fulfilled', name: 'Hoàn thành', color: 'greenMedium1' },
    CANCEL: { id: 'cancel', name: 'Đã hủy', color: '#8D8D8D' },
  },

  ORDER_SHOP_STATUS: [
    { id: 'pending', name: 'Chờ xử lý', color: 'grayBlue' },
    { id: 'unpaid', name: 'Chưa thanh toán', color: 'grayBlue' },
    { id: 'packed', name: 'Đã đóng gói', color: 'grayBlue' },
    {
      id: 'ready_to_ship',
      name: 'Chờ lấy hàng',
      color: 'grayBlue',
    },
    {
      id: 'shipped',
      name: 'Đang vận chuyển',
      color: 'darkBlue2',
      icon: shipped,
    },
    {
      id: 'delivered',
      name: 'Đã giao hàng',
      color: 'greenMedium1',
      icon: delivered,
    },
    { id: 'returned', name: 'Bị trả lại', color: '#8D8D8D' },
    {
      id: 'canceled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    { id: 'failed', name: 'Thất bại', color: '#8D8D8D' },
  ],
  SHOPEE_ORDER_SHOP_STATUS: {
    UNPAID: { id: 'UNPAID', name: 'Chưa thanh toán', color: 'grayBlue' },
    READY_TO_SHIP: {
      id: 'READY_TO_SHIP',
      name: 'Chờ xử lý',
      color: 'grayBlue',
    },
    PROCESSED: { id: 'PROCESSED', name: 'Chờ lấy hàng', color: 'grayBlue' },
    READY_TO_CREATE_DOCUMENT: {
      id: 'READY_TO_CREATE_DOCUMENT',
      name: 'Chờ vận chuyển',
      color: 'grayBlue',
    },
    READY_TO_PRINT: {
      id: 'READY_TO_PRINT',
      name: 'Chờ lấy hàng',
      color: 'grayBlue',
    },
    SHIPPED: {
      id: 'SHIPPED',
      name: 'Đang vận chuyển',
      color: 'darkBlue2',
      icon: delivered,
    },
    TO_CONFIRM_RECEIVE: {
      id: 'TO_CONFIRM_RECEIVE',
      name: 'Đang vận chuyển',
      color: 'darkBlue2',
      icon: delivered,
    },
    IN_CANCEL: { id: 'IN_CANCEL', name: 'Đã hủy', color: '#8D8D8D' },
    CANCELLED: { id: 'CANCELLED', name: 'Đã hủy', color: '#8D8D8D' },
    COMPLETED: {
      id: 'COMPLETED',
      name: 'Đã giao hàng',
      color: 'greenMedium1',
      icon: shipped,
    },
  },
  FULFILLMENT_ACTION: {
    CONFIRM: 'supplier_confirmed',
    CANCEL: 'sup_cancelled',
    REJECT: 'sup_rejected',
    IGNORE: 'supplier_ignored',
  },
  PRODUCT_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending_for_review', name: 'Đang chờ', color: 'primary' },
  ],
  LIST_OPTION_VARIATIONS: [
    'Kích cỡ',
    'Màu sắc',
    'Chất liệu',
    'Kiểu dáng',
    'Tiêu đề',
  ],
  PUBLISH_STATUS: [
    { id: 'draft', name: 'Nháp', color: 'grayBlue' },
    { id: 'inactive/inactive', name: 'Đang sửa', color: 'greenMedium' },
    {
      id: 'inactive/pending_for_review',
      name: 'Chờ duyệt',
      color: 'secondary2',
    },
    { id: 'active/active', name: 'Đang bán', color: 'primary' },
    { id: 'inactive/active', name: 'Dừng bán', color: 'grayBlue' },
    { id: 'inactive/rejected', name: 'Từ chối', color: 'secondary2' },
  ],
  SALE_CHANNEL: [
    { id: 'SHOPEE', name: 'Shopee', color: '#EA501F', icon: shopee },
    {
      id: 'LAZADA',
      name: 'Lazada',
      color: '#4070f4',
      icon: lazada,
    },
    { id: 'TIKTOK', name: 'Tiktok', color: '#000', icon: tiktok },
    { id: 'OTHER', name: 'Ngoại sàn', color: '#b7b7b7', icon: '' },
  ],
  MYWALLET_STATUS_SEARCH: [
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    {
      id: 'pending_all',
      name: 'Đang chờ',
      color: 'primary',
    },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'blackPrimary',
    },
  ],
  MYWALLET_STATUS: [
    { id: 'succeeded', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'secondary2' },
    { id: 'cancelled', name: 'Đã hủy', color: 'secondary2' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
    { id: 'accountant_confirmed', name: 'Đang chờ', color: 'primary' },
    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'secondary2' },

    { id: 'seller_confirmed', name: 'Đang chờ', color: 'primary' },
    { id: 'platform_cancelled', name: 'Đã hủy', color: 'secondary2' },
    { id: 'platform_confirmed', name: 'Đang chờ', color: 'primary' },
    { id: 'seller_cancelled', name: 'Seller đã hủy', color: 'secondary2' },
    { id: 'seller_returned', name: 'Seller đã hủy', color: 'secondary2' },
    { id: 'supplier_cancelled', name: 'NCC đã hủy', color: 'secondary2' },
    { id: 'rejected', name: 'Đã hủy', color: 'secondary2' },
    { id: 'completed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
  ],
  ACCOUNTANT_STATUS: [
    { id: 'succeeded', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'secondary2' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'blackPrimary' },
    { id: 'cancelled', name: 'Đã hủy', color: 'blackPrimary' },

    { id: 'confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'reject', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'rejected', name: 'Đã từ chối', color: 'blackPrimary' },

    { id: 'accountant_confirm', name: 'Đang duyệt', color: 'primary' },
    { id: 'chief_accountant_confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'accountant_confirmed', name: 'Đang duyệt', color: 'primary' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'blackPrimary' },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
  ],
  REVENUE_STATUS_SEARCH: [
    { id: 'succeeded', name: 'Đã thanh toán', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'secondary2' },
    { id: 'cancelled', name: 'Đã từ chối', color: 'secondary2' },
    {
      id: 'seller_cancelled',
      name: 'Seller đã hủy',
      color: 'secondary2',
    },
    {
      id: 'supplier_cancelled',
      name: 'Supplier đã hủy',
      color: 'secondary2',
    },
    {
      id: 'platform_cancelled',
      name: 'Hệ thống từ chối',
      color: 'secondary2',
    },
    {
      id: 'confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'seller_confirmed',
      name: 'Seller chờ đối soát',
      color: 'primary',
    },
    {
      id: 'supplier_confirmed',
      name: 'Supplier chờ đối soát',
      color: 'primary',
    },
    {
      id: 'platform_confirmed',
      name: 'Hệ thống chờ đối soát',
      color: 'primary',
    },
  ],
  REVENUE_STATUS: [
    { id: 'succeeded', name: 'Đã thanh toán', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'secondary2' },
    { id: 'cancelled', name: 'Đã từ chối', color: 'secondary2' },
    {
      id: 'seller_cancelled',
      name: 'Seller đã hủy',
      color: 'secondary2',
    },
    {
      id: 'supplier_cancelled',
      name: 'Supplier đã hủy',
      color: 'secondary2',
    },
    {
      id: 'platform_cancelled',
      name: 'Hệ thống từ chối',
      color: 'secondary2',
    },
    {
      id: 'confirm',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'seller_confirm',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'supplier_confirm',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'platform_confirm',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'seller_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'supplier_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'platform_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },
  ],
  TRANSACTION_TYPES: [
    { id: 'deposit', name: 'Nạp tiền' },
    { id: 'withdrawal', name: 'Rút tiền' },
  ],
  DEBT_TYPES: [
    // { id: 'pay', name: 'Đã sử dụng' },
    // { id: 'receive', name: 'Đã nhận' },
    { id: 'confirmed_order', name: 'Thanh toán đơn hàng' },
    { id: 'seller_get_refund', name: 'Hoàn tiền đơn hàng' },
    { id: 'supplier_fulfill_fail', name: 'Hoàn tiền cung cấp' },
  ],
  CURRENCY_LIST: [
    {
      id: 'vnd',
      name: 'Việt Nam đồng',
    },
    {
      id: 'usd',
      name: 'Dollar',
    },
  ],

  ORDER_FILTER_STATUS: [
    { id: 0, name: 'Tất cả', color: 'grayBlue' },
    { id: 1, name: 'Chưa thanh toán', color: 'grayBlue' },
    { id: 2, name: 'Chờ xử lý', color: 'grayBlue' },
    {
      id: 3,
      name: 'Chờ lấy hàng',
      color: 'darkBlue2',
    },
    { id: 4, name: 'Đang vận chuyển', color: 'greenMedium1' },
    { id: 5, name: 'Đã giao hàng', color: 'greenMedium1' },
    {
      id: 6,
      name: 'Đã hủy',
      color: 'secondary2',
    },
    {
      id: 7,
      name: 'Chưa xác định',
      color: 'secondary2',
    },
  ],

  PERCENT_MONEY: {
    retail_price: 0.1,
    retail_price_compare_at: 0.2,
  },
  ORDER_FILTER_TIME: [
    { id: 'day', name: 'Ngày đặt hàng' },
    { id: 'today', name: 'Hôm nay', comp: 'So với 1 ngày trước' },
    { id: 'yesterday', name: 'Hôm qua', comp: 'So với 1 ngày trước' },
    { id: 'week', name: 'Tuần này', comp: 'So với tuần trước' },
    { id: 'lastweek', name: 'Tuần trước', comp: 'So với tuần trước' },
    { id: 'month', name: 'Tháng này', comp: 'So với tháng trước' },
    { id: 'lastmonth', name: 'Tháng trước', comp: 'So với tháng trước' },
    { id: 'custom', name: 'Tùy chỉnh', comp: 'So với thời gian trước' },
  ],

  ORDER_PRINT_STATUS: [
    { id: 'status', name: 'Trạng thái in đơn' },
    { id: '', name: 'Tất cả' },
    { id: 'printed', name: 'Đã in đơn' },
    { id: 'unprinted', name: 'Chưa in đơn' },
  ],
  KEY_FILTER: [
    { id: 'platform', name: 'Nền tảng' },
    { id: 'print_status', name: 'Trạng thái in đơn' },
    // { id: 'day', name: 'Thời gian' },
  ],
  ORDER_FILTER_WAITCONFIRM_STATUS: [
    { id: 'pending', name: 'Chờ seller xác nhận', color: 'grayBlue' },
    {
      id: 'seller_confirmed',
      name: 'Chờ nhà cung cấp xác nhận',
      color: 'grayBlue',
    },
    {
      id: 'supplier_confirmed',
      name: 'Đóng gói & in đơn',
      color: 'grayBlue',
    },
  ],
  ODII_ORDER_STATUS: {
    UNPAID: 1, // chua thanh toan
    PENDING: 2, // cho xu ly
    WAIT_SHIPPING: 3, // cho lay hang
    SHIPPING: 4, // dang van chuyen
    DELIVERED: 5, // da giao hang
    CANCELED: 6, // da huy
    UNDEFINED: 7, // chua xac dinh
  },
  ODII_ORDER_STATUS_NAME: {
    1: { id: 1, name: 'Chưa thanh toán', color: 'grayBlue' },
    2: { id: 2, name: 'Chờ xử lý', color: 'grayBlue' },
    3: { id: 3, name: 'Chờ lấy hàng', color: 'grayBlue' },
    4: { id: 4, name: 'Đang vận chuyển', color: 'darkBlue2', icon: delivered },
    5: { id: 5, name: 'Đã giao hàng', color: 'greenMedium1', icon: shipped },
    6: { id: 6, name: 'Đã hủy', color: '#8D8D8D' },
  },
  ORDER_ACTION_MAPPING: [
    {
      platform: '*',
      role: 'seller',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'pending',
      platform_order_status: ['*'],
      actions: { seller_confirm: true, order_cancel: true },
    },
    {
      platform: '*',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'seller_confirmed',
      platform_order_status: ['*'],
      actions: { supplier_confirm: true, order_cancel: true },
    },
    {
      platform: null,
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'supplier_confirmed',
      platform_order_status: ['*'],
      actions: { other_ready_toship: true, order_cancel: true },
      status: 'wait_transport',
    },
    {
      platform: 'lazada',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'supplier_confirmed',
      platform_order_status: ['topack', 'repacked'],
      actions: { order_cancel: true, update_packing: true },
    },
    {
      platform: 'lazada',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'supplier_packed',
      platform_order_status: ['packed'],
      actions: { order_cancel: true, ready_toship: true, print: true },
    },
    {
      platform: 'lazada',
      role: 'supplier',
      odii_status: 3, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: '*',
      platform_order_status: ['ready_to_ship_pending', 'ready_to_ship'],
      actions: { order_cancel: true, print: true },
    },
    {
      platform: 'shopee',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'supplier_confirmed',
      platform_order_status: ['READY_TO_SHIP'],
      actions: { order_cancel: true, shopee_update_packing: true },
    },
    {
      platform: 'tiktok',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'supplier_confirmed',
      platform_order_status: ['111'],
      actions: {
        order_cancel: true,
        tiktok_ready_toship: true,
        print_pack_list: true,
      },
    },
    {
      platform: '*',
      role: 'supplier',
      odii_status: 3, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: '*',
      platform_order_status: ['*'],
      actions: { order_cancel: true, print: true },
    },
  ],
  ORDER_ACTION_TYPE_NAME: [
    {
      id: 'seller_confirm',
      name: 'Xác nhận đơn',
      count_name: 'seller_confirm_count',
      color: 'blue',
      title: 'Xác nhận đơn',
      confirm_message: 'Bạn có chắc chắn muốn xác nhận {0} đơn hàng này không?',
    },
    {
      id: 'supplier_confirm',
      name: 'Xác nhận đơn',
      count_name: 'supplier_confirm_count',
      color: 'blue',
      title: 'Xác nhận cung cấp đơn hàng',
      confirm_message: 'Bạn có chắc chắn muốn cung cấp {0} đơn hàng này không?',
    },
    {
      id: 'update_packing',
      name: 'Đóng gói',
      count_name: 'update_packing_count',
      color: 'blue',
      title: 'Xác nhận đóng gói đơn hàng',
      confirm_message: 'Bạn có chắc chắn muốn đóng gói {0} đơn hàng này không?',
    },
    {
      id: 'shopee_update_packing',
      name: 'Chuẩn bị hàng',
      count_name: 'shopee_update_packing_count',
    },
    {
      id: 'ready_toship',
      name: 'Sẵn sàng vận chuyển',
      count_name: 'ready_toship_count',
      color: 'blue',
      title: 'Xác nhận vận chuyển đơn hàng',
      confirm_message: 'Bạn có chắc chắn vận chuyển {0} đơn hàng này không?',
    },
    {
      id: 'tiktok_ready_toship',
      name: 'Sắp xếp vận chuyển',
      count_name: 'tiktok_ready_toship_count',
    },
    {
      id: 'other_ready_toship',
      name: 'Sắp xếp vận chuyển',
      count_name: 'other_ready_toship_count',
    },
    { id: 'print', name: 'In đơn hàng', count_name: 'print_count' },
    {
      id: 'print_pack_list',
      name: 'In phiếu đóng gói',
      count_name: 'print_pack_list_count',
    },

    {
      id: 'order_cancel',
      name: 'Hủy đơn hàng',
      count_name: 'order_cancel_count',
      color: 'red',
      title: 'Xác nhận hủy đơn hàng',
      confirm_message: 'Bạn có chắc chắn hủy {0} đơn hàng này không?',
    },
  ],
  ORDER_CANCEL_REASON_NOTE: [
    {
      id: 'Buyer requested cancellation',
      name: 'Người mua yêu cầu hủy đơn',
    },
    {
      id: 'Unable to deliver to buyer address',
      name: 'Không thể giao hàng tới khu vực này',
    },
    {
      id: 'Undeliverable Area',
      name: 'Không thể giao hàng tới khu vực này',
    },
    {
      id: 'Out of stock',
      name: 'Hết hàng',
    },
    {
      id: 'Seller did not Ship',
      name: 'Người bán không gửi hàng',
    },
    {
      id: 'Pricing error',
      name: 'Hủy bởi nhà bán do sai giá',
    },
    {
      id: 'Buyer requested cancellation',
      name: 'Người mua yêu cầu hủy đơn',
    },
    {
      id: 'Need to change delivery address',
      name: 'Cần thay đổi địa chỉ giao hàng',
    },
    {
      id: 'Need to change payment method',
      name: 'Cần thay đổi phương thức thanh toán',
    },
    {
      id: 'High delivery costs',
      name: 'Chi phí giao hàng cao',
    },
    {
      id: 'Buyer overdue to pay',
      name: 'Người mua quá hạn thanh toán',
    },
    {
      id: 'Automatically cancelled due to collection time out',
      name: 'Tự động bị hủy do hết thời gian nhận',
    },
    {
      id: 'Wrong delivery information',
      name: 'Thông tin giao hàng sai',
    },
    {
      id: 'Buyer Request to Cancel',
      name: 'Người mua yêu cầu hủy đơn',
    },
  ],
  ORDER_CANCEL_REASON: {
    lazada: [
      { id: '15', name: 'Hết hàng' },
      { id: '21', name: 'Hủy bởi nhà bán do sai giá' },
    ],
    shopee: [
      { id: 'OUT_OF_STOCK', name: 'Hết hàng' },
      { id: 'CUSTOMER_REQUEST', name: 'Người mua yêu cầu hủy đơn' },
      { id: 'UNDELIVERABLE_AREA', name: 'Không thể giao hàng tới khu vực này' },
      { id: 'COD_NOT_SUPPORTED', name: 'Không hỗ trợ thanh toán COD' },
    ],
    tiktok: [
      {
        id: 'seller_cancel_unpaid_reason_buyer_requested_cancellation',
        name: 'Người mua yêu cầu hủy đơn',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_unpaid_reason_buyer_hasnt_paid_within_time_allowed',
        name: 'Người mua không thanh toán đúng hạn',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_unpaid_reason_wrong_price',
        name: 'Hủy bởi nhà bán do sai giá',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_paid_reason_address_not_deliver',
        name: 'Không thể giao hàng tới khu vực này',
        available_status_list: ['111', '112'],
      },
      {
        id: 'seller_cancel_reason_out_of_stock',
        name: 'Hết hàng',
        available_status_list: ['111', '112'],
      },
      {
        id: 'seller_cancel_unpaid_reason_out_of_stock',
        name: 'Hết hàng',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_reason_wrong_price',
        name: 'Hủy bởi nhà bán do sai giá',
        available_status_list: ['111', '112'],
      },
      {
        id: 'seller_cancel_paid_reason_buyer_requested_cancellation',
        name: 'Người mua yêu cầu hủy đơn',
        available_status_list: ['111', '112'],
      },
    ],
  },
  SHIPMENT_REASON: [
    {
      id: 'CHOTHUHANG',
      name: 'Cho thử hàng',
    },
    {
      id: 'CHOXEMHANGKHONGTHU',
      name: 'Cho xem hàng không thử',
    },
    {
      id: 'KHONGCHOXEMHANG',
      name: 'Không cho xem hàng',
    },
  ],
};
