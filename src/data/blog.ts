import cover1 from '../imports/FDE.png'
import cover2 from '../imports/blogs-cover-2.jpg'

export interface BlogPost {
  id: string
  slug: string
  cover: string
  coverBg: string
  accentColor: string
  accentBg: string
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  featured: boolean
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 'fde-hire',
    slug: 'how-to-hire-a-forward-deployed-engineer',
    cover: cover1,
    coverBg: '#f5c842',
    accentColor: '#C07828',
    accentBg: 'rgba(192,120,40,0.10)',
    category: 'Hiring',
    title: 'How to Hire a Forward Deployed Engineer (and Spot a Great One)',
    excerpt: 'Forward Deployed Engineers are the hardest AI hire to get right. Here is what they actually do, why they are so hard to find, and how to spot a great one.',
    author: 'Siddharth Gupta',
    date: 'Aug 10, 2026',
    readTime: '3 min read',
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
    `
  },
  {
    id: 'applied-ai',
    slug: 'applied-ai-engineer-vs-machine-learning-engineer',
    cover: cover2,
    coverBg: '#fff8e1',
    accentColor: '#1E4D3A',
    accentBg: 'rgba(30,77,58,0.10)',
    category: 'Recruitment',
    title: 'Applied AI Engineer vs ML Engineer: Which Should You Hire?',
    excerpt: 'Applied AI Engineer and Machine Learning Engineer are not the same hire. Here is the real difference, and how to tell which one your team actually needs.',
    author: 'Ronak Raut',
    date: 'Aug 13, 2026',
    readTime: '4 min read',
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
    `
  }
]
