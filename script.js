/**
 * ClaimSetu (क्लेमसेतु) — Core Engine
 * AI Insurance Policy Decoder & Claim Appeal Copilot for India
 * IRDAI Regulations | Section 45 Insurance Act 1938 | Insurance Ombudsman Rules 2017
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. STATE & STORAGE MANAGEMENT
  // ==========================================
  const state = {
    mode: 'demo', // 'demo' | 'gemini'
    activeTab: 'rejection', // 'rejection' | 'xray' | 'architecture'
    geminiApiKey: localStorage.getItem('claimsetu_gemini_key') || '',
    lastRejectionData: null,
    lastXrayData: null
  };

  // ==========================================
  // 2. DOM ELEMENTS CACHE
  // ==========================================
  const elements = {
    // Mode & BYOK Controls
    btnModeDemo: document.getElementById('btn-mode-demo'),
    btnModeGemini: document.getElementById('btn-mode-gemini'),
    btnSettingsToggle: document.getElementById('btn-settings-toggle'),
    byokDrawer: document.getElementById('byok-drawer'),
    geminiApiKeyInput: document.getElementById('gemini-api-key'),
    btnSaveKey: document.getElementById('btn-save-key'),
    btnClearKey: document.getElementById('btn-clear-key'),
    btnToggleKeyVisibility: document.getElementById('btn-toggle-key-visibility'),
    byokStatus: document.getElementById('byok-status'),
    toastContainer: document.getElementById('toast-container'),

    // Nav Tabs
    tabBtnRejection: document.getElementById('tab-btn-rejection'),
    tabBtnXray: document.getElementById('tab-btn-xray'),
    tabBtnArchitecture: document.getElementById('tab-btn-architecture'),
    tabPanelRejection: document.getElementById('tab-rejection'),
    tabPanelXray: document.getElementById('tab-xray'),
    tabPanelArchitecture: document.getElementById('tab-architecture'),

    // Rejection Form & Inputs
    formRejection: document.getElementById('form-rejection'),
    policyType: document.getElementById('policy-type'),
    claimAmount: document.getElementById('claim-amount'),
    amountInWords: document.getElementById('amount-in-words'),
    insurerName: document.getElementById('insurer-name'),
    policyNumber: document.getElementById('policy-number'),
    rejectionDate: document.getElementById('rejection-date'),
    rejectionText: document.getElementById('rejection-text'),
    rejectionCharCount: document.getElementById('rejection-char-count'),
    btnClearRejection: document.getElementById('btn-clear-rejection'),

    // Rejection Progress & Results
    progressContainerRejection: document.getElementById('progress-container-rejection'),
    progressRejectionTitle: document.getElementById('progress-rejection-title'),
    progressBarRejection: document.getElementById('progress-bar-rejection'),
    resultsRejection: document.getElementById('results-rejection'),
    ombudsmanBanner: document.getElementById('ombudsman-jurisdiction-banner'),

    // Step A Elements
    contestabilityBadge: document.getElementById('contestability-badge'),
    auditPrimaryGround: document.getElementById('audit-primary-ground'),
    auditContestabilityScore: document.getElementById('audit-contestability-score'),
    auditLegalShield: document.getElementById('audit-legal-shield'),
    auditInsurerAllegation: document.getElementById('audit-insurer-allegation'),
    auditLawCounter: document.getElementById('audit-law-counter'),
    auditRationaleText: document.getElementById('audit-rationale-text'),

    // Step B Elements
    checklistItemsContainer: document.getElementById('checklist-items-container'),
    btnPrintChecklist: document.getElementById('btn-print-checklist'),

    // Step C Elements
    appealLetterOutput: document.getElementById('appeal-letter-output'),
    btnCopyAppeal: document.getElementById('btn-copy-appeal'),
    copyAppealText: document.getElementById('copy-appeal-text'),
    btnDownloadAppeal: document.getElementById('btn-download-appeal'),

    // X-Ray Form & Inputs
    formXray: document.getElementById('form-xray'),
    xrayPolicyType: document.getElementById('xray-policy-type'),
    xraySumInsured: document.getElementById('xray-sum-insured'),
    xrayText: document.getElementById('xray-text'),
    xrayCharCount: document.getElementById('xray-char-count'),
    btnClearXray: document.getElementById('btn-clear-xray'),

    // X-Ray Progress & Results
    progressContainerXray: document.getElementById('progress-container-xray'),
    progressXrayTitle: document.getElementById('progress-xray-title'),
    progressBarXray: document.getElementById('progress-bar-xray'),
    resultsXray: document.getElementById('results-xray'),

    // X-Ray Output Elements
    xrayCategoryBadge: document.getElementById('xray-category-badge'),
    xrayProductArchetype: document.getElementById('xray-product-archetype'),
    xrayArchetypeNote: document.getElementById('xray-archetype-note'),
    xrayRealIrr: document.getElementById('xray-real-irr'),
    xrayVerdict: document.getElementById('xray-verdict'),
    xrayRealityNarrative: document.getElementById('xray-reality-narrative'),
    xrayTrapsList: document.getElementById('xray-traps-list'),
    xrayDisclosuresList: document.getElementById('xray-disclosures-list'),
    xrayRecordsList: document.getElementById('xray-records-list')
  };

  // ==========================================
  // 3. REALISTIC INDIAN PRESET DATA
  // ==========================================
  const PRESETS = {
    // Preset 1: Cataract & Room-Rent Cap Breach with Proportionate Deduction
    'preset-roomrent': {
      policyType: 'Health',
      claimAmount: 385000,
      insurerName: 'Star Health & Allied Insurance',
      policyNumber: 'P/161114/01/2023/004812',
      rejectionDate: '2026-02-14',
      rejectionText: `RE: Repudiation & Proportionate Deduction Advice for Claim Ref: CIR/2026/894120

Dear Policyholder,
With reference to your hospitalization at Fortis Hospital, New Delhi for Cataract Surgery and Bilateral Phacoemulsification from 10-Jan-2026 to 12-Jan-2026 with total bill of Rs. 3,85,000/-.

Upon scrutiny by our medical claims panel:
1. As per Policy Clause 3.2, your room rent eligibility is capped at 1% of Sum Insured (1% of Rs. 3,00,000 = Rs. 3,000/day). The insured opted for Single Deluxe Room billed at Rs. 9,500/day.
2. In terms of Clause 3.2(b), all associated medical expenses including Surgeon Fees (Rs. 1,20,000), Anesthetist Fees (Rs. 35,000), Operation Theater Charges (Rs. 65,000), and Diagnostic Investigation Charges have been subjected to PROPORTIONATE DEDUCTION of 68.4%.
3. Out of total bill of Rs. 3,85,000/-, only Rs. 1,21,000/- is approved. The deduction of Rs. 2,64,000/- is repudiated and stands non-payable.
4. Additionally, Premium Monofocal/Toric Foldable IOL lens cost has been restricted to tariff cap of Rs. 25,000 under Clause 4.8.`
    },

    // Preset 2: Cardiac Stent & Pre-Existing Disease (PED) Repudiation past 3 years (Section 45 Protection)
    'preset-ped': {
      policyType: 'Health',
      claimAmount: 650000,
      insurerName: 'HDFC ERGO General Insurance',
      policyNumber: '2819/2021/883901/00/000',
      rejectionDate: '2026-01-28',
      rejectionText: `RE: Repudiation Notice under Section 4.1 (Non-Disclosure of Material Facts) — Claim ID: HD/MED/2026/33918

Dear Sir/Madam,
We refer to your reimbursement claim of Rs. 6,50,000/- submitted for Emergency Coronary Angioplasty with Drug Eluting Stents (DES) at Apollo Hospitals, Chennai.

Findings of TPA Investigation:
1. Patient's indoor case records (ICP) mention a past history of Essential Hypertension for 6 years and Type-2 Diabetes Mellitus on oral hypoglycemics.
2. In the initial proposal form dated 14-Aug-2021, the proposer marked 'NO' to the query: "Have you ever suffered from or taken medication for high blood pressure or diabetes?"
3. Under the doctrine of Utmost Good Faith (Uberrima Fides) and Policy Exclusion Clause 4.1 (Non-disclosure of Material Facts / Pre-Existing Disease), the insurer has repudiated the claim in toto.
4. Policy is hereby canceled ab-initio and no refund of premium is admissible.`
    },

    // Preset 3: Motor Accident Claim - Delayed FIR & Delayed Intimation
    'preset-motor': {
      policyType: 'Motor',
      claimAmount: 195000,
      insurerName: 'ICICI Lombard General Insurance',
      policyNumber: '3001/MI-9923841/00/000',
      rejectionDate: '2026-02-02',
      rejectionText: `RE: Repudiation of Own Damage Motor Claim — Claim No: MOT-2026-449102

Dear Vehicle Owner (Reg No: DL-3C-AZ-4419),
With reference to your claim for accidental damage repair amounting to Rs. 1,95,000/- at Authorized Hyundai Workshop:

Grounds for Repudiation:
1. The accident occurred on 12-Jan-2026 on NH-48 near Gurugram. However, claim intimation was given to the insurer on 20-Jan-2026 (a delay of 8 days).
2. General Condition 1 of the Private Car Package Policy stipulates: "Notice shall be given in writing to the Company immediately upon the occurrence of any accidental loss or damage."
3. Furthermore, the Police General Diary (GD) entry was registered 6 days post accident.
4. Due to the breach of Condition 1 (delayed intimation and delayed police reporting deprived insurer of opportunity to inspect vehicle at spot), your claim is repudiated in its entirety.`
    },

    // Preset 4 (X-Ray): Money-Back & Endowment Agent Pitch
    'preset-endowment': {
      policyType: 'Life-Endowment',
      sumInsured: 'Annual Premium: ₹1,00,000 | Sum Assured: ₹10,00,000',
      text: `SPECIAL FESTIVE AGENT BROCHURE — "Jeevan Suraksha Maha-Dhan Yojana"
Guaranteed 250% Returns + Triple Tax Benefits under 80C & 10(10D)!

Plan Highlights:
• Pay just Rs. 1,00,000/- yearly for 10 years (Total Deposit: Rs. 10 Lakhs).
• Premium Holiday: Relax from Year 11 to Year 14.
• Guaranteed Money-Back: Receive Rs. 1,50,000/- every single year from Year 15 to Year 25 (11 payouts totaling Rs. 16.5 Lakhs).
• Bumper Maturity Bonus: On Year 25, receive Lump-Sum Guaranteed Maturity of Rs. 15,00,000/-.
• Total Guaranteed Payout: Rs. 31,50,000/- (More than 3 TIMES your deposit!).
• Life Cover: ₹10,00,000 in-built life cover throughout the tenure of 25 years.
• Absolute Safety, Sovereign Backing & Zero Market Risk.`
    },

    // Preset 5 (X-Ray): Low-Cost Mediclaim with Hidden Sub-limits
    'preset-mediclaim-traps': {
      policyType: 'Health',
      sumInsured: '₹5,00,000 Floater (Self + Spouse)',
      text: `Affordable Family Health Shield Plan — ₹5,00,000 Sum Insured at just ₹6,200/year!
Policy Schedule Key Features & Conditions:
1. Room Rent & Nursing Charges: Capped at 1% of Sum Insured per day for Normal Room, and 2% of Sum Insured per day for ICU. If insured occupies higher category room, all associated medical expenses will be proportionately reduced.
2. Co-Payment: A mandatory 20% co-payment applies to each and every claim for members aged 55 years and above.
3. Specific Illness Waiting Period: 24 months for Cataract, Hernia, Hysterectomy, Calculus diseases, Joint Replacement. Cataract payout capped at Rs. 24,000 per eye.
4. Modern Treatment Methods: Robotic surgery, Stem cell therapy, deep brain stimulation capped at 25% of Sum Insured.
5. Consumables & Non-Medical Items: Gloves, PPE kits, oxygen masks, syringes, thermometer (List I, II, III, IV) are permanently non-payable.`
    }
  };

  // ==========================================
  // 4. HELPER UTILITIES
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.25s forwards';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  function formatIndianCurrency(num) {
    if (isNaN(num) || num === null) return '₹0';
    const val = Number(num);
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crores`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  }

  function updateAmountInWords() {
    const val = parseFloat(elements.claimAmount.value);
    if (!val || val <= 0) {
      elements.amountInWords.textContent = 'Enter amount in INR';
      elements.amountInWords.className = 'input-hint';
      return;
    }
    const formatted = formatIndianCurrency(val);
    const ombudsmanEligible = val <= 5000000;
    if (ombudsmanEligible) {
      elements.amountInWords.textContent = `${formatted} • Eligible for Insurance Ombudsman (Pecuniary Limit: ₹50 Lakhs)`;
      elements.amountInWords.className = 'input-hint text-success';
    } else {
      elements.amountInWords.textContent = `${formatted} • Exceeds Ombudsman Limit (>₹50L) → State/National Consumer Commission (NCDRC) Route`;
      elements.amountInWords.className = 'input-hint text-warning';
    }
  }

  function updateCharCount(textarea, counterElem) {
    const len = textarea.value.length;
    counterElem.textContent = `${len.toLocaleString('en-IN')} characters`;
  }

  // ==========================================
  // 5. BYOK & MODE TOGGLES
  // ==========================================
  function initByok() {
    if (state.geminiApiKey) {
      elements.geminiApiKeyInput.value = state.geminiApiKey;
      elements.byokStatus.textContent = 'Active Gemini Key saved in browser localStorage.';
      elements.byokStatus.style.color = 'var(--emerald)';
    }

    elements.btnSettingsToggle.addEventListener('click', () => {
      const isHidden = elements.byokDrawer.classList.toggle('hidden');
      elements.btnSettingsToggle.setAttribute('aria-expanded', !isHidden);
    });

    elements.btnToggleKeyVisibility.addEventListener('click', () => {
      const isPass = elements.geminiApiKeyInput.type === 'password';
      elements.geminiApiKeyInput.type = isPass ? 'text' : 'password';
      elements.btnToggleKeyVisibility.textContent = isPass ? '🔒' : '👁️';
    });

    elements.btnSaveKey.addEventListener('click', () => {
      const key = elements.geminiApiKeyInput.value.trim();
      if (!key) {
        showToast('Please enter a valid Gemini API key.', 'error');
        return;
      }
      state.geminiApiKey = key;
      localStorage.setItem('claimsetu_gemini_key', key);
      elements.byokStatus.textContent = 'Active Gemini Key saved in browser localStorage.';
      elements.byokStatus.style.color = 'var(--emerald)';
      setMode('gemini');
      showToast('Gemini API Key saved securely in localStorage!', 'success');
      elements.byokDrawer.classList.add('hidden');
    });

    elements.btnClearKey.addEventListener('click', () => {
      localStorage.removeItem('claimsetu_gemini_key');
      state.geminiApiKey = '';
      elements.geminiApiKeyInput.value = '';
      elements.byokStatus.textContent = 'Using Instant Demo Engine (Zero Key Required).';
      elements.byokStatus.style.color = 'var(--text-muted)';
      setMode('demo');
      showToast('API Key removed from browser storage.', 'info');
    });

    elements.btnModeDemo.addEventListener('click', () => setMode('demo'));
    elements.btnModeGemini.addEventListener('click', () => {
      if (!state.geminiApiKey) {
        elements.byokDrawer.classList.remove('hidden');
        elements.geminiApiKeyInput.focus();
        showToast('Please enter your Gemini API Key first to enable Live AI Mode.', 'info');
      } else {
        setMode('gemini');
      }
    });
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === 'demo') {
      elements.btnModeDemo.classList.add('active');
      elements.btnModeDemo.setAttribute('aria-pressed', 'true');
      elements.btnModeGemini.classList.remove('active');
      elements.btnModeGemini.setAttribute('aria-pressed', 'false');
      showToast('Switched to Instant Demo Engine (Preloaded Indian Regulatory Rules)', 'info');
    } else {
      elements.btnModeGemini.classList.add('active');
      elements.btnModeGemini.setAttribute('aria-pressed', 'true');
      elements.btnModeDemo.classList.remove('active');
      elements.btnModeDemo.setAttribute('aria-pressed', 'false');
      showToast('Switched to Live Gemini 2.5 Flash AI Engine', 'success');
    }
  }

  // ==========================================
  // 6. TAB SWITCHING
  // ==========================================
  function initTabs() {
    const tabs = [
      { btn: elements.tabBtnRejection, panel: elements.tabPanelRejection, name: 'rejection' },
      { btn: elements.tabBtnXray, panel: elements.tabPanelXray, name: 'xray' },
      { btn: elements.tabBtnArchitecture, panel: elements.tabPanelArchitecture, name: 'architecture' }
    ];

    tabs.forEach(tab => {
      tab.btn.addEventListener('click', () => {
        tabs.forEach(t => {
          t.btn.classList.remove('active');
          t.btn.setAttribute('aria-selected', 'false');
          t.panel.classList.add('hidden');
        });
        tab.btn.classList.add('active');
        tab.btn.setAttribute('aria-selected', 'true');
        tab.panel.classList.remove('hidden');
        state.activeTab = tab.name;
      });
    });

    // Accordions in Architecture tab
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.toggle('open');
        header.setAttribute('aria-expanded', isOpen);
      });
    });
  }

  // ==========================================
  // 7. PRESET LOADERS
  // ==========================================
  function initPresets() {
    // Tab 1 Presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.preset;
        const preset = PRESETS[key];
        if (!preset) return;

        elements.policyType.value = preset.policyType;
        elements.claimAmount.value = preset.claimAmount;
        elements.insurerName.value = preset.insurerName;
        elements.policyNumber.value = preset.policyNumber;
        elements.rejectionDate.value = preset.rejectionDate;
        elements.rejectionText.value = preset.rejectionText;

        updateAmountInWords();
        updateCharCount(elements.rejectionText, elements.rejectionCharCount);

        // Highlight preset button briefly
        btn.classList.add('active-preset');
        setTimeout(() => btn.classList.remove('active-preset'), 600);

        showToast(`Loaded Preset: ${btn.querySelector('.preset-title').textContent}`, 'info');
        elements.formRejection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    // Tab 2 Presets
    document.querySelectorAll('[data-xray-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.xrayPreset;
        const preset = PRESETS[key];
        if (!preset) return;

        elements.xrayPolicyType.value = preset.policyType;
        elements.xraySumInsured.value = preset.sumInsured;
        elements.xrayText.value = preset.text;

        updateCharCount(elements.xrayText, elements.xrayCharCount);
        showToast(`Loaded Preset: ${btn.querySelector('.preset-title').textContent}`, 'info');
        elements.formXray.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  // ==========================================
  // 8. PROGRESS ANIMATOR (3-STAGE PIPELINE)
  // ==========================================
  async function runProgressPipeline(container, titleElem, barElem, stagePrefix, stages, callback) {
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const stageItems = [
      document.getElementById(`${stagePrefix}-1`),
      document.getElementById(`${stagePrefix}-2`),
      document.getElementById(`${stagePrefix}-3`)
    ];

    // Reset stages
    stageItems.forEach(el => {
      el.className = 'stage-item';
    });
    barElem.style.width = '5%';

    // Stage 1
    stageItems[0].className = 'stage-item active';
    titleElem.textContent = stages[0];
    barElem.style.width = '33%';
    await new Promise(r => setTimeout(r, 650));

    // Stage 2
    stageItems[0].className = 'stage-item completed';
    stageItems[1].className = 'stage-item active';
    titleElem.textContent = stages[1];
    barElem.style.width = '68%';
    await new Promise(r => setTimeout(r, 750));

    // Stage 3
    stageItems[1].className = 'stage-item completed';
    stageItems[2].className = 'stage-item active';
    titleElem.textContent = stages[2];
    barElem.style.width = '94%';

    try {
      const data = await callback();
      barElem.style.width = '100%';
      stageItems[2].className = 'stage-item completed';
      await new Promise(r => setTimeout(r, 350));
      container.classList.add('hidden');
      return data;
    } catch (err) {
      container.classList.add('hidden');
      throw err;
    }
  }

  // ==========================================
  // 9. INSTANT DEMO REJECTION ENGINE (RULE-BASED AUDIT)
  // ==========================================
  function generateDemoRejectionAnalysis(policyType, claimAmount, insurer, policyNo, rejectionDate, text) {
    const lower = text.toLowerCase();
    const amountVal = parseFloat(claimAmount) || 250000;
    const formattedAmount = formatIndianCurrency(amountVal);
    const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const targetInsurer = insurer || 'The Insurer / Third Party Administrator (TPA)';
    const targetPolicyNo = policyNo || 'POL/CLAIM/' + Math.floor(100000 + Math.random() * 900000);

    let primaryGround = 'Policy Clause Exclusion & Documentation Dispute';
    let contestabilityScore = 'High Contestability';
    let contestabilityClass = 'contestability-high';
    let legalShield = 'IRDAI Master Circular & Ombudsman Rules 2017';
    let allegations = [];
    let counters = [];
    let rationale = '';
    let checklist = [];

    // DETECTION LOGIC BASED ON TEXT PATTERNS
    if (lower.includes('room') || lower.includes('proportionate') || lower.includes('capping') || lower.includes('tariff') || lower.includes('cataract')) {
      primaryGround = 'Room-Rent Sub-Limit & Proportionate Deduction Overreach';
      contestabilityScore = 'High (85% Recovery Potential)';
      contestabilityClass = 'contestability-high';
      legalShield = 'IRDAI Guidelines on Proportionate Deduction & Ombudsman Precedents';

      allegations = [
        'Insurer applied proportionate deduction on the entire medical bill because room rent exceeded 1% of Sum Insured.',
        'Doctor/Surgeon fee, Anesthesia charges, and Operation Theater charges were slashed proportionately by over 50%.',
        'Implant / Lens cost restricted arbitrarily below the actual hospital billing tariff.'
      ];

      counters = [
        'Under IRDAI circulars, proportionate deductions cannot be levied on fixed charges like ICU tariffs, medicines, diagnostic investigations, or medical implants.',
        'Multiple Insurance Ombudsman awards (e.g., Delhi & Mumbai Ombudsmen) have repeatedly held that doctor consultation fees cannot be proportionately cut unless hospital explicitly tiers doctor fees strictly to room categories.',
        'The insurer must provide the hospital tariff sheet proving that surgeon fees were variable based strictly on room category before slashing.'
      ];

      rationale = 'Insurers routinely misapply proportionate deduction as a blanket haircut across the entire bill. However, under settled Insurance Ombudsman jurisprudence and IRDAI guidelines, only room rent and nursing charges can be capped, while medicines, diagnostics, and essential surgery costs must be reimbursed at actuals.';

      checklist = [
        { title: 'Itemized Hospital Tariff Schedule', desc: 'Obtain a signed certificate from the hospital billing desk proving surgeon & OT charges were standard and not tied to room class.' },
        { title: 'Treating Doctor Medical Necessity Note', desc: 'Certificate from the operating surgeon stating that admission and procedures were medically necessary.' },
        { title: 'Itemized Pharmacy & Implant Invoices', desc: 'Detailed bills with batch numbers for IOL lens/implants and medicines to refute proportionate deductions.' },
        { title: 'Copy of Policy Schedule with Room Rent Clause', desc: 'Highlighting absence of explicit notice regarding proportionate deduction on non-room heads.' }
      ];

    } else if (lower.includes('non-disclosure') || lower.includes('pre-existing') || lower.includes('ped') || lower.includes('hypertension') || lower.includes('diabetes') || lower.includes('section 45')) {
      primaryGround = 'Non-Disclosure Repudiation vs. Section 45 3-Year Indisputability';
      contestabilityScore = 'Very High (Sec 45 Absolute Shield)';
      contestabilityClass = 'contestability-high';
      legalShield = 'Section 45 of Insurance Act 1938 & IRDAI 36-Month Moratorium Norms';

      allegations = [
        'Insurer claimed non-disclosure of past hypertension, diabetes, or lifestyle conditions in the initial proposal form.',
        'Insurer repudiated claim in toto citing doctrine of utmost good faith (uberrima fides) and canceled policy.',
        'Alleged that the current cardiac or surgical ailment is a secondary complication of undisclosed conditions.'
      ];

      counters = [
        'Under Section 45 of the Insurance Act 1938 (amended 2015), no policy can be questioned or repudiated on any ground whatsoever after the expiry of 3 continuous years from issuance or revival.',
        'The Supreme Court of India in landmark rulings (e.g., Manmohan Nanda vs. United India Insurance) ruled that common lifestyle conditions like mild hypertension do not constitute material suppression unless directly causal.',
        'IRDAI regulations 2024 mandate that after 36 months of continuous coverage, pre-existing diseases must be covered without dispute.'
      ];

      rationale = 'If your policy has been continuously active for 3 or more years, Section 45 of the Insurance Act 1938 acts as an impregnable statutory shield. The insurer is legally precluded from repudiating on grounds of non-disclosure or pre-existing diseases after 36 months.';

      checklist = [
        { title: 'Continuous Renewal Receipts (3+ Years)', desc: 'Proof of policy continuity without break to invoke Section 45 statutory immunity.' },
        { title: 'Treating Physician Nexus Certificate', desc: 'Attestation that current acute condition has no direct causal nexus with past asymptomatic markers.' },
        { title: 'Initial Proposal Form Copy & Medical Exam Record (MER)', desc: 'Documentary proof that insurer conducted pre-issuance tele-underwriting or medicals.' },
        { title: 'Discharge Summary & Indoor Case Papers (ICP)', desc: 'Certified indoor case papers from the hospital proving prompt and accurate disclosures during admission.' }
      ];

    } else if (lower.includes('motor') || lower.includes('delay') || lower.includes('intimation') || lower.includes('fir') || lower.includes('theft')) {
      primaryGround = 'Procedural Repudiation for Delayed Intimation / Late Police Report';
      contestabilityScore = 'High (IRDAI Circular Ref: IRDA/HLTH/MISC/CIR/216/09/2011)';
      contestabilityClass = 'contestability-high';
      legalShield = 'IRDAI Circular on Rejection of Claims for Delay in Intimation';

      allegations = [
        'Policyholder delayed intimation to the insurer by several days beyond the 24/48 hour contractual requirement.',
        'Police FIR or General Diary (GD) was lodged with a delay, allegedly depriving insurer of spot inspection.',
        'Insurer repudiated entire claim citing breach of General Condition 1 of the policy.'
      ];

      counters = [
        'IRDAI vide circular IRDA/HLTH/MISC/CIR/216/09/2011 explicitly instructed all insurers that genuine claims CANNOT be rejected merely on the grounds of technical delay in intimation if substantiated by reasonable causes.',
        'The Supreme Court in Om Prakash vs. National Insurance Co. held that insurance contracts are contracts of indemnity and technical delays should not defeat the genuine purpose of insurance when the occurrence is undisputed.',
        'The condition of immediate intimation is directory, not mandatory, when the incident itself is proven genuine via police GD and workshop job cards.'
      ];

      rationale = 'IRDAI explicitly bars insurers from operating as loan sharks rejecting claims on hyper-technical clerical timelines. As long as the accident or event is genuine and verified by authorities, delay in intimation alone is legally unsustainable before the Insurance Ombudsman.';

      checklist = [
        { title: 'Affidavit Explaining Delay Reason', desc: 'Affidavit/written letter explaining emergency circumstances (e.g. medical treatment, shock, travel) causing intimation delay.' },
        { title: 'Police General Diary (GD) or FIR Certified Copy', desc: 'Stamped copy from the local police station confirming the accident/theft record.' },
        { title: 'Authorized Workshop Job Card & Estimate', desc: 'Original estimate with time-stamps proving vehicle was towed directly to authorized repair center.' },
        { title: 'Photographs of Spot Damage & Geo-tagged Metadata', desc: 'Visual proof of accidental impact corroborating the mechanical damages claimed.' }
      ];

    } else {
      primaryGround = 'Ambiguous Policy Exclusion & Interpretation Deficit';
      contestabilityScore = 'Medium-to-High (Contra Proferentem Rule)';
      contestabilityClass = 'contestability-medium';
      legalShield = 'Doctrine of Contra Proferentem & Consumer Protection Act 2019';

      allegations = [
        'Insurer cited exclusionary clause without demonstrating that the exclusion was explicitly explained to the policyholder during issuance.',
        'Deduction claimed under unverified reasonable & customary charges or documentation deficiencies.'
      ];

      counters = [
        'Under the doctrine of Contra Proferentem, any ambiguity in standard form insurance contracts drafted solely by the insurer must be interpreted strictly in favor of the insured.',
        'IRDAI Protection of Policyholders\' Interests Regulations 2024 mandate that insurers must prove exclusions were highlighted in the Key Feature Document (KFD) provided at policy inception.'
      ];

      rationale = 'Insurers bear the strict legal burden of proving that an exclusion clause applies squarely. In the absence of signed acceptance of exclusionary riders, the Ombudsman routinely orders payment in full.';

      checklist = [
        { title: 'Itemized Final Hospital / Repair Bill', desc: 'Breakdown of all billed heads with receipt vouchers.' },
        { title: 'Treating Doctor Justification Letter', desc: 'Clarifying the clinical rationale for the specific treatment or hospitalization protocol.' },
        { title: 'Full Policy Schedule with Terms & Conditions', desc: 'Checking whether the Key Feature Document (KFD) was provided and highlighted.' }
      ];
    }

    // FORMAL APPEAL LETTER GENERATOR
    const ombudsmanJurisdictionNote = amountVal <= 5000000
      ? `TAKE FURTHER NOTICE that as the disputed claim amount of ${formattedAmount} falls well within the pecuniary jurisdiction of the Honorable Insurance Ombudsman (up to Rs. 50,00,000/- under Rule 17(1) of the Insurance Ombudsman Rules, 2017), the undersigned shall immediately lodge a formal complaint on the IRDAI Bima Bharosa portal and approach the Insurance Ombudsman Office having territorial jurisdiction upon expiry of your statutory 15-day window.`
      : `TAKE FURTHER NOTICE that as the disputed claim amount of ${formattedAmount} exceeds Rs. 50,00,000/-, upon expiry of the statutory 15-day resolution timeline, the undersigned shall initiate formal litigation before the State/National Consumer Disputes Redressal Commission (NCDRC) under the Consumer Protection Act, 2019, claiming the principal amount with 18% penal interest and punitive damages for gross deficiency of service.`;

    const appealLetter = `DATE: ${currentDate}

TO:
The Grievance Redressal Officer (GRO)
${targetInsurer}
Corporate Grievance Redressal Cell / Claims Department

SUBJECT: STATUTORY GRIEVANCE APPEAL & FORMAL NOTICE UNDER IRDAI PROTECTION OF POLICYHOLDERS' INTERESTS REGULATIONS, 2024
RE: UNLAWFUL REPUDIATION / ARBITRARY DEDUCTION OF CLAIM
• Policy Number: ${targetPolicyNo}
• Claim Reference ID: CIR/${Math.floor(100000 + Math.random() * 900000)}
• Disputed / Rejected Amount: ${formattedAmount} (Rupees ${numberToWordsIndian(amountVal)} only)
• Policyholder / Insured Name: Abhishek Kumar

Respected Grievance Redressal Officer,

I am writing this formal statutory representation to record my emphatic protest and appeal against the summary repudiation / arbitrary deduction communicated by your claims department on ${rejectionDate || 'the captioned date'}.

1. FACTUAL MATRIX:
The insured was covered under ${policyType} Insurance Policy No. ${targetPolicyNo}, issued by your esteemed company in utmost good faith and kept continuously active with timely premium payments. A legitimate claim amounting to ${formattedAmount} was submitted along with complete bills, discharge summary, and treating doctor records. 

To my utmost dismay, the claims department has repudiated/deducted this claim citing:
"${allegations[0] || 'Clause exclusions'}"

2. STATUTORY GROUNDS & LEGAL DEFENSE:
The aforementioned denial is legally unsustainable, contrary to IRDAI mandates, and violative of settled law for the following reasons:

A. VIOLATION OF STATUTORY IMMUNITY & IRDAI DIRECTIVES:
${counters[0]}

B. MISAPPLICATION OF CONTRACTUAL PROVISIONS:
${counters[1]}

C. DOCTRINE OF CONTRA PROFERENTEM & ESTABLISHED OMBUDSMAN JURISPRUDENCE:
${counters[2] || 'Under established legal doctrines, boilerplate exclusions cannot override the indemnity purpose of insurance.'}

3. PREJUDICE CAUSED & SUMMARY OF RELIEF SOUGHT:
The arbitrary repudiation/deduction of ${formattedAmount} has caused tremendous mental agony, financial distress, and constitutes severe deficiency of service under Section 2(11) of the Consumer Protection Act, 2019. 

In light of the above facts and statutory provisions, you are respectfully called upon to:
a) Re-open and re-examine Claim Reference ID CIR/${Math.floor(100000 + Math.random() * 900000)} in light of the medical evidence and statutory provisions cited herein;
b) Settle and disburse the balance legitimate claim amount of ${formattedAmount} directly to my registered bank account;
c) Comply with the statutory 15-calendar-day timeline stipulated under the IRDAI (Protection of Policyholders' Interests and Allied Matters of Insurers) Regulations, 2024.

4. STATUTORY NOTICE OF ESCALATION:
${ombudsmanJurisdictionNote}

I look forward to an expeditious and fair resolution within 15 calendar days from receipt of this formal representation.

Yours sincerely,

[Abhishek Kumar]
Policyholder / Insured
Mobile: +91-98XXXXXXXX
Email: abhishekkumr2444@gmail.com
Address: New Delhi, India

ENCLOSURES:
1. Complete certified hospital/repair invoices and itemized receipt vouchers.
2. Treating Doctor Certificate of Medical Necessity / Police Report.
3. Copy of Original Policy Schedule & continuous renewal certificates.
4. Copy of the arbitrary rejection notice under appeal.`;

    return {
      primaryGround,
      contestabilityScore,
      contestabilityClass,
      legalShield,
      allegations,
      counters,
      rationale,
      checklist,
      appealLetter,
      amountVal,
      formattedAmount
    };
  }

  // ==========================================
  // 10. INSTANT DEMO X-RAY ENGINE
  // ==========================================
  function generateDemoXrayAnalysis(policyType, sumInsured, text) {
    const lower = text.toLowerCase();

    let archetype = 'Traditional Endowment / Money-Back Policy';
    let archetypeNote = 'Disguised Low-Yield Savings Product with Sub-Optimal Life Cover';
    let realIrr = '4.6% - 5.2% p.a.';
    let verdict = 'Poor Inflation-Adjusted Return';
    let categoryBadge = 'Low Protection / High Opportunity Cost';
    let narrative = '';
    let traps = [];
    let disclosures = [];
    let records = [];

    if (policyType === 'Life-Endowment' || lower.includes('money-back') || lower.includes('guaranteed') || lower.includes('endowment') || lower.includes('bonus')) {
      archetype = 'Endowment / Guaranteed Savings Plan';
      archetypeNote = 'Bundled Savings with Inadequate Death Benefit (10x Annual Premium)';
      realIrr = '4.8% - 5.4% p.a. (Post-Tax)';
      verdict = 'Sub-Inflation Yield (Wealth Destroyer)';
      categoryBadge = 'High Cost / Low Protection';

      narrative = `
        <p><strong>The "Triple Guaranteed Returns" Illusion:</strong> Agents frequently advertise phrases like "Receive ₹31.5 Lakhs on a ₹10 Lakh deposit — more than 3x your money!". However, financial mathematics reveals that receiving ₹31.5 Lakhs spread over 25 long years translates to a compounded annual Internal Rate of Return (IRR) of only <strong>~5.1% per annum</strong>.</p>
        <p><strong>The Opportunity Cost Reality Check:</strong> With Indian retail inflation averaging 5.5% - 6.0% and Public Provident Fund (PPF) offering 7.1% guaranteed tax-free, this policy <em>loses purchasing power over time</em>. If an investor instead buys a pure Term Life Plan (giving ₹1 Crore cover for ~₹12,000/year) and invests the remaining ₹88,000/year in a Nifty 50 Index Fund or PPF, the expected corpus at Year 25 would exceed <strong>₹85 Lakhs to ₹1.10 Crores</strong> with 10x higher life protection!</p>
      `;

      traps = [
        { name: 'Surrender Charge Trap', level: 'High Trap', badge: 'badge-danger', clause: 'Special Surrender Value (SSV)', impact: 'If you discontinue the policy within the first 3 years, you lose 65% to 80% of all paid premiums. Liquidity is virtually locked with punitive surrender penalty scales.' },
        { name: 'Severe Underinsurance Risk', level: 'High Trap', badge: 'badge-danger', clause: 'Sum Assured = 10x Premium', impact: 'A ₹1 Lakh premium affords merely ₹10 Lakhs life cover. In reality, a family dependent requires at least 15x-20x annual household income in pure term cover.' },
        { name: 'Non-Guaranteed "Bonus" Fine Print', level: 'Watch Out', badge: 'badge-warning', clause: 'Reversionary & Terminal Bonus', impact: 'Brochure tables often project payouts at illustrative 8% gross returns. Under IRDAI rules, actual bonus declaration is at the insurer\'s discretion and has historically lagged below 5%.' }
      ];

      disclosures = [
        'Disclose exact existing life insurance portfolio value (Human Life Value ceiling).',
        'Declare any high-risk hobbies (paragliding, scuba diving, racing) or international travel to conflict zones.',
        'Disclose accurate annual income with ITR V forms; salary slips alone can cause dispute during claim settlement.'
      ];

      records = [
        'Signed copy of the Original Proposal Form (verify agent did not forge answers).',
        'First Premium Receipt (FPR) and Policy Bond with official insurer revenue stamp.',
        'Audio/Video Tele-MER recording or doctor medical examination report.',
        'Annual Premium Payment receipts for Section 80C and Section 10(10D) tax records.'
      ];

    } else {
      // Health / Mediclaim policy analysis
      archetype = 'Comprehensive Health / Mediclaim Policy';
      archetypeNote = 'Hospitalization Indemnity with Hidden Out-of-Pocket Traps';
      realIrr = 'N/A (Pure Indemnity Product)';
      verdict = 'Requires Careful Rider Selection';
      categoryBadge = 'High Potential Haircuts';

      narrative = `
        <p><strong>The Out-of-Pocket Deduction Trap:</strong> While the brochure advertises "Cashless Anywhere across 10,000+ Hospitals", the fine print contains subtle caps that can leave policyholders paying 40% to 60% of hospital bills out-of-pocket during tertiary or emergency care.</p>
        <p><strong>The 1% Room Rent Danger:</strong> A 1% room rent limit on a ₹5 Lakh policy means your eligible room tariff is just ₹5,000/day. If you occupy a room at ₹10,000/day, the insurer invokes <em>Proportionate Deduction</em>, slashing surgeon fees, anesthetist fees, and OT charges by 50%!</p>
      `;

      traps = [
        { name: 'Room Rent Capping & Proportionate Deduction', level: 'High Trap', badge: 'badge-danger', clause: 'Clause 3.1: 1% SI / 2% ICU Cap', impact: 'Breaching room rent cap triggers proportionate deduction across all associated surgical, nursing, and medical expenses, resulting in massive haircuts.' },
        { name: 'Senior Citizen Mandatory Co-Payment', level: 'High Trap', badge: 'badge-danger', clause: 'Clause 4.3: 20% Co-Pay for Age 55+', impact: 'On a ₹6,00,000 bill, you must pay ₹1,20,000 out-of-pocket on every single claim, regardless of hospitalization cause.' },
        { name: 'Specific Illness 24-Month Waiting Period', level: 'Watch Out', badge: 'badge-warning', clause: 'Clause 2.2: 24 Months Moratorium', impact: 'Joint replacements, cataract, hernia, piles, stones, and cysts are strictly non-payable during the first 2 policy years.' },
        { name: 'Exclusion of Consumables & PPE Items', level: 'Watch Out', badge: 'badge-warning', clause: 'Non-Medical Items List I-IV', impact: 'Gloves, PPE, syringes, masks, pulse oximeter probes (accounting for 10-15% of total hospital billing) are excluded unless Consumables Rider is opted.' }
      ];

      disclosures = [
        'Disclose any history of Hypertension, Diabetes, Thyroid, or Elevated Lipids—even if under control with single daily pill.',
        'Declare all past hospitalizations, day-care procedures, biopsies, or OPD investigations in the last 10 years.',
        'Disclose tobacco, smoking, vaping, and alcohol consumption habits truthfully to avoid cancellation under Clause 4.1.'
      ];

      records = [
        'Complete Proposal Form copy showing exact disclosures acknowledged by insurer.',
        'Continuous Policy Renewal Schedules from Day 1 to establish 36-month Section 45 immunity.',
        'Original discharge summaries, indoor case papers, lab reports, and itemized pharmacy bills.'
      ];
    }

    return {
      archetype,
      archetypeNote,
      realIrr,
      verdict,
      categoryBadge,
      narrative,
      traps,
      disclosures,
      records
    };
  }

  // ==========================================
  // 11. LIVE GEMINI 2.5 FLASH API INTEGRATION
  // ==========================================
  async function callGeminiApi(promptText) {
    if (!state.geminiApiKey) {
      throw new Error('NO_API_KEY');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(state.geminiApiKey)}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const message = errJson.error?.message || response.statusText;
      throw new Error(`Gemini API Error (${response.status}): ${message}`);
    }

    const resData = await response.json();
    const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response received from Gemini model.');
    }

    try {
      return JSON.parse(candidateText);
    } catch {
      // In case json is wrapped in markdown code blocks
      const cleaned = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  }

  // ==========================================
  // 12. RENDERERS
  // ==========================================
  function renderRejectionResults(data) {
    elements.resultsRejection.classList.remove('hidden');
    elements.resultsRejection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // 1. Ombudsman Banner
    const isOmbudsman = data.amountVal <= 5000000;
    if (isOmbudsman) {
      elements.ombudsmanBanner.innerHTML = `
        <div class="ombudsman-banner-content">
          <span class="ombudsman-banner-title">
            <span>🏛️</span> Insurance Ombudsman Pecuniary Jurisdiction Confirmed
          </span>
          <span class="ombudsman-banner-sub">
            Disputed Claim Amount of <strong>${data.formattedAmount}</strong> is well within the ₹50,00,000 threshold under Insurance Ombudsman Rules, 2017 (Amended 2021). Awards passed by the Ombudsman are legally binding on the Insurer with zero court fee.
          </span>
        </div>
        <span class="ombudsman-badge-pill">Eligible: &le; ₹50 Lakhs</span>
      `;
    } else {
      elements.ombudsmanBanner.innerHTML = `
        <div class="ombudsman-banner-content">
          <span class="ombudsman-banner-title text-warning">
            <span>⚖️</span> Pecuniary Jurisdiction Alert: Above ₹50 Lakhs Limit
          </span>
          <span class="ombudsman-banner-sub">
            Disputed Claim Amount of <strong>${data.formattedAmount}</strong> exceeds the ₹50 Lakh Ombudsman limit. Your legal escalation path lies with the State Consumer Commission or National Consumer Disputes Redressal Commission (NCDRC) under the Consumer Protection Act, 2019.
          </span>
        </div>
        <span class="ombudsman-badge-pill badge-warning">NCDRC Consumer Route</span>
      `;
    }

    // 2. Step A: Audit
    elements.contestabilityBadge.textContent = data.contestabilityScore;
    elements.contestabilityBadge.className = `contestability-pill ${data.contestabilityClass || 'contestability-high'}`;

    elements.auditPrimaryGround.textContent = data.primaryGround;
    elements.auditContestabilityScore.textContent = data.contestabilityScore;
    elements.auditLegalShield.textContent = data.legalShield;

    // Allegations vs Counters
    elements.auditInsurerAllegation.innerHTML = data.allegations.map(al => `
      <div class="col-point">
        <span class="col-point-bullet">•</span>
        <span>${al}</span>
      </div>
    `).join('');

    elements.auditLawCounter.innerHTML = data.counters.map(ct => `
      <div class="col-point">
        <span class="col-point-bullet">•</span>
        <span>${ct}</span>
      </div>
    `).join('');

    elements.auditRationaleText.textContent = data.rationale;

    // 3. Step B: Checklist
    elements.checklistItemsContainer.innerHTML = data.checklist.map((item, idx) => `
      <label class="checklist-item" for="chk-${idx}">
        <input type="checkbox" id="chk-${idx}">
        <div class="checklist-content">
          <span class="checklist-title">${item.title}</span>
          <span class="checklist-desc">${item.desc}</span>
        </div>
      </label>
    `).join('');

    // Add checkbox toggle classes
    elements.checklistItemsContainer.querySelectorAll('.checklist-item input').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const item = e.target.closest('.checklist-item');
        if (e.target.checked) {
          item.classList.add('checked');
        } else {
          item.classList.remove('checked');
        }
      });
    });

    // 4. Step C: Appeal Letter
    elements.appealLetterOutput.textContent = data.appealLetter;
    state.lastRejectionData = data;
  }

  function renderXrayResults(data) {
    elements.resultsXray.classList.remove('hidden');
    elements.resultsXray.scrollIntoView({ behavior: 'smooth', block: 'start' });

    elements.xrayCategoryBadge.textContent = data.categoryBadge;
    elements.xrayProductArchetype.textContent = data.archetype;
    elements.xrayArchetypeNote.textContent = data.archetypeNote;
    elements.xrayRealIrr.textContent = data.realIrr;
    elements.xrayVerdict.textContent = data.verdict;

    elements.xrayRealityNarrative.innerHTML = data.narrative;

    // Render Traps
    elements.xrayTrapsList.innerHTML = data.traps.map(trap => `
      <div class="trap-card">
        <div class="trap-card-top">
          <span class="trap-name">${trap.name}</span>
          <span class="trap-pill ${trap.badge}">${trap.level}</span>
        </div>
        <div class="trap-clause">Ref: ${trap.clause}</div>
        <div class="trap-impact">${trap.impact}</div>
      </div>
    `).join('');

    // Disclosures
    elements.xrayDisclosuresList.innerHTML = data.disclosures.map(d => `
      <li>
        <span class="shield-bullet">✔</span>
        <span>${d}</span>
      </li>
    `).join('');

    // Records
    elements.xrayRecordsList.innerHTML = data.records.map(r => `
      <li>
        <span class="shield-bullet">🗂️</span>
        <span>${r}</span>
      </li>
    `).join('');

    state.lastXrayData = data;
  }

  // ==========================================
  // 13. FORM SUBMISSIONS
  // ==========================================
  elements.formRejection.addEventListener('submit', async (e) => {
    e.preventDefault();

    const policyType = elements.policyType.value;
    const claimAmount = elements.claimAmount.value;
    const insurer = elements.insurerName.value;
    const policyNo = elements.policyNumber.value;
    const rejectionDate = elements.rejectionDate.value;
    const text = elements.rejectionText.value.trim();

    if (!text) {
      showToast('Please paste the rejection notice or email text.', 'error');
      return;
    }

    const stages = [
      '1. Parsing Rejection Clauses & Identifying Legal Grounds...',
      '2. Cross-referencing IRDAI Guidelines & Section 45 Protections...',
      '3. Formulating GRO Representation & Ombudsman Docket...'
    ];

    try {
      const resultData = await runProgressPipeline(
        elements.progressContainerRejection,
        elements.progressRejectionTitle,
        elements.progressBarRejection,
        'stage-rej',
        stages,
        async () => {
          if (state.mode === 'gemini' && state.geminiApiKey) {
            try {
              const prompt = `You are ClaimSetu, expert in Indian Insurance Law & IRDAI regulations.
Analyze this insurance claim rejection dispute and return STRICT JSON with this schema:
{
  "primaryGround": "String describing specific legal denial ground",
  "contestabilityScore": "High / Medium / Low Contestability with percentage",
  "contestabilityClass": "contestability-high or contestability-medium or contestability-low",
  "legalShield": "Statutory defense citation (e.g. Section 45 of Insurance Act 1938 or IRDAI Proportionate Deduction circulars)",
  "allegations": ["Array of 3 strings summarizing what insurer claimed"],
  "counters": ["Array of 3 strings detailing statutory counter-arguments under Indian law"],
  "rationale": "Clear plain English paragraph explaining why this denial is vulnerable before the Grievance Redressal Officer and Insurance Ombudsman",
  "checklist": [
    {"title": "Document name", "desc": "Why required and how to obtain"}
  ],
  "appealLetter": "Full ready-to-copy statutory appeal letter addressed to Grievance Redressal Officer citing IRDAI 15-day resolution rule and Insurance Ombudsman Rules 2017"
}

DISPUTE DETAILS:
Policy Type: ${policyType}
Disputed Amount: Rs. ${claimAmount}
Insurer/TPA: ${insurer || 'Unknown'}
Policy No: ${policyNo || 'Unknown'}
Rejection Date: ${rejectionDate || 'Recent'}
Rejection Text:
${text}`;

              const parsed = await callGeminiApi(prompt);
              parsed.amountVal = parseFloat(claimAmount) || 0;
              parsed.formattedAmount = formatIndianCurrency(parsed.amountVal);
              return parsed;
            } catch (err) {
              console.warn('Gemini AI failed, gracefully falling back to Instant Demo Engine:', err);
              showToast(`Gemini error: ${err.message}. Seamlessly switched to Instant Demo Engine.`, 'error');
              return generateDemoRejectionAnalysis(policyType, claimAmount, insurer, policyNo, rejectionDate, text);
            }
          } else {
            return generateDemoRejectionAnalysis(policyType, claimAmount, insurer, policyNo, rejectionDate, text);
          }
        }
      );

      renderRejectionResults(resultData);
      showToast('Denial audit and statutory appeal letter generated!', 'success');
    } catch (err) {
      showToast(`Analysis failed: ${err.message}`, 'error');
    }
  });

  elements.formXray.addEventListener('submit', async (e) => {
    e.preventDefault();

    const policyType = elements.xrayPolicyType.value;
    const sumInsured = elements.xraySumInsured.value;
    const text = elements.xrayText.value.trim();

    if (!text) {
      showToast('Please paste brochure text or policy clauses.', 'error');
      return;
    }

    const stages = [
      '1. Auditing Protection vs. Savings / IRR Return Metrics...',
      '2. Scanning for Hidden Sub-Limits, Room-Rent Caps & Co-Pay...',
      '3. Formulating Disclosure & Paperwork Defense Shield...'
    ];

    try {
      const resultData = await runProgressPipeline(
        elements.progressContainerXray,
        elements.progressXrayTitle,
        elements.progressBarXray,
        'stage-xray',
        stages,
        async () => {
          if (state.mode === 'gemini' && state.geminiApiKey) {
            try {
              const prompt = `You are ClaimSetu, expert Indian Insurance Decoder.
Audit this policy brochure / agent pitch / fine-print text for Indian consumers. Return STRICT JSON with this schema:
{
  "categoryBadge": "Short tag e.g. High Cost / Low Protection",
  "archetype": "Product archetype name",
  "archetypeNote": "One line summary of product reality",
  "realIrr": "Estimated real IRR percentage e.g. 4.8% - 5.3% p.a.",
  "verdict": "Clear verdict phrase",
  "narrative": "HTML string containing 2 paragraphs comparing this product against pure Term + Mutual Fund or explaining room-rent trap",
  "traps": [
    {
      "name": "Trap name",
      "level": "High Trap or Watch Out or Safe",
      "badge": "badge-danger or badge-warning or badge-success",
      "clause": "Clause reference or name",
      "impact": "Detailed impact on policyholder pocket"
    }
  ],
  "disclosures": ["Array of 3 strings of mandatory medical/lifestyle disclosures to avoid Section 45 repudiation"],
  "records": ["Array of 3-4 permanent documents to retain for 10+ years"]
}

POLICY CONTEXT:
Category: ${policyType}
Sum Insured / Premium: ${sumInsured || 'Not specified'}
Text:
${text}`;

              return await callGeminiApi(prompt);
            } catch (err) {
              console.warn('Gemini AI failed, gracefully falling back to Instant Demo Engine:', err);
              showToast(`Gemini error: ${err.message}. Seamlessly switched to Instant Demo Engine.`, 'error');
              return generateDemoXrayAnalysis(policyType, sumInsured, text);
            }
          } else {
            return generateDemoXrayAnalysis(policyType, sumInsured, text);
          }
        }
      );

      renderXrayResults(resultData);
      showToast('Policy Fine-Print X-Ray completed successfully!', 'success');
    } catch (err) {
      showToast(`X-Ray failed: ${err.message}`, 'error');
    }
  });

  // ==========================================
  // 14. COPY & DOWNLOAD ACTIONS
  // ==========================================
  elements.btnCopyAppeal.addEventListener('click', async () => {
    const text = elements.appealLetterOutput.textContent;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      elements.copyAppealText.textContent = 'Copied to Clipboard!';
      elements.btnCopyAppeal.style.backgroundColor = 'var(--emerald-dark)';
      showToast('Appeal Letter copied to clipboard! Ready to mail to GRO.', 'success');
      setTimeout(() => {
        elements.copyAppealText.textContent = 'Copy Appeal Letter';
        elements.btnCopyAppeal.style.backgroundColor = '';
      }, 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Appeal Letter copied to clipboard!', 'success');
    }
  });

  elements.btnDownloadAppeal.addEventListener('click', () => {
    const text = elements.appealLetterOutput.textContent;
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClaimSetu_GRO_Appeal_Letter_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded appeal letter as .TXT file', 'info');
  });

  elements.btnPrintChecklist.addEventListener('click', () => {
    window.print();
  });

  // ==========================================
  // 15. INPUT LISTENERS
  // ==========================================
  elements.claimAmount.addEventListener('input', updateAmountInWords);
  elements.rejectionText.addEventListener('input', () => updateCharCount(elements.rejectionText, elements.rejectionCharCount));
  elements.xrayText.addEventListener('input', () => updateCharCount(elements.xrayText, elements.xrayCharCount));

  elements.btnClearRejection.addEventListener('click', () => {
    elements.rejectionText.value = '';
    updateCharCount(elements.rejectionText, elements.rejectionCharCount);
  });

  elements.btnClearXray.addEventListener('click', () => {
    elements.xrayText.value = '';
    updateCharCount(elements.xrayText, elements.xrayCharCount);
  });

  // Pipeline step click navigation
  document.querySelectorAll('.step-nav').forEach(nav => {
    nav.addEventListener('click', () => {
      document.querySelectorAll('.step-nav').forEach(n => n.classList.remove('active'));
      nav.classList.add('active');
      const step = nav.dataset.step;
      const targetCard = document.getElementById(`step-${step}-card`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================
  // 16. NUMBERS TO WORDS HELPER (INDIAN NUMBERING SYSTEM)
  // ==========================================
  function numberToWordsIndian(num) {
    if (!num || isNaN(num)) return 'Zero';
    num = Math.floor(Math.abs(num));
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function twoDigits(n) {
      if (n < 20) return a[n];
      return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    }

    function threeDigits(n) {
      const hundred = Math.floor(n / 100);
      const rest = n % 100;
      let str = '';
      if (hundred) str += a[hundred] + ' Hundred';
      if (rest) str += (str ? ' and ' : '') + twoDigits(rest);
      return str;
    }

    if (num === 0) return 'Zero';

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    const parts = [];
    if (crore) parts.push(threeDigits(crore) + ' Crore');
    if (lakh) parts.push(twoDigits(lakh) + ' Lakh');
    if (thousand) parts.push(twoDigits(thousand) + ' Thousand');
    if (remainder) parts.push(threeDigits(remainder));

    return parts.join(' ');
  }

  // ==========================================
  // 17. INITIALIZATION
  // ==========================================
  initByok();
  initTabs();
  initPresets();
  updateAmountInWords();
});
