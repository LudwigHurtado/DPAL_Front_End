/**
 * @file This service handles all interactions with the Google Gemini API.
 */
import { GoogleGenAI, Type } from "@google/genai";
import { Category, NftTheme, type Report, IntelItem, type Hero, type TrainingScenario, SimulationMode, SimulationDifficulty, type IntelAnalysis, type AiDirective, Archetype, TacticalIntel, MissionApproach, MissionGoal, type FieldPrompt } from '../types';
import { CATEGORIES } from "../constants";
import { OFFLINE_DIRECTIVES, OFFLINE_INTEL, OFFLINE_TRAINING, OFFLINE_MISSION_TEMPLATES } from "./offlineAiData";

const FLASH_TEXT_MODEL = 'gemini-3-flash-preview'; 
const IMAGE_GEN_MODEL = 'gemini-3-pro-image-preview';

const getApiKey = () => process.env.API_KEY;

export type AiErrorType = 'NOT_CONFIGURED' | 'TEMPORARY_FAILURE' | 'RATE_LIMITED';

export class AiError extends Error {
    constructor(public type: AiErrorType, message: string) {
        super(message);
        this.name = 'AiError';
    }
}

export const isAiEnabled = () => Boolean(getApiKey());

const getAiClient = () => {
  const key = getApiKey();
  if (!key) throw new AiError('NOT_CONFIGURED', 'Neural link unconfigured. Device has no AI key.');
  return new GoogleGenAI({ apiKey: key });
};

const handleApiError = (error: any): never => {
    console.error(`Gemini API Error:`, error);
    if (error?.message?.includes('API_KEY_INVALID') || error?.type === 'NOT_CONFIGURED') {
        throw new AiError('NOT_CONFIGURED', 'AI is off. Your device has no valid AI key configured.');
    }
    if (error?.message?.includes('429') || error?.message?.includes('QUOTA')) {
        throw new AiError('RATE_LIMITED', 'Neural link saturated. Frequency limits reached.');
    }
    throw new AiError('TEMPORARY_FAILURE', 'Transient neural disruption. Link stability low.');
};

// --- AI SERVICE METHODS ---

export async function generateAiDirectives(location: string, workCategory: Category, count: number = 3): Promise<AiDirective[]> {
    if (!isAiEnabled()) return OFFLINE_DIRECTIVES[workCategory] || OFFLINE_DIRECTIVES[Category.Environment];

    try {
        const ai = getAiClient();
        const prompt = `
            ACT AS: DPAL Tactical Dispatcher.
            TARGET LOCATION: ${location}.
            SECTOR: ${workCategory}.
            TASK: Generate ${count} structured "Directives" for field operatives.
            RESPONSE FORMAT: JSON Array.
        `;
        
        const response = await ai.models.generateContent({
            model: FLASH_TEXT_MODEL,
            contents: prompt,
            config: {
                temperature: 0.85,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            instruction: { type: Type.STRING },
                            rewardHc: { type: Type.NUMBER },
                            rewardXp: { type: Type.NUMBER },
                            difficulty: { type: Type.STRING, enum: ['Entry', 'Standard', 'Elite'] },
                            category: { type: Type.STRING },
                            packet: {
                                type: Type.OBJECT,
                                properties: {
                                    priority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                                    confidence: { type: Type.NUMBER },
                                    timeWindow: { type: Type.STRING },
                                    geoRadiusMeters: { type: Type.NUMBER },
                                    primaryAction: { type: Type.STRING },
                                    steps: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                verb: { type: Type.STRING }, actor: { type: Type.STRING }, detail: { type: Type.STRING }, eta: { type: Type.STRING }, safety: { type: Type.STRING }
                                            }
                                        }
                                    },
                                    escalation: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { trigger: { type: Type.STRING }, action: { type: Type.STRING } } } },
                                    evidenceMissing: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, howToCaptureSafely: { type: Type.STRING } } } },
                                    safetyFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["priority", "confidence", "timeWindow", "geoRadiusMeters", "primaryAction", "steps", "escalation", "evidenceMissing", "safetyFlags"]
                            }
                        },
                        required: ["id", "title", "description", "instruction", "rewardHc", "rewardXp", "difficulty", "category", "packet"]
                    }
                }
            }
        });
        
        const items = JSON.parse(response.text || "[]");
        return items.map((item: any) => ({ ...item, status: 'available', timestamp: Date.now(), recommendedNextAction: 'Escalate to Investigative Mission' }));
    } catch (error) {
        return handleApiError(error);
    }
}

