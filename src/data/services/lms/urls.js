import { getConfig } from "@edx/frontend-platform";
import StrictDict from "../../utils/StrictDict";

// --- Các hàm bổ trợ (Internal Helpers) ---
const getBaseUrl = () => getConfig().LMS_BASE_URL;
export const getApiUrl = () => `${getConfig().LMS_BASE_URL}/api`;
const cuscApiBase = () => `${getApiUrl()}/cusc-edx-api`;

// --- Các hàm xử lý URL (URL Utilities) ---
export const updateUrl = (base, url) =>
  url == null || url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${base}${url}`;

export const baseAppUrl = (url) => updateUrl(getBaseUrl(), url);
export const learningMfeUrl = (url) =>
  updateUrl(getConfig().LEARNING_BASE_URL, url);

// --- 1. Nhóm URL Hệ thống & Dashboard ---
export const getInitApiUrl = () => `${getApiUrl()}/learner_home/init`;
export const event = () => `${getBaseUrl()}/event`;
export const programsUrl = () => baseAppUrl("/dashboard/programs");

// --- 2. Nhóm URL Thanh toán & Tín chỉ (Mặc định edX) ---
export const creditPurchaseUrl = (courseId) => {
  const config = getConfig();
  return config.CREDIT_PURCHASE_URL
    ? `${config.CREDIT_PURCHASE_URL}/${courseId}/`
    : `${config.ECOMMERCE_BASE_URL}/credit/checkout/${courseId}/`;
};
export const creditRequestUrl = (providerId) =>
  `${getApiUrl()}/credit/v1/providers/${providerId}/request/`;

// --- 3. Nhóm URL Nghiệp vụ CUSC (Tái sử dụng từ file Node.js) ---

// Tra cứu người dùng
export const userLookupUrl = (username) =>
  `${cuscApiBase()}/users/lookup/?username=${encodeURIComponent(username)}`;

// Quản lý đơn hàng (Bảng CUSC_ECOMMERCE_ORDER)
export const getOrdersUrl = () => `${cuscApiBase()}/orders/`;
export const getOrderDetailUrl = (orderId) =>
  `${cuscApiBase()}/orders/${orderId}/`;

// Thông tin khóa học & Giá (Bảng COURSE_OVERVIEWS & COURSE_MODES)
export const coursePricingUrl = (courseId) =>
  `${cuscApiBase()}/course-pricing/${encodeURIComponent(courseId)}/`;
export const courseDetailUrl = (courseId) =>
  `${cuscApiBase()}/course-detail/${encodeURIComponent(courseId)}/`;

// --- Export Default với StrictDict để bảo vệ ---
export default StrictDict({
  getApiUrl,
  baseAppUrl,
  learningMfeUrl,
  getInitApiUrl,
  event,
  programsUrl,
  creditPurchaseUrl,
  creditRequestUrl,
  // CUSC APIs
  userLookupUrl,
  getOrdersUrl,
  getOrderDetailUrl,
  coursePricingUrl,
  courseDetailUrl,
});
