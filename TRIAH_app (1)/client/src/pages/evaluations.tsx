import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import {
  ClipboardCheck, ArrowLeft, ChevronRight, ChevronLeft,
  Shield, Save, CheckCircle2, AlertTriangle, Loader2,
  Inbox, FileText, Play, Pencil, Square, Bell, BookOpen,
  ChevronDown, Info, ExternalLink, X, Ban, Mail, Copy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Vendor, EvaluationSession } from "@shared/schema";
import type { RefinedStandard, RefinedElement, RefinedFactor } from "../../../shared/refined-standards-data";
import { getReferencesForFactor, isTRIAHIP, type TRIAHReference } from "@shared/reference-library";

const STANDARD_DOC_CATEGORIES: Record<string, string[]> = {
  S1: ["Regulatory", "Safety", "Quality"],
  S2: ["Safety", "Regulatory", "Monitoring"],
  S3: ["Clinical", "Data"],
  S4: ["Transparency", "Technical"],
  S5: ["Ethics", "Data", "Privacy"],
  S6: ["Technical", "Data", "Security"],
  S7: ["Usability", "Clinical"],
  S8: ["Monitoring", "Quality"],
};

interface RequiredDoc {
  name: string;
  description: string;
  category: string;
  acceptableTypes: string[];
  matchKeywords: string[];
  element?: string;
}

