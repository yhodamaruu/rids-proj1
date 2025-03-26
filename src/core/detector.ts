import { IntrusionEvent, DetectionRule, WhitelistConfig } from './types';

export class IntrusionDetector {
    private events: IntrusionEvent[] = [];
    private bruteForceAttempts: Map<string, { count: number, lastAttempt: Date }> = new Map();

    constructor(private rules: Record<string, DetectionRule>, private whitelist: WhitelistConfig) {}

    public analyze(logEntry: string, source: string = 'unknown'): IntrusionEvent | null {
        const timestamp = new Date();
        
        if (this.isWhitelisted(logEntry, source)) {
            return null;
        }

        for (const [ruleName, rule] of Object.entries(this.rules)) {
            if (rule.pattern.test(logEntry)) {
                if (ruleName === 'bruteForce') {
                    return this.handleBruteForce(logEntry, source, timestamp, rule);
                }

                const event: IntrusionEvent = {
                    timestamp,
                    source,
                    message: logEntry,
                    type: ruleName,
                    severity: this.getSeverity(ruleName)
                };
                this.events.push(event);
                return event;
            }
        }

        return null;
    }

    private isWhitelisted(logEntry: string, source: string): boolean {
        if (this.whitelist.allowedIPs.includes(source)) {
            return true;
        }

        for (const pattern of this.whitelist.allowedPatterns) {
            if (pattern.test(logEntry)) {
                return true;
            }
        }

        return false;
    }

    private handleBruteForce(logEntry: string, source: string, timestamp: Date, rule: DetectionRule): IntrusionEvent | null {
        if (!rule.threshold || !rule.timeWindow) {
            throw new Error('Brute force rule requires threshold and timeWindow');
        }

        const entry = this.bruteForceAttempts.get(source) || { count: 0, lastAttempt: new Date(0) };
        const timeDiff = timestamp.getTime() - entry.lastAttempt.getTime();

        if (timeDiff < rule.timeWindow) {
            entry.count++;
            entry.lastAttempt = timestamp;
            this.bruteForceAttempts.set(source, entry);

            if (entry.count >= rule.threshold) {
                const event: IntrusionEvent = {
                    timestamp,
                    source,
                    message: `Multiple failed attempts (${entry.count}) from ${source}`,
                    type: 'bruteForce',
                    severity: 'high'
                };
                this.events.push(event);
                return event;
            }
        } else {
            this.bruteForceAttempts.set(source, { count: 1, lastAttempt: timestamp });
        }

        return null;
    }

    private getSeverity(type: string): 'low' | 'medium' | 'high' {
        switch (type) {
            case 'bruteForce':
            case 'dosAttempt':
                return 'high';
            case 'sqlInjection':
            case 'xssAttack':
                return 'medium';
            default:
                return 'low';
        }
    }

    public getDetectedEvents(): IntrusionEvent[] {
        return [...this.events];
    }

    public clearEvents(): void {
        this.events = [];
        this.bruteForceAttempts.clear();
    }
}