# Business Operations & Practical Automation

I build lightweight tools to solve practical business problems, with a focus on workflow improvement, operational usability, and cost-conscious automation.

Most of my tools are designed for colleagues who need simple, reliable ways to complete everyday tasks without dealing with complicated formulas, technical configurations, or repetitive manual steps. I also build personal workflow automations to streamline quotation preparation, invoicing, and customer communication.

My approach is to understand the actual workflow first, identify unnecessary manual effort or operational risks, and then build a solution using existing tools wherever possible.

Rather than adding technology for its own sake, I focus on making everyday work easier to perform, maintain, and repeat.

## Core Skills

- **Business Operations:** Workflow Improvement, Process Standardization, Operational Support
- **Sales Operations:** Quotation Preparation, Invoice Processing, Customer Communication, Order Support
- **Practical Automation:** Google Apps Script, JavaScript, HTML, CSS
- **Data Management:** SQL, Excel, Google Sheets, Data Validation, Data Transformation
- **API Integration:** REST APIs, Zoho Invoice API
- **Reporting & Visualization:** Data Aggregation, Google Sheets Charts, Dashboard Preparation
- **Solution Design:** Requirements Understanding, End-User Usability, Error Prevention, Cost-Conscious Implementation

## Projects

### 1. Coordinate Bounding Box & GeoJSON Generator

**Technologies:** HTML, CSS, JavaScript, Leaflet, GeoJSON

**Project Type:** Lightweight data utility

#### Background

In my previous role, I worked with golf-course latitude and longitude data, including joining, cleaning, and checking records using SQL.

This project explores a practical way to prepare geographic coordinate data without requiring users to perform every step manually or rely on a full GIS application for a relatively simple task.

#### Key Features

- Enter northeast and southwest latitude/longitude coordinates.
- View the selected area on an interactive map.
- Draw a rectangular area directly on the map.
- Extract the rectangle's geographic bounds.
- Generate a GeoJSON Polygon.
- Copy coordinate data for use in other applications or spreadsheets.

#### Skills Demonstrated

- Practical problem-solving
- Coordinate data handling
- Data formatting and export
- JavaScript and interactive map integration

**Scope:** This is a lightweight coordinate utility, not a replacement for a full GIS platform or an advanced geospatial analysis system.

---

### 2. Japanese Postal Code & Address Lookup Tool

**Technologies:** HTML, CSS, JavaScript, REST API, Clipboard API

**Project Type:** Internal utility for colleagues

#### Business Context

Colleagues frequently handled customer orders over the phone and needed to enter Japanese addresses while speaking with customers.

Looking up addresses and entering them manually during phone calls added extra steps to the order-taking process. I developed a lightweight browser-based tool to help colleagues retrieve address information quickly using a Japanese postal code, making address entry easier during routine order handling.

#### Key Features

- Accept a seven-digit Japanese postal code.
- Validate the input format.
- Retrieve the corresponding address using the ZipCloud API.
- Display the retrieved address with kana-reading support.
- Allow colleagues to copy the address for use in other business applications.
- Handle invalid input and API errors.

#### Design Considerations

The tool was designed around the actual workflow of colleagues taking orders by phone.

Rather than requiring users to navigate external websites and manually copy address information, it provides a simple interface for postal-code lookup and copying the result.

The emphasis was on making a frequent operational task easier to perform, with minimal additional steps or technical knowledge required.

#### Skills Demonstrated

- Business process observation and improvement
- Internal tool development
- REST API integration
- Input validation and error handling
- User-oriented workflow design
- Practical automation for day-to-day operations

**Scope:** The tool supports postal-code-based address lookup. The retrieved address depends on the external API, and postal-code lookup does not independently verify a customer's actual address.

---

### 3. Custom HTML Email Design & Bulk Sending Automation

**Technologies:** Canva, HTML, Google Drive, Google Sheets, Google Apps Script

**Project Type:** Business Operations Automation

#### Business Context

The company needed visually appealing, customized bulk emails but did not have a budget for a paid email marketing or email design platform.

To meet this need within the available budget, I developed a workflow using free Canva design tools, Google Drive, Google Sheets, and Google Apps Script.

#### Solution Design

1. **Email design:** Used Canva's free design tools to create visually polished, customized email content and exported the HTML files and associated assets.
2. **Image hosting:** Uploaded the exported assets to Google Drive and updated the image references in the HTML to use hosted image URLs.
3. **Personalization:** Used Google Sheets to manage recipient information and Google Apps Script to insert recipient-specific details.
4. **Bulk sending:** Automated email preparation and distribution through Google Apps Script.

#### Business Value

