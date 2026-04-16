/**
  Dưới đây là thứ tự từ ngoài vào trong (từ giao diện người dùng đến mạng internet):

Giao diện (UI Component): Người dùng bấm nút (ví dụ: Hủy khóa học).
api.js (Người điều phối): Tiếp nhận yêu cầu, biết cần dùng hàm nào, dữ liệu gì.
urls.js (Bản đồ): Cung cấp địa chỉ chính xác của Server để gửi dữ liệu đến.
constants.js (Từ điển): Đảm bảo tên các tham số (như course_id) khớp chính xác với những gì Server yêu cầu.
utils.js (Công cụ kỹ thuật): Đóng gói dữ liệu thành định dạng URL (Query string) và gắn thêm mã xác thực (Token) để Server nhận diện bạn.
 */

import { get, post, stringifyUrl } from "./utils";
import urls from "./urls";

/** *******************************************************************************
 * 1. Nhóm API Hệ thống & Khởi tạo (Mặc định edX)
 ******************************************************************************** */

// Lấy dữ liệu khởi tạo cho Learner Home Dashboard
export const initializeList = ({ user } = {}) =>
  get(stringifyUrl(urls.getInitApiUrl(), { user }));

// Ghi lại các sự kiện tracking người dùng
export const logEvent = ({ eventName, data, courseId }) =>
  post(urls.event(), {
    courserun_key: courseId,
    event_type: eventName,
    page: window.location.href,
    event: JSON.stringify(data),
  });

/** *******************************************************************************
 * 2. Nhóm API Nghiệp vụ CUSC (Tái sử dụng logic từ Node.js)
 ******************************************************************************** */

/**
 * Tra cứu thông tin User theo username
 * Tương ứng bảng: AUTH_USER
 */
export const lookupUser = async (username) => {
  if (!username) {
    throw new Error("Thiếu username để tra cứu user");
  }
  const response = await get(urls.userLookupUrl(username));
  const { data } = response;
  if (!data.count || data.count < 1) {
    throw new Error(`Không tìm thấy user "${username}"`);
  }
  return data.results[0];
};

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại
 * Tương ứng bảng: CUSC_ECOMMERCE_ORDER
 */
export const fetchUserOrders = () => get(urls.getOrdersUrl());

/**
 * Lấy chi tiết một đơn hàng cụ thể
 */
export const fetchOrderDetail = (orderId) => {
  if (!orderId) {
    throw new Error("Thiếu orderId");
  }
  return get(urls.getOrderDetailUrl(orderId)).then((res) => res.data);
};

/**
 * Lấy thông tin giá và các chế độ học (modes) của khóa học
 * Tương ứng bảng: COURSE_MODES_COURSEMODE
 */
export const fetchCoursePricing = async (courseId, mode) => {
  const response = await get(urls.coursePricingUrl(courseId));
  const { data } = response;

  // Logic tìm mode phù hợp (ưu tiên 'verified' nếu không truyền mode cụ thể)
  const chosen = mode
    ? data.modes.find((m) => m.mode_slug === mode)
    : data.modes.find((m) => m.mode_slug === "verified") || data.modes[0];

  return {
    courseId: data.course_id,
    mode: chosen.mode_slug,
    price: chosen.price,
    currency: chosen.currency,
    mode_display_name: chosen.mode_display_name,
    raw: chosen,
  };
};

/**
 * Lấy thông tin chi tiết khóa học (mô tả, ảnh, tiêu đề)
 * Tương ứng bảng: COURSE_OVERVIEWS_COURSEOVERVIEW
 */
export const fetchCourseDetail = (courseId) =>
  get(urls.courseDetailUrl(courseId)).then((res) => res.data);

/** *******************************************************************************
 * Export Default
 ******************************************************************************** */

export default {
  initializeList,
  logEvent,
  lookupUser,
  fetchUserOrders,
  fetchOrderDetail,
  fetchCoursePricing,
  fetchCourseDetail,
};
