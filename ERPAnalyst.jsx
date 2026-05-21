import { useState, useEffect, useRef } from "react";

// ─── DATA MODEL ────────────────────────────────────────────────────────────────

const ERP_SYSTEMS = [
  { id: "sap", name: "SAP S/4HANA", type: "ERP", status: "active", version: "2023.1", vendor: "SAP SE", modules: ["FI", "CO", "MM", "SD", "HR"], dataPrivacy: "POPIA", health: 97 },
  { id: "oracle", name: "Oracle Fusion", type: "ERP", status: "active", version: "23D", vendor: "Oracle Corp", modules: ["GL", "AP", "AR", "SCM", "HCM"], dataPrivacy: "GDPR", health: 89 },
  { id: "dynamics", name: "MS Dynamics 365", type: "ERP", status: "warning", version: "9.2", vendor: "Microsoft", modules: ["Finance", "Sales", "Supply Chain", "HR"], dataPrivacy: "POPIA", health: 74 },
  { id: "sql", name: "SQL Developer", type: "Database", status: "active", version: "23.1", vendor: "Oracle", modules: ["Query", "Schema", "Migration", "Reports"], dataPrivacy: "Internal", health: 99 },
  { id: "bi", name: "Power BI Gateway", type: "Analytics", status: "active", version: "Aug 2025", vendor: "Microsoft", modules: ["Dashboards", "ETL", "Reports"], dataPrivacy: "GDPR", health: 92 },
];

const INTEGRATIONS = [
  { id: "int-001", source: "sap", target: "sql", type: "ETL", frequency: "Hourly", status: "healthy", lastSync: "2026-05-19T10:00:00Z", recordsToday: 48200, latencyMs: 340 },
  { id: "int-002", source: "oracle", target: "bi", type: "API", frequency: "Real-time", status: "healthy", lastSync: "2026-05-19T10:58:00Z", recordsToday: 12800, latencyMs: 95 },
  { id: "int-003", source: "dynamics", target: "sap", type: "Middleware", frequency: "Daily", status: "degraded", lastSync: "2026-05-18T23:00:00Z", recordsToday: 3100, latencyMs: 1820 },
  { id: "int-004", source: "sql", target: "oracle", type: "JDBC", frequency: "On-demand", status: "healthy", lastSync: "2026-05-19T08:30:00Z", recordsToday: 7400, latencyMs: 210 },
  { id: "int-005", source: "bi", target: "dynamics", type: "OData", frequency: "4-hourly", status: "error", lastSync: "2026-05-19T06:00:00Z", recordsToday: 0, latencyMs: null },
];

const UAT_CASES = [
  { id: "UAT-001", system: "sap", module: "FI – AP Invoice Processing", priority: "P1", status: "passed", tester: "S.Ngcobo", steps: 12, passed: 12, defects: 0, notes: "All financial posting entries validated against GL." },
  { id: "UAT-002", system: "oracle", module: "HCM – Employee Onboarding", priority: "P2", status: "passed", tester: "S.Ngcobo", steps: 9, passed: 9, defects: 0, notes: "Role-based access confirmed for all 3 user types." },
  { id: "UAT-003", system: "dynamics", module: "Sales – Opportunity Pipeline", priority: "P2", status: "failed", tester: "S.Ngcobo", steps: 8, passed: 5, defects: 3, notes: "Currency conversion bug on ZAR → USD. Escalated to vendor." },
  { id: "UAT-004", system: "sap", module: "MM – Purchase Order Workflow", priority: "P1", status: "in-progress", tester: "S.Ngcobo", steps: 14, passed: 10, defects: 1, notes: "Testing approval matrix with 3-tier escalation path." },
  { id: "UAT-005", system: "sql", module: "Schema Migration – v3 → v4", priority: "P1", status: "passed", tester: "S.Ngcobo", steps: 6, passed: 6, defects: 0, notes: "All foreign key constraints and indexes validated." },
  { id: "UAT-006", system: "oracle", module: "GL – Period Close Automation", priority: "P1", status: "in-progress", tester: "S.Ngcobo", steps: 11, passed: 7, defects: 2, notes: "Automated journal reversal under investigation." },
];

