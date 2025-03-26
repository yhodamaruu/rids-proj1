export const intrusionRules = {
    bruteForce: {
        pattern: /Failed password for .* from .* port \d+/,
        threshold: 5,
        timeWindow: 60 * 1000, 
        description: "Tentative de brute force détecté"
    },
    sqlInjection: {
        pattern: /(\'|\"|%27|%22).*(OR|AND|SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER)/i,
        description: "Possible injection sql détecté"
    },
    xssAttack: {
        pattern: /(<script>|javascript:)|(%3Cscript%3E|%20javascript:)/i,
        description: "Possible attaque xss détecté"
    },
    sensitiveFileAccess: {
        pattern: /(\/etc\/shadow|\/etc\/passwd|\/\.env|\.git\/)/,
        description: "Accès à un fichier sensible détecté"
    },
    dosAttempt: {
        pattern: /(ping of death|syn flood|http flood)/i,
        description: "Possible tentative de dos détectée"
    }
};

export const whitelistConfig = {
    allowedIPs: ["192.168.1.1", "10.0.0.2"],
    allowedPatterns: [
        /Normal login from 192\.168\.1\.1/,
        /Scheduled backup task/
    ]
};