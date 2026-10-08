"use client";
import { iconText } from "./StudioIcons";
import { useState } from "react";
const examples = [
    {
        label: "Service business",
        title: "Turn interest into appointments.",
        benefit: "Give every inquiry a clear next step.",
        steps: [
            { title: "Capture the inquiry", detail: "A website form collects the customer's contact details and what they need.", preview: "New customer inquiry", fields: ["Service: Initial consultation", "Preferred time: Next week", "Contact details: Collected"], action: "Ready for your team" },
            { title: "Notify your team", detail: "The right person receives the request, with the information needed to follow up.", preview: "Team notification", fields: ["Inquiry: Initial consultation", "Assigned to: Front desk", "Status: Awaiting follow-up"], action: "One place to track the request" },
            { title: "Offer a booking", detail: "An approved follow-up gives the customer a booking link and clear instructions.", preview: "Customer follow-up", fields: ["Thanks for getting in touch.", "Choose a time that works for you.", "Booking link: Included"], action: "A simple next step" },
            { title: "Send a reminder", detail: "Once booked, the customer receives appointment details and a scheduled reminder.", preview: "Appointment reminder", fields: ["Appointment: Confirmed", "Time and location: Included", "Reminder: Scheduled"], action: "Keep everyone informed" },
        ],
    },
    {
        label: "Sports organization",
        title: "One path from tryout to team.",
        benefit: "Keep coaches and families on the same page.",
        steps: [
            { title: "Register the athlete", detail: "Families submit athlete information through a simple registration form.", preview: "Tryout registration", fields: ["Athlete: Example player", "Age group: 15U", "Registration: Complete"], action: "Ready for check-in" },
            { title: "Record evaluations", detail: "Coaches record their assessments in one organized place.", preview: "Coach evaluation", fields: ["Position: Quarterback", "Coach notes: Recorded", "Review: Pending"], action: "Owner can review the assessment" },
            { title: "Approve the offer", detail: "The owner reviews the evaluation and decides whether to approve an offer.", preview: "Offer approval", fields: ["Evaluation: Reviewed", "Decision: Owner approved", "Family notification: Prepared"], action: "People stay in control" },
            { title: "Build the roster", detail: "An accepted offer moves the athlete into the team roster, with the family’s next steps clearly listed.", preview: "Team assignment", fields: ["Offer: Accepted", "Team: 15U", "Family next steps: Available"], action: "A clear start to the season" },
        ],
    },
    {
        label: "Business team",
        title: "Move requests forward.",
        benefit: "Give every task an owner and a status.",
        steps: [
            { title: "Collect the request", detail: "Employees submit the information needed through a standard request form.", preview: "New staff request", fields: ["Request: Equipment setup", "Department: Operations", "Details: Collected"], action: "Ready for review" },
            { title: "Route for approval", detail: "The request reaches the designated approver, who makes the decision.", preview: "Approval queue", fields: ["Approver: Department manager", "Request details: Available", "Status: Awaiting approval"], action: "Clear responsibility" },
            { title: "Assign the work", detail: "Approved requests become tasks for the appropriate team members.", preview: "Task assignment", fields: ["Approval: Complete", "Owner: IT team", "Checklist: Assigned"], action: "Everyone knows the next step" },
            { title: "Track completion", detail: "A shared dashboard shows progress and what still needs attention.", preview: "Progress dashboard", fields: ["Setup: Complete", "Handoff: Pending", "Status: In progress"], action: "Less chasing for updates" },
        ],
    },
];
export default function WorkflowDemo() {
    const [selected, setSelected] = useState(0);
    const [step, setStep] = useState(0);
    const example = examples[selected];
    const active = example.steps[step];
    return (<section className="automation-section upgraded-workflow">
      <div className="wrap split">
        <div className="workflow-intro">
          <p className="eyebrow">02 / LESS MANUAL WORK. MORE MOMENTUM.</p>
          <h2>Your next move.<br /><span>Already connected.</span></h2>
          <p className="section-copy">
            See how we could connect the steps you handle every day.
            Choose your organization, then explore the process.
          </p>
          <div className="workflow-tabs" role="group" aria-label="Choose your organization">
            
          </div>
          <div className="workflow-benefit">
            <span aria-hidden="true">{iconText("\u2197")}</span>
            <p></p>
          </div>
          <a className="workflow-contact-link" href="#contact">{iconText(" Let\u2019s simplify your process \u2197 ")}</a>
        </div>

        <div className="workflow-panel enhanced-panel">
          <div className="panel-top">
            <span><span className="status-dot"/>INTERACTIVE EXAMPLE</span>
            <span>0</span>
          </div>
          <h3></h3>
          <p className="demo-note">Illustrative demo · Built around your actual tools and approvals.</p>

          <div className="workflow-progress" aria-hidden="true">
            <span style={{ width: `${(step + 1) * 25}%` }}/>
          </div>

          <div className="workflow-step-picker" role="group" aria-label="Explore workflow steps">
            
          </div>

          <div className="workflow-preview" aria-live="polite">
            <div className="preview-heading">
              <span className="preview-icon" aria-hidden="true">{iconText("\u2197")}</span>
              <div>
                <p>STEP 0</p>
                <h4></h4>
              </div>
            </div>
            <div className="preview-fields">
              
            </div>
            <div className="preview-result">
              <span className="status-dot"/>
            </div>
          </div>

          <p className="workflow-explanation"></p>
          <div className="panel-bottom">
            <span>Step  of 4</span>
            <button className="button secondary" onClick={() => setStep((step + 1) % 4)}>
              {iconText(" \u2192 ")}</button>
          </div>
        </div>
      </div>
    </section>);
}
