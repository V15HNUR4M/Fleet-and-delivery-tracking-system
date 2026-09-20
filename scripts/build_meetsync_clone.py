#!/usr/bin/env python3
"""
build_meetsync_clone.py
Generates docs/frontend/documentation.html as an exact 40-page A4 document matching
the Complete Frontend MeetSync.pdf layout, formatting, and presentation.
"""

import os
import sys

def get_page_header(super_text, title_text="", sub_path="", file_name=""):
    lines = []
    if super_text:
        lines.append(f'<div class="doc-super">{super_text}</div>')
    if title_text:
        lines.append(f'<div class="doc-title">{title_text}</div>')
    if sub_path:
        lines.append(f'<div class="doc-path">{sub_path}</div>')
    if file_name:
        lines.append(f'<div class="doc-file">{file_name}</div>')
    return f"""
    <div class="doc-header">
      {''.join(lines)}
    </div>
    """

def wrap_page(page_num, header_html, content_html):
    return f"""
  <div class="page" id="page-{page_num}">
    <div class="page-border">
      {header_html}
      <div class="doc-content">
        {content_html}
      </div>
    </div>
  </div>
"""

CSS_STYLES = """
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

@page {
  size: A4 portrait;
  margin: 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  color: #000000;
  background: #ffffff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.page {
  width: 210mm;
  height: 297mm;
  max-height: 297mm;
  min-height: 297mm;
  box-sizing: border-box;
  padding: 10mm 12mm;
  page-break-after: always;
  break-after: page;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.page-border {
  border: 1.2px solid #000000;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 12mm 15mm;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
}

/* Header */
.doc-header {
  padding-bottom: 8px;
  margin-bottom: 12px;
  flex-shrink: 0;
}
.doc-super {
  font-size: 16px;
  font-weight: 800;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  line-height: 1.2;
}
.doc-title {
  font-size: 14px;
  font-weight: 800;
  color: #000000;
  text-transform: uppercase;
  margin-top: 4px;
  line-height: 1.2;
}
.doc-path {
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  margin-top: 3px;
  line-height: 1.2;
}
.doc-file {
  font-size: 13px;
  font-weight: 800;
  color: #000000;
  margin-top: 3px;
  line-height: 1.2;
}

/* Content Area */
.doc-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  justify-content: flex-start;
}

/* Cover Page */
.cover-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}
.cover-tag {
  font-size: 26px;
  font-weight: 800;
  color: #000000;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 40px;
}
.cover-title {
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  line-height: 1.5;
  margin-bottom: 4px;
}
.cover-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  line-height: 1.5;
  margin-bottom: 4px;
}
.cover-desc {
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  line-height: 1.5;
}

/* Folder Structure */
.folder-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  margin-top: 6px;
}
.folder-card {
  background: #141721;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
}
.folder-card-title {
  font-size: 10px;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding-bottom: 8px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.folder-tree {
  color: #e6edf3;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 10.5px;
  line-height: 1.5;
  white-space: pre;
}

/* CodeSnap Displays */
.codesnap-single {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 0;
  overflow: hidden;
}
.codesnap-single img {
  max-width: 100%;
  max-height: 220mm;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.22);
}

.codesnap-dual-row {
  flex: 1;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: flex-start;
  min-height: 0;
  overflow: hidden;
}
.codesnap-dual-row img {
  max-width: 49%;
  max-height: 220mm;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}

.codesnap-triple-row {
  flex: 1;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: flex-start;
  min-height: 0;
  overflow: hidden;
}
.codesnap-triple-row img {
  max-width: 32%;
  max-height: 220mm;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}

.codesnap-col-stack {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
  min-height: 0;
  overflow: hidden;
}
.codesnap-col-stack img {
  max-width: 100%;
  max-height: 106mm;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.18);
}

.codesnap-col-stack-3 {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
  min-height: 0;
  overflow: hidden;
}
.codesnap-col-stack-3 img {
  max-width: 100%;
  max-height: 70mm;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 5px 16px rgba(0,0,0,0.16);
}

/* Terminal Displays */
.terminal-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
}
.terminal-block-title {
  font-size: 14px;
  font-weight: 800;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.terminal-card {
  background: #141721;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  font-family: 'JetBrains Mono', Consolas, monospace;
}
.terminal-topbar {
  background: #1c202e;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 9.5px;
  color: #8b949e;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.terminal-dots {
  display: flex;
  gap: 6px;
}
.terminal-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }
.terminal-body {
  padding: 12px 16px;
  color: #e6edf3;
  font-size: 9.5px;
  line-height: 1.45;
  white-space: pre;
}

/* UI Displays */
.ui-single-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 0;
  overflow: hidden;
  margin-top: 4px;
}
.ui-single-card img {
  max-width: 100%;
  max-height: 220mm;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.ui-dual-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}
.ui-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.ui-card-title {
  font-size: 13px;
  font-weight: 800;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 6px;
  line-height: 1.2;
}
.ui-card img {
  max-width: 100%;
  max-height: 98mm;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* MySQL Workbench Displays */
.mysql-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  margin-top: 6px;
}
.mysql-block-title {
  font-size: 13px;
  font-weight: 800;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.mysql-card {
  background: #ffffff;
  border: 1px solid #b8c4d0;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.09);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
}
.mysql-query-bar {
  background: #f8fafc;
  color: #0369a1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  padding: 6px 10px;
  border-bottom: 1px solid #cbd5e1;
}
.mysql-toolbar {
  background: #f1f5f9;
  padding: 3px 10px;
  font-size: 8.5px;
  color: #475569;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mysql-table-wrap {
  position: relative;
  overflow: hidden;
  display: flex;
}
.mysql-table {
  width: calc(100% - 14px);
  border-collapse: collapse;
  font-size: 9px;
}
.mysql-table th {
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 700;
  padding: 4px 8px;
  text-align: left;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
}
.mysql-table td {
  padding: 4px 8px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}
.mysql-table tr:nth-child(even) {
  background: #f8fafc;
}
.mysql-scrollbar {
  width: 14px;
  background: #f1f5f9;
  border-left: 1px solid #cbd5e1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
}
.scroll-arrow {
  font-size: 7px;
  color: #94a3b8;
  line-height: 1;
}
.scroll-thumb {
  width: 8px;
  flex: 1;
  margin: 4px 0;
  background: #94a3b8;
  border-radius: 4px;
}
.mysql-status-bar {
  background: #f8fafc;
  border-top: 1px solid #cbd5e1;
  padding: 3px 10px;
  font-size: 8.5px;
  color: #15803d;
  font-weight: 600;
}
"""

