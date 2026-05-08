const steps = [
  { key: "pending",    label: "Order Placed" },
  { key: "processing", label: "Processing"   },
  { key: "shipped",    label: "Shipped"      },
  { key: "delivered",  label: "Delivered"    },
]

const IconCheck = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
)

export default function OrderTracking({ status }) {
  const currentIndex = steps.findIndex(s => s.key === status)

  if (status === "cancelled") {
    return (
      <div style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", borderRadius: 10, padding: "20px 24px", textAlign: "center", color: "#EF4444", fontSize: 14, fontWeight: 500, fontFamily: "'Inter',sans-serif" }}>
        This order has been cancelled
      </div>
    )
  }

  const progressPct = currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0

  return (
    <div style={{ position: "relative", padding: "8px 0" }}>
      {/* Background line */}
      <div style={{ position: "absolute", top: 20, left: "4%", right: "4%", height: 2, background: "var(--border)", zIndex: 0 }} />
      {/* Progress line */}
      <div style={{ position: "absolute", top: 20, left: "4%", height: 2, background: "var(--accent)", zIndex: 0, width: `${progressPct * 0.92}%`, transition: "width 0.6s ease" }} />

      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex
          return (
            <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isCompleted ? "var(--accent)" : "var(--bg3)",
                border: `2px solid ${isCompleted ? "var(--accent)" : "var(--border)"}`,
                color: isCompleted ? "#fff" : "var(--text3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 600, transition: "all 0.3s",
              }}>
                {isCompleted ? <IconCheck /> : index + 1}
              </div>
              <span style={{ fontSize: 12, fontFamily: "'Inter',sans-serif", fontWeight: isCompleted ? 600 : 400, color: isCompleted ? "var(--text)" : "var(--text3)", textAlign: "center" }}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}