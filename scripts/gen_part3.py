# scripts/gen_part3.py
with open("scripts/build_full_doc.py", "a", encoding="utf-8") as f:
    f.write('''
# Page 19: Configuration & Constants/Types/Utils
PAGES.append(page_wrap(
  19,
  "FRONTEND DOCUMENTATION (REACTJS)",
  "CONFIGURATION, TYPES &amp; UTILITIES",
  "/package.json &bull; /constants/ &bull; /types/ &bull; /utils/",
  """
  <div class="purpose-text">
    <strong>Purpose:</strong> System dependencies in package.json (Vite, React 19, Axios, Leaflet, Recharts, Lucide), central enum constants (ROLES, ORDER_STATUSES, VEHICLE_STATUSES, DRIVER_AVAILABILITY), JSDoc type contracts, and shared utilities (date formatters, error parsers, and SLA helpers).
  </div>
  <div class="codesnap-box-dual">
    <div class="snap-item">
      <div class="item-caption">package.json &mdash; Production Dependencies &amp; Vite Scripts</div>
      <img src="code/config/package.json.png" alt="package.json" />
    </div>
    <div class="snap-item">
      <div class="item-caption">utils/index.js &mdash; Shared Utilities (getErrorMessage, formatDate, isSlaBreached)</div>
      <img src="code/utils/utils_index.js.png" alt="utils/index.js" />
    </div>
  </div>
  """
))

# Page 20: Application Execution — Terminal Output
PAGES.append(page_wrap(
  20,
  "TERMINAL OUTPUT",
  "APPLICATION RUNTIME EXECUTION &amp; TELEMETRY",
  "Vite Development Server (Port 5173) &bull; Spring Boot Tomcat Server (Port 8081)",
  """
  <div style="display: flex; flex-direction: column; gap: 12px; flex: 1;">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 4px;">
        1. Frontend Development Server (React / Vite)
      </div>
      <div class="terminal-window">
        <div class="term-header">
          <span class="term-dot" style="background:#ff5f56;"></span>
          <span class="term-dot" style="background:#ffbd2e;"></span>
          <span class="term-dot" style="background:#27c93f;"></span>
          <span class="term-title">PowerShell &mdash; frontend@0.0.0 dev (Vite Dev Server)</span>
        </div>
        <div class="term-body">PS E:\\Projects\\fleet and delivery tracking system\\frontend&gt; npm run dev

&gt; frontend@0.0.0 dev
&gt; vite

  <span style="color:#50fa7b;font-weight:bold;">VITE v8.2.2</span>  <span style="color:#8be9fd;">ready in 390 ms</span>

  <span style="color:#50fa7b;">&bull;</span>  <span style="font-weight:bold;">Local:</span>   <span style="color:#8be9fd;text-decoration:underline;">http://localhost:5173/</span>
  <span style="color:#50fa7b;">&bull;</span>  <span style="font-weight:bold;">Network:</span> use --host to expose
  <span style="color:#50fa7b;">&bull;</span>  <span style="font-weight:bold;">Proxy:</span>   /api &rarr; <span style="color:#f1fa8c;">http://localhost:8081</span> [active]</div>
      </div>
    </div>

    <div>
      <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 4px;">
        2. Backend Application Server (Spring Boot 4.1.0 / Embedded Tomcat)
      </div>
      <div class="terminal-window">
        <div class="term-header">
          <span class="term-dot" style="background:#ff5f56;"></span>
          <span class="term-dot" style="background:#ffbd2e;"></span>
          <span class="term-dot" style="background:#27c93f;"></span>
          <span class="term-title">PowerShell &mdash; Spring Boot 4.1.0 Embedded Tomcat Server (Port 8081)</span>
        </div>
        <div class="term-body">PS E:\\Projects\\fleet and delivery tracking system\\backend&gt; java -jar target\\fleettracking-0.0.1-SNAPSHOT.jar

  .   ____          _            __ _ _
 /\\\\ / ___&#39;_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
( ( )\\___ | &#39;_ | &#39;_| | &#39;_ \\/ _` | \\ \\ \\ \\
 \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  &#39;  |____| .__|_| |_|_| |_\\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 <span style="color:#50fa7b;">:: Spring Boot ::</span>                <span style="color:#8be9fd;">(v4.1.0)</span>

2026-09-10T00:13:35.353+05:30  INFO 27332 --- [fleettracking] [main] o.a.c.c.StandardService: Starting service [Tomcat]
2026-09-10T00:13:35.353+05:30  INFO 27332 --- [fleettracking] [main] o.a.c.c.StandardEngine : Starting Servlet engine: [Apache Tomcat/11.0.22]
2026-09-10T00:13:37.376+05:30  INFO 27332 --- [fleettracking] [main] c.z.h.HikariDataSource : HikariPool-1 - Starting...
2026-09-10T00:13:37.892+05:30  INFO 27332 --- [fleettracking] [main] c.z.h.HikariDataSource : HikariPool-1 - Added connection conn0: url=jdbc:mysql://localhost:3306/fdts
2026-09-10T00:13:40.619+05:30  INFO 27332 --- [fleettracking] [main] j.LocalContainerEntityManagerFactoryBean: Initialized JPA EntityManagerFactory
2026-09-10T00:13:42.225+05:30  INFO 27332 --- [fleettracking] [main] o.s.b.w.e.t.TomcatWebServer: Tomcat started on port 8081 (http) with context path &#39;&#39;
2026-09-10T00:13:42.254+05:30  INFO 27332 --- [fleettracking] [main] c.f.FleetTrackingApplication: Started FleetTrackingApplication in 8.64 seconds (process running for 9.81)</div>
      </div>
    </div>
  </div>
  """
))

# Page 21: UI Output — Login & Authentication
PAGES.append(page_wrap(
  21,
  "UI OUTPUT",
  "LOGIN &amp; AUTHENTICATION WORKFLOW",
  "Sign In &bull; Credentials Verification &bull; Account Registration &bull; Session Persistence",
  """
  <div class="ui-step-grid">
    <div class="ui-step-card">
      <span class="step-badge">Step 1 &mdash; Initial State</span>
      <div class="step-title">Login Landing View</div>
      <div class="step-desc">The authentication card displays the FleetOps branding, mobile input field, masked OTP input, and navigation tabs between Sign In and Register.</div>
      <div class="step-img-wrap"><img src="ui/login/01_login_initial.png" alt="Login Initial" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 2 &mdash; User Action</span>
      <div class="step-title">Credentials Entry</div>
      <div class="step-desc">The user enters their registered mobile number (9876543210) and one-time password with interactive visibility toggle control.</div>
      <div class="step-img-wrap"><img src="ui/login/02_login_credentials_entered.png" alt="Credentials Entered" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 3 &mdash; Alternate Action</span>
      <div class="step-title">Account Registration Tab</div>
      <div class="step-desc">Allows onboarding new staff, configuring full name, 10-digit mobile number, and role assignment (ADMIN, DISPATCHER, DRIVER, CUSTOMER).</div>
      <div class="step-img-wrap"><img src="ui/login/03_register_tab.png" alt="Registration Tab" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 4 &mdash; Authentication Result</span>
      <div class="step-title">Authorized Session Redirect</div>
      <div class="step-desc">On token receipt, AuthContext stores credentials in localStorage and immediately navigates the authenticated user into the Dispatcher Dashboard.</div>
      <div class="step-img-wrap"><img src="ui/login/04_authenticated_redirect.png" alt="Authenticated Redirect" /></div>
    </div>
  </div>
  """
))

# Page 22: UI Output — Dispatcher Dashboard
PAGES.append(page_wrap(
  22,
  "UI OUTPUT",
  "DISPATCHER DASHBOARD &bull; REAL-TIME PLATFORM OVERVIEW",
  "/dashboard &bull; Executive KPIs &bull; Fleet Distribution &bull; SLA Alerts &bull; Recent Orders",
  """
  <div class="dual-ui-card">
    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        1. Operational KPI Metric Cards &amp; Live Status Header
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Presents live system metrics queried from backend: Total Vehicles (4 total, 3 active), Available Drivers (2 registered), Active Orders (2), SLA Breaches (1), and active on-route couriers.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/dashboard/01_dashboard_overview.png" alt="Dashboard Overview" />
      </div>
    </div>

    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        2. Fleet Status Breakdown, Driver Availability &amp; SLA Alerts Stream
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Displays categorical distribution widgets for vehicles (Active, Inactive, Maintenance), driver duty states (On Duty, Break, Off Duty), and real-time SLA breach notices.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/dashboard/02_dashboard_fleet_charts.png" alt="Dashboard Fleet Charts" />
      </div>
    </div>
  </div>
  """
))

# Page 23: UI Output — Fleet / Vehicles Management
PAGES.append(page_wrap(
  23,
  "UI OUTPUT",
  "FLEET &amp; VEHICLES MANAGEMENT WORKFLOW",
  "/vehicles &bull; Vehicle Inventory &bull; Status Filtering &bull; Vehicle Registration Modal",
  """
  <div class="ui-step-grid">
    <div class="ui-step-card">
      <span class="step-badge">Step 1 &mdash; Starting State</span>
      <div class="step-title">Fleet Directory Table</div>
      <div class="step-desc">Displays comprehensive inventory of fleet vehicles with registration number, category type, payload capacity (kg), fuel type, and operational status badge.</div>
      <div class="step-img-wrap"><img src="ui/fleet/01_vehicles_list.png" alt="Vehicles List" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 2 &mdash; User Action</span>
      <div class="step-title">Filter by Active Status</div>
      <div class="step-desc">Filtering by 'ACTIVE' instantly queries the Spring Boot backend (/api/v1/vehicles?status=ACTIVE), isolating roadworthy vehicles ready for delivery dispatch.</div>
      <div class="step-img-wrap"><img src="ui/fleet/02_vehicles_filter_active.png" alt="Filter Active" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 3 &mdash; Creation Modal</span>
      <div class="step-title">Add Vehicle Dialog</div>
      <div class="step-desc">Opening the vehicle creation modal allows the dispatcher to register registration plate (e.g. KA-05-EV-4412), vehicle model, fuel type, and payload capacity.</div>
      <div class="step-img-wrap"><img src="ui/fleet/03_add_vehicle_modal.png" alt="Add Vehicle Modal" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 4 &mdash; Persisted State</span>
      <div class="step-title">Updated Fleet Table</div>
      <div class="step-desc">Following submission, the table refreshes displaying the newly registered vehicle with immediate status modification and decommissioning action triggers.</div>
      <div class="step-img-wrap"><img src="ui/fleet/04_vehicle_created_success.png" alt="Vehicle Created Success" /></div>
    </div>
  </div>
  """
))

# Page 24: MySQL Output — Vehicles & Users Database Verification
PAGES.append(page_wrap(
  24,
  "DATABASE VERIFICATION (MYSQL EVIDENCE)",
  "MYSQL OUTPUT OF VEHICLES &amp; USERS / ROLES TABLES",
  "Direct relational database verification of persisted frontend entities &bull; Database: fdts",
  """
  <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 3px;">
        1. Vehicles Table (Actual MySQL Database Records)
      </div>
      <div class="mysql-card">
        <div class="mysql-query">SELECT id, reg_number, type, capacity_kg, fuel_type, status FROM vehicles;</div>
        <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; Filter Rows: [ &nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [&check;] Export: CSV/SQL</div>
        <table class="mysql-table">
          <thead>
            <tr><th>#</th><th>id</th><th>reg_number</th><th>type</th><th>capacity_kg</th><th>fuel_type</th><th>status</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>1</td><td class="font-mono">KA01AB1234</td><td>TRUCK</td><td>1000.00</td><td>DIESEL</td><td><strong style="color:#10b981;">ACTIVE</strong></td></tr>
            <tr><td>2</td><td>3</td><td class="font-mono">KA01AB5678</td><td>TRUCK</td><td>2000.00</td><td>DIESEL</td><td><strong style="color:#10b981;">ACTIVE</strong></td></tr>
            <tr><td>3</td><td>4</td><td class="font-mono">TN38AB1234</td><td>TRUCK</td><td>1500.00</td><td>DIESEL</td><td><strong style="color:#10b981;">ACTIVE</strong></td></tr>
            <tr><td>4</td><td>5</td><td class="font-mono">KA05XY9999</td><td>BIKE</td><td>500.00</td><td>PETROL</td><td><strong style="color:#64748b;">INACTIVE</strong></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 3px;">
        2. Users &amp; Roles Table (Actual Authenticated Accounts)
      </div>
      <div class="mysql-card">
        <div class="mysql-query">SELECT u.id, u.mobile, r.name AS role, u.is_active, u.created_at FROM users u JOIN roles r ON u.role_id = r.id;</div>
        <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; Filter Rows: [ &nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [&check;] Export: CSV/SQL</div>
        <table class="mysql-table">
          <thead>
            <tr><th>#</th><th>id</th><th>mobile</th><th>role</th><th>is_active</th><th>created_at</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>1</td><td class="font-mono">9876543210</td><td><strong style="color:#3b82f6;">ADMIN</strong></td><td>1</td><td>2026-08-09 23:07:18</td></tr>
            <tr><td>2</td><td>2</td><td class="font-mono">9876543211</td><td><strong style="color:#8b5cf6;">DRIVER</strong></td><td>1</td><td>2026-08-09 23:17:05</td></tr>
            <tr><td>3</td><td>3</td><td class="font-mono">9876543280</td><td><strong style="color:#10b981;">CUSTOMER</strong></td><td>1</td><td>2026-08-10 00:45:59</td></tr>
            <tr><td>4</td><td>4</td><td class="font-mono">7904009736</td><td><strong style="color:#10b981;">CUSTOMER</strong></td><td>1</td><td>2026-08-10 10:01:24</td></tr>
            <tr><td>5</td><td>9</td><td class="font-mono">7904009746</td><td><strong style="color:#3b82f6;">ADMIN</strong></td><td>1</td><td>2026-08-10 12:41:32</td></tr>
            <tr><td>6</td><td>10</td><td class="font-mono">9876543212</td><td><strong style="color:#8b5cf6;">DRIVER</strong></td><td>1</td><td>2026-08-10 12:45:06</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  """
))

# Page 25: UI Output — Drivers Directory
PAGES.append(page_wrap(
  25,
  "UI OUTPUT",
  "DRIVERS DIRECTORY &amp; AVAILABILITY WORKFLOW",
  "/drivers &bull; Personnel Roster &bull; Availability State Machine &bull; Driver Registration",
  """
  <div class="ui-step-grid">
    <div class="ui-step-card">
      <span class="step-badge">Step 1 &mdash; Starting State</span>
      <div class="step-title">Driver Directory Roster</div>
      <div class="step-desc">Displays registered drivers, verified commercial driving license numbers, primary contact numbers, and real-time operational availability badges.</div>
      <div class="step-img-wrap"><img src="ui/drivers/01_drivers_directory.png" alt="Drivers Directory" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 2 &mdash; User Action</span>
      <div class="step-title">Availability Filter Applied</div>
      <div class="step-desc">Filters driver roster by status (e.g., 'ON_DUTY'), instantly highlighting active couriers ready to receive assigned delivery consignments.</div>
      <div class="step-img-wrap"><img src="ui/drivers/02_drivers_filter_available.png" alt="Filter Available" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 3 &mdash; Onboarding Modal</span>
      <div class="step-title">Add Driver Dialog</div>
      <div class="step-desc">Enables enrolling new courier drivers, inputting full name, valid mobile number, commercial driving license number, and license expiration date.</div>
      <div class="step-img-wrap"><img src="ui/drivers/03_add_driver_modal.png" alt="Add Driver Modal" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 4 &mdash; Transition Result</span>
      <div class="step-title">Updated Duty Status</div>
      <div class="step-desc">Allows dispatchers to transition driver availability between AVAILABLE, ON_DUTY, BREAK, and OFF_DUTY via inline status action triggers.</div>
      <div class="step-img-wrap"><img src="ui/drivers/04_driver_availability_updated.png" alt="Availability Updated" /></div>
    </div>
  </div>
  """
))

# Page 26: MySQL Output — Drivers Database Verification
PAGES.append(page_wrap(
  26,
  "DATABASE VERIFICATION (MYSQL EVIDENCE)",
  "MYSQL OUTPUT OF DRIVERS &amp; MAPPINGS TABLES",
  "Direct database verification of driver records and vehicle associations &bull; Database: fdts",
  """
  <div style="display: flex; flex-direction: column; gap: 12px; flex: 1;">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 3px;">
        1. Drivers Table (Actual Verified Database Records)
      </div>
      <div class="mysql-card">
        <div class="mysql-query">SELECT id, user_id, name, mobile, license_number, availability, is_suspended FROM drivers;</div>
        <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; Filter Rows: [ &nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [&check;] Export: CSV/SQL</div>
        <table class="mysql-table">
          <thead>
            <tr><th>#</th><th>id</th><th>user_id</th><th>name</th><th>mobile</th><th>license_number</th><th>availability</th><th>is_suspended</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>1</td><td>2</td><td>Driver One</td><td class="font-mono">9876543211</td><td class="font-mono">DL-1420110012345</td><td><strong style="color:#f59e0b;">BREAK</strong></td><td>0</td></tr>
            <tr><td>2</td><td>2</td><td>10</td><td>Arun Kumar</td><td class="font-mono">9876543212</td><td class="font-mono">TN0120260001234</td><td><strong style="color:#3b82f6;">ON_DUTY</strong></td><td>0</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 14px; margin-top: 10px;">
      <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 6px;">
        Driver-Vehicle Mapping Architecture &amp; Lifecycle Constraints
      </div>
      <div style="font-size: 9.5px; color: #334155; line-height: 1.55;">
        The system enforces strict operational integrity through the <code>driver_vehicle_mapping</code> table. A driver can only be associated with one active vehicle at a given time. Availability state transitions are tracked via REST calls to <code>PATCH /api/v1/drivers/{id}/availability</code>. When a driver shifts to <code>OFF_DUTY</code> or <code>BREAK</code>, the dispatch engine excludes them from automated assignment queues.
      </div>
    </div>
  </div>
  """
))

print("Part 3 appended successfully.")
''')