const REQUIREMENTS = [
  { id: "REQ-001", title: "ERP Data Sync – SAP to Oracle GL Reconciliation", system: ["sap", "oracle"], priority: "P1", status: "approved", source: "Finance Lead", complexity: "High", privacyFlag: true, description: "End-of-month GL balance reconciliation between SAP FI and Oracle Fusion GL. Must handle multi-currency and intercompany eliminations." },
  { id: "REQ-002", title: "Dynamics 365 Sales Pipeline Integration with BI", system: ["dynamics", "bi"], priority: "P2", status: "in-analysis", source: "Sales Director", complexity: "Medium", privacyFlag: false, description: "Real-time opportunity data from Dynamics CRM piped into Power BI for executive dashboards. Sub-5 minute refresh SLA." },
  { id: "REQ-003", title: "POPIA Compliance Audit – Employee Data Fields", system: ["sap", "dynamics"], priority: "P1", status: "approved", source: "Compliance Officer", complexity: "High", privacyFlag: true, description: "Identify and classify all PII fields across SAP HR and Dynamics. Map data flows, retention policies, and access controls per POPIA Section 22." },
  { id: "REQ-004", title: "SQL Developer Schema Optimisation – Query Performance", system: ["sql"], priority: "P3", status: "backlog", source: "DBA Team", complexity: "Medium", privacyFlag: false, description: "Top 20 slow-running queries identified from AWR reports. Index strategy review and execution plan optimisation." },
  { id: "REQ-005", title: "Oracle AP – Automated 3-Way Match Implementation", system: ["oracle"], priority: "P1", status: "in-analysis", source: "Procurement Lead", complexity: "High", privacyFlag: false, description: "Automate PO → GRN → Invoice matching in Oracle AP with exception routing to workflow queues. Target: 80% straight-through processing." },
];

const DEFECTS = [
  { id: "DEF-001", uat: "UAT-003", system: "dynamics", severity: "S2", title: "ZAR→USD currency conversion off by factor of 1.1", status: "open", assignee: "Vendor Support", dateLogged: "2026-05-18", daysOpen: 1 },
  { id: "DEF-002", uat: "UAT-004", system: "sap", severity: "S3", title: "PO approval bypasses Level-3 approver when amount < R500k", status: "in-fix", assignee: "SAP Config Team", dateLogged: "2026-05-17", daysOpen: 2 },
  { id: "DEF-003", uat: "UAT-006", system: "oracle", severity: "S2", title: "Automated journal reversal fails on last business day of month", status: "open", assignee: "Oracle DBA", dateLogged: "2026-05-19", daysOpen: 0 },
  { id: "DEF-004", uat: "UAT-006", system: "oracle", severity: "S4", title: "Period close UI tooltip text truncated in Firefox", status: "open", assignee: "UI Team", dateLogged: "2026-05-19", daysOpen: 0 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const STATUS_COLOR = {
  active: "#22d3a0", healthy: "#22d3a0", passed: "#22d3a0", approved: "#22d3a0",
  warning: "#f5c518", degraded: "#f5c518", "in-progress": "#f5c518", "in-analysis": "#f5c518", "in-fix": "#f5c518",
  error: "#ff4560", failed: "#ff4560", open: "#ff4560",
  backlog: "#6b7280", inactive: "#6b7280"
};
const sc = k => STATUS_COLOR[k] || "#6b7280";

const SEV_COLOR = { S1: "#ff4560", S2: "#f5c518", S3: "#22d3a0", S4: "#6b7280" };

function Badge({ value, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 9px", borderRadius: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
      color: color || sc(value),
      background: `${color || sc(value)}18`,
      border: `1px solid ${color || sc(value)}40`,
      textTransform: "uppercase"
    }}>{value}</span>
  );
}

function HealthRing({ pct, color }) {
  const r = 18, circ = 2 * Math.PI * r;
  return (
    <svg width="44" height="44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
      <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" transform="rotate(-90 22 22)" />
      <text x="22" y="27" textAnchor="middle" fontSize="10" fill={color} fontFamily="monospace" fontWeight="700">{pct}</text>
    </svg>
  );
}

