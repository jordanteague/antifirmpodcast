/**
 * Builders, Not Billers issues, newest first. Each issue goes out on LinkedIn (Campbell Teague page)
 * and by email (beehiiv) and is archived here. An issue only appears on the site once its date has
 * passed at build time, so it can be merged ahead of launch. Set SHOW_UNPUBLISHED=1 to preview.
 * `html` is trusted, hand-written markup: h2 for sections, h3 for sub-points.
 */
export type Issue = {
  number: number;
  slug: string;
  /** Publish date, America/New_York, YYYY-MM-DD. */
  date: string;
  title: string;
  dek: string;
  cover: string;
  coverAlt: string;
  /** The issue on LinkedIn, once published. */
  linkedinUrl?: string;
  html: string;
};

export const issues: Issue[] = [
  {
    number: 1,
    slug: "issue-01",
    date: "2026-12-01",
    title: "How to tell when your lawyer is mailing it in",
    dek: "Three tells, plus some thoughts on why everyone is suddenly \u201cAI native.\u201d",
    cover: "/images/newsletter/issue-01.jpg",
    coverAlt: "Builders, Not Billers, Issue 01, with Jordan Teague and George Campbell",
    html: "<p>There are spectacular ways for a lawyer to screw something up. Missing a deadline. Blowing a deal. Giving advice that turns out to be catastrophically wrong.</p>\n<p>But sometimes the smaller mistakes tell you more.</p>\n<p>George's example is the deal document that still has another client's name in it. The lawyer may have done all the substantive work correctly. But somewhere along the way, \u201cFile, Save As\u201d won.</p>\n<p>Jordan confessed to her own version. As a first-year associate, she reused a pleading and left in the wrong division of the right federal court. It didn't affect the case. Nobody would have noticed.</p>\n<p>Her boss did.</p>\n<p>His point was simple: how you do anything is how you do everything.</p>\n<p>If you can see the mistake that doesn't matter, what should you assume about the ones you can't?</p>\n<p>That was the starting point for Episode 1 of ANTIFIRM: Mailing It In.</p>\n<h2>Three signs your lawyer might be mailing it in</h2>\n<h3>1. The wall-of-text email</h3>\n<p>Sixteen paragraphs of legal analysis are not necessarily sixteen paragraphs of useful advice.</p>\n<p>A good lawyer should be able to distinguish between things that are legally interesting and things that matter to your decision.</p>\n<p>If you routinely finish your lawyer's emails knowing more about the law but still wondering what you should do, something is wrong.</p>\n<h3>2. They spot issues, but don't give advice</h3>\n<p>Lawyers are trained to find risks. That's useful.</p>\n<p>But \u201chere are seven things that could go wrong\u201d is not the same thing as advice.</p>\n<p>Eventually someone has to say: <em>Here's what I think you should do, and here's why.</em></p>\n<p>The more experienced the lawyer, the more you should expect them to make that judgment.</p>\n<h3>3. \u201cIt depends.\u201d</h3>\n<p>To be fair, it usually does.</p>\n<p>The problem isn't saying \u201cit depends.\u201d The problem is stopping there.</p>\n<p>A useful answer sounds more like:</p>\n<p><em>It depends on X. If X is true, I'd do A. If it isn't, I'd do B.</em></p>\n<p>Now you know what actually matters.</p>\n<h2>Meanwhile, everyone is \u201cAI native\u201d now</h2>\n<p>We opened Episode 2 by announcing that Campbell Teague had become an \u201cAI-native law firm.\u201d</p>\n<p>As of about five minutes earlier.</p>\n<p>George's response was basically: That's like announcing you're a pencil-native firm in the 1930s.</p>\n<p>Which gets at something that bothers us about the current AI conversation. Using the newest tools is increasingly ordinary. It does not, by itself, tell you much about how good someone is at their job.</p>\n<p>Three things from that conversation stuck with us.</p>\n<h3>A lot of \u201cAI\u201d is still just automation</h3>\n<p>Jordan's example was simple: a lawyer finishes a document, someone gives it a thumbs-up in Teams, and it automatically goes to DocuSign for signature.</p>\n<p>Useful? Absolutely.</p>\n<p>AI? Not necessarily.</p>\n<p>You could have built that workflow years ago. You just needed to know what Zapier was.</p>\n<h3>Analysis is getting cheaper. Judgment isn't.</h3>\n<p>AI can produce an extraordinary amount of analysis very quickly.</p>\n<p>The scarce part is increasingly knowing which analysis matters.</p>\n<p>That may actually favor experienced professionals more than people expect. George pointed out that senior lawyers who spent years dictating their work may be unusually well suited to a world where the interface becomes talking to a machine.</p>\n<p>Turns out refusing to type may have been a very long-term technology strategy.</p>\n<h3>Nobody actually knows what AI will do to junior lawyers</h3>\n<p>The standard prediction is that senior lawyers will use AI to do work themselves instead of giving it to junior lawyers.</p>\n<p>Maybe.</p>\n<p>But training someone has always been less efficient than just doing the work yourself in the short term.</p>\n<p>The reason businesses train people anyway is that eventually those people can do things you don't have to do.</p>\n<p>The interesting question isn't whether AI makes delegation less efficient today. It's whether AI changes the long-term payoff from training people.</p>\n<p>We're not convinced that decades of management wisdom should be discarded on vibes.</p>\n<h2>Two predictions we're willing to make</h2>\n<p><strong>George</strong> thinks courts are going to see a lot more filings drafted with AI, particularly from people representing themselves. Courts should be thinking about that volume now.</p>\n<p><strong>Jordan</strong> thinks businesses may eventually reconsider some class-action waivers. If AI makes it dramatically cheaper to pursue hundreds of individual claims, forcing everyone into individual proceedings may not always look like such an obvious win.</p>\n<p>Which brings us back to Episode 1.</p>\n<p>Technology changes. The temptation to mail it in doesn't.</p>\n<blockquote>\u201cI've never met anybody who wanted to have the eulogy at their funeral say he was awesome at being mediocre.\u201d<cite>\u2014 George Campbell, Episode 1</cite></blockquote>\n<h3>Listen</h3>\n<p>Episodes 1 and 2 of ANTIFIRM are out now on <a href=\"/#episodes\">antifirm.com</a>, <a href=\"https://www.youtube.com/@antifirm\">YouTube</a>, <a href=\"https://open.spotify.com/show/6JaAeCI2Wnrm4frUQMmNzX\">Spotify</a> and <a href=\"https://podcasts.apple.com/us/podcast/antifirm/id6829585794\">Apple Podcasts</a>.</p>\n<p><strong>Your turn:</strong> What's one tiny thing that immediately tells you a professional, any professional, is mailing it in?</p>\n<p>Tell us in the comments on LinkedIn.</p>\n<p>Prefer email? Get Builders, Not Billers in your inbox by <a href=\"#newsletter\">signing up below</a>.</p>",
  },
];

/** Goes live at 11 AM Eastern on the issue date (16:00 UTC in winter); deploy.yml has a 16:05 UTC build for it. */
function isLive(issue: Issue, now = new Date()) {
  return process.env.SHOW_UNPUBLISHED === "1" || now >= new Date(`${issue.date}T16:00:00Z`);
}

export function liveIssues() {
  return issues.filter((i) => isLive(i));
}

export function issueDate(issue: Issue) {
  return new Date(`${issue.date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function issueLabel(issue: Issue) {
  return `Issue ${String(issue.number).padStart(2, "0")}`;
}