export async function generateMissionFromIntel(intel: IntelItem, approach: MissionApproach, goal: MissionGoal): Promise<any> {
    if (!isAiEnabled()) {
        const template = OFFLINE_MISSION_TEMPLATES[approach];
        return {
            title: `OFFLINE: ${intel.title}`,
            backstory: intel.summary,
            category: intel.category,
            approach,
            goal,
            successProbability: 0.85,
            steps: template.map(t => ({ ...t, isComplete: false })),
            finalReward: { hc: 200, nft: { name: 'Offline Shard', icon: '💾' } }
        };
    }

    try {
        const ai = getAiClient();
        const prompt = `
            ARCHITECT A MISSION.
            INTEL: ${JSON.stringify(intel)}.
            APPROACH: ${approach}.
            GOAL: ${goal}.
            
            INSTRUCTIONS:
            - Generate field operator prompts that require real-world confirmation or evidence. 
            - Avoid abstract analysis like "Evaluate" or "Analyze".
            - Use action words: "Identify", "Confirm", "Observe", "Capture", "Verify".
            - Assume the user is physically present.
            - Every step MUST have 1-3 FieldPrompts.
            - Prompt types: confirmation, evidence, observation, safety.
            - Output 5 specific steps.
        `;
        const response = await ai.models.generateContent({
            model: FLASH_TEXT_MODEL,
            contents: prompt,
            config: {
                temperature: 0.4,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        backstory: { type: Type.STRING },
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    task: { type: Type.STRING },
                                    whyItMatters: { type: Type.STRING },
                                    icon: { type: Type.STRING },
                                    priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                                    prompts: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                id: { type: Type.STRING },
                                                type: { type: Type.STRING, enum: ["confirmation", "evidence", "observation", "safety"] },
                                                promptText: { type: Type.STRING },
                                                required: { type: Type.BOOLEAN },
                                                responseType: { type: Type.STRING, enum: ["checkbox", "photo", "video", "text", "multi-select"] },
                                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                                storedAs: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        entity: { type: Type.STRING, enum: ["report", "evidence", "missionLog", "riskAssessment"] },
                                                        field: { type: Type.STRING }
                                                    },
                                                    required: ["entity", "field"]
                                                }
                                            },
                                            required: ["id", "type", "promptText", "required", "responseType", "storedAs"]
                                        }
                                    }
                                },
                                required: ["name", "task", "whyItMatters", "icon", "priority", "prompts"]
                            }
                        },
                        finalReward: { type: Type.OBJECT, properties: { hc: { type: Type.NUMBER }, nft: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, icon: { type: Type.STRING } } } } }
                    },
                    required: ["title", "backstory", "steps"]
                }
            }
        });
        const m = JSON.parse(response.text || "{}");
        return { ...m, approach, goal, category: intel.category, successProbability: 0.9 };
    } catch (e) {
        return handleApiError(e);
    }
}

