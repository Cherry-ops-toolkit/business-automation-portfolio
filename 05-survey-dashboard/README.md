# Survey Data Processing & Dashboard Automation

## Overview

A Google Sheets and Google Apps Script solution that automates survey data cleaning, response analysis, and dashboard generation.

The workflow is designed to keep the analytical logic in the background, allowing users to paste raw survey data into the source sheet and run a single script to refresh the cleaned dataset, summary statistics, and visual reports.

## Business Context

Manually cleaning survey responses, standardizing inconsistent answers, calculating response counts, and preparing charts can be repetitive and time-consuming.

Using spreadsheet formulas for every analytical step can also make a reporting workflow more fragile when users accidentally modify formulas or change the structure of the analysis.

To simplify the process, I built a Google Apps Script workflow that centralizes data processing and reporting logic in the backend. Users do not need to manually edit formulas, calculate response frequencies, or recreate charts each time new survey data becomes available.

## Key Features

- **Automated data cleaning:** Standardize survey responses before analysis.
- **Header-based field detection:** Identify survey fields using question headers, with fallback logic for predefined column layouts.
- **Answer normalization:** Consolidate variations in numeric formats, units, punctuation, and selected speaker brand names.
- **Multiple response handling:** Aggregate answers from single-choice, multiple-choice, and free-text questions using different processing logic.
- **Automated statistical analysis:** Calculate response frequencies and identify the most common answers.
- **Dashboard generation:** Create KPI summaries, detailed question-level statistics, charts, and management summaries.
- **One-click refresh:** Rebuild the cleaned dataset and dashboard by running a single Google Apps Script function.
- **Reusable reporting workflow:** Apply the same processing logic to subsequent survey datasets that follow a compatible structure.

## How It Works

1. Paste the latest raw survey data into the `01_Raw Data` sheet.
2. Run the `createSurveyReport()` function in Google Apps Script.
3. The script identifies relevant question fields and processes the source data.
4. Survey answers are standardized and written to `02_Clean Data`.
5. Response statistics and charts are generated automatically in `03_Dashboard`.
6. Review the refreshed dashboard and summary results for reporting and product development discussions.

The analytical logic is handled by the script rather than requiring users to maintain individual spreadsheet formulas or manually rebuild charts.

## Technologies

- Google Sheets
- Google Apps Script
- JavaScript
- Data cleaning and standardization
- Survey response aggregation
- Automated dashboard and report generation

## Business Value

- **Reduced manual work:** Automates repetitive data preparation, counting, and chart creation.
- **Simplified operation:** Users can refresh the report without manually adjusting formulas or rebuilding visualizations.
- **More consistent processing:** Applies predefined cleaning and aggregation rules across reporting cycles.
- **Improved reporting efficiency:** Converts raw survey responses into structured summaries and visual reports through a single workflow.
- **Cost-effective implementation:** Uses existing Google Workspace tools without requiring a separate BI platform for this reporting process.

## Scope and Limitations

- The current implementation is designed around a specific survey structure and its defined question fields.
- Header-based field detection includes fallback logic for predefined column arrangements; substantially different source layouts may require code adjustments.
- Answer normalization follows predefined rules and may require updates when new response formats or product names appear.
- Dashboard insights are generated using predefined business rules and frequently occurring responses; they do not constitute advanced statistical modelling or independently validated product recommendations.
- The script clears and rebuilds the designated output sheets when refreshing the report. Manually maintained content should not be stored in those sheets.
