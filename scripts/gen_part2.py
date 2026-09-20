# scripts/gen_part2.py
with open("scripts/build_full_doc.py", "a", encoding="utf-8") as f:
    f.write('''
# Page 9: Components — LoadingSkeleton, EmptyState, ErrorState
PAGES.append(page_wrap(
  9,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "REUSABLE COMPONENTS &bull; FEEDBACK &amp; UI STATES",
  "/components/common/LoadingSkeleton.jsx &bull; EmptyState.jsx &bull; ErrorState.jsx",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> LoadingSkeleton renders an animated pulsing shimmer effect matching table rows and cards during async network fetches. EmptyState displays a clean illustration when lists contain 0 items. ErrorState renders standardized error messages with a retry callback.
  </div>
  <div class="codesnap-box-triple">
    <div class="snap-item">
      <div class="item-caption">LoadingSkeleton.jsx &mdash; Content Shimmer Placeholder</div>
      <img src="code/components/common/LoadingSkeleton.jsx.png" alt="LoadingSkeleton.jsx" />
    </div>
    <div class="snap-item">
      <div class="item-caption">EmptyState.jsx &mdash; Zero-Data Informational Display</div>
      <img src="code/components/common/EmptyState.jsx.png" alt="EmptyState.jsx" />
    </div>
    <div class="snap-item">
      <div class="item-caption">ErrorState.jsx &mdash; API Error Banner with Retry Trigger</div>
      <img src="code/components/common/ErrorState.jsx.png" alt="ErrorState.jsx" />
    </div>
  </div>
  """
))

# Page 10: Authentication & Authorization — AuthContext.jsx
PAGES.append(page_wrap(
  10,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "AUTHENTICATION &amp; AUTHORIZATION &bull; SESSION CONTEXT",
  "/auth/AuthContext.jsx",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Manages global user authentication state, JWT storage, role verification, and session persistence across page refreshes. Stores accessToken, refreshToken, role, and expiresIn in localStorage. Exposes useAuth() hook providing user, isAuthenticated, login(), register(), logout(), and hasRole() helpers.
  </div>
  <div class="codesnap-box">
    <img src="code/auth/AuthContext.jsx.png" alt="AuthContext.jsx" />
  </div>
  """
))

# Page 11: Authentication & Authorization — ProtectedRoute.jsx & RoleGuard.jsx
PAGES.append(page_wrap(
  11,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "AUTHENTICATION &amp; AUTHORIZATION &bull; ROUTE GUARDS &amp; RBAC",
  "/auth/ProtectedRoute.jsx &bull; /auth/RoleGuard.jsx",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> ProtectedRoute intercepts unauthenticated navigation requests and redirects to /login preserving the requested return URL in location state. RoleGuard restricts authorized routes to specific allowed roles (ADMIN, DISPATCHER, DRIVER, CUSTOMER), rendering an access denied notice if unauthorized.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">ProtectedRoute.jsx &mdash; Authentication Session Validator &amp; Redirect Guard</div>
      <img src="code/auth/ProtectedRoute.jsx.png" alt="ProtectedRoute.jsx" />
    </div>
    <div class="snap-item">
      <div class="item-caption">RoleGuard.jsx &mdash; Role-Based Access Control (RBAC) Privilege Barrier</div>
      <img src="code/auth/RoleGuard.jsx.png" alt="RoleGuard.jsx" />
    </div>
  </div>
  """
))

# Page 12: API Service Layer — axios.js & authApi.js
PAGES.append(page_wrap(
  12,
  "INTEGRATION DOCUMENTATION (REACT + SPRING BOOT + MYSQL)",
  "API SERVICE LAYER &bull; AXIOS HTTP CLIENT &amp; AUTH ENDPOINTS",
  "/api/axios.js &bull; /api/authApi.js",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Configures the centralized Axios client instance pointing to baseURL: '/api' (proxied by Vite to http://localhost:8081). Implements request interceptor automatically attaching the Bearer JWT token from localStorage to outgoing headers, and response error handling redirecting on 401 Unauthorized.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">axios.js &mdash; Axios Instance Configuration &amp; JWT Authorization Interceptor</div>
      <img src="code/api/axios.js.png" alt="axios.js" />
    </div>
    <div class="snap-item">
      <div class="item-caption">authApi.js &mdash; Authentication Endpoints (POST /api/v1/auth/login &amp; register)</div>
      <img src="code/api/authApi.js.png" alt="authApi.js" />
    </div>
  </div>
  """
))

# Page 13: API Service Layer — vehicleApi.js & driverApi.js
PAGES.append(page_wrap(
  13,
  "INTEGRATION DOCUMENTATION (REACT + SPRING BOOT + MYSQL)",
  "API SERVICE LAYER &bull; VEHICLES &amp; DRIVERS REST SERVICES",
  "/api/vehicleApi.js &bull; /api/driverApi.js",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Frontend REST client bindings for fleet vehicle and driver resource management. Maps directly to Spring Boot backend controllers: POST /api/v1/vehicles, GET /api/v1/vehicles (paginated with status filter), PUT /api/v1/vehicles/{id}, POST /api/v1/drivers, and PATCH /api/v1/drivers/{id}/availability.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">vehicleApi.js &mdash; Vehicle CRUD &amp; Operational Status Service Layer</div>
      <img src="code/api/vehicleApi.js.png" alt="vehicleApi.js" />
    </div>
    <div class="snap-item">
      <div class="item-caption">driverApi.js &mdash; Driver Directory &amp; Availability Transition Service Layer</div>
      <img src="code/api/driverApi.js.png" alt="driverApi.js" />
    </div>
  </div>
  """
))

# Page 14: API Service Layer — orderApi.js & trackingApi.js
PAGES.append(page_wrap(
  14,
  "INTEGRATION DOCUMENTATION (REACT + SPRING BOOT + MYSQL)",
  "API SERVICE LAYER &bull; ORDERS &amp; GPS TRACKING SERVICES",
  "/api/orderApi.js &bull; /api/trackingApi.js",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Client service modules for order lifecycle transitions and GPS location tracking telemetry. Supports creating delivery orders, listing orders with status filter, assigning drivers &amp; vehicles (POST /orders/{id}/assign), transitioning status (PATCH /orders/{id}/status), and streaming driver locations.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">orderApi.js &mdash; Order Lifecycle, Assignment &amp; Tracking Lookup Services</div>
      <img src="code/api/orderApi.js.png" alt="orderApi.js" />
    </div>
    <div class="snap-item">
      <div class="item-caption">trackingApi.js &mdash; GPS Coordinate Ingestion &amp; Location History Services</div>
      <img src="code/api/trackingApi.js.png" alt="trackingApi.js" />
    </div>
  </div>
  """
))

# Page 15: Application Routing & Shell — App.jsx
PAGES.append(page_wrap(
  15,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "APPLICATION ROUTING &amp; SHELL LAYOUT",
  "/App.jsx (Part 1 &amp; Part 2)",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Root routing component utilizing React Router v7. Declares the authenticated AppShell wrapping TopNavbar and Sidebar, configures global toast notifications, sets up role-aware redirection (CUSTOMER and DRIVER redirect to /orders), and maps all protected module routes.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">App.jsx &mdash; Part 1: Shell Layout Component, Toast Provider &amp; Dashboard Route Guard</div>
      <img src="code/core/App.jsx_p1.png" alt="App.jsx Part 1" />
    </div>
    <div class="snap-item">
      <div class="item-caption">App.jsx &mdash; Part 2: Module Routes (Vehicles, Drivers, Orders, Dispatch, Tracking, Admin)</div>
      <img src="code/core/App.jsx_p2.png" alt="App.jsx Part 2" />
    </div>
  </div>
  """
))

# Page 16: Theme & Styling — index.css (Part 1 & Part 2)
PAGES.append(page_wrap(
  16,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "THEME &amp; DESIGN SYSTEM &bull; DESIGN TOKENS &amp; TABLES",
  "/index.css (Part 1 &amp; Part 2)",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Global stylesheet establishing the dark theme design system. Declares CSS variables for semantic status colors (--accent-blue, --accent-green, --accent-amber, --accent-red), dark background shades (--bg-primary: #0f1117, --bg-secondary: #161b26), card borders, typography, and responsive data tables.
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">index.css &mdash; Part 1: Design Tokens, CSS Color Variables, Fonts &amp; Base Element Resets</div>
      <img src="code/styles/index.css_p1.png" alt="index.css Part 1" />
    </div>
    <div class="snap-item">
      <div class="item-caption">index.css &mdash; Part 2: Cards, Data Tables, Form Controls &amp; Modal Overlays</div>
      <img src="code/styles/index.css_p2.png" alt="index.css Part 2" />
    </div>
  </div>
  """
))

# Page 17: Theme & Styling — index.css (Part 3) & App.css
PAGES.append(page_wrap(
  17,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "THEME &amp; LAYOUT &bull; UTILITIES &amp; SHELL CONTAINER",
  "/index.css (Part 3) &bull; /App.css (Part 1 &amp; Part 2)",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> Provides status badges, buttons, spin animations, and responsive application grid layout in App.css. Enforces desktop dual-pane grid layout (.app-layout) with fixed sidebar and scrolling main content, adapting to full-width mobile viewports with drawer transitions.
  </div>
  <div class="codesnap-box-triple">
    <div class="snap-item">
      <div class="item-caption">index.css &mdash; Part 3: Status Badges, Spinners &amp; Utility Classes</div>
      <img src="code/styles/index.css_p3.png" alt="index.css Part 3" />
    </div>
    <div class="snap-item">
      <div class="item-caption">App.css &mdash; Part 1: Application Layout Grid &amp; Sidebar Transitions</div>
      <img src="code/styles/App.css_p1.png" alt="App.css Part 1" />
    </div>
    <div class="snap-item">
      <div class="item-caption">App.css &mdash; Part 2: Main Content Viewport &amp; Responsive Breakpoints</div>
      <img src="code/styles/App.css_p2.png" alt="App.css Part 2" />
    </div>
  </div>
  """
))

# Page 18: Entry Point & Configuration — main.jsx, index.html & vite.config.js
PAGES.append(page_wrap(
  18,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "ENTRY POINT &amp; HOST &bull; REACT 19 &amp; VITE PROXY",
  "/main.jsx &bull; /index.html &bull; /vite.config.js",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> main.jsx boots the React 19 application tree inside StrictMode onto the DOM root container. index.html provides the HTML5 viewport and metadata host. vite.config.js configures the development server on port 5173 with automatic reverse proxy forwarding /api calls to http://localhost:8081.
  </div>
  <div class="codesnap-box-triple">
    <div class="snap-item">
      <div class="item-caption">main.jsx &mdash; React 19 StrictMode Client Root Mount</div>
      <img src="code/core/main.jsx.png" alt="main.jsx" />
    </div>
    <div class="snap-item">
      <div class="item-caption">index.html &mdash; HTML5 Single Page Application Container</div>
      <img src="code/config/index.html.png" alt="index.html" />
    </div>
    <div class="snap-item">
      <div class="item-caption">vite.config.js &mdash; Vite Bundler &amp; Backend Reverse Proxy (Port 5173 &rarr; 8081)</div>
      <img src="code/config/vite.config.js.png" alt="vite.config.js" />
    </div>
  </div>
  """
))

print("Part 2 appended successfully.")
''')