export async function analyzeIntelSource(intel: IntelItem): Promise<IntelAnalysis> {
    if (!isAiEnabled()) return { threatScore: 42, communityImpact: "Moderate - Local Mode.", investigativeComplexity: "Low", verificationDifficulty: 'Simple', aiAssessment: "Cached Analysis.", targetEntity: "LOCAL" };
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: FLASH_TEXT_MODEL,
            contents: `Deep-scan: ${JSON.stringify(intel)}.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { threatScore: { type: Type.INTEGER }, communityImpact: { type: Type.STRING }, investigativeComplexity: { type: Type.STRING }, verificationDifficulty: { type: Type.STRING, enum: ['Simple', 'Complex', 'Classified'] }, aiAssessment: { type: Type.STRING }, targetEntity: { type: Type.STRING } }, required: ["threatScore", "communityImpact", "investigativeComplexity", "verificationDifficulty", "aiAssessment"] } }
        });
        return JSON.parse(response.text || "{}") as IntelAnalysis;
    } catch (error) { return handleApiError(error); }
}

export async function fetchLiveIntelligence(categories: Category[], location: string): Promise<any> {
    if (!isAiEnabled()) return OFFLINE_INTEL;
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: FLASH_TEXT_MODEL,
            config: { tools: [{ googleSearch: {} }], temperature: 0.1, responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, category: { type: Type.STRING }, title: { type: Type.STRING }, location: { type: Type.STRING }, time: { type: Type.STRING }, summary: { type: Type.STRING }, source: { type: Type.STRING } }, required: ["id", "category", "title", "location", "time", "summary", "source"] } } },
            contents: `Accountability incidents in ${location}.`
        });
        return JSON.parse(response.text || "[]");
    } catch (e) { return handleApiError(e); }
}

export async function generateTrainingScenario(hero: Hero, mode: SimulationMode, category: Category, difficulty: SimulationDifficulty): Promise<TrainingScenario> {
    if (!isAiEnabled()) return OFFLINE_TRAINING[0];
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: FLASH_TEXT_MODEL,
            contents: `Holodeck sim for ${mode} in ${category}.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, environment: { type: Type.STRING }, bgKeyword: { type: Type.STRING }, objectives: { type: Type.ARRAY, items: { type: Type.STRING } }, masterDebrief: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, text: { type: Type.STRING }, successOutcome: { type: Type.STRING }, failOutcome: { type: Type.STRING }, dc: { type: Type.INTEGER }, rationale: { type: Type.STRING } }, required: ["id", "text", "successOutcome", "failOutcome", "dc", "rationale"] } }, difficulty: { type: Type.INTEGER } }, required: ["id", "title", "description", "environment", "bgKeyword", "objectives", "options", "difficulty", "masterDebrief"] } }
        });
        return JSON.parse(response.text || "{}") as TrainingScenario;
    } catch (e) { return handleApiError(e); }
}

export async function performIAReview(report: Report): Promise<{ findings: any[], outcome: string }> {
    if (!isAiEnabled()) return { findings: [{id: '1', title: 'Offline', value: 'Manual check', status: 'VERIFIED', hash: 'LOCAL'}], outcome: "Local Buffer." };
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: FLASH_TEXT_MODEL,
            contents: `IA review for: ${report.title}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { findings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, value: { type: Type.STRING }, status: { type: Type.STRING, enum: ['VERIFIED', 'ANOMALY', 'MATCHED'] }, hash: { type: Type.STRING } }, required: ["id", "title", "value", "status", "hash"] } }, outcome: { type: Type.STRING } }, required: ["findings", "outcome"] } }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) { return handleApiError(error); }
}

export async function generateNftImage(hero: Hero, reportContext: any, prompt: string, theme?: NftTheme): Promise<string> {
  if (!isAiEnabled()) return `https://picsum.photos/seed/${prompt.substring(0,5)}/400/600`;
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({ model: IMAGE_GEN_MODEL, contents: `Artifact: ${prompt}. Theme: ${theme}.`, config: { imageConfig: { aspectRatio: '3:4', imageSize: '1K' } } });
    for (const part of response.candidates[0].content.parts) { if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; }
    throw new Error("No image data.");
  } catch (error) { return handleApiError(error); }
}

export async function generateNftDetails(description: string): Promise<{ nftTitle: string; nftDescription: string }> {
  if (!isAiEnabled()) return { nftTitle: "Heroic Shard", nftDescription: "A record." };
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({ model: FLASH_TEXT_MODEL, contents: `NFT title/desc for: ${description}.`, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { nftTitle: { type: Type.STRING }, nftDescription: { type: Type.STRING } }, required: ["nftTitle", "nftDescription"] } } });
    return JSON.parse(response.text || "{}");
  } catch (error) { return handleApiError(error); }
}

