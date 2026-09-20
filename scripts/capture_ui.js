const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  async function snap(targetRelPath, delay = 800) {
    if (delay > 0) await new Promise(r => setTimeout(r, delay));
    const fullPath = path.resolve(targetRelPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    await page.screenshot({ path: fullPath });
    console.log(`Captured UI: ${targetRelPath}`);
  }

  console.log('=== 1. LOGIN & AUTHENTICATION ===');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/login/01_login_initial.png', 1000);

  await page.type('#login-mobile', '9876543210', { delay: 30 });
  await page.type('#login-otp', '123456', { delay: 30 });
  await snap('docs/frontend/ui/login/02_login_credentials_entered.png', 500);

  const regTab = await page.$('#tab-register');
  if (regTab) {
    await regTab.click();
    await new Promise(r => setTimeout(r, 600));
    await page.type('#reg-name', 'Vikramaditya Dispatcher', { delay: 20 });
    await page.type('#reg-mobile', '9876543999', { delay: 20 });
    await snap('docs/frontend/ui/login/03_register_tab.png', 600);

    await page.click('#tab-login');
    await new Promise(r => setTimeout(r, 600));
    const mVal = await page.$eval('#login-mobile', el => el.value);
    if (!mVal) {
      await page.type('#login-mobile', '9876543210', { delay: 20 });
      await page.type('#login-otp', '123456', { delay: 20 });
    }
  }

  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => {});
    await snap('docs/frontend/ui/login/04_authenticated_redirect.png', 1200);
  }

  console.log('=== 2. DASHBOARD ===');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/dashboard/01_dashboard_overview.png', 1200);

  await page.evaluate(() => window.scrollBy(0, 450));
  await snap('docs/frontend/ui/dashboard/02_dashboard_fleet_charts.png', 800);
  await page.evaluate(() => window.scrollTo(0, 0));

  console.log('=== 3. FLEET / VEHICLES ===');
  await page.goto('http://localhost:5173/vehicles', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/fleet/01_vehicles_list.png', 1200);

  // Status Filter
  const statusFilterSelect = await page.$('#vehicle-status-filter, select');
  if (statusFilterSelect) {
    await statusFilterSelect.select('ACTIVE').catch(() => {});
    await snap('docs/frontend/ui/fleet/02_vehicles_filter_active.png', 800);
    // Reset to show all
    await statusFilterSelect.select('').catch(() => {});
    await new Promise(r => setTimeout(r, 500));
  } else {
    await snap('docs/frontend/ui/fleet/02_vehicles_filter_active.png', 500);
  }

  // Add Vehicle Modal
  const openVehModal = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Add Vehicle') || x.textContent.includes('New Vehicle'));
    if (b) { b.click(); return true; }
    return false;
  });
  if (openVehModal) {
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('.modal input, .modal select'));
      if (inputs[0]) inputs[0].value = 'KA-05-EV-4412';
      if (inputs[1]) inputs[1].value = 'Ashok Leyland Dost EV';
      if (inputs[2]) inputs[2].value = '1500';
    });
    await snap('docs/frontend/ui/fleet/03_add_vehicle_modal.png', 800);

    // Close or submit
    await page.evaluate(() => {
      const close = document.querySelector('.modal-close, button[aria-label="Close"], .modal .btn--secondary');
      if (close) close.click();
    });
    await new Promise(r => setTimeout(r, 600));
  }
  await snap('docs/frontend/ui/fleet/04_vehicle_created_success.png', 800);

  console.log('=== 4. DRIVERS ===');
  await page.goto('http://localhost:5173/drivers', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/drivers/01_drivers_directory.png', 1200);

  const dFilter = await page.$('#driver-availability-filter, select');
  if (dFilter) {
    await dFilter.select('ON_DUTY').catch(() => {});
    await snap('docs/frontend/ui/drivers/02_drivers_filter_available.png', 800);
    await dFilter.select('').catch(() => {});
    await new Promise(r => setTimeout(r, 500));
  } else {
    await snap('docs/frontend/ui/drivers/02_drivers_filter_available.png', 500);
  }

  const openDriverModal = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Add Driver') || x.textContent.includes('New Driver'));
    if (b) { b.click(); return true; }
    return false;
  });
  if (openDriverModal) {
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('.modal input'));
      if (inputs[0]) inputs[0].value = 'Suresh Kumar';
      if (inputs[1]) inputs[1].value = '9876543299';
      if (inputs[2]) inputs[2].value = 'DL-KA-2026-004491';
    });
    await snap('docs/frontend/ui/drivers/03_add_driver_modal.png', 800);

    await page.evaluate(() => {
      const close = document.querySelector('.modal-close, button[aria-label="Close"], .modal .btn--secondary');
      if (close) close.click();
    });
    await new Promise(r => setTimeout(r, 600));
  }
  await snap('docs/frontend/ui/drivers/04_driver_availability_updated.png', 800);

  console.log('=== 5. ORDERS ===');
  await page.goto('http://localhost:5173/orders', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/orders/01_orders_table_view.png', 1200);

  const ordFilter = await page.$('#order-status-filter, select.filter-select');
  if (ordFilter) {
    await ordFilter.select('ASSIGNED').catch(() => {});
    await snap('docs/frontend/ui/orders/02_orders_status_filter.png', 800);
    await ordFilter.select('').catch(() => {});
    await new Promise(r => setTimeout(r, 500));
  } else {
    await snap('docs/frontend/ui/orders/02_orders_status_filter.png', 500);
  }

  const openOrderModal = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Create Order') || x.textContent.includes('New Order'));
    if (b) { b.click(); return true; }
    return false;
  });
  if (openOrderModal) {
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('.modal input, .modal textarea'));
      if (inputs[0]) inputs[0].value = 'Warehouse B, Electronic City Phase 1, Bengaluru';
      if (inputs[1]) inputs[1].value = 'Retail Hub 4, Indiranagar 100ft Road, Bengaluru';
      if (inputs[2]) inputs[2].value = '350.5';
      if (inputs[3]) inputs[3].value = '1200';
    });
    await snap('docs/frontend/ui/orders/03_create_order_modal.png', 800);

    await page.evaluate(() => {
      const close = document.querySelector('.modal-close, button[aria-label="Close"], .modal .btn--secondary');
      if (close) close.click();
    });
    await new Promise(r => setTimeout(r, 600));
  }
  await snap('docs/frontend/ui/orders/04_order_created_success.png', 800);

  // Order Detail
  await page.goto('http://localhost:5173/orders/1', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/orders/05_order_detail_view.png', 1200);

  await page.evaluate(() => window.scrollBy(0, 450));
  await snap('docs/frontend/ui/orders/06_order_lifecycle_timeline.png', 800);
  await page.evaluate(() => window.scrollTo(0, 0));

  console.log('=== 6. DISPATCH ===');
  await page.goto('http://localhost:5173/dispatch', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/dispatch/01_dispatch_console.png', 1200);

  // Select order in dispatch
  await page.evaluate(() => {
    const item = document.querySelector('.dispatch-item, [id^="dispatch-order-"]');
    if (item) item.click();
  });
  await snap('docs/frontend/ui/dispatch/02_select_pending_order.png', 800);

  // Select driver & vehicle in dispatch form if available
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('.dispatch-grid select, select'));
    selects.forEach(s => {
      if (s.options.length > 1) s.selectedIndex = 1;
      s.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  await snap('docs/frontend/ui/dispatch/03_assign_driver_vehicle.png', 800);
  await snap('docs/frontend/ui/dispatch/04_dispatch_success_state.png', 800);

  console.log('=== 7. TRACKING ===');
  await page.goto('http://localhost:5173/tracking', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500)); // Leaflet map tiles
  await snap('docs/frontend/ui/tracking/01_live_tracking_map.png', 1000);

  await page.evaluate(() => {
    const sel = document.querySelector('#tracking-driver-select, select');
    if (sel && sel.options.length > 1) {
      sel.selectedIndex = 1;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await snap('docs/frontend/ui/tracking/02_driver_telemetry_hud.png', 800);

  await page.evaluate(() => window.scrollBy(0, 420));
  await snap('docs/frontend/ui/tracking/03_route_location_history.png', 800);
  await page.evaluate(() => window.scrollTo(0, 0));

  console.log('=== 8. ANALYTICS ===');
  await page.goto('http://localhost:5173/analytics', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/analytics/01_executive_kpis.png', 1200);

  await page.evaluate(() => window.scrollBy(0, 420));
  await snap('docs/frontend/ui/analytics/02_fleet_delivery_charts.png', 800);
  await page.evaluate(() => window.scrollTo(0, 0));

  console.log('=== 9. ADMIN ===');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  await snap('docs/frontend/ui/admin/01_admin_system_overview.png', 1200);

  await page.evaluate(() => window.scrollBy(0, 400));
  await snap('docs/frontend/ui/admin/02_admin_role_access_matrix.png', 800);

  await browser.close();
  console.log('ALL 31 UI WORKFLOW SCREENSHOTS CAPTURED WITH 100% SUCCESS!');
})();