function FlowDiagram({ integrations, systems }) {
  const sysMap = Object.fromEntries(systems.map(s => [s.id, s]));
  const positions = { sap: [80, 100], oracle: [280, 60], dynamics: [480, 100], sql: [180, 220], bi: [380, 220] };
  const W = 560, H = 300;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#22d3a0" />
        </marker>
        <marker id="arrow-yellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#f5c518" />
        </marker>
        <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#ff4560" />
        </marker>
      </defs>

      {integrations.map(int => {
        const [x1, y1] = positions[int.source] || [0, 0];
        const [x2, y2] = positions[int.target] || [0, 0];
        const color = int.status === "healthy" ? "#22d3a0" : int.status === "degraded" ? "#f5c518" : "#ff4560";
        const markerId = int.status === "healthy" ? "arrow-green" : int.status === "degraded" ? "arrow-yellow" : "arrow-red";
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        return (
          <g key={int.id}>
            <line x1={x1 + 36} y1={y1 + 16} x2={x2 + 36} y2={y2 + 16}
              stroke={color} strokeWidth={int.status === "error" ? 1.5 : 2}
              strokeDasharray={int.status === "error" ? "5,3" : "none"}
              markerEnd={`url(#${markerId})`} opacity="0.7" />
            <rect x={mx + 20} y={my + 8} width={44} height={14} rx={3} fill="#0f1117" stroke={color} strokeWidth={0.5} opacity="0.9" />
            <text x={mx + 42} y={my + 18} textAnchor="middle" fontSize="8" fill={color} fontFamily="monospace">{int.type}</text>
          </g>
        );
      })}

      {systems.map(s => {
        const [x, y] = positions[s.id] || [0, 0];
        const color = sc(s.status);
        return (
          <g key={s.id}>
            <rect x={x} y={y} width={72} height={32} rx={6} fill="#161a24" stroke={color} strokeWidth={1.5} />
            <circle cx={x + 62} cy={y + 8} r={4} fill={color} opacity="0.9" />
            <text x={x + 36} y={y + 14} textAnchor="middle" fontSize="9" fill="#e0e4f0" fontFamily="monospace" fontWeight="700">{s.id.toUpperCase()}</text>
            <text x={x + 36} y={y + 26} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="sans-serif">{s.type}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "System Overview" },
  { id: "integrations", label: "Integrations" },
  { id: "requirements", label: "Requirements" },
  { id: "uat", label: "UAT & Testing" },
  { id: "defects", label: `Defects` },
];

export default function ERPAnalyst() {
  const [tab, setTab] = useState("overview");
  const [selectedSys, setSelectedSys] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedUAT, setSelectedUAT] = useState(null);
  const [newReq, setNewReq] = useState({ title: "", description: "", priority: "P2", source: "", privacyFlag: false });
  const [addingReq, setAddingReq] = useState(false);
  const [requirements, setRequirements] = useState(REQUIREMENTS);
  const [reqSaved, setReqSaved] = useState(false);

  const openDefects = DEFECTS.filter(d => d.status === "open").length;
  const passedUAT = UAT_CASES.filter(u => u.status === "passed").length;
  const degradedInt = INTEGRATIONS.filter(i => i.status !== "healthy").length;
  const privacyReqs = requirements.filter(r => r.privacyFlag).length;

  function submitReq() {
    const id = `REQ-00${requirements.length + 1}`;
    setRequirements(prev => [{ ...newReq, id, system: [], status: "backlog", complexity: "Medium" }, ...prev]);
    setReqSaved(true);
    setTimeout(() => { setReqSaved(false); setAddingReq(false); setNewReq({ title: "", description: "", priority: "P2", source: "", privacyFlag: false }); }, 1200);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f16", color: "#dde1f0", fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .row-hover:hover { background: rgba(255,255,255,0.035) !important; }
        .tab-item { transition: all 0.18s; border-bottom: 2px solid transparent; }
        .tab-item:hover { color: #dde1f0 !important; }
        .tab-item.active { color: #38bdf8 !important; border-bottom-color: #38bdf8 !important; }
        .sys-card:hover { border-color: rgba(56,189,248,0.35) !important; transform: translateY(-2px); }
        .sys-card { transition: all 0.2s; }
        input, textarea, select { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #dde1f0; border-radius: 6px; padding: 8px 12px; font-family: inherit; font-size: 13px; outline: none; width: 100%; }
        input:focus, textarea:focus, select:focus { border-color: rgba(56,189,248,0.4); }
        select option { background: #161b27; }
        textarea { resize: vertical; }
        .btn { cursor: pointer; border: none; border-radius: 7px; padding: 9px 18px; font-size: 13px; font-weight: 600; font-family: inherit; transition: all 0.15s; }
        .btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: #13172000; background: #13172199; backdrop-filter: blur(20px); background: #141820; border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; max-width: 680px; width: 100%; max-height: 82vh; overflow-y: auto; padding: 28px; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .ticker { animation: ticker 0.6s ease; }
        @keyframes ticker { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: "#0a0c13", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8 }}>
            <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #38bdf8, #6366f1)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>SA</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1 }}>SysAnalyst</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>ERP INTEGRATION PLATFORM</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 0, flex: 1 }}>
            {TABS.map(t => (
              <button key={t.id} className={`tab-item ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)} style={{
                  background: "none", border: "none", borderBottom: "2px solid transparent",
                  color: tab === t.id ? "#38bdf8" : "rgba(255,255,255,0.38)",
                  padding: "14px 14px", cursor: "pointer", fontSize: 12.5, fontWeight: 500,
                  fontFamily: "inherit", whiteSpace: "nowrap"
                }}>{t.label}{t.id === "defects" && openDefects > 0 ? ` (${openDefects})` : ""}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3a0", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Live · S.Ngcobo</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 28px 60px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>Enterprise Systems Overview</h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>ERP landscape · integration health · compliance status</p>
              </div>
              <span style={{ fontSize: 11, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.25)" }}>
                {new Date().toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>

            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                { label: "Systems Online", value: `${ERP_SYSTEMS.filter(s => s.status === "active").length}/${ERP_SYSTEMS.length}`, accent: "#22d3a0", sub: "ERP & database" },
                { label: "Integration Alerts", value: degradedInt, accent: degradedInt > 0 ? "#f5c518" : "#22d3a0", sub: "degraded / error" },
                { label: "UAT Pass Rate", value: `${Math.round((passedUAT / UAT_CASES.length) * 100)}%`, accent: "#38bdf8", sub: `${passedUAT}/${UAT_CASES.length} cases` },
                { label: "Privacy-Flagged Reqs", value: privacyReqs, accent: "#a78bfa", sub: "POPIA / GDPR" },
              ].map(k => (
                <div key={k.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "IBM Plex Mono", color: k.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 4 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Systems grid */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12 }}>Registered Systems</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {ERP_SYSTEMS.map(s => (
                  <div key={s.id} className="sys-card" onClick={() => setSelectedSys(s)}
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "16px 18px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{s.vendor} · v{s.version}</div>
                      </div>
                      <HealthRing pct={s.health} color={s.health > 90 ? "#22d3a0" : s.health > 75 ? "#f5c518" : "#ff4560"} />
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {s.modules.map(m => (
                        <span key={m} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: "rgba(56,189,248,0.1)", color: "#38bdf8", fontFamily: "IBM Plex Mono", border: "1px solid rgba(56,189,248,0.2)" }}>{m}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Badge value={s.status} />
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{s.dataPrivacy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration flow */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "20px 24px" }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 16 }}>Integration Topology</h3>
              <FlowDiagram integrations={INTEGRATIONS} systems={ERP_SYSTEMS} />
              <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
                {[["#22d3a0", "Healthy"], ["#f5c518", "Degraded"], ["#ff4560", "Error"]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <div style={{ width: 16, height: 2, background: c }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── INTEGRATIONS ── */}
        {tab === "integrations" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>Integration Monitor</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>Data flows, sync status, and latency tracking across ERP systems</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {INTEGRATIONS.map(int => {
                const src = ERP_SYSTEMS.find(s => s.id === int.source);
                const tgt = ERP_SYSTEMS.find(s => s.id === int.target);
                const color = sc(int.status);
                return (
                  <div key={int.id} className="row-hover" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: "14px 18px", display: "grid", gridTemplateColumns: "90px 1fr 90px 100px 80px 90px", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.3)" }}>{int.id}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{src?.name}</span>
                      <span style={{ color: color, fontSize: 14 }}>→</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{tgt?.name}</span>
                      <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 3, background: "rgba(56,189,248,0.1)", color: "#38bdf8", fontFamily: "IBM Plex Mono", border: "1px solid rgba(56,189,248,0.2)" }}>{int.type}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{int.frequency}</span>
                    <div>
                      <div style={{ fontSize: 11, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.6)" }}>
                        {int.recordsToday.toLocaleString()} rec
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>today</div>
                    </div>
                    <div>
                      {int.latencyMs !== null ? (
                        <>
                          <div style={{ fontSize: 11, fontFamily: "IBM Plex Mono", color: int.latencyMs > 1000 ? "#f5c518" : "#22d3a0" }}>
                            {int.latencyMs}ms
                          </div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)" }}>latency</div>
                        </>
                      ) : <span style={{ fontSize: 10, color: "#ff4560" }}>—</span>}
                    </div>
                    <Badge value={int.status} />
                  </div>
                );
              })}
            </div>

            {/* Alert */}
            <div style={{ background: "rgba(255,69,96,0.08)", border: "1px solid rgba(255,69,96,0.25)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, marginTop: 1 }}>⚠</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ff4560", marginBottom: 4 }}>INT-005 — Power BI → Dynamics 365 OData feed is down</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Last successful sync: 2026-05-19 06:00. 0 records transferred today. Escalate to Microsoft support. Workaround: manual CSV export from Dynamics available.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── REQUIREMENTS ── */}
        {tab === "requirements" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>Requirements Register</h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>Elicited requirements with privacy flags and stakeholder traceability</p>
              </div>
              <button className="btn" onClick={() => setAddingReq(true)} style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)" }}>
                + New Requirement
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {requirements.map(r => (
                <div key={r.id} className="row-hover" onClick={() => setSelectedReq(r)}
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px", cursor: "pointer", display: "grid", gridTemplateColumns: "80px 1fr 80px 80px 90px 32px", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.35)" }}>{r.id}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>Source: {r.source}</div>
                  </div>
                  <Badge value={r.priority} color={r.priority === "P1" ? "#ff4560" : r.priority === "P2" ? "#f5c518" : "#6b7280"} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{r.complexity}</span>
                  <Badge value={r.status} />
                  {r.privacyFlag && (
                    <span title="Privacy-flagged" style={{ fontSize: 14, color: "#a78bfa" }}>🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UAT ── */}
        {tab === "uat" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>UAT & System Testing</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>Test case tracking with defect traceability across ERP modules</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                { label: "Total Cases", value: UAT_CASES.length, color: "#dde1f0" },
                { label: "Passed", value: UAT_CASES.filter(u => u.status === "passed").length, color: "#22d3a0" },
                { label: "In Progress", value: UAT_CASES.filter(u => u.status === "in-progress").length, color: "#f5c518" },
                { label: "Failed", value: UAT_CASES.filter(u => u.status === "failed").length, color: "#ff4560" },
              ].map(k => (
                <div key={k.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "IBM Plex Mono", color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {UAT_CASES.map(u => {
                const pct = Math.round((u.passed / u.steps) * 100);
                const sys = ERP_SYSTEMS.find(s => s.id === u.system);
                return (
                  <div key={u.id} className="row-hover" onClick={() => setSelectedUAT(u)}
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${sc(u.status)}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                          <span style={{ fontSize: 10, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.3)" }}>{u.id}</span>
                          <Badge value={u.priority} color={u.priority === "P1" ? "#ff4560" : "#f5c518"} />
                          <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 3, background: "rgba(56,189,248,0.08)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }}>{sys?.name}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{u.module}</div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {u.defects > 0 && <span style={{ fontSize: 11, color: "#ff4560" }}>⚠ {u.defects} defect{u.defects > 1 ? "s" : ""}</span>}
                        <Badge value={u.status} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: sc(u.status), borderRadius: 2, transition: "width 0.4s" }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "IBM Plex Mono", color: sc(u.status), minWidth: 60, textAlign: "right" }}>{u.passed}/{u.steps} steps</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DEFECTS ── */}
        {tab === "defects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>Defect Register</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>Logged defects with severity, status, and UAT traceability</p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 60px 1fr 90px 80px 120px 70px", gap: 0, padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["ID", "Sev", "Title", "System", "Status", "Assignee", "Age"].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
                ))}
              </div>
              {DEFECTS.map(d => {
                const sys = ERP_SYSTEMS.find(s => s.id === d.system);
                return (
                  <div key={d.id} className="row-hover" style={{
                    display: "grid", gridTemplateColumns: "80px 60px 1fr 90px 80px 120px 70px",
                    gap: 0, padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                    borderLeft: `3px solid ${SEV_COLOR[d.severity] || "#6b7280"}`, alignItems: "center"
                  }}>
                    <span style={{ fontSize: 10, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.3)" }}>{d.id}</span>
                    <Badge value={d.severity} color={SEV_COLOR[d.severity]} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{d.title}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{d.uat}</div>
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{sys?.name}</span>
                    <Badge value={d.status} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{d.assignee}</span>
                    <span style={{ fontSize: 11, fontFamily: "IBM Plex Mono", color: d.daysOpen > 3 ? "#ff4560" : "rgba(255,255,255,0.45)" }}>
                      {d.daysOpen === 0 ? "Today" : `${d.daysOpen}d`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Defect summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {["S1", "S2", "S3", "S4"].map(sev => {
                const count = DEFECTS.filter(d => d.severity === sev).length;
                return (
                  <div key={sev} style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${SEV_COLOR[sev]}30`, borderRadius: 9, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "IBM Plex Mono", color: SEV_COLOR[sev] }}>{count}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{sev} · {sev === "S1" ? "Critical" : sev === "S2" ? "Major" : sev === "S3" ? "Minor" : "Cosmetic"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {/* System detail */}
      {selectedSys && (
        <div className="modal-bg" onClick={() => setSelectedSys(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>SYSTEM DETAIL</div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{selectedSys.name}</h2>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{selectedSys.vendor} · Version {selectedSys.version}</div>
              </div>
              <button onClick={() => setSelectedSys(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[
                ["Type", selectedSys.type],
                ["Status", selectedSys.status],
                ["Health Score", `${selectedSys.health}%`],
                ["Data Privacy", selectedSys.dataPrivacy],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8 }}>Modules</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedSys.modules.map(m => (
                  <span key={m} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 5, background: "rgba(56,189,248,0.08)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)", fontFamily: "IBM Plex Mono" }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requirement detail */}
      {selectedReq && (
        <div className="modal-bg" onClick={() => setSelectedReq(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{selectedReq.id}</div>
                <h2 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{selectedReq.title}</h2>
              </div>
              <button onClick={() => setSelectedReq(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                ["Priority", selectedReq.priority],
                ["Status", selectedReq.status],
                ["Complexity", selectedReq.complexity],
                ["Source", selectedReq.source],
                ["Privacy Flag", selectedReq.privacyFlag ? "🔒 Yes" : "No"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 6 }}>Description</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{selectedReq.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* UAT detail */}
      {selectedUAT && (
        <div className="modal-bg" onClick={() => setSelectedUAT(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "IBM Plex Mono", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{selectedUAT.id}</div>
                <h2 style={{ fontSize: 17, fontWeight: 700 }}>{selectedUAT.module}</h2>
              </div>
              <button onClick={() => setSelectedUAT(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                ["Status", selectedUAT.status],
                ["Priority", selectedUAT.priority],
                ["Tester", selectedUAT.tester],
                ["Steps Passed", `${selectedUAT.passed}/${selectedUAT.steps}`],
                ["Defects", selectedUAT.defects],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: k === "Defects" && v > 0 ? "#ff4560" : "inherit" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                <div style={{ width: `${(selectedUAT.passed / selectedUAT.steps) * 100}%`, height: "100%", background: sc(selectedUAT.status), borderRadius: 3 }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 6 }}>Evaluator Notes</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{selectedUAT.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* New Requirement form */}
      {addingReq && (
        <div className="modal-bg" onClick={() => setAddingReq(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>New Requirement</h2>
              <button onClick={() => setAddingReq(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.09em" }}>Title</label>
                <input value={newReq.title} onChange={e => setNewReq(p => ({ ...p, title: e.target.value }))} placeholder="Requirement title..." />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.09em" }}>Description</label>
                <textarea rows={3} value={newReq.description} onChange={e => setNewReq(p => ({ ...p, description: e.target.value }))} placeholder="Detail the business requirement, scope, and constraints..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.09em" }}>Priority</label>
                  <select value={newReq.priority} onChange={e => setNewReq(p => ({ ...p, priority: e.target.value }))}>
                    <option>P1</option><option>P2</option><option>P3</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.09em" }}>Stakeholder Source</label>
                  <input value={newReq.source} onChange={e => setNewReq(p => ({ ...p, source: e.target.value }))} placeholder="e.g. Finance Lead" />
                </div>
              </div>
              <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={newReq.privacyFlag} onChange={e => setNewReq(p => ({ ...p, privacyFlag: e.target.checked }))} style={{ width: "auto", accentColor: "#a78bfa" }} />
                <span style={{ fontSize: 13 }}>🔒 Flag for data privacy review (POPIA/GDPR)</span>
              </label>
              <button className="btn" onClick={submitReq} disabled={!newReq.title || reqSaved}
                style={{ background: reqSaved ? "rgba(34,211,160,0.1)" : "linear-gradient(135deg, #38bdf8, #6366f1)", color: reqSaved ? "#22d3a0" : "#fff", opacity: !newReq.title ? 0.5 : 1 }}>
                {reqSaved ? "✓ Requirement Logged" : "Log Requirement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