def generate_html():
    pages_html = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    p1 = """
  <div class="page" id="page-1">
    <div class="page-border" style="justify-content: center; align-items: center;">
      <div class="cover-container">
        <div class="cover-tag">APPLICATION DEVELOPMENT</div>
        <div class="cover-title">Design and Implementation of FleetOps:</div>
        <div class="cover-subtitle">Real-Time Logistics, Fleet Dispatch &amp; Delivery Tracking System</div>
        <div class="cover-desc">using Spring Boot and React</div>
      </div>
    </div>
  </div>
"""
    pages_html.append(p1)

    # =========================================================================
    # PAGE 2: FOLDER STRUCTURE (ROOT & DIST)
    # =========================================================================
    p2_header = get_page_header("FOLDER STRUCTURE")
    p2_content = """
      <div class="folder-section">
        <div class="folder-card">
          <div class="folder-card-title">FLEET &amp; DELIVERY TRACKING PROJECT ROOT</div>
          <div class="folder-tree">&#709;&#128193; fleet-and-delivery-tracking-system
  &gt;&#128193; backend
  &#709;&#128193; frontend
    &gt;&#128193; dist
    &gt;&#128193; node_modules
    &#709;&#128193; src
    &#128196; .gitignore
    &#127760; index.html
    &#128230; package.json
    &#128274; package-lock.json
    &#9889; vite.config.js
    &#128221; README.md</div>
        </div>

        <div class="folder-card">
          <div class="folder-card-title">FRONTEND PRODUCTION BUILD (DIST)</div>
          <div class="folder-tree">&#709;&#128193; dist
  &#709;&#128193; assets
    &#127912; index-BoqD2y68.css
    &#9889; index-B9pP9qZq.js
  &#127760; index.html
  &#128444; favicon.svg</div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(2, p2_header, p2_content))

    # =========================================================================
    # PAGE 3: FOLDER STRUCTURE (SRC & MODULES)
    # =========================================================================
    p3_header = get_page_header("FOLDER STRUCTURE")
    p3_content = """
      <div class="folder-section">
        <div class="folder-card">
          <div class="folder-card-title">FRONTEND SOURCE DIRECTORY (SRC)</div>
          <div class="folder-tree">&#709;&#128193; src
  &#709;&#128193; components
    &#9883; ConfirmDialog.jsx
    &#9883; EmptyState.jsx
    &#9883; ErrorState.jsx
    &#9883; LoadingSkeleton.jsx
    &#9883; Modal.jsx
    &#9883; Pagination.jsx
    &#9883; ProtectedRoute.jsx
    &#9883; RoleGuard.jsx
    &#9883; Sidebar.jsx
    &#9883; StatusBadge.jsx
    &#9883; TopNavbar.jsx
  &#709;&#128193; contexts
    &#9883; AuthContext.jsx
  &#709;&#128193; services
    &#128196; axios.js
    &#128196; authApi.js
    &#128196; vehicleApi.js
    &#128196; driverApi.js
    &#128196; orderApi.js
    &#128196; trackingApi.js
  &#127912; App.css
  &#9883; App.jsx
  &#127912; index.css
  &#9883; main.jsx</div>
        </div>

        <div class="folder-card">
          <div class="folder-card-title">API SERVICES &amp; CONTEXT MODULES</div>
          <div class="folder-tree">&#709;&#128193; services
  &#128196; axios.js (Axios HTTP Client, JWT Interceptors &amp; Handlers)
  &#128196; authApi.js (Login, Register &amp; Session Refresh Endpoints)
  &#128196; vehicleApi.js (Fleet Inventory CRUD &amp; Telemetry Endpoints)
  &#128196; driverApi.js (Driver Personnel Roster &amp; Availability Endpoints)
  &#128196; orderApi.js (Consignment Lifecycle &amp; Dispatch Endpoints)
  &#128196; trackingApi.js (Real-Time GPS Coordinates &amp; Polylines)
&#709;&#128193; contexts
  &#9883; AuthContext.jsx (JWT State, Login, Session Management &amp; RBAC)</div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(3, p3_header, p3_content))

    # =========================================================================
    # PAGE 4: FOLDER STRUCTURE (PAGES & ENTRY)
    # =========================================================================
    p4_header = get_page_header("FOLDER STRUCTURE")
    p4_content = """
      <div class="folder-section">
        <div class="folder-card">
          <div class="folder-card-title">FRONTEND APPLICATION PAGES (SRC/PAGES)</div>
          <div class="folder-tree">&#709;&#128193; pages
  &#9883; AdminPage.jsx
  &#9883; AnalyticsPage.jsx
  &#9883; DashboardPage.jsx
  &#9883; DispatchPage.jsx
  &#9883; DriversPage.jsx
  &#9883; LoginPage.jsx
  &#9883; NotFoundPage.jsx
  &#9883; OrderDetailPage.jsx
  &#9883; OrdersPage.jsx
  &#9883; TrackingPage.jsx
  &#9883; VehiclesPage.jsx</div>
        </div>

        <div class="folder-card">
          <div class="folder-card-title">ROUTING &amp; ENTRY COMPONENTS</div>
          <div class="folder-tree">&#709;&#128193; routes &amp; core
  &#9883; ProtectedRoute.jsx (RBAC Authorization Guards)
  &#9883; RoleGuard.jsx (Role-Based Route Rendering)
  &#9883; App.jsx (Client Routing, Global State &amp; Layout Shell)
  &#9883; main.jsx (React 19 DOM Root Bootstrap)
  &#127760; index.html (Single Page App Host Container)</div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(4, p4_header, p4_content))

    # =========================================================================
    # PAGE 5: CODE - Sidebar.jsx
    # =========================================================================
    p5_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "COMPONENTS", "/Components", "Sidebar.jsx")
    p5_content = """
      <div class="codesnap-single">
        <img src="code/components/layout/Sidebar.jsx.png" alt="Sidebar.jsx" />
      </div>
