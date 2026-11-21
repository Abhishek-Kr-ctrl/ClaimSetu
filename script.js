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
  // 3. THE 4 INDIAN PRESETS (EXACT SCENARIOS)
  // ==========================================
  const PRESETS = {
    // Preset 1: Health Claim Denied — Alleged Non-Disclosure of Pre-Existing Condition (₹2,40,000)
    'preset-1': {
      tab: 'rejection',
      name: 'Preset 1: Health Claim Denied — Alleged Non-Disclosure of Pre-Existing Condition',
      policyType: 'Health',
      claimAmount: 240000,
      insurerName: 'Star Health & Allied Insurance Co.',
      policyNumber: 'SH/2021/4819028/00/000',
      rejectionDate: '2026-02-12',
      rejectionText: `RE: Repudiation Advice for Claim Ref No: CIR/2026/782194
Policy No: SH/2021/4819028/00/000 | Insured Patient: Abhishek Kumar
Hospital: Max Super Speciality Hospital, Saket, New Delhi
Disputed Claim Amount: Rs. 2,40,000/- (Coronary Angiography & Emergency Stenting)

Dear Policyholder,
We refer to your cashless/reimbursement claim for hospitalization from 14-Jan-2026 to 17-Jan-2026.
Upon clinical scrutiny of indoor case papers (ICP) and treating physician history sheets:
1. Patient was diagnosed with acute coronary syndrome and underwent drug-eluting stenting.
2. The initial emergency admission notes record a long-standing history of Essential Hypertension and Type 2 Diabetes for approximately 4 to 5 years.
3. In your initial policy proposal form dated 10-Aug-2021, the proposer declared 'NO' to hypertension and diabetes queries.
4. As per Section 4.1 (Non-disclosure of Material Facts / Pre-Existing Condition) and Section 45 of Insurance Act, the company has repudiated the claim in toto.
5. Consequently, the claim of Rs. 2,40,000/- is rejected and policy coverage stands terminated ab-initio without refund of premium.`
    },

    // Preset 2: Partial Settlement — Room-Rent Sub-Limit & Non-Payable Items Deduction (₹1,15,000)
    'preset-2': {
      tab: 'rejection',
      name: 'Preset 2: Partial Settlement — Room-Rent Sub-Limit & Non-Payable Items Deduction',
      policyType: 'Health',
      claimAmount: 115000,
      insurerName: 'Care Health Insurance Ltd.',
      policyNumber: 'CHI/FLOATER/2023/889104',
      rejectionDate: '2026-01-29',
      rejectionText: `RE: Claim Settlement Voucher & Deduction Breakdown — Claim ID: 90284711
Hospital: Fortis Memorial Research Institute, Gurugram
Total Hospital Bill: Rs. 2,80,000/- | Approved: Rs. 1,65,000/- | Disallowed / Deducted: Rs. 1,15,000/-

Dear Insured,
Please note the settlement deduction summary for your Laparoscopic Cholecystectomy claim:
1. Room Rent Eligibility Breach: Your Sum Insured is Rs. 3,00,000/- with a 1% per day room rent cap (Rs. 3,00,000 x 1% = Rs. 3,000/day). The insured occupied a Single Executive Room charged at Rs. 8,500/day.
2. In terms of Clause 3.2(c), a Proportionate Deduction of 64.7% has been applied to all associated surgical and medical charges:
   - Surgeon Fees (Billed: Rs. 65,000 -> Slashed by Rs. 42,000)
   - Operation Theater & Anesthesia (Billed: Rs. 45,000 -> Slashed by Rs. 29,100)
   - Diagnostic Ultrasound & Blood Tests (Billed: Rs. 18,000 -> Slashed by Rs. 11,600)
3. Non-Medical Consumables Deduction: Rs. 32,300 disallowed under List I (gloves, PPE kits, cannula, syringes, disinfectant wipes, bio-hazard bags).
Total deduction of Rs. 1,15,000/- is disallowed and non-payable as per policy terms.`
    },

    // Preset 3: Claim Rejected — Missing Itemized Bill & Discharge Summary Gap (₹85,000)
    'preset-3': {
      tab: 'rejection',
      name: 'Preset 3: Claim Rejected — Missing Itemized Bill & Discharge Summary Gap',
      policyType: 'Health',
      claimAmount: 85000,
      insurerName: 'Niva Bupa Health Insurance Co.',
      policyNumber: 'NB/MED/2024/662810',
      rejectionDate: '2026-02-05',
      rejectionText: `RE: Closure & Repudiation of Reimbursement Claim — Ref No: CLM-2026-339182
Patient: Abhishek Kumar | Ailment: Severe Dengue with Thrombocytopenia
Hospital: City Care Hospital, Noida | Disputed Claim Amount: Rs. 85,000/-

Dear Policyholder,
We refer to your reimbursement claim documents submitted on 22-Jan-2026.
Deficiencies noted during audit:
1. Hospital bill summary reflects aggregate Pharmacy and Injection charges of Rs. 38,500 without detailed batch-wise itemized cash memos.
2. Discharge summary lacks hourly vitals charting and Indoor Case Papers (ICP) showing daily platelet transfusion monitoring.
3. As the requested original documents were not provided within 15 days of query letter, your claim is repudiated under Clause 6.1 (Documentation Default & Incomplete Claim Submission).
4. File is closed as 'No Claim' in our records.`
    },

    // Preset 4: Policy Brochure Audit — "Tax-Saver + Guaranteed Return + Cover" Pitch
    'preset-4': {
      tab: 'xray',
      name: 'Preset 4: Policy Brochure Audit — Tax-Saver + Guaranteed Return + Cover Pitch',
      policyType: 'Life-Endowment',
      sumInsured: 'Annual Deposit: ₹1,00,000 for 10 yrs | Advertised Maturity: ₹25,00,000',
      text: `EXCLUSIVE AGENT BROCHURE — "Jeevan Dhan Samriddhi Plan"
The Ultimate 3-in-1 Financial Shield: Guaranteed Tax-Free Income + High Returns + Sovereign Life Cover!

Plan Features:
1. Pay only Rs. 1,00,000/- per year for 10 years (Total Deposit: Rs. 10,00,000).
2. Enjoy 5-year Premium Holiday from Year 11 to Year 15.
3. Guaranteed Survival Benefit: Receive Rs. 1,25,000/- every year from Year 16 to Year 24 (9 annual guaranteed payouts = Rs. 11,25,000).
4. Bumper Maturity Bonus: On Year 25, receive Guaranteed Maturity Lump-sum of Rs. 15,00,000/-.
5. Total Guaranteed Cash Payout: Rs. 26,25,000/- (More than 2.6x your investment!).
6. Tax Benefits: 100% Tax-free under Section 80C on deposit and Section 10(10D) on maturity payouts.
7. In-built Life Cover: Rs. 10,00,000 life insurance protection for the entire 25-year duration.
8. Zero stock market risk, guaranteed peace of mind for your family's future.`
    }
  };

  // Aliases for any legacy or alternative dataset attributes
  PRESETS['preset-ped'] = PRESETS['preset-1'];
  PRESETS['preset-roomrent'] = PRESETS['preset-2'];
  PRESETS['preset-motor'] = PRESETS['preset-3'];
  PRESETS['preset-endowment'] = PRESETS['preset-4'];
  PRESETS['preset-mediclaim-traps'] = PRESETS['preset-2'];

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
  function switchTab(targetTabName) {
    const tabs = [
      { btn: elements.tabBtnRejection, panel: elements.tabPanelRejection, name: 'rejection' },
      { btn: elements.tabBtnXray, panel: elements.tabPanelXray, name: 'xray' },
      { btn: elements.tabBtnArchitecture, panel: elements.tabPanelArchitecture, name: 'architecture' }
    ];

    tabs.forEach(t => {
      if (t.name === targetTabName) {
        t.btn.classList.add('active');
        t.btn.setAttribute('aria-selected', 'true');
        t.panel.classList.remove('hidden');
      } else {
        t.btn.classList.remove('active');
        t.btn.setAttribute('aria-selected', 'false');
        t.panel.classList.add('hidden');
      }
    });
    state.activeTab = targetTabName;
  }

  function initTabs() {
    elements.tabBtnRejection.addEventListener('click', () => switchTab('rejection'));
    elements.tabBtnXray.addEventListener('click', () => switchTab('xray'));
    elements.tabBtnArchitecture.addEventListener('click', () => switchTab('architecture'));

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
  // 7. PROGRESS ANIMATOR (3-STAGE PIPELINE)
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
      if (el) el.className = 'stage-item';
    });
    barElem.style.width = '6%';

    // Stage 1
    if (stageItems[0]) stageItems[0].className = 'stage-item active';
    titleElem.textContent = stages[0];
    barElem.style.width = '35%';
    await new Promise(r => setTimeout(r, 650));

    // Stage 2
    if (stageItems[0]) stageItems[0].className = 'stage-item completed';
    if (stageItems[1]) stageItems[1].className = 'stage-item active';
    titleElem.textContent = stages[1];
    barElem.style.width = '70%';
    await new Promise(r => setTimeout(r, 750));

    // Stage 3
    if (stageItems[1]) stageItems[1].className = 'stage-item completed';
    if (stageItems[2]) stageItems[2].className = 'stage-item active';
    titleElem.textContent = stages[2];
    barElem.style.width = '94%';

    try {
      const data = await callback();
      barElem.style.width = '100%';
      if (stageItems[2]) stageItems[2].className = 'stage-item completed';
      await new Promise(r => setTimeout(r, 350));
      container.classList.add('hidden');
      return data;
    } catch (err) {
      container.classList.add('hidden');
      throw err;
    }
  }

  // ==========================================
  // 8. INSTANT DEMO REJECTION ENGINE (RULE-BASED AUDIT)
  // ==========================================
  function generateDemoRejectionAnalysis(policyType, claimAmount, insurer, policyNo, rejectionDate, text) {
    const lower = text.toLowerCase();
    const amountVal = parseFloat(claimAmount) || 240000;
    const formattedAmount = formatIndianCurrency(amountVal);
    const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const targetInsurer = insurer || 'The Insurer / Third Party Administrator (TPA)';
    const targetPolicyNo = policyNo || 'SH/2021/4819028/00/000';

    let primaryGround = 'Policy Clause Exclusion & Documentation Dispute';
    let contestabilityScore = 'High Contestability';
    let contestabilityClass = 'contestability-high';
    let legalShield = 'IRDAI Master Circular & Ombudsman Rules 2017';
    let allegations = [];
    let counters = [];
    let rationale = '';
    let checklist = [];

    // SCENARIO 1: Non-Disclosure / Pre-Existing Disease (Section 45 Protection)
    if (lower.includes('non-disclosure') || lower.includes('pre-existing') || lower.includes('ped') || lower.includes('hypertension') || lower.includes('diabetes') || lower.includes('section 45') || lower.includes('stent')) {
      primaryGround = 'Repudiation for Alleged Pre-Existing Condition (§ 45 Statutory Immunity Breach)';
      contestabilityScore = 'Very High (100% Statutory Protection under § 45)';
      contestabilityClass = 'contestability-high';
      legalShield = 'Section 45 of Insurance Act 1938 & IRDAI 36-Month Moratorium Norms';

      allegations = [
        'Insurer alleged non-disclosure of past hypertension and diabetes in proposal form dated Aug 2021.',
        'Insurer repudiated entire claim of Rs. 2,40,000 for emergency cardiac stenting and canceled policy ab-initio.',
        'Claims panel asserted breach of utmost good faith (uberrima fides) and invoked Clause 4.1 exclusions.'
      ];

      counters = [
        'Under Section 45(1) of the Insurance Act 1938 (amended 2015), no policy of insurance can be called into question or repudiated on ground of misstatement or non-disclosure after expiry of 3 continuous years (36 months).',
        'As the policy was continuously in force from August 2021 to January 2026 (> 4 continuous years), the insurer is legally BARRED by statute from repudiating on non-disclosure grounds.',
        'The Supreme Court of India in Manmohan Nanda v. United India Insurance and Sulbha Prakash Motegaonkar v. LIC held that ordinary lifestyle conditions cannot defeat genuine indemnity once the contestability window has expired.'
      ];

      rationale = 'The insurer\'s repudiation is legally invalid on its face. Section 45 of the Insurance Act 1938 confers absolute indisputability on policies in force for more than 3 years. The Grievance Redressal Officer and the Insurance Ombudsman routinely direct 100% payment with penal interest in such cases.';

      checklist = [
        { title: 'Continuous Renewal Policy Schedules (2021-2026)', desc: 'Proof of policy continuity without break to trigger Section 45 statutory immunity.' },
        { title: 'Treating Cardiologist Emergency Attestation', desc: 'Medical certificate confirming acute myocardial event required immediate emergency stenting.' },
        { title: 'Copy of Original Proposal Form & Tele-MER Record', desc: 'Proof that insurer accepted premium and issued policy after underwriting assessment.' },
        { title: 'Certified Hospital Discharge Summary & ICP', desc: 'Indoor case papers showing prompt, truthful clinical history recorded at admission.' }
      ];

    // SCENARIO 2: Room-Rent & Proportionate Deduction & Non-Payables
    } else if (lower.includes('room') || lower.includes('proportionate') || lower.includes('capping') || lower.includes('non-payable') || lower.includes('consumables') || lower.includes('cholecystectomy')) {
      primaryGround = 'Arbitrary Room-Rent Proportionate Deduction & Unlawful Consumables Haircut';
      contestabilityScore = 'High Contestability (85% Recovery Potential)';
      contestabilityClass = 'contestability-high';
      legalShield = 'IRDAI Master Circular on Health Insurance 2024 & Delhi/Mumbai Ombudsman Precedents';

      allegations = [
        'Insurer penalized claimant for occupying a Single Room at Rs. 8,500/day against 1% cap (Rs. 3,000/day).',
        'Proportionate deduction of 64.7% applied across surgeon fees, anesthesia, and diagnostic investigations.',
        'Arbitrary disallowance of Rs. 32,300 for surgical consumables (PPE, cannulas, gloves, syringes) under List I.'
      ];

      counters = [
        'Under IRDAI Master Circular 2024 guidelines, insurers CANNOT apply proportionate deduction on ICU charges, doctor consultation fees, implants, or diagnostic tests unless explicitly tied to room tariffs in hospital contracts.',
        'Multiple Insurance Ombudsman rulings have firmly established that doctor fees and surgery costs cannot be slashed proportionately when standard hospital tariffs are uniform across rooms.',
        'Routine infection control consumables (gloves, syringes, IV cannulas) are integral to modern surgery and cannot be summarily wiped off without reasonable clinical review.'
      ];

      rationale = 'Insurers often weaponize the 1% room rent cap to execute blanket haircuts across essential surgical bills. However, established Ombudsman jurisprudence directs insurers to refund proportionate cuts on surgeon charges and diagnostics unless the hospital provides a tiered doctor tariff proof.';

      checklist = [
        { title: 'Hospital Tariff Certificate for Surgeon & OT Fees', desc: 'Signed certificate from billing desk certifying surgeon fees were standard and NOT scaled to room category.' },
        { title: 'Treating Surgeon Clinical Necessity Note', desc: 'Attestation confirming necessity of surgery and standard surgical equipment utilised.' },
        { title: 'Detailed Pharmacy Batch Invoices', desc: 'Itemized vouchers proving medical necessity of all consumables and injections administered.' },
        { title: 'Itemized Settlement Breakup from TPA', desc: 'Official deduction sheet demonstrating mathematical misapplication of proportionate reduction.' }
      ];

    // SCENARIO 3: Missing Itemized Bill & Discharge Summary Gap
    } else if (lower.includes('itemized') || lower.includes('summary') || lower.includes('dengue') || lower.includes('icp') || lower.includes('closure') || lower.includes('no claim') || lower.includes('missing')) {
      primaryGround = 'Hyper-Technical Rejection for Alleged Procedural Documentation Deficiencies';
      contestabilityScore = 'High Contestability (90% Reversal upon Re-submission)';
      contestabilityClass = 'contestability-high';
      legalShield = 'IRDAI Protection of Policyholders\' Interests Regulations 2024 & Contra Proferentem Rule';

      allegations = [
        'Claimant submitted consolidated pharmacy bills of Rs. 38,500 without detailed batch-wise cash memos.',
        'Discharge summary allegedly lacked hourly vitals monitoring and indoor case papers for platelet counts.',
        'Insurer closed the file as "No Claim" under Clause 6.1 citing failure to furnish papers within 15 days.'
      ];

      counters = [
        'IRDAI Protection of Policyholders\' Interests Regulations mandate that insurers cannot summarily close or reject genuine claims on technical procedural grounds without actively assisting the policyholder.',
        'The Supreme Court of India in Gurmel Singh v. National Insurance Co. held that insurance contracts cannot be defeated by hyper-technical document requirements where genuine hospitalization is undisputed.',
        'Dengue with severe thrombocytopenia is an acute medical emergency confirmed by laboratory platelet reports; summary closure constitutes severe deficiency of service.'
      ];

      rationale = 'Closing a claim file as "No Claim" due to missing internal hospital notes is a standard delay tactic. Once the itemized pharmacy breakdown and treating doctor certificate are resubmitted, the Insurance Ombudsman routinely awards full settlement with penal interest.';

      checklist = [
        { title: 'Hospital Pharmacy Batch-wise Cash Memos', desc: 'Itemized retail invoices from the hospital pharmacy detailing all medicines and fluids administered.' },
        { title: 'Certified Daily Platelet & Lab Reports', desc: 'Complete pathology lab reports with timestamps showing progression and medical necessity of hospitalization.' },
        { title: 'Attested Indoor Case Papers (ICP) & Vitals Chart', desc: 'Doctor-stamped nursing chart proving continuous inpatient monitoring during fever/thrombocytopenia.' },
        { title: 'Written Re-submission Cover Letter', desc: 'Formally putting the insurer on notice that all document queries stand fully rectified.' }
      ];

    } else {
      primaryGround = 'Ambiguous Policy Exclusion & Interpretation Deficit';
      contestabilityScore = 'Medium-to-High (Contra Proferentem Shield)';
      contestabilityClass = 'contestability-medium';
      legalShield = 'Doctrine of Contra Proferentem & Consumer Protection Act 2019';

      allegations = [
        'Insurer cited exclusionary clause without proving it was explained during policy issuance.',
        'Deduction claimed under unverified reasonable & customary charges or documentation deficiencies.'
      ];

      counters = [
        'Under the doctrine of Contra Proferentem, any ambiguity in insurance contract wordings must be strictly construed in favor of the insured policyholder.',
        'IRDAI regulations require insurers to demonstrate that specific exclusion clauses were highlighted in the Key Feature Document (KFD) provided at inception.'
      ];

      rationale = 'Insurers bear the strict legal burden of proving that an exclusion clause applies squarely. In the absence of signed acceptance of exclusionary riders, the Ombudsman routinely orders payment in full.';

      checklist = [
        { title: 'Itemized Final Hospital / Repair Bill', desc: 'Breakdown of all billed heads with receipt vouchers.' },
        { title: 'Treating Doctor Justification Letter', desc: 'Clarifying the clinical rationale for the specific treatment protocol.' },
        { title: 'Full Policy Schedule with Terms & Conditions', desc: 'Checking whether the Key Feature Document (KFD) was provided and highlighted.' }
      ];
    }

    // STATUTORY APPEAL LETTER GENERATOR
    const ombudsmanJurisdictionNote = amountVal <= 5000000
      ? `TAKE FURTHER NOTICE that as the disputed claim amount of ${formattedAmount} falls well within the pecuniary jurisdiction of the Honorable Insurance Ombudsman (up to Rs. 50,00,000/- under Rule 17(1) of the Insurance Ombudsman Rules, 2017), the undersigned shall immediately lodge a formal complaint on the IRDAI Bima Bharosa portal and approach the Insurance Ombudsman Office having territorial jurisdiction upon expiry of your statutory 15-day window.`
      : `TAKE FURTHER NOTICE that as the disputed claim amount of ${formattedAmount} exceeds Rs. 50,00,000/-, upon expiry of the statutory 15-day resolution timeline, the undersigned shall initiate formal litigation before the State/National Consumer Disputes Redressal Commission (NCDRC) under the Consumer Protection Act, 2019, claiming the principal amount with 18% penal interest and punitive damages for gross deficiency of service.`;

    const appealLetter = `DATE: ${currentDate}

TO:
The Grievance Redressal Officer (GRO)
${targetInsurer}
Corporate Grievance Redressal Cell / Claims Department

SUBJECT: STATUTORY GRIEVANCE APPEAL & FORMAL NOTICE UNDER IRDAI (PROTECTION OF POLICYHOLDERS' INTERESTS) REGULATIONS, 2024
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
2. Treating Doctor Certificate of Medical Necessity / Pathology Reports.
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
  // 9. INSTANT DEMO X-RAY ENGINE
  // ==========================================
  function generateDemoXrayAnalysis(policyType, sumInsured, text) {
    const lower = text.toLowerCase();

    let archetype = 'Traditional Endowment / Money-Back Policy';
    let archetypeNote = 'Disguised Low-Yield Savings Product with Sub-Optimal Life Cover';
    let realIrr = '4.8% - 5.2% p.a. (Post-Tax)';
    let verdict = 'Sub-Inflation Yield (Wealth Destroyer)';
    let categoryBadge = 'Low Protection / High Opportunity Cost';
    let narrative = '';
    let traps = [];
    let disclosures = [];
    let records = [];

    if (policyType === 'Life-Endowment' || lower.includes('money-back') || lower.includes('guaranteed') || lower.includes('endowment') || lower.includes('bonus') || lower.includes('jeevan')) {
      archetype = 'Endowment / Guaranteed Savings Plan ("Tax-Saver + Return + Cover")';
      archetypeNote = 'Bundled Savings with Inadequate Death Benefit (10x Annual Premium)';
      realIrr = '4.9% - 5.3% p.a. (Post-Tax)';
      verdict = 'Sub-Inflation Yield (Wealth Destroyer)';
      categoryBadge = 'High Cost / Low Protection';

      narrative = `
        <p><strong>The "Triple Guaranteed Returns" Illusion:</strong> Agents aggressively market phrases like "Receive ₹26.25 Lakhs on a ₹10 Lakh deposit — more than 2.6x your money!". However, financial mathematics reveals that receiving ₹26.25 Lakhs spread over 25 long years translates to a compounded annual Internal Rate of Return (IRR) of only <strong>~4.9% per annum</strong>.</p>
        <p><strong>The Opportunity Cost Reality Check:</strong> With Indian retail inflation averaging 5.5% - 6.0% and Public Provident Fund (PPF) offering 7.1% guaranteed tax-free, this policy <em>loses purchasing power over time</em>. If an investor instead buys a pure Term Life Plan (giving ₹1 Crore cover for ~₹12,000/year) and invests the remaining ₹88,000/year in a Nifty 50 Index Fund or PPF, the expected corpus at Year 25 would exceed <strong>₹85 Lakhs to ₹1.15 Crores</strong> with 10x higher life protection!</p>
      `;

      traps = [
        { name: 'Severe Underinsurance Trap', level: 'High Trap', badge: 'badge-danger', clause: 'Sum Assured = 10x Premium', impact: 'A ₹1 Lakh annual premium affords merely ₹10 Lakhs life cover. In reality, a breadwinner requires at least 15x-20x annual household income in pure term cover.' },
        { name: 'Surrender Charge Lock-in', level: 'High Trap', badge: 'badge-danger', clause: 'Special Surrender Value (SSV)', impact: 'If you discontinue the policy within the first 3 years, you forfeit 65% to 80% of all paid premiums. Liquidity is virtually locked with punitive surrender penalty scales.' },
        { name: 'Non-Guaranteed "Bonus" Fine Print', level: 'Watch Out', badge: 'badge-warning', clause: 'Reversionary & Terminal Bonus', impact: 'Brochure tables often project payouts at illustrative 8% gross returns. Under IRDAI rules, actual bonus declaration is at the insurer\'s discretion and has historically lagged below 5%.' }
      ];

      disclosures = [
        'Disclose exact existing life insurance portfolio value (Human Life Value ceiling).',
        'Declare any high-risk hobbies (racing, paragliding) or international travel to conflict zones.',
        'Disclose accurate annual income with ITR V forms; salary slips alone can cause dispute during claim settlement.'
      ];

      records = [
        'Signed copy of the Original Proposal Form (verify agent did not forge answers).',
        'First Premium Receipt (FPR) and Policy Bond with official insurer revenue stamp.',
        'Audio/Video Tele-MER recording or doctor medical examination report.',
        'Annual Premium Payment receipts for Section 80C and Section 10(10D) tax records.'
      ];

    } else {
      archetype = 'Comprehensive Health / Mediclaim Policy';
      archetypeNote = 'Hospitalization Indemnity with Hidden Out-of-Pocket Traps';
      realIrr = 'N/A (Pure Indemnity Product)';
      verdict = 'Requires Careful Rider Selection';
      categoryBadge = 'High Potential Haircuts';

      narrative = `
        <p><strong>The Out-of-Pocket Deduction Trap:</strong> While brochures advertise "Cashless Anywhere across 10,000+ Hospitals", fine-print clauses can leave policyholders paying 40% to 60% of hospital bills out-of-pocket during emergency care.</p>
        <p><strong>The 1% Room Rent Danger:</strong> A 1% room rent limit on a ₹5 Lakh policy means your eligible room tariff is just ₹5,000/day. If you occupy a room at ₹8,500/day, the insurer invokes <em>Proportionate Deduction</em>, slashing surgeon fees, anesthetist fees, and OT charges proportionately!</p>
      `;

      traps = [
        { name: 'Room Rent Capping & Proportionate Deduction', level: 'High Trap', badge: 'badge-danger', clause: 'Clause 3.1: 1% SI / 2% ICU Cap', impact: 'Breaching room rent cap triggers proportionate deduction across all associated surgical, nursing, and medical expenses, resulting in massive haircuts.' },
        { name: 'Senior Citizen Mandatory Co-Payment', level: 'High Trap', badge: 'badge-danger', clause: 'Clause 4.3: 20% Co-Pay for Age 55+', impact: 'On a ₹5,00,000 bill, you must pay ₹1,00,000 out-of-pocket on every single claim, regardless of hospitalization cause.' },
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
  // 10. LIVE GEMINI 2.5 FLASH API INTEGRATION
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
      const cleaned = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  }

  // ==========================================
  // 11. RENDERERS
  // ==========================================
  function renderRejectionResults(data) {
    elements.resultsRejection.classList.remove('hidden');
    elements.resultsRejection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // 1. Ombudsman Banner (Pecuniary Jurisdiction: <= ₹50 Lakhs)
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

    // 2. Step A: Denial Audit
    elements.contestabilityBadge.textContent = data.contestabilityScore;
    elements.contestabilityBadge.className = `contestability-pill ${data.contestabilityClass || 'contestability-high'}`;

    elements.auditPrimaryGround.textContent = data.primaryGround;
    elements.auditContestabilityScore.textContent = data.contestabilityScore;
    elements.auditLegalShield.textContent = data.legalShield;

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
  // 12. RUN PRESET END-TO-END WITH 3-STAGE PROGRESS
  // ==========================================
  async function runPreset(key) {
    const preset = PRESETS[key];
    if (!preset) return;

    // Highlight all matching buttons briefly
    document.querySelectorAll(`[data-preset-action="${key}"], [data-preset="${key}"], [data-xray-preset="${key}"]`).forEach(btn => {
      btn.classList.add('active-preset');
      setTimeout(() => btn.classList.remove('active-preset'), 1000);
    });

    if (preset.tab === 'xray') {
      switchTab('xray');
      elements.xrayPolicyType.value = preset.policyType;
      elements.xraySumInsured.value = preset.sumInsured;
      elements.xrayText.value = preset.text;
      updateCharCount(elements.xrayText, elements.xrayCharCount);

      const stages = [
        '1. Auditing Protection vs. Savings / IRR Return Metrics...',
        '2. Scanning for Hidden Sub-Limits, Room-Rent Caps & Co-Pay...',
        '3. Formulating Disclosure & Paperwork Defense Shield...'
      ];

      const result = await runProgressPipeline(
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
Category: ${preset.policyType}
Sum Insured / Premium: ${preset.sumInsured}
Text:
${preset.text}`;
              return await callGeminiApi(prompt);
            } catch (err) {
              console.warn('Gemini AI fallback:', err);
              showToast(`Gemini notice: ${err.message}. Seamlessly switched to Instant Demo Engine.`, 'error');
              return generateDemoXrayAnalysis(preset.policyType, preset.sumInsured, preset.text);
            }
          }
          return generateDemoXrayAnalysis(preset.policyType, preset.sumInsured, preset.text);
        }
      );

      renderXrayResults(result);
      showToast(`Analyzed ${preset.name}!`, 'success');

    } else {
      // Rejection Presets (1, 2, 3)
      switchTab('rejection');
      elements.policyType.value = preset.policyType;
      elements.claimAmount.value = preset.claimAmount;
      elements.insurerName.value = preset.insurerName;
      elements.policyNumber.value = preset.policyNumber;
      elements.rejectionDate.value = preset.rejectionDate;
      elements.rejectionText.value = preset.rejectionText;

      updateAmountInWords();
      updateCharCount(elements.rejectionText, elements.rejectionCharCount);

      const stages = [
        '1. Parsing Rejection Clauses & Identifying Legal Grounds...',
        '2. Cross-referencing IRDAI Guidelines & Section 45 Protections...',
        '3. Formulating GRO Representation & Ombudsman Docket...'
      ];

      const result = await runProgressPipeline(
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
Policy Type: ${preset.policyType}
Disputed Amount: Rs. ${preset.claimAmount}
Insurer/TPA: ${preset.insurerName}
Policy No: ${preset.policyNumber}
Rejection Date: ${preset.rejectionDate}
Rejection Text:
${preset.rejectionText}`;
              const parsed = await callGeminiApi(prompt);
              parsed.amountVal = parseFloat(preset.claimAmount) || 0;
              parsed.formattedAmount = formatIndianCurrency(parsed.amountVal);
              return parsed;
            } catch (err) {
              console.warn('Gemini AI fallback:', err);
              showToast(`Gemini notice: ${err.message}. Seamlessly switched to Instant Demo Engine.`, 'error');
              return generateDemoRejectionAnalysis(preset.policyType, preset.claimAmount, preset.insurerName, preset.policyNumber, preset.rejectionDate, preset.rejectionText);
            }
          }
          return generateDemoRejectionAnalysis(preset.policyType, preset.claimAmount, preset.insurerName, preset.policyNumber, preset.rejectionDate, preset.rejectionText);
        }
      );

      renderRejectionResults(result);
      showToast(`Analyzed ${preset.name}!`, 'success');
    }
  }

  // ==========================================
  // 13. PRESET CLICK HANDLERS
  // ==========================================
  function initPresets() {
    document.querySelectorAll('[data-preset-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.presetAction;
        runPreset(key);
      });
    });

    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.preset;
        runPreset(key);
      });
    });

    document.querySelectorAll('[data-xray-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.xrayPreset;
        runPreset(key);
      });
    });
  }

  // ==========================================
  // 14. FORM SUBMISSIONS (MANUAL RUNS)
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
              console.warn('Gemini AI fallback:', err);
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
              console.warn('Gemini AI fallback:', err);
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
  // 15. COPY & DOWNLOAD ACTIONS
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
  // 16. INPUT LISTENERS
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
  // 17. NUMBERS TO WORDS HELPER (INDIAN NUMBERING SYSTEM)
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
  // 18. INITIALIZATION
  // ==========================================
  initByok();
  initTabs();
  initPresets();
  updateAmountInWords();
});
