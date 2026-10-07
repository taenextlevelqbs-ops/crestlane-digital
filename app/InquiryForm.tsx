"use client";

export default function InquiryForm() {
  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = [
          "Name: " + data.get("name"),
          "Email: " + data.get("email"),
          "Organization: " + data.get("organization"),
          "Service: " + data.get("service"),
          "",
          String(data.get("details")),
        ].join("\n");

        window.location.href =
          "mailto:sales@crestlanedigital.com?subject=" +
          encodeURIComponent("Crestlane project inquiry") +
          "&body=" + encodeURIComponent(body);
      }}
    >
      <label>Your name
        <input name="name" autoComplete="name" required maxLength={120} />
      </label>
      <label>Email address
        <input name="email" type="email" autoComplete="email" required maxLength={254} />
      </label>
      <label>Business or organization
        <input name="organization" autoComplete="organization" maxLength={160} />
      </label>
      <label>What can we help with?
        <select name="service">
          <option>Website or web application</option>
          <option>Custom software or portal</option>
          <option>Automation or AI</option>
          <option>Ongoing support</option>
          <option>I’d like help figuring it out</option>
        </select>
      </label>
      <label className="full">Tell us about your project
        <textarea name="details" rows={4} required maxLength={2000} />
      </label>
      <div className="full">
        <button className="button primary" type="submit">
          Prepare project email ↗
        </button>
        <p className="form-note">
          Opens your email app. Review and send your inquiry.
        </p>
        <a className="email-link" href="mailto:sales@crestlanedigital.com">
          sales@crestlanedigital.com
        </a>
      </div>
    </form>
  );
}