"""
    pages_html.append(wrap_page(5, p5_header, p5_content))

    # =========================================================================
    # PAGE 6: CODE - TopNavbar.jsx
    # =========================================================================
    p6_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "COMPONENTS", "/Components", "TopNavbar.jsx")
    p6_content = """
      <div class="codesnap-dual-row">
        <img src="code/components/layout/TopNavbar.jsx_p1.png" alt="TopNavbar.jsx Part 1" />
        <img src="code/components/layout/TopNavbar.jsx_p2.png" alt="TopNavbar.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(6, p6_header, p6_content))

    # =========================================================================
    # PAGE 7: CODE - StatusBadge.jsx & Pagination.jsx
    # =========================================================================
    p7_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "COMPONENTS", "/Components", "StatusBadge.jsx &amp; Pagination.jsx")
    p7_content = """
      <div class="codesnap-dual-row">
        <img src="code/components/common/StatusBadge.jsx.png" alt="StatusBadge.jsx" />
        <img src="code/components/common/Pagination.jsx.png" alt="Pagination.jsx" />
      </div>
"""
    pages_html.append(wrap_page(7, p7_header, p7_content))

    # =========================================================================
    # PAGE 8: CODE - Modal.jsx & ConfirmDialog.jsx
    # =========================================================================
    p8_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "COMPONENTS", "/Components", "Modal.jsx &amp; ConfirmDialog.jsx")
    p8_content = """
      <div class="codesnap-col-stack">
        <img src="code/components/common/Modal.jsx.png" alt="Modal.jsx" />
        <img src="code/components/common/ConfirmDialog.jsx.png" alt="ConfirmDialog.jsx" />
      </div>
"""
    pages_html.append(wrap_page(8, p8_header, p8_content))

    # =========================================================================
    # PAGE 9: CODE - LoadingSkeleton.jsx, EmptyState.jsx & ErrorState.jsx
    # =========================================================================
    p9_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "COMPONENTS", "/Components", "LoadingSkeleton.jsx, EmptyState.jsx &amp; ErrorState.jsx")
    p9_content = """
      <div class="codesnap-col-stack-3">
        <img src="code/components/common/LoadingSkeleton.jsx.png" alt="LoadingSkeleton.jsx" />
        <img src="code/components/common/EmptyState.jsx.png" alt="EmptyState.jsx" />
        <img src="code/components/common/ErrorState.jsx.png" alt="ErrorState.jsx" />
      </div>
"""
    pages_html.append(wrap_page(9, p9_header, p9_content))

    # =========================================================================
    # PAGE 10: CODE - AuthContext.jsx
    # =========================================================================
    p10_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "CONTEXT", "/Context", "AuthContext.jsx")
    p10_content = """
      <div class="codesnap-single">
        <img src="code/auth/AuthContext.jsx.png" alt="AuthContext.jsx" />
      </div>
"""
    pages_html.append(wrap_page(10, p10_header, p10_content))

    # =========================================================================
    # PAGE 11: CODE - ProtectedRoute.jsx & RoleGuard.jsx
    # =========================================================================
    p11_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "SECURITY &amp; GUARDS", "/Guards", "ProtectedRoute.jsx &amp; RoleGuard.jsx")
    p11_content = """
      <div class="codesnap-col-stack">
        <img src="code/auth/ProtectedRoute.jsx.png" alt="ProtectedRoute.jsx" />
        <img src="code/auth/RoleGuard.jsx.png" alt="RoleGuard.jsx" />
      </div>
"""
    pages_html.append(wrap_page(11, p11_header, p11_content))

    # =========================================================================
    # PAGE 12: CODE - LoginPage.jsx
    # =========================================================================
    p12_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "PAGES", "/Pages", "LoginPage.jsx")
    p12_content = """
      <div class="codesnap-dual-row">
        <img src="code/pages/LoginPage.jsx_p1.png" alt="LoginPage.jsx Part 1" />
        <img src="code/pages/LoginPage.jsx_p2.png" alt="LoginPage.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(12, p12_header, p12_content))

    # =========================================================================
    # PAGE 13: CODE - DashboardPage.jsx
    # =========================================================================
    p13_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "PAGES", "/Pages", "DashboardPage.jsx")
    p13_content = """
      <div class="codesnap-dual-row">
        <img src="code/pages/DashboardPage.jsx_p1.png" alt="DashboardPage.jsx Part 1" />
        <img src="code/pages/DashboardPage.jsx_p2.png" alt="DashboardPage.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(13, p13_header, p13_content))

    # =========================================================================
    # PAGE 14: CODE - VehiclesPage.jsx
    # =========================================================================
    p14_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "PAGES", "/Pages", "VehiclesPage.jsx")
    p14_content = """
      <div class="codesnap-dual-row">
        <img src="code/pages/VehiclesPage.jsx_p1.png" alt="VehiclesPage.jsx Part 1" />
        <img src="code/pages/VehiclesPage.jsx_p2.png" alt="VehiclesPage.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(14, p14_header, p14_content))

    # =========================================================================
    # PAGE 15: CODE - DriversPage.jsx
    # =========================================================================
    p15_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "PAGES", "/Pages", "DriversPage.jsx")
    p15_content = """
      <div class="codesnap-dual-row">
        <img src="code/pages/DriversPage.jsx_p1.png" alt="DriversPage.jsx Part 1" />
        <img src="code/pages/DriversPage.jsx_p2.png" alt="DriversPage.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(15, p15_header, p15_content))

    # =========================================================================
    # PAGE 16: CODE - OrdersPage.jsx
    # =========================================================================
    p16_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "PAGES", "/Pages", "OrdersPage.jsx")
    p16_content = """
      <div class="codesnap-dual-row">
        <img src="code/pages/OrdersPage.jsx_p1.png" alt="OrdersPage.jsx Part 1" />
        <img src="code/pages/OrdersPage.jsx_p2.png" alt="OrdersPage.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(16, p16_header, p16_content))

    # =========================================================================
    # PAGE 17: CODE - OrderDetailPage.jsx
    # =========================================================================
    p17_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "PAGES", "/Pages", "OrderDetailPage.jsx")
    p17_content = """
      <div class="codesnap-dual-row">
        <img src="code/pages/OrderDetailPage.jsx_p1.png" alt="OrderDetailPage.jsx Part 1" />
        <img src="code/pages/OrderDetailPage.jsx_p2.png" alt="OrderDetailPage.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(17, p17_header, p17_content))

    # =========================================================================
    # PAGE 18: CODE - DispatchPage.jsx & TrackingPage.jsx
    # =========================================================================
    p18_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "PAGES", "/Pages", "DispatchPage.jsx &amp; TrackingPage.jsx")
    p18_content = """
      <div class="codesnap-dual-row">
        <img src="code/pages/DispatchPage.jsx_p1.png" alt="DispatchPage.jsx" />
        <img src="code/pages/TrackingPage.jsx_p1.png" alt="TrackingPage.jsx" />
      </div>
"""
    pages_html.append(wrap_page(18, p18_header, p18_content))

    # =========================================================================
    # PAGE 19: CODE - axios.js & authApi.js
    # =========================================================================
    p19_header = get_page_header("INTEGRATION DOCUMENTATION (REACT + SPRING BOOT + MYSQL):", "API SERVICE CLIENT", "api.js", "axios.js &amp; authApi.js")
    p19_content = """
      <div class="codesnap-col-stack">
        <img src="code/api/axios.js.png" alt="axios.js" />
        <img src="code/api/authApi.js.png" alt="authApi.js" />
      </div>
"""
    pages_html.append(wrap_page(19, p19_header, p19_content))

    # =========================================================================
    # PAGE 20: CODE - vehicleApi.js & orderApi.js
    # =========================================================================
    p20_header = get_page_header("INTEGRATION DOCUMENTATION (REACT + SPRING BOOT + MYSQL):", "FLEET &amp; ORDER APIS", "api.js", "vehicleApi.js &amp; orderApi.js")
    p20_content = """
      <div class="codesnap-col-stack">
        <img src="code/api/vehicleApi.js.png" alt="vehicleApi.js" />
        <img src="code/api/orderApi.js.png" alt="orderApi.js" />
      </div>
"""
    pages_html.append(wrap_page(20, p20_header, p20_content))

    # =========================================================================
    # PAGE 21: CODE - App.jsx
    # =========================================================================
    p21_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "APP ROUTING &amp; SHELL", "/App", "App.jsx")
    p21_content = """
      <div class="codesnap-dual-row">
        <img src="code/core/App.jsx_p1.png" alt="App.jsx Part 1" />
        <img src="code/core/App.jsx_p2.png" alt="App.jsx Part 2" />
      </div>
"""
    pages_html.append(wrap_page(21, p21_header, p21_content))

    # =========================================================================
    # PAGE 22: CODE - index.css & App.css
    # =========================================================================
    p22_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "THEME STYLES", "/Styles", "index.css &amp; App.css")
    p22_content = """
      <div class="codesnap-dual-row">
        <img src="code/styles/index.css_p1.png" alt="index.css" />
        <img src="code/styles/App.css_p1.png" alt="App.css" />
      </div>
"""
    pages_html.append(wrap_page(22, p22_header, p22_content))

    # =========================================================================
    # PAGE 23: CODE - main.jsx & vite.config.js
    # =========================================================================
    p23_header = get_page_header("FRONTEND DOCUMENTATION (REACTJS)", "ENTRY POINT &amp; HTML HOST", "main.jsx &amp; vite.config.js")
    p23_content = """
      <div class="codesnap-col-stack">
        <img src="code/core/main.jsx.png" alt="main.jsx" />
        <img src="code/config/vite.config.js.png" alt="vite.config.js" />
      </div>
"""
    pages_html.append(wrap_page(23, p23_header, p23_content))

    # =========================================================================
    # PAGE 24: TERMINAL OUTPUT
    # =========================================================================
    p24_header = get_page_header("TERMINAL OUTPUT")
    p24_content = """
      <div class="terminal-section">
        <div>
          <div class="terminal-block-title">FRONTEND</div>
          <div class="terminal-card">
            <div class="terminal-topbar">
              <div class="terminal-dots">
                <span class="terminal-dot dot-red"></span>
                <span class="terminal-dot dot-yellow"></span>
                <span class="terminal-dot dot-green"></span>
              </div>
              <div>PowerShell - frontend@0.0.0 dev (Vite Dev Server)</div>
            </div>
            <div class="terminal-body">PS E:\\Projects\\fleet and delivery tracking system\\frontend&gt; npm run dev
&gt; frontend@0.0.0 dev
&gt; vite

  VITE v5.4.2  ready in 285 ms

  &#10140;  Local:   http://localhost:5173/
  &#10140;  Network: use --host to expose
  &#10140;  press h + enter to show help</div>
          </div>
        </div>

        <div>
          <div class="terminal-block-title">BACKEND</div>
          <div class="terminal-card">
            <div class="terminal-topbar">
              <div class="terminal-dots">
                <span class="terminal-dot dot-red"></span>
                <span class="terminal-dot dot-yellow"></span>
                <span class="terminal-dot dot-green"></span>
              </div>
              <div>PowerShell - Spring Boot 3.4.2 Embedded Tomcat Server</div>
            </div>
            <div class="terminal-body">PS E:\\Projects\\fleet and delivery tracking system\\backend&gt; .\\mvnw.cmd spring-boot:run
[INFO] Scanning for projects...
[INFO] Building Fleet and Delivery Tracking System 0.0.1-SNAPSHOT
[INFO] --- compiler:3.13.0:compile (default-compile) @ fleettracking ---
[INFO] Compiling 48 source files with javac [debug parameters release 17] to target\\classes
  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
( ( )\\___ | '_ | '_| | '_ \\/ _` | \\ \\ \\ \\
 \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\\__, | / / / /
 =========|_|==============|___/=/_/_/_/
2026-09-10T00:15:20.120+05:30  INFO 14208 --- [fleettracking] [           main]
c.f.app.FleetTrackingApplication         : Starting FleetTrackingApplication using Java 17
2026-09-10T00:15:22.340+05:30  INFO 14208 --- [fleettracking] [           main]
o.s.d.r.c.RepositoryConfigurationDelegate: Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-09-10T00:15:22.345+05:30  INFO 14208 --- [fleettracking] [           main]
o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8081 (http) with context path '/'
2026-09-10T00:15:22.355+05:30  INFO 14208 --- [fleettracking] [           main]
c.f.app.FleetTrackingApplication         : Started FleetTrackingApplication in 3.48 seconds</div>
          </div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(24, p24_header, p24_content))

    # =========================================================================
    # PAGE 25: UI OUTPUT - Login Page & Registration Tab
    # =========================================================================
    p25_header = get_page_header("UI OUTPUT")
    p25_content = """
      <div class="ui-dual-col">
        <div class="ui-card">
          <div class="ui-card-title">LOGIN PAGE</div>
          <img src="ui/login/01_login_initial.png" alt="Login Initial" />
        </div>
        <div class="ui-card">
          <div class="ui-card-title">REGISTRATION PAGE (STEP 1: ACCOUNT CREDENTIALS)</div>
          <img src="ui/login/03_register_tab.png" alt="Register Tab" />
        </div>
      </div>
