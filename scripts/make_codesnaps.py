import os
import json
import pygments
from pygments.lexers import JavascriptLexer, CssLexer, JsonLexer, HtmlLexer
from pygments.formatters import HtmlFormatter

FILES_CONFIG = [
    {
        "id": "main_jsx",
        "rel_path": "frontend/src/main.jsx",
        "title": "main.jsx",
        "category": "core",
        "output": "docs/frontend/code/core/main.jsx.png",
        "chunks": [{"name": "Complete Source", "start": 1, "end": 10}]
    },
    {
        "id": "app_jsx",
        "rel_path": "frontend/src/App.jsx",
        "title": "App.jsx",
        "category": "core",
        "output": "docs/frontend/code/core/App.jsx.png",
        "chunks": [
            {"name": "App.jsx — Part 1: Imports, Shell Layout & Core Routes", "start": 1, "end": 105, "suffix": "_p1"},
            {"name": "App.jsx — Part 2: Module Routes & Protected Route Guards", "start": 106, "end": 208, "suffix": "_p2"}
        ]
    },
    {
        "id": "app_css",
        "rel_path": "frontend/src/App.css",
        "title": "App.css",
        "category": "styles",
        "output": "docs/frontend/code/styles/App.css.png",
        "chunks": [
            {"name": "App.css — Part 1: Layout Container, Shell & Sidebar Grid", "start": 1, "end": 95, "suffix": "_p1"},
            {"name": "App.css — Part 2: Main Content Area & Responsive Breakpoints", "start": 96, "end": 184, "suffix": "_p2"}
        ]
    },
    {
        "id": "index_css",
        "rel_path": "frontend/src/index.css",
        "title": "index.css",
        "category": "styles",
        "output": "docs/frontend/code/styles/index.css.png",
        "chunks": [
            {"name": "index.css — Part 1: Design Tokens, CSS Variables & Base Theme", "start": 1, "end": 240, "suffix": "_p1"},
            {"name": "index.css — Part 2: Component Styles, Tables, Cards & Modals", "start": 241, "end": 480, "suffix": "_p2"},
            {"name": "index.css — Part 3: Badges, Buttons, Form Inputs & Utilities", "start": 481, "end": 716, "suffix": "_p3"}
        ]
    },
    {
        "id": "package_json",
        "rel_path": "frontend/package.json",
        "title": "package.json",
        "category": "config",
        "output": "docs/frontend/code/config/package.json.png",
        "chunks": [{"name": "Complete Configuration", "start": 1, "end": 30}]
    },
    {
        "id": "vite_config_js",
        "rel_path": "frontend/vite.config.js",
        "title": "vite.config.js",
        "category": "config",
        "output": "docs/frontend/code/config/vite.config.js.png",
        "chunks": [{"name": "Vite Configuration & Reverse Proxy", "start": 1, "end": 28}]
    },
    {
        "id": "index_html",
        "rel_path": "frontend/index.html",
        "title": "index.html",
        "category": "config",
        "output": "docs/frontend/code/config/index.html.png",
        "chunks": [{"name": "HTML Host Entry Document", "start": 1, "end": 16}]
    },
    {
        "id": "axios_js",
        "rel_path": "frontend/src/api/axios.js",
        "title": "api/axios.js",
        "category": "api",
        "output": "docs/frontend/code/api/axios.js.png",
        "chunks": [{"name": "Axios HTTP Client & JWT Interceptor", "start": 1, "end": 40}]
    },
    {
        "id": "authApi_js",
        "rel_path": "frontend/src/api/authApi.js",
        "title": "api/authApi.js",
        "category": "api",
        "output": "docs/frontend/code/api/authApi.js.png",
        "chunks": [{"name": "Authentication API Endpoints", "start": 1, "end": 10}]
    },
    {
        "id": "vehicleApi_js",
        "rel_path": "frontend/src/api/vehicleApi.js",
        "title": "api/vehicleApi.js",
        "category": "api",
        "output": "docs/frontend/code/api/vehicleApi.js.png",
        "chunks": [{"name": "Vehicle Management REST API", "start": 1, "end": 18}]
    },
    {
        "id": "driverApi_js",
        "rel_path": "frontend/src/api/driverApi.js",
        "title": "api/driverApi.js",
        "category": "api",
        "output": "docs/frontend/code/api/driverApi.js.png",
        "chunks": [{"name": "Driver Directory & Status REST API", "start": 1, "end": 17}]
    },
    {
        "id": "orderApi_js",
        "rel_path": "frontend/src/api/orderApi.js",
        "title": "api/orderApi.js",
        "category": "api",
        "output": "docs/frontend/code/api/orderApi.js.png",
        "chunks": [{"name": "Order Lifecycle & Assignment REST API", "start": 1, "end": 25}]
    },
    {
        "id": "trackingApi_js",
        "rel_path": "frontend/src/api/trackingApi.js",
        "title": "api/trackingApi.js",
        "category": "api",
        "output": "docs/frontend/code/api/trackingApi.js.png",
        "chunks": [{"name": "GPS Telemetry & Location History REST API", "start": 1, "end": 22}]
    },
    {
        "id": "AuthContext_jsx",
        "rel_path": "frontend/src/auth/AuthContext.jsx",
        "title": "auth/AuthContext.jsx",
        "category": "auth",
        "output": "docs/frontend/code/auth/AuthContext.jsx.png",
        "chunks": [{"name": "JWT Session State & Role-Based Auth Context", "start": 1, "end": 75}]
    },
    {
        "id": "ProtectedRoute_jsx",
        "rel_path": "frontend/src/auth/ProtectedRoute.jsx",
        "title": "auth/ProtectedRoute.jsx",
        "category": "auth",
        "output": "docs/frontend/code/auth/ProtectedRoute.jsx.png",
        "chunks": [{"name": "Protected Route Guard & Session Check", "start": 1, "end": 24}]
    },
    {
        "id": "RoleGuard_jsx",
        "rel_path": "frontend/src/auth/RoleGuard.jsx",
        "title": "auth/RoleGuard.jsx",
        "category": "auth",
        "output": "docs/frontend/code/auth/RoleGuard.jsx.png",
        "chunks": [{"name": "Role-Based Access Control Guard", "start": 1, "end": 19}]
    },
    {
        "id": "Sidebar_jsx",
        "rel_path": "frontend/src/components/layout/Sidebar.jsx",
        "title": "components/layout/Sidebar.jsx",
        "category": "components/layout",
        "output": "docs/frontend/code/components/layout/Sidebar.jsx.png",
        "chunks": [{"name": "Navigation Sidebar with Role Filters", "start": 1, "end": 102}]
    },
    {
        "id": "TopNavbar_jsx",
        "rel_path": "frontend/src/components/layout/TopNavbar.jsx",
        "title": "components/layout/TopNavbar.jsx",
        "category": "components/layout",
        "output": "docs/frontend/code/components/layout/TopNavbar.jsx.png",
        "chunks": [
            {"name": "TopNavbar.jsx — Part 1: Header, User Menu & Search", "start": 1, "end": 66, "suffix": "_p1"},
            {"name": "TopNavbar.jsx — Part 2: Notifications & Sign-Out Action", "start": 67, "end": 132, "suffix": "_p2"}
        ]
    },
    {
        "id": "StatusBadge_jsx",
        "rel_path": "frontend/src/components/common/StatusBadge.jsx",
        "title": "components/common/StatusBadge.jsx",
        "category": "components/common",
        "output": "docs/frontend/code/components/common/StatusBadge.jsx.png",
        "chunks": [{"name": "Semantic Status Badge Component", "start": 1, "end": 23}]
    },
    {
        "id": "Pagination_jsx",
        "rel_path": "frontend/src/components/common/Pagination.jsx",
        "title": "components/common/Pagination.jsx",
        "category": "components/common",
        "output": "docs/frontend/code/components/common/Pagination.jsx.png",
        "chunks": [{"name": "Data Table Pagination Component", "start": 1, "end": 61}]
    },
    {
        "id": "Modal_jsx",
        "rel_path": "frontend/src/components/common/Modal.jsx",
        "title": "components/common/Modal.jsx",
        "category": "components/common",
        "output": "docs/frontend/code/components/common/Modal.jsx.png",
        "chunks": [{"name": "Accessible Backdrop Modal Dialog", "start": 1, "end": 36}]
    },
    {
        "id": "ConfirmDialog_jsx",
        "rel_path": "frontend/src/components/common/ConfirmDialog.jsx",
        "title": "components/common/ConfirmDialog.jsx",
        "category": "components/common",
        "output": "docs/frontend/code/components/common/ConfirmDialog.jsx.png",
        "chunks": [{"name": "Action Confirmation Dialog", "start": 1, "end": 40}]
    },
    {
        "id": "LoadingSkeleton_jsx",
        "rel_path": "frontend/src/components/common/LoadingSkeleton.jsx",
        "title": "components/common/LoadingSkeleton.jsx",
        "category": "components/common",
        "output": "docs/frontend/code/components/common/LoadingSkeleton.jsx.png",
        "chunks": [{"name": "Content Loading Skeleton Placeholder", "start": 1, "end": 24}]
    },
    {
        "id": "EmptyState_jsx",
        "rel_path": "frontend/src/components/common/EmptyState.jsx",
        "title": "components/common/EmptyState.jsx",
        "category": "components/common",
        "output": "docs/frontend/code/components/common/EmptyState.jsx.png",
        "chunks": [{"name": "Zero-Data Empty State View", "start": 1, "end": 20}]
    },
    {
        "id": "ErrorState_jsx",
        "rel_path": "frontend/src/components/common/ErrorState.jsx",
        "title": "components/common/ErrorState.jsx",
        "category": "components/common",
        "output": "docs/frontend/code/components/common/ErrorState.jsx.png",
        "chunks": [{"name": "API Error State Banner", "start": 1, "end": 17}]
    },
    {
        "id": "LoginPage_jsx",
        "rel_path": "frontend/src/pages/Login/LoginPage.jsx",
        "title": "pages/Login/LoginPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/LoginPage.jsx.png",
        "chunks": [
            {"name": "LoginPage.jsx — Part 1: Auth State, Login & Register Handlers", "start": 1, "end": 120, "suffix": "_p1"},
            {"name": "LoginPage.jsx — Part 2: Form UI, OTP Toggle & Role Selector", "start": 121, "end": 244, "suffix": "_p2"}
        ]
    },
    {
        "id": "DashboardPage_jsx",
        "rel_path": "frontend/src/pages/Dashboard/DashboardPage.jsx",
        "title": "pages/Dashboard/DashboardPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/DashboardPage.jsx.png",
        "chunks": [
            {"name": "DashboardPage.jsx — Part 1: Data Fetching & KPI Metric Cards", "start": 1, "end": 135, "suffix": "_p1"},
            {"name": "DashboardPage.jsx — Part 2: Fleet Status Chart & Active Deliveries", "start": 136, "end": 269, "suffix": "_p2"}
        ]
    },
    {
        "id": "VehiclesPage_jsx",
        "rel_path": "frontend/src/pages/Vehicles/VehiclesPage.jsx",
        "title": "pages/Vehicles/VehiclesPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/VehiclesPage.jsx.png",
        "chunks": [
            {"name": "VehiclesPage.jsx — Part 1: State, Fetching & Filter Controls", "start": 1, "end": 130, "suffix": "_p1"},
            {"name": "VehiclesPage.jsx — Part 2: Vehicle Inventory Table & Action Menu", "start": 131, "end": 260, "suffix": "_p2"},
            {"name": "VehiclesPage.jsx — Part 3: Add/Edit Vehicle Modal Form", "start": 261, "end": 385, "suffix": "_p3"}
        ]
    },
    {
        "id": "DriversPage_jsx",
        "rel_path": "frontend/src/pages/Drivers/DriversPage.jsx",
        "title": "pages/Drivers/DriversPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/DriversPage.jsx.png",
        "chunks": [
            {"name": "DriversPage.jsx — Part 1: State, Availability Filter & Handlers", "start": 1, "end": 165, "suffix": "_p1"},
            {"name": "DriversPage.jsx — Part 2: Driver Directory Table & Modal Form", "start": 166, "end": 334, "suffix": "_p2"}
        ]
    },
    {
        "id": "OrdersPage_jsx",
        "rel_path": "frontend/src/pages/Orders/OrdersPage.jsx",
        "title": "pages/Orders/OrdersPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/OrdersPage.jsx.png",
        "chunks": [
            {"name": "OrdersPage.jsx — Part 1: Status Filters, Search & State", "start": 1, "end": 180, "suffix": "_p1"},
            {"name": "OrdersPage.jsx — Part 2: Orders Table, Route Points & Status Badges", "start": 181, "end": 370, "suffix": "_p2"},
            {"name": "OrdersPage.jsx — Part 3: Create Order Modal & Form Validation", "start": 371, "end": 556, "suffix": "_p3"}
        ]
    },
    {
        "id": "OrderDetailPage_jsx",
        "rel_path": "frontend/src/pages/OrderDetail/OrderDetailPage.jsx",
        "title": "pages/OrderDetail/OrderDetailPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/OrderDetailPage.jsx.png",
        "chunks": [
            {"name": "OrderDetailPage.jsx — Part 1: Fetching, Lifecycle Timeline & Order Info", "start": 1, "end": 195, "suffix": "_p1"},
            {"name": "OrderDetailPage.jsx — Part 2: Assignment Details & Status Transitions", "start": 196, "end": 390, "suffix": "_p2"}
        ]
    },
    {
        "id": "DispatchPage_jsx",
        "rel_path": "frontend/src/pages/Dispatch/DispatchPage.jsx",
        "title": "pages/Dispatch/DispatchPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/DispatchPage.jsx.png",
        "chunks": [
            {"name": "DispatchPage.jsx — Part 1: Pending Queue, Driver & Vehicle Selectors", "start": 1, "end": 130, "suffix": "_p1"},
            {"name": "DispatchPage.jsx — Part 2: Dispatch Confirmation & Assignment Flow", "start": 131, "end": 259, "suffix": "_p2"}
        ]
    },
    {
        "id": "TrackingPage_jsx",
        "rel_path": "frontend/src/pages/Tracking/TrackingPage.jsx",
        "title": "pages/Tracking/TrackingPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/TrackingPage.jsx.png",
        "chunks": [
            {"name": "TrackingPage.jsx — Part 1: Leaflet Map Setup & Driver Selector", "start": 1, "end": 150, "suffix": "_p1"},
            {"name": "TrackingPage.jsx — Part 2: Live Polling, Telemetry HUD & Markers", "start": 151, "end": 300, "suffix": "_p2"},
            {"name": "TrackingPage.jsx — Part 3: Location Breadcrumbs & History Table", "start": 301, "end": 444, "suffix": "_p3"}
        ]
    },
    {
        "id": "AnalyticsPage_jsx",
        "rel_path": "frontend/src/pages/Analytics/AnalyticsPage.jsx",
        "title": "pages/Analytics/AnalyticsPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/AnalyticsPage.jsx.png",
        "chunks": [{"name": "Recharts Fleet KPIs & Performance Analytics", "start": 1, "end": 134}]
    },
    {
        "id": "AdminPage_jsx",
        "rel_path": "frontend/src/pages/Admin/AdminPage.jsx",
        "title": "pages/Admin/AdminPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/AdminPage.jsx.png",
        "chunks": [{"name": "Admin System Dashboard & Service Status", "start": 1, "end": 96}]
    },
    {
        "id": "NotFoundPage_jsx",
        "rel_path": "frontend/src/pages/NotFound/NotFoundPage.jsx",
        "title": "pages/NotFound/NotFoundPage.jsx",
        "category": "pages",
        "output": "docs/frontend/code/pages/NotFoundPage.jsx.png",
        "chunks": [{"name": "404 Not Found Fallback View", "start": 1, "end": 19}]
    },
    {
        "id": "constants_index_js",
        "rel_path": "frontend/src/constants/index.js",
        "title": "constants/index.js",
        "category": "constants",
        "output": "docs/frontend/code/constants/constants_index.js.png",
        "chunks": [{"name": "System Roles, Order Statuses & Options", "start": 1, "end": 97}]
    },
    {
        "id": "types_index_js",
        "rel_path": "frontend/src/types/index.js",
        "title": "types/index.js",
        "category": "constants",
        "output": "docs/frontend/code/constants/types_index.js.png",
        "chunks": [{"name": "Frontend Data Models & Type Contracts", "start": 1, "end": 34}]
    },
    {
        "id": "utils_index_js",
        "rel_path": "frontend/src/utils/index.js",
        "title": "utils/index.js",
        "category": "utils",
        "output": "docs/frontend/code/utils/utils_index.js.png",
        "chunks": [{"name": "Formatting Helpers & Error Parsers", "start": 1, "end": 89}]
    }
]

