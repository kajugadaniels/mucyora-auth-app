# Backend Contract Alignment

The frontend contract was reconciled directly with the `api/auth` DTOs and
controllers.

- Registration uses `registrationChallengeToken`, email, Rwandan phone,
  password, and exactly four versioned consents.
- Email verification consumes an opaque link token, not a numeric OTP.
- Browser sessions use `transport=COOKIE`; access tokens remain memory-only.
- Identity enrolment exchanges a single-use transition token for a `LIMITED`
  session.
- Document capture and liveness accept provider-created live sessions only.
- Successful account enrolment returns a login redirect containing a fragment
  completion reference; consumption never logs the user in.
- Session, passkey, recovery-code, and step-up operations require their
  documented bearer level.

The same-origin mappings are maintained in [auth-endpoint-proxy.md](auth-endpoint-proxy.md).