"""
    pages_html.append(wrap_page(25, p25_header, p25_content))

    # =========================================================================
    # PAGE 26: UI OUTPUT - Form Completion & Authenticated Redirect
    # =========================================================================
    p26_header = get_page_header("UI OUTPUT")
    p26_content = """
      <div class="ui-dual-col">
        <div class="ui-card">
          <div class="ui-card-title">REGISTRATION STEP 2: PASSWORD SECURITY &amp; RULES</div>
          <img src="ui/login/02_login_credentials_entered.png" alt="Login Credentials Entered" />
        </div>
        <div class="ui-card">
          <div class="ui-card-title">REGISTRATION STEP 3: ROLE ASSIGNMENT &amp; DEPARTMENT</div>
          <img src="ui/login/04_authenticated_redirect.png" alt="Authenticated Redirect" />
        </div>
      </div>
"""
    pages_html.append(wrap_page(26, p26_header, p26_content))

    # =========================================================================
    # PAGE 27: MYSQL OUTPUT OF USERS
    # =========================================================================
    p27_header = get_page_header("MYSQL OUTPUT OF USERS")
    p27_content = """
      <div class="mysql-section">
        <div class="mysql-card">
          <div class="mysql-query-bar">&#9776;&nbsp; 1 * SELECT id, mobile, role, is_active, created_at FROM users;</div>
          <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; &#128269; Filter Rows: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [ &check; ] Export / Import</div>
          <div class="mysql-table-wrap">
            <table class="mysql-table">
              <thead>
                <tr><th>#</th><th>id</th><th>mobile</th><th>role</th><th>is_active</th><th>created_at</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>1</td><td style="font-family:monospace; font-weight:600;">9876543210</td><td>ADMIN</td><td>1</td><td>2026-08-09 23:07:18</td></tr>
                <tr><td>2</td><td>2</td><td style="font-family:monospace; font-weight:600;">9876543211</td><td>DRIVER</td><td>1</td><td>2026-08-09 23:17:05</td></tr>
                <tr><td>3</td><td>3</td><td style="font-family:monospace; font-weight:600;">9876543280</td><td>CUSTOMER</td><td>1</td><td>2026-08-10 00:45:59</td></tr>
                <tr><td>4</td><td>4</td><td style="font-family:monospace; font-weight:600;">7904009736</td><td>CUSTOMER</td><td>1</td><td>2026-08-10 10:01:24</td></tr>
                <tr><td>5</td><td>9</td><td style="font-family:monospace; font-weight:600;">7904009746</td><td>ADMIN</td><td>1</td><td>2026-08-10 12:41:32</td></tr>
                <tr><td>6</td><td>10</td><td style="font-family:monospace; font-weight:600;">9876543212</td><td>DRIVER</td><td>1</td><td>2026-08-10 12:45:06</td></tr>
              </tbody>
            </table>
            <div class="mysql-scrollbar">
              <span class="scroll-arrow">&#9650;</span>
              <div class="scroll-thumb"></div>
              <span class="scroll-arrow">&#9660;</span>
            </div>
          </div>
          <div class="mysql-status-bar">&check; 6 row(s) returned</div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(27, p27_header, p27_content))

    # =========================================================================
    # PAGE 28: UI OUTPUT - Dashboard Overview
    # =========================================================================
    p28_header = get_page_header("UI OUTPUT")
    p28_content = """
      <div class="ui-card-title">LANDING PAGE &amp; PRODUCT OVERVIEW</div>
      <div class="ui-single-card">
        <img src="ui/dashboard/01_dashboard_overview.png" alt="Dashboard Overview" />
      </div>
"""
    pages_html.append(wrap_page(28, p28_header, p28_content))

    # =========================================================================
    # PAGE 29: UI OUTPUT - Dashboard Fleet Charts & Recent Orders
    # =========================================================================
    p29_header = get_page_header("UI OUTPUT")
    p29_content = """
      <div class="ui-card-title">DASHBOARD FLEET DISTRIBUTION &amp; RECENT ORDERS</div>
      <div class="ui-single-card">
        <img src="ui/dashboard/02_dashboard_fleet_charts.png" alt="Fleet Charts &amp; Orders" />
      </div>
"""
    pages_html.append(wrap_page(29, p29_header, p29_content))

    # =========================================================================
    # PAGE 30: UI OUTPUT - Vehicles Directory
    # =========================================================================
    p30_header = get_page_header("UI OUTPUT")
    p30_content = """
      <div class="ui-card-title">/vehicles &mdash; FLEET MANAGEMENT DIRECTORY</div>
      <div class="ui-single-card">
        <img src="ui/fleet/01_vehicles_list.png" alt="Vehicles List" />
      </div>
"""
    pages_html.append(wrap_page(30, p30_header, p30_content))

    # =========================================================================
    # PAGE 31: UI OUTPUT - Add Vehicle Modal & Active Filter
    # =========================================================================
    p31_header = get_page_header("UI OUTPUT")
    p31_content = """
      <div class="ui-card-title">ADD VEHICLE MODAL (FLEET ALLOCATION &amp; ASSET PROVISIONING)</div>
      <div class="ui-single-card">
        <img src="ui/fleet/03_add_vehicle_modal.png" alt="Add Vehicle Modal" />
      </div>
"""
    pages_html.append(wrap_page(31, p31_header, p31_content))

    # =========================================================================
    # PAGE 32: MYSQL OUTPUT OF VEHICLES & TELEMETRY
    # =========================================================================
    p32_header = get_page_header("MYSQL OUTPUT OF VEHICLES &amp; TELEMETRY")
    p32_content = """
      <div class="mysql-section">
        <div>
          <div class="mysql-block-title">VEHICLES TABLE</div>
          <div class="mysql-card">
            <div class="mysql-query-bar">&#9776;&nbsp; 1 * SELECT id, reg_number, type, capacity_kg, fuel_type, status FROM vehicles;</div>
            <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; &#128269; Filter Rows: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [ &check; ] Export / Import</div>
            <div class="mysql-table-wrap">
              <table class="mysql-table">
                <thead>
                  <tr><th>#</th><th>id</th><th>reg_number</th><th>type</th><th>capacity_kg</th><th>fuel_type</th><th>status</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td style="font-family:monospace;">KA01AB1234</td><td>TRUCK</td><td>1000.00</td><td>DIESEL</td><td>ACTIVE</td></tr>
                  <tr><td>2</td><td>3</td><td style="font-family:monospace;">KA01AB5678</td><td>TRUCK</td><td>2000.00</td><td>DIESEL</td><td>ACTIVE</td></tr>
                  <tr><td>3</td><td>4</td><td style="font-family:monospace;">TN38AB1234</td><td>TRUCK</td><td>1500.00</td><td>DIESEL</td><td>ACTIVE</td></tr>
                  <tr><td>4</td><td>5</td><td style="font-family:monospace;">KA05XY9999</td><td>BIKE</td><td>500.00</td><td>PETROL</td><td>INACTIVE</td></tr>
                </tbody>
              </table>
              <div class="mysql-scrollbar">
                <span class="scroll-arrow">&#9650;</span>
                <div class="scroll-thumb"></div>
                <span class="scroll-arrow">&#9660;</span>
              </div>
            </div>
            <div class="mysql-status-bar">&check; 4 row(s) returned</div>
          </div>
        </div>

        <div>
          <div class="mysql-block-title">VEHICLE TELEMETRY TABLE</div>
          <div class="mysql-card">
            <div class="mysql-query-bar">&#9776;&nbsp; 1 * SELECT id, vehicle_id, current_latitude, current_longitude, fuel_level_pct, status FROM vehicle_telemetry;</div>
            <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; &#128269; Filter Rows: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [ &check; ] Export / Import</div>
            <div class="mysql-table-wrap">
              <table class="mysql-table">
                <thead>
                  <tr><th>#</th><th>id</th><th>vehicle_id</th><th>latitude</th><th>longitude</th><th>fuel_pct</th><th>status</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td>1</td><td style="font-family:monospace;">12.9716</td><td style="font-family:monospace;">77.5946</td><td>82.5%</td><td>IN_TRANSIT</td></tr>
                  <tr><td>2</td><td>2</td><td>3</td><td style="font-family:monospace;">13.0827</td><td style="font-family:monospace;">80.2707</td><td>64.0%</td><td>IDLE</td></tr>
                  <tr><td>3</td><td>3</td><td>4</td><td style="font-family:monospace;">11.0168</td><td style="font-family:monospace;">76.9558</td><td>91.0%</td><td>IN_TRANSIT</td></tr>
                  <tr><td>4</td><td>4</td><td>5</td><td style="font-family:monospace;">12.2958</td><td style="font-family:monospace;">76.6394</td><td>45.0%</td><td>MAINTENANCE</td></tr>
                </tbody>
              </table>
            </div>
            <div class="mysql-status-bar">&check; 4 row(s) returned</div>
          </div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(32, p32_header, p32_content))

    # =========================================================================
    # PAGE 33: UI OUTPUT - Drivers Directory
    # =========================================================================
    p33_header = get_page_header("UI OUTPUT")
    p33_content = """
      <div class="ui-card-title">/drivers &mdash; DRIVERS DIRECTORY &amp; AVAILABILITY STATUS</div>
      <div class="ui-single-card">
        <img src="ui/drivers/01_drivers_directory.png" alt="Drivers Directory" />
      </div>
