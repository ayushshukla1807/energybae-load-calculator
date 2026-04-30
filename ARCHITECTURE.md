# 🏗 EnergyBae AutoLoad AI: Technical Architecture

This document outlines the high-level system design and AI orchestration strategy implemented in the EnergyBae AutoLoad AI (Enterprise Suite V11).

## 🧠 Neural Orchestration Layer
The core of the platform is a **Multi-Model Inference Failover System**.
- **Primary:** OpenAI GPT-4o Vision for high-fidelity OCR and semantic extraction.
- **Failover:** Groq Llama-3-70B for ultra-low latency JSON processing and backup inference.
- **Logic:** The system utilizes a domain-specific system prompt to handle MSEDCL-specific edge cases, such as HP to kW unit conversion and Billing Unit (BU) mapping.

## 📈 Predictive Intelligence Module
Instead of static data extraction, the platform implements a **Time-Series Forecasting Engine**.
- **Preprocessing:** Z-Score normalization is applied to historical consumption to detect billing anomalies.
- **Projection:** A linear regression simulation projects consumption for the next 12-month window.
- **Environmental ESG:** Real-time calculation of CO2 offset ($0.85kg/unit$) and tree-planting equivalents.

## 🛠 Automation & Data Integrity
- **Non-Destructive Export:** Using `exceljs`, the system programmatically builds an executive-grade audit report. This avoids template corruption and ensures 100% cross-platform compatibility.
- **State Management:** React 18 with Framer Motion for high-fidelity, non-linear UI transitions.

## 🔒 Security & Performance
- **Edge Runtime:** Deployed on Vercel Edge for minimal latency between the user and the inference engines.
- **Context Isolation:** All sensitive API keys are managed via environment variables with client-side failover masking.

---
© 2026 EnergyBae | AI/ML Engineering Prototype
