import React from "react";

export default function PaymentTest() {
  const handlePayment = async () => {
    const tossPayments = window.TossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);

    try {
      await tossPayments.requestPayment("카드", {
        amount: 1500,
        orderId: "order_" + new Date().getTime(),
        orderName: "27.42 Refiner 테스트 결제",
        customerName: "테스트 사용자",
        successUrl: "https://refiner-backend.onrender.com/api/payment/success",
        failUrl: "https://refiner-backend.onrender.com/api/payment/fail",
      });
    } catch (err) {
      alert("결제 실패: " + err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>테스트 결제 페이지</h1>
      <button
        onClick={handlePayment}
        style={{ padding: "1rem 2rem", marginTop: 20, fontSize: "1.1rem", backgroundColor: "#0064FF", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
      >
        테스트 결제하기
      </button>
    </div>
  );
}
