import React, { useState, useEffect } from "react";
import { getConfig } from "@edx/frontend-platform";
import { fetchUserOrders } from "../data/services/lms/api";
import { StatusOrder } from "../data/services/lms/constants";
import { formatCurrency } from "../data/utils/helper";
import iconPaid from "../assets/shopping-cart.png";
import iconPending from "../assets/return.png";

const PaymentHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(StatusOrder.PAID);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const response = await fetchUserOrders();
        setOrders(response.data?.results || response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.status === StatusOrder.PENDING,
  );
  const paidOrders = orders.filter(
    (order) =>
      order.status === StatusOrder.PAID ||
      order.status === StatusOrder.COMPLETED,
  );

  const currentOrders =
    activeTab === StatusOrder.PAID ? paidOrders : pendingOrders;

  const currentIcon = activeTab === StatusOrder.PAID ? iconPaid : iconPending;

  // --- Styles ---
  const tabStyle = (isActive) => ({
    padding: "0.5rem 1.5rem",
    cursor: "pointer",
    borderBottom: isActive ? "3px solid" : "3px solid transparent",
    fontWeight: isActive ? "bold" : "normal",
    transition: "0.3s",
    color: isActive ? "#0056A1" : "",
  });
  useEffect(() => {
    console.log("Cấu hình đầy đủ từ getConfig:", getConfig());
  }, []);

  return (
    <div style={{ padding: "0 1rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ margin: "1rem 0" }}>Lịch sử mua</h2>

      {/* Thanh Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #dee2e6",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={tabStyle(activeTab === StatusOrder.PAID)}
          onClick={() => setActiveTab(StatusOrder.PAID)}
        >
          Giao dịch mua ({paidOrders.length})
        </div>
        <div
          style={tabStyle(activeTab === StatusOrder.PENDING)}
          onClick={() => setActiveTab(StatusOrder.PENDING)}
        >
          Đang xử lý ({pendingOrders.length})
        </div>
      </div>

      {/* Nội dung danh sách */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : currentOrders.length > 0 ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {currentOrders.map((order) => (
            <div
              key={order.order_id}
              style={{
                padding: "1.2rem",
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flex: 1,
                }}
              >
                <img
                  src={currentIcon}
                  alt="status-icon"
                  style={{
                    width: "25px",
                    height: "25px",
                    objectFit: "contain",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <a
                    href={order.extra_data?.next}
                    style={{
                      textDecoration: "none",
                      color: "#0056A1",
                      fontWeight: "bold",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "1.1rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {order.extra_data?.course_name ||
                        "Khóa học không xác định"}
                    </p>
                  </a>
                  <p style={{ margin: "0", fontSize: "0.9rem", color: "#555" }}>
                    {order.extra_data?.payment_method?.label || "N/A"}
                  </p>
                  <small
                    style={{
                      color: "#adb5bd",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    Ngày mua:{" "}
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </small>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  {formatCurrency(order.amount, order.currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px dashed #dee2e6",
          }}
        >
          <p style={{ color: "#6c757d" }}>
            Bạn không có giao dịch nào trong mục này.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
