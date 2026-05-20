export function RecommendationCardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: "0.75rem", width: "30%", marginBottom: "0.5rem" }} />
          <div className="skeleton" style={{ height: "1.1rem", width: "75%" }} />
        </div>
        <div className="skeleton" style={{ height: "1.75rem", width: "4rem", borderRadius: "100px", flexShrink: 0, marginLeft: "0.75rem" }} />
      </div>
      <div className="skeleton" style={{ height: "0.85rem", width: "100%" }} />
      <div className="skeleton" style={{ height: "0.85rem", width: "80%" }} />
      <div className="skeleton" style={{ height: "0.8rem", width: "50%" }} />
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: "1.5rem", width: "3.5rem", borderRadius: "100px" }} />
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid var(--border-light)",
          paddingTop: "0.75rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="skeleton" style={{ height: "0.75rem", width: "40%" }} />
        <div className="skeleton" style={{ height: "0.75rem", width: "25%" }} />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <div className="skeleton" style={{ height: "2.5rem", width: "2.5rem", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
      <div className="skeleton" style={{ height: "1.1rem", width: "55%", marginBottom: "0.5rem" }} />
      <div className="skeleton" style={{ height: "0.85rem", width: "100%", marginBottom: "0.35rem" }} />
      <div className="skeleton" style={{ height: "0.85rem", width: "80%", marginBottom: "1rem" }} />
      <div className="skeleton" style={{ height: "0.875rem", width: "45%", borderRadius: "100px" }} />
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <div className="skeleton" style={{ height: "3rem", width: "3rem", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: "0.875rem", width: "60%", marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ height: "0.8rem", width: "40%" }} />
      </div>
      <div className="skeleton" style={{ height: "2rem", width: "4rem", borderRadius: "100px" }} />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="card" style={{ padding: "2rem" }}>
      <div className="skeleton" style={{ height: "0.875rem", width: "25%", marginBottom: "0.75rem" }} />
      <div className="skeleton" style={{ height: "2rem", width: "65%", marginBottom: "0.5rem" }} />
      <div className="skeleton" style={{ height: "0.875rem", width: "30%", marginBottom: "2rem" }} />
      <div className="skeleton" style={{ height: "0.875rem", width: "100%", marginBottom: "0.5rem" }} />
      <div className="skeleton" style={{ height: "0.875rem", width: "100%", marginBottom: "0.5rem" }} />
      <div className="skeleton" style={{ height: "0.875rem", width: "80%", marginBottom: "2rem" }} />
      <div className="skeleton" style={{ height: "0.875rem", width: "40%", marginBottom: "0.5rem" }} />
      <div className="skeleton" style={{ height: "0.875rem", width: "60%" }} />
    </div>
  );
}