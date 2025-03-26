# RIDS - Basic Intrusion Detection System / (IDS)

**Due Date:** 26/03/25 

## 📝 Project Description

RIDS is a basic Intrusion Detection System (IDS) implemented in TypeScript. This project demonstrates core cybersecurity concepts by monitoring network traffic or log files to detect suspicious activities such as:

- Repeated login attempts (Brute Force)
- Unauthorized access
- Code injection (XSS / SQLi)
- Sensitive file access
- Denial of Service (DoS) attempts

## 🎯 Learning Objectives

1. Implement cybersecurity detection patterns in TypeScript
2. Analyze log files and network traffic for malicious activity
3. Design modular and extensible security systems
4. Generate comprehensive security reports
5. Apply whitelisting techniques to reduce false positives

## 🛠️ Technical Implementation

### Core Features

- **Real-time log analysis**
- **Custom rule-based detection** (using Regex patterns)
- **Whitelist management**
- **Comprehensive reporting** (JSON/CSV)
- **Network traffic simulation**

### Detection Capabilities

| Threat Type          | Detection Method                     | Severity Level |
|----------------------|--------------------------------------|----------------|
| Brute Force          | Failed login threshold               | High           |
| SQL Injection        | SQL keywords in input                | Medium         |
| XSS Attacks          | Script tags/javascript URIs          | Medium         |
| Sensitive File Access| Common sensitive file paths          | High           |
| DoS Attempts         | Flood patterns                       | High           |

## 📂 Project Structure

```
RIDS-PROJ1/
├── src/                   # Source cod
│   ├── config/            # Detectin rules
│   ├── core/              # Main IDS components
│   ├── data/              # Sample logs/whitelists
│   └── utils/             # Helper functions
├── tests/                 # Unit tests
├── package.json           # Projet dependencies
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- TypeScript 
- npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tsintruder.git
cd tsintruder
```

2. Install dependencies:
```bash
npm install
```

### Usage

**1. Analyze log files:**
```bash
npm start
```

**2. Run in development mode:**
```bash
npm run dev
```

**3. Execute tests:**
```bash
npm test
```

## 📊 Sample Output

```plaintext
[ALERT HIGH] BRUTEFORCE
Source: 192.168.1.15
Message: Multiple failed attempts (7) from 192.168.1.15
Timestamp: 2024-03-15T14:32:45.124Z

=== Security Report ===
Date: 2024-03-15 14:35:22
Total events detected: 3

Summary:
- bruteForce: 1 event(s)
- sqlInjection: 2 event(s)
```