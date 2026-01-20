
import { Category, type AiDirective, type IntelItem, type TrainingScenario } from '../types';

export const OFFLINE_DIRECTIVES: Record<string, AiDirective[]> = {
  [Category.Environment]: [
    {
      id: 'DIR-OFF-001',
      title: 'LOCAL_BUFFER: Drainage Audit',
      description: 'Audit industrial runoff channels for non-permitted discharge signatures.',
      instruction: 'Capture 3 high-fidelity images of outflow residue and log the timestamp.',
      rewardHc: 150, rewardXp: 50, difficulty: 'Standard', category: Category.Environment, status: 'available', timestamp: Date.now(),
      packet: {
        priority: 'HIGH', confidence: 94, timeWindow: '4 Hours', geoRadiusMeters: 500, primaryAction: 'Documentation of physical residue.',
        steps: [{ verb: 'Locate', actor: 'Operative', detail: 'Find primary outflow valve', eta: '15m', safety: 'High' }],
        escalation: [{ trigger: 'Chemical Burn', action: 'Notify Med-Ops' }],
        evidenceMissing: [{ item: 'pH Strip Test', howToCaptureSafely: 'Use telescopic sampler' }],
        resourceRequests: [], safetyFlags: ['CHEMICAL']
      }
    }
  ],
  [Category.Infrastructure]: [
    {
      id: 'DIR-OFF-002',
      title: 'LOCAL_BUFFER: Signal Parity',
      description: 'Verify traffic light cycle timing against the municipal public ledger.',
      instruction: 'Record 2 complete cycles and log any deviations in the transit buffer.',
      rewardHc: 100, rewardXp: 30, difficulty: 'Entry', category: Category.Infrastructure, status: 'available', timestamp: Date.now(),
      packet: {
        priority: 'LOW', confidence: 88, timeWindow: '12 Hours', geoRadiusMeters: 200, primaryAction: 'Timing synchronization.',
        steps: [{ verb: 'Observe', actor: 'Citizen', detail: 'Clock green light duration', eta: '5m', safety: 'Safe' }],
        escalation: [], evidenceMissing: [], resourceRequests: [], safetyFlags: ['TRAFFIC']
      }
    }
  ]
};

export const OFFLINE_MISSION_TEMPLATES = {
    EVIDENCE_FIRST: [
        { name: 'Sync Geometry', task: 'Confirm location and time window anchors.', icon: '📍', priority: 'High' },
        { name: 'Visual Telemetry', task: 'Capture 4K photo or video evidence with metadata.', icon: '📸', priority: 'High' },
        { name: 'Witness Ledger', task: 'Identify witness and record encrypted contact hash.', icon: '👥', priority: 'Medium' },
        { name: 'Factual Synthesis', task: 'Create a short neutral factual narrative.', icon: '📄', priority: 'Medium' },
        { name: 'Ledger Commit', task: 'Submit forensic report with tags and category.', icon: '💾', priority: 'High' }
    ],
    COMMUNITY_FIRST: [
        { name: 'Impact Mapping', task: 'Identify impacted groups (neighbors, schools, riders).', icon: '🗺️', priority: 'High' },
        { name: 'Resource Locating', task: 'Locate local support nodes (NGOs, Agencies).', icon: '🏥', priority: 'Medium' },
        { name: 'Draft Pulse', task: 'Draft a non-violent communal outreach message.', icon: '✉️', priority: 'Medium' },
        { name: 'Sync Confirmations', task: 'Collect 2 confirmations or field tips from members.', icon: '✅', priority: 'Medium' },
        { name: 'Communal Dispatch', task: 'Submit report and share mapped resource list.', icon: '📢', priority: 'High' }
    ],
    SYSTEMS_FIRST: [
        { name: 'Node Identification', task: 'Identify responsible agency or corporate entity.', icon: '🏢', priority: 'High' },
        { name: 'Protocol Audit', task: 'Gather the specific policy or rule that applies.', icon: '📖', priority: 'Medium' },
        { name: 'Violation Logging', task: 'Document specific structural violation indicators.', icon: '⚠️', priority: 'High' },
        { name: 'Escalation Plan', task: 'Create tactical escalation plan (who/when/proof).', icon: '📈', priority: 'Medium' },
        { name: 'Systemic Commit', task: 'Submit report and generate follow-up directive.', icon: '🔄', priority: 'High' }
    ]
};

export const OFFLINE_INTEL: IntelItem[] = [
  {
    id: 'INTEL-OFF-01',
    category: Category.Environment,
    title: 'LOCAL_BUFFER: Anomaly in Sector 7',
    location: 'Regional Terminal',
    time: 'Recent',
    summary: 'Internal sensors detected a 12% rise in air particulates. Local operatives requested to verify filters.',
    source: 'DPAL_INTERNAL',
    links: [{ uri: '#', title: 'Local Cache' }]
  }
];

export const OFFLINE_TRAINING: TrainingScenario[] = [
  {
    id: 'TRAIN-OFF-01',
    title: 'LOCAL_BUFFER: Conflict Resolution',
    description: 'A citizen is blocking a public path, claiming private ownership. Verify the zoning shard.',
    environment: 'Urban Corridor',
    bgKeyword: 'city',
    objectives: ['Verify Zoning Data'],
    masterDebrief: 'Conflict resolved via data transparency.',
    difficulty: 2,
    options: [{ id: '1', text: 'Scan zoning marker', successOutcome: 'Marker confirms public path.', failOutcome: 'N/A', dc: 5, rationale: 'Primary lock.' }]
  }
];
