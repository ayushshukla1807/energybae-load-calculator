# 🏛 Technical Architecture: EnergyBae AutoLoad AI

## 🧬 Multi-Model Orchestration Layer
The system implements a robust **failover inference pipeline** to ensure 99.9% uptime for document extraction.
- **Primary Inference:** OpenAI GPT-4o (Vision API) handles high-resolution OCR and semantic field mapping.
- **Failover Inference:** Groq Llama-3-70B (8k context) acts as a high-speed fallback for JSON serialization and data validation.

## 👯‍♂️ Twin-Profile Comparison Logic
The V15 update introduces a **Side-by-Side Architectural Mapping** system:
- **Relational Data Mapping:** The engine aligns disparate bill payloads into a unified dual-column matrix.
- **Synchronized Time-Series:** Historical consumption data for both profiles is normalized into a single 12-month window for accurate variance analysis.

## 📉 Statistical Anomaly Detection (Z-Score)
To provide "Actionable Intelligence" instead of just data:
- **Normalization:** Consumption data is processed via Z-Score calculation ($Z = (x - \mu) / \sigma$).
- **Thresholding:** Spikes exceeding 1.5 standard deviations are flagged as anomalies, triggering specific load-efficiency recommendations.

## ⚖️ Mathematical Integrity & Unit Conversion
- **MSEDCL Logic:** Sanctioned load in HP (Horsepower) is automatically scaled to kW using the IEEE 0.746 standard.
- **Solar Vector:** ROI is computed using a specialized **106.06 factor** (Monthly Average Units to required kW conversion), calibrated for the Maharashtra solar radiation index.

## 🛠 Document Automation
- **Non-Destructive Generation:** Unlike template-based systems, we use `exceljs` to build the report in-memory. This prevents binary corruption and allows for dynamic styling (conditional formatting) based on ROI results.

---
© 2026 EnergyBae | Strategic Engineering Documentation
