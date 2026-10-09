"use client";
import { iconText } from "./StudioIcons";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { serviceOptions, validateInquiry, type ContactField, type FieldErrors } from "../lib/contact-fields";
export default function InquiryForm() {
    const [state, setState] = useState<"idle" | "sending" | "accepted" | "error">("idle");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [contact, setContact] = useState("Email");
    const sending = useRef(false);
    const feedback = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      if ((state === "accepted" || state === "error") && !Object.keys(errors).length) feedback.current?.focus();
    }, [state, errors]);

    function focusField(form: HTMLFormElement, fields: FieldErrors) {
      const key = Object.keys(fields)[0];
      const item = form.elements.namedItem(key);
      const control = item instanceof HTMLElement ? item : form.querySelector<HTMLElement>(`[name="${key}"]`);
      const details = control?.closest("details");
      if (details) details.open = true;
      if (typeof control?.focus === "function") control.focus();
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (sending.current) return;
      const form = event.currentTarget;
      const data = new FormData(form);
      const input = { ...Object.fromEntries(data), interests: data.getAll("interests") };
      const validated = validateInquiry(input);
      setErrors(validated.errors);
      if (!validated.inquiry) {
        setState("error");
        setMessage("Please check the highlighted fields.");
        focusField(form, validated.errors);
        return;
      }
      sending.current = true;
      setState("sending");
      setMessage("Sending your inquiry…");
      try {
        const response = await fetch("/api/contact", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validated.inquiry), signal: AbortSignal.timeout(15_000),
        });
        const result = await response.json();
        if (response.status === 202 && result.status === "accepted" && typeof result.reference === "string") {
          setState("accepted");
          setMessage(`${result.message} Reference: ${result.reference}`);
        } else {
          setState("error");
          setMessage(result.message || "We could not confirm acceptance. Please contact us directly.");
          if (result.errors) { setErrors(result.errors); focusField(form, result.errors); }
        }
      } catch {
        setState("error");
        setMessage("We could not confirm whether your inquiry was accepted. Please contact us directly before resubmitting. Your details are still in the form.");
      } finally {
        sending.current = false;
      }
    }
    function fieldProps(name: ContactField) {
      return { "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `error-${name}` : undefined };
    }
    function fieldError(name: ContactField) {
      return errors[name] ? <span className="field-error" id={`error-${name}`}>{errors[name]}</span> : null;
    }
    return (<form className="contact-form" onSubmit={handleSubmit} noValidate aria-busy={state === "sending"}>
      <fieldset className="inquiry-fields full" disabled={state === "sending" || state === "accepted"}>
      <legend className="sr-only">Project inquiry</legend>
      <div className="full inquiry-intro">
        <h3>Tell us about your project.</h3>
        <p>A few details help us understand your needs. Only your name, email, and project description are required.</p>
      </div>

      <label>Your name *
        <input name="name" {...fieldProps("name")} autoComplete="name" required maxLength={100}/>
      {fieldError("name")}
      </label>
      <label>Email address *
        <input name="email" {...fieldProps("email")} type="email" autoComplete="email" required maxLength={254}/>
      {fieldError("email")}
      </label>
      <label>Phone number
        <input name="phone" {...fieldProps("phone")} required={contact !== "Email"} type="tel" autoComplete="tel" maxLength={40}/>
      {fieldError("phone")}
      </label>
      <label>Business or organization
        <input name="organization" {...fieldProps("organization")} autoComplete="organization" maxLength={160}/>
      {fieldError("organization")}
      </label>
      <label>Organization type
        <select name="type" {...fieldProps("type")} defaultValue="">
          <option value="">Select an option</option>
          <option>Local or service business</option>
          <option>Sports team or organization</option>
          <option>Training or coaching business</option>
          <option>Professional services or company</option>
          <option>Nonprofit or community organization</option>
          <option>Online store</option>
          <option>Other / new idea</option>
        </select>
      {fieldError("type")}
      </label>
      <label>Existing website
        <input name="website" {...fieldProps("website")} placeholder="yourbusiness.com" maxLength={300}/>
      {fieldError("website")}
      </label>

      <label className="full">What would you like to accomplish? *
        <textarea name="details" {...fieldProps("details")} rows={4} required maxLength={1800} placeholder="Tell us about your idea, who will use it, and what a successful result looks like."/>
      {fieldError("details")}
      </label>
      <details className="full studio-inquiry-details">
        <summary>Add project specifics <span>Optional: services, budget, timeline, and features</span></summary>
        <div className="studio-inquiry-grid">
          <fieldset className="full inquiry-interests">
        <legend>What can we help with? Select all that apply.</legend>
        <div className="interest-options">
          {serviceOptions.map((service) => <label key={service}>
            <input type="checkbox" name="interests" value={service} />{service}
          </label>)}
        </div>
        {errors.interests && <p className="field-error">{errors.interests}</p>}
      </fieldset>

      <label>Where are you starting?
        <select name="stage" {...fieldProps("stage")} defaultValue="Exploring an idea">
          <option>Exploring an idea</option>
          <option>Starting from scratch</option>
          <option>Improving an existing website or system</option>
          <option>Replacing an existing website or system</option>
          <option>Need help with an issue</option>
        </select>
      {fieldError("stage")}
      </label>
      <label>Estimated project budget
        <select name="budget" {...fieldProps("budget")} defaultValue="Help me estimate">
          <option>Help me estimate</option>
          <option>Under $1,500</option>
          <option>$1,500–$3,000</option>
          <option>$3,000–$6,000</option>
          <option>$6,000–$10,000</option>
          <option>$10,000+</option>
          <option>Looking for ongoing monthly support</option>
        </select>
      {fieldError("budget")}
      </label>
      <label>Preferred timeline
        <select name="timeline" {...fieldProps("timeline")} defaultValue="Flexible / exploring">
          <option>Flexible / exploring</option>
          <option>As soon as possible</option>
          <option>Within 1 month</option>
          <option>Within 1–3 months</option>
          <option>Within 3–6 months</option>
        </select>
      {fieldError("timeline")}
      </label>
      <label>Preferred contact method
        <select name="contact" {...fieldProps("contact")} value={contact} onChange={(event) => setContact(event.target.value)}>
          <option>Email</option>
          <option>Phone call</option>
          <option>Text message</option>
        </select>
      {fieldError("contact")}
      </label>

      
      <label className="full">What is slowing you down today?
        <textarea name="challenges" {...fieldProps("challenges")} rows={3} maxLength={900} placeholder="Examples: missed inquiries, manual registration, scattered spreadsheets, an outdated website, or access concerns."/>
      {fieldError("challenges")}
      </label>
      <label className="full">Features or tools you have in mind
        <textarea name="features" {...fieldProps("features")} rows={3} maxLength={900} placeholder="Examples: booking, payments, parent portal, staff dashboard, automated reminders—or tools you already use."/>
      {fieldError("features")}
      </label>

      
        </div>
      </details>
      <label className="contact-trap" aria-hidden="true">Leave this field empty
        <input name="companyFax" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="full">
        <button className="button primary" type="submit" disabled={state === "sending" || state === "accepted"}>
          {state === "sending" ? <><span className="sending-indicator" aria-hidden="true" />Sending…</> : state === "accepted" ? "Accepted for sending" : iconText("Send project inquiry ↗")}
        </button>
        <p className="form-note">
          We use these details to respond to your project inquiry. Please leave out passwords,
          payment card details, and sensitive personal information.
        </p>
      </div>
      </fieldset>
      <div className="full">
        <p ref={feedback} tabIndex={-1} className={`form-feedback ${state}`} role="status" aria-live="polite" aria-atomic="true">{message}</p>
      </div>
    </form>);
}
