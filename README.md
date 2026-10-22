# Business Operations & Practical Automation

I build practical, lightweight tools to solve day-to-day business problems, particularly when budget constraints make off-the-shelf solutions impractical.

My approach is to understand the existing workflow, identify repetitive manual tasks, and use available technologies to develop cost-conscious solutions that fit business needs.

My projects cover workflow automation, data handling, customer communication, and internal business utilities.

## Core Skills

- **Business Operations:** Workflow Improvement, Process Standardization, Operational Support
- **Sales Operations:** Quotation Preparation, Invoice Processing, Customer Communication, Order Support
- **Automation:** Google Apps Script, JavaScript, HTML, CSS
- **Data Management:** SQL, Excel, Google Sheets, Data Validation, Data Transformation
- **API Integration:** REST APIs, Zoho Invoice API
- **Data Visualization:** Google Sheets Charts, Dashboard Preparation
- **Collaboration:** Cross-functional Coordination, Requirements Understanding, Documentation

## Projects

### 1. Coordinate Bounding Box & GeoJSON Generator

**Technologies:** HTML, CSS, JavaScript, Leaflet, GeoJSON

**Business Context**

Working with geographic coordinate data can involve repetitive manual input and formatting. This lightweight browser-based tool was designed to simplify the preparation of rectangular geographic areas and the export of coordinate data.

In my previous role, I worked with golf-course latitude and longitude data, including joining, cleaning, and checking records using SQL. This project demonstrates a practical approach to making coordinate-related tasks easier to handle without relying on a more complex GIS workflow.

**Key Features**

- Enter northeast and southwest latitude/longitude coordinates.
- Display the selected geographic area on an interactive map.
- Draw a rectangle directly on the map.
- Extract the rectangle's geographic bounds.
- Generate a GeoJSON Polygon.
- Copy coordinate data for use in spreadsheets.

**Skills Demonstrated**

- Practical tool development
- Geographic coordinate data handling
- Data formatting and export
- JavaScript and interactive map integration

**Scope**

This tool supports basic bounding-box creation and GeoJSON generation. It is not intended to replace a full GIS platform or perform advanced geospatial analysis.

---

### 2. Japanese Postal Code & Furigana Lookup

**Technologies:** HTML, CSS, JavaScript, REST API, Clipboard API

**Business Context**

Entering Japanese addresses manually can be repetitive, particularly when handling customer information or administrative tasks. This browser-based utility simplifies address lookup using a Japanese postal code.

**Key Features**

- Accept a seven-digit Japanese postal code.
- Validate the input format.
- Retrieve the corresponding address using the ZipCloud API.
- Display the address with kana reading support.
- Copy the address for use in other applications.
- Provide basic input validation and error handling.

**Skills Demonstrated**

- REST API integration
- Front-end development
- Input validation
- Data presentation
- Small-scale business utility design

**Scope**

The tool depends on internet access and the availability of the external postal-code API. It is intended to support address lookup, not to verify a customer's actual residence or mailing eligibility.

---

### 3. Personalized Email Automation

**Technologies:** Google Sheets, Google Apps Script, HTML, Google Drive

**Business Context**

In business operations, customer emails may need to include personalized information, formatted HTML content, and embedded images. Preparing each message manually can introduce repetitive work and increase the risk of inconsistent formatting.

I used existing tools to support a more standardized email preparation and sending workflow without introducing an additional dedicated marketing automation platform.

**Key Features**

- Use spreadsheet-based recipient information.
- Insert recipient-specific details into HTML email content.
- Prepare formatted email templates.
- Include images stored in Google Drive.
- Automate email preparation and sending through Google Apps Script.

**Skills Demonstrated**

- Workflow automation
- HTML email formatting
- Spreadsheet-driven personalization
- Google Workspace integration
- Customer communication process improvement

**Scope**

The public portfolio version should use synthetic recipient information and sample content. It should not contain real customer data, internal email templates, or company-specific assets.

---

### 4. Quotation & Invoice Automation

**Technologies:** Google Sheets, Google Apps Script, Zoho Invoice API, Excel

**Business Context**

In my current role, I worked with quotation and invoice processes that involved product pricing, customer information, document preparation, and customer communication.

With limited budget for additional software, I developed a workflow using tools already available to the company. The goal was to connect spreadsheet-based information with invoice generation and reduce the need to repeat the same steps manually.

**Key Features**

- Organize product and customer information in Google Sheets.
- Select products from a dropdown list.
- Retrieve pricing information using spreadsheet lookup formulas.
- Calculate quotation totals based on selected products and quantities.
- Use Google Apps Script to connect the workflow with the Zoho Invoice API.
- Support invoice creation and automated email delivery.

**Skills Demonstrated**

- Sales operations process improvement
- Google Sheets workflow design
- Google Apps Script automation
- API integration
- Data lookup and calculation
- Business process standardization

**Scope**

The public repository is intended to demonstrate the workflow design and technical approach using sanitized code and sample data. It must not contain production credentials, real customer information, internal pricing, or confidential company data.

---

### 5. Survey Data Processing & Dashboard

**Technologies:** Google Sheets, Google Apps Script, Data Processing, Charts

**Business Context**

Survey responses often need to be organized and summarized before the results can be reviewed. This project explores how spreadsheet automation can help process questionnaire responses and present the results in a more accessible format.

**Key Features**

- Process questionnaire response data.
- Summarize answer counts for selected questions.
- Organize results for review.
- Generate charts to support visual interpretation.

**Skills Demonstrated**

- Data processing
- Spreadsheet automation
- Basic aggregation
- Data visualization
- Reporting support

**Scope**

The public version should use sample or synthetic survey data. The final project description should reflect the exact questions, processing logic, and chart-generation functions implemented in the published code.

---

## My Approach to Problem Solving

Across these projects, my approach is to:

1. **Understand the business problem** — Identify repetitive tasks, operational bottlenecks, and sources of manual effort.
2. **Work within constraints** — Evaluate existing tools before introducing additional software or service costs.
3. **Build practical solutions** — Use lightweight automation and integrations where they can address the actual need.
4. **Consider data quality** — Apply input validation, structured data handling, and consistent output formats where appropriate.
5. **Keep the solution fit for purpose** — Prioritize usability and maintainability over unnecessary technical complexity.
