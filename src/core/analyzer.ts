import { readFileSync } from 'fs';
import { IntrusionDetector } from './detector';
import { IntrusionEvent } from './types';

export class LogAnalyzer {
    constructor(private detector: IntrusionDetector) {}

    public analyzeLogFile(filePath: string): IntrusionEvent[] {
        try {
            const logData = readFileSync(filePath, 'utf-8');
            const logLines = logData.split('\n');
            const detectedEvents: IntrusionEvent[] = [];

            for (const line of logLines) {
                if (line.trim()) {
                    const event = this.detector.analyze(line, this.extractSourceIP(line));
                    if (event) {
                        detectedEvents.push(event);
                    }
                }
            }

            return detectedEvents;
        } catch (error) {
            console.error(`Erreur lors de l'analyse du fichier: ${error}`);
            return [];
        }
    }

    public analyzeRealTime(logStream: NodeJS.ReadableStream, callback: (event: IntrusionEvent) => void): void {
        logStream.on('data', (data: Buffer) => {
            const logLines = data.toString().split('\n');
            for (const line of logLines) {
                if (line.trim()) {
                    const event = this.detector.analyze(line, this.extractSourceIP(line));
                    if (event) {
                        callback(event);
                    }
                }
            }
        });
    }

    private extractSourceIP(logLine: string): string {
        const ipMatch = logLine.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
        return ipMatch ? ipMatch[0] : 'unknown';
    }
}