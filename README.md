# devopscase-case-study-ca2

Small Node.js (Express) service used for the CA-II DevOps practical: CI/CD with GitHub Actions,
Ansible host setup, Docker + Kubernetes, and Prometheus + Grafana monitoring.

| Path | Purpose |
|---|---|
| `app.js`, `server.js`, `test/` | The service and its unit tests |
| `Dockerfile` | Multi-stage, non-root image |
| `.github/workflows/ci-cd.yml` | Task 1: test, build and push, deploy to Kubernetes (kind) |
| `ansible/` | Task 2: playbook, inventory, template |
| `k8s/` | Task 3: Deployment and Service |
| `monitoring/` | Task 4: Prometheus, Grafana (provisioned dashboard), traffic generator |
| `docs/pipeline.png` | Pipeline diagram |

## Endpoints
`/` (service + version), `/healthz`, `/attendance`, `/fail` (always HTTP 500, for the error-rate panel), `/metrics`.

## Quick start
```bash
npm install
npm test
npm start          # http://localhost:3000
```
See the Word report for the step-by-step commands for every task.
