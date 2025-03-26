export interface IntrusionEvent {
    timestamp: Date;
    source: string;
    message: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
}

export interface DetectionRule {
    pattern: RegExp;
    threshold?: number;
    timeWindow?: number;
    description: string;
}

export interface WhitelistConfig {
    allowedIPs: string[];
    allowedPatterns: RegExp[];
}

export interface IDSConfig {
    rules: Record<string, DetectionRule>;
    whitelist: WhitelistConfig;
}

export interface Report {
    timestamp: Date;
    totalEvents: number;
    detectedIntrusions: IntrusionEvent[];
    summary: Record<string, number>;
}