# Azure Landing Zone — Personal Lab Plan

**Status: Design plan only. Not a deployed environment.**

## Objective
Demonstrate safe Microsoft Azure administration, resource governance, basic network controls, access management, logging, and infrastructure-as-code in a personal lab subscription.

## Proposed architecture
- Separate personal lab subscription/resource group with budget alerts and cost controls.
- Resource naming conventions, location and tagging policy.
- Least-privilege Azure RBAC role assignments and Entra ID MFA.
- Virtual network, subnet segmentation and tightly scoped NSG rules.
- Diagnostic settings to a centralized Log Analytics workspace.
- Azure Policy assignments with documented evaluation results.
- IaC module examples using Terraform or Bicep.
- A cleanup procedure that removes chargeable resources.

## Validation checklist
- [ ] Create personal subscription budget and alerts before provisioning.
- [ ] Deploy synthetic resources from version-controlled IaC.
- [ ] Check RBAC roles and authentication settings.
- [ ] Validate NSG restrictions with a nonproduction test client.
- [ ] Confirm diagnostic records arrive in the workspace.
- [ ] Capture sanitized, non-secret deployment output.
- [ ] Tear down resources and verify costs.

## Planned evidence
Architecture diagram, sanitized IaC samples, command output with fictional resource names, and short notes explaining security decisions.

Never include employer subscriptions, tenant IDs, operational IPs, private hostnames, client data, access tokens or other secrets.
