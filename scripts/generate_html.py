import os
import sys

def header_html(super_title, title, subtitle):
    return f"""
    <div class="doc-header">
      <div class="doc-super">{super_title}</div>
      <div class="doc-title">{title}</div>
      <div class="doc-sub">{subtitle}</div>
    </div>
    """

def footer_html(page_no):
    return f"""
    <div class="doc-footer">
      <span>Fleet &amp; Delivery Tracking System &mdash; Frontend Technical Documentation</span>
      <span>Page {page_no}</span>
    </div>
    """

def wrap_page(page_no, super_title, title, subtitle, content_html):
    return f"""
    <div class="page" id="page-{page_no}">
      <div class="page-border">
        {header_html(super_title, title, subtitle)}
        <div class="doc-content">
          {content_html}
        </div>
        {footer_html(page_no)}
      </div>
    </div>
    """

print("Helper functions ready.")
