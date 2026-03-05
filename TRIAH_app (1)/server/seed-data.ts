import type { InsertVendor } from "@shared/schema";

export const MOCK_VENDORS: InsertVendor[] = [
  {
    name: "Aidoc BriefCase",
    company: "Aidoc Medical",
    product: "BriefCase AI Triage",
    description: "FDA-cleared AI triage platform that detects acute findings on CT scans including PE, ICH, c-spine fractures, and aortic emergencies. Features comprehensive regulatory dossier with published clinical validation studies.",
    evidenceLevel: "rich",
    documentCount: 18,
    vendorDocs: 12,
    governanceDocs: 6,
    expectedBadge: "Bronze-Silver",
    expectedScoreRange: "62-78%",
    documents: [
      {
        name: "FDA 510(k) Clearance Letter",
        category: "Regulatory",
        description: "K201501 clearance for CT triage",
        content: `DEPARTMENT OF HEALTH AND HUMAN SERVICES
Food and Drug Administration
510(k) Clearance — K201501

Device Name: Aidoc BriefCase AI Triage Platform
Applicant: Aidoc Medical Ltd., 27 Ha'arbaa St., Tel Aviv, Israel

DECISION: SUBSTANTIALLY EQUIVALENT

The FDA reviewed the 510(k) premarket notification submitted by Aidoc Medical Ltd. for the BriefCase AI Triage Platform, a software-only medical device intended to prioritize radiology worklists and alert clinicians to potential acute findings on computed tomography (CT) images.

INTENDED USE: The BriefCase AI Triage Platform is intended to assist radiologists by automatically analyzing CT images and flagging suspected cases of pulmonary embolism (PE), intracranial hemorrhage (ICH), cervical spine fractures, and aortic emergencies. The device is not intended to replace clinical judgment or serve as the sole basis for diagnosis.

INDICATIONS FOR USE: The device is indicated for use in adult patients (≥18 years) presenting to emergency departments or inpatient settings where CT imaging is performed. The device operates as a computer-aided detection (CADe) tool and presents findings as prioritization alerts within the radiologist's workflow.

PREDICATE DEVICES: The device was found substantially equivalent to the following predicate devices: (1) Zebra Medical Vision's HealthICH (K192108), a CADe device for ICH detection; (2) Aidoc's prior 510(k) clearance K182259 for PE triage functionality.

SUBSTANTIAL EQUIVALENCE SUMMARY: FDA has determined that the BriefCase AI Triage Platform has the same intended use as the predicate devices and uses similar technological characteristics. Performance data submitted demonstrated non-inferior sensitivity and specificity compared to predicates across the validated disease categories.

PERFORMANCE SUMMARY:
- Pulmonary Embolism: Sensitivity 95.1% (95% CI: 92.4–97.2%), Specificity 93.2% (95% CI: 91.0–95.0%) — Multi-site prospective study, N=1,250
- Intracranial Hemorrhage: Sensitivity 96.8%, AUC 0.97 — Retrospective study, N=4,200
- Cervical Spine Fracture: Sensitivity 91.3%, Specificity 95.7% — Multi-site study, N=620

CONDITIONS: This clearance is limited to the algorithms and configurations described in the submission. Any substantial modification to the intended use, indications, or algorithm must be submitted as a new 510(k) or De Novo request.

Cleared: March 14, 2021
Expiration of Clearance: N/A (device clearances do not expire but must be maintained)
Center for Devices and Radiological Health, Division of Radiological Health`,
      },
      {
        name: "CE Mark Certificate",
        category: "Regulatory",
        description: "MDR Class IIa certification",
        content: `EU DECLARATION OF CONFORMITY
In accordance with Regulation (EU) 2017/745 (Medical Device Regulation)

Manufacturer: Aidoc Medical Ltd.
Address: 27 Ha'arbaa St., Tel Aviv 6473921, Israel
EU Authorized Representative: MedCert GmbH, Hanover, Germany

Product: Aidoc BriefCase AI Triage Platform
Classification: Class IIa — Rule 11 (Software intended to provide information for diagnosis or therapeutic purposes)
Notified Body: TÜV SÜD Product Service GmbH, NB Number 0123
Certificate Number: CE-MDR-2022-AIDOC-0447

The undersigned hereby declares that the above product is in conformity with the provisions of Regulation (EU) 2017/745 on medical devices and, where applicable, with the national provisions implementing this Regulation.

STANDARDS APPLIED:
- IEC 62304:2006+AMD1:2015 — Medical device software: Software life cycle processes
- IEC 62366-1:2015 — Medical devices: Application of usability engineering
- ISO 14971:2019 — Medical devices: Application of risk management
- ISO 13485:2016 — Medical devices: Quality management systems
- EN ISO 10993-1:2018 — Biological evaluation of medical devices

CLINICAL EVALUATION: Clinical evaluation was performed per MEDDEV 2.7/1 Rev. 4 and Article 61 of EU MDR 2017/745. The clinical evaluation report (CER-2022-BriefCase-v3.2) demonstrates clinical benefit through peer-reviewed publications and post-market clinical follow-up (PMCF) data.

POST-MARKET SURVEILLANCE: A Post-Market Surveillance (PMS) plan has been established per Article 83. Annual Periodic Safety Update Reports (PSURs) are submitted to TÜV SÜD. The PMCF plan includes ongoing prospective data collection from EU clinical sites.

UNIQUE DEVICE IDENTIFICATION: Basic UDI-DI assigned per EUDAMED registration. UDI: (01)05060780120349

Certificate issued: January 18, 2023
Valid through: January 17, 2026 (subject to surveillance audit)
TÜV SÜD Product Service GmbH, Ridlerstraße 65, 80339 Munich, Germany`,
      },
      {
        name: "Clinical Validation Study — PE Detection",
        category: "Clinical",
        description: "Multi-site prospective study, N=1,250, sensitivity 95.1%, specificity 93.2%",
        content: `TITLE: Multicenter Prospective Validation of an AI-Based Pulmonary Embolism Triage Algorithm
Published: Radiology, Vol. 301, No. 3, December 2021
Authors: Chen AJ, Steinberg OA, Marcus R, et al. (Aidoc BriefCase Study Group)

ABSTRACT
Background: AI-assisted triage for pulmonary embolism (PE) has shown promise in retrospective studies. This prospective multicenter study evaluates the Aidoc BriefCase PE algorithm in a real-world emergency workflow.
Objective: To assess sensitivity, specificity, time-to-notification, and clinical workflow impact.
Study Design: Prospective, non-interventional, multicenter.

METHODS
Study Sites: 7 academic medical centers (3 US, 2 EU, 1 Israel, 1 Australia)
Inclusion Criteria: Adult patients (≥18 years) presenting to emergency settings with CT pulmonary angiography (CTPA) ordered for clinical suspicion of PE. Consecutive enrollment over 18 months (June 2019 – December 2020).
Exclusion Criteria: Pediatric patients; CTAs not meeting minimum quality threshold (defined by DICOM header metadata); prior PE on anticoagulation.
Sample Size: N=1,250 (667 PE-negative, 583 PE-positive confirmed by radiologist read and clinical adjudication committee)
Reference Standard: Final radiologist report, corroborated by clinical adjudication committee review of imaging, clinical notes, and follow-up at 90 days.

RESULTS
Primary Endpoints:
- Sensitivity: 95.1% (95% CI: 92.4–97.2%)
- Specificity: 93.2% (95% CI: 91.0–95.0%)
- Positive Predictive Value (PPV): 92.6%
- Negative Predictive Value (NPV): 95.5%
- AUC: 0.974 (95% CI: 0.963–0.984)

Secondary Endpoints:
- Median time from CT acquisition to AI alert: 4.2 minutes
- Median time from CT acquisition to radiologist notification (standard workflow): 31.7 minutes
- False Negative Rate: 4.9% (29/583 PE-positive cases missed by algorithm; all 29 had subsegmental PE only)
- False Positive Rate: 6.8% (45/667 non-PE cases flagged; 38/45 had other acute findings e.g., consolidation, pleural effusion)

SUBGROUP ANALYSIS:
- Age <65 vs ≥65: No significant difference in performance (p=0.43)
- BMI categories (Normal/Overweight/Obese): No significant performance degradation (AUC 0.971–0.978)
- PE severity (Massive/Submassive/Segmental/Subsegmental): Algorithm performed significantly better for central PE (sensitivity 99.1%) vs. subsegmental PE (sensitivity 78.3%)
- CT Scanner manufacturer (GE/Siemens/Philips/Canon): No significant performance variation (p=0.61)
- Site variability: Sensitivity range 93.1%–97.4% across sites

LIMITATIONS: Algorithm not validated for pregnant patients, pediatric populations, or patients with known prior PE who are not on anticoagulation. Algorithm trained primarily on US and European imaging protocols; performance on non-standard protocols (e.g., low-dose, motion-artifact) not fully characterized.

CONCLUSION: The Aidoc BriefCase PE algorithm demonstrates high sensitivity and specificity in a prospective multicenter study. Its consistent performance across sites, scanner types, and demographic subgroups supports generalizability. The significant reduction in time-to-alert (4.2 min vs. 31.7 min) has potential to improve clinical outcomes, particularly for high-acuity PE presentations. Further study is warranted for subsegmental PE detection.

DECLARATIONS: Study funded in part by Aidoc Medical Ltd. Authors AJ Chen and OA Steinberg are employees of Aidoc. Independent statistical analysis was performed by an external biostatistics firm.`,
      },
      {
        name: "Clinical Validation Study — ICH Detection",
        category: "Clinical",
        description: "Retrospective validation, N=4,200, AUC 0.97",
        content: `TITLE: Large-Scale Retrospective Validation of AI-Assisted Intracranial Hemorrhage Detection on Non-Contrast CT
Published: The Lancet Digital Health, Vol. 4, Issue 2, February 2022
Authors: Yehezkel S, Park HJ, Thompson DE, et al.

ABSTRACT
Objective: To validate the diagnostic performance of the Aidoc BriefCase ICH detection algorithm across a large, diverse retrospective cohort.
Design: Retrospective multi-institutional study.
Setting: 12 hospital systems across 5 countries.
Participants: 4,200 non-contrast head CT examinations (2,100 ICH-positive, 2,100 ICH-negative) acquired 2016–2020.

METHODS
Data Source: De-identified CT DICOM datasets collected from 12 institutions (US n=6, EU n=3, Middle East n=2, Australia n=1). Cases were stratified to ensure representation of all ICH subtypes and diversity of scanner types, slice thicknesses, and contrast protocols.
Reference Standard: Board-certified neuroradiologist consensus read (2 independent readers; discrepancies resolved by a third senior neuroradiologist). CT reports were corroborated with follow-up imaging and clinical records where available.
ICH Subtypes Represented: Intraparenchymal (42%), Subdural (28%), Subarachnoid (17%), Epidural (8%), Intraventricular (5%)

RESULTS
Overall Performance:
- AUC: 0.973 (95% CI: 0.965–0.981)
- Sensitivity: 96.8% (95% CI: 95.7–97.7%)
- Specificity: 95.3% (95% CI: 94.0–96.4%)
- F1 Score: 0.961

By ICH Subtype:
- Intraparenchymal: Sensitivity 98.3%, Specificity 96.1%
- Subdural: Sensitivity 95.9%, Specificity 96.8%
- Subarachnoid: Sensitivity 93.4%, Specificity 94.7%
- Epidural: Sensitivity 97.1%, Specificity 97.3%
- Intraventricular: Sensitivity 94.1%, Specificity 95.9%

By Hemorrhage Volume:
- <5 mL: Sensitivity 91.2% (challenging small hemorrhage category)
- 5–30 mL: Sensitivity 97.8%
- >30 mL: Sensitivity 99.4%

Subgroup Performance:
- Sex (Male/Female): No significant difference (p=0.72)
- Age <40 / 40–70 / >70: AUC 0.968 / 0.975 / 0.971 (no significant variation)
- Scanner slice thickness 1mm vs 5mm: No significant performance difference (p=0.38)
- CT acquisition time (2016–2018 vs 2019–2020): Stable performance, no temporal drift detected

FALSE NEGATIVE ANALYSIS: 67 of 2,100 ICH-positive cases were missed. Of these, 52 (77.6%) were <3 mL volume. 11 cases had significant artifact (motion or beam-hardening). 4 cases had findings at the edge of the imaging FOV.

COMPARISON TO RADIOLOGIST: Algorithm detected ICH a mean of 26.3 minutes before the first radiologist report. In the subset of cases where the algorithm's alert preceded the radiologist read by >20 minutes, no adverse outcomes attributable to the delay were documented (retrospective chart review).

LIMITATIONS: Retrospective design; cannot establish causal relationship to clinical outcomes. Cases selected to balance ICH/non-ICH (not representative of real-world prevalence). Performance at sites with non-standard imaging protocols not fully characterized.

CONCLUSION: The Aidoc BriefCase ICH detection algorithm demonstrates robust, high-accuracy performance across a large and diverse retrospective cohort. Performance is consistent across ICH subtypes, scanner manufacturers, and demographic groups. Small (<5 mL) hemorrhages represent the primary limitation. These results support the algorithm's use as a triage and prioritization tool in radiology workflows.`,
      },
      {
        name: "Algorithm Architecture Document",
        category: "Technical",
        description: "3D CNN architecture details, training data specifications",
        content: `AIDOC BRIEFCASE AI TRIAGE PLATFORM
Algorithm Architecture & Technical Specification Document
Version: 4.2 | Classification: Confidential — For Regulatory Review Only

1. OVERVIEW
The Aidoc BriefCase AI Triage Platform consists of a suite of independent deep learning models, each trained and validated for a specific acute finding on CT imaging. This document describes the architectural specifications for the four currently cleared models: PE Detection, ICH Detection, Cervical Spine Fracture Detection, and Aortic Emergency Detection.

2. MODEL ARCHITECTURE — PE DETECTION
Type: 3-Dimensional Convolutional Neural Network (3D CNN) with attention gating
Input: Full CT volume (CTPA protocol), resized to standardized voxel spacing (1mm × 1mm × 2mm)
Pre-processing: HU windowing (lung window: -600/1500; mediastinal window: 40/400); Z-score normalization; automatic lung segmentation mask applied to restrict detection to pulmonary vessels
Architecture:
- Encoder: Modified ResNet-50 backbone with 3D convolutions (5 stages, stride-2 downsampling)
- Attention Module: Squeeze-and-excitation blocks at stages 3–5 for channel-wise feature recalibration
- Decoder: Feature Pyramid Network (FPN) with skip connections for multi-scale feature aggregation
- Output Head: Binary classification (PE present/absent) + heatmap generation for localization
Parameters: ~47M trainable parameters
Training Framework: PyTorch 1.9; mixed-precision (FP16/FP32); distributed training on 8× NVIDIA A100 GPUs

3. TRAINING DATA — PE MODEL
Total Training Cases: 92,500 CTPA studies
- PE Positive: 41,200 (44.5%)
- PE Negative: 51,300 (55.5%)
Data Sources: 34 contributing institutions across 11 countries (2012–2020 acquisition dates)
Demographic Distribution:
- Age: 18–94 years; median 57 years
- Sex: 48.2% female, 51.8% male
- Self-reported race/ethnicity: 52% White/European, 18% Asian, 14% Black/African, 9% Hispanic/Latino, 7% other/unreported
Scanner Manufacturers: GE (38%), Siemens (32%), Philips (22%), Canon/Toshiba (8%)
Data Augmentation: Random rotation (±15°), flipping, zoom (0.85–1.15×), brightness/contrast jitter, Gaussian noise, random cropping

4. MODEL ARCHITECTURE — ICH DETECTION
Type: 3D CNN with U-Net-style architecture for voxel-level segmentation + classification
Input: Non-contrast head CT, standardized to 5mm slice thickness equivalent via interpolation if acquired thinner
Architecture:
- Backbone: EfficientNet-B4 adapted for 3D convolution
- Segmentation Head: Per-voxel hemorrhage probability map
- Classification Head: Binary classification aggregated from segmentation output (presence/absence + confidence score)
Parameters: ~38M trainable parameters

5. INFERENCE PIPELINE
Processing Time: Median 90 seconds from last DICOM slice receipt to alert generation (95th percentile: 3.2 minutes)
Integration: DICOM listener on AE Title AIDOC_RECEIVE; processed results returned to PACS via structured DICOM SR and DICOM overlay; HL7 ORU message optionally sent to EMR
Threshold: Default alert threshold set at operating point corresponding to ≥94% sensitivity; adjustable by site within validated range (90–97% sensitivity)
Failsafe: If inference fails (network timeout, corrupt DICOM, OOM error), the system logs the failure and sends a non-alerting null result; the radiologist worklist is not modified. The failure is logged to the Aidoc monitoring dashboard.

6. MODEL VERSIONING & CHANGE CONTROL
Current Production Version: v4.2.1 (deployed November 2023)
Version History: Maintained in Git repository with signed commits. Each production deployment tagged and archived. All prior versions retained for minimum 7 years.
Algorithm Change Protocol: Any changes affecting sensitivity or specificity by >1% absolute trigger a new 510(k) submission or PMA supplement per FDA Software as a Medical Device (SaMD) guidance. Minor bug fixes and infrastructure updates follow internal SOUP (Software of Unknown Provenance) management process per IEC 62304.

7. COMPUTATIONAL REQUIREMENTS
Minimum Server Specification: 1× NVIDIA T4 GPU (16GB VRAM), 32GB RAM, 8-core CPU
Recommended: 2× NVIDIA A10 GPUs for multi-queue processing
Cloud Deployment: AWS (primary), Azure (secondary); SOC 2 Type II certified infrastructure`,
      },
      {
        name: "Bias & Fairness Assessment",
        category: "Ethics",
        description: "Subgroup analysis across age, sex, race/ethnicity",
        content: `AIDOC BRIEFCASE BIAS AND FAIRNESS ASSESSMENT REPORT
Document Reference: AF-2023-BriefCase-v2.1
Prepared by: Aidoc Responsible AI Team
Review Date: September 2023

EXECUTIVE SUMMARY
This report presents the results of the Aidoc BriefCase AI Triage Platform's bias and fairness assessment across multiple protected characteristics. The assessment covers all four cleared models (PE, ICH, Cervical Spine, Aortic Emergency). Overall, the assessment found no clinically meaningful performance disparities across sex and age subgroups. A modest performance gap was identified for Black/African American patients in the ICH model, which is currently under active investigation.

1. SCOPE AND METHODOLOGY
Assessment Coverage: All four models (PE, ICH, C-Spine, Aortic)
Characteristics Assessed: Age (18–44, 45–64, 65–79, ≥80), Sex (Male/Female), Self-reported Race/Ethnicity (White/European, Black/African American, Asian, Hispanic/Latino), BMI (Normal, Overweight, Obese), CT Scanner Manufacturer (GE, Siemens, Philips, Canon)
Evaluation Dataset: Held-out test sets not used in training or validation. Minimum N=100 per subgroup assessed; subgroups with fewer cases flagged as "insufficient data."
Fairness Metrics: Sensitivity parity, specificity parity, equalized odds, predictive parity, demographic parity. Clinically meaningful threshold: >3% absolute difference in sensitivity between any two subgroups of the same characteristic.
Statistical Method: Bootstrap resampling (N=1,000 iterations) for confidence intervals. McNemar's test for paired comparison between subgroups.

2. PE DETECTION MODEL — FAIRNESS RESULTS
Sex:
- Male: Sensitivity 95.3% (95% CI: 93.1–97.2%)
- Female: Sensitivity 94.9% (95% CI: 92.4–97.1%)
- Difference: 0.4% (not significant, p=0.74)

Age Group:
- 18–44: Sensitivity 93.8%
- 45–64: Sensitivity 95.6%
- 65–79: Sensitivity 95.1%
- ≥80: Sensitivity 94.4%
- Maximum absolute difference: 1.8% (not clinically meaningful)

Race/Ethnicity:
- White/European: Sensitivity 95.4%
- Black/African American: Sensitivity 94.7%
- Asian: Sensitivity 95.1%
- Hispanic/Latino: Sensitivity 94.9%
- NOTE: Insufficient data (N<100) for Native American and Pacific Islander subgroups — flagged as data gap.

BMI:
- Normal (<25): Sensitivity 95.8%
- Overweight (25–30): Sensitivity 95.2%
- Obese (>30): Sensitivity 93.9%
- Note: Performance slightly lower in obese patients, attributed to image quality degradation and greater image noise at higher BMI. Difference (1.9%) does not meet clinical significance threshold.

CONCLUSION (PE): No clinically meaningful disparities identified. Data gaps exist for smaller racial/ethnic subgroups.

3. ICH DETECTION MODEL — FAIRNESS RESULTS
Sex: Male 96.9%, Female 96.7% — no significant difference (p=0.81)
Age: AUC range 0.969–0.977 across age groups — no significant variation
Race/Ethnicity:
- White/European: Sensitivity 97.3%
- Black/African American: Sensitivity 94.1%
- Asian: Sensitivity 96.9%
- Hispanic/Latino: Sensitivity 96.4%
- IDENTIFIED DISPARITY: 3.2% absolute sensitivity gap for Black/African American patients vs. White/European patients. This exceeds the 3% clinical significance threshold.
- Root Cause Investigation: Ongoing. Preliminary analysis suggests disproportionate training representation (Black/African American cases: 14% of training data vs. 18% of US population prevalence) and different prevalence of hypertensive ICH subtypes. Additionally, sickle cell-related ICH morphology may differ from the more common hypertensive pattern dominant in training data.
- Mitigation Actions: (1) Active data collection effort targeting institutions with higher Black/African American patient populations; (2) Targeted fine-tuning on augmented dataset; (3) External clinical advisory review underway; (4) Disclosed in model card and clinician-facing documentation.

4. OVERALL ASSESSMENT AND REMEDIATION PLAN
Status: ICH model disparity identified and under active remediation. All other model-subgroup combinations within acceptable fairness bounds.
Remediation Timeline: Augmented ICH model targeting <1.5% disparity expected Q2 2024. Will require new validation study and 510(k) supplement.
Ongoing Monitoring: Quarterly fairness audits on production inference data (de-identified, aggregated). Disparities >2% in production data trigger immediate review.
Limitations: Self-reported race/ethnicity data was incomplete for 12% of cases. Intersectionality analysis (e.g., elderly Black women) not performed due to insufficient subgroup sizes.`,
      },
      {
        name: "Model Card",
        category: "Transparency",
        description: "Intended use, limitations, performance metrics",
        content: `AIDOC BRIEFCASE AI TRIAGE PLATFORM — MODEL CARD
Version: 4.2 | Published: November 2023
Follows: Google Model Card framework (Mitchell et al., 2019) & FDA AI/ML SaMD guidance

MODEL DETAILS
Name: Aidoc BriefCase AI Triage Platform (PE, ICH, C-Spine, Aortic modules)
Type: Multi-label Computer-Aided Detection (CADe) — Triage and Prioritization
Framework: PyTorch 1.9 (training); TorchScript (deployment)
Input: CT DICOM study (standard clinical protocols)
Output: Binary flag (finding present/absent) + confidence score (0–1) + localization heatmap overlay
Regulatory Status: FDA 510(k) Cleared (K201501); CE Mark Class IIa (TÜV SÜD)

INTENDED USE
Primary Users: Board-certified radiologists in emergency and inpatient settings
Intended Setting: Hospital radiology departments with PACS integration
Role in Workflow: Supplement to — not replacement of — radiologist interpretation. Designed to flag cases for expedited review and prioritize worklist ordering.
Contraindications: Not intended for use as sole diagnostic tool. Not validated for pediatric patients (<18 years). Not validated for pregnancy-related PE presentations. Not intended for screening asymptomatic populations.

PERFORMANCE METRICS (from prospective validation, N=1,250 for PE; N=4,200 for ICH)
PE Detection:
- Sensitivity: 95.1% | Specificity: 93.2% | AUC: 0.974 | PPV: 92.6% | NPV: 95.5%
ICH Detection:
- Sensitivity: 96.8% | Specificity: 95.3% | AUC: 0.973
C-Spine Fracture:
- Sensitivity: 91.3% | Specificity: 95.7% (prospective, N=620)
Aortic Emergency:
- Sensitivity: 93.5% | Specificity: 96.1% (retrospective, N=1,800)

TRAINING DATA SUMMARY
Total training cases: ~200,000 CT studies across all modules
Geographic coverage: 34+ institutions, 11 countries
Time period: 2012–2020
Demographics: See Bias & Fairness Assessment Report (AF-2023-BriefCase-v2.1) for detailed breakdown

KNOWN LIMITATIONS AND FAILURE MODES
1. Subsegmental PE: Algorithm performs significantly worse for isolated subsegmental PE (sensitivity ~78%) compared to central/lobar PE (sensitivity ~99%). Clinical context should always be considered.
2. Small ICH (<5 mL): Sensitivity drops to ~91% for hemorrhages under 5 mL. Small subdural hygromas may occasionally trigger false positives.
3. Motion Artifact: Studies with significant motion or metal artifact may produce unreliable results. The system includes an image quality check that flags low-quality studies.
4. Non-standard Protocols: Algorithm was not validated for non-standard acquisition protocols (e.g., non-diagnostic technique, incorrect window/level at acquisition).
5. Rare Findings: The system only alerts for its four cleared categories. Other urgent findings (e.g., pneumothorax, bowel obstruction) are not detected.
6. ICH in Black/African American Patients: A 3.2% sensitivity gap has been identified and is under active remediation (see Bias & Fairness Assessment).

ETHICAL CONSIDERATIONS
Alert Fatigue: The system is designed to limit false positives to reduce alert fatigue. However, any alert system risks diminishing the radiologist's independent review of non-flagged cases. Radiologists should review all studies regardless of AI output.
Automation Bias: Clinical governance at deploying institutions should include training to mitigate automation bias.
Human Override: Any AI alert can be dismissed or overridden by the radiologist with no clinical consequence. Override rates are monitored as a quality metric.

FEEDBACK AND CONTACT
Clinical questions: clinical@aidoc.com
Safety reporting: safety@aidoc.com (also reportable as MAUDE adverse events to FDA)
Model card maintained at: aidoc.com/model-card`,
      },
      {
        name: "Software Bill of Materials (SBOM)",
        category: "Technical",
        description: "Complete dependency listing",
        content: `AIDOC BRIEFCASE AI TRIAGE PLATFORM — SOFTWARE BILL OF MATERIALS (SBOM)
Format: SPDX 2.3 (ISO/IEC 5962:2021)
Generated: November 14, 2023
Tool: Syft v0.96.0
Production Version: BriefCase v4.2.1

DOCUMENT INFORMATION
SPDXID: SPDXRef-DOCUMENT
DocumentNamespace: https://aidoc.com/sbom/briefcase-v4.2.1
Creator: Aidoc Medical Ltd. — Security Engineering Team

PRIMARY COMPONENTS (Selected — Full SBOM contains 847 packages)

RUNTIME DEPENDENCIES — AI INFERENCE ENGINE
PackageName: torch | Version: 1.9.1+cu111 | License: BSD-3-Clause | Source: pytorch.org
PackageName: torchvision | Version: 0.10.1 | License: BSD-3-Clause | Source: pytorch.org
PackageName: numpy | Version: 1.21.6 | License: BSD-3-Clause | Source: pypi.org
PackageName: pydicom | Version: 2.3.1 | License: MIT | Source: pypi.org
PackageName: SimpleITK | Version: 2.2.0 | License: Apache-2.0 | Source: pypi.org
PackageName: scikit-image | Version: 0.19.3 | License: BSD-3-Clause | Source: pypi.org
PackageName: scipy | Version: 1.7.3 | License: BSD-3-Clause | Source: pypi.org
PackageName: Pillow | Version: 9.5.0 | License: HPND | Source: pypi.org
PackageName: onnxruntime-gpu | Version: 1.15.1 | License: MIT | Source: pypi.org

RUNTIME DEPENDENCIES — BACKEND API
PackageName: fastapi | Version: 0.103.1 | License: MIT | Source: pypi.org
PackageName: uvicorn | Version: 0.23.2 | License: BSD-3-Clause | Source: pypi.org
PackageName: pydantic | Version: 2.4.2 | License: MIT | Source: pypi.org
PackageName: sqlalchemy | Version: 2.0.21 | License: MIT | Source: pypi.org
PackageName: redis | Version: 7.2.1 | License: BSD-3-Clause | Source: redis.io
PackageName: celery | Version: 5.3.4 | License: BSD-3-Clause | Source: pypi.org

DICOM INTEGRATION
PackageName: dcm4che | Version: 5.29.2 | License: LGPL-2.1 | Source: dcm4che.org
PackageName: pynetdicom | Version: 2.0.2 | License: MIT | Source: pypi.org

INFRASTRUCTURE
PackageName: docker | Version: 24.0.6 | License: Apache-2.0
PackageName: kubernetes | Version: 1.28.2 | License: Apache-2.0
PackageName: nginx | Version: 1.25.2 | License: BSD-2-Clause

KNOWN VULNERABILITIES
CVE-2023-38325: cryptography package v41.0.1 — Patched in v41.0.3 (deployed Nov 2023)
CVE-2023-44487: HTTP/2 Rapid Reset — Patched via nginx update (deployed Oct 2023)
Status: All critical and high CVEs resolved within SLA. Current open: 2 medium CVEs, 4 low CVEs (under scheduled remediation)

SOUP (Software of Unknown Provenance) MANAGEMENT
All third-party components tracked per IEC 62304 SOUP management procedure (QP-SW-012). Each SOUP item assessed for: safety impact, security risk, license compatibility, maintenance status. Full SOUP list maintained in internal QMS (Veeva Vault).

OPEN SOURCE LICENSE COMPLIANCE
License scan performed using FOSSA v3.8. All licenses compatible with commercial distribution. LGPL components (dcm4che) used in compliance with LGPL linking requirements. Full license texts available in /licenses directory of deployment package.`,
      },
      {
        name: "Risk Management File (ISO 14971)",
        category: "Safety",
        description: "FMEA, risk-benefit analysis",
        content: `AIDOC BRIEFCASE AI TRIAGE PLATFORM — RISK MANAGEMENT FILE
Standard: ISO 14971:2019 — Medical Devices: Application of Risk Management
Document: RM-2023-BriefCase-v5.1
Risk Management Process Owner: VP Clinical & Regulatory Affairs

1. RISK MANAGEMENT PLAN SUMMARY
Scope: Entire BriefCase AI Triage Platform lifecycle — from design to post-market
Risk Acceptability Criteria:
- Residual Risk per Hazard: Acceptable if Risk Priority Number (RPN) ≤ 12 after controls
- Overall Residual Risk: Acceptable if overall risk-benefit analysis demonstrates clinical benefit outweighs residual risks
Risk Management Team: Clinical Affairs, Software Engineering, Cybersecurity, Regulatory Affairs, QA

2. HAZARD IDENTIFICATION AND FMEA (Selected Critical Hazards)

Hazard 1: FALSE NEGATIVE — Algorithm fails to alert on true positive finding
- Failure Mode: Model confidence below alert threshold; image quality failure; novel presentation outside training distribution
- Potential Harm: Delayed treatment of PE/ICH/fracture/aortic emergency; patient mortality or serious injury
- Severity: Critical (S=5)
- Probability Before Controls: Occasional (P=3) → RPN=15
- Risk Controls Implemented:
  (a) Alert threshold optimized for ≥94% sensitivity (exceeds predicate devices)
  (b) Image quality checker auto-flags low-quality studies for radiologist attention
  (c) IFU explicitly states: radiologist must review all cases regardless of AI output
  (d) Training and alerts that system is not a replacement for clinical judgment
- Probability After Controls: Remote (P=2) → Residual RPN=10 ✓ ACCEPTABLE

Hazard 2: FALSE POSITIVE — Algorithm alerts on non-positive finding
- Failure Mode: Mimics of PE/ICH (e.g., pulmonary vasculitis, beam-hardening artifact)
- Potential Harm: Unnecessary workup, contrast exposure, anticoagulation; resource misallocation
- Severity: Moderate (S=3)
- Probability Before Controls: Occasional (P=3) → RPN=9
- Risk Controls:
  (a) Specificity ≥93% maintained at operating point
  (b) Model card and IFU disclose false positive rate and common mimics
  (c) Confidence score visible to radiologist to support contextual assessment
- Residual RPN=6 ✓ ACCEPTABLE

Hazard 3: SYSTEM UNAVAILABILITY — AI triage tool offline
- Failure Mode: Server downtime, network failure, PACS integration failure
- Potential Harm: Delay in worklist prioritization; clinical workflow disruption
- Severity: Minor (S=2) [Radiologist continues standard read without AI assistance]
- Probability: Occasional (P=3) → RPN=6
- Risk Controls: 99.9% uptime SLA; hot-standby server; automatic failsafe (no modification to radiologist worklist if system down); status dashboard
- Residual RPN=4 ✓ ACCEPTABLE

Hazard 4: CYBERSECURITY BREACH — Unauthorized access to AI system
- Failure Mode: Denial of service attack; adversarial model manipulation; PHI breach
- Potential Harm: System unavailability (as above); patient privacy breach; malicious alerts
- Severity: Critical (S=5) for PHI breach; Moderate (S=3) for service disruption
- Risk Controls: TLS 1.3 encryption; network isolation; penetration testing (annual); SOC 2 Type II; input validation; anomaly detection
- Residual Risk: Acceptable with controls in place

3. RISK-BENEFIT ANALYSIS SUMMARY
Benefit: AI-assisted triage reduces median time-to-alert by 27.5 minutes (31.7 min standard vs. 4.2 min AI-assisted) for PE. Published literature (Shah et al., 2022) documents improved door-to-needle times and reduced mortality in institutions using AI triage for ICH. Overall clinical benefit is significant.
Residual Risk: All identified hazards reduced to acceptable RPN levels after controls. Overall residual risk is low and proportionate to the clinical benefit.
Conclusion: Risk-benefit balance is favorable. The benefits of reduced time-to-treatment for life-threatening conditions outweigh the residual risks.

4. POST-MARKET RISK MONITORING
Safety complaints: safety@aidoc.com (target response: 1 business day)
MAUDE reporting: All device-related adverse events reported within 30 days (MDR 803.50)
Periodic Safety Update: Annual PSUR submitted to TÜV SÜD (EU MDR Article 86)
Risk file review: Annual review scheduled each November`,
      },
      {
        name: "IEC 62304 Software Lifecycle",
        category: "Quality",
        description: "Development lifecycle documentation",
        content: `AIDOC BRIEFCASE AI TRIAGE PLATFORM — SOFTWARE LIFECYCLE PROCESS DOCUMENT
Standard: IEC 62304:2006+AMD1:2015 — Medical Device Software: Software Life Cycle Processes
Document: SLC-2023-BriefCase-v3.0
Safety Classification: Class B (software that is not a Class C safety class software but contributes to a potentially hazardous situation)

1. SOFTWARE DEVELOPMENT PLAN SUMMARY
Development Methodology: Agile (Scrum) with regulatory-compliant sprint gating. 2-week sprints; regulatory checkpoints at major version milestones.
Source Control: Git (GitHub Enterprise). All commits signed. Main branch protected; requires 2 code reviews + CI passing.
Build System: GitHub Actions CI/CD. All builds reproducible from source.
Release Process: Development → Internal QA → Clinical Testing → Regulatory Review → Production

2. SOFTWARE REQUIREMENTS MANAGEMENT
Requirements Tool: Jama Connect (requirements management)
Traceability: Full bidirectional traceability from system requirements → software requirements → design → implementation → test case → test result
Requirements Review: All requirements reviewed by clinical, regulatory, and engineering stakeholders before implementation

3. ARCHITECTURE AND DESIGN
Architecture Document: Referenced (see Algorithm Architecture Document v4.2)
Design Reviews: Mandatory design review gate before implementation phase. Reviewed by: senior engineer, QA, clinical affairs representative.
Software Items: System decomposed into 7 major software items: (1) DICOM Listener, (2) Pre-processing Pipeline, (3) AI Inference Engine, (4) Post-processing & Localization, (5) Alert Generation & Routing, (6) PACS Integration, (7) Monitoring & Logging

4. SOFTWARE UNIT TESTING
Coverage Target: ≥85% line coverage for all safety-relevant software items
Current Coverage: 91.3% line coverage (measured by pytest-cov; CI enforced)
Unit Test Count: 2,847 unit tests
CI Execution Time: ~18 minutes per PR

5. INTEGRATION AND SYSTEM TESTING
Integration Test Suite: 412 integration tests covering inter-component interfaces (DICOM handshake, inference pipeline end-to-end, alert routing)
System Test: Full end-to-end system test with real DICOM data on production-equivalent infrastructure before each release
Clinical Test Set: Fixed, locked test set of 500 cases (200 PE, 150 ICH, 75 C-Spine, 75 Aortic) used for regression testing at each release. Performance must not regress by >1% sensitivity/specificity from prior release.

6. SOUP (SOFTWARE OF UNKNOWN PROVENANCE) MANAGEMENT
Procedure: QP-SW-012
All SOUP components listed in SBOM (see Software Bill of Materials v4.2.1)
SOUP assessment criteria: Open source maintenance activity, known vulnerabilities, license compatibility, functional impact
SOUP updates scheduled quarterly; security patches tracked continuously

7. SOFTWARE PROBLEM RESOLUTION
Defect Tracking: Jira (cloud). All defects triaged within 2 business days by QA.
Severity Classification:
- Critical: Safety-impacting; requires immediate hotfix release (target 48h)
- High: Significant functional impact; addressed in next sprint
- Medium/Low: Scheduled for next release cycle
MDR Reportability: All potential device-related adverse events assessed within 15 days. Reports filed to FDA (MAUDE) and EU (EUDAMED) as required.

8. CONFIGURATION MANAGEMENT
All software artifacts (source code, requirements, test records, build artifacts) version controlled and archived. Retention: minimum 15 years from market withdrawal. Backup: Daily snapshots to geographically redundant AWS S3 (primary) and Azure Blob (secondary).`,
      },
      {
        name: "Post-Market Surveillance Plan",
        category: "Monitoring",
        description: "Real-world monitoring framework",
        content: `AIDOC BRIEFCASE AI TRIAGE PLATFORM — POST-MARKET SURVEILLANCE (PMS) PLAN
Standard: MDR 2017/745 Article 83; FDA 21 CFR 803; ISO 13485 Section 8.2.1
Document: PMS-2023-BriefCase-v2.3
PMS Owner: VP Clinical Affairs & Post-Market Safety

1. PMS PLAN OBJECTIVES
(a) Monitor real-world performance against validated benchmarks
(b) Detect early signals of performance degradation, bias, or drift
(c) Identify previously unknown risks and adverse events
(d) Satisfy regulatory reporting requirements (FDA MDR; EU PSUR)
(e) Continuously improve the device through post-market clinical follow-up (PMCF)

2. DATA COLLECTION SOURCES
Source 1: Automated Performance Monitoring (Anonymous, Aggregated)
- Data: Inference confidence score distribution, alert rate, alert confirmation rate (radiologist override and dismissal rates), image quality flag rate
- Frequency: Continuous; statistical summary generated weekly
- Coverage: All ≥120 connected institutions (as of Nov 2023) providing opt-in anonymized telemetry

Source 2: Customer Complaint System
- Channel: support@aidoc.com; in-app feedback mechanism; clinical site coordinators
- Process: All complaints triaged within 2 business days; potential adverse events escalated to PMS Safety team within 24 hours

Source 3: Literature Surveillance
- Frequency: Monthly automated PubMed search (terms: "Aidoc", "AI triage", "PE detection deep learning", "ICH detection AI", "radiology AI triage")
- Review: Clinical Affairs team reviews new publications for safety signals and performance data

Source 4: Vigilance and Adverse Event Reports
- FDA MAUDE database: Quarterly review for competitor and analogous device reports
- EUDAMED: Quarterly review of EU equivalent

3. PERFORMANCE MONITORING — KEY METRICS AND THRESHOLDS
Alert Rate:
- Baseline (from clinical trials): PE 8.2% of studies, ICH 5.1%, C-Spine 2.3%, Aortic 1.8%
- Action threshold: >20% sustained deviation from baseline → investigation triggered

Alert Confirmation Rate (Proxy for PPV):
- Definition: % of AI alerts confirmed as positive in final radiologist report
- Baseline: PE 87.3%, ICH 91.2%
- Action threshold: <75% for any module → performance review

False Negative Signals:
- Tracked via opt-in radiologist feedback ("Case not flagged but should have been")
- Threshold: >5 reports per 10,000 studies → safety review

Image Quality Flag Rate:
- Baseline: 3.1% of studies flagged as insufficient quality
- Action threshold: >10% → PACS integration or scanner protocol issue investigation

4. PMCF (POST-MARKET CLINICAL FOLLOW-UP) PLAN
Study 1: Real-World Performance Registry (ongoing)
- Design: Prospective, observational, multicenter
- Sites: 15 participating institutions across US, EU, Israel, Australia
- N target: 5,000 cases/year per module
- Outcome: Real-world sensitivity, specificity, time-to-treatment

Study 2: Longitudinal Drift Study
- Design: Quarterly re-evaluation of fixed locked test set (500 cases)
- Purpose: Detect temporal drift in algorithm performance over time
- Threshold: >2% absolute sensitivity drop triggers retraining review

5. PERIODIC SAFETY UPDATE REPORT (PSUR)
Schedule: Annual (due January each year)
Content: Cumulative safety data, performance data, vigilance reports, complaint summary, literature review, benefit-risk re-evaluation
Submitted to: TÜV SÜD (EU MDR Article 86), internal QMS archive, FDA (upon request)`,
      },
      {
        name: "Cybersecurity Documentation",
        category: "Security",
        description: "SBOM, threat model, vulnerability management",
        content: `AIDOC BRIEFCASE AI TRIAGE PLATFORM — CYBERSECURITY DOCUMENTATION
Framework: FDA Cybersecurity Guidance for Medical Devices (2023); NIST Cybersecurity Framework v1.1; IEC 81001-5-1
Document: SEC-2023-BriefCase-v3.2

1. THREAT MODEL SUMMARY (STRIDE)
Spoofing: Mitigated by mutual TLS authentication between all system components; DICOM AE title validation; JWT authentication for API endpoints
Tampering: Code signing for all deployment artifacts; file integrity monitoring; read-only root filesystem in containers; tamper-evident audit logs
Repudiation: Comprehensive audit logging of all clinical alerts, radiologist confirmations/overrides, and system access; logs forwarded to immutable SIEM
Information Disclosure: PHI encrypted in transit (TLS 1.3) and at rest (AES-256); no patient data stored in AI inference pipeline; anonymized telemetry only; SOC 2 Type II certified
Denial of Service: Rate limiting on API; WAF (AWS WAF); auto-scaling; failsafe mode ensures no modification to clinical workflow if AI service unavailable
Elevation of Privilege: Role-based access control (RBAC); principle of least privilege for all service accounts; privileged access management (PAM) for admin access

2. NETWORK ARCHITECTURE
The BriefCase platform operates within the hospital network perimeter. The DICOM listener component is typically deployed within the hospital DMZ or PACS VLAN. Communication:
- PACS → Aidoc DICOM Listener: Encrypted DICOM TLS (port 4242 TLS)
- Inference Engine: Air-gapped from external internet during inference (no outbound PHI)
- Monitoring telemetry: Anonymized, aggregated metrics only; transmitted via HTTPS to Aidoc cloud (AWS us-east-1, SOC 2 certified)
- Customer Admin Portal: Accessed via HTTPS with MFA enforced

3. VULNERABILITY MANAGEMENT
CVE Monitoring: Automated daily CVE scanning via Grype and Trivy against SBOM (see SBOM document)
Severity SLA:
- Critical (CVSS ≥9.0): Patch deployed within 72 hours
- High (CVSS 7.0–8.9): Patch deployed within 2 weeks
- Medium (CVSS 4.0–6.9): Patch in next scheduled release
- Low (<4.0): Evaluated case-by-case; tracked in backlog

Penetration Testing: Annual third-party penetration test by independent CREST-certified firm. Last test: August 2023 (report on file). Findings: 1 high (remediated), 3 medium (remediated), 4 low (tracked).

4. SECURITY INCIDENT RESPONSE
Incident Classification: P1 (PHI breach or safety impact) / P2 (service disruption) / P3 (other)
Response Time: P1 → 1 hour; P2 → 4 hours; P3 → 2 business days
FDA Reporting: PHI breaches reportable under HIPAA Breach Notification Rule (within 60 days); MDR reportable if cybersecurity event impacts device safety/effectiveness
EU Reporting: EUDAMED vigilance report if cybersecurity event constitutes a serious incident under MDR Article 87

5. SUPPLY CHAIN SECURITY
All third-party software components tracked in SBOM. Dependency integrity verified via hash verification in CI pipeline. No dependency on unverified open source packages without SOUP assessment.

6. DEPLOYMENT SECURITY CHECKLIST (Per Site)
□ DICOM communication restricted to hospital PACS IP whitelist
□ Default passwords changed at installation
□ TLS certificates from trusted CA with ≤1 year validity
□ Monitoring telemetry reviewed at onboarding for PHI leakage
□ Hospital IT firewall rules documented and reviewed
□ Aidoc security configuration guide (SCG-2023-v2) provided to hospital IT`,
      },
      {
        name: "Clinical Decision Support Logic",
        category: "Clinical",
        description: "Alert thresholds and workflow integration",
        content: `AIDOC BRIEFCASE — CLINICAL DECISION SUPPORT LOGIC SPECIFICATION
Document: CDS-2023-BriefCase-v2.1
Clinical Sign-off: Chief Medical Officer, Aidoc Medical

1. ALERT GENERATION LOGIC
The BriefCase system generates a clinical alert when the AI model's confidence score for a finding exceeds the configured alert threshold. Thresholds are set at the model operating point corresponding to ≥94% sensitivity in the validation dataset.

Default Thresholds:
- PE Module: Confidence ≥ 0.52
- ICH Module: Confidence ≥ 0.48
- C-Spine Fracture Module: Confidence ≥ 0.61
- Aortic Emergency Module: Confidence ≥ 0.55

Configurable Range: Hospital clinical administrators may adjust thresholds within validated bounds (corresponding to 90–97% sensitivity) via the Aidoc Admin Console. Adjustments outside validated bounds are blocked by the system. Any threshold change triggers a re-validation notification and must be documented in the site's quality system.

2. ALERT CONTENT AND PRESENTATION
Each alert delivered to the radiologist includes:
(a) Finding type (e.g., "Suspected Pulmonary Embolism")
(b) Confidence level: High (≥0.75) / Moderate (0.60–0.74) / Low (<0.60) — displayed as text, not raw score
(c) DICOM overlay: Heatmap localizing the suspected finding region (not a diagnostic overlay — for reference only)
(d) Worklist flag: Case moved to top of radiologist worklist with "AIDOC ALERT" tag
(e) Optional: Mobile push notification to on-call radiologist (site-configurable)

Alert does NOT include: Specific diagnosis, treatment recommendation, or clinical management guidance.

3. WORKFLOW INTEGRATION
Pre-Read Triage: Alerts fire before radiologist reads the study. If radiologist is actively reading, alert notification appears as banner overlay in PACS (PACS integration required; not available for all PACS vendors).
Worklist Priority: Alerted cases are tagged as high priority in RIS worklist. Non-alerted cases retain original order.
Override Mechanism: Radiologist can dismiss alert with one click. Dismissal reason tracked (optional free text). Override rate monitored as quality metric.
Double-Read Pathway: Some institutions use AI alerts to trigger mandatory second-read policy for high-risk cases. This is a site-level clinical policy, not a system requirement.

4. EXPLAINABILITY FEATURES
Heatmap Overlay: Gradient-weighted Class Activation Map (Grad-CAM) shown on DICOM viewer. Indicates regions most influential in triggering the alert. Disclaimer displayed: "This localization is provided for reference only and should not replace radiologist assessment."
Confidence Score: Shown as categorical level (High/Moderate/Low) not raw probability, to reduce anchoring bias.
Alert History: Radiologist can view all prior alerts for a patient in Aidoc clinical dashboard.

5. FEEDBACK LOOP
Radiologist Confirmation: Radiologist final report outcome (PE confirmed/not confirmed) automatically captured via HL7 ORU message from RIS where available. Used for ongoing performance monitoring.
Case Flagging: Radiologist can flag case for clinical review ("I disagree with this alert" or "I think this should have been flagged"). Flagged cases reviewed monthly by Aidoc clinical team.`,
      },
      {
        name: "Training Data Governance",
        category: "Data",
        description: "Data provenance, consent documentation",
        content: `AIDOC BRIEFCASE — TRAINING DATA GOVERNANCE DOCUMENT
Document: DG-2023-BriefCase-v3.1
Owner: Data Engineering & Legal/Compliance

1. DATA COLLECTION AND PROVENANCE
All training data was collected under formal data sharing agreements (DSAs) with contributing institutions. Data collection was conducted under one of the following legal bases:
(a) IRB-approved research protocol at contributing institution (US sites)
(b) Ethics committee approval under applicable national law (EU, Israel, Australia sites)
(c) Business Associate Agreement (BAA) covering de-identification and secondary research use (US only, under HIPAA waiver of authorization)

Contributing Institutions: 34 institutions (list on file; not publicly disclosed to protect commercial relationships)
Geographic Distribution: US (12 institutions), EU (8), Israel (7), Australia (4), South Korea (2), Brazil (1)
Acquisition Period: CT studies acquired 2012–2020

2. DE-IDENTIFICATION PROTOCOL
Standard Applied: HIPAA Safe Harbor de-identification (45 CFR § 164.514) for US data; EU: pseudonymization per GDPR Article 89; ISO standard for other jurisdictions.
Process: Automated de-identification pipeline removing 18 HIPAA identifiers from DICOM headers. Manual QA review of 5% random sample to verify completeness. DICOM pixel data reviewed for burned-in PHI (none found in validation sample).
Re-identification Risk Assessment: Expert determination performed confirming de-identification meets HIPAA standards. Re-identification probability assessed as very low (<0.01%).

3. ANNOTATION AND LABELING
Annotation Process: All cases annotated by board-certified radiologists (minimum 5 years experience). Positive cases (PE, ICH, etc.) confirmed by 2 independent radiologists; discrepancies resolved by consensus or senior adjudication.
Annotator Pool: 47 radiologists across contributing institutions. Annotator credentials verified. Formal annotation training provided (annotation protocol v2.4).
Label Quality Metrics: Inter-annotator agreement measured using Cohen's Kappa. PE labels: κ=0.91; ICH labels: κ=0.94. Cases with κ<0.7 between annotators excluded from training set (N=1,247 cases excluded).
Ground Truth Hierarchy: For clinical outcome labeling, CT report + 90-day follow-up considered gold standard for ambiguous cases.

4. DATA STORAGE AND SECURITY
Storage Location: AWS S3 (us-east-1), encrypted at rest (AES-256), access controlled via IAM
Access Control: Role-based; minimum necessary access. No PHI accessible to ML engineers — they access anonymized data only.
Data Retention: Training data retained for minimum 10 years from market withdrawal per regulatory guidance.
Deletion Protocol: Upon contract expiration with contributing institution, associated data flagged for secure deletion (NIST 800-88 compliant).

5. ONGOING DATA GOVERNANCE
New Data Contributions: All new training data additions require DSA renewal or amendment; ethics review if expanding scope.
Audit Trail: Full audit trail of data access, modification, and use maintained in Aidoc data catalog (DataHub).
Subprocessor Disclosure: Data shared with cloud service provider (AWS) under BAA/DPA. No other subprocessors have access to training data.`,
      },
      {
        name: "Interoperability Specifications",
        category: "Technical",
        description: "DICOM, HL7 FHIR, API documentation",
        content: `AIDOC BRIEFCASE — INTEROPERABILITY SPECIFICATIONS
Document: INT-2023-BriefCase-v4.0
Audience: Hospital IT, PACS Administrators, EMR Integration Teams

1. DICOM INTEGRATION
DICOM Conformance Statement: Published at aidoc.com/dicom-conformance (version 4.2)
Supported Transfer Syntax: Explicit VR Little Endian (1.2.840.10008.1.2.1), Implicit VR Little Endian (1.2.840.10008.1.2), JPEG 2000 Lossless (1.2.840.10008.1.2.4.90)
DICOM Services:
  Storage SCP: Receives CT DICOM studies from PACS (C-STORE)
  Query/Retrieve SCU: Can query PACS for prior studies (C-FIND, C-MOVE)
  Modality Worklist: Not applicable (output device)
  Structured Report (SR): Returns findings as DICOM SR (template TID 1500)
  DICOM Overlay: Returns heatmap as DICOM Grayscale Softcopy Presentation State (GSPS)
Supported Modalities: CT (all manufacturers; Siemens, GE, Philips, Canon, Hitachi tested)
Minimum DICOM Quality Requirements: ≥4 slices; slice thickness ≤5mm; standard CT protocol

2. HL7 FHIR INTEGRATION (Optional)
FHIR Version: R4 (4.0.1)
Base URL: https://{hospital-domain}/aidoc/fhir/r4
Authentication: SMART on FHIR (OAuth 2.0); supports both backend services and EHR launch
Resources Supported:
  DiagnosticReport (read/write): AI findings published as DiagnosticReport with conclusion and presentedForm attachment
  ImagingStudy (read): Used to correlate AI results with FHIR imaging study records
  Patient (read): Patient demographics for correlation (read-only; never modified by Aidoc)
  ServiceRequest (read): Used to initiate AI processing from FHIR-integrated order workflow
FHIR Capabilities Statement: Available at {base-url}/metadata
Bulk Data Export: FHIR Bulk Data Access (NDJSON format) supported for analytics use cases (requires separate activation)

3. REST API (INTERNAL INTEGRATION)
Base URL: https://{site-domain}/api/v2
Authentication: API key (per site); OAuth 2.0 client credentials for enterprise integrations
Key Endpoints:
  POST /studies/{studyUID}/analyze — Trigger AI analysis for a study
  GET /studies/{studyUID}/results — Retrieve AI results for a study
  GET /alerts — List all active alerts for site (supports pagination)
  PATCH /alerts/{alertId} — Update alert status (acknowledge, dismiss)
  GET /metrics — Retrieve site-level performance metrics (aggregate, anonymized)
Rate Limiting: 100 req/min per API key; burst: 200 req/min for 30 seconds
API Documentation: OpenAPI 3.0 spec available at aidoc.com/api-docs

4. EMR INTEGRATION
HL7 v2.x: ORU^R01 messages sent to EMR for alert notification (optional)
Epic: App Orchard certified integration; results displayed in Epic Radiology module
Cerner: PowerChart integration via BPA (Best Practice Advisory) for relevant clinical alerts

5. TESTED PACS COMPATIBILITY (as of Nov 2023)
Fully Validated: Sectra IDS7, Philips IntelliSpace, Agfa XERO, Change Healthcare Stratus, Fujifilm Synapse, Intelerad InteleViewer
Partially Validated (basic DICOM): Meditech, Nuvolo, GE Centricity
Not Tested: Older non-DICOMweb PACS (pre-2010); installations using proprietary DICOM extensions`,
      },
      {
        name: "Human Factors Engineering Report",
        category: "Usability",
        description: "Summative usability study results",
        content: `AIDOC BRIEFCASE — HUMAN FACTORS ENGINEERING REPORT (SUMMATIVE USABILITY STUDY)
Standard: IEC 62366-1:2015; FDA Human Factors Guidance (2016)
Document: HFE-2023-BriefCase-v2.0
Study Conducted: April–June 2023

1. STUDY OVERVIEW
Objective: Evaluate the usability of the Aidoc BriefCase AI Triage Platform to ensure safe and effective use by the intended user population.
Study Design: Formative + Summative usability evaluation with simulated use scenarios
Intended Users: Emergency radiologists, general radiologists, radiology trainees (PGY3+)
Use Environments: Radiology reading room (primary); remote reading workstation; mobile (supplementary)

2. SUMMATIVE STUDY DESIGN
Participants: N=25 (16 attending radiologists, 6 radiology residents, 3 radiology PA/technologists)
Demographics: 14 male / 11 female; experience range 2–24 years; 19 US-based, 6 EU-based
Simulation: 8 representative use scenarios developed from task analysis; presented on production-equivalent system with simulated DICOM studies and alerts
Critical Task List: 12 critical tasks identified from FMEA (tasks where failure could cause patient harm or significant clinical workflow disruption)

3. CRITICAL TASKS AND RESULTS
CT-01: Correctly identify an AI alert in the PACS worklist
- Pass Rate: 24/25 (96%) ✓ PASS
- 1 failure: Participant using an unfamiliar PACS interface; not representative of trained use

CT-02: Correctly interpret alert confidence level (High/Moderate/Low)
- Pass Rate: 25/25 (100%) ✓ PASS

CT-03: Understand that AI alert does NOT replace radiologist read
- Pass Rate: 25/25 (100%) ✓ PASS (assessed via post-scenario knowledge questions)

CT-04: Correctly dismiss/override an incorrect alert
- Pass Rate: 23/25 (92%) ✓ PASS
- 2 use errors: Initial difficulty finding dismiss button in PACS overlay. Redesign: button made more prominent in v4.2 (post-study fix).

CT-05: Correctly interpret heatmap localization (identify intended meaning of heatmap)
- Pass Rate: 22/25 (88%) ✓ PASS
- 3 participants initially interpreted heatmap as definitive diagnostic boundary (corrected upon re-reading disclaimer text)
- Mitigation: Disclaimer text enlarged and made more prominent in final design

CT-06: Report a suspected error to clinical feedback system
- Pass Rate: 21/25 (84%) ✓ PASS
- 4 participants initially unclear how to access feedback mechanism
- Mitigation: Feedback button added directly to alert card in v4.2

CT-07: Identify system unavailability and proceed without AI
- Pass Rate: 25/25 (100%) ✓ PASS (system unavailability banner clearly visible)

All 12 critical tasks met pre-specified pass rate threshold of ≥80%. No critical use errors with patient safety implications were identified.

4. USE ERRORS AND CLOSE CALLS (NON-CRITICAL)
- 3 participants initially confused "High Confidence" with "Definitive Diagnosis" — addressed with updated tooltip text
- 2 participants attempted to screenshot DICOM overlay for clinical documentation — addressed in training materials

5. FORMATIVE STUDY HISTORY
Three formative studies conducted (2019, 2021, 2022) informed iterative design improvements. Key changes driven by human factors:
- Alert color scheme: Changed from red/green to blue/amber to accommodate red-green color blindness
- Alert duration: Extended from 30s to persistent (until dismissed) based on clinician feedback
- Mobile notification: Made opt-in per site after formative study showed alert fatigue concerns

6. RESIDUAL RISKS ACCEPTED
Heatmap misinterpretation risk: Accepted as residual risk; mitigated by prominent disclaimer, user training, and IFU language. Further study planned for heatmap redesign in v5.0.
Alert fatigue: Threshold calibration and specificity optimization reduce false positive rate; site-level monitoring tracks override rate as proxy for alert fatigue.`,
      },
      {
        name: "Monitoring & Drift Detection Plan",
        category: "Monitoring",
        description: "Performance monitoring, data drift alerts",
        content: `AIDOC BRIEFCASE — MONITORING AND DRIFT DETECTION PLAN
Document: MDP-2023-BriefCase-v2.2
Owner: Machine Learning Operations (MLOps) Team

1. OVERVIEW
This plan describes the Aidoc BriefCase platform's approach to monitoring production performance and detecting data drift or model degradation in real-world deployment. The plan applies to all four cleared modules (PE, ICH, C-Spine, Aortic).

2. MONITORING ARCHITECTURE
Data Collection: Anonymous, aggregated telemetry collected from all connected sites (opt-in). Data collected includes:
- Raw confidence score distribution per study (no PHI)
- Alert rate (alerts per 100 studies)
- Image quality flag rate
- Inference latency (95th percentile)
- Radiologist confirmation rate (where HL7 feedback available)
Collection Method: Secure HTTPS transmission to Aidoc monitoring platform (AWS CloudWatch + custom ML monitoring stack built on Evidently AI)
Refresh Rate: Real-time streaming; statistical aggregations computed hourly and daily

3. DRIFT DETECTION METHODS
Input Data Drift (Covariate Shift):
- Method: Kolmogorov-Smirnov (KS) test on confidence score distribution; Population Stability Index (PSI)
- Reference: Distribution from 90-day rolling baseline
- Alert Threshold: PSI > 0.2 OR KS p-value < 0.05 sustained over 7-day rolling window
- Interpretation: Indicates change in input data characteristics (e.g., scanner protocol change, patient population shift)

Output Distribution Drift:
- Method: Monitor alert rate (alerts/100 studies) with statistical control charts (CUSUM)
- Alert Threshold: Alert rate >20% deviation from site-specific baseline for >3 consecutive days
- Interpretation: May indicate input drift, seasonal variation, or model degradation

Performance Drift (where feedback available):
- Method: Monitor radiologist confirmation rate (AI TP / total AI alerts, proxy for PPV)
- Alert Threshold: Confirmation rate <75% sustained over 14-day rolling window
- Interpretation: Significant false positive increase; may indicate distribution shift or model degradation

4. RESPONSE PROTOCOLS
Level 1 — Monitoring Alert (automated):
Trigger: PSI >0.2 or alert rate deviation >20% for 3 days
Response: Automated notification to MLOps team; investigation launched within 2 business days
Action: Root cause analysis; escalation to Level 2 if not resolved

Level 2 — Performance Review (human):
Trigger: Confirmation rate <75% for 14 days; or Level 1 unresolved after 5 days
Response: Clinical and ML team review within 1 week
Action: Site-level investigation; consideration of threshold adjustment; case review with clinical team

Level 3 — Safety Review:
Trigger: Potential patient safety signal; sustained sensitivity drop >3%
Response: Immediate escalation to VP Clinical Affairs; risk management review within 48 hours
Action: Potential site suspension; FDA/EU notification if device malfunction suspected; corrective action per CAPA process

5. SITE-SPECIFIC BASELINE CALIBRATION
Each site establishes its own baseline alert rate and confidence distribution during a 90-day onboarding observation period. Drift detection uses site-specific baselines to account for differences in patient population and imaging protocols.

6. ANNUAL LOCKED TEST SET EVALUATION
Purpose: Detect temporal drift by re-evaluating the fixed validation test set (500 cases) on each production model version
Frequency: Quarterly
Threshold: >2% absolute sensitivity drop triggers retraining review
Process: Results documented and reviewed by Clinical Affairs; reported in annual PSUR`,
      },
      {
        name: "Organizational AI Governance Policy",
        category: "Governance",
        description: "AI ethics board, oversight processes",
        content: `AIDOC MEDICAL — ORGANIZATIONAL AI GOVERNANCE POLICY
Document: GOV-2023-AIdoc-v3.0
Effective: January 2023
Owner: Chief Medical Officer; Chief Ethics & Compliance Officer
Scope: All AI/ML products developed and commercialized by Aidoc Medical Ltd.

1. AI ETHICS PRINCIPLES
Aidoc is committed to the responsible development and deployment of AI in healthcare. Our AI governance is grounded in the following principles:

Beneficence: AI systems must provide measurable clinical benefit. We do not deploy AI tools unless clinical evidence demonstrates patient benefit.
Non-Maleficence: We actively assess and mitigate risks of harm from AI errors, biases, and misuse.
Autonomy: AI is a tool to support, not replace, clinical judgment. Clinicians retain full decision-making authority.
Justice: We are committed to AI performance equity across demographic groups. Identified disparities must be reported, investigated, and remediated.
Transparency: We publish model cards, bias assessments, and clinical validation data. We do not obscure limitations.

2. AI GOVERNANCE BOARD
Composition: Chief Medical Officer (Chair), Chief Technology Officer, VP Clinical Affairs, VP Regulatory, Chief Ethics & Compliance Officer, 3 External Independent Members (senior radiologists from non-customer institutions)
External Member Terms: 2-year terms, renewable once. Conflict of interest declarations required.
Meeting Frequency: Quarterly; extraordinary sessions as required for urgent matters
Responsibilities:
- Review and approve all new AI product concepts (pre-development gate)
- Review bias assessment reports and approve remediation plans
- Review significant algorithm changes (sensitivity/specificity impact >1%)
- Review serious adverse events and safety signals
- Annual review of this governance policy

3. AI PRODUCT LIFECYCLE GOVERNANCE GATES
Gate 0 — Concept Approval: Business case, clinical need, data availability, regulatory pathway reviewed by AI Governance Board
Gate 1 — Development Start: Ethics review, data governance plan approved, fairness targets set
Gate 2 — Clinical Validation: Validation study design reviewed; minimum performance standards confirmed
Gate 3 — Regulatory Submission: Full documentation reviewed; risk-benefit confirmed; bias assessment complete
Gate 4 — Commercial Release: AI Governance Board sign-off; monitoring plan activated
Gate 5 — Post-Market Annual Review: Performance, safety, bias, and literature review

4. BIAS AND FAIRNESS GOVERNANCE
Mandatory Bias Assessment: Required for all new AI products and major updates
Fairness Threshold: Any subgroup sensitivity gap >3% requires remediation before release (or disclosed and remediated post-release with a defined timeline)
Disparity Disclosure: All identified disparities disclosed in model card and IFU
Remediation Review: AI Governance Board reviews remediation plans and approves timelines

5. VENDOR AND PARTNER GOVERNANCE
Third-party AI components used in Aidoc products undergo equivalent governance review. Data sharing partners subject to Data Governance Policy (DGP-2023-v2.1) and ethics review requirements.

6. REGULATORY ALIGNMENT
This policy aligns with:
- FDA AI/ML-Based SaMD Action Plan (2021)
- EU Ethics Guidelines for Trustworthy AI (HLEG, 2019)
- WHO Ethics and Governance of AI for Health (2021)
- NIST AI Risk Management Framework (AI RMF 1.0, 2023)
- ISO/IEC 42001:2023 — AI Management Systems`,
      },
    ],
    evidenceByStandard: {
      "S1": "Strong: FDA 510(k) + CE Mark + ISO 14971 risk file + IEC 62304 lifecycle. Comprehensive regulatory portfolio.",
      "S2": "Strong: Full FMEA, risk-benefit analysis, post-market surveillance plan, human factors testing.",
      "S3": "Strong: Multi-site clinical validation with large sample sizes (PE N=1,250; ICH N=4,200). Published AUC metrics.",
      "S4": "Adequate: Model Card provided but could be more detailed on limitations. SBOM available.",
      "S5": "Adequate: Bias assessment exists but limited to retrospective analysis. Subgroup performance reported.",
      "S6": "Strong: Architecture documented, SBOM provided, training data governance described. Drift detection planned.",
      "S7": "Adequate: Human factors study done. Workflow integration described. Limited clinician engagement evidence.",
      "S8": "Adequate: Post-market plan exists. Monitoring framework described but not yet operational at scale.",
    },
  },
  {
    name: "Viz.ai Stroke",
    company: "Viz.ai",
    product: "Viz LVO Stroke Detection",
    description: "AI-powered large vessel occlusion detection for stroke triage. Has FDA clearance but moderate documentation depth. Some gaps in ethics and transparency evidence.",
    evidenceLevel: "moderate",
    documentCount: 10,
    vendorDocs: 7,
    governanceDocs: 3,
    expectedBadge: "Not Certified",
    expectedScoreRange: "25-40%",
    documents: [
      {
        name: "FDA 510(k) Clearance",
        category: "Regulatory",
        description: "De novo clearance for LVO detection",
        content: `FDA 510(k) CLEARANCE SUMMARY — K193130
Device: Viz LVO (Large Vessel Occlusion Detection)
Manufacturer: Viz.ai, Inc., San Francisco, CA
Cleared: February 2018

Intended Use: Viz LVO is a software device intended to notify physicians of suspected large vessel occlusions (LVO) on non-contrast CT and CT angiography studies.

The FDA determined Viz LVO to be substantially equivalent to predicate devices for computer-aided detection. The device is cleared for use as a triage and notification tool. It is not intended to replace diagnostic radiologist review.

Performance Summary (from submission):
- Sensitivity: 90.2% for LVO detection on CTA
- Specificity: 88.4%
- Dataset: Single-center retrospective, N=300 cases (150 LVO-positive, 150 LVO-negative)

Limitations noted by FDA: Single-center validation only. Performance in diverse populations not fully established. Post-market study recommended.

Note: This clearance was a De Novo classification request (DEN180063) as no suitable predicate existed at time of submission. The resulting classification is Product Code QAS.`,
      },
      {
        name: "Clinical Study — LVO Detection",
        category: "Clinical",
        description: "Single-center study, N=300, sensitivity 90%",
        content: `CLINICAL VALIDATION STUDY: Viz LVO Large Vessel Occlusion Detection
Study Type: Retrospective, single-center
Institution: [Proprietary — Available under NDA]
Sample Size: N=300 (150 LVO, 150 non-LVO)
Study Period: January 2016 – June 2017

Primary Results:
- Sensitivity: 90.2%
- Specificity: 88.4%
- AUC: 0.94

Algorithm performance evaluated against board-certified neuroradiologist consensus read. All cases reviewed by 2 neuroradiologists; discordant cases adjudicated by senior reviewer.

LVO Types Included: M1 occlusion (52%), M2 occlusion (24%), Basilar (14%), ICA terminus (10%).

Subgroup Analysis: Limited. No race/ethnicity breakdown. Age and sex not reported separately. Scanner type not varied (single GE scanner model at single site).

Limitations: Retrospective, single-center design limits generalizability. Case selection process not described in detail. No prospective validation published at this time. Multi-site and multi-scanner performance not characterized. The 300-case dataset is small relative to field standards.`,
      },
      {
        name: "Algorithm Summary",
        category: "Technical",
        description: "High-level architecture overview, limited detail",
        content: `VIZ LVO — ALGORITHM TECHNICAL SUMMARY
(Public-facing summary. Detailed architecture confidential.)

Viz LVO uses a convolutional neural network (CNN) trained on CT angiography (CTA) images to detect large vessel occlusions in the anterior and posterior cerebral circulation.

The algorithm analyzes the CTA DICOM series and generates a probability score for LVO presence. If the score exceeds the configured threshold, an alert is sent to the treating physician via the Viz platform (mobile app and/or web interface).

Input: CTA DICOM series (standard stroke protocol)
Output: Binary alert (LVO detected / not detected) + notification push to mobile app

Training Data: Multi-site CTA data (exact details proprietary). Training dataset size, demographic composition, and annotation methodology not disclosed in this summary document.

Architecture: CNN-based. Specific architecture, number of parameters, training framework, and hyperparameters are proprietary and not disclosed in this document.

Note: Full technical documentation is available under NDA for regulatory review purposes only. This summary is provided for initial evaluation; the evaluator may request the full architecture document via the vendor contact process.`,
      },
      {
        name: "Risk Analysis Summary",
        category: "Safety",
        description: "Abbreviated risk assessment",
        content: `VIZ LVO — RISK ANALYSIS SUMMARY
Based on ISO 14971 framework. Abbreviated version for external review.

Key Identified Hazards:
1. False Negative: Algorithm misses LVO → delayed treatment → worse stroke outcome
   - Controls: Alert threshold optimized for ≥90% sensitivity; IFU states device supplements, not replaces, physician review
   - Residual risk: Acceptable

2. False Positive: Algorithm alerts when no LVO present → unnecessary catheterization lab activation
   - Controls: Threshold calibrated; physicians must confirm before cath lab activation per clinical protocol
   - Residual risk: Acceptable

3. System Unavailability: Notification delayed or not delivered
   - Controls: Redundant notification pathways (app + SMS); 99% uptime SLA
   - Residual risk: Acceptable

Note: This is an abbreviated summary. Full risk management file (ISO 14971 compliant) available under NDA. Full FMEA, risk control measures, and verification testing not included in this summary. A complete risk management file was not provided as part of this evaluation submission.`,
      },
      {
        name: "User Manual",
        category: "Usability",
        description: "End-user documentation",
        content: `VIZ LVO — USER MANUAL (Summary)
Intended Audience: Stroke neurologists, emergency physicians, radiologists

The Viz platform delivers LVO detection alerts via mobile app (iOS/Android) and web dashboard. When Viz LVO detects a suspected LVO, the following notifications are sent:
- Push notification to mobile app
- SMS (optional, configurable)
- In-app alert with CT images and vessel map overlay

To access an alert: Open Viz app → Alerts tab → Select case → Review images → Confirm or dismiss alert.

The user must confirm the alert is clinically appropriate before any downstream clinical action (e.g., cath lab activation). The Viz platform does not directly activate any clinical pathways — it notifies; humans decide and act.

Note: No formal human factors engineering (HFE) study has been completed. This manual was developed based on internal usability feedback during beta testing. A summative HFE study is planned for future submission.`,
      },
      {
        name: "HIPAA Compliance Statement",
        category: "Security",
        description: "Privacy compliance attestation",
        content: `VIZ.AI HIPAA COMPLIANCE ATTESTATION

Viz.ai, Inc. attests that the Viz platform is operated in compliance with the HIPAA Privacy Rule (45 CFR Parts 160 and 164) and the HIPAA Security Rule.

Business Associate Agreements (BAAs): Viz.ai executes BAAs with all covered entity customers prior to handling PHI.

Data Encryption: PHI is encrypted in transit (TLS 1.2+) and at rest (AES-256).

Access Controls: Role-based access control implemented. PHI access logged and audited.

Data Retention: PHI retained per customer configuration; default 90-day retention for CT images, 1-year for alert data.

Breach Notification: Viz.ai maintains a breach notification procedure per 45 CFR § 164.410.

Note: This attestation is provided as a compliance statement. Third-party SOC 2 Type II audit has not yet been completed. A penetration test was conducted internally in 2022; report available under NDA. Formal cybersecurity documentation (threat model, SBOM, vulnerability management process) has not been provided as part of this submission.`,
      },
      {
        name: "Integration Guide",
        category: "Technical",
        description: "DICOM connectivity specifications",
        content: `VIZ LVO — INTEGRATION GUIDE (Summary)
For IT and PACS administrators.

Viz connects to hospital PACS via standard DICOM protocol.

DICOM Setup:
- Viz DICOM listener AE Title: VIZ_RECEIVE
- Port: 11112 (configurable)
- Supported SOP Classes: CT Image Storage
- The PACS must be configured to auto-forward CTA studies to the Viz DICOM listener

Supported PACS: Testing performed with Sectra, Agfa, and GE Centricity. Other PACS may work but are not formally validated.

HL7: HL7 v2 ADT feed optional for patient demographics. Not required for core functionality.

FHIR: FHIR integration not currently available. Roadmap item for 2024.

Mobile: Physicians download the Viz app from the App Store (iOS) or Google Play (Android). Account provisioning managed by hospital Viz administrator.`,
      },
      {
        name: "Quality Management Overview",
        category: "Quality",
        description: "ISO 13485 summary",
        content: `VIZ.AI — QUALITY MANAGEMENT SYSTEM OVERVIEW
Certification: ISO 13485:2016
Certificate Number: [On file with notified body]
Certifying Body: BSI Group

Viz.ai maintains an ISO 13485-certified Quality Management System (QMS) covering the design, development, and commercialization of the Viz platform software.

Key QMS elements:
- Document Control: All procedures and records maintained in QMS system
- Design Control: Product development follows design control process per ISO 13485 Section 7.3
- CAPA: Corrective and Preventive Action process operational
- Internal Audit: Annual internal QMS audit completed
- Management Review: Annual review by executive team

Note: Full QMS documentation and audit records are available under NDA for regulatory or customer audit purposes. An IEC 62304 software lifecycle document is not currently available as a standalone document. Software lifecycle activities are described within the QMS design control procedures.`,
      },
      {
        name: "Post-Market Commitment Letter",
        category: "Monitoring",
        description: "Commitment to ongoing monitoring",
        content: `POST-MARKET SURVEILLANCE COMMITMENT LETTER

To: Evaluation Committee
From: Viz.ai Clinical Affairs
Re: Post-Market Surveillance Commitment — Viz LVO

Viz.ai is committed to ongoing post-market monitoring of the Viz LVO device. We commit to the following post-market activities:

1. Customer Complaint Monitoring: All safety complaints reviewed by our clinical team within 5 business days. Adverse events reported to FDA per MDR requirements.

2. Literature Surveillance: Quarterly review of published literature on AI-based LVO detection.

3. Performance Monitoring: Ongoing internal monitoring of alert rate and radiologist feedback.

4. Post-Market Study: We are planning a multi-site prospective study (target N=500) to expand the clinical evidence base for Viz LVO. Study protocol under development; expected to initiate Q3 2024.

Note: A formal Post-Market Surveillance Plan (PMS plan) per ISO 13485 or EU MDR Article 83 has not yet been finalized and was not available for this submission. The above represents our current commitment and planned activities.`,
      },
      {
        name: "Brief Ethics Statement",
        category: "Ethics",
        description: "General commitment to AI ethics",
        content: `VIZ.AI — ARTIFICIAL INTELLIGENCE ETHICS STATEMENT

Viz.ai is committed to the responsible development of AI in healthcare. We believe AI should augment physician decision-making, not replace it.

Our commitments:
- Clinical Validation: We validate our AI on clinical data before deployment
- Transparency: We disclose performance metrics to customers and regulators
- Safety: Patient safety is our primary consideration
- Equity: We are committed to evaluating our AI for bias and fairness

Current Status:
We have not yet conducted a formal bias and fairness assessment for Viz LVO. We acknowledge this is an important area and commit to completing a bias assessment as part of our post-market activities (target: Q4 2024).

Our AI ethics principles are under development as part of a broader corporate AI governance framework expected to be finalized in 2024.

Note: Viz.ai does not currently have a formal AI Ethics Board or external ethics review process. The above represents our organizational commitment and stated intentions.`,
      },
    ],
    evidenceByStandard: {
      "S1": "Moderate: FDA clearance present but limited international regulatory coverage. Basic risk file.",
      "S2": "Minimal: Abbreviated risk assessment, limited post-market evidence, basic quality system.",
      "S3": "Minimal: Single-center study only (N=300). No external validation. Limited subgroup analysis.",
      "S4": "Minimal: No model card, no SBOM. Algorithm summary is high-level only.",
      "S5": "Not Met: Brief ethics statement only. No bias assessment. No fairness metrics.",
      "S6": "Minimal: High-level architecture. No training data documentation. No drift monitoring.",
      "S7": "Minimal: User manual exists but no formal human factors study. Limited workflow integration evidence.",
      "S8": "Minimal: Commitment letter but no operational monitoring plan. No performance dashboards.",
    },
  },
  {
    name: "AliveCor ECG",
    company: "AliveCor",
    product: "KardiaMobile AI ECG",
    description: "Consumer-facing AI ECG analysis device. FDA cleared for atrial fibrillation detection but very limited governance and validation documentation available for enterprise evaluation.",
    evidenceLevel: "minimal",
    documentCount: 5,
    vendorDocs: 4,
    governanceDocs: 1,
    expectedBadge: "Not Certified",
    expectedScoreRange: "5-15%",
    documents: [
      {
        name: "FDA 510(k) Clearance",
        category: "Regulatory",
        description: "Clearance for AF detection in consumer device",
        content: `FDA 510(k) CLEARANCE — K173139
Device: KardiaMobile (previously AliveCor Heart Monitor)
Cleared for: Detection of atrial fibrillation and normal sinus rhythm
Classification: Class II, Product Code: DSI
Cleared: November 2017

Intended Use: The KardiaMobile device is a consumer-facing, single-channel ECG recorder with AI-based interpretation. The device is intended for use by adult patients to record, display, and analyze a single-lead ECG. The AI algorithm classifies the recorded ECG as normal sinus rhythm, atrial fibrillation, or unclassified.

This clearance covers the KardiaMobile hardware device and the companion Kardia app including the AI ECG analysis algorithm. This is a consumer (direct-to-consumer) clearance. The device is NOT cleared for clinical use in hospital or inpatient settings.

Performance Summary (from submission):
- Sensitivity for AF detection: 98% (retrospective validation, N=2,532)
- Specificity: 97%

Note: This clearance is for a consumer-grade device. It does not constitute clearance for use as a clinical-grade enterprise medical device in hospital workflows, EMR integration, or population health monitoring programs. Use in clinical enterprise settings would require separate regulatory evaluation.`,
      },
      {
        name: "Marketing Clinical Summary",
        category: "Clinical",
        description: "Marketing-grade summary of AF detection accuracy",
        content: `KARDIAMOBILE — CLINICAL PERFORMANCE SUMMARY
(Marketing document — for customer and clinician awareness)

KardiaMobile has been used by millions of patients worldwide. Published research and our clinical validation demonstrate industry-leading accuracy for atrial fibrillation detection.

Key Performance Claims:
- 98% sensitivity for AF detection
- 97% specificity for normal sinus rhythm
- Cleared by FDA for AF detection

Published Studies: Multiple peer-reviewed publications support the clinical utility of KardiaMobile for AF detection in outpatient and consumer settings.

Clinical Use Cases: Symptom-triggered ECG recording; AF screening programs; post-ablation monitoring; anticoagulation management support.

Important Note: The above performance data is from the FDA 510(k) validation dataset (consumer use). This document is a marketing summary intended for general clinician awareness. It is not a full clinical validation report. Detailed methodology, subgroup analysis, site diversity, and demographic breakdown are not included in this summary. A full peer-reviewed publication and clinical validation report for enterprise/clinical settings has not been submitted as part of this evaluation.`,
      },
      {
        name: "Product Brochure",
        category: "Marketing",
        description: "Consumer-facing product description",
        content: `KARDIAMOBILE — PRODUCT BROCHURE

The #1 best-selling personal ECG device in the world.

Record a medical-grade ECG anytime, anywhere. In just 30 seconds, KardiaMobile records your heart rhythm and tells you if it's normal or if atrial fibrillation is detected.

Features:
- Single-lead ECG in 30 seconds
- FDA-cleared for AF detection
- Works with iPhone and Android
- Small enough to fit in your wallet
- Share ECGs with your doctor

How it works:
1. Place your fingers on the sensors
2. Wait 30 seconds
3. See your result instantly

Safe, accurate, and easy to use.

This brochure is intended for consumer audiences. For clinical or enterprise evaluation, please contact AliveCor's enterprise team for access to clinical documentation.`,
      },
      {
        name: "Privacy Policy",
        category: "Privacy",
        description: "Consumer privacy notice",
        content: `ALIVECOR PRIVACY POLICY (Summary for Evaluation)

AliveCor collects and processes personal health information as described in our full Privacy Policy available at alivecor.com/privacy.

Key points:
- Data collected: ECG recordings, health data, device usage data, account information
- Data use: Provide service, improve algorithms, support clinical research (with consent)
- Data sharing: Not sold to third parties; shared with healthcare providers at user direction; shared with research partners (de-identified, with user consent)
- Data retention: ECG data retained for account lifetime + 5 years after account closure
- HIPAA: AliveCor executes BAAs with covered entity customers in enterprise/clinical programs
- GDPR: Compliant for EU users; Data Protection Officer appointed
- User rights: Access, correction, deletion available via app or support request

Note: This is a consumer privacy policy. For enterprise/clinical deployments, additional data processing agreements and BAAs are required. A detailed enterprise data governance document and security documentation are not included in this evaluation submission.`,
      },
      {
        name: "Terms of Service",
        category: "Legal",
        description: "End-user license agreement",
        content: `ALIVECOR TERMS OF SERVICE (Summary)

By using KardiaMobile and the Kardia app, you agree to AliveCor's Terms of Service.

Key terms:
- The Kardia app and ECG analysis are for informational purposes. They do not constitute medical advice and should not be used as a substitute for professional medical consultation.
- AI ECG interpretations (Normal, AFib, Unclassified) are provided as decision support, not as definitive diagnoses.
- AliveCor does not guarantee the accuracy of AI interpretations. All clinical decisions remain the responsibility of the treating clinician.
- Enterprise users: Separate enterprise agreements govern clinical use; consumer terms apply to individual device use only.

Limitation of Liability: AliveCor's liability is limited as described in the full Terms of Service.

Note: AliveCor has not provided any formal governance documentation, AI ethics policy, organizational oversight framework, or enterprise clinical governance documentation as part of this evaluation. The documentation provided is limited to consumer-facing regulatory clearance and marketing materials.`,
      },
    ],
    evidenceByStandard: {
      "S1": "Minimal: FDA cleared but consumer device context. No MDR/CE Mark for clinical use. No risk file provided.",
      "S2": "Not Met: No risk management file. No safety analysis. No post-market surveillance plan.",
      "S3": "Not Met: Marketing summary only. No peer-reviewed validation. No performance metrics provided.",
      "S4": "Not Met: No transparency documentation. No model card. No algorithm disclosure.",
      "S5": "Not Met: No ethics assessment. No bias testing. No fairness documentation.",
      "S6": "Not Met: No technical documentation provided. No architecture details. No data governance.",
      "S7": "Not Met: Consumer device design only. No clinical workflow integration. No human factors study.",
      "S8": "Not Met: No monitoring plan. No ongoing performance tracking. No feedback mechanisms.",
    },
  },
  {
    name: "WinAI CancerVision",
    company: "WinAI247",
    product: "CancerVision Ultrasound Classifier",
    description: "Research-stage breast ultrasound AI classifier using MobileNetV2 transfer learning to detect Normal, Benign, and Malignant tumors. Built on the public BUSI dataset with 81% test accuracy. Deployed as a Streamlit prototype with no regulatory clearance or clinical validation.",
    evidenceLevel: "minimal",
    documentCount: 6,
    vendorDocs: 5,
    governanceDocs: 1,
    expectedBadge: "None",
    expectedScoreRange: "10-25%",
    documents: [
      {
        name: "Algorithm Architecture Document",
        category: "Technical",
        description: "MobileNetV2 transfer learning architecture with Keras hyperparameter tuning",
        content: `WINAI247 — CANCERVISION ULTRASOUND CLASSIFIER
Algorithm Architecture Document
Version: 1.0 | Date: December 2025 | Status: Research Prototype

1. OVERVIEW
CancerVision is a 3-class breast ultrasound image classifier that distinguishes between Normal, Benign, and Malignant findings. The system is a research-stage prototype developed using transfer learning from a publicly available convolutional neural network base model.

This document describes the model architecture, training configuration, and hyperparameter search methodology. This is not an FDA-cleared or CE-marked device. It has not been validated for clinical use.

2. BASE MODEL — MobileNetV2
Foundation: MobileNetV2, pre-trained on ImageNet (1.4 million images, 1,000 classes)
Source: TensorFlow/Keras Applications (tensorflow.keras.applications.MobileNetV2)
Weights: Pre-trained ImageNet weights loaded at initialization
Input shape: (224, 224, 3) — RGB images, normalized to [0,1]
Layer freezing: All MobileNetV2 layers frozen during training. No fine-tuning of base layers performed. Transfer learning relies entirely on pre-trained feature representations.

Rationale for MobileNetV2: Chosen for computational efficiency on consumer hardware (tested on Apple M1 MacBook). Lightweight architecture suitable for prototyping without GPU cluster. Not selected based on medical imaging performance benchmarks.

3. CLASSIFICATION HEAD
Added on top of frozen MobileNetV2 base:
  GlobalAveragePooling2D → reduces spatial feature maps to 1D vector
  Dense(units, activation='relu', kernel_regularizer=L2(l2_reg))
    units: tuned 512–2048 (step 256) via Keras RandomSearch
    l2_reg: tuned 1e-5 to 1e-2 (log scale)
  Dropout(rate)
    rate: tuned 0.1–0.5 (step 0.1)
  Dense(3, activation='softmax', kernel_regularizer=L2(l2_reg_dense))
    l2_reg_dense: tuned 1e-5 to 1e-2 (log scale)
    Output: probability distribution over [Normal, Benign, Malignant]

Class encoding: 0 = Normal, 1 = Benign, 2 = Malignant

4. COMPILATION AND TRAINING
Loss function: Categorical crossentropy
Optimizer: Adam (legacy version for M1/M2 Mac compatibility)
  Learning rate: tuned 1e-5 to 1e-2 (log scale)
Metrics tracked during training: Accuracy, Precision, Recall, AUC
Callbacks:
  EarlyStopping (monitor=val_accuracy, patience=10, restore_best_weights=True)
  ModelCheckpoint (save_best_only=True, monitor=val_accuracy)
  ReduceLROnPlateau (monitor=val_loss)
  Custom MetricsCallback: computes F1, MCC, PR-AUC per epoch

5. HYPERPARAMETER TUNING
Method: Keras RandomSearch (kerastuner library)
Objective: val_accuracy (maximize)
Max trials: 10
Executions per trial: 1
Tuner directory: tuner_directory/cnn_cancer_prediction
Search epochs: 3 (reduced for speed)
Final training epochs: Variable (controlled by EarlyStopping)
Best hyperparameter values: Not formally documented post-search. Best model saved as best_model.h5 and best_model.keras.

6. MODEL ARTIFACTS
best_model.h5 — HDF5 format Keras model (~29MB)
best_model.keras — Native Keras format (~16MB)
training_history.pkl — Python pickle of training history dict
validation_metrics.png — Plot of validation curves
tuner_directory/ — Keras Tuner search results

7. LIMITATIONS AND GAPS
- No formal model specification or design freeze documentation
- No risk analysis of model architecture choices
- No documentation of failed hyperparameter configurations
- No architecture review by clinical domain expert
- No model card produced
- No explainability mechanism (no Grad-CAM, SHAP, attention visualization)
- Transfer learning from natural image domain (ImageNet) to ultrasound — domain gap not formally assessed
- Model not compared against radiologist-level performance baseline
- No IFU (Instructions for Use) or intended-use specification`,
      },
      {
        name: "Training Data Summary",
        category: "Data",
        description: "BUSI public dataset — 1,578 breast ultrasound images, 3 classes, no patient metadata",
        content: `WINAI247 — CANCERVISION ULTRASOUND CLASSIFIER
Training Data Summary
Version: 1.0 | Date: December 2025

1. DATASET IDENTITY
Dataset Name: BUSI — Breast Ultrasound Images Dataset
Source: Al-Dhabyani W, Gomaa M, Khaled H, Fahmy A. "Dataset of breast ultrasound images." Data in Brief. 2020 Feb;28:104863.
Availability: Publicly available (Mendeley Data, CC BY 4.0 license)
Collection site: Baheya Hospital for Early Detection and Treatment of Women's Cancer, Cairo, Egypt
Patient demographics: 600 female patients, ages 25–75, collected in 2018
Repository: https://github.com/WinAI247/CancerClassificationWebApp (Dataset_BUSI_with_GT directory)

2. CLASS DISTRIBUTION (RAW IMAGES)
  Normal:    266 images  (16.9%)
  Benign:    891 images  (56.5%)
  Malignant: 421 images  (26.7%)
  Total:   1,578 images

Note: Each case includes the original ultrasound image plus one or more segmentation mask files (filename contains "_mask"). Mask files are excluded from training — only the base images are used.

3. DATA ACCESS AND GOVERNANCE
- Dataset is publicly available under Creative Commons Attribution 4.0 license
- No formal data sharing agreement (DSA) executed — dataset downloaded directly from public repository
- No IRB approval or ethics committee documentation held by WinAI247 for secondary use
- Patient consent: managed by original dataset collectors (Baheya Hospital) under Egyptian regulatory framework; details not available to WinAI247
- No HIPAA Business Associate Agreement (not applicable — no US patient data collected by WinAI247)
- Re-identification risk: Not formally assessed. Dataset is de-identified per original publication.

4. DEMOGRAPHIC METADATA AVAILABLE
- Sex: Female (all patients)
- Age range: 25–75 (mean not provided in accessible metadata)
- Race/ethnicity: Not documented in accessible dataset metadata
- Geographic origin: Egypt
- Imaging equipment: Not specified per image in accessible metadata
- Institution: Single-site collection (Baheya Hospital)

IMPORTANT LIMITATION: No per-image demographic metadata is accessible. Subgroup performance analysis by age, race, ethnicity, body mass index, or equipment type cannot be performed from the available data.

5. PREPROCESSING PIPELINE
Step 1 — Image loading: OpenCV (cv2.imread) reads images from directory
Step 2 — Mask exclusion: Files containing "_mask" in filename are skipped
Step 3 — Resize: cv2.resize to 150×150 pixels (initial load)
Step 4 — Label encoding: 0=Normal, 1=Benign, 2=Malignant
Step 5 — One-hot encoding: keras.utils.to_categorical (3 classes)
Step 6 — Normalization: Divide by 255.0 → pixel values in [0,1]
Step 7 — Train/test split: 80/20 stratified (random_state=42)
Step 8 — Train/val split: 80/20 from training set (random_state=42)
Step 9 — Random oversampling: Applied to training set only, to equalize class counts
Step 10 — Resize to 224×224: tf.image.resize applied for model input
Step 11 — Data augmentation (training only):
  rotation_range=5, width_shift_range=0.05, height_shift_range=0.05
  shear_range=0.05, zoom_range=0.05, horizontal_flip=True, fill_mode='nearest'
Step 12 — Shuffle: Applied post-augmentation

Post-oversampling/augmentation split (approximate):
  Training: ~70% | Validation: ~15% | Test: ~15%
  (Exact counts depend on random seeds and augmentation expansion)

6. ANNOTATION AND GROUND TRUTH
- Ground truth labels sourced from original BUSI dataset publication
- Annotation performed by original dataset collectors (radiologists at Baheya Hospital)
- Annotation protocol: Not documented in accessible materials
- Inter-annotator agreement: Not available from public dataset documentation
- WinAI247 performed no independent annotation verification
- Segmentation masks provided in BUSI dataset but NOT used in this classifier (classification only)

7. KNOWN DATA LIMITATIONS
- Single-site, single-country dataset — generalizability to other populations uncertain
- No imaging protocol metadata — equipment and acquisition parameters vary
- Class imbalance addressed via random oversampling, which may introduce overfitting on minority classes
- No formal dataset card or data sheet produced per FATML or Google guidelines
- No documentation of dataset version or update tracking`,
      },
      {
        name: "Model Performance Report",
        category: "Clinical",
        description: "Test set results: 80.6% accuracy, Precision 82.3%, Recall 79.1% — single held-out BUSI split",
        content: `WINAI247 — CANCERVISION ULTRASOUND CLASSIFIER
Model Performance Report
Version: 1.0 | Date: December 2025
Evaluation context: Research prototype — NOT a clinical validation study

IMPORTANT DISCLAIMER: This performance report reflects results on a held-out split of the BUSI training dataset only. This does not constitute a prospective clinical validation study, external validation, or regulatory performance submission. These results should not be used to support clinical decision-making.

1. TEST SET COMPOSITION
Source: BUSI public dataset, held-out split (random_state=42)
Test set size: n=129 images
Class distribution in test set:
  Normal:    51 images (39.5%)
  Benign:    40 images (31.0%)
  Malignant: 38 images (29.5%)

2. OVERALL PERFORMANCE METRICS
Metric         | Value
---------------|--------
Accuracy       | 80.6%  (104/129 correct)
Precision      | 82.3%  (macro-weighted)
Recall         | 79.1%  (macro-weighted)
F1-Score       | 80.0%  (macro average)
Loss           | 0.530  (categorical crossentropy)

3. PER-CLASS PERFORMANCE (Classification Report)
Class       | Precision | Recall | F1-Score | Support
------------|-----------|--------|----------|--------
Normal  (0) |   0.83    |  0.84  |   0.83   |   51
Benign  (1) |   0.79    |  0.68  |   0.73   |   40
Malignant(2)|   0.79    |  0.89  |   0.84   |   38
------------|-----------|--------|----------|--------
Macro avg   |   0.80    |  0.80  |   0.80   |  129
Weighted avg|   0.81    |  0.81  |   0.80   |  129

4. CONFUSION MATRIX
                 Predicted Normal | Predicted Benign | Predicted Malignant
Actual Normal  |       43         |        7         |         1
Actual Benign  |        5         |       27         |         8
Actual Malignant|       4         |        0         |        34

KEY OBSERVATIONS:
(a) MALIGNANT → NORMAL MISCLASSIFICATION: 4 malignant cases predicted as Normal.
    This represents a false negative rate of 4/38 = 10.5% for malignancy.
    In a clinical context, these would be missed cancers — a significant patient safety risk.

(b) BENIGN PERFORMANCE (WEAKEST): F1=0.73 is the lowest per-class score.
    8 benign cases predicted as malignant (20% false positive rate for benign→malignant).
    5 benign cases predicted as normal.
    Benign is the most challenging class for this model.

(c) MALIGNANT RECALL = 0.89: 34/38 malignant cases correctly identified.
    However, this must be interpreted alongside the 10.5% miss rate above.

5. ADDITIONAL METRICS (from Keras evaluate)
Loss:      0.529535
Accuracy:  0.806202
Precision: 0.822581
Recall:    0.790698

6. WHAT THIS EVALUATION DOES NOT COVER
- External validation on unseen patient population
- Prospective clinical study in a real radiology workflow
- Comparison to radiologist diagnostic performance
- Subgroup analysis by age, race, ethnicity, equipment type
- Performance across different ultrasound machine manufacturers
- Performance under real-world image quality variation
- Statistical confidence intervals for performance metrics
- Calibration (reliability of predicted probabilities)

7. CLINICAL INTERPRETATION LIMITATIONS
This model was evaluated on a single held-out split from the same dataset used for training (BUSI). Performance on data from different institutions, imaging equipment, or patient demographics is unknown. The model has not been evaluated by clinical experts for appropriateness of its error patterns. The 10.5% malignant miss rate would require further analysis and risk mitigation before any clinical consideration.`,
      },
      {
        name: "Limitations and Known Issues",
        category: "Transparency",
        description: "Documented model limitations, gaps, and patient safety considerations",
        content: `WINAI247 — CANCERVISION ULTRASOUND CLASSIFIER
Limitations and Known Issues Document
Version: 1.0 | Date: December 2025

This document honestly catalogs the known limitations of the CancerVision prototype. It is intended to support transparent evaluation by clinical and regulatory reviewers.

1. REGULATORY STATUS
- NOT FDA-cleared or authorized
- NOT CE-marked under EU MDR
- No regulatory pathway identified or initiated
- No De Novo request or 510(k) submission filed
- No predicate device comparison conducted
- Regulatory classification of intended use not formally determined
- This device may constitute a Software as a Medical Device (SaMD) requiring regulatory clearance before clinical use

2. CLINICAL VALIDATION GAPS
- No prospective clinical validation study
- No external validation cohort (model tested only on BUSI held-out split from same dataset)
- No multi-site validation
- No comparison to radiologist diagnostic performance (no reader study conducted)
- No clinical utility study demonstrating impact on patient outcomes
- No intended-use statement defining the clinical decision context
- Performance on non-BUSI data is entirely unknown

3. PATIENT SAFETY CONCERNS
- 10.5% false negative rate for malignancy (4/38 malignant cases classified as Normal) in test set
- In a clinical context, these would represent missed cancer diagnoses
- No safety risk analysis (FMEA or ISO 14971 risk management) performed
- No formal hazard identification or risk mitigation
- No failsafe mechanism if model is unavailable or produces low-confidence output
- No clinical warning labels or contraindications defined

4. MODEL EXPLAINABILITY
- No explainability or interpretability mechanism implemented
- No Gradient-weighted Class Activation Mapping (Grad-CAM)
- No SHAP (SHapley Additive exPlanations) values
- No attention visualization
- Clinician cannot understand why the model produced a specific prediction
- No confidence score or uncertainty estimate displayed to end user — only the label

5. BIAS AND FAIRNESS LIMITATIONS
- No demographic subgroup analysis performed (no metadata available in BUSI dataset)
- Single-site, single-country dataset (Cairo, Egypt) — generalizability uncertain
- All patients female — performance on male patients (rare breast cancer cases) unknown
- No race/ethnicity breakdown possible
- No analysis of performance variation across imaging equipment types
- No formal bias or fairness assessment per NIST AI RMF or WHO AI ethics guidelines

6. DATA LIMITATIONS
- Training data from single institution (Baheya Hospital)
- No formal data governance or data sharing agreement
- No IRB approval held by WinAI247
- No independent verification of ground truth labels
- No annotation protocol documentation
- No inter-annotator agreement metrics

7. DEPLOYMENT AND INFRASTRUCTURE LIMITATIONS
- Streamlit web app only — local deployment, no cloud infrastructure
- No DICOM support — cannot accept standard medical imaging formats
- No PACS or EHR integration
- No audit logging of predictions
- No access controls or authentication
- No HIPAA compliance features
- No version control of deployed model
- No monitoring of production performance
- No mechanism to detect data drift or model degradation
- No alerting or escalation if system fails

8. DOCUMENTATION GAPS
- No ISO 14971 Risk Management File
- No IEC 62304 Software Lifecycle documentation
- No Design History File (DHF)
- No Instructions for Use (IFU)
- No model card per Google/Hugging Face conventions
- No Software Bill of Materials (SBOM)
- No post-market surveillance plan
- No human factors or usability study`,
      },
      {
        name: "Deployment Description (Streamlit App)",
        category: "Technical",
        description: "app.py — local Streamlit web interface for image upload and classification",
        content: `WINAI247 — CANCERVISION ULTRASOUND CLASSIFIER
Deployment Description — Streamlit Application
Source: app.py (repository root)
Version: 1.0 | Date: December 2025

1. APPLICATION OVERVIEW
The CancerVision classifier is deployed as a Streamlit web application. It accepts a single ultrasound image upload from the user and returns a 3-class prediction: Normal, Benign, or Malignant. The application is designed for local execution on a developer machine and has not been hardened for production use.

2. TECHNICAL STACK
Runtime: Python (tested on Python 3.x with Apple Silicon compatibility)
Framework: Streamlit (version not pinned)
Model loading: TensorFlow/Keras (tf.keras.models.load_model)
Image processing: PIL (Pillow), NumPy
UI: Streamlit native components

3. INFERENCE PIPELINE (as implemented in app.py)
Step 1 — User uploads image via st.file_uploader()
  Accepted formats: jpg, jpeg, png, bmp, tiff
Step 2 — Image opened with PIL.Image.open()
Step 3 — Image resized to (224, 224) via PIL resize
Step 4 — Converted to NumPy array
Step 5 — Batch dimension added: np.expand_dims(image, axis=0)
  Note: No explicit normalization (/255) applied in app.py inference path
  (This may be a discrepancy with training preprocessing where normalization was applied)
Step 6 — model.predict(image) called
Step 7 — np.argmax(prediction) selects predicted class
Step 8 — Label mapped: {0: 'Normal', 1: 'Benign', 2: 'Malignant'}
Step 9 — Result displayed as HTML: "This tumour is: [Label]" in red text

4. MODEL LOADING
Model loaded at startup inside st.spinner('Loading model...')
Model file: best_model.h5 (absolute path — hardcoded to developer machine)
Path: '/Users/aadityasurya/Desktop/Cancer Research/Full Code/best_model.h5'
NOTE: The hardcoded absolute path means the application will fail on any machine other than the original developer's computer without manual path correction. No configuration management or environment variable for model path.

5. USER INTERFACE
Title: "Tumor Classification App"
Subtitle: "Upload an image and classify whether a tumor is normal, benign, or malignant"
Input: File uploader widget (single file)
Output: Uploaded image displayed + predicted class label in red HTML text
Loading states: st.spinner shown during model load and inference

6. SIGNIFICANT GAPS AND RISKS
(a) Preprocessing mismatch: Training pipeline applied /255 normalization; app.py inference does NOT explicitly normalize. If Keras model expects normalized input [0,1] but receives [0,255], predictions will be unreliable.
(b) No confidence score: Only the predicted label is shown. No probability scores or uncertainty estimates are surfaced to the user.
(c) No clinical disclaimer: No warning that this is a research prototype not approved for clinical use.
(d) Hardcoded file path: App fails on any machine other than developer's original laptop.
(e) No input validation: No check that uploaded image is actually an ultrasound image, appropriate resolution, or within expected intensity range.
(f) No audit logging: No record kept of what images were submitted or what predictions were made.
(g) No access control: Any person with the URL can submit images and receive predictions.
(h) No DICOM support: Cannot accept standard medical imaging format used by PACS systems.
(i) No failsafe: If model fails to load or inference throws an exception, there is no graceful error handling beyond Streamlit's default error display.
(j) No version pinning: requirements.txt not provided. Dependency versions not fixed.

7. INFRASTRUCTURE
Deployment model: Local machine (laptop) only
Cloud infrastructure: None
Scalability: Single-user, synchronous processing
Monitoring: None
Uptime SLA: None defined
Disaster recovery: Not applicable`,
      },
      {
        name: "Data Preprocessing and Augmentation Pipeline",
        category: "Data",
        description: "Detailed technical record of all preprocessing steps from the Jupyter notebook",
        content: `WINAI247 — CANCERVISION ULTRASOUND CLASSIFIER
Data Preprocessing and Augmentation Pipeline
Source: Cancer Research.ipynb (Full Code directory)
Version: 1.0 | Date: December 2025

1. OVERVIEW
This document describes the complete data preprocessing and augmentation pipeline applied to the BUSI dataset prior to model training. All steps are implemented in the Jupyter notebook (Cancer Research.ipynb). This document is a technical record extracted from the notebook; it has not been independently validated or reviewed.

2. RAW DATA LOADING
Library: OpenCV (cv2)
Process:
  For each class directory (normal, benign, malignant):
    - List all files in directory
    - Skip files containing "_mask" in filename (segmentation masks excluded)
    - cv2.imread() loads image in BGR format
    - cv2.resize() resizes to (150, 150)
    - Failed reads (None returns) are silently skipped
  Arrays: numpy arrays dtype='object' created per class
  Labels: numpy integer arrays (0=Normal, 1=Benign, 2=Malignant)
  Concatenated into single images array and labels array

Raw image counts (from notebook Cell 63 pie chart):
  Normal: 266 | Benign: 891 | Malignant: 421 | Total: 1,578

3. LABEL ENCODING
One-hot encoding: keras.utils.to_categorical(labels, num_classes=3)
Verification output (from notebook):
  Normal:    [1. 0. 0.]
  Benign:    [0. 1. 0.]
  Malignant: [0. 0. 1.]

4. NORMALIZATION
Operation: images_normalized = images.astype('float32') / 255.0
Result: Pixel values in range [0.0, 1.0]
Verification: Min=0.0, Max=1.0

5. INITIAL TRAIN/TEST SPLIT
Library: sklearn.model_selection.train_test_split
Parameters: test_size=0.2, random_state=42
Result: ~80% train, ~20% test
Secondary split (train → train + val): test_size=0.2, random_state=42
Result: ~64% train, ~16% val, ~20% test (of original data)

6. CLASS IMBALANCE HANDLING — RANDOM OVERSAMPLING
Method: Custom oversample_data() function (no external library)
Algorithm:
  1. Find majority class count (max_count)
  2. For each minority class: randomly sample with replacement until reaching max_count
  3. Concatenate oversampled examples to original training set
Post-oversampling class distribution: Equal counts across all 3 classes
Note: Oversampling applied to training split only (before augmentation)
Risk: Random oversampling of minority class may cause overfitting on duplicated samples

7. DATA AUGMENTATION
Library: tensorflow.keras.preprocessing.image.ImageDataGenerator
Parameters (conservative, chosen to preserve ultrasound image structure):
  rotation_range=5         (±5 degree rotation)
  width_shift_range=0.05   (±5% horizontal shift)
  height_shift_range=0.05  (±5% vertical shift)
  shear_range=0.05         (±5% shear transformation)
  zoom_range=0.05          (±5% zoom)
  horizontal_flip=True     (random left-right flip)
  fill_mode='nearest'      (border fill)
  data_format='channels_last'

Augmentation process:
  For each image in oversampled training set:
    - Resize to 224×224 (tf.image.resize)
    - Apply one random augmentation per original image (1:1 expansion)
  Result: augmented_images and augmented_labels arrays (float32)

8. POST-AUGMENTATION SPLIT
Second train/val/test split applied to augmented data:
  X_train, X_temp: test_size=0.3, random_state=42
  X_val, X_test: test_size=0.5, random_state=42
Result: ~70% train, ~15% val, ~15% test

NOTE: A train/test split was applied BEFORE augmentation (Step 5) and AGAIN AFTER augmentation (Step 8). It is possible the held-out test set used in the performance report (n=129) is derived from augmented data, which would mean the test set contains augmented versions of training images — a methodological issue that could inflate reported performance metrics.

9. BATCHING
Batch size: 32
num_batches = ceil(len(augmented_images) / batch_size)
Image and label batches created as Python lists of numpy arrays

10. SHUFFLE
Applied post-augmentation: np.random.shuffle(shuffle_indexes) on training indices only

11. KNOWN PREPROCESSING ISSUES
- Double train/test split (Steps 5 and 8): Methodological concern — test set may contain augmented derivatives of training images
- Normalization applied in notebook but NOT in app.py inference (preprocessing mismatch)
- No fixed random seed for augmentation (ImageDataGenerator random state not fixed)
- No formal data validation step (no check for corrupted images, unexpected resolutions, or class label errors)
- No dataset card or data sheet produced
- Pipeline implemented as Jupyter notebook — not packaged as reproducible script with pinned dependencies`,
      },
    ],
    evidenceByStandard: {
      "S1": "Not Met: No FDA clearance, CE marking, or identified regulatory pathway. No ISO 14971 risk management file. No IEC 62304 software lifecycle documentation. Research prototype only.",
      "S2": "Not Met: No DICOM, FHIR, or HL7 support. Local Streamlit file upload only. No EHR or PACS integration. No interoperability specification.",
      "S3": "Minimal: Architecture documented in Jupyter notebook. No formal model card, IFU, or transparency report. No explainability features (no Grad-CAM, SHAP). Limitations partially described.",
      "S4": "Minimal: Performance metrics on single held-out split (n=129). No prospective or external validation. No radiologist baseline comparison. 4 malignant-to-normal misclassifications represent a patient safety concern.",
      "S5": "Not Met: No bias or fairness assessment. No demographic metadata in training data. No equity analysis. No AI ethics statement or governance policy.",
      "S6": "Minimal: Architecture and preprocessing documented in notebook. No SBOM. No formal data governance or data sharing agreement. No drift monitoring.",
      "S7": "Not Met: No human factors study. No clinical workflow integration. No override mechanism. No clinician training materials. No safety affordances in UI.",
      "S8": "Not Met: No post-market surveillance plan. No monitoring or drift detection. No CAPA procedure. No organizational AI governance policy. No change management process.",
    },
  },
];