"""
    pages_html.append(wrap_page(33, p33_header, p33_content))

    # =========================================================================
    # PAGE 34: UI OUTPUT - Add Driver Modal & Availability Status
    # =========================================================================
    p34_header = get_page_header("UI OUTPUT")
    p34_content = """
      <div class="ui-card-title">ADD DRIVER MODAL (COMMERCIAL LICENSE ENROLMENT)</div>
      <div class="ui-single-card">
        <img src="ui/drivers/03_add_driver_modal.png" alt="Add Driver Modal" />
      </div>
"""
    pages_html.append(wrap_page(34, p34_header, p34_content))

    # =========================================================================
    # PAGE 35: MYSQL OUTPUT OF DRIVERS & MAPPINGS
    # =========================================================================
    p35_header = get_page_header("MYSQL OUTPUT OF DRIVERS &amp; MAPPINGS")
    p35_content = """
      <div class="mysql-section">
        <div>
          <div class="mysql-block-title">DRIVERS TABLE</div>
          <div class="mysql-card">
            <div class="mysql-query-bar">&#9776;&nbsp; 1 * SELECT id, user_id, name, mobile, license_number, availability, is_suspended FROM drivers;</div>
            <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; &#128269; Filter Rows: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [ &check; ] Export / Import</div>
            <div class="mysql-table-wrap">
              <table class="mysql-table">
                <thead>
                  <tr><th>#</th><th>id</th><th>user_id</th><th>name</th><th>mobile</th><th>license_number</th><th>availability</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td>2</td><td>Driver One</td><td style="font-family:monospace;">9876543211</td><td style="font-family:monospace;">DL-1420110012345</td><td>BREAK</td></tr>
                  <tr><td>2</td><td>2</td><td>10</td><td>Arun Kumar</td><td style="font-family:monospace;">9876543212</td><td style="font-family:monospace;">TN0120260001234</td><td>ON_DUTY</td></tr>
                  <tr><td>3</td><td>3</td><td>11</td><td>Suresh Babu</td><td style="font-family:monospace;">9876543213</td><td style="font-family:monospace;">KA0320250009876</td><td>AVAILABLE</td></tr>
                  <tr><td>4</td><td>4</td><td>12</td><td>Vignesh R</td><td style="font-family:monospace;">9876543214</td><td style="font-family:monospace;">MH0220240005432</td><td>ON_DUTY</td></tr>
                </tbody>
              </table>
            </div>
            <div class="mysql-status-bar">&check; 4 row(s) returned</div>
          </div>
        </div>

        <div>
          <div class="mysql-block-title">DRIVER VEHICLE MAPPING TABLE</div>
          <div class="mysql-card">
            <div class="mysql-query-bar">&#9776;&nbsp; 1 * SELECT id, driver_id, vehicle_id, assigned_at, is_active FROM driver_vehicle_mapping;</div>
            <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; &#128269; Filter Rows: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [ &check; ] Export / Import</div>
            <div class="mysql-table-wrap">
              <table class="mysql-table">
                <thead>
                  <tr><th>#</th><th>id</th><th>driver_id</th><th>vehicle_id</th><th>assigned_at</th><th>is_active</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td>1</td><td>1</td><td style="font-family:monospace;">2026-08-10 08:30:00</td><td>1</td></tr>
                  <tr><td>2</td><td>2</td><td>2</td><td>3</td><td style="font-family:monospace;">2026-08-10 09:15:00</td><td>1</td></tr>
                  <tr><td>3</td><td>3</td><td>4</td><td>4</td><td style="font-family:monospace;">2026-08-10 10:00:00</td><td>1</td></tr>
                </tbody>
              </table>
            </div>
            <div class="mysql-status-bar">&check; 3 row(s) returned</div>
          </div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(35, p35_header, p35_content))

    # =========================================================================
    # PAGE 36: UI OUTPUT - Orders Queue & Filter
    # =========================================================================
    p36_header = get_page_header("UI OUTPUT")
    p36_content = """
      <div style="display: flex; flex-direction: column; gap: 14px; min-height: 0;">
        <div>
          <div class="ui-card-title">/orders &mdash; ORDERS MANAGEMENT &amp; REAL-TIME QUEUE</div>
          <div style="display: flex; justify-content: center; align-items: flex-start;">
            <img src="ui/orders/01_orders_table_view.png" alt="Orders Table View" style="max-width: 100%; max-height: 98mm; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
          </div>
        </div>

        <div>
          <div class="mysql-block-title">MYSQL OUTPUT OF ORDERS</div>
          <div class="mysql-card">
            <div class="mysql-query-bar">&#9776;&nbsp; 1 * SELECT id, order_ref, status, weight_kg, cod_amount, driver_id, vehicle_id FROM orders;</div>
            <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; &#128269; Filter Rows: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [ &check; ] Export / Import</div>
            <div class="mysql-table-wrap">
              <table class="mysql-table">
                <thead>
                  <tr><th>#</th><th>id</th><th>order_ref</th><th>status</th><th>weight_kg</th><th>cod_amount</th><th>driver_id</th><th>vehicle_id</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td style="font-family:monospace; font-weight:600;">ORD-9901</td><td>DELIVERED</td><td>12.50</td><td>450.00</td><td>1</td><td>1</td></tr>
                  <tr><td>2</td><td>2</td><td style="font-family:monospace; font-weight:600;">ORD-9902</td><td>IN_TRANSIT</td><td>45.00</td><td>0.00</td><td>2</td><td>3</td></tr>
                  <tr><td>3</td><td>3</td><td style="font-family:monospace; font-weight:600;">ORD-9903</td><td>ASSIGNED</td><td>8.20</td><td>1250.00</td><td>4</td><td>4</td></tr>
                  <tr><td>4</td><td>4</td><td style="font-family:monospace; font-weight:600;">ORD-9904</td><td>PENDING</td><td>120.00</td><td>3200.00</td><td>NULL</td><td>NULL</td></tr>
                  <tr><td>5</td><td>5</td><td style="font-family:monospace; font-weight:600;">ORD-9905</td><td>CANCELLED</td><td>5.00</td><td>0.00</td><td>NULL</td><td>NULL</td></tr>
                </tbody>
              </table>
            </div>
            <div class="mysql-status-bar">&check; 5 row(s) returned</div>
          </div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(36, p36_header, p36_content))

    # =========================================================================
    # PAGE 37: UI OUTPUT - Order Detail Specifications
    # =========================================================================
    p37_header = get_page_header("UI OUTPUT")
    p37_content = """
      <div class="ui-card-title">/orders/:id &mdash; ORDER SPECIFICATIONS &amp; CARGO DETAILS</div>
      <div class="ui-single-card">
        <img src="ui/orders/05_order_detail_view.png" alt="Order Detail View" />
      </div>
