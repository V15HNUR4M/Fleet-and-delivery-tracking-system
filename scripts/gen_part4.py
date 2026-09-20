# scripts/gen_part4.py
with open("scripts/build_full_doc.py", "a", encoding="utf-8") as f:
    f.write('''
# Page 27: UI Output — Orders Management
PAGES.append(page_wrap(
  27,
  "UI OUTPUT",
  "ORDERS MANAGEMENT &bull; CREATION &amp; STATUS FILTERING",
  "/orders &bull; Delivery Queue &bull; Status Tab Filters &bull; Order Placement Dialog",
  """
  <div class="ui-step-grid">
    <div class="ui-step-card">
      <span class="step-badge">Step 1 &mdash; Starting State</span>
      <div class="step-title">Orders Management View</div>
      <div class="step-desc">Displays active order queue with reference number, customer identifier, pickup address, delivery address, package weight, and SLA deadline counter.</div>
      <div class="step-img-wrap"><img src="ui/orders/01_orders_table_view.png" alt="Orders Table View" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 2 &mdash; User Action</span>
      <div class="step-title">Filter by Assigned Status</div>
      <div class="step-desc">Filtering by 'ASSIGNED' filters active consignments currently assigned to couriers, displaying real-time SLA countdown timers and tracking shortcuts.</div>
      <div class="step-img-wrap"><img src="ui/orders/02_orders_status_filter.png" alt="Orders Status Filter" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 3 &mdash; Order Creation</span>
      <div class="step-title">New Order Modal Dialog</div>
      <div class="step-desc">Dispatchers or customers enter pickup origin, delivery destination, parcel weight (kg), cash-on-delivery (COD) collection amount, and required delivery SLA.</div>
      <div class="step-img-wrap"><img src="ui/orders/03_create_order_modal.png" alt="Create Order Modal" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 4 &mdash; Persisted State</span>
      <div class="step-title">New Order Registered</div>
      <div class="step-desc">The newly created order is persisted to the MySQL database with status 'CREATED' and queued immediately for automated or manual fleet assignment.</div>
      <div class="step-img-wrap"><img src="ui/orders/04_order_created_success.png" alt="Order Created Success" /></div>
    </div>
  </div>
  """
))

# Page 28: UI Output — Order Details & Lifecycle Timeline
PAGES.append(page_wrap(
  28,
  "UI OUTPUT",
  "ORDER DETAIL VIEW &bull; AUDIT TRAIL &amp; LIFECYCLE TIMELINE",
  "/orders/:id &bull; Order Specifications &bull; Route Details &bull; Assigned Courier &bull; Status Stepper",
  """
  <div class="dual-ui-card">
    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        1. Order Metadata, Specifications &amp; Assigned Courier Card
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Presents detailed specifications for Order ORD-737598: Weight 500.00 kg, COD Amount &#8377;1,200, Assigned Driver #1, Assigned Vehicle #1, Pickup (MG Road, Bengaluru) and Delivery destination.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/orders/05_order_detail_view.png" alt="Order Detail View" />
      </div>
    </div>

    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        2. Status Lifecycle Audit Trail &amp; Courier Action Triggers
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Shows the historical audit trail (ASSIGNED &rarr; PICKED UP &rarr; IN TRANSIT &rarr; DELIVERED) with timestamps, dispatcher comments, and action buttons for courier transit updates.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/orders/06_order_lifecycle_timeline.png" alt="Order Timeline View" />
      </div>
    </div>
  </div>
  """
))

# Page 29: MySQL Output — Orders Database Verification
PAGES.append(page_wrap(
  29,
  "DATABASE VERIFICATION (MYSQL EVIDENCE)",
  "MYSQL OUTPUT OF ORDERS &amp; STATUS HISTORY TABLES",
  "Relational database verification of delivery orders and audit trails &bull; Database: fdts",
  """
  <div style="display: flex; flex-direction: column; gap: 12px; flex: 1;">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 3px;">
        1. Orders Table (Actual Verified Database Records)
      </div>
      <div class="mysql-card">
        <div class="mysql-query">SELECT id, order_ref, status, weight_kg, cod_amount, driver_id, vehicle_id FROM orders;</div>
        <div class="mysql-toolbar">Result Grid &nbsp;|&nbsp; Filter Rows: [ &nbsp; ] &nbsp;|&nbsp; Wrap Cell Content: [&check;] Export: CSV/SQL</div>
        <table class="mysql-table">
          <thead>
            <tr><th>#</th><th>id</th><th>order_ref</th><th>status</th><th>weight_kg</th><th>cod_amount</th><th>driver_id</th><th>vehicle_id</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>1</td><td class="font-mono">ORD-737598</td><td><strong style="color:#3b82f6;">ASSIGNED</strong></td><td>500.00</td><td>1200.00</td><td>1</td><td>1</td></tr>
            <tr><td>2</td><td>2</td><td class="font-mono">ORD-472770</td><td><strong style="color:#8b5cf6;">PICKED_UP</strong></td><td>250.50</td><td>1499.00</td><td>2</td><td>1</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <div style="font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin-bottom: 3px;">
        2. Order Status Lifecycle State Machine
      </div>
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px;">
        <div style="font-size: 9.5px; color: #334155; line-height: 1.6;">
          Orders transition through an immutable finite state machine validated both client-side and server-side:
          <br/>
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600; color: #0f172a;">
            CREATED &rarr; ASSIGNED &rarr; PICKED_UP &rarr; IN_TRANSIT &rarr; [DELIVERED | FAILED | RE_ATTEMPT | RTO | CANCELLED]
          </span>
          <br/>
          Every state transition writes an immutable audit record to <code>order_status_history</code> recording the previous status, new status, modifier user ID, and timestamp.
        </div>
      </div>
    </div>
  </div>
  """
))

# Page 30: UI Output — Dispatch Console
PAGES.append(page_wrap(
  30,
  "UI OUTPUT",
  "DISPATCH CONSOLE &bull; INTELLIGENT ROUTE ASSIGNMENT",
  "/dispatch &bull; Unassigned Orders Queue &bull; Driver Matching &bull; Vehicle Allocation",
  """
  <div class="ui-step-grid">
    <div class="ui-step-card">
      <span class="step-badge">Step 1 &mdash; Starting State</span>
      <div class="step-title">Dispatch Queue View</div>
      <div class="step-desc">The central dispatch workspace displays the queue of unassigned consignments awaiting fleet allocation alongside available drivers and vehicles.</div>
      <div class="step-img-wrap"><img src="ui/dispatch/01_dispatch_console.png" alt="Dispatch Console" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 2 &mdash; Selection</span>
      <div class="step-title">Select Pending Order</div>
      <div class="step-desc">Selecting an order highlights parcel weight, destination hub, and required delivery window to compute vehicle payload compatibility.</div>
      <div class="step-img-wrap"><img src="ui/dispatch/02_select_pending_order.png" alt="Select Order" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 3 &mdash; Allocation</span>
      <div class="step-title">Assign Driver &amp; Vehicle</div>
      <div class="step-desc">The dispatcher matches an available on-duty driver with an active vehicle meeting payload constraints and clicks the Dispatch Assignment button.</div>
      <div class="step-img-wrap"><img src="ui/dispatch/03_assign_driver_vehicle.png" alt="Assign Driver & Vehicle" /></div>
    </div>

    <div class="ui-step-card">
      <span class="step-badge">Step 4 &mdash; Assignment Result</span>
      <div class="step-title">Assignment Persisted</div>
      <div class="step-desc">POST /api/v1/orders/{id}/assign updates the order to ASSIGNED, transitions driver and vehicle states, and updates real-time queues.</div>
      <div class="step-img-wrap"><img src="ui/dispatch/04_dispatch_success_state.png" alt="Dispatch Success State" /></div>
    </div>
  </div>
  """
))

# Page 31: UI Output — Live GPS Tracking
PAGES.append(page_wrap(
  31,
  "UI OUTPUT",
  "REAL-TIME GPS TRACKING &bull; LEAFLET GIS MAPPING",
  "/tracking &bull; Interactive OpenStreetMap &bull; Driver Selector &bull; Telemetry HUD",
  """
  <div class="dual-ui-card">
    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        1. Leaflet Interactive Cartographic View &bull; Active Driver Fleet
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Integrates React-Leaflet with OpenStreetMap tiles displaying regional road networks, distribution centers, and active courier location pins.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/tracking/01_live_tracking_map.png" alt="Live Tracking Map" />
      </div>
    </div>

    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        2. Driver Telemetry HUD &bull; Real-Time Coordinates &amp; Status
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Selecting an active courier streams telemetry data (Latitude, Longitude, Heading, Speed) and plots historical trip breadcrumbs on the map.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/tracking/02_driver_telemetry_hud.png" alt="Driver Telemetry HUD" />
      </div>
    </div>
  </div>
  """
))

# Page 32: UI Output — Location History Breadcrumbs
PAGES.append(page_wrap(
  32,
  "UI OUTPUT",
  "TELEMETRY HISTORY &bull; BREADCRUMB ROUTE AUDIT",
  "/tracking &bull; Date Range Filter &bull; GPS Coordinate Log &bull; Route Polyline",
  """
  <div class="full-ui-card">
    <div style="font-size: 10.5px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">
      Recorded Location Breadcrumb Trail &amp; Coordinate Stream History
    </div>
    <div style="font-size: 9px; color: #475569; margin-bottom: 8px;">
      Queries <code>GET /api/v1/drivers/{id}/locations?from=&amp;to=</code> across a selectable date range. Renders polyline trajectory trails connecting chronological waypoints alongside a tabular audit of timestamped GPS coordinates, altitude, and instantaneous speed readings.
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:6px; overflow:hidden;">
      <img src="ui/tracking/03_route_location_history.png" alt="Location Breadcrumbs History" />
    </div>
  </div>
  """
))

# Page 33: UI Output — Performance & Fleet Analytics
PAGES.append(page_wrap(
  33,
  "UI OUTPUT",
  "OPERATIONAL ANALYTICS &bull; FLEET PERFORMANCE METRICS",
  "/analytics &bull; On-Time Delivery KPIs &bull; Fleet Utilization &bull; COD Volume",
  """
  <div class="dual-ui-card">
    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        1. Executive Operational KPI Cards &bull; Delivery Metrics
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Presents structure for On-Time Delivery Rate, Average Turnaround Time (TAT), First-Attempt Success Rate, and SLA Breach Frequency (clearly marked "Backend integration pending").
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/analytics/01_executive_kpis.png" alt="Analytics KPIs" />
      </div>
    </div>

    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        2. Fleet Utilization Breakdown &amp; Cash-On-Delivery Summary
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Displays analytical frameworks for active vehicle utilization rates, maintenance downtimes, and reconciled COD monetary flows across geographical sectors.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/analytics/02_fleet_delivery_charts.png" alt="Fleet Delivery Charts" />
      </div>
    </div>
  </div>
  """
))

# Page 34: UI Output — Admin Console & Security Settings
PAGES.append(page_wrap(
  34,
  "UI OUTPUT",
  "ADMINISTRATION CONSOLE &bull; SYSTEM TELEMETRY &amp; RBAC",
  "/admin &bull; System Health &bull; JWT Security Status &bull; Role Privileges Matrix",
  """
  <div class="dual-ui-card">
    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        1. System Environment Telemetry &amp; Security Configurations
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Verifies active backend URL (http://localhost:8081), REST API version (v1), current session role, active JWT authentication status, and stateless session enforcement.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/admin/01_admin_system_overview.png" alt="Admin System Overview" />
      </div>
    </div>

    <div class="dual-ui-item">
      <div style="font-size: 10px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
        2. Role-Based Access Control (RBAC) Permissions Matrix
      </div>
      <div style="font-size: 8.5px; color: #475569; margin-bottom: 4px;">
        Displays verified permissions matrix mapping privileges across ADMIN, DISPATCHER, DRIVER, and CUSTOMER roles for fleet, orders, dispatch, and system configurations.
      </div>
      <div style="flex:1; display:flex; align-items:center; justify-content:center; background:#0f172a; border-radius:4px; overflow:hidden;">
        <img src="ui/admin/02_admin_role_access_matrix.png" alt="Admin RBAC Matrix" />
      </div>
    </div>
  </div>
  """
))

print("Part 4 appended successfully.")
''')
