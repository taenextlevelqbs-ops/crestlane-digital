"use client";

import { useState } from "react";
import { Arrow } from "./StudioIcons";

const examples = [
  {
    name: "Service business",
    title: "From first inquiry to booked work.",
    benefit: "Keep every lead moving, with fewer manual follow-ups.",
    steps: [
      {
        name: "Capture",
        title: "A new customer reaches out.",
        fields: ["Request: Website redesign", "Source: Website inquiry form", "Contact preference: Email"],
        result: "Collect the information your team needs in one consistent format.",
      },
      {
        name: "Organize",
        title: "Give the request a clear home.",
        fields: ["Pipeline: New inquiry", "Assigned to: Project contact", "Next action: Review project needs"],
        result: "Route the inquiry to the right person and keep its status visible.",
      },
      {
        name: "Follow up",
        title: "Make the next step easy.",
        fields: ["Action: Prepare a consultation invitation", "Calendar: Show available times", "Reminder: Follow up if no reply"],
        result: "Connect email and scheduling tools around an agreed follow-up process.",
      },
      {
        name: "Move forward",
        title: "Turn the conversation into a project.",
        fields: ["Scope: Confirm deliverables", "Proposal: Ready for review", "Status: Awaiting customer approval"],
        result: "Keep the scope, decisions, and next actions connected as work progresses.",
      },
    ],
  },
  {
    name: "Sports organization",
    title: "From registration to a ready roster.",
    benefit: "Give coaches and families a clearer path through your season.",
    steps: [
      {
        name: "Register",
        title: "An athlete signs up.",
        fields: ["Program: Youth tryouts", "Athlete information: Collected", "Parent contact: Included"],
        result: "Replace scattered messages with a structured registration process.",
      },
      {
        name: "Evaluate",
        title: "Coaches work from one list.",
        fields: ["Check-in: Complete", "Evaluation: Ready for coach notes", "Access: Authorized staff"],
        result: "Keep check-in, evaluations, and athlete status together.",
      },
      {
        name: "Offer",
        title: "Make the next decision clear.",
        fields: ["Decision: Offer prepared", "Team: Selected by staff", "Parent communication: Ready for review"],
        result: "Support staff decisions with organized offers and clear family communication.",
      },
      {
        name: "Manage",
        title: "Bring the season into focus.",
        fields: ["Roster: Assigned athletes", "Payments: Track balances", "Schedule: Share program information"],
        result: "Connect roster information, payment tracking, and season updates.",
      },
    ],
  },
  {
    name: "Business team",
    title: "From incoming request to completed work.",
    benefit: "Make responsibilities and progress easier to see.",
    steps: [
      {
        name: "Receive",
        title: "A request enters the system.",
        fields: ["Request: New employee setup", "Department: Operations", "Needed by: Requested start date"],
        result: "Give staff one place to submit requests with the right details.",
      },
      {
        name: "Assign",
        title: "The right people see the work.",
        fields: ["Owner: Responsible team member", "Checklist: Required setup tasks", "Priority: Based on agreed rules"],
        result: "Route work by responsibility instead of relying on forwarded messages.",
      },
      {
        name: "Approve",
        title: "Keep decisions in the process.",
        fields: ["Approval: Manager review", "Access: Based on role", "Status: Waiting for a decision"],
        result: "Keep approval steps visible and preserve human review where it matters.",
      },
      {
        name: "Complete",
        title: "Close the loop with confidence.",
        fields: ["Checklist: Completed tasks", "Notification: Requester updated", "Reporting: Progress available"],
        result: "Give your team a clear record of what happened and what still needs attention.",
      },
    ],
  },
];

export default function WorkflowDemo() {
  const [organization, setOrganization] = useState(0);
  const [step, setStep] = useState(0);
  const current = examples[organization];
  const preview = current.steps[step];

  return (
    <section className="automation-section connected-demo">
      <div className="wrap">
        <div className="connected-heading">
          <div>
            <p className="eyebrow">02 / SEE HOW IT COULD WORK</p>
            <h2>Your everyday work.<br /><span>Connected, step by step.</span></h2>
          </div>
          <p>Explore a practical example. Choose your organization, then follow the process from start to finish.</p>
        </div>

        <div className="connected-layout">
          <div className="connected-overview">
            <p className="connected-label">CHOOSE YOUR ORGANIZATION</p>
            <div className="connected-types" aria-label="Organization examples">
              {examples.map((example, index) => (
                <button type="button" key={example.name}
                  aria-pressed={organization === index}
                  aria-controls="connected-preview"
                  onClick={() => { setOrganization(index); setStep(0); }}>
                  {example.name}
                  <Arrow direction="right" />
                </button>
              ))}
            </div>
            <div className="connected-benefit">
              <span>THE OPPORTUNITY</span>
              <p>{current.benefit}</p>
            </div>
            <a className="connected-contact" href="#contact">
              Talk about your process <Arrow />
            </a>
          </div>

          <div className="connected-panel">
            <div className="connected-panel-top">
              <span><i aria-hidden="true" />INTERACTIVE EXAMPLE</span>
              <span>0{organization + 1} / 03</span>
            </div>
            <h3>{current.title}</h3>

            <div className="connected-steps" aria-label="Explore workflow steps">
              {current.steps.map((item, index) => (
                <button type="button" key={item.name}
                  aria-pressed={step === index}
                  aria-controls="connected-preview"
                  onClick={() => setStep(index)}>
                  <span>{index + 1}</span>
                  {item.name}
                </button>
              ))}
            </div>

            <div className="connected-preview" id="connected-preview"
              aria-live="polite" aria-atomic="true">
              <p className="connected-label">STEP {step + 1} / {preview.name.toUpperCase()}</p>
              <h4>{preview.title}</h4>
              <ul>
                {preview.fields.map((field) => (
                  <li key={field}><span aria-hidden="true" />{field}</li>
                ))}
              </ul>
              <div className="connected-result">
                <span>WHAT THIS ENABLES</span>
                <p>{preview.result}</p>
              </div>
            </div>

            <div className="connected-bottom">
              <span>Step {step + 1} of {current.steps.length}</span>
              <button type="button" onClick={() => setStep((step + 1) % current.steps.length)}>
                {step === current.steps.length - 1 ? "Start again" : "Next step"}
                <Arrow direction="right" />
              </button>
            </div>
            <p className="connected-note">
              Illustrative examples—not live submissions. Your implementation is scoped around your tools, access requirements, and approval process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