def get_lexer(rel_path):
    if rel_path.endswith('.jsx') or rel_path.endswith('.js'):
        return JavascriptLexer()
    elif rel_path.endswith('.css'):
        return CssLexer()
    elif rel_path.endswith('.json'):
        return JsonLexer()
    elif rel_path.endswith('.html'):
        return HtmlLexer()
    return JavascriptLexer()

def generate_gallery_html():
    formatter = HtmlFormatter(style='dracula', nowrap=True)
    cards_html = []
    manifest = []

    for item in FILES_CONFIG:
        full_path = os.path.normpath(item["rel_path"])
        if not os.path.exists(full_path):
            print(f"Warning: file not found: {full_path}")
            continue

        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()

        lexer = get_lexer(item["rel_path"])

        for c_idx, chunk in enumerate(item["chunks"]):
            start_l = chunk["start"]
            end_l = min(chunk["end"], len(lines))
            chunk_lines = lines[start_l - 1 : end_l]
            code_text = "".join(chunk_lines)

            highlighted_code = pygments.highlight(code_text, lexer, formatter)

            nums_html = "".join([f"<span>{i}</span>" for i in range(start_l, end_l + 1)])

            card_id = f"snap_{item['id']}_{c_idx}"
            
            if len(item["chunks"]) == 1:
                target_img = item["output"]
            else:
                base, ext = os.path.splitext(item["output"])
                target_img = f"{base}{chunk.get('suffix', f'_p{c_idx+1}')}{ext}"

            manifest.append({
                "id": card_id,
                "target": target_img,
                "title": chunk["name"],
                "file": item["title"]
            })

            card = f"""
            <div class="snap-container" id="{card_id}">
              <div class="snap-window">
                <div class="window-header">
                  <div class="window-dots">
                    <span class="dot dot-red"></span>
                    <span class="dot dot-yellow"></span>
                    <span class="dot dot-green"></span>
                  </div>
                  <div class="window-title">{item['title']} &mdash; <span class="chunk-title">{chunk['name']}</span></div>
                  <div class="window-badge">FleetOps v1.0</div>
                </div>
                <div class="code-viewport">
                  <div class="line-gutter">{nums_html}</div>
                  <pre class="code-pre"><code>{highlighted_code}</code></pre>
                </div>
              </div>
            </div>
            """
            cards_html.append(card)

    pyg_css = formatter.get_style_defs('.code-pre')
    
    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>FleetOps CodeSnap Gallery</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

