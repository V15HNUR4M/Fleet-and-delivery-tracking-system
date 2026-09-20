# scripts/build_full_doc.py - Part 1
import os

HTML_START = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Fleet and Delivery Tracking System — Frontend Technical Documentation</title>
<style>
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
  color: #0f172a;
  background: #f1f5f9;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.page {
  width: 210mm;
  height: 297mm;
  max-height: 297mm;
  box-sizing: border-box;
  padding: 9mm 11mm;
  page-break-after: always;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.page-border {
  border: 1.5px solid #0f172a;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 8mm 10mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

/* Header */
.doc-header {
  border-bottom: 2px solid #0f172a;
  padding-bottom: 4px;
  margin-bottom: 8px;
}
.doc-super {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #0f172a;
  text-transform: uppercase;
}
.doc-title {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
  text-transform: uppercase;
  margin-top: 1px;
}
.doc-sub {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  margin-top: 1px;
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

/* Footer */
.doc-footer {
  border-top: 1px solid #cbd5e1;
  padding-top: 4px;
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8.5px;
  color: #64748b;
  font-weight: 600;
}

/* Common Image Containers */
.codesnap-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3px 0;
  flex: 1;
  min-height: 0;
  justify-content: center;
}
.codesnap-box img {
  max-width: 100%;
  max-height: 205mm;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}
.codesnap-box-dual {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
  justify-content: center;
}
.codesnap-box-dual .snap-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
}
.codesnap-box-dual img {
  max-width: 100%;
  max-height: 98mm;
  object-fit: contain;
  border-radius: 5px;
  border: 1px solid #cbd5e1;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}
.codesnap-box-triple {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-height: 0;
  justify-content: center;
}
.codesnap-box-triple .snap-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
}
.codesnap-box-triple img {
  max-width: 100%;
  max-height: 64mm;
  object-fit: contain;
  border-radius: 5px;
  border: 1px solid #cbd5e1;
}

.item-caption {
  font-size: 9.5px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 2px;
  text-align: left;
  width: 100%;
}

.purpose-text {
  font-size: 10.5px;
  color: #334155;
  line-height: 1.45;
  margin-bottom: 6px;
  background: #f8fafc;
  padding: 6px 10px;
  border-left: 3px solid #3b82f6;
  border-radius: 0 4px 4px 0;
}

/* UI Step Grids */
.ui-step-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex: 1;
  min-height: 0;
}
.ui-step-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.step-badge {
  font-size: 9px;
  font-weight: 800;
  color: #1d4ed8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 2px;
}
.step-title {
  font-size: 10.5px;
  font-weight: 700;
  color: #0f172a;
}
.step-desc {
  font-size: 9px;
  color: #475569;
  line-height: 1.35;
  margin: 2px 0 5px 0;
}
.step-img-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #94a3b8;
}
.step-img-wrap img {
  max-width: 100%;
  max-height: 84mm;
  object-fit: contain;
}

/* Full Viewport UI */
.full-ui-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.full-ui-card img {
  max-width: 100%;
  max-height: 185mm;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #475569;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
}

/* Dual Vertical UI */
.dual-ui-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
}
.dual-ui-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 8px;
}
.dual-ui-item img {
  max-width: 100%;
  max-height: 86mm;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #64748b;
}

/* MySQL Workbench Grid Styling */
.mysql-card {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  margin: 6px 0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.mysql-header {
  background: #f1f5f9;
  border-bottom: 1px solid #cbd5e1;
  padding: 6px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mysql-query {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #0284c7;
  padding: 6px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
.mysql-toolbar {
  background: #e2e8f0;
  padding: 4px 12px;
  font-size: 9px;
  color: #475569;
  display: flex;
  gap: 16px;
}
.mysql-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5px;
}
.mysql-table th {
  background: #f1f5f9;
  color: #334155;
  font-weight: 700;
  text-align: left;
  padding: 4px 8px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
  font-size: 9px;
}
.mysql-table td {
  padding: 4px 8px;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
}
.mysql-table tr:nth-child(even) {
  background: #f8fafc;
}
.mysql-table td.font-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
}

/* Terminal Card Styling */
.terminal-window {
  background: #0f172a;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);
  margin: 6px 0;
  border: 1px solid #334155;
}
.term-header {
  background: #1e293b;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid #334155;
}
.term-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.term-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: #94a3b8;
  margin-left: 6px;
}
.term-body {
  padding: 10px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  line-height: 1.5;
  color: #e2e8f0;
  white-space: pre-wrap;
}

/* Tree & Inventory */
.tree-box {
  background: #1e1e2e;
  color: #cdd6f4;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  line-height: 1.45;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #313244;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  flex: 1;
  overflow: hidden;
}
.inv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5px;
  margin-top: 4px;
}
.inv-table th {
  background: #0f172a;
  color: #ffffff;
  font-weight: 700;
  text-align: left;
  padding: 5px 8px;
  border: 1px solid #334155;
}
.inv-table td {
  padding: 4.5px 8px;
  border: 1px solid #e2e8f0;
  color: #1e293b;
}
.inv-table tr:nth-child(even) {
  background: #f8fafc;
}
</style>
</head>
<body>
"""

print("Part 1 base CSS written.")
