# Public repository security & portfolio checklist

Before promoting any repository in a resume or on a business website:

- [ ] Verify `.env`, `.env.local`, API keys, private keys, JWT secrets, webhook secrets and credentials are absent from code **and git history**.
- [ ] Verify no live athlete, family, patient, donor, payment, staff or client personal data is committed.
- [ ] Audit logs, example payloads, test fixtures, screenshots, backups, exports and generated build artifacts.
- [ ] Ensure admin URLs, access-control assumptions and operational runbooks do not disclose sensitive environments.
- [ ] Confirm README feature claims are consistent with deployed and tested functionality.
- [ ] Confirm dependencies and CI checks run and branch protection is appropriate.
- [ ] Set repository descriptions and pin only reviewed, polished public projects.
- [ ] If a secret is found, revoke/rotate it immediately; deleting a file does not erase git history.

Never publish employer-specific configurations, internal hostnames, security documents or government-work artifacts.

This checklist is preparatory; it is **not evidence** that a complete security audit has passed.
