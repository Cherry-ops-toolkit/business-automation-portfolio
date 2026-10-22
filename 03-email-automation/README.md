# Personalized Marketing Email Automation

## Overview

A cost-effective marketing email automation workflow built with Google Sheets, Google Apps Script, Canva, and Google Drive.

The workflow reads customer names and email addresses from Google Sheets, personalizes HTML email content for each recipient, and sends marketing emails in bulk while maintaining a personal touch.

## Business Context

Sending marketing communications to multiple customers manually can be repetitive and time-consuming. At the same time, generic mass emails may feel impersonal to recipients.

To address this challenge, I developed a lightweight workflow using existing tools to automate recipient-level personalization without purchasing a dedicated marketing automation platform.

## Key Features

- Customer name and email management in Google Sheets
- Automated row-by-row processing of recipient information
- Personalized greetings and email subject lines
- HTML marketing email design created using Canva's free plan
- Google Drive storage for HTML templates and image assets
- Inline image embedding in emails through Google Apps Script
- Bulk email sending through Gmail services

## Technologies

- Google Sheets
- Google Apps Script
- Canva (Free Plan)
- Google Drive
- HTML
- JavaScript
- GmailApp

## How It Works

1. Maintain a customer list in Google Sheets with two columns: `Customer Name` and `Email Address`.
2. Design the marketing email using Canva's free plan.
3. Store the HTML email file, text version, and required image assets in Google Drive.
4. Use Google Apps Script to retrieve the email template and associated images.
5. Read customer information from Google Sheets and personalize each message with the recipient's name.
6. Send the personalized emails through the configured Gmail account.

## Business Value

- **Scalable personalization:** Send bulk marketing emails with recipient-specific greetings.
- **Operational efficiency:** Reduce repetitive manual editing and sending.
- **Cost-effective implementation:** Combine existing tools rather than purchasing a dedicated marketing automation platform.
- **Consistent communication:** Use a common marketing design while personalizing recipient details.

## Scope and Limitations

- Personalization is based on customer names and email addresses maintained in Google Sheets.
- The workflow does not independently perform customer segmentation or behavioral targeting.
- Email rendering depends on the recipient's email client.
- Google Apps Script and Gmail sending are subject to account permissions and service quotas.
- Recipient consent, opt-out handling, and applicable marketing email requirements must be addressed before production use.
