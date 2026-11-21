# ClaimSetu (क्लेमसेतु) 🛡️
### AI Insurance Policy Decoder & Claim Appeal Copilot for India
*Grounded in IRDAI Regulations, Section 45 of Insurance Act 1938, and Insurance Ombudsman Rules 2017*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML%2FCSS%2FJS-orange.svg)](#architecture--tech-stack)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-0%20Zero-brightgreen.svg)](#architecture--tech-stack)
[![Render Ready](https://img.shields.io/badge/Deployment-Render%20Static%20Site-46E3B7.svg)](#render-static-site-deployment)
[![IRDAI Aligned](https://img.shields.io/badge/IRDAI-Ombudsman%20Compliant%20(%E2%89%A4%20%E2%82%B950L)-blueviolet.svg)](#indian-statutory--legal-grounding)

---

## 🇮🇳 The Problem in the Indian Insurance Ecosystem

In India, **over 15% of health insurance reimbursement claims** and thousands of motor/life claims are rejected or subjected to severe arbitrary cuts by Third-Party Administrators (TPAs) and private insurers. 

Ordinary policyholders face severe asymmetric disadvantages:
1. **Opaque Rejection Notices**: Citing cryptic internal clauses (e.g., *"Proportionate Deduction under Clause 3.2"* or *"Repudiated under Clause 4.1 for Non-Disclosure of Hypertension"*).
2. **Ignorance of Statutory Immunity**: Most citizens do not know that under **Section 45 of the Insurance Act, 1938**, an insurer is legally barred from questioning or repudiating a policy on grounds of non-disclosure or misstatement after **3 continuous years (36 months)**.
3. **Ombudsman Avoidance**: Insurers rarely inform policyholders that they can escalate rejected claims **up to ₹50,00,000 (₹50 Lakhs)** to the **Council for Insurance Ombudsmen** with zero court fee, where decisions are legally binding on the insurance company.
4. **Endowment / Money-Back Mis-selling**: Agents sell traditional endowment plans promising *"Triple Returns"* or *"Guaranteed 10x"*, while the real compounded post-tax Internal Rate of Return (IRR) is a sub-inflation **4.5% - 5.2% p.a.**

**ClaimSetu** bridges this gap as an open-source, client-side legal-tech copilot designed to decode denials, expose fine-print traps, explain jargon simply, and draft statutory appeal letters for immediate escalation.

---

## 🚀 Key Modules & Capabilities

### ⚡ 3-Step "How to Use" Orientation Strip
- Positioned right below the header so first-time users immediately grasp the workflow:
  1. **Step 1: Choose a Preset or Enter Details** — Pick one of 4 realistic Indian dispute presets or paste your own notice/brochure.
  2. **Step 2: Watch the 3-Stage Regulatory Scan** — Real-time cross-examination against Section 45, IRDAI room-rent limits, and Ombudsman rulings.
  3. **Step 3: Copy Letter & Escalate** — 1-click copy of the GRO appeal letter, checklist download, and Ombudsman roadmap up to ₹50 Lakhs.

---

### 1. Rejection Decoder & Appeal Builder (Tab 1)
- **Inputs**: Policy Type (*Health / Term Life / Motor / Gadget*), Disputed Claim Amount (₹), Insurer / TPA Name, Policy/Claim Number, and Rejection notice text.
- **Dynamic Indian Currency & Jurisdiction Engine**: Real-time conversion into Lakhs/Crores, auto-evaluating eligibility for the **Insurance Ombudsman (pecuniary limit: ₹50 Lakhs)** or NCDRC Consumer Commission.
- **3-Step Analysis Pipeline**:
  - **(a) Plain-English Denial Audit**: Evaluates grounds like *Room-Rent Sub-limit / Proportionate Deduction*, *Section 45 Non-Disclosure*, *Missing Itemized Bills / Documentation Gaps*, or *Medical Necessity*. Assigns a Contestability Rating (*High / Medium / Low*) and compares *"What the Insurer Alleged"* vs. *"What IRDAI / Indian Law Actually Says"*.
  - **(b) Gap & Loophole Checklist**: Interactive counter-evidence checklist specifying exact medical records, hospital tariff certificates, doctor necessity attestations, and 3-year renewal records required to overturn the denial.
  - **(c) Statutory Escalation & Appeal Letter**: Generates a professional representation addressed to the **Grievance Redressal Officer (GRO)** of the insurer, invoking IRDAI’s mandatory 15-day redressal timeline, Section 45, and giving formal notice of escalation to the **IRDAI Bima Bharosa Portal** and the **Insurance Ombudsman**. Includes a 1-click **"Copy Appeal Letter"** button (with toast notification) and `.TXT` export.

---

### 2. Policy Fine-Print X-Ray (Tab 2)
- **Inputs**: Policy brochure text, Key Feature Document (KFD) excerpt, or agent WhatsApp pitch.
- **Outputs**:
  - **(a) Protection vs. Money-Back Reality Check**: Contrasts pure risk protection against investment schemes, calculating the real **IRR (~4.9%)** against Public Provident Fund (7.1%) and Index Funds (12%), demonstrating the financial superiority of *Pure Term + Mutual Funds*.
  - **(b) Hidden Trap Scanner**: Tags clauses with visual badges (**Safe**, **Watch Out**, **High Trap**) covering 1% room-rent caps, 20% senior citizen co-payment, 24-month specific illness waiting periods, modern treatment limits, surrender charges, and non-payable consumables haircuts.
  - **(c) Disclosure & Paperwork Shield**: Guides policyholders on which medical markers to declare upfront to guarantee future Section 45 immunity, plus a checklist of permanent records to retain for 10+ years.

---

### 3. Jargon in Simple Words — Plain-English Term Helper (Tab 3)
Calm, factual, 1-sentence explanations for the 8 core insurance terms that confuse Indian consumers:
1. **Section 45 (3-Year Rule)**: Strict statutory bar on rejecting policies for alleged non-disclosure after 36 continuous months.
2. **Room-Rent Sub-Limit & Proportionate Deduction**: Capping room charges and cutting doctor/surgery fees proportionately.
3. **Co-Pay (Co-Payment)**: Fixed percentage of the bill (10%–20%) paid out of the policyholder's own pocket.
4. **Waiting Period**: Compulsory initial window (30 days, 24 months, 36 months) before certain illnesses are covered.
5. **Pure Protection vs. Money-Back/Endowment**: Insurance cover alone vs low-yield (~4.9% IRR) savings/return products.
6. **GRO (Grievance Redressal Officer)**: Mandatory senior escalation official inside the insurer with a 15-day resolution window.
7. **IRDAI Bima Bharosa**: Official regulatory complaint portal (`bimabharosa.irdai.gov.in` / 155255) for regulator tracking.
8. **Insurance Ombudsman (≤ ₹50 Lakhs)**: Free, legally binding quasi-judicial forum for eligible claims up to ₹50 Lakhs.

---

### 4. Dual Execution Modes
- **Instant Demo Mode (Default, Zero API Key Needed)**:
  - Runs 100% locally with pre-engineered Indian insurance regulatory intelligence.
  - Features a **Master 1-Click Preset Showcase** with **4 accessible Indian presets** that run end-to-end with the animated 3-stage progress bar:
    1. **Preset 1**: *Health Claim Denied — Alleged Non-Disclosure of Pre-Existing Condition (₹2,40,000)* [Loads into Tab 1 • Tests Section 45 protection].
    2. **Preset 2**: *Partial Settlement — Room-Rent Sub-Limit & Non-Payable Items Deduction (₹1,15,000)* [Loads into Tab 1 • Tests proportionate deduction overreach].
    3. **Preset 3**: *Claim Rejected — Missing Itemized Bill & Discharge Summary Gap (₹85,000)* [Loads into Tab 1 • Tests procedural document closure].
    4. **Preset 4**: *Policy Brochure Audit — "Tax-Saver + Guaranteed Return + Cover" Pitch* [Loads into Tab 2 • Tests pure protection vs savings].
  - Features an animated **3-stage progress pipeline** tracking statutory analysis stages.
- **Live Gemini AI Mode (Optional BYOK)**:
  - Enter your personal Google Gemini API key to query `gemini-2.5-flash` directly.
  - Stored strictly in browser `localStorage` (`claimsetu_gemini_key`), never sent to any third-party server.
  - Automatic error handling with seamless fallback to the local engine if rate-limited, empty, or offline.

---

### 5. Transparent Prompt & Legal Architecture (Tab 4)
- Expandable tab showcasing system prompt design, regulatory grounding table, and zero-telemetry client-side privacy architecture.

---

## 🏛️ Indian Statutory & Legal Grounding

| Statute / Regulation | Key Provision | How ClaimSetu Leverages It |
| :--- | :--- | :--- |
| **Insurance Act 1938 — § 45** | Absolute indisputability after 3 years from policy inception/revival. | Repudiations for undisclosed diabetes/hypertension past 36 continuous months are legally void. |
| **Insurance Ombudsman Rules 2017** | Pecuniary jurisdiction up to ₹50 Lakhs; awards legally binding on insurers. | Zero court fees; faster than Consumer Courts (NCDRC); enforces payment within 30 days of award. |
| **IRDAI PPI Regulations 2024** | Mandatory 15-day grievance resolution window for Insurer's GRO. | Enforces a strict 15-calendar-day countdown in the appeal letter before Ombudsman escalation. |
| **IRDAI Proportionate Deduction Norms** | Proportionate deductions cannot be applied across the board. | Bars arbitrary haircuts on ICU, implants, diagnostics, and doctor fees without hospital tariff proof. |
| **IRDAI Circular Ref: 216/09/2011** | Delay in intimation cannot be sole ground for claim rejection. | Protects genuine motor/health claims delayed due to medical shock or reasonable causes. |

---

## 💻 Architecture & Tech Stack

ClaimSetu is deliberately engineered with **Zero Dependencies** to ensure instant loading, maximum privacy, and complete immutability:

```
ClaimSetu/
├── index.html        # Semantic HTML5, accessible structure & SVG iconography
├── style.css         # Modern responsive CSS, Indian fintech theme, print stylesheet
├── script.js         # State machine, Indian preset rules, Gemini REST client, DOM engine
└── README.md         # Full project documentation & deployment guide
```

- **Zero NPM / Node dependencies** (No `node_modules`, no webpack/vite build step).
- **Total Payload Size**: ~160 KB (well below the 10 MB limit).
- **100% Client-Side Privacy**: Runs in the browser. Medical records and API keys never touch any intermediary server.
- **Responsive & No Horizontal Overflow**: Fits cleanly on mobile, tablet, and desktop viewports without clipping or horizontal scrollbars.

---

## 🛠️ Local Setup Guide

ClaimSetu requires no compilation or local server. You can run it immediately:

### Option 1: Direct File Open
Simply double-click `index.html` in your file explorer to open it in Chrome, Edge, Safari, or Firefox.

### Option 2: Using Python HTTP Server (Recommended)
In PowerShell or terminal inside the `ClaimSetu` directory:
```powershell
python -m http.server 8000
```
Open your browser at:
```
http://localhost:8000
```

### Option 3: VS Code Live Server
Right-click `index.html` inside VS Code and choose **"Open with Live Server"**.

---

## 🔑 Using Google Gemini 2.5 Flash (Live AI Mode)

ClaimSetu functions fully in **Instant Demo Mode** without any API key. If you wish to use live LLM reasoning:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and generate a free API key.
2. In ClaimSetu, click the **"API Key"** button in the header.
3. Paste your key (`AIzaSy...`) and click **"Save Key"**.
4. The key is saved strictly in your browser's `localStorage` (`claimsetu_gemini_key`) and directly sends requests to:
   ```
   https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_KEY
   ```
5. You can click **"Clear Key"** anytime to delete it from browser memory.

---

## 📦 Git Setup & Single-Branch `main` Push

To push this repository to GitHub or GitLab:

```powershell
# 1. Initialize git repository
git init

# 2. Add all files
git add index.html style.css script.js README.md

# 3. Create initial commit
git commit -m "feat: complete ClaimSetu AI insurance decoder & appeal copilot"

# 4. Set branch to main
git branch -M main

# 5. Link to your GitHub remote repository
git remote add origin https://github.com/YOUR_USERNAME/ClaimSetu.git

# 6. Push to main branch
git push -u origin main
```

---

## 🌐 Render Static Site Deployment

Deploy ClaimSetu for free on [Render](https://render.com) in under 60 seconds:

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Static Site**.
3. Connect your GitHub/GitLab repository (`ClaimSetu`).
4. Configure deployment settings:
   - **Name**: `claimsetu` (or your preferred name)
   - **Branch**: `main`
   - **Build Command**: *(leave completely blank)*
   - **Publish Directory**: `.` *(a single dot representing the root folder)*
5. Click **Create Static Site**.
6. Render will publish your site in seconds at `https://claimsetu.onrender.com`.

---

## ⚖️ Educational & Regulatory Disclaimer

> **IMPORTANT NOTICE:**  
> ClaimSetu (क्लेमसेतु) is an independent, open-source computational legal-tech research project and educational copilot. ClaimSetu is **not** an insurance company, insurance broker, Third-Party Administrator (TPA), or law firm, and is not officially affiliated with the Insurance Regulatory and Development Authority of India (IRDAI) or the Council for Insurance Ombudsmen. 
>
> The analysis, contestability ratings, checklists, and statutory appeal drafts generated by this application are for informational and educational advocacy purposes only and do not constitute formal legal counsel. For complex court litigation or specialized advice, policyholders are advised to consult a registered advocate, an IRDAI-licensed insurance broker, or approach the nearest Insurance Ombudsman Office directly.

---

## 🔗 Official Indian Statutory Portals
- **IRDAI Official Website**: [irdai.gov.in](https://irdai.gov.in/)
- **IRDAI Bima Bharosa Grievance Portal**: [bimabharosa.irdai.gov.in](https://bimabharosa.irdai.gov.in/) *(Toll Free: 155255 / 1800 4254 732)*
- **Council for Insurance Ombudsmen (CIO)**: [cioins.co.in](https://www.cioins.co.in/)
- **National Consumer Disputes Redressal Commission (NCDRC)**: [ncdrc.nic.in](http://ncdrc.nic.in/)