const REQUIRED_DOCS_BY_STANDARD: Record<string, RequiredDoc[]> = {
  S1: [
    {
      name: "Regulatory Clearance",
      description: "Evidence of regulatory approval or clearance for the AI product",
      category: "Regulatory",
      acceptableTypes: ["FDA 510(k) Clearance Letter", "FDA PMA Approval", "CE Mark Certificate", "ISO 13485 Certificate", "UKCA Marking Documentation"],
      matchKeywords: ["clearance", "510k", "pma", "ce mark", "ukca", "approval", "regulatory"],
    },
    {
      name: "Risk Management File",
      description: "Documented risk analysis and controls per ISO 14971",
      category: "Safety",
      acceptableTypes: ["ISO 14971 Risk Management File", "Hazard Analysis Report", "Risk-Benefit Analysis", "FMEA (Failure Mode and Effects Analysis)"],
      matchKeywords: ["risk management", "14971", "hazard", "fmea", "risk-benefit", "risk benefit"],
    },
    {
      name: "Software Lifecycle Documentation",
      description: "Software development lifecycle process records per IEC 62304",
      category: "Quality",
      acceptableTypes: ["IEC 62304 Software Lifecycle Document", "Software Development Plan", "Quality Management System (QMS) Record", "Software Validation Report"],
      matchKeywords: ["62304", "software lifecycle", "development plan", "qms", "software validation"],
    },
    {
      name: "Post-Market Surveillance Plan",
      description: "Plan for ongoing monitoring of the product after market release",
      category: "Monitoring",
      acceptableTypes: ["Post-Market Surveillance (PMS) Plan", "Post-Market Clinical Follow-up (PMCF) Plan", "Real-World Performance Monitoring Plan"],
      matchKeywords: ["post-market", "post market", "surveillance", "pmcf", "monitoring plan"],
    },
    {
      name: "Privacy & Security Policy",
      description: "Documentation of data privacy and cybersecurity controls",
      category: "Security",
      acceptableTypes: ["Privacy Policy", "Information Security Policy", "HIPAA Compliance Documentation", "Cybersecurity Risk Assessment"],
      matchKeywords: ["privacy", "security", "hipaa", "cybersecurity", "data protection"],
    },
    {
      name: "Incident Response Procedure",
      description: "Documented procedures for responding to safety incidents or adverse events",
      category: "Safety",
      acceptableTypes: ["Incident Response Plan", "Adverse Event Reporting Procedure", "Vigilance Procedure", "CAPA Procedure"],
      matchKeywords: ["incident", "adverse event", "vigilance", "capa", "corrective action"],
    },
  ],
  S2: [
    {
      name: "Interoperability Specification",
      description: "Technical specification for how the system integrates with clinical infrastructure",
      category: "Technical",
      acceptableTypes: ["DICOM Conformance Statement", "HL7 FHIR Implementation Guide", "API Integration Specification", "Integration Conformance Statement"],
      matchKeywords: ["dicom", "fhir", "hl7", "interoperability", "integration spec", "conformance"],
    },
    {
      name: "Software Dependency List",
      description: "Inventory of third-party software components and open-source libraries",
      category: "Technical",
      acceptableTypes: ["Software Bill of Materials (SBOM)", "SOUP List (Software of Unknown Provenance)", "Third-Party Component Inventory", "Open Source License Report"],
      matchKeywords: ["sbom", "soup", "dependency", "third-party", "open source", "bill of materials"],
    },
    {
      name: "Risk-Benefit Analysis",
      description: "Documented assessment of clinical risks vs benefits of integration",
      category: "Safety",
      acceptableTypes: ["Risk-Benefit Analysis Report", "Clinical Risk Assessment", "Integration Risk Analysis", "Safety Case Document"],
      matchKeywords: ["risk-benefit", "risk benefit", "clinical risk", "safety case"],
    },
    {
      name: "Integration Conformance Statement",
      description: "Formal declaration of integration standards compliance",
      category: "Technical",
      acceptableTypes: ["Integration Conformance Statement", "Interoperability Certification", "IHE Connectathon Result", "Integration Testing Report"],
      matchKeywords: ["conformance", "ihe", "connectathon", "integration test"],
    },
    {
      name: "Usability Testing for Integration",
      description: "Evidence that integration workflows have been usability-tested",
      category: "Usability",
      acceptableTypes: ["Usability Testing Report", "Human Factors Study for Integration", "Workflow Validation Report", "User Acceptance Testing (UAT) Report"],
      matchKeywords: ["usability", "human factors", "workflow validation", "user acceptance", "uat"],
    },
  ],
  S3: [
    {
      name: "Model Card",
      description: "Standardized transparency document summarizing model purpose, performance, and limitations",
      category: "Transparency",
      acceptableTypes: ["Model Card", "Algorithm Transparency Report", "AI Fact Sheet", "System Card"],
      matchKeywords: ["model card", "transparency report", "fact sheet", "system card"],
    },
    {
      name: "Algorithm Architecture Document",
      description: "Technical description of the AI/ML model design and architecture",
      category: "Technical",
      acceptableTypes: ["Algorithm Architecture Document", "Technical Design Specification", "AI Model Description", "Machine Learning Architecture Report"],
      matchKeywords: ["architecture", "algorithm", "technical design", "model description", "machine learning"],
    },
    {
      name: "Training Data Summary",
      description: "Documentation of training dataset composition and provenance",
      category: "Data",
      acceptableTypes: ["Training Data Summary", "Datasheet for Datasets", "Data Provenance Report", "Dataset Documentation"],
      matchKeywords: ["training data", "datasheet", "data provenance", "dataset", "data summary"],
    },
    {
      name: "Explainability Method Description",
      description: "Documentation of how the AI output is explained to clinicians",
      category: "Transparency",
      acceptableTypes: ["Explainability Method Description", "XAI (Explainable AI) Report", "Interpretability Documentation", "Feature Attribution Report"],
      matchKeywords: ["explainability", "xai", "interpretability", "feature attribution", "explain"],
    },
  ],
  S4: [
    {
      name: "Prospective Clinical Validation Study",
      description: "Prospective study demonstrating clinical performance in target population",
      category: "Clinical",
      acceptableTypes: ["Prospective Clinical Validation Study", "Prospective Performance Study", "Clinical Trial Report", "Pivotal Study Report"],
      matchKeywords: ["prospective", "clinical validation", "clinical trial", "pivotal study"],
    },
    {
      name: "Retrospective Validation Study",
      description: "Retrospective analysis of clinical performance using historical data",
      category: "Clinical",
      acceptableTypes: ["Retrospective Validation Study", "Retrospective Performance Study", "Real-World Evidence Report", "Post-Market Clinical Study"],
      matchKeywords: ["retrospective", "real-world evidence", "historical", "post-market clinical"],
    },
    {
      name: "Subgroup & Demographic Performance Analysis",
      description: "Performance breakdown across patient subgroups and demographic categories",
      category: "Clinical",
      acceptableTypes: ["Subgroup Performance Analysis", "Demographic Performance Report", "Equity & Subgroup Analysis", "Disaggregated Performance Data"],
      matchKeywords: ["subgroup", "demographic", "disaggregated", "equity analysis", "performance breakdown"],
    },
    {
      name: "Clinical Workflow Evidence",
      description: "Evidence that the product has been validated within actual clinical workflows",
      category: "Usability",
      acceptableTypes: ["Clinical Workflow Validation Report", "Workflow Integration Study", "Clinician Feedback Study", "Site Deployment Evidence"],
      matchKeywords: ["workflow", "clinical workflow", "workflow integration", "site deployment", "clinician feedback"],
    },
  ],
  S5: [
    {
      name: "Bias Management Governance Documentation",
      description: "Documentation outlining the bias management governance structure, process, and oversight",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "AI Governance Charter or Directive",
        "Product Guide",
        "Policy & Procedure, Topic-Specific on Bias Management",
        "Business Requirements Document (BRD)",
      ],
      matchKeywords: ["governance", "charter", "bias management", "bias policy", "ai directive", "brd", "business requirements"],
    },
    {
      name: "Bias Audit Records",
      description: "Documentation supporting the bias management audit process performed by a multidisciplinary team",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "Audit logs/reports",
        "Meeting minutes from Governing Committee",
        "Policy & Procedure on Bias Management",
        "Bias register or report",
        "External or Internal Audit",
        "Gap Analysis reports",
        "MDT auditor list with AI developer list",
      ],
      matchKeywords: ["audit", "audit log", "bias audit", "governing committee", "bias register", "gap analysis", "auditor list"],
    },
    {
      name: "Bias Measurement & Baseline Documentation",
      description: "Documentation defining the AI Model's goals, scope, and intended impact for bias measurement",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "AI Governance Charter or Directive",
        "Product Guide",
        "Research Paper",
        "Business Requirements Document (BRD)",
        "Policy & Procedure, Topic-Specific (e.g., HIPAA, Data Security)",
      ],
      matchKeywords: ["baseline", "bias measurement", "intended impact", "research paper", "goals and scope"],
    },
    {
      name: "Bias Change Management Plan",
      description: "Documentation supporting timely mitigation of identified bias issues",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "Predetermined Change Control Plan (PCCP)",
        "Change Control or Management Plan",
        "Performance or Quality Improvement Plan (P/QIP)",
        "Corrective Action Plan (CAP)",
        "Topic-Specific Policy & Procedure on Change Control or Process Improvement",
      ],
      matchKeywords: ["change control", "change management", "pccp", "corrective action", "quality improvement", "cap", "process improvement"],
    },
    {
      name: "Bias Lifecycle Evidence",
      description: "Evidence that bias monitoring was performed across all AI lifecycle phases (Pre-Training through Post-Deployment)",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "Population Assessment findings or results",
        "Reports, logs, and list of alert triggers",
        "Stakeholder feedback documentation (user survey results, Product Roadmap)",
        "Meeting minutes or Project Plan updates for the evaluation period",
      ],
      matchKeywords: ["population assessment", "lifecycle", "alert triggers", "stakeholder feedback", "user survey", "product roadmap"],
    },
    {
      name: "Ongoing Bias Monitoring Plan",
      description: "Formal plan for continuous bias surveillance and revalidation",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "Bias Surveillance or Revalidation Plan",
        "Policy & Procedure on Bias Monitoring",
        "Bias Management Monitoring Plan",
        "Post-Market Surveillance Plan",
        "MLOps Monitoring Spec",
      ],
      matchKeywords: ["bias monitoring", "bias surveillance", "revalidation", "monitoring plan", "mlops", "post-market"],
    },
    {
      name: "Bias Performance Dashboards & Monitoring Reports",
      description: "Dashboards or reports demonstrating ongoing bias monitoring performance",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "Bias Management Performance Dashboards",
        "Bias Monitoring Reports",
      ],
      matchKeywords: ["bias dashboard", "monitoring report", "bias performance", "performance dashboard"],
    },
    {
      name: "Bias Alert Rules & Incident Workflow",
      description: "Documented alert thresholds, incident response workflow, and operational runbook for bias events",
      category: "Ethics",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "Bias Alert Rules",
        "Incident Workflow",
        "Runbook",
        "Revalidation Plan",
        "Model Review Minutes",
        "QBR Minutes",
      ],
      matchKeywords: ["alert rules", "incident workflow", "runbook", "qbr", "model review"],
    },
    {
      name: "Patient Consent Lifecycle Documentation",
      description: "Documentation covering patient consent management, surveillance, and continuous evaluation throughout the lifecycle",
      category: "Privacy",
      element: "Element 1 — Bias Management",
      acceptableTypes: [
        "Patient Consent Performance Improvement Plan or SOP",
        "Patient Consent Surveillance or Reevaluation Plan",
        "Patient Consent Management Plan",
        "Post-Market Surveillance Plan",
        "Consent Performance Dashboards",
        "Patient Consent Alert Rules or Runbook",
        "Revalidation Plan or QBR Minutes",
      ],
      matchKeywords: ["patient consent", "consent management", "consent surveillance", "consent plan", "consent dashboard"],
    },
    {
      name: "Target Population Definition Document",
      description: "Documentation defining the AI Model's intended use, users, target populations (with inclusion/exclusion criteria), uptake profile, and population characteristics",
      category: "Data",
      element: "Element 2 — Target Populations",
      acceptableTypes: [
        "Program Description",
        "Service Level Agreement",
        "Business Requirement Document (BRD)",
        "Data dictionary",
        "Population Assessment results",
        "Logs/reports of uptake",
        "Data Collection Protocols",
        "Research Study",
        "Reference citations",
      ],
      matchKeywords: ["target population", "program description", "service level", "data dictionary", "inclusion", "exclusion", "uptake", "population characteristics"],
    },
    {
      name: "Impact Transparency Documentation",
      description: "Documentation showing how patients/users/community are informed — must cover engagement disclosures, bias/impact disclosures, feedback process, complaint process, and opt-out process",
      category: "Ethics",
      element: "Element 2 — Target Populations",
      acceptableTypes: [
        "Impact Transparency Policy",
        "Engagement Disclosure Documentation",
        "Bias Impact Disclosure",
        "Feedback Process Documentation",
        "Complaint Process Documentation",
        "Opt-out Process Documentation",
      ],
      matchKeywords: ["impact transparency", "engagement disclosure", "bias disclosure", "feedback process", "complaint process", "opt-out"],
    },
    {
      name: "Patient Consent Documentation",
      description: "Evidence that patient consents were obtained, monitored, and continuously evaluated",
      category: "Privacy",
      element: "Element 2 — Target Populations",
      acceptableTypes: [
        "Policy & Procedure specific to patient consents",
        "Consent governance meeting minutes",
        "Improvement plans for consent management",
        "List of completed consents",
        "Pre-Deployment Gap analysis of anticipated vs actual consents",
        "Consent logs (pre, during, post deployment)",
        "Quality Improvement Plan (QIP)",
      ],
      matchKeywords: ["patient consent", "consent list", "consent log", "consent governance", "qip", "consent gap analysis"],
    },
    {
      name: "Healthcare Inequalities Governance Documentation",
      description: "Documentation of the ethics/bias review board, fairness metrics definitions, and monitoring protocols for Healthcare Inequalities",
      category: "Ethics",
      element: "Element 3 — Healthcare Inequalities & Access-to-Care",
      acceptableTypes: [
        "AI Governance Charter or Directive",
        "Product Guide",
        "Policy & Procedure on Healthcare Inequalities and Access-to-Care Management",
        "Business Requirements Document (BRD)",
      ],
      matchKeywords: ["healthcare inequalities", "health inequality", "inequalities governance", "access-to-care", "fairness metrics", "equity governance"],
    },
    {
      name: "Healthcare Inequalities Audit Records",
      description: "Documentation supporting the Healthcare Inequalities audit process, performed by a multidisciplinary team",
      category: "Ethics",
      element: "Element 3 — Healthcare Inequalities & Access-to-Care",
      acceptableTypes: [
        "Audit logs/reports",
        "Meeting minutes from Governing Committee",
        "Policy & Procedure on Healthcare Inequalities",
        "Healthcare Inequalities register or report",
        "External or Internal Audit",
        "Gap Analysis",
        "MDT auditor list with AI developer list",
      ],
      matchKeywords: ["inequalities audit", "healthcare audit", "inequalities register", "equity audit", "equity register", "access-to-care audit"],
    },
    {
      name: "Healthcare Inequalities Baseline & Measurement",
      description: "Documentation defining the AI Model's goals and scope of intended impact on healthcare equity",
      category: "Ethics",
      element: "Element 3 — Healthcare Inequalities & Access-to-Care",
      acceptableTypes: [
        "AI Governance Charter or Directive",
        "Product Guide",
        "Research Paper",
        "Business Requirements Document (BRD)",
        "Topic-Specific Policy & Procedure (e.g., HIPAA, Data Security)",
      ],
      matchKeywords: ["inequalities baseline", "equity baseline", "inequalities measurement", "equity impact", "access baseline"],
    },
    {
      name: "Healthcare Inequalities Change Management Plan",
      description: "Documentation supporting timely mitigation of identified Healthcare Inequalities issues and evidence of improvements",
      category: "Ethics",
      element: "Element 3 — Healthcare Inequalities & Access-to-Care",
      acceptableTypes: [
        "Predetermined Change Control Plan (PCCP)",
        "Change Control or Management Plan",
        "Performance or Quality Improvement Plan",
        "Corrective Action Plan (CAP)",
        "Topic-Specific Policy & Procedure",
        "Meeting minutes",
        "Project Plan updates",
      ],
      matchKeywords: ["inequalities change", "equity change", "inequalities improvement", "equity improvement", "access change"],
    },
    {
      name: "Population Assessment Governance & Process Documentation",
      description: "Documentation of the Population Assessment governance structure and the defined assessment process",
      category: "Data",
      element: "Element 4 — Population Considerations",
      acceptableTypes: [
        "AI Model Product Charter or Directive",
        "Product Guide",
        "Policy & Procedure on Population Assessment",
        "Business Requirements Document (BRD)",
        "Population Assessment results or reports",
        "User or client surveys",
      ],
      matchKeywords: ["population assessment", "population governance", "assessment governance", "assessment process"],
    },
    {
      name: "Population Assessment Measurement Standards",
      description: "Documentation of measurement requirements, tool selection standards, and subpopulation bias compliance",
      category: "Data",
      element: "Element 4 — Population Considerations",
      acceptableTypes: [
        "Policy & Procedure specific to Population Assessment tool/standard/measure selection",
        "AI Model Charter",
        "Performance Assessment BRD",
        "Subpopulation bias identification Policy & Procedure",
        "Reference citations supporting evidence base",
        "Target population size calculations",
        "Subpopulation size calculations (infant, child, adolescent, disabled, mentally ill, cultural, linguistic)",
      ],
      matchKeywords: ["population measurement", "subpopulation", "assessment measurement", "population standards", "subgroup", "infant", "adolescent", "disabilities", "linguistic"],
    },
    {
      name: "Subpopulation Assessment Evidence",
      description: "Evidence that bias was assessed for subpopulations pre-deployment, during deployment, and post-deployment",
      category: "Data",
      element: "Element 4 — Population Considerations",
      acceptableTypes: [
        "Pre-deployment training data demographics documentation",
        "Definition of AI Model target population",
        "Data Mapping documentation",
        "During-deployment quarterly audit logs",
        "Gap Analysis including prevalence and underrepresented population assessment",
        "Post-deployment Gap Analysis",
        "Quarterly audit logs",
        "Evidence of subpopulation bias evaluation against historical data",
      ],
      matchKeywords: ["subpopulation assessment", "deployment assessment", "quarterly audit", "prevalence", "underrepresented", "data mapping"],
    },
    {
      name: "Population Assessment Lifecycle Evidence",
      description: "Evidence that Population Assessment was performed across all AI lifecycle phases through Post-Market",
      category: "Data",
      element: "Element 4 — Population Considerations",
      acceptableTypes: [
        "Periodic Population Assessment results or reports (pre, during, and after training; before, during, and after deployment)",
        "List of alert triggers in bias monitoring",
        "Stakeholder feedback documentation",
        "Post-Market Population Assessment Surveillance Plan or PCCP",
        "Population Assessment Surveillance or Reevaluation Plan",
        "SOP for Population Assessment performance improvement",
      ],
      matchKeywords: ["population lifecycle", "lifecycle assessment", "post-market population", "periodic population", "population revalidation"],
    },
    {
      name: "Ongoing Population Assessment for Bias Monitoring",
      description: "Ongoing monitoring infrastructure for population assessment-based bias management",
      category: "Data",
      element: "Element 4 — Population Considerations",
      acceptableTypes: [
        "Bias Surveillance or Revalidation Plan",
        "Bias Management Monitoring Plan",
        "Post-Market Surveillance Plan",
        "MLOps Monitoring Spec",
        "Bias Management Performance Dashboards",
        "Monitoring Reports",
        "Bias Alert Rules",
        "Incident Workflow",
        "Runbook",
        "QBR Minutes",
      ],
      matchKeywords: ["population bias monitoring", "ongoing population", "population surveillance", "population monitoring"],
    },
    {
      name: "Health Inequality, Discrimination & Care Access Management Policies",
      description: "Documentation on how the AI Model identifies and manages health inequalities, unlawful discrimination, access-to-care issues, and protected characteristics",
      category: "Ethics",
      element: "Element 5 — AI Model Addresses Health Inequality",
      acceptableTypes: [
        "Policy & Procedures on Health Inequality Management",
        "Policy & Procedures on Unlawful Discrimination Management",
        "Policy & Procedures on Care Access Management",
        "Policy & Procedures on Protected Characteristics Management",
        "Reference citations",
        "Audit logs",
        "Gap assessments for expected improvements to AI Model outcomes",
      ],
      matchKeywords: ["health inequality", "unlawful discrimination", "protected characteristics", "care access", "hard-to-reach", "health inequity"],
    },
    {
      name: "Health Inequality Ongoing Monitoring",
      description: "Ongoing monitoring plan and performance tracking for health inequality management",
      category: "Ethics",
      element: "Element 5 — AI Model Addresses Health Inequality",
      acceptableTypes: [
        "Health Inequality Surveillance or Revalidation Plan",
        "Policy & Procedure on Health Inequality Monitoring",
        "Health Inequality Management Monitoring Plan",
        "Post-Market Surveillance Plan",
        "MLOps Monitoring Spec",
        "Health Inequality Performance Dashboards",
        "Monitoring Reports",
        "Alert Rules",
        "Incident Workflow",
        "Runbook",
        "QBR Minutes",
      ],
      matchKeywords: ["health inequality monitoring", "inequality surveillance", "health inequality dashboard", "inequality runbook"],
    },
  ],
  S6: [
    {
      name: "Algorithm Architecture Document",
      description: "Detailed technical description of the ML model architecture and design choices",
      category: "Technical",
      acceptableTypes: ["Algorithm Architecture Document", "Model Architecture Specification", "Technical Design Document", "AI Model Description"],
      matchKeywords: ["architecture", "algorithm", "technical design", "model architecture"],
    },
    {
      name: "Software Bill of Materials (SBOM)",
      description: "Complete inventory of all software components, libraries, and dependencies",
      category: "Technical",
      acceptableTypes: ["Software Bill of Materials (SBOM)", "SOUP List", "Dependency Manifest", "Component Inventory"],
      matchKeywords: ["sbom", "bill of materials", "soup", "dependency", "component inventory"],
    },
    {
      name: "Training Data Governance Document",
      description: "Documentation of data governance policies, access controls, and data provenance",
      category: "Data",
      acceptableTypes: ["Training Data Governance Policy", "Data Management Plan", "Data Governance Framework", "Data Provenance & Lineage Document"],
      matchKeywords: ["data governance", "data management", "data provenance", "lineage", "data policy"],
    },
    {
      name: "Drift Monitoring & Retraining Plan",
      description: "Plan for detecting model performance drift and triggering retraining",
      category: "Monitoring",
      acceptableTypes: ["Drift Monitoring Plan", "Model Retraining Policy", "Performance Monitoring Protocol", "Continuous Learning Framework"],
      matchKeywords: ["drift", "retraining", "performance monitoring", "model monitoring", "continuous learning"],
    },
  ],
  S7: [
    {
      name: "Human Factors Engineering Report",
      description: "Formal HFE/usability engineering report per FDA guidance or IEC 62366",
      category: "Usability",
      acceptableTypes: ["Human Factors Engineering (HFE) Report", "Usability Engineering File (IEC 62366)", "Formative & Summative Usability Study", "Human Factors Validation Report"],
      matchKeywords: ["human factors", "hfe", "usability engineering", "62366", "formative", "summative"],
    },
    {
      name: "Clinical Decision Support Logic",
      description: "Documentation of how the AI output supports (not replaces) clinical decision-making",
      category: "Clinical",
      acceptableTypes: ["Clinical Decision Support (CDS) Logic Document", "AI Output Specification", "Decision Support Design Rationale", "Intended Use Statement (CDS)"],
      matchKeywords: ["clinical decision support", "cds", "decision support", "ai output", "intended use"],
    },
    {
      name: "Override & Feedback Mechanism",
      description: "Documentation of how clinicians can override AI recommendations and provide feedback",
      category: "Clinical",
      acceptableTypes: ["Override Mechanism Specification", "Clinician Feedback Loop Description", "AI Override Policy", "User Control Documentation"],
      matchKeywords: ["override", "feedback", "clinician control", "user control", "reject", "dismiss"],
    },
    {
      name: "Clinician Training Materials",
      description: "Training materials and documentation for clinical end-users",
      category: "Usability",
      acceptableTypes: ["Clinician Training Guide", "User Manual", "Training Curriculum", "Onboarding Documentation", "Quick Reference Card"],
      matchKeywords: ["training", "user manual", "training guide", "onboarding", "quick reference"],
    },
  ],
  S8: [
    {
      name: "Post-Market Surveillance Plan",
      description: "Systematic plan for collecting and analyzing post-market performance data",
      category: "Monitoring",
      acceptableTypes: ["Post-Market Surveillance (PMS) Plan", "Real-World Monitoring Plan", "Post-Deployment Monitoring Protocol", "Vigilance Plan"],
      matchKeywords: ["post-market", "post market", "surveillance plan", "vigilance", "real-world monitoring"],
    },
    {
      name: "Monitoring & Drift Detection Plan",
      description: "Specific plan for detecting performance degradation and distribution shift",
      category: "Monitoring",
      acceptableTypes: ["Drift Detection Plan", "Model Performance Monitoring Protocol", "Continuous Monitoring Specification", "Alert & Threshold Configuration Document"],
      matchKeywords: ["drift detection", "drift", "performance monitoring", "alert", "threshold", "continuous monitoring"],
    },
    {
      name: "CAPA / Corrective Action Procedure",
      description: "Corrective and preventive action process for quality and safety issues",
      category: "Quality",
      acceptableTypes: ["CAPA Procedure", "Corrective and Preventive Action Policy", "Non-Conformance & CAPA Log", "Quality Event Management Procedure"],
      matchKeywords: ["capa", "corrective action", "preventive action", "non-conformance", "quality event"],
    },
    {
      name: "AI Governance Policy",
      description: "Organizational policy governing the AI product's lifecycle and oversight",
      category: "Governance",
      acceptableTypes: ["Organizational AI Governance Policy", "AI Lifecycle Management Policy", "Responsible AI Framework", "AI Ethics & Governance Charter"],
      matchKeywords: ["governance policy", "ai governance", "lifecycle management", "responsible ai", "ai ethics"],
    },
    {
      name: "Change Management Process",
      description: "Documented process for managing model updates, retraining, and version control",
      category: "Quality",
      acceptableTypes: ["Change Management Procedure", "Model Version Control Policy", "Software Change Control Record", "Change Request Process Documentation"],
      matchKeywords: ["change management", "version control", "change control", "model update", "retraining"],
    },
  ],
};

