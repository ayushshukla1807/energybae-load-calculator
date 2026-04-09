# Digital Heroes: The Ultimate Interview Guide

Prepare to dominate your interview with EnergyBae. This document contains the most difficult technical questions you might be asked about this project, along with expert-level answers.

## 🧠 AI & LLM Questions

### 1. How did you handle OCR errors in complex bill layouts?
**Answer:** "I implemented a 'Neural Extraction' pipeline using GPT-4o Vision with a specific JSON schema enforcement. Instead of simple text extraction, I used Prompt Engineering (Chain of Thought) to ask the model to first 'think' about the table structure before extracting values. I also built a Confidence Heatmap in the UI to allow human-in-the-loop verification where the model's confidence was below 90%."

### 2. Why use GPT-4o Vision instead of specialized OCR tools like Tesseract or AWS Textract?
**Answer:** "Specialized OCR tools excel at flat text but struggle with the spatial semantics of electricity bills (e.g., distinguishing between 'Fixed Charges' and 'Tax' when they are in different columns). GPT-4o Vision understands the visual hierarchy and 'meaning' of the bill, allowing it to extract multi-month history tables without manual row-column coordinate mapping."

### 3. How would you scale this to handle 10,000 bills per hour?
**Answer:** "I would move from the current client-side trigger to a background worker architecture (e.g., BullMQ with Redis). I'd implement a PDF-to-Image preprocessing step using `canvas` or `pdf-node` on the server to handle multi-page documents, and use an LLM gateway (like LiteLLM) to handle rate-limiting and failover across multiple API providers."

## 🏗 Full-Stack Architecture

### 4. Why Next.js 14 and the App Router?
**Answer:** "Next.js 14 provides Server Components which allow us to keep the Excel generation logic (`exceljs`) and API calls off the client's main thread. This ensures the UI remains fluid (60fps) even when processing large document payloads. The App Router's built-in streaming allows us to show the extraction progress incrementally."

### 5. How did you maintain the Excel formula integrity during data injection?
**Answer:** "I used `exceljs` in a non-destructive way. Instead of creating a new file, I load the proprietary template into a buffer, target specific cell addresses (like Column D) for raw data injection, and allow the pre-existing Excel formulas to recalculate on the fly once the user opens the file. This ensures the company's internal ROI logic remains intact."

## 🔋 Domain Knowledge (EnergyBae)

### 6. What is your "Golden Ratio" logic based on?
**Answer:** "After researching EnergyBae's philosophy, I implemented a logic that balances Solar (for peak day loads) and Wind (for constant base-load and evening generation). The 'Golden Ratio' is calculated by analyzing the variance in the 12-month billing history; higher variance suggests a higher Solar ratio, while consistent night-time load suggests a higher VAWT (Vertical Axis Wind Turbine) integration."

### 7. How did you integrate their product catalog?
**Answer:** "I mapped the extracted 'Sanctioned Load' and 'Yearly Savings' targets to actual hardware specifications found on your website (e.g., Windistar 400 for residential vs. Whisper 500 for commercial). This turns a generic calculation into a direct sales enablement tool."

## 🚀 "Senior" Engineering Flexes

### 8. Explain the "Neural Stream" Console.
**Answer:** "The Neural Stream is a developer-centric feature that provides visibility into the agent's internal state. It streams logs of the inference process, verification steps, and anomaly detection. It's designed to give the user (and the sales team) confidence that the AI is 'thinking' correctly."

### 9. How did you handle multi-page PDFs?
**Answer:** "In the V3 overhaul, I designed the UI to handle multi-page document payload vectors. The server-side logic splits the PDF and sends the relevant consumption-table page to the Vision model, ensuring we don't hit token limits while maintaining context."

### 10. What would you do if the OpenAI API goes down during a live demo?
**Answer:** "I built a 'Fail-Safe Offline Mode'. It uses a high-fidelity mock dataset that simulates the entire neural inference process. This ensures that even in zero-connectivity or high-latency scenarios, the sales team can still perform a flawless demonstration."

---
*Good luck, Digital Hero!*