- **Budget-conscious problem-solving:** Addressed the business need without introducing an additional paid platform subscription.
- **Customized communication:** Created visually distinctive email designs tailored to the intended audience.
- **Workflow integration:** Combined design tools, cloud storage, spreadsheet data, and scripting into a practical solution.
- **Reduced manual work:** Automated repetitive email preparation and sending steps.

#### Skills Demonstrated

- Business requirements understanding
- Cost-conscious solution design
- HTML email customization
- Google Apps Script automation
- Google Workspace integration
- Customer communication process improvement

**Scope:** This is a lightweight custom email workflow, not a replacement for a full email marketing platform. The public portfolio version should use synthetic recipient data and non-confidential design assets.

---

### 4. Quotation & Invoice Automation

**Technologies:** Google Sheets, Google Apps Script, Zoho Invoice API, Excel

**Project Type:** Personal sales operations automation

#### Background

Quotation and invoice preparation involves product selection, customer information, pricing calculations, document generation, and customer communication.

To reduce repetitive work, I developed a lightweight workflow that connects spreadsheet-based product and customer information with Zoho Invoice, using tools already available rather than purchasing a dedicated additional system.

#### Key Features

- Organize product and customer information in Google Sheets.
- Select products from dropdown lists.
- Retrieve pricing information using spreadsheet lookup formulas.
- Calculate quotation totals based on product selection and quantities.
- Connect the workflow to the Zoho Invoice API through Google Apps Script.
- Support invoice creation and automated email delivery.

#### Design Considerations

The solution combines spreadsheet formulas for day-to-day data entry and calculations with backend scripting for API integration and automation.

This keeps the workflow accessible while reducing the need to repeat the same information across multiple steps.

#### Skills Demonstrated

- Sales operations process improvement
- Spreadsheet-based workflow design
- Google Apps Script automation
- REST API integration
- Data lookup and calculation
- Customer communication workflow design

**Scope:** This project demonstrates automation of a defined quotation and invoicing workflow. The public version should use sanitized code, synthetic data, and non-production credentials.

---

### 5. Survey Data Processing & Dashboard

**Technologies:** Google Sheets, Google Apps Script, Data Processing, Charts

**Project Type:** Internal reporting utility for colleagues

#### Background

I designed this tool to help colleagues process questionnaire data without having to understand or maintain spreadsheet formulas.

Because the spreadsheet is intended for operational users, I wanted to minimize the risk of accidental changes to formulas or the underlying workbook structure. Rather than asking colleagues to manually modify multiple sheets, I moved the processing logic into Google Apps Script so the workflow could be executed through a simple action.

#### Solution Design

The spreadsheet separates the workflow into three stages:

| Sheet | Purpose |
|---|---|
| `01_Raw Data` | Source questionnaire data |
| `02_Clean Data` | Processed data |
| `03_Dashboard` | Reporting output |

Google Apps Script handles the underlying processing and report-generation logic, while the spreadsheet provides a simpler interface for colleagues.

#### Key Design Principles

- **Simple operation:** Colleagues can run the workflow without needing to understand the code.
- **Reduced risk of accidental edits:** Processing logic is kept out of the user-facing workflow as much as possible.
- **Centralized logic:** Data processing is managed in the backend rather than relying on users to maintain formulas.
- **Repeatable execution:** The workflow provides a consistent approach to refreshing the output.

#### Skills Demonstrated

- Business requirements understanding
- Google Apps Script development
- Spreadsheet workflow design
- Data processing and transformation
- Reporting and dashboard preparation
- End-user usability and operational risk reduction

**Key takeaway:** This project demonstrates how I approach internal tool development: simplify the user experience, keep technical complexity behind the scenes, and design around the way colleagues actually work.

---

## My Approach to Problem Solving

Across these projects, I focus on five principles:

1. **Start with the actual workflow.** Understand how the task is performed today, who performs it, and where repetitive effort or operational risks arise.
2. **Design for the user.** Build tools that colleagues can use without needing to understand the underlying code or formulas.
3. **Work within practical constraints.** Make use of existing software and APIs before introducing additional cost or complexity.
4. **Automate where it adds value.** Use scripts, formulas, and integrations to reduce repetitive steps and make execution more consistent.
5. **Keep solutions fit for purpose.** Prioritize usability, clarity, and maintainability over unnecessary technical complexity.

## What This Portfolio Demonstrates

My strength lies at the intersection of business operations and practical technology.

I can understand a business process, identify opportunities for improvement, and independently build lightweight tools to address those needs. My projects range from internal utilities designed for colleagues to personal automations for sales administration and customer communication.

I focus on practical implementation: using the technology available to solve the problem at hand, while keeping the resulting workflow understandable and usable.
