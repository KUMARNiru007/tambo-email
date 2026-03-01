/**
 * Seed script: Populate Supabase with realistic demo emails for video recording.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-emails.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * You must be logged in (the script uses a service-role or you can run the
 * receiveEmail server action from the chat instead — see instructions below).
 */

const DEMO_EMAILS = [
  {
    from: "sarah.chen@techstartup.io",
    subject: "Partnership proposal — AI integration",
    body: `Hi Kumar,

I'm the CTO at TechStartup and we've been following your work on Tambo Email. We'd love to explore a partnership to integrate your AI email assistant into our platform.

Could we schedule a call this week? We're on a tight deadline — our board meeting is Friday and I'd like to present this opportunity.

Best,
Sarah Chen`,
  },
  {
    from: "michael.ross@investor.vc",
    subject: "Re: Seed round follow-up",
    body: `Kumar,

Thanks for the pitch last Tuesday. The partners were impressed with the demo. We have a few follow-up questions:

1. What's your current MRR?
2. Can you share your product roadmap for Q2?
3. We'd need a technical architecture overview.

We're looking to close our decision by end of this week. Please send these over ASAP.

Regards,
Michael Ross
Partner, Investor VC`,
  },
  {
    from: "hiring@bigcorp.com",
    subject: "Interview confirmation — Senior Engineer role",
    body: `Dear Kumar,

This is to confirm your final round interview for the Senior Engineer position at BigCorp, scheduled for tomorrow at 2:00 PM EST.

Please confirm your attendance by replying to this email. The panel will include our VP of Engineering and the team lead.

Looking forward to meeting you.

HR Team, BigCorp`,
  },
  {
    from: "alex.rivera@freelance.dev",
    subject: "Invoice #1087 — overdue payment",
    body: `Hey Kumar,

Just a friendly reminder that Invoice #1087 for the UI design work ($2,400) is now 15 days overdue. I've attached the invoice again for reference.

Could you process this at your earliest convenience? I really enjoyed working on the project and hope we can collaborate again soon.

Thanks,
Alex Rivera`,
  },
  {
    from: "newsletter@producthunt.com",
    subject: "Your Product Hunt launch is trending! 🚀",
    body: `Congrats! Your product "Tambo Email" is currently #3 on Product Hunt today with 187 upvotes.

Here's a quick summary:
- 187 upvotes (and climbing)
- 42 comments
- 1,200 unique visitors to your product page

Keep sharing to maintain momentum! The top 5 products get featured in our weekly newsletter to 500k+ subscribers.

— The Product Hunt Team`,
  },
];

console.log("=== Demo Email Seed Data ===\n");
console.log("To seed your inbox, go to your app's chat and paste these commands one by one:\n");

DEMO_EMAILS.forEach((email, i) => {
  console.log(`--- Email ${i + 1} ---`);
  console.log(`Ask the AI: "Simulate receiving an email from ${email.from} with subject '${email.subject}' and body: ${email.body.replace(/\n/g, " ")}"\n`);
});

console.log("\nOr use this single prompt:\n");
console.log(`"Simulate receiving these 5 emails for my inbox demo:

1. From: sarah.chen@techstartup.io — Subject: 'Partnership proposal — AI integration' — Body: Partnership request with Friday board meeting deadline, wants to schedule a call this week.

2. From: michael.ross@investor.vc — Subject: 'Re: Seed round follow-up' — Body: Investor follow-up after pitch, needs MRR, product roadmap, and tech architecture by end of week.

3. From: hiring@bigcorp.com — Subject: 'Interview confirmation — Senior Engineer role' — Body: Final round interview tomorrow at 2 PM EST, needs attendance confirmation.

4. From: alex.rivera@freelance.dev — Subject: 'Invoice #1087 — overdue payment' — Body: Freelancer invoice for $2,400 UI design work, 15 days overdue, requesting payment.

5. From: newsletter@producthunt.com — Subject: 'Your Product Hunt launch is trending!' — Body: Product is #3 on Product Hunt with 187 upvotes, 42 comments, 1200 visitors.

Use the receiveEmail tool for each one."`);
