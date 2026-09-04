const IT_TIPS = [
  "Before escalating a ticket, check if the issue is affecting one user or many — it changes whether you're troubleshooting a device or a service.",
  "When a user says 'the internet is down,' always confirm: is it just one site, one app, or everything? The answer changes your entire diagnosis path.",
  "Reboot fixes a surprising number of issues because it clears memory leaks and resets network stack state — but always ask what the user was doing first, in case a reboot destroys evidence you need.",
  "Keep a personal 'runbook' of the fixes you repeat most often. Future-you (and your team) will thank you.",
  "When enrolling new devices via MDM, always test the enrollment profile on one machine before pushing it fleet-wide.",
  "A password reset doesn't always fix an account lockout — check for cached credentials on other devices still trying the old password.",
  "DNS propagation delays are one of the most common causes of 'it doesn't work yet' after a domain change. Set expectations with users up front.",
  "Document the exact error message, not just a paraphrase — 'access denied' and 'this app can't open' point to very different root causes.",
  "When BitLocker or FileVault locks a user out, always confirm you have the recovery key backed up in your MDM/directory before you need it in a panic.",
  "Ping and traceroute are still two of the fastest ways to tell 'is it the network or is it the app.'",
  "If SentinelOne or another EDR keeps flagging the same machine, check for shared local admin credentials before assuming malware.",
  "A five-minute knowledge-base article today can save you from answering the same ticket fifty times this year.",
  "When users report 'slow computer,' check startup programs and disk space before assuming it's a hardware problem.",
  "Always verify MFA enrollment status before a mandatory cutover — a single unenrolled department can generate a flood of lockout tickets.",
  "Group Policy changes can take up to 90 minutes to apply automatically — running gpupdate /force saves everyone the wait.",
  "When troubleshooting printers, 90% of issues are the driver or the spooler, not the printer itself.",
  "SPF, DKIM, and DMARC records work together — changing one without checking the others is a common cause of mail suddenly going to spam.",
  "Keep a change log for DNS records. A cleanup that looks 'unused' today might be someone's mail authentication from six months ago.",
  "Local admin rights left over from imaging are one of the most overlooked security gaps in a fleet — audit them regularly.",
  "When a user can't connect to VPN, check the time on their machine first — clock drift breaks certificate-based authentication silently.",
  "A shared inbox for support tickets is only as good as the tagging discipline behind it — invest in categorization early.",
  "Zero-touch deployment isn't just convenience — it's also a security control, since it guarantees every device starts from the same known-good baseline.",
  "When in doubt about a suspicious email, check the sender's actual domain, not just the display name.",
  "Keep test accounts with different permission levels — it's the fastest way to reproduce a 'works for me' access issue.",
  "SLA breaches are usually a communication problem, not a technical one — a quick status update buys far more goodwill than silence.",
  "When migrating users between M365 tenants, always check calendar and shared mailbox permissions — they're the most commonly forgotten items.",
  "A restart of the print spooler service fixes more printer queues than reinstalling a driver ever will.",
  "Before wiping a device for reissue, confirm the outgoing user's data has actually synced to the cloud — 'it should have' is not confirmation.",
  "When investigating a mystery reboot, check Windows Event Viewer's System log for Event ID 41 (unexpected shutdown) or 1074 (planned).",
  "A VPN that 'used to work' after a network change often comes down to a changed default gateway or DNS suffix, not the VPN client itself.",
  "Cable and dock issues masquerade as 'random disconnects' far more often than people expect — always test with a known-good cable first.",
  "When a user's mailbox is 'missing' emails, check mail flow rules and Focused Inbox settings before assuming deletion or migration failure.",
  "Keep a personal glossary of acronyms your organization uses — new hires (and you, six months from now) will need it.",
  "A slow login on a domain-joined machine is often a DNS or domain controller reachability issue, not a 'slow computer.'",
  "When troubleshooting Wi-Fi drops, check for channel overlap with neighboring networks before assuming a hardware fault.",
  "Screen-share etiquette matters: always ask before taking control of someone's cursor, even if you have remote tools enabled.",
  "A ticket closed without a root cause note is a ticket that will reopen with a different description in three weeks.",
  "When escalating, include what you've already tried — it saves the next tier from repeating your steps.",
  "Firmware updates on network gear should always happen in a maintenance window, never mid-day 'just to get it done.'",
  "Keep your own documentation of non-standard configurations — 'tribal knowledge' that only lives in one person's head is a business risk.",
];

function renderTipOfDay(elId, dateElId){
  const el = document.getElementById(elId);
  const dateEl = document.getElementById(dateElId);
  if (!el) return;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const tip = IT_TIPS[dayOfYear % IT_TIPS.length];
  el.textContent = tip;
  if (dateEl){
    dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }
}
