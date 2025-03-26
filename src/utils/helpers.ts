import { createServer, Server, Socket } from 'net';

export class NetworkSimulator {
    private server: Server;
    private connections: Socket[] = [];

    constructor(private port: number, private onData: (data: string, ip: string) => void) {
        this.server = createServer((socket) => {
            const clientIp = socket.remoteAddress || 'unknown';
            this.connections.push(socket);

            socket.on('data', (data) => {
                this.onData(data.toString(), clientIp);
            });

            socket.on('end', () => {
                this.connections = this.connections.filter(conn => conn !== socket);
            });
        });

        this.server.on('error', (err) => {
            console.error('Erreur du serveur:', err);
        });
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Serveur simulé en écoute sur le port ${this.port}`);
        });
    }

    public stop(): void {
        this.connections.forEach(conn => conn.end());
        this.server.close();
    }

    public static generateSampleLogs(count: number): string[] {
        const logs = [];
        const actions = [
            'Failed password for root',
            'Successful login for admin',
            'GET /index.html',
            'GET /etc/passwd',
            'POST /login.php with SELECT * FROM users',
            'Ping flood detected',
            '<script>alert(1)</script> in form input'
        ];
        
        const ips = ['192.168.1.1', '10.0.0.2', '172.16.0.3', '45.67.89.123'];

        for (let i = 0; i < count; i++) {
            const ip = ips[Math.floor(Math.random() * ips.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const timestamp = new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString();
            logs.push(`[${timestamp}] ${ip} - ${action}`);
        }

        return logs;
    }
}