import { IntrusionEvent, Report } from './types';
import { writeFileSync } from 'fs';
import { format } from 'date-fns';

export class ReportGenerator {
    public generateReport(events: IntrusionEvent[], format: 'json' | 'csv' = 'json'): Report {
        const summary: Record<string, number> = {};
        
        events.forEach(event => {
            summary[event.type] = (summary[event.type] || 0) + 1;
        });

        const report: Report = {
            timestamp: new Date(),
            totalEvents: events.length,
            detectedIntrusions: events,
            summary
        };

        return report;
    }

    public saveReportToFile(report: Report, filename: string = `report-${Date.now()}`): void {
        const jsonContent = JSON.stringify(report, null, 2);
        writeFileSync(`${filename}.json`, jsonContent);

        let csvContent = 'Timestamp,Type,Severity,Source,Message\n';
        report.detectedIntrusions.forEach(event => {
            csvContent += `"${event.timestamp.toISOString()}","${event.type}","${event.severity}","${event.source}","${event.message.replace(/"/g, '""')}"\n`;
        });
        writeFileSync(`${filename}.csv`, csvContent);
    }

    public printReportSummary(report: Report): void {
        console.log('\n=== Rapport de Sécurité ===');
        console.log(`Date: ${format(report.timestamp, 'yyyy-MM-dd HH:mm:ss')}`);
        console.log(`Total d'événements détectés: ${report.totalEvents}`);
        console.log('\nRécapitulatif:');
        
        for (const [type, count] of Object.entries(report.summary)) {
            console.log(`- ${type}: ${count} événement(s)`);
        }

        if (report.totalEvents > 0) {
            console.log('\nDétails des événements:');
            report.detectedIntrusions.forEach((event, index) => {
                console.log(`\n#${index + 1} [${event.type.toUpperCase()}] ${event.severity}`);
                console.log(`Source: ${event.source}`);
                console.log(`Message: ${event.message}`);
                console.log(`Timestamp: ${format(event.timestamp, 'yyyy-MM-dd HH:mm:ss')}`);
            });
        }

        console.log('\n=== Fin du Rapport ===\n');
    }
}