"use client";

import { useState, type FormEvent } from "react";

export default function InquiryForm() {
  const [prepared, setPrepared] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || "").trim();
    const selected = data.getAll("interests").map(String).join(", ");
    const lines = [
      "New Crestlane project inquiry",
      "",
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      `Phone: ${value("phone") || "Not provided"}`,
      `Business or organization: ${value("organization") || "Not provided"}`,
      `Organization type: ${value("type") || "Not specified"}`,
      `Existing website: ${value("website") || "Not provided"}`,
      `Services: ${selected || "Help figuring it out"}`,
      `Project stage: ${value("stage")}`,
      `Budget range: ${value("budget")}`,
      `Timeline: ${value("timeline")}`,
      `Preferred contact: ${value("contact")}`,
      "",
      "Goals and project details:",
      value("details"),
      "",
      "Current challenges:",
      value("challenges") || "Not provided",
      "",
      "Features and tools:",
      value("features") || "Not provided",
    ];
    const subject = `Project inquiry — ${value("organization") || value("name")}`;
    window.location.href =
      `mailto:sales@crestlanedigital.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setPrepared(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="full inquiry-intro">
        <h3>Tell us about your project.</h3>
        <p>A few details help us understand your needs. Only your name, email, and project description are required.</p>
      </div>

      <label>Your name *
        <input name="name" autoComplete="name" required maxLength={100} />
      </label>
      <label>Email address *
        <input name="email" type="email" autoComplete="email" required maxLength={254} />
      </label>
      <label>Phone number
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </label>
      <label>Business or organization
        <input name="organization" autoComplete="organization" maxLength={160} />
      </label>
      <label>Organization type
        <select name="type" defaultValue="">
          <option value="">Select an option</option>
          <option>Local or service business</option>
          <option>Sports team or organization</option>
          <option>Training or coaching business</option>
          <option>Professional services or company</option>
          <option>Nonprofit or community organization</option>
          <option>Online store</option>
          <option>Other / new idea</option>
        </select>
      </label>
      <label>Existing website
        <input name="website" placeholder="yourbusiness.com" maxLength={300} />
      </label>

      <fieldset className="full inquiry-interests">
        <legend>What can we help with? Select all that apply.</legend>
        <div className="interest-options">
          {[
            "Website or redesign",
            "Online store or booking",
            "Custom software or portal",
            "Sports organization tools",
            "Automation or AI",
            "Website security",
            "Ongoing support",
            "Help figuring it out",
          ].map((item) => (
            <label key={item}>
              <input type="checkbox" name="interests" value={item} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>Where are you starting?
        <select name="stage" defaultValue="Exploring an idea">
          <option>Exploring an idea</option>
          <option>Starting from scratch</option>
          <option>Improving an existing website or system</option>
          <option>Replacing an existing website or system</option>
          <option>Need help with an issue</option>
        </select>
      </label>
      <label>Estimated project budget
        <select name="budget" defaultValue="Help me estimate">
          <option>Help me estimate</option>
          <option>Under $1,500</option>
          <option>$1,500–$3,000</option>
          <option>$3,000–$6,000</option>
          <option>$6,000–$10,000</option>
          <option>$10,000+</option>
          <option>Looking for ongoing monthly support</option>
        </select>
      </label>
      <label>Preferred timeline
        <select name="timeline" defaultValue="Flexible / exploring">
          <option>Flexible / exploring</option>
          <option>As soon as possible</option>
          <option>Within 1 month</option>
          <option>Within 1–3 months</option>
          <option>Within 3–6 months</option>
        </select>
      </label>
      <label>Preferred contact method
        <select name="contact" defaultValue="Email">
          <option>Email</option>
          <option>Phone call</option>
          <option>Text message</option>
        </select>
      </label>

      <label className="full">What would you like to accomplish? *
        <textarea name="details" rows={4} required maxLength={1800}
          placeholder="Tell us about your idea, who will use it, and what a successful result looks like." />
      </label>
      <label className="full">What is slowing you down today?
        <textarea name="challenges" rows={3} maxLength={900}
          placeholder="Examples: missed inquiries, manual registration, scattered spreadsheets, an outdated website, or access concerns." />
      </label>
      <label className="full">Features or tools you have in mind
        <textarea name="features" rows={3} maxLength={900}
          placeholder="Examples: booking, payments, parent portal, staff dashboard, automated reminders—or tools you already use." />
      </label>

      <div className="full">
        <button className="button primary" type="submit">
          Prepare project email ↗
        </button>
        <p className="form-note">
          Opens your email app with your project details. Review the draft and send it to complete your inquiry.
          Please leave out passwords, payment card details, and sensitive personal information.
        </p>
        <p className="form-note" role="status">
          {prepared ? "Email draft requested. Your inquiry reaches us after you send it. If your email app did not open, call or email us directly below." : ""}
        </p>
        <div className="direct-contact">
          <a href="mailto:sales@crestlanedigital.com">Email us directly ↗</a>
          <a href="tel:+17034314468">(703) 431-4468 ↗</a>
        </div>
      </div>
    </form>
  );
}
