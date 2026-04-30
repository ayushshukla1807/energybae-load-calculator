# EnergyBae Solar Load Calculator

A full-stack automation tool designed to streamline the energy auditing process by automatically extracting data from electricity bills and populating calculation spreadsheets. Built for the EnergyBae AI Engineering assessment.

## Features

- **Automated Data Extraction**: Utilizes multimodal OCR (Google Gemini 1.5 Flash) to accurately read and parse key fields from uploaded electricity bills (PDF/Images).
- **Template Integration**: Directly injects extracted data (Consumer Details, Sanctioned Load, 12-Month Billing History) into the provided Excel template without modifying existing proprietary formulas.
- **Modern UI**: Clean, responsive dashboard built with Next.js and Tailwind CSS featuring Light/Dark mode support for optimal user experience.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide React
- **Backend**: Next.js API Routes (Serverless)
- **Data Processing**: ExcelJS for robust `.xlsx` manipulation
- **AI/ML Integration**: Google Generative AI SDK (`@google/generative-ai`)

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ayushshukla1807/energybae-load-calculator.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env.local` file:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Workflow

1. Upload an electricity bill (PDF or Image format).
2. The backend connects to the extraction engine to parse the document.
3. The server loads `public/template.xlsx` and writes the extracted metrics into the exact input cells required by the EnergyBae workflow.
4. The user receives a download prompt for the finalized, populated Excel sheet.

---
*Developed by Ayush Shukla*
