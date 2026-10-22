# Personalized Marketing Email Automation

## Overview

A cost-effective workflow for sending personalized marketing emails at scale using Canva, Google Drive, and Google Apps Script.

The workflow combines visually designed HTML email content with customer-specific information, enabling bulk outreach while making each email feel more personal to its recipient.

## Business Context

Sending marketing emails to multiple customers efficiently can be challenging when each message needs personalized details.

I built a workflow that combines existing tools to automate email personalization without purchasing a dedicated marketing automation platform. Google Drive was used to host image assets so that images embedded in the email content could be accessed through persistent URLs rather than relying on temporary or inaccessible local resources.

## Key Features

- Marketing email designs created using Canva's free plan
- Image hosting through Google Drive
- HTML email content processed using Google Apps Script
- Automatic insertion of customer-specific information, such as names and email addresses
- Personalized bulk customer outreach with visually rich email content

## Technologies

- Canva (Free Plan)
- Google Drive
- Google Apps Script
- HTML
- JavaScript

## How It Works

1. Design marketing email content using Canva's free plan.
2. Upload the relevant HTML files and image assets to Google Drive.
3. Make the required image resources accessible through appropriate links and permissions.
4. Use Google Apps Script to process the email content and insert recipient-specific information.
5. Generate and send personalized marketing emails through the configured workflow.

## Business Value

- **Personalized outreach:** Send bulk communications while addressing individual recipients personally.
- **Visual consistency:** Include designed email content and supporting images.
- **Operational efficiency:** Reduce repetitive manual work involved in preparing marketing emails.
- **Cost-effective automation:** Combine existing tools instead of purchasing a dedicated marketing automation platform.

## Scope and Limitations

- Images must remain accessible to email recipients through the configured hosting and sharing permissions.
- Email rendering may vary across email clients.
- Google Apps Script execution and email sending are subject to account permissions and service quotas.
- The workflow personalizes messages using available customer information; it does not imply automated customer segmentation or behavioral targeting.
