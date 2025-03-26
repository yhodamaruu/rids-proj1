import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { intrusionRules, whitelistConfig } from './config/rules';
import { IntrusionDetector } from './core/detector';
import { LogAnalyzer } from './core/analyzer';
import { ReportGenerator } from './core/reporter';
import { AlertLogger } from './utils/logger';
import { NetworkSimulator } from './utils/helpers';

const DATA_DIR = path.join(__dirname, 'data');
const SAMPLE_LOG_PATH = path.join(DATA_DIR, 'sample-logs.log');

const detector = new IntrusionDetector(intrusionRules, whitelistConfig);
const analyzer = new LogAnalyzer(detector);
const reporter = new ReportGenerator();

function ensureDataDirectoryExists(): void {
    if (!existsSync(DATA_DIR)) {
        try {
            mkdirSync(DATA_DIR, { recursive: true });
            AlertLogger.logInfo(`Répertoire ${DATA_DIR} créé`);
        } catch (error) {
            AlertLogger.logError(`Erreur création répertoire: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    }
}

async function analyzeLogFile(): Promise<void> {
    ensureDataDirectoryExists();

    try {
        const sampleLogs = NetworkSimulator.generateSampleLogs(50);
        writeFileSync(SAMPLE_LOG_PATH, sampleLogs.join('\n'));
        
        AlertLogger.logInfo('Analyse des logs...');
        const events = await analyzer.analyzeLogFile(SAMPLE_LOG_PATH);

        if (events.length > 0) {
            AlertLogger.logInfo(`${events.length} intrusions détectées`);
            const report = reporter.generateReport(events);
            reporter.printReportSummary(report);
            await reporter.saveReportToFile(report);
        } else {
            AlertLogger.logInfo('Aucune intrusion détectée');
        }
    } catch (error) {
        AlertLogger.logError(`Erreur analyse logs: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function setupRealTimeMonitoring(): void {
    AlertLogger.logInfo('Démarrage surveillance temps réel...');

    const simulator = new NetworkSimulator(8080, async (data, ip) => {
        try {
            const event = detector.analyze(data, ip);
            if (!event) return;

            AlertLogger.logIntrusion(event);
            
            if (detector.getDetectedEvents().length % 5 === 0) {
                const report = reporter.generateReport(detector.getDetectedEvents());
                await reporter.saveReportToFile(report, `realtime-report-${Date.now()}`);
            }
        } catch (error) {
            AlertLogger.logError(`Erreur analyse temps réel: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    simulator.start();

    const shutdown = async () => {
        try {
            simulator.stop();
            AlertLogger.logInfo('Surveillance arrêtée');
            
            const events = detector.getDetectedEvents();
            if (events.length > 0) {
                const report = reporter.generateReport(events);
                reporter.printReportSummary(report);
                await reporter.saveReportToFile(report, 'final-report');
            }
        } catch (error) {
            AlertLogger.logError(`Erreur arrêt surveillance: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            process.exit(0);
        }
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    setTimeout(shutdown, 120000);
}

async function main() {
    try {
        await analyzeLogFile();
        setupRealTimeMonitoring();
    } catch (error) {
        AlertLogger.logError(`Erreur fatale: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}

main().catch(e => AlertLogger.logError(`Erreur inattendue: ${e instanceof Error ? e.message : String(e)}`));