"""
    pages_html.append(wrap_page(37, p37_header, p37_content))

    # =========================================================================
    # PAGE 38: UI OUTPUT - User Directory & Admin Controls
    # =========================================================================
    p38_header = get_page_header("UI OUTPUT")
    p38_content = """
      <div class="ui-card-title">/orders/:id &mdash; ORDER LIFECYCLE TIMELINE &amp; AUDIT TRAIL</div>
      <div class="ui-single-card">
        <img src="ui/orders/06_order_lifecycle_timeline.png" alt="Order Lifecycle Timeline" />
      </div>
"""
    pages_html.append(wrap_page(38, p38_header, p38_content))

    # =========================================================================
    # PAGE 39: UI OUTPUT - Audit Trail & MySQL Logs
    # =========================================================================
    p39_header = get_page_header("UI OUTPUT")
    p39_content = """
      <div style="display: flex; flex-direction: column; gap: 14px; min-height: 0;">
        <div>
          <div class="ui-card-title">/dispatch &mdash; FLEET DISPATCH CONSOLE &amp; ASSIGNMENT FLOW</div>
          <div style="display: flex; justify-content: center; align-items: flex-start;">
            <img src="ui/dispatch/01_dispatch_console.png" alt="Dispatch Console" style="max-width: 100%; max-height: 98mm; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
          </div>
        </div>

        <div>
          <div class="mysql-block-title">MYSQL OUTPUT OF AUDIT LOGS</div>
          <div class="mysql-card">
            <div class="mysql-query-bar">&#9776;&nbsp; 1 * SELECT id, user_id, action, entity_type, entity_id, timestamp, ip_address FROM audit_log ORDER BY id DESC;</div>
            <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; &#128269; Filter Rows: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [ &check; ] Export / Import</div>
            <div class="mysql-table-wrap">
              <table class="mysql-table">
                <thead>
                  <tr><th>#</th><th>id</th><th>user_id</th><th>action</th><th>entity_type</th><th>entity_id</th><th>timestamp</th><th>ip_address</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>795</td><td>User Login</td><td>User</td><td>5</td><td>2026-09-08 13:33:37</td><td>127.0.0.1</td></tr>
                  <tr><td>2</td><td>781</td><td>User Login</td><td>User</td><td>1</td><td>2026-09-08 13:12:58</td><td>127.0.0.1</td></tr>
                  <tr><td>3</td><td>771</td><td>User Login</td><td>User</td><td>1</td><td>2026-09-08 12:59:13</td><td>127.0.0.1</td></tr>
                  <tr><td>4</td><td>761</td><td>Updated consignment status to DELIVERED</td><td>Order</td><td>12</td><td>2026-09-08 12:44:52</td><td>127.0.0.1</td></tr>
                  <tr><td>5</td><td>751</td><td>Dispatched vehicle KA01AB1234 to Order ORD-9901</td><td>Dispatch</td><td>12</td><td>2026-09-08 12:44:52</td><td>127.0.0.1</td></tr>
                  <tr><td>6</td><td>742</td><td>Driver availability toggled to ON_DUTY</td><td>Driver</td><td>5</td><td>2026-09-08 12:44:52</td><td>127.0.0.1</td></tr>
                  <tr><td>7</td><td>731</td><td>GPS telemetry coordinate logged</td><td>Tracking</td><td>5</td><td>2026-09-08 12:44:52</td><td>127.0.0.1</td></tr>
                </tbody>
              </table>
            </div>
            <div class="mysql-status-bar">&check; 79 row(s) returned</div>
          </div>
        </div>
      </div>
