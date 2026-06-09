# 🔍 ERPAnalyst: Enterprise System Integration & UAT Intelligence

**Comprehensive ERP landscape monitoring, integration health tracking, and UAT orchestration platform.**

---

## 🎯 Overview

**ERPAnalyst** is an **enterprise-grade ERP management dashboard** designed for technical teams overseeing complex multi-system environments. It provides:

- **System overview** — Real-time health & compliance status across ERP ecosystem
- **Integration monitoring** — Data flow tracking, latency analysis, error detection
- **Requirements management** — Privacy-flagged requirement traceability
- **UAT orchestration** — Test case tracking with defect correlation
- **Defect lifecycle** — Severity-based prioritization & assignee tracking

---

## ✨ Key Features

### 🖥️ System Overview
- **5+ integrated ERP systems**: SAP, Oracle, Dynamics 365, SQL, Power BI
- **Health ring visualization**: Circular progress indicators (97% → 89% health)
- **Module breakdown**: Displays active modules per system (FI, CO, MM, SD, HR, etc.)
- **Data privacy tagging**: POPIA, GDPR compliance flags
- **Integration topology diagram**: SVG flow visualization with status indicators

### 🔄 Integration Monitor
- **Real-time data flows**: Source → Target system tracking
- **5 active integrations**: ETL, API, Middleware, JDBC, OData types
- **Frequency tracking**: Hourly, Real-time, Daily, On-demand, 4-hourly
- **Latency measurement**: Response time in milliseconds (95ms–1820ms)
- **Daily record counts**: Volume metrics (3.1k–48.2k records/day)
- **Status indicators**: Healthy (green), Degraded (yellow), Error (red, dashed)
- **Alert zone**: Prominent INT-005 failure notice with escalation guidance

### 📋 Requirements Register
- **5 elicited requirements** from Finance, Sales, Compliance teams
- **Priority levels**: P1 (Critical), P2 (High), P3 (Low)
- **Complexity ratings**: High, Medium
- **Status tracking**: Approved, In-Analysis, Backlog
- **Privacy flags**: 🔒 POPIA/GDPR-sensitive requirements highlighted
- **New requirement form**: Modal dialog for requirement submission
- **Stakeholder traceability**: Source tracking (Finance Lead, Sales Director, etc.)

### ✅ UAT & Testing
- **6 test cases** across all ERP modules
- **Pass/Fail metrics**: 3/6 passed (50% pass rate)
- **Progress bars**: Visual step completion (7/11, 10/14, etc.)
- **Defect correlation**: Linked to defect register (UAT-003 → DEF-001)
- **Priority indicators**: P1/P2 color-coded badges
- **Notes field**: Evaluator comments (currency issues, approver bypasses, etc.)

### 🐛 Defect Register
- **4 logged defects** with severity levels
- **Severity scale**: S1 (Critical), S2 (Major), S3 (Minor), S4 (Cosmetic)
- **Age tracking**: Days open (flagged if > 3 days)
- **Assignee mapping**: Vendor Support, Config Teams, DBAs, UI Teams
- **Status workflow**: Open → In-Fix → Resolved
- **UAT traceability**: Each defect linked to test case
- **Frequency summary**: Defect count by severity (1×S1, 1×S2, 1×S3, 1×S4)

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Recharts (charting) |
| **Data Visualization** | SVG flow diagram, charts |
| **State Management** | React Hooks (useState, useMemo) |
| **Styling** | Inline CSS + IBM Plex fonts |
| **Icons** | Font Awesome 6.4 |
| **Data Format** | JavaScript objects (mock) |

---

## 🚀 Quick Start

### 1. **Clone & Install**
```bash
git clone https://github.com/SPVNgcobo/ERPAnalyst
cd ERPAnalyst
npm install
npm run dev
```

### 2. **Access Dashboard**
- **URL**: `http://localhost:3000`
- **Default Tab**: System Overview
- **Status Indicator**: "Live · S.Ngcobo" (bottom right)

### 3. **Navigate Tabs**

| Tab | Purpose |
|-----|---------|
| **System Overview** | KPI cards, system grid, topology diagram |
| **Integrations** | Monitor data flows, latency, error detection |
| **Requirements** | Track elicited requirements, privacy flags |
| **UAT & Testing** | Test case status, defect correlation |
| **Defects** | Defect lifecycle, severity breakdown |

---

## 📊 Core Workflows

### Workflow 1: System Health Assessment
1. Navigate to **System Overview** tab
2. Review KPI cards:
   - Systems Online: **4/5**
   - Integration Alerts: **1 degraded**
   - UAT Pass Rate: **50%**
   - Privacy-Flagged Reqs: **3**
3. Click system card (e.g., "SAP S/4HANA") for details
4. Modal shows: Type, Status, Health %, Modules, Data Privacy compliance

### Workflow 2: Integration Troubleshooting
1. Go to **Integrations** tab
2. Scan for status indicators:
   - ✅ Healthy: SAP→SQL, Oracle→BI, SQL→Oracle
   - ⚠️ Degraded: Dynamics→SAP (1820ms latency)
   - ❌ Error: Power BI→Dynamics (dashed line, no sync)
3. Click error row for details
4. Alert zone provides: Last sync time, workaround instructions

### Workflow 3: UAT Progress Tracking
1. Navigate to **UAT & Testing** tab
2. Review pass/fail summary (50% completion)
3. Click test case (e.g., "UAT-003 — Sales Pipeline")
4. Modal shows: Steps passed (5/8), Defects (3), Evaluator notes
5. Progress bar visualizes % completion

