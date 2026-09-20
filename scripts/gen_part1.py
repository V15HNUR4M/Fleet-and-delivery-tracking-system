# scripts/gen_part1.py
with open("scripts/build_full_doc.py", "w", encoding="utf-8") as f:
    f.write('''# Comprehensive Frontend Documentation Generator for FleetOps
import os
import json
import subprocess

PAGES = []

def page_wrap(pno, super_t, title, sub_t, body_html):
    return f"""
    <div class="page" id="page-{pno}">
      <div class="page-border">
        <div class="doc-header">
          <div class="doc-super">{super_t}</div>
          <div class="doc-title">{title}</div>
          <div class="doc-sub">{sub_t}</div>
        </div>
        <div class="doc-content">
          {body_html}
        </div>
        <div class="doc-footer">
          <span>Fleet &amp; Delivery Tracking System &mdash; Frontend Technical Documentation</span>
          <span>Page {pno}</span>
        </div>
      </div>
    </div>
    """

# Page 1: Cover Page
PAGES.append("""
<div class="page" id="page-1" style="background:#ffffff;">
  <div class="page-border" style="border: 2px solid #0f172a; display: flex; flex-direction: column; justify-content: space-between; padding: 22mm 18mm;">
    <div>
      <div style="font-size: 13px; font-weight: 800; letter-spacing: 2.5px; color: #3b82f6; text-transform: uppercase;">
        Software Engineering &bull; Application Development
      </div>
      <div style="font-size: 28px; font-weight: 800; color: #0f172a; margin-top: 24px; line-height: 1.2; text-transform: uppercase;">
        Design and Implementation of Fleet and Delivery Tracking System (FleetOps)
      </div>
      <div style="font-size: 15px; font-weight: 600; color: #475569; margin-top: 12px; line-height: 1.45;">
        Real-Time Fleet Operations, Intelligent Dispatch Routing &amp; GPS Telemetry Platform
      </div>
      <div style="margin-top: 14px; display: inline-block; background: #0f172a; color: #38bdf8; font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 12px; border-radius: 4px; font-weight: 600;">
        ReactJS Frontend &bull; Spring Boot 4.1.0 REST Integration &bull; MySQL 8.0 &bull; Leaflet GIS
      </div>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; padding: 18px 22px; border-radius: 0 8px 8px 0; margin: 30px 0;">
      <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Comprehensive Frontend Technical Documentation
      </div>
      <div style="font-size: 11px; color: #334155; line-height: 1.6;">
        This document provides an exhaustive, production-grade technical specification of the ReactJS web application powering the Fleet and Delivery Tracking System. It details the complete frontend architecture, reusable component catalog, JWT authentication and session lifecycle, Axios REST client service layer, route configuration and role guards, CSS design tokens, Vite runtime environment, step-by-step UI workflows, and database verification.
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border-top: 1px solid #e2e8f0; padding-top: 18px;">
      <div>
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Technology Stack</div>
        <div style="font-size: 11px; color: #0f172a; font-weight: 600; margin-top: 3px;">React 19.2 &bull; React Router v7 &bull; Vite 8.2</div>
        <div style="font-size: 11px; color: #0f172a; font-weight: 600;">Leaflet 1.9 &bull; Recharts 3.1 &bull; Lucide React</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Backend &amp; Database</div>
        <div style="font-size: 11px; color: #0f172a; font-weight: 600; margin-top: 3px;">Spring Boot REST API @ Port 8081</div>
        <div style="font-size: 11px; color: #0f172a; font-weight: 600;">MySQL 8.0 Engine &bull; HikariCP Pooling</div>
      </div>
    </div>
  </div>
</div>
""")

# Page 2: Table of Contents & Executive Summary
PAGES.append(page_wrap(
  2,
  "TABLE OF CONTENTS &amp; EXECUTIVE OVERVIEW",
  "DOCUMENTATION INDEX &amp; ARCHITECTURE SUMMARY",
  "Fleet and Delivery Tracking System &mdash; Frontend Technical Specification",
  """
  <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
        <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
          Part I: Architecture &amp; Code Implementation
        </div>
        <ul style="font-size: 9.5px; line-height: 1.7; color: #334155; list-style-type: none; padding: 0;">
          <li><strong>01.</strong> Frontend Project Structure &amp; Build Artifacts ................ Page 03</li>
          <li><strong>02.</strong> Complete Frontend Source Files Inventory ........................ Page 04</li>
          <li><strong>03.</strong> Components: Sidebar Navigation ................................... Page 05</li>
          <li><strong>04.</strong> Components: TopNavbar &amp; User Controls ......................... Page 06</li>
          <li><strong>05.</strong> Components: StatusBadge &amp; Pagination ............................ Page 07</li>
          <li><strong>06.</strong> Components: Modal &amp; ConfirmDialog .............................. Page 08</li>
          <li><strong>07.</strong> Components: LoadingSkeleton, EmptyState &amp; ErrorState ... Page 09</li>
          <li><strong>08.</strong> Authentication &amp; Authorization: AuthContext ................... Page 10</li>
          <li><strong>09.</strong> Security Guards: ProtectedRoute &amp; RoleGuard ................. Page 11</li>
          <li><strong>10.</strong> API Service Layer: Axios Client &amp; Auth API ..................... Page 12</li>
          <li><strong>11.</strong> API Service Layer: Vehicles &amp; Drivers REST APIs ............ Page 13</li>
          <li><strong>12.</strong> API Service Layer: Orders &amp; GPS Tracking APIs .............. Page 14</li>
          <li><strong>13.</strong> Application Routing &amp; Shell: App.jsx ................................. Page 15</li>
          <li><strong>14.</strong> Theme &amp; Styling: index.css Design Tokens ....................... Page 16</li>
          <li><strong>15.</strong> Theme &amp; Layout: index.css Components &amp; App.css ....... Page 17</li>
          <li><strong>16.</strong> Entry Point &amp; Host: main.jsx, index.html &amp; Vite ............... Page 18</li>
          <li><strong>17.</strong> Package Configuration &amp; Constants/Types/Utils ............. Page 19</li>
          <li><strong>18.</strong> Application Execution &amp; Server Telemetry ...................... Page 20</li>
        </ul>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
        <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
          Part II: Real Running UI Workflows &amp; SQL
        </div>
        <ul style="font-size: 9.5px; line-height: 1.7; color: #334155; list-style-type: none; padding: 0;">
          <li><strong>19.</strong> UI Workflow: Login &amp; Registration ................................... Page 21</li>
          <li><strong>20.</strong> UI Workflow: Real-Time Dispatcher Dashboard ................. Page 22</li>
          <li><strong>21.</strong> UI Workflow: Fleet &amp; Vehicle Management ....................... Page 23</li>
          <li><strong>22.</strong> Database Verification: Vehicles &amp; Users MySQL ................. Page 24</li>
          <li><strong>23.</strong> UI Workflow: Drivers Directory &amp; Status ......................... Page 25</li>
          <li><strong>24.</strong> Database Verification: Drivers MySQL Records .................. Page 26</li>
          <li><strong>25.</strong> UI Workflow: Order Creation &amp; Management ................... Page 27</li>
          <li><strong>26.</strong> UI Workflow: Order Details &amp; Lifecycle Timeline .............. Page 28</li>
          <li><strong>27.</strong> Database Verification: Orders MySQL Records ................... Page 29</li>
          <li><strong>28.</strong> UI Workflow: Dispatch Console &amp; Route Matching ............ Page 30</li>
          <li><strong>29.</strong> UI Workflow: Live GPS Tracking &amp; Leaflet Map ................ Page 31</li>
          <li><strong>30.</strong> UI Workflow: Location Breadcrumb History ........................ Page 32</li>
          <li><strong>31.</strong> UI Workflow: Performance &amp; Fleet Analytics .................... Page 33</li>
          <li><strong>32.</strong> UI Workflow: Admin Console &amp; RBAC Privileges .............. Page 34</li>
          <li><strong>33.</strong> Source Archive: Pages CodeSnap (Pages 35 &ndash; 43) ......... Page 35-43</li>
          <li><strong>34.</strong> Final Frontend Architecture &amp; Technology Synthesis ..... Page 44</li>
        </ul>
      </div>
    </div>

    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px;">
      <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">
        Executive Architectural Highlights
      </div>
      <div style="font-size: 9px; color: #475569; line-height: 1.5;">
        The FleetOps client application is constructed using modern declarative React with functional components and hooks. State is compartmentalized into AuthContext (session token and role state) and modular page-level local state with caching and debouncing. Client-server communication is handled via a dedicated Axios instance with JWT Authorization Bearer interceptors, automatic error normalizers, and reverse proxy forwarding to the Spring Boot REST backend.
      </div>
    </div>
  </div>
  """
))

# Page 3: Folder Structure
PAGES.append(page_wrap(
  3,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "FOLDER STRUCTURE &amp; PROJECT DIRECTORY HIERARCHY",
  "Physical filesystem layout &bull; Source organization &bull; Production build artifacts",
  """
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1;">
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
        1. FleetOps Project Root Hierarchy
      </div>
      <div class="tree-box">
<span style="color:#f1fa8c;">fleet and delivery tracking system/</span>
&boxvr;&boxh;&boxh; <span style="color:#ff79c6;">backend/</span>
&boxv;   &boxvr;&boxh;&boxh; pom.xml
&boxv;   &boxvr;&boxh;&boxh; mvnw.cmd
&boxv;   &boxur;&boxh;&boxh; src/main/java/com/fleettracking/
&boxvr;&boxh;&boxh; <span style="color:#50fa7b;">frontend/</span>
&boxv;   &boxvr;&boxh;&boxh; <span style="color:#bd93f9;">dist/</span> (Production Build Output)
&boxv;   &boxvr;&boxh;&boxh; <span style="color:#bd93f9;">node_modules/</span>
&boxv;   &boxvr;&boxh;&boxh; <span style="color:#50fa7b;">src/</span> (React Source Code)
&boxv;   &boxvr;&boxh;&boxh; index.html
&boxv;   &boxvr;&boxh;&boxh; package.json
&boxv;   &boxvr;&boxh;&boxh; vite.config.js
&boxv;   &boxur;&boxh;&boxh; README.md
&boxur;&boxh;&boxh; docs/frontend/ (Documentation Assets)
      </div>

      <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
        2. Production Build Directory (dist)
      </div>
      <div class="tree-box">
<span style="color:#f1fa8c;">frontend/dist/</span>
&boxvr;&boxh;&boxh; index.html (1.02 kB)
&boxur;&boxh;&boxh; <span style="color:#bd93f9;">assets/</span>
    &boxvr;&boxh;&boxh; index-BKmPnzDM.css (22.68 kB)
    &boxvr;&boxh;&boxh; leaflet-vh-t_kPv.css (15.09 kB)
    &boxvr;&boxh;&boxh; index-bzWqRCCT.js (184.37 kB)
    &boxvr;&boxh;&boxh; vendor-CYCcEkIq.js (230.01 kB)
    &boxvr;&boxh;&boxh; leaflet-CwUDpvQr.js (167.39 kB)
    &boxur;&boxh;&boxh; rolldown-runtime.js (0.71 kB)
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
        3. Frontend Source Directory (frontend/src)
      </div>
      <div class="tree-box">
<span style="color:#f1fa8c;">frontend/src/</span>
&boxvr;&boxh;&boxh; <span style="color:#8be9fd;">api/</span> (Axios HTTP Service Clients)
&boxv;   &boxvr;&boxh;&boxh; axios.js, authApi.js, vehicleApi.js
&boxv;   &boxur;&boxh;&boxh; driverApi.js, orderApi.js, trackingApi.js
&boxvr;&boxh;&boxh; <span style="color:#ffb86c;">auth/</span> (Authentication &amp; RBAC Guards)
&boxv;   &boxvr;&boxh;&boxh; AuthContext.jsx
&boxv;   &boxvr;&boxh;&boxh; ProtectedRoute.jsx
&boxv;   &boxur;&boxh;&boxh; RoleGuard.jsx
&boxvr;&boxh;&boxh; <span style="color:#50fa7b;">components/</span> (Reusable Presentation Components)
&boxv;   &boxvr;&boxh;&boxh; <span style="color:#8be9fd;">layout/</span> (Sidebar.jsx, TopNavbar.jsx)
&boxv;   &boxur;&boxh;&boxh; <span style="color:#8be9fd;">common/</span> (StatusBadge, Pagination, Modal...)
&boxvr;&boxh;&boxh; <span style="color:#ff79c6;">pages/</span> (Application Module Views)
&boxv;   &boxvr;&boxh;&boxh; Login, Dashboard, Vehicles, Drivers
&boxv;   &boxvr;&boxh;&boxh; Orders, OrderDetail, Dispatch, Tracking
&boxv;   &boxur;&boxh;&boxh; Analytics, Admin, NotFound
&boxvr;&boxh;&boxh; <span style="color:#f1fa8c;">constants/</span> (Enums, Statuses, Nav Config)
&boxvr;&boxh;&boxh; <span style="color:#f1fa8c;">types/</span> (Data Models &amp; Type Contracts)
&boxvr;&boxh;&boxh; <span style="color:#f1fa8c;">utils/</span> (Date formatters, Error Parsers)
&boxvr;&boxh;&boxh; App.jsx &amp; App.css (Application Root Shell)
&boxvr;&boxh;&boxh; main.jsx (React 19 Root Render)
&boxur;&boxh;&boxh; index.css (Global Design Tokens &amp; Theme)
      </div>
    </div>
  </div>
  """
))

# Page 4: Frontend Source Files Inventory
PAGES.append(page_wrap(
  4,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "FRONTEND SOURCE FILES INVENTORY &amp; CODEBASE METRICS",
  "Exhaustive catalogue of all 39 source and configuration files in the React application",
  """
  <div style="display: flex; flex-direction: column; flex: 1;">
    <div style="font-size: 9.5px; color: #475569; margin-bottom: 6px;">
      Total verified files: <strong>39 source files</strong> (JavaScript/JSX, CSS, JSON, HTML) &bull; Total source lines: <strong>5,180+ lines</strong> &bull; Zero TypeScript files (.ts/.tsx).
    </div>
    <div style="overflow: hidden; border: 1px solid #cbd5e1; border-radius: 6px; flex: 1;">
      <table class="inv-table">
        <thead>
          <tr>
            <th>Module / Layer</th>
            <th>File Path</th>
            <th>Type</th>
            <th>Lines</th>
            <th>Exported Entities / Responsibilities</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Core &amp; Shell</strong></td><td class="font-mono">frontend/src/main.jsx</td><td>JSX</td><td>10</td><td>createRoot, StrictMode host</td></tr>
          <tr><td><strong>Core &amp; Shell</strong></td><td class="font-mono">frontend/src/App.jsx</td><td>JSX</td><td>208</td><td>BrowserRouter, AppShell, Route declarations</td></tr>
          <tr><td><strong>Styles</strong></td><td class="font-mono">frontend/src/App.css</td><td>CSS</td><td>184</td><td>App layout, sidebar grid, main content viewport</td></tr>
          <tr><td><strong>Styles</strong></td><td class="font-mono">frontend/src/index.css</td><td>CSS</td><td>716</td><td>Design tokens, dark palette, badges, modals</td></tr>
          <tr><td><strong>Configuration</strong></td><td class="font-mono">frontend/package.json</td><td>JSON</td><td>30</td><td>Dependencies, build scripts, npm definitions</td></tr>
          <tr><td><strong>Configuration</strong></td><td class="font-mono">frontend/vite.config.js</td><td>JS</td><td>28</td><td>Port 5173, backend reverse proxy (/api &rarr; :8081)</td></tr>
          <tr><td><strong>Configuration</strong></td><td class="font-mono">frontend/index.html</td><td>HTML</td><td>16</td><td>HTML5 host document, title, meta viewport</td></tr>
          <tr><td><strong>API Service</strong></td><td class="font-mono">frontend/src/api/axios.js</td><td>JS</td><td>40</td><td>Axios client instance, JWT Bearer interceptor</td></tr>
          <tr><td><strong>API Service</strong></td><td class="font-mono">frontend/src/api/authApi.js</td><td>JS</td><td>10</td><td>login(), register() POST endpoints</td></tr>
          <tr><td><strong>API Service</strong></td><td class="font-mono">frontend/src/api/vehicleApi.js</td><td>JS</td><td>18</td><td>CRUD &amp; status PATCH operations for vehicles</td></tr>
          <tr><td><strong>API Service</strong></td><td class="font-mono">frontend/src/api/driverApi.js</td><td>JS</td><td>17</td><td>CRUD &amp; availability PATCH for drivers</td></tr>
          <tr><td><strong>API Service</strong></td><td class="font-mono">frontend/src/api/orderApi.js</td><td>JS</td><td>25</td><td>Lifecycle operations, dispatch assign, status</td></tr>
          <tr><td><strong>API Service</strong></td><td class="font-mono">frontend/src/api/trackingApi.js</td><td>JS</td><td>22</td><td>GPS telemetry ingest and history retrieval</td></tr>
          <tr><td><strong>Auth &amp; RBAC</strong></td><td class="font-mono">frontend/src/auth/AuthContext.jsx</td><td>JSX</td><td>75</td><td>AuthProvider, useAuth, session storage, roles</td></tr>
          <tr><td><strong>Auth &amp; RBAC</strong></td><td class="font-mono">frontend/src/auth/ProtectedRoute.jsx</td><td>JSX</td><td>24</td><td>Unauthenticated redirect to /login guard</td></tr>
          <tr><td><strong>Auth &amp; RBAC</strong></td><td class="font-mono">frontend/src/auth/RoleGuard.jsx</td><td>JSX</td><td>19</td><td>Role authorization restriction barrier</td></tr>
          <tr><td><strong>Layout</strong></td><td class="font-mono">frontend/src/components/layout/Sidebar.jsx</td><td>JSX</td><td>102</td><td>Collapsible sidebar with role-aware nav items</td></tr>
          <tr><td><strong>Layout</strong></td><td class="font-mono">frontend/src/components/layout/TopNavbar.jsx</td><td>JSX</td><td>132</td><td>App bar, telemetry time, user role, logout</td></tr>
          <tr><td><strong>Common</strong></td><td class="font-mono">frontend/src/components/common/StatusBadge.jsx</td><td>JSX</td><td>23</td><td>Status badge with semantic color mapping</td></tr>
          <tr><td><strong>Common</strong></td><td class="font-mono">frontend/src/components/common/Pagination.jsx</td><td>JSX</td><td>61</td><td>Page switching, total count display</td></tr>
          <tr><td><strong>Common</strong></td><td class="font-mono">frontend/src/components/common/Modal.jsx</td><td>JSX</td><td>36</td><td>Backdrop dialog with keyboard accessibility</td></tr>
          <tr><td><strong>Common</strong></td><td class="font-mono">frontend/src/components/common/ConfirmDialog.jsx</td><td>JSX</td><td>40</td><td>Action confirmation dialog with destructive styling</td></tr>
          <tr><td><strong>Common</strong></td><td class="font-mono">frontend/src/components/common/LoadingSkeleton.jsx</td><td>JSX</td><td>24</td><td>Pulsing content placeholder skeleton</td></tr>
          <tr><td><strong>Common</strong></td><td class="font-mono">frontend/src/components/common/EmptyState.jsx</td><td>JSX</td><td>20</td><td>Empty state graphic with informative message</td></tr>
          <tr><td><strong>Common</strong></td><td class="font-mono">frontend/src/components/common/ErrorState.jsx</td><td>JSX</td><td>17</td><td>Error banner with retry trigger</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Login/LoginPage.jsx</td><td>JSX</td><td>244</td><td>Sign-in tab, registration tab, role selection</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Dashboard/DashboardPage.jsx</td><td>JSX</td><td>269</td><td>Real-time KPIs, fleet status, recent orders</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Vehicles/VehiclesPage.jsx</td><td>JSX</td><td>385</td><td>Fleet inventory table, filters, Add Vehicle modal</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Drivers/DriversPage.jsx</td><td>JSX</td><td>334</td><td>Driver directory, availability toggle, Add modal</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Orders/OrdersPage.jsx</td><td>JSX</td><td>557</td><td>Orders table, status filter tabs, Create modal</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/OrderDetail/OrderDetailPage.jsx</td><td>JSX</td><td>390</td><td>Lifecycle timeline, package specs, status actions</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Dispatch/DispatchPage.jsx</td><td>JSX</td><td>260</td><td>Queue, driver/vehicle selection, assignment</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Tracking/TrackingPage.jsx</td><td>JSX</td><td>445</td><td>Leaflet GPS map, telemetry HUD, breadcrumbs</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Analytics/AnalyticsPage.jsx</td><td>JSX</td><td>135</td><td>Operational KPIs, utilization (pending backend)</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/Admin/AdminPage.jsx</td><td>JSX</td><td>97</td><td>System telemetry, JWT settings, role matrix</td></tr>
          <tr><td><strong>Pages</strong></td><td class="font-mono">frontend/src/pages/NotFound/NotFoundPage.jsx</td><td>JSX</td><td>19</td><td>404 fallback page</td></tr>
          <tr><td><strong>Constants</strong></td><td class="font-mono">frontend/src/constants/index.js</td><td>JS</td><td>97</td><td>ROLES, ORDER_STATUSES, VEHICLE_TYPES</td></tr>
          <tr><td><strong>Types</strong></td><td class="font-mono">frontend/src/types/index.js</td><td>JS</td><td>34</td><td>JSDoc data schemas and interface contracts</td></tr>
          <tr><td><strong>Utils</strong></td><td class="font-mono">frontend/src/utils/index.js</td><td>JS</td><td>89</td><td>formatDate, truncate, getErrorMessage, SLA helper</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  """
))

# Page 5: Components — Sidebar.jsx
PAGES.append(page_wrap(
  5,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "REUSABLE COMPONENTS &bull; NAVIGATION SIDEBAR",
  "/components/layout/Sidebar.jsx",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Primary application navigation sidebar. Features role-aware link filtering (e.g., ADMIN and DISPATCHER have full operational access; DRIVER and CUSTOMER have restricted views), active route highlight using NavLink, collapsible mobile drawer overlay, and current session role indicator badge.
  </div>
  <div class="codesnap-box">
    <img src="code/components/layout/Sidebar.jsx.png" alt="Sidebar.jsx CodeSnap" />
  </div>
  """
))

# Page 6: Components — TopNavbar.jsx
PAGES.append(page_wrap(
  6,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "REUSABLE COMPONENTS &bull; APPLICATION TOP NAVBAR",
  "/components/layout/TopNavbar.jsx (Part 1 &amp; Part 2)",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Global header navigation bar providing real-time telemetry indicator, breadcrumb location path, notification drawer trigger, authenticated user badge with role chip, and secure sign-out action with local storage clearance.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">TopNavbar.jsx &mdash; Part 1: Header Structure, Breadcrumbs &amp; User Avatar Menu</div>
      <img src="code/components/layout/TopNavbar.jsx_p1.png" alt="TopNavbar.jsx Part 1" />
    </div>
    <div class="snap-item">
      <div class="item-caption">TopNavbar.jsx &mdash; Part 2: Notifications Dropdown, Role Badge &amp; Logout Handler</div>
      <img src="code/components/layout/TopNavbar.jsx_p2.png" alt="TopNavbar.jsx Part 2" />
    </div>
  </div>
  """
))

# Page 7: Components — StatusBadge.jsx & Pagination.jsx
PAGES.append(page_wrap(
  7,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "REUSABLE COMPONENTS &bull; STATUS BADGES &amp; PAGINATION",
  "/components/common/StatusBadge.jsx &bull; /components/common/Pagination.jsx",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> StatusBadge provides semantic pill indicators mapping vehicle, driver, and order statuses to color tokens (e.g., ACTIVE/AVAILABLE = green, IN_TRANSIT/ON_DUTY = blue, MAINTENANCE/BREAK = amber, CANCELLED/FAILED = red). Pagination manages page controls and page sizes for API queries.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">StatusBadge.jsx &mdash; Semantic Status Indicator with CSS Badge Token Mapping</div>
      <img src="code/components/common/StatusBadge.jsx.png" alt="StatusBadge.jsx" />
    </div>
    <div class="snap-item">
      <div class="item-caption">Pagination.jsx &mdash; Accessible Page Switching with Boundary &amp; State Controls</div>
      <img src="code/components/common/Pagination.jsx.png" alt="Pagination.jsx" />
    </div>
  </div>
  """
))

# Page 8: Components — Modal.jsx & ConfirmDialog.jsx
PAGES.append(page_wrap(
  8,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "REUSABLE COMPONENTS &bull; MODALS &amp; CONFIRMATION DIALOGS",
  "/components/common/Modal.jsx &bull; /components/common/ConfirmDialog.jsx",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Modal provides an accessible modal overlay with keyboard escape listeners, backdrop click dismissal, and focus trapping. ConfirmDialog encapsulates critical destructive actions (such as vehicle decommissioning or order cancellation) with customizable intent buttons.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">Modal.jsx &mdash; Accessible Backdrop Modal Dialog with Header, Body &amp; Dismiss Listener</div>
      <img src="code/components/common/Modal.jsx.png" alt="Modal.jsx" />
    </div>
    <div class="snap-item">
      <div class="item-caption">ConfirmDialog.jsx &mdash; Action Confirmation Dialog with Severity Theme Variations</div>
      <img src="code/components/common/ConfirmDialog.jsx.png" alt="ConfirmDialog.jsx" />
    </div>
  </div>
  """
))

print("Part 1 written successfully.")
''')