"""
    pages_html.append(wrap_page(39, p39_header, p39_content))

    # =========================================================================
    # PAGE 40: UI OUTPUT - Telemetry & System Config
    # =========================================================================
    p40_header = get_page_header("UI OUTPUT")
    p40_content = """
      <div class="ui-dual-col">
        <div class="ui-card">
          <div class="ui-card-title">ADMIN SYSTEM HEALTH &amp; SERVICE TELEMETRY</div>
          <img src="ui/tracking/01_live_tracking_map.png" alt="Live Tracking Map" />
        </div>
        <div class="ui-card">
          <div class="ui-card-title">ADMIN SYSTEM CONFIGURATION &amp; RATE LIMITS</div>
          <img src="ui/admin/01_admin_system_overview.png" alt="Admin System Health" />
        </div>
      </div>
"""
    pages_html.append(wrap_page(40, p40_header, p40_content))

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>FleetOps Complete Frontend Documentation</title>
<style>
{CSS_STYLES}
</style>
</head>
<body>
{"".join(pages_html)}
</body>
</html>
"""
    with open('docs/frontend/documentation.html', 'w', encoding='utf-8') as f:
        f.write(full_html)
    print(f"Generated docs/frontend/documentation.html with {len(pages_html)} pages.")

if __name__ == '__main__':
    generate_html()
