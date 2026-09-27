# Ltopic analytics — owner-controlled rollout

Status: prepared, not connected. No successful production form receipt, vendor event receipt or private dashboard verification yet.
Owner: the Ltopic operator. All provider assets must be created while signed into the owner's account. Never use an agent-owned account. No passwords, API secrets or private mailbox links belong in this repository.

## Required account steps
- Google: sign in as owner; check existing properties before creating any. GA4 standard property, Europe/Paris timezone, EUR. Turn off Google Signals, advertising personalisation, optional data sharing and enhanced measurement (manual events prevent duplicate form and page events). Set event-level retention to 2 months initially. Register page_name, site_language, cta_id, placement and form_id as event-scoped custom dimensions. Mark only generate_lead as the primary key event, once per event. Exclude developer tests before launch.
- Search Console: owner-managed domain property via DNS TXT; add only Google's supplied TXT record without replacing existing DNS records. No DNS credentials in the repository. Submit /sitemap.xml. Review canonical URLs and indexing after processing. Domain verification is still pending.
- Clarity: owner-managed project, require consent, strict masking, no advertising integration. Code excludes Contact and URLs with queries/fragments. Review privacy terms, roles and transfer safeguards before enabling.
- FormSubmit: owner must validate the destination using the activation email. Use only the opaque public endpoint in integrations-config.js. Review processor terms and safeguards; do not assert blanket GDPR compliance from the banner alone. If the service cannot meet the operator's requirements, select a suitable alternative before handling real enquiries. Test actual delivery including spam folder. A success response proves service acceptance, not mailbox delivery.
- Looker Studio: create a private report owned by the user, using native GA4 and Search Console connectors. Sharing restricted to owner initially. No public embed on ltopic.ai. Add a direct link to the owner's Clarity project, without tokens in links.

## Dashboard layout
Mobile-first summary (single column), then Acquisition, Pages and commercial funnel, Google Search. Date filter: last 28 days with previous-period comparison. Country and device filters. Metrics: users, sessions, services views, contact clicks, form views, starts, attempts, accepted submissions, session key-event rate. Do not divide raw event count by visitors and call it a conversion rate. Keep unique sessions/users at each funnel step. Search: impressions, clicks, CTR, position and queries from Search Console; do not add its clicks to GA4 sessions. Optional owner-maintained Google Sheet with aggregate monthly qualified leads, appointments and signed missions, no names or contact details. Link to provider export screens for independence. Native connectors have quotas and processing delays.

## Consent and minimisation
Basic consent mode: vendor scripts are not requested before the respective choice. Refusal does not affect form submission. Choice lasts 180 days and is versioned. GA4 ad consent is always denied. No typed field content, identity, full referrer URL, arbitrary event parameters or raw destination links are sent by custom tracking. GA4 page_location is canonicalised; campaign tracking needs a reviewed allowlist before enabling. Clarity is skipped on Contact and query/fragment URLs. Revoking a loaded recorder reloads non-contact pages to stop recording entirely. Google disable flag blocks events after withdrawal. Browser restrictions may limit local persistence or measurement; this is not an error in the commercial form.

## Live acceptance gates — all pending
1. Owner roles verified for GA4, Search Console, Clarity, Looker and form destination.
2. Form: no consent, GA-only consent and full consent; one synthetic enquiry each, actual mailbox receipt confirmed, no duplicates, human reply-to verified.
3. Failure paths: rejected request, network interruption and timeout. Keep text, display an honest error, no success event. No automatic retry because a timeout can hide an accepted delivery.
4. GA4 DebugView / realtime: page and click events, one generate_lead per accepted submission, no form contents or unintended query strings. Disable automatic measurement in provider settings before enabling this code.
5. Initial refusal: no Google/Clarity request and no analytics cookies. Partial consent loads only the chosen provider. Withdrawal blocks further tracking. Check multiple tabs and reload.
6. Desktop and narrow mobile view: consent banner, preference dialog, keyboard navigation, form, menu and swipe navigation.
7. Looker report displays real GA4 and Search Console data once available, readable on mobile, private access and exports tested. No fabricated seed statistics.

The privacy page is a draft with planned services and pending safeguards. Finalise wording, contact route for rights and provider settings before publishing it or activating collection.
