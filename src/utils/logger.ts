import { IntrusionEvent } from '../core/types';

export class AlertLogger {
    public static logIntrusion(event: IntrusionEvent): void {
        const colors = {
            low: '\x1b[33m', 
            medium: '\x1b[35m',
            high: '\x1b[31m' 
        };
        
        const color = colors[event.severity] || '\x1b[0m';
        const reset = '\x1b[0m';
        
        console.log(
            `${color}[ALERTE ${event.severity.toUpperCase()}] ${event.type.toUpperCase()}${reset}\n` +
            `Source: ${event.source}\n` +
            `Message: ${event.message}\n` +
            `Timestamp: ${event.timestamp.toISOString()}\n`
        );
    }

    public static logInfo(message: string): void {
        console.log(`\x1b[36m[INFO]\x1b[0m ${message}`);
    }

    public static logError(message: string): void {
        console.error(`\x1b[31m[ERREUR]\x1b[0m ${message}`);
    }
}