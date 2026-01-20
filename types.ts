
export enum Category {
  Travel = "Travel",
  ElderlyCare = "Elderly Care",
  ProfessionalServices = "Professional Services",
  NonProfit = "Non-Profit & Charity",
  Events = "Event Transparency",
  PoliceMisconduct = "Police Misconduct",
  Housing = "Housing",
  MedicalNegligence = "Medical Negligence",
  ConsumerScams = "Consumer Scams",
  Education = "Education",
  Environment = "Environment",
  WorkplaceIssues = "Workplace Issues",
  VeteransServices = "Veterans' Services",
  PublicTransport = "Public Transport",
  Infrastructure = "Infrastructure",
  Allergies = "Allergies",
  InsuranceFraud = "Insurance Fraud",
  Clergy = "Clergy",
  WaterViolations = "Water Related Violations",
  Other = "Other",
  CivicDuty = "Civic Duty",
  AccidentsRoadHazards = "Accidents and Road Hazards",
  MedicalEmergencies = "Medical Emergencies",
  FireEnvironmentalHazards = "Fire and Environmental Hazards",
  PublicSafetyAlerts = "Public Safety Alerts"
}

export enum SubscriptionTier {
    Scout = "SCOUT_BASE",
    Guardian = "GUARDIAN_PRO",
    Sentinel = "SENTINEL_ELITE",
    Oracle = "ORACLE_GENESIS"
}

export enum SimulationMode {
    Synthesist = "Logic & Analysis",
    Dynamic = "Field Response",
    Mediation = "Social Harmony",
    Forensic = "Artifact Recovery",
    Regulatory = "Policy Compliance",
    Environmental = "Neural Scan"
}

export enum SimulationDifficulty {
    Entry = "Entry",
    Standard = "Standard",
    Elite = "Elite"
}

export enum SkillLevel {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Expert = "Expert"
}

export type ActionOutcome = 'CLEAN_SUCCESS' | 'PARTIAL_SUCCESS' | 'RISKY_SUCCESS' | 'PARTIAL_CONFIRMATION' | 'INCOMPLETE';

export interface FieldPrompt {
  id: string;
  type: "confirmation" | "evidence" | "observation" | "safety";
  promptText: string;
  required: boolean;
  responseType: "checkbox" | "photo" | "video" | "text" | "multi-select";
  options?: string[]; // For multi-select
  validationRules?: { rule: "minLength" | "fileType" | "geoRequired" | "timeWindow"; value: any }[];
  storedAs: {
    entity: "report" | "evidence" | "missionLog" | "riskAssessment";
    field: string;
  };
}

export interface MissionAction {
    id: string;
    name: string;
    task: string;
    whyItMatters: string;
    icon: string;
    priority: 'High' | 'Medium' | 'Low';
    isComplete: boolean;
    prompts: FieldPrompt[];
    outcome?: ActionOutcome;
    completedAt?: number;
    userResponses?: Record<string, any>;
    evidenceUrls?: string[];
    impactedSkills: SkillType[];
}

export interface Mission {
  id: string;
  title: string;
  backstory: string;
  category: Category;
  approach?: MissionApproach;
  goal?: MissionGoal;
  location?: string;
  ledgerRef?: string;
  successProbability: number;
  reconActions: MissionAction[];
  mainActions: MissionAction[];
  currentActionIndex: number;
  phase: 'RECON' | 'OPERATION' | 'COMPLETED';
  status?: 'active' | 'completed';
  linkedReportId?: string;
  finalReward: { hc: number; legendTokens?: number; nft: { name: string; icon: string } };
  steps?: any[]; // Legacy
  currentStepIndex?: number; // Legacy
}

export enum Archetype {
    Analyst = "Logic-Driven Analyst",
    Shepherd = "Compassionate Shepherd",
    Seeker = "Unyielding Seeker",
    Sentinel = "Civic Sentinel",
    Firefighter = "Hazard Responder",
    Seraph = "Radiant Guardian",
    Guide = "Communal Pathweaver"
}

export type MissionApproach = 'EVIDENCE_FIRST' | 'COMMUNITY_FIRST' | 'SYSTEMS_FIRST';
export type MissionGoal = 'STOP_HARM' | 'DOCUMENT_HARM' | 'GET_REMEDY';
export type SeverityLevel = 'Informational' | 'Standard' | 'Critical' | 'Catastrophic';
export type SkillType = 'Logic' | 'Forensic' | 'Empathy' | 'Technical' | 'Wisdom' | 'Social' | 'Tactical' | 'Civic' | 'Environmental' | 'Infrastructure';
export type DirectivePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DirectivePacket {
  priority: DirectivePriority;
  confidence: number;
  timeWindow: string;
  geoRadiusMeters: number;
  primaryAction: string;
  steps: Array<{
    verb: string;
    actor: string;
    detail: string;
    eta: string;
    safety: string;
  }>;
  escalation: Array<{
    trigger: string;
    action: string;
  }>;
  evidenceMissing: Array<{
    item: string;
    howToCaptureSafely: string;
  }>;
  resourceRequests: string[];
  safetyFlags: string[];
}