const STOP_WORDS = new Set([
  "the","and","that","with","this","from","are","has","for","not","its","any",
  "can","was","been","will","into","each","also","both","data","used","uses",
  "using","such","when","have","their","they","which","where","what","how",
  "all","more","than","other","must","able","upon","over","under","about",
  "should","would","could","shall","well","then","only","whether","whether",
]);

function extractKeywords(currentFlat: FlatFactor | undefined): string[] {
  if (!currentFlat) return [];
  const sources = [
    currentFlat.factor.description,
    currentFlat.element.name,
    currentFlat.standard.name,
  ];
  const words = sources
    .join(" ")
    .toLowerCase()
    .split(/[\s\W]+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
  return Array.from(new Set(words)).slice(0, 30);
}

function HighlightedText({ content, keywords, enabled }: { content: string; keywords: string[]; enabled: boolean }) {
  if (!enabled || keywords.length === 0) {
    return (
      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground">
        {content}
      </pre>
    );
  }
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matchRegex = new RegExp(`(${escaped.join("|")})`, "gi");
  const testRegex = new RegExp(`^(${escaped.join("|")})$`, "i");
  const parts = content.split(matchRegex);
  return (
    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground">
      {parts.map((part, i) =>
        testRegex.test(part) ? (
          <mark key={i} className="bg-amber-200 dark:bg-amber-700 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </pre>
  );
}

const SCORE_LEVELS = [
  {
    value: 100,
    label: "Exceptional",
    rubricKey: "exceptional" as keyof RefinedFactor["rubric"],
    color: "border-green-500 text-green-700 dark:text-green-400",
    selectedColor: "bg-green-500 border-green-500 text-white dark:text-white",
    dot: "bg-green-500",
    ring: "ring-green-500",
  },
  {
    value: 80,
    label: "Strong",
    rubricKey: "strong" as keyof RefinedFactor["rubric"],
    color: "border-blue-500 text-blue-700 dark:text-blue-400",
    selectedColor: "bg-blue-500 border-blue-500 text-white dark:text-white",
    dot: "bg-blue-500",
    ring: "ring-blue-500",
  },
  {
    value: 50,
    label: "Adequate",
    rubricKey: "adequate" as keyof RefinedFactor["rubric"],
    color: "border-amber-500 text-amber-700 dark:text-amber-400",
    selectedColor: "bg-amber-500 border-amber-500 text-white dark:text-white",
    dot: "bg-amber-500",
    ring: "ring-amber-500",
  },
  {
    value: 20,
    label: "Minimal",
    rubricKey: "minimal" as keyof RefinedFactor["rubric"],
    color: "border-orange-500 text-orange-700 dark:text-orange-400",
    selectedColor: "bg-orange-500 border-orange-500 text-white dark:text-white",
    dot: "bg-orange-500",
    ring: "ring-orange-500",
  },
  {
    value: 0,
    label: "Not Met",
    rubricKey: "notMet" as keyof RefinedFactor["rubric"],
    color: "border-red-500 text-red-700 dark:text-red-400",
    selectedColor: "bg-red-500 border-red-500 text-white dark:text-white",
    dot: "bg-red-500",
    ring: "ring-red-500",
  },
];

interface FlatFactor {
  factor: RefinedFactor;
  element: RefinedElement;
  standard: RefinedStandard;
  globalIdx: number;
}

interface ScoreEntry {
  factorKey: string;
  elementKey: string;
  standardKey: string;
  score: number;
  notes: string;
  notApplicable: boolean;
}

function NewEvaluationDialog({ emptyState }: { emptyState?: boolean } = {}) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [vendorId, setVendorId] = useState("");
  const [standardId, setStandardId] = useState("all");
  const [open, setOpen] = useState(false);

  const { data: vendors } = useQuery<Vendor[]>({ queryKey: ["/api/vendors"] });
  const { data: standardsData } = useQuery<{ standards: RefinedStandard[] }>({ queryKey: ["/api/standards"] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/evaluations", data),
    onSuccess: async (res) => {
      const session = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setOpen(false);
      setLocation(`/evaluations/${session.id}`);
    },
    onError: () => toast({ title: "Failed to create evaluation", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid={emptyState ? "button-new-evaluation-empty" : "button-new-evaluation"}>
          <ClipboardCheck className="h-4 w-4 mr-2" />
          New Evaluation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign New Evaluation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Vendor</label>
            <Select value={vendorId} onValueChange={setVendorId}>
              <SelectTrigger data-testid="select-vendor">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors?.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)} data-testid={`option-vendor-${v.id}`}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Scope</label>
            <Select value={standardId} onValueChange={setStandardId}>
              <SelectTrigger data-testid="select-standard">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Standards (Full Evaluation)</SelectItem>
                {standardsData?.standards?.map((s) => (
                  <SelectItem key={s.id} value={s.id} data-testid={`option-standard-${s.id}`}>
                    S{s.number}: {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() =>
              createMutation.mutate({
                vendorId: parseInt(vendorId),
                evaluatorId: user?.id,
                evaluatorName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Evaluator",
                standardId: standardId === "all" ? null : standardId,
                status: "in_progress",
              })
            }
            disabled={!vendorId || createMutation.isPending}
            data-testid="button-create-evaluation"
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Assign & Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EvaluationsList() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: sessions, isLoading } = useQuery<any[]>({ queryKey: ["/api/evaluations"] });

  const stopMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/evaluations/${id}/status`, { status: "stopped" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      toast({ title: "Evaluation stopped" });
    },
    onError: () => toast({ title: "Error stopping evaluation", variant: "destructive" }),
  });

  const resumeMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/evaluations/${id}/status`, { status: "in_progress" }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      setLocation(`/evaluations/${id}`);
    },
    onError: () => toast({ title: "Error resuming evaluation", variant: "destructive" }),
  });

  const getStatusInfo = (session: any) => {
    if (session.status === "completed") return { label: "Completed", variant: "default" as const, color: "bg-green-500/10 text-green-700 dark:text-green-400" };
    if (session.status === "stopped") return { label: "Stopped", variant: "secondary" as const, color: "bg-red-500/10 text-red-700 dark:text-red-400" };
    if (session.scoreCount > 0) return { label: "In Progress", variant: "secondary" as const, color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" };
    return { label: "New", variant: "secondary" as const, color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" };
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-evaluations-title">
            Evaluation Inbox
          </h1>
          <p className="text-muted-foreground">
            Your assigned vendor evaluations. Click Start or Modify to begin scoring.
          </p>
        </div>
        <NewEvaluationDialog />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Inbox className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Evaluations Assigned</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Create a new evaluation to assign a vendor product for review.
            </p>
            <NewEvaluationDialog emptyState />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((s: any) => {
            const statusInfo = getStatusInfo(s);
            const isNew = s.scoreCount === 0 && s.status === "in_progress";
            const hasScores = s.scoreCount > 0;
            const isStopped = s.status === "stopped";
            const isCompleted = s.status === "completed";

            return (
              <Card
                key={s.id}
                className="border-l-4"
                style={{ borderLeftColor: isCompleted ? "#22c55e" : isStopped ? "#ef4444" : isNew ? "#f59e0b" : "#3b82f6" }}
                data-testid={`card-evaluation-${s.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {isNew ? "Documents Ready for Review" : isStopped ? "Evaluation Stopped" : isCompleted ? "Evaluation Complete" : "Evaluation In Progress"}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.color}`} data-testid={`status-eval-${s.id}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold" data-testid={`text-eval-vendor-${s.id}`}>
                          {s.vendorName || `Vendor #${s.vendorId}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Evaluator: <span className="font-medium">{s.evaluatorName}</span>
                          {s.standardId ? ` · Scope: ${s.standardId}` : " · Full evaluation (all standards)"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {s.documentCount} documents submitted
                        </Badge>
                        {s.scoreCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {s.scoreCount} factors scored
                          </Badge>
                        )}
                        {s.badgeLevel && (
                          <Badge variant="outline" className="text-xs">
                            {s.badgeLevel}
                          </Badge>
                        )}
                        {s.overallScore != null && (
                          <Badge variant="outline" className="text-xs font-semibold">
                            {s.overallScore.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    {!isCompleted && (
                      <div className="flex items-center gap-2 shrink-0">
                        {(isNew || isStopped) && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => isStopped ? resumeMutation.mutate(s.id) : setLocation(`/evaluations/${s.id}`)}
                            disabled={resumeMutation.isPending}
                            data-testid={`button-start-${s.id}`}
                          >
                            <Play className="h-3.5 w-3.5 mr-1.5" />
                            {isStopped ? "Resume" : "Start"}
                          </Button>
                        )}
                        {hasScores && !isStopped && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                            onClick={() => setLocation(`/evaluations/${s.id}`)}
                            data-testid={`button-modify-${s.id}`}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Modify
                          </Button>
                        )}
                        {!isStopped && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => stopMutation.mutate(s.id)}
                            disabled={stopMutation.isPending}
                            data-testid={`button-stop-${s.id}`}
                          >
                            <Square className="h-3.5 w-3.5 mr-1.5" />
                            Stop
                          </Button>
                        )}
                      </div>
                    )}
                    {isCompleted && (
                      <Button size="sm" variant="outline" onClick={() => setLocation(`/evaluations/${s.id}`)} data-testid={`button-view-${s.id}`}>
                        View Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EvaluationScoring({ sessionId }: { sessionId: string }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [scores, setScores] = useState<Map<string, ScoreEntry>>(new Map());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [pendingNote, setPendingNote] = useState("");
  const [scoresLoaded, setScoresLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [highlightsEnabled, setHighlightsEnabled] = useState(true);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [refPanelFactorId, setRefPanelFactorId] = useState<string | null>(null);
  const [requestDocOpen, setRequestDocOpen] = useState(false);
  const [docRequestRecipient, setDocRequestRecipient] = useState<"intake" | "vendor">("intake");

  const { data: session, isLoading: sessionLoading } = useQuery<any>({
    queryKey: ["/api/evaluations", parseInt(sessionId)],
  });

  const { data: standardsData } = useQuery<{ standards: RefinedStandard[] }>({
    queryKey: ["/api/standards"],
  });

  const { data: existingScores } = useQuery<any[]>({
    queryKey: ["/api/evaluations", parseInt(sessionId), "scores"],
    enabled: !!sessionId,
  });

  const standards = useMemo(() => {
    if (!standardsData?.standards) return [];
    if (session?.standardId) return standardsData.standards.filter((s) => s.id === session.standardId);
    return standardsData.standards;
  }, [standardsData, session]);

  const flatFactors: FlatFactor[] = useMemo(() => {
    let idx = 0;
    return standards.flatMap((std) =>
      std.elements.flatMap((el) =>
        el.factors.map((f) => ({
          factor: f,
          element: el,
          standard: std,
          globalIdx: idx++,
        }))
      )
    );
  }, [standards]);

  useEffect(() => {
    if (existingScores && !scoresLoaded && flatFactors.length > 0) {
      const map = new Map<string, ScoreEntry>();
      existingScores.forEach((s) => {
        map.set(s.factorKey, {
          factorKey: s.factorKey, elementKey: s.elementKey,
          standardKey: s.standardKey, score: s.score, notes: s.notes || "",
          notApplicable: s.notApplicable ?? false,
        });
      });
      setScores(map);
      setScoresLoaded(true);
      const firstUnscored = flatFactors.findIndex((ff) => !map.has(ff.factor.id));
      if (firstUnscored >= 0) setCurrentIdx(firstUnscored);
    }
  }, [existingScores, scoresLoaded, flatFactors]);

  const saveMutation = useMutation({
    mutationFn: (scoreList: ScoreEntry[]) =>
      apiRequest("POST", `/api/evaluations/${sessionId}/scores`, { scores: scoreList }),
    onError: () => toast({ title: "Auto-save failed", variant: "destructive" }),
  });

  const finalizeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/evaluations/${sessionId}/finalize`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      toast({ title: "Evaluation finalized!" });
      setLocation("/evaluations");
    },
    onError: () => toast({ title: "Error finalizing", variant: "destructive" }),
  });

  const saveAll = useCallback((scoreMap: Map<string, ScoreEntry>) => {
    const list = Array.from(scoreMap.values());
    if (list.length > 0) saveMutation.mutate(list);
  }, [saveMutation]);

  const handleScore = useCallback((value: number) => {
    const current = flatFactors[currentIdx];
    if (!current) return;

    const entry: ScoreEntry = {
      factorKey: current.factor.id,
      elementKey: current.element.id,
      standardKey: current.standard.id,
      score: value,
      notes: pendingNote,
      notApplicable: false,
    };

    setScores((prev) => {
      const next = new Map(prev);
      next.set(current.factor.id, entry);

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveAll(next), 800);

      return next;
    });

    setPendingNote("");
    setNotesOpen(false);

    if (currentIdx < flatFactors.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  }, [currentIdx, flatFactors, pendingNote, saveAll]);

  const handleNA = useCallback(() => {
    const current = flatFactors[currentIdx];
    if (!current) return;

    const entry: ScoreEntry = {
      factorKey: current.factor.id,
      elementKey: current.element.id,
      standardKey: current.standard.id,
      score: 0,
      notes: pendingNote,
      notApplicable: true,
    };

    setScores((prev) => {
      const next = new Map(prev);
      next.set(current.factor.id, entry);

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveAll(next), 800);

      return next;
    });

    setPendingNote("");
    setNotesOpen(false);

    if (currentIdx < flatFactors.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  }, [currentIdx, flatFactors, pendingNote, saveAll]);

  const currentFlat = flatFactors[currentIdx];
  const totalFactors = flatFactors.length;
  const scoredCount = scores.size;
  const progress = totalFactors > 0 ? (scoredCount / totalFactors) * 100 : 0;

  const vendorDocs: any[] = useMemo(() => {
    if (!session?.documents) return [];
    try { return session.documents as any[]; } catch { return []; }
  }, [session]);

  const vendor: any = session;

  const relevantDocs = useMemo(() => {
    if (!currentFlat) return vendorDocs;
    const cats = STANDARD_DOC_CATEGORIES[currentFlat.standard.id] || [];
    const filtered = vendorDocs.filter((d) => cats.includes(d.category));
    return filtered.length > 0 ? filtered : vendorDocs;
  }, [currentFlat, vendorDocs]);

  const evidenceSummary = useMemo(() => {
    if (!currentFlat || !vendor?.evidenceByStandard) return null;
    return (vendor.evidenceByStandard as Record<string, string>)[currentFlat.standard.id] || null;
  }, [currentFlat, vendor]);

  const currentScore = currentFlat ? scores.get(currentFlat.factor.id) : undefined;

  const docCoverage = useMemo(() => {
    if (!currentFlat) return [];
    const required = REQUIRED_DOCS_BY_STANDARD[currentFlat.standard.id] || [];
    return required.map((req) => {
      const keywordMatch = vendorDocs.find((d) =>
        req.matchKeywords.some((kw) => d.name.toLowerCase().includes(kw.toLowerCase()))
      ) || null;
      const categoryMatch = !keywordMatch
        ? (vendorDocs.find((d) => d.category === req.category) || null)
        : null;
      const match = keywordMatch || categoryMatch;
      return { required: req, match, matchedBy: match ? (keywordMatch ? "keyword" : "category") : null };
    });
  }, [currentFlat, vendorDocs]);

  const keywords = useMemo(() => extractKeywords(currentFlat), [currentFlat]);

  const standardGroups = useMemo(() => {
    return standards.map((std) => {
      const stdFactors = flatFactors.filter((ff) => ff.standard.id === std.id);
      const stdScored = stdFactors.filter((ff) => scores.has(ff.factor.id)).length;
      return { std, total: stdFactors.length, scored: stdScored, firstIdx: stdFactors[0]?.globalIdx ?? 0 };
    });
  }, [standards, flatFactors, scores]);

  if (sessionLoading || !standardsData) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (!session || flatFactors.length === 0) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background/95 backdrop-blur shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/evaluations")} data-testid="button-back-evaluations">
            <ArrowLeft className="h-4 w-4 mr-1" /> Inbox
          </Button>
          <div className="h-5 w-px bg-border" />
          <div>
            <span className="text-sm font-semibold" data-testid="text-eval-title">{vendor?.vendorName || "Evaluation"}</span>
            <span className="text-xs text-muted-foreground ml-2">· {session.evaluatorName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span>{scoredCount} of {totalFactors} scored</span>
            <Progress value={progress} className="w-24 h-1.5" />
            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => saveAll(scores)}
            disabled={saveMutation.isPending}
            data-testid="button-save-scores"
          >
            {saveMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
            Save
          </Button>
          <Button
            size="sm"
            onClick={() => finalizeMutation.mutate()}
            disabled={scoredCount < totalFactors || finalizeMutation.isPending}
            data-testid="button-finalize"
          >
            {finalizeMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
            Finalize
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL — Documents & Evidence */}
        <div className="w-[38%] border-r flex flex-col overflow-hidden bg-muted/20">
          <div className="p-4 border-b shrink-0 space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-semibold">
                {currentFlat ? `${currentFlat.standard.id}: ${currentFlat.standard.name}` : "Vendor Documents"}
              </span>
            </div>
            {evidenceSummary && (
              <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{evidenceSummary}</p>
              </div>
            )}
          </div>

          {currentFlat && (
            <div className="px-4 py-3 border-b shrink-0 bg-background/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">What to look for</p>
              <p className="text-xs font-medium text-foreground mb-1">{currentFlat.factor.description}</p>
              {currentFlat.factor.crossReference && (
                <p className="text-xs text-muted-foreground italic">{currentFlat.factor.crossReference}</p>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto min-h-0">
          {currentFlat && docCoverage.length > 0 && (() => {
            const covered = docCoverage.filter((r) => r.match !== null).length;
            const total = docCoverage.length;
            const pct = total > 0 ? (covered / total) * 100 : 0;
            const badgeClass = pct >= 80
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-300 dark:border-green-700"
              : pct >= 50
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-300 dark:border-amber-700"
              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-300 dark:border-red-700";
            return (
              <div className="px-4 py-3 border-b bg-background/30" data-testid="doc-coverage-section">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Required Docs — {currentFlat.standard.id}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeClass}`} data-testid="doc-coverage-badge">
                    {covered} / {total}
                  </span>
                </div>
                <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
                      data-testid="toggle-checklist"
                    >
                      {checklistOpen ? "Hide checklist" : "Show checklist"}
                      <ChevronDown className={`h-3 w-3 transition-transform ${checklistOpen ? "rotate-180" : ""}`} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="mt-2 space-y-2.5">
                      {docCoverage.flatMap((row, i) => {
                        const prevElement = i > 0 ? docCoverage[i - 1].required.element : undefined;
                        const thisElement = row.required.element;
                        const showElementHeader = thisElement && thisElement !== prevElement;
                        const elementSlug = thisElement ? thisElement.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "";
                        const items = [];
                        if (showElementHeader) {
                          items.push(
                            <li
                              key={`header-${elementSlug}`}
                              className="pt-2 pb-0.5"
                              data-testid={`checklist-element-header-${elementSlug}`}
                            >
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border-b pb-1">
                                {thisElement}
                              </p>
                            </li>
                          );
                        }
                        items.push(
                          <li key={`row-${i}`} className="text-[11px]" data-testid={`checklist-row-${i}`}>
                            {row.match ? (
                              <div className="flex items-start gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                <div className="leading-snug min-w-0 flex-1">
                                  <span className="font-medium text-foreground">{row.required.name}</span>
                                  <div className="text-green-600 dark:text-green-400 mt-0.5" data-testid={`text-matched-doc-${i}`}>
                                    Matched: {row.match.name}
                                  </div>
                                  {row.required.acceptableTypes.length > 0 && (
                                    <div className="mt-1 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded p-1.5" data-testid={`list-acceptable-types-${i}`}>
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Accepted as:</p>
                                      <ul className="space-y-0.5">
                                        {row.required.acceptableTypes.map((type, j) => (
                                          <li key={j} className="text-[10px] text-foreground/70 flex items-start gap-1">
                                            <span className="text-muted-foreground shrink-0">•</span>
                                            <span>{type}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <div className="leading-snug min-w-0 flex-1">
                                  <span className="font-medium text-foreground">{row.required.name}</span>
                                  <p className="text-muted-foreground mt-0.5">{row.required.description}</p>
                                  <div className="mt-1.5 bg-muted/50 rounded p-2" data-testid={`list-acceptable-types-${i}`}>
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Any of:</p>
                                    <ul className="space-y-0.5">
                                      {row.required.acceptableTypes.map((type, j) => (
                                        <li key={j} className="text-[10px] text-foreground/80 flex items-start gap-1">
                                          <span className="text-muted-foreground shrink-0">•</span>
                                          <span>{type}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                        return items;
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                <button
                  className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
                  onClick={() => setRequestDocOpen(true)}
                  data-testid="button-request-doc"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Request missing document
                </button>
              </div>
            );
          })()}

          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Relevant Documents ({relevantDocs.length}) — click to read
            </p>
            {relevantDocs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No documents in this category.</p>
            ) : (
              relevantDocs.map((doc: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setViewingDoc(doc)}
                  className="w-full text-left bg-card border rounded-md p-3 space-y-1.5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                  data-testid={`doc-card-${i}`}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium leading-snug group-hover:text-primary transition-colors">{doc.name}</p>
                      <Badge variant="outline" className="text-[10px] mt-1 h-4">{doc.category}</Badge>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">{doc.description}</p>
                  {doc.content && (
                    <p className="text-[10px] text-primary/60 pl-5 font-medium">Click to read full document →</p>
                  )}
                </button>
              ))
            )}
          </div>
          </div>

          {/* Document Request Email Composer */}
          {(() => {
            if (!requestDocOpen || !currentFlat) return null;
            const vendorName = session?.vendorName || session?.name || "the vendor";
            const stdId = currentFlat.standard.id;
            const stdName = currentFlat.standard.name;
            const evalName = session?.evaluatorName || "TRIAH Evaluator";
            const missingRows = docCoverage.filter((r) => !r.match);
            const recipientEmail = docRequestRecipient === "intake"
              ? (session?.intakeContactEmail || "")
              : (session?.vendorContactEmail || "");
            const emailSubject = `[TRIAH Document Request] ${vendorName} — ${stdId} Evidence`;
            const missingDocLines = missingRows.length > 0
              ? missingRows.map((r) =>
                  `• ${r.required.name}\n  (Acceptable forms: ${r.required.acceptableTypes.join("; ")})`
                ).join("\n")
              : "• Please provide all relevant supporting documentation for this standard.";
            const emailBody = `Dear ${docRequestRecipient === "intake" ? "Intake Contact" : "Vendor Contact"},

As part of the TRIAH evaluation process for ${vendorName}, we are reviewing:
${stdId}: ${stdName}

We require the following additional documentation:
${missingDocLines}

Please provide the requested documents at your earliest convenience so we can proceed with the evaluation.

Best regards,
${evalName}
TRIAH Evaluation Team`;

            return (
              <Dialog open={requestDocOpen} onOpenChange={setRequestDocOpen}>
                <DialogContent className="max-w-lg" data-testid="dialog-request-doc">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Request Missing Document
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Send to</p>
                      <div className="flex gap-2" data-testid="input-recipient-toggle">
                        {(["intake", "vendor"] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setDocRequestRecipient(r)}
                            className={`flex-1 text-sm py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                              docRequestRecipient === r
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {r === "intake" ? "Intake Contact" : "Vendor Contact"}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {recipientEmail
                          ? <span className="text-foreground font-medium">{recipientEmail}</span>
                          : <span className="italic">No email on file — add it in the vendor profile</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Subject</p>
                      <div
                        className="text-sm border rounded-md px-3 py-2 bg-muted/30 font-medium"
                        data-testid="input-email-subject"
                      >
                        {emailSubject}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Body</p>
                      <Textarea
                        defaultValue={emailBody}
                        className="text-sm min-h-[180px] font-mono text-xs"
                        data-testid="input-email-body"
                        readOnly
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setRequestDocOpen(false)}>Close</Button>
                    <Button
                      onClick={() => {
                        const fullText = `Subject: ${emailSubject}\n\n${emailBody}`;
                        navigator.clipboard.writeText(fullText).then(() => {
                          toast({ title: "Email copied to clipboard" });
                          setRequestDocOpen(false);
                        }).catch(() => {
                          toast({ title: "Could not access clipboard", variant: "destructive" });
                        });
                      }}
                      data-testid="button-copy-email"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })()}

          {/* Document viewer sheet */}
          <Sheet open={!!viewingDoc} onOpenChange={(open) => { if (!open) setViewingDoc(null); }}>
            <SheetContent side="left" className="w-[580px] sm:w-[640px] max-w-full flex flex-col p-0">
              <SheetHeader className="px-6 py-4 border-b shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <SheetTitle className="text-base leading-snug">{viewingDoc?.name}</SheetTitle>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">{viewingDoc?.category}</Badge>
                      <span className="text-xs text-muted-foreground">{viewingDoc?.description}</span>
                    </div>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {currentFlat && (
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-md p-3 mb-4 flex items-start justify-between gap-3" data-testid="highlight-banner">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-0.5">
                        Scoring: {currentFlat.factor.id}
                      </p>
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-snug">
                        {currentFlat.factor.description.length > 80
                          ? currentFlat.factor.description.slice(0, 80) + "…"
                          : currentFlat.factor.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setHighlightsEnabled((v) => !v)}
                      className="text-[10px] font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 whitespace-nowrap border border-amber-300 dark:border-amber-600 rounded px-2 py-1 transition-colors shrink-0"
                      data-testid="toggle-highlights"
                    >
                      {highlightsEnabled ? "Hide highlights" : "Show highlights"}
                    </button>
                  </div>
                )}
                {viewingDoc?.content ? (
                  <HighlightedText
                    content={viewingDoc.content}
                    keywords={keywords}
                    enabled={highlightsEnabled}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No document content available for this file.</p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Reference Panel Sheet */}
          <Sheet open={!!refPanelFactorId} onOpenChange={(open) => { if (!open) setRefPanelFactorId(null); }}>
            <SheetContent side="right" className="w-[420px] sm:w-[480px] max-w-full flex flex-col p-0" data-testid="sheet-references" aria-describedby="ref-panel-desc">
              <SheetHeader className="px-5 py-4 border-b shrink-0">
                <SheetTitle className="text-base">
                  References — <span className="font-mono text-sm text-primary">{refPanelFactorId}</span>
                </SheetTitle>
                <p id="ref-panel-desc" className="text-xs text-muted-foreground">Regulatory and evidence basis for scoring this factor</p>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {refPanelFactorId && (() => {
                  const refs = getReferencesForFactor(refPanelFactorId);
                  if (refs.length === 0) return (
                    <div className="py-6 text-center text-sm text-muted-foreground">No external references for this factor.</div>
                  );
                  return refs.map((r) => (
                    <div key={r.id} className="border border-border rounded-lg p-3 space-y-1.5" data-testid={`ref-card-${r.id}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-snug">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.issuer}</p>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                          r.tier === "mandatory"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                            : r.tier === "preferred"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`} data-testid={`badge-tier-${r.id}`}>
                          {r.tier}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{r.description}</p>
                      <button
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        onClick={() => window.open(r.url, "_blank", "noopener,noreferrer")}
                        data-testid={`button-ref-ext-${r.id}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Open source document
                      </button>
                    </div>
                  ));
                })()}
              </div>
              <div className="px-5 py-3 border-t bg-muted/20 shrink-0">
                <p className="text-xs text-muted-foreground">
                  These references define the regulatory and evidence basis for scoring this factor.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* RIGHT PANEL — Scoring */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Standard selector tabs */}
          <div className="px-4 pt-3 pb-2 border-b shrink-0 overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {standardGroups.map(({ std, total, scored, firstIdx }) => (
                <button
                  key={std.id}
                  onClick={() => setCurrentIdx(firstIdx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    currentFlat?.standard.id === std.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                  data-testid={`tab-standard-${std.id}`}
                >
                  {std.id}
                  <span className={`text-[10px] ${currentFlat?.standard.id === std.id ? "opacity-80" : "opacity-60"}`}>
                    {scored}/{total}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Factor scoring area */}
          {currentFlat ? (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* Breadcrumb + position */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{currentFlat.standard.id}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-medium text-foreground">{currentFlat.element.id}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-semibold text-primary">{currentFlat.factor.id}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Factor {currentIdx + 1} of {totalFactors}
                </span>
              </div>

              {/* Factor description card */}
              <div className="bg-card border rounded-lg p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{currentFlat.factor.id}</span>
                  <Badge variant="outline" className="text-xs">
                    {(currentFlat.element.weight * currentFlat.factor.weight * 100).toFixed(1)}% weight
                  </Badge>
                  {currentFlat.factor.mustPass && (
                    <Badge variant="destructive" className="text-xs no-default-active-elevate">
                      <AlertTriangle className="h-3 w-3 mr-1" />Must Pass
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium leading-relaxed">{currentFlat.factor.description}</p>
                <div className="flex items-center gap-3 flex-wrap pt-0.5">
                  <p className="text-xs text-muted-foreground">
                    Standard: <span className="font-medium">{currentFlat.standard.name}</span>
                    {" · "}Element: <span className="font-medium">{currentFlat.element.name}</span>
                  </p>
                  {(() => {
                    const refs = getReferencesForFactor(currentFlat.factor.id);
                    if (refs.length > 0) {
                      return (
                        <button
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                          onClick={() => setRefPanelFactorId(currentFlat.factor.id)}
                          data-testid={`button-factor-refs-${currentFlat.factor.id}`}
                        >
                          <BookOpen className="h-3 w-3" />
                          {refs.length} reference{refs.length !== 1 ? "s" : ""}
                        </button>
                      );
                    }
                    return (
                      <span
                        className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium"
                        data-testid={`chip-triah-ip-${currentFlat.factor.id}`}
                      >
                        <Shield className="h-3 w-3" />
                        TRIAH IP
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Score buttons */}
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Select your score — click to score and advance
                </p>
                {SCORE_LEVELS.map((level) => {
                  const rubricText = currentFlat.factor.rubric[level.rubricKey] || "";
                  const isSelected = currentScore?.score === level.value;
                  return (
                    <button
                      key={level.value}
                      onClick={() => handleScore(level.value)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? `${level.selectedColor} shadow-md scale-[1.01]`
                          : `bg-card ${level.color} hover:scale-[1.005] hover:shadow-sm`
                      }`}
                      data-testid={`score-btn-${currentFlat.factor.id}-${level.value}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-full flex flex-col items-center justify-center shrink-0 border-2 ${
                          isSelected ? "bg-white/20 border-white/40" : `${level.dot.replace("bg-", "bg-")}/15 border-current`
                        }`}>
                          <span className={`text-lg font-bold leading-none ${isSelected ? "text-white" : ""}`}>
                            {level.value}
                          </span>
                          <span className={`text-[9px] leading-none mt-0.5 ${isSelected ? "text-white/80" : "opacity-70"}`}>
                            %
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-bold ${isSelected ? "text-white" : ""}`}>{level.label}</span>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-white/80" />}
                          </div>
                          <p className={`text-xs leading-relaxed ${isSelected ? "text-white/90" : "text-muted-foreground"}`}>
                            {rubricText || "No rubric description available for this level."}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* N/A option */}
              <div className="border-t pt-3">
                {(() => {
                  const isNA = currentScore?.notApplicable === true;
                  return (
                    <div className="space-y-1.5">
                      <button
                        onClick={handleNA}
                        aria-pressed={isNA}
                        className={`w-full text-left rounded-xl border-2 px-4 py-2.5 transition-all flex items-center gap-3 ${
                          isNA
                            ? "bg-slate-500 border-slate-500 text-white shadow-md"
                            : "bg-card border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                        data-testid={`score-btn-${currentFlat.factor.id}-na`}
                      >
                        <Ban className={`h-4 w-4 shrink-0 ${isNA ? "text-white" : "text-slate-400"}`} />
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-semibold ${isNA ? "text-white" : ""}`}>Not Applicable</span>
                          <p className={`text-xs leading-snug mt-0.5 ${isNA ? "text-white/80" : "text-muted-foreground"}`}>
                            This factor does not apply to this product — it will be excluded from scoring
                          </p>
                        </div>
                        {isNA && <CheckCircle2 className="h-4 w-4 text-white/80 shrink-0" />}
                      </button>
                      {currentFlat.factor.mustPass && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 px-1">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          Must-pass factor — marking N/A removes the gate check for this element
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Optional notes */}
              <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="toggle-notes">
                    <Info className="h-3.5 w-3.5" />
                    {notesOpen ? "Hide" : "Add"} notes for this factor
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${notesOpen ? "rotate-180" : ""}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea
                    placeholder="Optional: Note your reasoning, evidence cited, or concerns..."
                    value={pendingNote}
                    onChange={(e) => setPendingNote(e.target.value)}
                    className="mt-2 text-sm min-h-[80px]"
                    data-testid="input-notes"
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Prev / Next navigation */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                  disabled={currentIdx === 0}
                  data-testid="button-prev-factor"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1.5">
                  {flatFactors.slice(Math.max(0, currentIdx - 2), currentIdx + 3).map((ff, i) => {
                    const realIdx = Math.max(0, currentIdx - 2) + i;
                    return (
                      <div
                        key={ff.factor.id}
                        className={`h-2 rounded-full transition-all ${
                          realIdx === currentIdx ? "w-6 bg-primary" :
                          scores.get(ff.factor.id)?.notApplicable ? "w-2 bg-slate-400 dark:bg-slate-500" :
                          scores.has(ff.factor.id) ? "w-2 bg-primary/40" : "w-2 bg-muted-foreground/20"
                        }`}
                      />
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentIdx(Math.min(flatFactors.length - 1, currentIdx + 1))}
                  disabled={currentIdx === flatFactors.length - 1}
                  data-testid="button-next-factor"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg">All Factors Scored!</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  You have scored all {totalFactors} factors. Click Finalize to submit.
                </p>
                <Button onClick={() => finalizeMutation.mutate()} disabled={finalizeMutation.isPending} data-testid="button-finalize-final">
                  {finalizeMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Finalize Evaluation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Evaluations() {
  const [, params] = useRoute("/evaluations/:id");
  if (params?.id) return <EvaluationScoring sessionId={params.id} />;
  return <EvaluationsList />;
}
