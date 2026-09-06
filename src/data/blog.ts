import cover1 from "../imports/Forward_Deployed.jpg";
import cover2 from "../imports/blogs-cover-2.jpg";
import cover3 from "../imports/blog_post3.jpg";
import cover4 from "../imports/blogpost4.jpg";
import cover5 from "../imports/blog_post5.jpeg";

export interface BlogPost {
  id: string;
  slug: string;
  cover: string;
  coverBg: string;
  accentColor: string;
  accentBg: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "fde-hire",
    slug: "how-to-hire-a-forward-deployed-engineer",
    cover: cover1,
    coverBg: "#f5c842",
    accentColor: "#C07828",
    accentBg: "rgba(192,120,40,0.10)",
    category: "Hiring",
    title: "How to Hire a Forward Deployed Engineer (and Spot a Great One)",
    excerpt:
      "Forward Deployed Engineers are the hardest AI hire to get right. Here is what they actually do, why they are so hard to find, and how to spot a great one.",
    author: "Siddharth Gupta",
    date: "Aug 10, 2026",
    readTime: "3 min read",
    featured: true,
    content: `
      <p>Forward Deployed Engineer might be the hardest role in tech to hire well right now. Not because the talent does not exist, but because most companies cannot agree on what the job even is, and the people who are great at it are almost never the ones applying.</p>
      <p>Here is how to hire one properly, and how to tell a real one from a resume that just uses the words.</p>
      
      <h3>What a Forward Deployed Engineer actually does</h3>
      <p>A Forward Deployed Engineer, or FDE, sits between your product and your customer's messy reality. They write real, production code. They also sit in the room with the client, work out what the actual problem is underneath the one being described, and build the thing that solves it on the ground.</p>
      <p>Palantir made the title famous. AI-native companies made it essential. When your product is powerful but raw, and every customer needs it shaped slightly differently to get value, you need someone who can build and talk to humans in the same afternoon.</p>
      <p>Think of it as three jobs in one person. Engineer. Consultant. Firefighter.</p>
      
      <h3>Why they are so hard to hire</h3>
      <p>The role is only about two years old as a common title, and that creates three problems at once.</p>
      <p>There is no clean talent pool. You cannot filter a job board for people who have done this exact thing five times, because most of the people who can do it do not carry the label.</p>
      <p>The skill is a rare combination, not a single skill. Plenty of engineers can ship. Plenty of people are great with customers. The overlap is small, and the market for that overlap is hot.</p>
      <p>The best ones are almost never looking. They are usually the person quietly holding a critical account together at their current company, which is exactly why that company is not letting them go without a fight.</p>
      <p>Put those together and you get roles that stay open for months while a generic pipeline keeps serving up people who are strong at one half of the job and weak at the other.</p>
      
      <h3>What good actually looks like</h3>
      <p>This is where fitment matters far more than the resume. A great FDE tends to show a specific pattern.</p>
      <p>They tell customer stories, not just system stories. Ask about a hard project and a strong FDE naturally talks about the person on the other side, what they misunderstood, how the requirement changed halfway through. A pure engineer talks only about the stack.</p>
      <p>They are comfortable being underspecified. FDE work almost never arrives as a clean ticket. The great ones treat ambiguity as the interesting part, not a blocker to escalate.</p>
      <p>They ship pragmatically. They know when to build the elegant thing and when to build the ugly thing that unblocks the customer today. Taste about that trade-off is most of the job.</p>
      <p>They can hold a room without an engineer's safety net. If they cannot explain a technical trade-off to a non-technical buyer without either talking down or losing them, they will struggle in the role no matter how clean their code is.</p>
      
      <h3>How to screen for it</h3>
      <p>Skip the standard algorithms grind. It tests the wrong thing.</p>
      <p>Give them a real, ambiguous scenario instead. A half-defined customer problem, a few constraints, and let them ask questions. What they ask reveals more than what they answer. Great FDEs interrogate the problem before they reach for a solution.</p>
      <p>Then ask for two stories. One where they shipped something the customer loved but a purist engineer might frown at. One where they held the line on quality even though the customer pushed hard. You are looking for judgment about when to bend and when not to.</p>
      
      <h3>The one question that separates them</h3>
      <p>Ask this. "Tell me about a time the customer asked for one thing and actually needed another. What did you do?"</p>
      <p>A great Forward Deployed Engineer lights up, because it is their entire job. A weak fit either has no story, or describes simply building what was asked. The gap between those two answers is the gap between a hire that works and a role that stays painful for a year.</p>
      
      <h3>FAQ</h3>
      <p><strong>What is the difference between a Forward Deployed Engineer and a solutions engineer?</strong> A solutions engineer usually supports sales and configures existing product. An FDE builds new work, often owning real production code for a specific customer or deployment. There is overlap, but FDE work sits closer to core engineering.</p>
      <p><strong>Do Forward Deployed Engineers need to be strong coders?</strong> Yes. The customer-facing half is what makes the role rare, but without genuine engineering depth the role quietly collapses into account management. You need both, at real strength.</p>
      <p><strong>Where do you find Forward Deployed Engineers?</strong> Rarely on job boards. They are often founders, early startup engineers, or the person who fixes everything on a strong team. Finding them usually means going to the person, not waiting for the application.</p>
      <br />
      <p>Finding someone who can do both halves of this job is the specific thing HeroScouter is built for. See the roles we are working on, or tell us what you are trying to fill.</p>
    `,
  },
  {
    id: "applied-ai",
    slug: "applied-ai-engineer-vs-machine-learning-engineer",
    cover: cover2,
    coverBg: "#fff8e1",
    accentColor: "#1E4D3A",
    accentBg: "rgba(30,77,58,0.10)",
    category: "Recruitment",
    title: "Applied AI Engineer vs ML Engineer: Which Should You Hire?",
    excerpt:
      "Applied AI Engineer and Machine Learning Engineer are not the same hire. Here is the real difference, and how to tell which one your team actually needs.",
    author: "Ronak Raut",
    date: "Aug 13, 2026",
    readTime: "4 min read",
    featured: false,
    content: `
      <p>Companies lose months hiring the wrong kind of AI engineer. They write "Machine Learning Engineer" on a role that actually needs an Applied AI Engineer, interview a stream of people who are technically impressive and completely wrong for the job, and conclude the market is broken.</p>
      <p>The market is fine. The title was wrong. Here is how to tell these roles apart and pick the one you need.</p>
      
      <h3>The three roles people keep confusing</h3>
      <p><strong>Applied AI Engineer.</strong> Builds products and features on top of existing models. Integrating LLMs, building retrieval systems, designing evaluations, wiring models into a real product, and making the whole thing reliable in production. They usually do not train large models from scratch. They make models useful.</p>
      <p><strong>Machine Learning Engineer.</strong> Builds, trains, and deploys models. Owns data pipelines, training, deployment, and the operational side of keeping models running. More depth on the modeling and infrastructure, less focus on the product around it.</p>
      <p><strong>Research Scientist.</strong> Pushes the state of the art. New methods, new architectures, sometimes papers. Usually holds a PhD, usually the most expensive, and usually not who you need unless you are doing genuinely novel research.</p>
      <p>There is overlap, and the industry uses these titles loosely. But the center of gravity of each role is different, and that difference is exactly what you are hiring for.</p>
      
      <h3>The one-line difference</h3>
      <p>Applied AI Engineers build with models. Machine Learning Engineers build the models. Research Scientists invent new ones.</p>
      <p>If you remember nothing else, remember that.</p>
      
      <h3>How to tell which one you actually need</h3>
      <p>Ask what the work really is for the first year.</p>
      <p>If the job is to take strong existing models and turn them into a product your customers rely on, you want an Applied AI Engineer. Most companies adding AI to their product right now need this person, and many of them mistakenly ask for one of the other two.</p>
      <p>If the job is that you have specific data and need custom models trained, deployed, and maintained at scale, you want a Machine Learning Engineer.</p>
      <p>If the job is to do something no one has published yet, you want a Research Scientist, and you should be ready to pay for one.</p>
      <p>The expensive mistake is hiring a Research Scientist to build a product, or a Machine Learning Engineer to do work that turns out to be mostly applied. Brilliant people, wrong fit, and they tend to leave when the work does not match the craft they actually want to practice.</p>
      
      <h3>Why this confusion costs you</h3>
      <p>Two ways, both expensive.</p>
      <p>You reject good candidates for the wrong reasons. When the role is muddled, every candidate feels slightly off, because you are measuring them against a job you have not clearly defined. The feedback drifts. Too junior, then too research-heavy, then not product-minded enough. That is not a candidate problem. That is a role that has not been decided.</p>
      <p>You hire the wrong strength. The person is genuinely excellent, just not at the job you actually have. Six months later they are frustrated and you are hiring again.</p>
      
      <h3>Get the title right before you post</h3>
      <p>Before the role goes live, write one sentence. "In the first year, this person will mostly ______." Fill the blank with the real work, not the aspiration. Then pick the title that matches that sentence, not the one that sounds most impressive.</p>
      <p>Getting this right before you start is the cheapest hiring win there is. It costs one honest sentence and saves you three months.</p>
      
      <h3>FAQ</h3>
      <p><strong>Is an Applied AI Engineer the same as an AI Engineer?</strong> Often yes. AI Engineer is the looser umbrella term, and in practice most AI Engineer roles today are applied, meaning building products on existing models rather than training new ones.</p>
      <p><strong>Do Applied AI Engineers need a PhD?</strong> Usually not. Strong software engineering, good judgment about models, and product sense matter far more than research credentials for applied work.</p>
      <p><strong>Which AI role is hardest to hire right now?</strong> The hybrids. Applied AI Engineers who can also own product decisions, and anyone who pairs strong engineering with real customer or commercial instinct, are the roles that stay open longest.</p>
      <br />
      <p>Matching the right kind of AI engineer to the actual job is what we do at HeroScouter. If you are not sure which one you need, that is usually the first useful conversation to have.</p>
    `,
  },
  {
    id: "ai-engineer-salary",
    slug: "ai-engineer-salary-2026",
    cover: cover3,
    coverBg: "#f0ebe3",
    accentColor: "#C8923A",
    accentBg: "rgba(200,146,58,0.10)",
    category: "Hiring",
    title:
      "AI Engineer Salary in 2026: What Companies Actually Pay (and Why the Range Is So Wide)",
    excerpt:
      "AI engineer salaries in 2026 range from about 134K to over 1M. Here is why the range is so wide, and what you should actually budget to hire.",
    author: "Siddharth Gupta",
    date: "Aug 18, 2026",
    readTime: "5 min read",
    featured: false,
    content: `
      <p>If you go looking for the AI engineer salary in 2026, you will find numbers ranging from roughly 134,000 dollars to well over a million. That is not sloppy data. It is the most important thing to understand about this market. The title "AI engineer" now covers at least five different jobs, and they are not paid the same because they are not the same work.</p>
      <p>Here is what the numbers actually say, and how to read them before you set a budget.</p>

      <h3>The honest headline number</h3>
      <p>For a mainstream AI or machine learning engineer at a normal tech company, base salary in 2026 sits roughly between 134,000 and 193,000 dollars, with a midpoint near 170,000, according to the Robert Half 2026 guide. Blend in equity and bonus and the average total compensation climbs to around 242,000, per Levels.fyi.</p>
      <p>So if someone asks for a single number, "a bit over 200,000 all in for a solid mid-level hire" is defensible for most companies. But the single number hides the whole story.</p>

      <h3>Why the range is so wide</h3>
      <p>The market has split in two, and the gap between the halves is enormous.</p>
      <p>On one side, enterprise AI and ML engineers, the people building recommendation systems, fraud models, and internal copilots, mostly land in the 170,000 to 245,000 total range. On the other side, a small group at frontier labs commands 600,000 to over a million for the same job title, with reported medians at the very top approaching 800,000. Same two words on the business card, a six times difference in pay.</p>
      <p>Three things drive where a given role falls.</p>
      <p><strong>Company stage and type.</strong> Frontier labs pay the most, then late-stage and well-funded startups, then enterprise. At AI-native startups specifically, base for an ML engineer clusters around 200,000, with the middle of the market running roughly 184,000 to 249,000.</p>
      <p><strong>Specialty.</strong> Not all AI work is priced equally. People who work on LLMs, RAG, and agents tend to command a premium over computer vision, which in turn sits above traditional machine learning.</p>
      <p><strong>City.</strong> San Francisco, New York, and Seattle run something like 25 to 40 percent above the national midpoint. Remote roles usually sit below it.</p>

      <h3>Base is not the real number</h3>
      <p>The most common budgeting mistake is anchoring on base salary alone. At the senior end, total compensation is where the real money lives.</p>
      <p>Equity is the big one, especially at startups. A senior hire at a Series A company might get 0.1 to 0.4 percent, and at Series B or C more like 0.05 to 0.2 percent. On paper that can add anywhere from tens of thousands to several hundred thousand dollars a year in value, though startup equity is a bet, not cash.</p>
      <p>Sign-on bonuses have also become standard at the senior and staff level, often 50,000 to 200,000 dollars, largely to buy out equity a candidate would forfeit by leaving their current job. If you are not prepared for that conversation, you will lose people at the finish line.</p>

      <h3>What this means if you are hiring</h3>
      <p>Do not benchmark against the wrong tier. If you are a Series A startup quietly comparing your offer to what you read about OpenAI, you will scare yourself out of hiring anyone. Those numbers are a different market. Benchmark against companies at your stage, in your city, hiring your specialty.</p>
      <p>Refresh your bands more often than you think. AI and ML pay rose roughly 4 percent in 2026, more than double the broader tech average. A band you set a year ago is probably already low, which is a common reason a role sits open for months while everyone blames the market.</p>
      <p>And decide which "AI engineer" you actually need before you price the role. An applied engineer building on top of existing models is a different hire, at a different price, from someone training models from scratch. Getting that wrong is the most expensive salary mistake there is.</p>

      <h3>FAQ</h3>
      <p><strong>How much does an AI engineer make in 2026?</strong> For a typical mid-level hire at a normal company, expect roughly 170,000 base and around 200,000 to 240,000 total. Senior engineers at top startups and labs go far higher once equity is included.</p>
      <p><strong>Why do AI engineer salaries vary so much?</strong> Because the title spans very different jobs and employers, from enterprise teams to frontier labs, with a genuine six times spread between the bottom and the top of the market.</p>
      <p><strong>Do AI engineers at startups earn less?</strong> Often a little less base, but with meaningfully more equity. The trade is cash certainty now versus a larger, riskier upside later.</p>
      <br />
      <p><em>Figures are directional and current to 2026, drawn from Robert Half, Levels.fyi, Glassdoor, and specialist recruiter data. Refresh annually.</em></p>
      <p>Getting the band right for your stage and specialty is half of landing the hire. That is the kind of thing we help companies get right at HeroScouter. See <a href="/roles">our active roles</a> or read <a href="/blog/applied-ai-engineer-vs-machine-learning-engineer">Applied AI Engineer vs Machine Learning Engineer</a>.</p>
    `,
  },
  {
    id: "ai-engineer-interview",
    slug: "how-to-interview-an-ai-engineer",
    cover: cover4,
    coverBg: "#e8f0ea",
    accentColor: "#1E4D3A",
    accentBg: "rgba(30,77,58,0.10)",
    category: "Hiring",
    title: "How to Interview an AI Engineer (When Leetcode Tells You Nothing)",
    excerpt:
      "Standard coding interviews no longer predict who can do real AI work. Here is what to test instead, and the over-correction to avoid.",
    author: "Ronak Raut",
    date: "Aug 21, 2026",
    readTime: "4 min read",
    featured: false,
    content: `
      <p>The standard technical interview was built for a world where writing correct code by hand was the hard, rare skill. That world is mostly gone. Models now write clean boilerplate on demand, which means an interview that only tests whether someone can produce clean boilerplate tells you almost nothing about whether they can do real AI work.</p>
      <p>But the fix is not to throw out rigor and hire on vibes. That is the other trap. Here is how to interview an AI engineer in a way that actually predicts who will be good.</p>

      <h3>Why the old interview breaks</h3>
      <p>A classic algorithms screen measures a narrow thing: can this person, under pressure, reproduce a solution to a puzzle they have probably seen before. For a lot of AI engineering, that skill has been quietly commoditized. The work is less about writing the function and more about deciding which function should exist, whether the model's output can be trusted, and what happens when it fails on real data.</p>
      <p>You can pass a leetcode round and still have no idea how to build an evaluation harness, spot a subtle data leak, or tell when a model is confidently wrong. That gap is exactly where AI hires succeed or fail.</p>

      <h3>What you are actually testing for</h3>
      <p>Three things matter more than raw coding speed.</p>
      <p><strong>Judgment about models.</strong> Do they know when to reach for a model and when not to. Can they reason about why an approach is failing rather than just swapping models until something works. Do they treat evaluation as a first-class problem, not an afterthought.</p>
      <p><strong>Debugging the fuzzy.</strong> Traditional bugs throw errors. AI systems fail quietly, giving plausible wrong answers. The good engineers have a real method for this. Ask how they have chased down a model that was subtly, confidently wrong, and listen for whether they had a system or just got lucky.</p>
      <p><strong>Product and data sense.</strong> The best applied AI engineers think about the user and the data, not just the model. They ask what "good" means for this specific problem before they build.</p>

      <h3>A better format</h3>
      <p>Replace the pure algorithms round with a real, messy scenario.</p>
      <p>Give them an actual problem from your product, some imperfect data, and a vague definition of success, and watch how they work. Do they interrogate the problem first, or start coding immediately. Do they ask what good looks like. Do they think about how they would know if it worked.</p>
      <p>Pair it with a walk-through of something real they have built. Not the polished version. Ask where it broke, what they got wrong the first time, and what they would do differently. People who have genuinely shipped AI systems have rich, specific answers here. People who have mostly read about it do not.</p>

      <h3>The over-correction to avoid</h3>
      <p>Once teams realize leetcode is failing them, many swing too far and start hiring on charisma and confident opinions about models. This is how you end up with someone who gives a great interview and cannot ship.</p>
      <p>Rigor still matters. You are just moving it to the right target. Test whether they can reason about a real system, not whether they memorized a tree-traversal. Keep a genuine hands-on component, keep a bar, and be as suspicious of a smooth talker with no shipping scars as you are of someone who freezes on a whiteboard.</p>

      <h3>The one signal that matters most</h3>
      <p>If you take one thing from this, make it this question: "Tell me about a time your model or system was confidently wrong in production. How did you find it, and what did you change?"</p>
      <p>A strong AI engineer has a real story, told with specifics, because this is the actual job. A weak fit either has no story or describes a simple bug that threw a clear error. The difference between those two answers predicts on-the-job performance better than any coding puzzle.</p>

      <h3>FAQ</h3>
      <p><strong>Should I still do a coding round for AI engineers?</strong> Yes, but change what it tests. Use a real, ambiguous problem over a canned algorithms puzzle, and watch how they reason, not just whether the code compiles.</p>
      <p><strong>What is the best interview question for an AI engineer?</strong> Ask about a time their system was confidently wrong in production and how they caught it. It reveals debugging method, judgment, and whether they have actually shipped.</p>
      <p><strong>How do I interview an AI engineer if I am not technical?</strong> Bring in a trusted technical voice for the hands-on part, and focus your own time on judgment and product sense. Listen for whether they define success clearly and think about the user, not just the model.</p>
      <br />
      <p>Knowing what "good" looks like for a specific AI role, and how to test for it, is the hard part of hiring here. It is also exactly what we do at HeroScouter. See <a href="/roles">our active roles</a> or read <a href="/blog/how-to-hire-a-forward-deployed-engineer">How to Hire a Forward Deployed Engineer</a>.</p>
    `,
  },
  {
    id: "resume-filters",
    slug: "why-the-best-us-uk-tech-teams-stopped-using-resume-filters",
    cover: cover5,
    coverBg: "#e6eef0",
    accentColor: "#1E4D3A",
    accentBg: "rgba(30,77,58,0.10)",
    category: "Hiring",
    title: "Why the Best US & UK Tech Teams Stopped Using Resume Filters",
    excerpt:
      "Resume filters were meant to make hiring more efficient. Instead, they turned a judgment problem into a proxy arms race and made good engineers harder to find.",
    author: "Vaishnavi Baghele",
    date: "September 5, 2026",
    readTime: "6 min read",
    featured: false,
    content: `
      <p>The hiring story of this decade was supposed to be a good one. More applicants than ever, more tools than ever, a market finally efficient enough to match the right engineer to the right role in days instead of months. That was the promise sold to every VP of Engineering who signed up for an applicant tracking system.</p>
      <p>What we got instead is two machines arguing with each other while the humans on both sides have quietly left the room.</p>
      <p>A job goes up in San Francisco or London on a Monday. By Tuesday, an agent working on a candidate's behalf has submitted their resume to three hundred postings before the candidate has finished breakfast. By Wednesday, the hiring team's own software has rejected nine out of every ten of those resumes without a person ever opening the file. Two algorithms, negotiating a job offer neither of them is qualified to understand, on behalf of two humans who never spoke to each other.</p>
      <p>We've built a labor market that runs almost entirely on proxies, and we've forgotten to ask what the proxies were ever standing in for.</p>

      <h3>The arms race nobody chose</h3>
      <p>There's a principle economists have known for decades, first named clearly by Charles Goodhart: when a measure becomes a target, it stops being a good measure. Keyword density in a resume was never the thing companies actually wanted. It was a rough stand-in for competence, easy to scan at scale. The moment candidates realized the stand-in was being scored, the stand-in became the whole game.</p>
      <p>So a founding engineer who spent three years shipping a real product under real pressure learns to write "Senior Backend Engineer" instead of the truth, because the truth doesn't parse. A recruiter who once read every tenth resume now reads none, because the volume made reading impossible long before the software did.</p>
      <p>Nobody in this chain is behaving irrationally. Everybody is responding correctly to the incentives in front of them. That's precisely what makes the system so hard to fix from the inside; every actor is winning their own small, local game while the larger one quietly collapses.</p>

      <h3>What a filter actually measures</h3>
      <p>Ask a hiring manager what they're screening for and they'll say judgment, ownership, the ability to solve a problem nobody's solved before. Ask their ATS what it's screening for and the honest answer is pattern-matching against a template built from last year's successful hires.</p>
      <p>Those are not the same question, and the gap between them is where good engineers disappear.</p>
      <p>Consider two resumes side by side. One belongs to a candidate who job-hopped every eleven months chasing title inflation, resume dense with every phrase lifted straight from the posting. The other belongs to someone whose last two years read as a gap, because that gap was a startup that didn't survive, though the product she built during it is still running in production somewhere, quietly working. The filter has no field for "built something that mattered and then it ended." It has a field for continuity. One candidate gets an interview. The other gets a form rejection at 2am, generated by a system that never opened her file.</p>
      <p>We didn't set out to build a hiring process that rewards the appearance of stability over the evidence of capability. We built it one small optimization at a time, and arrived here anyway.</p>

      <h3>The engineer the filter cannot see</h3>
      <p>There's a useful idea from Daniel Kahneman's work on judgment: humans are remarkably good at reading rich, ambiguous signals, a conversation, a piece of code, the way someone talks through a failure, and remarkably bad at doing it at scale. Software is the opposite. It scales effortlessly and reads almost nothing that actually matters.</p>
      <p>The instinct has been to let the software win by default, because scale looks like the harder problem to solve. But scale was never the constraint that mattered. Signal was.</p>
      <p>A resume is, at best, a lossy compression of two years of someone's working life into four bullet points. Compress it further through a keyword filter and what survives is not the two percent that mattered. It's the two percent that happened to rhyme with the job description.</p>

      <h3>Why trust travels faster than paper</h3>
      <p>The sociologist Mark Granovetter spent a career studying how people actually find jobs, and his finding, decades old now, still holds: it is rarely your closest friends who get you hired. It's the acquaintance, the former colleague, the person one step removed who happens to know both you and the opportunity. He called it the strength of weak ties, and it remains one of the more quietly radical ideas in labor economics, because it says the network matters more than the resume ever did.</p>
      <p>The teams that have turned their filters off in New York, London, and San Francisco haven't rediscovered anything new. They've just stopped fighting a truth that was always sitting there. A single sentence from someone who has actually worked alongside a candidate carries more real information than five hundred documents optimized to look plausible to a machine. Not because the sentence is generous. Because it's expensive to say and cheap to verify, and both of those things make it honest in a way a resume structurally cannot be.</p>

      <h3>The one question that survives</h3>
      <p>Every hiring process, stripped down to its studs, is really asking one question: is there a real person willing to stake their own credibility on this candidate's work?</p>
      <p>A resume can't answer that question, no matter how well it's formatted. A filter definitely can't. Only a person who has seen the actual work, and is willing to put their name next to it, can.</p>
      <p>The teams getting this right aren't rejecting technology. They're rejecting the idea that a proxy, however elegant, should outrank the thing it was only ever meant to approximate. Fifty resumes that cleared a filter will never add up to the one person someone else was willing to vouch for. Volume was always the cheap half of hiring. Judgment was the expensive half, and we spent a decade automating away the wrong one.</p>

      <h3>FAQ</h3>
      <p><strong>If you turn off the filter, how do you manage three hundred applications?</strong> You stop collecting three hundred applications for roles where quality matters most. Close the wide-open public posting and route the search through people who already know good work when they see it, recruiters, current employees, trusted second-degree connections. The volume problem disappears when you stop optimizing for volume.</p>
      <p><strong>Isn't manual review just slower?</strong> It looks slower until you count what the filter actually costs you. An hour spent on five candidates someone already trusts beats six weeks spent interviewing twenty candidates a keyword match let through, most of whom won't survive a real conversation about their own work.</p>
      <p><strong>If the resume doesn't matter as much anymore, what does?</strong> Evidence a machine can't fake. A repository with real commit history. A conversation about a decision that went wrong and what was learned from it. A specific person willing to say, in their own words, that this candidate is who they claim to be. That's harder to manufacture than a keyword, and that's exactly the point.</p>
    `,
  },
];