export async function generateNftPromptIdeas(hero: Hero, theme: NftTheme, dpalCategory: Category): Promise<string[]> {
  if (!isAiEnabled()) return ["Decentralized Oversight Shard", "Truth Network Artifact", "Community Governance Token"];
  try {
    const ai = getAiClient();
    const prompt = `Act as the DPAL Oracle. Generate 3 unique, evocative, and conceptually dense short phrases (max 5 words each) for an NFT artifact based on:
    Theme: ${theme}
    Category: ${dpalCategory}
    Role: ${hero.title}
    
    The phrases should sound like fragments of a futuristic accountability ledger.
    Return only a JSON array of strings.`;
    
    const response = await ai.models.generateContent({
      model: FLASH_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function generateHeroBackstory(hero: Hero): Promise<string> {
  if (!isAiEnabled()) return "Redacted.";
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({ model: FLASH_TEXT_MODEL, contents: `Background for: ${hero.name}.`, config: { temperature: 0.8, thinkingConfig: { thinkingBudget: 0 } } });
    return (response.text || "").trim();
  } catch (error) { return handleApiError(error); }
}

export async function getMissionTaskAdvice(title: string, backstory: string, name: string, task: string): Promise<TacticalIntel> {
    if (!isAiEnabled()) return { objective: name, threatLevel: 'Medium', keyInsight: "Offline Analysis.", protocol: "Default." };
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({ model: FLASH_TEXT_MODEL, contents: `Advice for mission: ${title}, step: ${name}.`, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { objective: { type: Type.STRING }, threatLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Extreme'] }, keyInsight: { type: Type.STRING }, protocol: { type: Type.STRING } }, required: ["objective", "threatLevel", "keyInsight", "protocol"] } } });
        return JSON.parse(response.text || "{}") as TacticalIntel;
    } catch (error) { return handleApiError(error); }
}

export async function getLiveIntelligenceUpdate(currentState: any): Promise<any> {
    if (!isAiEnabled()) return { ui: { next: 'Offline Analysis', why: 'Neural link unconfigured.', need: [], risk: 'Low', eta: 0, score: 0 }, patch: {} };
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({ model: FLASH_TEXT_MODEL, contents: `Co-pilot update for: ${JSON.stringify(currentState)}`, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { ui: { type: Type.OBJECT, properties: { next: { type: Type.STRING }, why: { type: Type.STRING }, need: { type: Type.ARRAY, items: { type: Type.STRING } }, risk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }, eta: { type: Type.INTEGER }, score: { type: Type.NUMBER } }, required: ["next", "why", "need", "risk", "eta", "score"] }, patch: { type: Type.OBJECT } }, required: ["ui", "patch"] } } });
        return JSON.parse(response.text || "{}");
    } catch (e) { return handleApiError(e); }
}

export async function generateHeroPersonaDetails(prompt: string, arch: Archetype): Promise<any> {
    if (!isAiEnabled()) return { name: "Agent Shadow", backstory: "Local node operative.", combatStyle: "Tactical." };
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({ model: FLASH_TEXT_MODEL, contents: `Persona details for ${arch}: ${prompt}.`, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, backstory: { type: Type.STRING }, combatStyle: { type: Type.STRING } }, required: ["name", "backstory", "combatStyle"] } } });
        return JSON.parse(response.text || "{}");
    } catch (e) { return handleApiError(e); }
}

export async function generateHeroPersonaImage(prompt: string, arch: Archetype, sourceImageData?: string): Promise<string> {
    if (!isAiEnabled()) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({ model: IMAGE_GEN_MODEL, contents: `Hero portrait for ${arch}: ${prompt}.`, config: { imageConfig: { aspectRatio: '1:1', imageSize: '1K' } } });
        for (const part of response.candidates[0].content.parts) { if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; }
        throw new Error("Persona image failed.");
    } catch (e) { return handleApiError(e); }
}

export async function formatTranscript(text: string): Promise<string> { return text; }
