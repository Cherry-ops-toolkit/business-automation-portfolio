# Quotation & Invoice Automation

## Overview

A lightweight order processing and invoice automation workflow built with Google Sheets, Google Apps Script, and the Zoho Invoice API.

The workflow integrates customer master data, quantity-based product pricing, order input, and invoice generation to reduce manual work in the quotation and invoicing process.

## Business Context

The existing workflow relied on manually preparing quotations and invoices in Excel. This created repetitive administrative work, particularly when handling different customer types and product prices based on order quantities.

To streamline the process without introducing a costly dedicated system, I built an integrated workflow using Google Sheets, Google Apps Script, and Zoho Invoice.

## Key Features

- **Customer master data management:** Maintain customer names, customer types (Individual or Business), and Zoho Customer IDs in Google Sheets.
- **Customer-type identification:** Automatically identify whether the selected customer is an individual or a business.
- **Multi-condition pricing lookup:** Match product pricing based on customer type and order quantity.
- **Automated order calculations:** Retrieve applicable prices and calculate order amounts in the Order Input sheet.
- **Invoice generation:** Trigger invoice creation from the order input workflow.
- **Zoho Invoice integration:** Use Google Apps Script and the Zoho Invoice API to transfer invoice data to Zoho Invoice.

## Workflow

1. Maintain customer information and Zoho Customer IDs in a customer master sheet.
2. Maintain product pricing data, including customer-type-specific prices and quantity-based pricing tiers.
3. Select a customer in the Order Input sheet to identify the customer type automatically.
4. Select products and enter quantities to retrieve the applicable prices.
5. Generate an invoice through a scripted action.
6. Transfer the invoice data to Zoho Invoice through its API.

## Technologies

- Google Sheets
- Google Apps Script
- XLOOKUP
- Zoho Invoice API
- JavaScript

## Business Value

- Reduced repetitive manual work in quotation and invoice preparation.
- Improved consistency in customer-type and quantity-based pricing.
- Connected order input with customer master data and invoice generation.
- Automated data transfer between Google Sheets and Zoho Invoice.
- Delivered a practical, cost-conscious solution using existing tools and services.

## Scope and Limitations

The workflow relies on the accuracy of customer master data and product pricing tables. 
