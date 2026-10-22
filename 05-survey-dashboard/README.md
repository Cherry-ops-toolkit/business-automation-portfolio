# Survey Data Processing & Reporting Automation

A Google Apps Script solution designed to simplify survey data processing and reporting for internal business users.

## Overview

This project automates the process of cleaning survey data, consolidating responses, and generating a structured report and dashboard using Google Sheets and Google Apps Script.

The tool was developed to address a practical operational challenge: **making a data-processing workflow easy and safe for colleagues who are not familiar with spreadsheet formulas or scripting.**

Instead of requiring users to manually edit formulas, maintain multiple processing steps, or modify the spreadsheet structure, the solution encapsulates the processing logic in the backend. Users can execute the workflow with a single action, while the script handles the underlying data transformation and report generation.

## Business Challenge

The existing workflow needed to be accessible to colleagues with different levels of spreadsheet proficiency.

Several design considerations influenced the implementation:

- **Risk of accidental changes:** Users unfamiliar with formulas could unintentionally overwrite formulas or damage the spreadsheet structure.
- **Operational simplicity:** Requiring colleagues to understand formulas or follow complicated manual steps would make the process harder to maintain.
- **Consistent processing:** Repeated manual operations could introduce inconsistencies between reporting cycles.
- **Maintainability:** The solution needed to keep the user-facing spreadsheet straightforward without exposing users to unnecessary technical complexity.

## Solution Design

The tool separates the user-facing spreadsheet from the underlying processing logic.

### 1. Simple User Interface

The spreadsheet is designed for operational users rather than technical users.

- Users do not need to write or maintain formulas.
- Processing logic is kept in Google Apps Script instead of being exposed throughout the workbook.
- The workflow can be initiated with a single action.
- The generated output is designed to be easy to use and replace during subsequent reporting cycles.

### 2. Automated Data Processing

Google Apps Script handles the processing workflow in the backend, reducing the need for repetitive manual manipulation.

The script organizes the workflow into three logical stages:

| Sheet | Purpose |
|---|---|
| `01_Raw Data` | Source survey data |
| `02_Clean Data` | Processed and standardized data |
| `03_Dashboard` | Reporting output and dashboard |

The script manages the transformation from source data to reporting output, keeping the processing logic centralized rather than distributing it across user-editable spreadsheet formulas.

### 3. Controlled Output Refresh

The reporting workflow is designed around a clear operational principle: **users should not need to understand the implementation to run the process correctly.**

Rather than asking colleagues to manually adjust formulas or edit individual sections, the backend performs the required processing and refreshes the output in a consistent way.

This reduces reliance on user knowledge of spreadsheet internals and helps prevent accidental changes during routine operations.

## Technical Implementation

- **Google Apps Script:** Backend workflow automation and spreadsheet operations.
- **Google Sheets:** Source data, cleaned data, and reporting output.
- **Data transformation:** Structured processing of raw survey responses into reporting-ready data.
- **Workflow design:** Separation of processing logic from the user-facing spreadsheet.
- **Operational usability:** One-action execution designed for non-technical colleagues.

## My Contributions

I was responsible for translating an internal operational need into a practical automation solution.

My contributions included:

- Identifying the risk of accidental spreadsheet changes in a workflow used by colleagues.
- Designing a simpler user interaction that does not require users to understand formulas or code.
- Implementing the processing workflow in Google Apps Script.
- Structuring the spreadsheet into raw data, cleaned data, and dashboard stages.
- Centralizing the processing logic in the backend to make routine execution easier and more consistent.
- Prioritizing usability and operational reliability alongside technical implementation.

## Business Value

The main value of this solution is not simply the automation itself, but the way the workflow was designed around its users.

- **Reduced manual intervention:** Processing steps are handled by the script rather than relying entirely on manual spreadsheet operations.
- **Lower risk of accidental edits:** Users do not need to manipulate formulas or internal processing logic.
- **More consistent execution:** A centralized workflow provides a repeatable way to process survey data.
- **Improved accessibility:** Colleagues can use the tool without programming knowledge.
- **Simpler ongoing operation:** The user-facing spreadsheet remains straightforward, while the implementation is managed in the backend.

Quantitative improvements have not been included because processing-time savings and error-rate reductions have not been formally measured.

## Skills Demonstrated

`Business Process Improvement` · `Requirements Analysis` · `Google Apps Script` · `JavaScript` · `Google Sheets Automation` · `Data Transformation` · `Dashboard Reporting` · `Workflow Design` · `End-User Usability`

## Key Takeaway

This project demonstrates my approach to business operations and process improvement: understand the users' actual needs, identify operational risks, and implement a practical technical solution that makes the process simpler, more consistent, and less dependent on manual intervention.

The objective is not to make users learn a more complicated tool, but to make the underlying process work reliably for them.