* {{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}}

body {{
  background: #0f1117;
  color: #f8f8f2;
  font-family: 'Inter', -apple-system, sans-serif;
  padding: 40px;
}}

.snap-container {{
  display: inline-block;
  margin-bottom: 60px;
  background: transparent;
  padding: 10px;
}}

.snap-window {{
  background: #1e1e2e;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08);
  overflow: hidden;
  min-width: 820px;
  max-width: 980px;
}}

.window-header {{
  background: #181825;
  border-bottom: 1px solid #2a2a3c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  user-select: none;
}}

.window-dots {{
  display: flex;
  gap: 8px;
}}

.dot {{
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}}

.dot-red {{ background: #ff5555; }}
.dot-yellow {{ background: #f1fa8c; }}
.dot-green {{ background: #50fa7b; }}

.window-title {{
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: #cdd6f4;
  letter-spacing: 0.2px;
}}

.chunk-title {{
  color: #89b4fa;
  font-weight: 400;
}}

.window-badge {{
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #a6adc8;
  background: #313244;
  padding: 2px 8px;
  border-radius: 6px;
}}

.code-viewport {{
  display: flex;
  background: #1e1e2e;
  padding: 14px 0 18px 0;
  overflow: hidden;
}}

.line-gutter {{
  display: flex;
  flex-direction: column;
  padding: 0 14px 0 16px;
  user-select: none;
  border-right: 1px solid #313244;
  text-align: right;
  min-width: 48px;
}}

.line-gutter span {{
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #6c7086;
}}

.code-pre {{
  flex: 1;
  padding: 0 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: hidden;
  white-space: pre;
  tab-size: 2;
}}

{pyg_css}
</style>
</head>
<body>
{"".join(cards_html)}
</body>
</html>
"""

    os.makedirs("scripts", exist_ok=True)
    with open("scripts/codesnap_gallery.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("scripts/codesnap_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Generated gallery with {len(manifest)} CodeSnap snippets.")

if __name__ == "__main__":
    generate_gallery_html()