export interface AiDirective {
    id: string;
    title: string;
    description: string;
    instruction: string;
    rewardHc: number;
    rewardXp: number;
    difficulty: 'Entry' | 'Standard' | 'Elite';
    category: Category;
    status: 'available' | 'active' | 'completed';
    proofImageUrl?: string;
    timestamp: number;
    packet?: DirectivePacket;
    auditHash?: string;
    recommendedNextAction?: string;
}

export interface ChatMessage {
    id: string;
    sender: string;
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    timestamp: number;
    isSystem?: boolean;
    ledgerProof: string; 
    rank?: number;
    avatarUrl?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  timestamp: Date;
  imageUrls?: string[];
  audioUrl?: string;
  hash: string;
  blockchainRef: string;
  isAuthor?: boolean;
  status: ReportStatus;
  trustScore: number; 
  severity: SeverityLevel;
  isActionable: boolean;
  structuredData?: any;
  credsEarned?: number;
  attachments?: File[];
  isGeneratingNft?: boolean;
  tags?: string[];
  evidence?: Array<{
      type: string;
      url: string;
      notes: string;
      hash: string;
  }>;
  earnedNft?: {
    source: 'report' | 'minted' | 'badge';
    title: string;
    imageUrl: string;
    mintCategory: Category;
    blockNumber: number;
    txHash: string;
    rarity: NftRarity;
    grade: string;
  };
}

export type ReportStatus = 'Submitted' | 'In Review' | 'Resolved';

export enum NftTheme {
    Fantasy = "Forensic Reconstruction (Fantasy)",
    OldWest = "Frontier Investigation (Western)",
    Cyberpunk = "Neural Net Projection (Cyberpunk)",
    Ancient = "Archeological Audit (Ancient)",
    Modern = "Street-Level Mapping (Modern)",
    Mythical = "Legendary Synthesis (Mythical)",
    Steampunk = "Clockwork Forensics (Steampunk)",
    Apocalyptic = "Post-Crisis Recovery (Wasteland)",
    Solarpunk = "Renewable Utopia (Solarpunk)",
    DeepSea = "Abyssal Extraction (Deep Sea)",
    Cosmic = "Void Singularity (Cosmic)",
    Noir = "Monochrome Detective (Noir)",
    Glitch = "System Fragmentation (Glitch)",
    Biopunk = "Genetic Sequence (Biopunk)",
    Renaissance = "Classical Illumination (Renaissance)",
    Shogun = "Dynastic Protocol (Eastern)",
    Nordic = "Boreal Convergence (Norse)",
    Vaporwave = "Retro-Wave Simulation (90s)",
    Minimalist = "Zen Purity (Geometric)",
    Gothic = "Ethereal Shadow (Gothic)",
    Industrial = "Brutalist Steel (Industrial)",
    Solstice = "Celestial Alignment (Sun/Moon)",
    Quantum = "Sub-Atomic Probability (Quantum)",
    Magma = "Volcanic Core (Primal)"
}

export enum NftRarity {
    Common = "Common",
    Rare = "Rare",
    Epic = "Epic",
    Legendary = "Legendary",
}

export interface Rank {
  level: number;
  title: string;
  xpNeeded: number;
  perk: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'Gear' | 'Tool' | 'Consumable' | 'Augmentation';
  icon: string;
  resonance: number; 
  bonusSkill?: SkillType;
  bonusValue?: number;
}

export interface IapPack {
  sku: string;
  price: number;
  hcAmount: number;
  isBestValue?: boolean;
}

export interface StoreItem {
  sku: string;
  price: number;
  name: string;
  description: string;
  icon: string;
  type: 'Gear' | 'Tool' | 'Consumable' | 'Badge' | 'Frame';
}

