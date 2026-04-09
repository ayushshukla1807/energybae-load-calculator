# EnergyBae AutoLoad AI (V3.0 Ultimate)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://energybae-load-calculator.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/ayushshukla1807/energybae-load-calculator)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![OpenAI](https://img.shields.io/badge/AI-GPT--4o--Vision-orange)](https://openai.com/)

An Enterprise-grade Agentic Document Intelligence platform built for **EnergyBae**. This application revolutionizes residential and industrial energy auditing by combining high-fidelity OCR, neural forecasting, and a proprietary "Golden Ratio" recommendation engine.

## 🚀 The Revolution

This isn't just a calculator. It is a **Strategic Energy Advisor** that:
- **Neural Extraction:** Uses GPT-4o Vision to extract billing data with >95% accuracy.
- **Agentic Auditor:** A real-time "Neural Stream" console that shows the AI's Chain-of-Thought during processing.
- **Neural Forecaster:** Predicts next-quarter consumption using weighted seasonal regression models.
- **Golden Ratio Engine:** Recommends the optimal mix of Solar and Wind (HAWT/VAWT) based on historical load variance.
- **Human-in-the-Loop:** A professional verification dashboard to ensure 100% data integrity before Excel generation.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion (Glassmorphism UI)
- **AI/ML:** OpenAI API (Vision Models) + Custom Regression Logic
- **Data Visualization:** Recharts (Analytics & Forecasting)
- **Document Processing:** `exceljs` (Surgical Excel Injection)
- **Icons:** Lucide-React

## 🏗 Architecture

```mermaid
graph TD
    A[User Uploads Bill] --> B[Neural Extraction Agent]
    B --> C[GPT-4o Vision Processing]
    C --> D[Confidence Heatmap & Verification]
    D --> E[Golden Ratio Engine]
    E --> F[Hardware Recommendations]
    F --> G[Predictive Neural Forecaster]
    G --> H[Export to Verified Excel]
```

## 🔋 Hardware Recommendations

The platform is vertically integrated with the **EnergyBae Catalog**:
- **Windistar 400 HAWT/VAWT** for residential base loads.
- **Whisper 200/500** for industrial consistency.
- **Tier 1 Monocrystalline PERC** for peak solar efficiency.

## 📦 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set your `OPENAI_API_KEY` in `.env.local`
4. Run development server: `npm run dev`

---
*Built for the EnergyBae AI Engineer Internship.*