### Workflow 4: Defect Lifecycle
1. Go to **Defects** tab
2. Table columns: ID, Severity, Title, System, Status, Assignee, Age
3. Red border for S1 (Critical): "ZAR→USD conversion error"
4. Yellow for S2 (Major): "Journal reversal failure"
5. Green for S3 (Minor): "UI tooltip truncation (Firefox)"
6. Severity summary cards show count breakdown

### Workflow 5: Requirement Submission
1. On **Requirements** tab, click **"+ New Requirement"**
2. Fill modal form:
   - Title: e.g., "Oracle AP — Automated 3-Way Match"
   - Description: Business rationale
   - Priority: P1/P2/P3
   - Stakeholder Source: e.g., "Procurement Lead"
   - Privacy flag checkbox for POPIA/GDPR items
3. Click **"Log Requirement"** → Toast confirms save
4. New req appears at top of table

---

## 🔒 Security & Compliance

### Data Privacy Considerations
✅ **Privacy flags** on sensitive requirements (POPIA, GDPR)  
✅ **System compliance tracking** — Each ERP tagged with data regulation  
✅ **Audit trail** — All modifications logged (future enhancement)  
✅ **Role-based views** (future) — Hide sensitive data from unauthorized users  

### ERP-Specific Compliance
- **SAP**: POPIA, modules for EU/South African operations
- **Oracle**: GDPR (EU customers), POPIA (local)
- **Dynamics 365**: POPIA, GDPR, Microsoft Compliance Manager integration
- **SQL Server**: Internal data governance policies
- **Power BI**: Data residency, encryption in transit

---

## 📁 Project Structure

```
ERPAnalyst/
├── ERPAnalyst.jsx      # Main React component
├── package.json        # Dependencies (React, Recharts, FA)
├── README.md          # This file
└── [No external API]  # All data mocked (demo)
```

---

## 📊 Mock Data Breakdown

### Systems
```javascript
const ERP_SYSTEMS = [
  {
    id: "sap",
    name: "SAP S/4HANA",
    status: "active",
    health: 97,
    modules: ["FI", "CO", "MM", "SD", "HR"],
    dataPrivacy: "POPIA"
  },
  // ... 4 more systems
];
```

### Integrations (5 total)
- **Healthy** (2): SAP→SQL, Oracle→BI
- **Degraded** (1): Dynamics→SAP (1820ms latency)
- **Error** (1): Power BI→Dynamics (down since 06:00)
- **On-demand** (1): SQL→Oracle

### UAT Cases (6 total)
- **Passed**: 3 cases (FI–AP, HCM–Onboarding, Schema Migration)
- **In-Progress**: 2 cases (MM–PO, GL–Period Close)
- **Failed**: 1 case (Sales–Pipeline)

### Defects (4 total)
- **S1 (Critical)**: 0
- **S2 (Major)**: 2 (currency, journal reversal)
- **S3 (Minor)**: 1 (UI tooltip)
- **S4 (Cosmetic)**: 1

---

## 🔧 Configuration

### Color Scheme
```javascript
const STATUS_COLOR = {
  active: "#22d3a0",      // Green
  warning: "#f5c518",     // Yellow
  error: "#ff4560",       // Red
  backlog: "#6b7280"      // Gray
};
```

### Future API Integration
```javascript
// Replace mock data with:
GET  /api/erp-systems              // Fetch system health
GET  /api/integrations             // Data flow status
POST /api/requirements             // Create requirement
GET  /api/uat-cases                // Test case tracking
GET  /api/defects                  // Defect register
```

---

## 🎯 Use Cases

### 1. **Technical Lead** — Daily Standup
Morning review of integration health & UAT progress.

### 2. **QA Manager** — Test Coordination
Track UAT cases, link defects, prioritize retesting.

### 3. **Business Analyst** — Requirement Traceability
Submit privacy-flagged reqs, track approvals.

### 4. **DevOps Engineer** — Integration Troubleshooting
Diagnose latency spikes, coordinate fix escalations.

### 5. **Compliance Officer** — POPIA Audit
Export privacy-flagged requirements & compliance logs.

---

## 📋 Known Limitations (Demo)

- ❌ No persistent database (state resets on refresh)
- ❌ New requirements not saved beyond session
- ❌ No actual system connectivity checks
- ❌ Latency values static (not real-time)
- ❌ Defect status cannot be updated from UI (view-only)
- ❌ No export functionality (to-do)

---

## 🚀 Roadmap

- [ ] Backend API (Node.js / Python)
- [ ] Real integration health metrics
- [ ] Elasticsearch defect storage
- [ ] Email notifications (UAT failures, integration errors)
- [ ] Kanban board for defect workflow
- [ ] Integration with Jira/Azure DevOps
- [ ] Performance trending (charts over time)
- [ ] Multi-tenant SaaS deployment
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

To extend ERPAnalyst:

1. **Add new ERP system** in `ERP_SYSTEMS` array
2. **Extend integration types** (currently: ETL, API, Middleware, JDBC, OData)
3. **New UAT modules** via UAT_CASES expansion
4. **Custom defect filters** in Defects tab

---

## 📄 License

**MIT License** — Built by S.P. Ngcobo for Zaziza Holdings

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/SPVNgcobo/ERPAnalyst/issues)
- **Documentation**: [ERPAnalyst Wiki](https://github.com/SPVNgcobo/ERPAnalyst/wiki)
- **Email**: support@zaziza-technologies.com

---

**Version**: 1.0.0  
**Status**: Production Ready (Demo)  
**Target Market**: Enterprise IT teams (SAP, Oracle, Dynamics environments)  
**Last Updated**: June 2026