export interface Hero {
    name: string;
    operativeId: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    heroCredits: number;
    reputation: number;
    legendTokens: number;
    rank: number;
    title: string;
    unlockedTitles: string[];
    equippedTitle: string | null;
    inventory: Item[];
    personas: HeroPersona[];
    equippedPersonaId: null | string;
    theme: 'light' | 'neon';
    masteryScore: number;
    wisdomMastery: number;
    socialMastery: number;
    civicMastery: number;
    environmentalMastery: number;
    infrastructureMastery: number;
    base: { name: string; level: number; status: string };
    skills: SkillNode[];
    path: HeroPath;
    hasMadeFirstPurchase?: boolean;
    unlockedItemSkus: string[];
    activeParcels: QrParcel[];
    subscriptionTier: SubscriptionTier;
    subscriptionRenewal?: number;
}

export interface HeroPersona {
    id: string;
    prompt: string;
    name: string;
    backstory: string;
    combatStyle: string;
    imageUrl: string;
    archetype?: Archetype;
}

export interface TacticalDossier {
    id: string;
    name: string;
    description: string;
    reportIds: string[];
    author: string;
    timestamp: number;
}

export interface TeamMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    rank: number;
    avatarUrl?: string;
    attachment?: {
        type: 'invite' | 'mission' | 'dossier';
        refId: string;
        label: string;
    };
}

export interface HealthRecord {
    id: string;
    ownerName: string;
    relationship: string;
    bloodType: string;
    allergies: string[];
    medications: string[];
    emergencyContact: string;
    sharedFolderUri?: string;
    isCloudSynced: boolean;
    timestamp: number;
    criticalNotes?: string;
}

export interface SkillNode {
    id: string;
    name: string;
    description: string;
    cost: number;
    isUnlocked: boolean;
}

export enum HeroPath {
    Sentinel = "Path of the Sentinel",
    Steward = "Path of the Steward",
    Seeker = "Path of the Seeker",
    Arbiter = "Path of the Arbiter",
    Ghost = "Path of the Ghost"
}

export interface MissionCompletionSummary {
    title: string;
    rewardHeroCredits: number;
    rewardLegendTokens?: number;
    rewardNft: { name: string; icon: string };
}

export interface QrParcel {
    id: string;
    type: 'credits' | 'item';
    amount?: number;
    item?: Item;
    sender: string;
    senderId: string;
    targetOperativeId?: string;
    isClaimed: boolean;
    timestamp: number;
}

export interface LiveMissionState {
    id: string;
    title: string;
    category: Category;
    checklist: { id: string; s: 'todo' | 'done'; label: string }[];
    score: number;
    risk: 'Low' | 'Medium' | 'High';
    evidence: EvidenceItem[];
}

export interface LiveIntelligenceUI {
    next: string;
    why: string;
    eta: number;
    score: number;
    risk: 'Low' | 'Medium' | 'High';
}

export interface EvidenceItem {
    id: string;
    name: string;
    type: 'geo' | 'photo' | 'text';
    status: string;
    content?: string;
    previewUrl?: string;
}

export interface TacticalIntel {
    objective: string;
    threatLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
    keyInsight: string;
    protocol: string;
}

export interface TrainingScenario {
    id: string;
    title: string;
    description: string;
    environment: string;
    bgKeyword: string;
    objectives: string[];
    masterDebrief: string;
    options: {
        id: string;
        text: string;
        successOutcome: string;
        failOutcome: string;
        dc: number;
        rationale: string;
    }[];
    difficulty: number;
}

export interface IntelAnalysis {
    threatScore: number;
    communityImpact: string;
    investigativeComplexity: string;
    verificationDifficulty: 'Simple' | 'Complex' | 'Classified';
    aiAssessment: string;
    targetEntity: string;
}

export interface CharacterNft {
    title: string;
    imageUrl: string;
    collection: string;
}

export interface LiveIntelligenceResponse {
    ui: LiveIntelligenceUI;
    patch: Partial<LiveMissionState>;
}

export interface Augmentation {
    id: string;
    targetSkill: SkillType;
    multiplier: number;
    description: string;
}

export interface TrainingModule {
    id: string;
    title: string;
    description: string;
    skillType: SkillType;
    masteryReward: number;
    isLocked: boolean;
    isScripture?: boolean;
    notAskedToDo: string; 
    indicators: string[]; 
    checklist: string[]; 
}

export enum EducationRole {
    Teacher = "Teacher",
    Student = "Student",
    Employee = "Employee",
    Observer = "Observer",
}

export interface FeedAnalysis {
  summary: string;
  hot_topics: { topic: string; report_ids: string[] }[];
}

export interface IntelItem {
  id: string;
  category: Category;
  title: string;
  location: string;
  time: string;
  summary: string;
  source: string;
  links?: { uri: string; title: string }[];
}

export interface ArtifactTrait {
    id: string;
    name: string;
    description: string;
    cost: number;
    bonusType: string;
    bonusValue: number;
}
