<div id="erd" style="padding: 8px 0;"></div>
<script type="module">
import mermaid from 'https://esm.sh/mermaid@11/dist/mermaid.esm.min.mjs';
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
await document.fonts.ready;
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  fontFamily: '"Anthropic Sans", sans-serif',
  themeVariables: {
    darkMode: dark,
    fontSize: '13px',
    fontFamily: '"Anthropic Sans", sans-serif',
    lineColor: dark ? '#9c9a92' : '#73726c',
    textColor: dark ? '#c2c0b6' : '#3d3d3a',
  },
});
const { svg } = await mermaid.render('erd-svg', `erDiagram
  USERS ||--o{ EVENT_REGISTRATIONS : mendaftar
  USERS ||--o{ SUBMISSIONS : mengupload
  USERS ||--o{ SCORES : dinilai
  USERS ||--o{ JURY_ASSIGNMENTS : ditugaskan
  EVENTS ||--o{ EVENT_REGISTRATIONS : memiliki
  EVENTS ||--o{ CATEGORIES : memiliki
  EVENTS ||--o{ JURY_ASSIGNMENTS : memiliki
  EVENTS ||--o{ SCORING_CRITERIA : memiliki
  EVENTS ||--o{ ANNOUNCEMENTS : memiliki
  CATEGORIES ||--o{ EVENT_REGISTRATIONS : dikategorikan
  SUBMISSIONS ||--o{ SCORES : dinilai
  SCORING_CRITERIA ||--o{ SCORES : digunakan
  USERS {
    bigint id PK
    string name
    string email
    string password
    enum role
    string phone
    string avatar
    timestamp email_verified_at
    timestamps created_at
  }
  EVENTS {
    bigint id PK
    string title
    text description
    enum status
    date registration_start
    date registration_end
    date event_start
    date event_end
    string location
    text rules
    string poster
    timestamps created_at
  }
  CATEGORIES {
    bigint id PK
    bigint event_id FK
    string name
    text description
    int max_participants
    timestamps created_at
  }
  EVENT_REGISTRATIONS {
    bigint id PK
    bigint user_id FK
    bigint event_id FK
    bigint category_id FK
    enum status
    string team_name
    text notes
    timestamps created_at
  }
  SUBMISSIONS {
    bigint id PK
    bigint user_id FK
    bigint registration_id FK
    string title
    text description
    string design_file
    string photo_url
    enum status
    timestamps created_at
  }
  SCORING_CRITERIA {
    bigint id PK
    bigint event_id FK
    string name
    text description
    int max_score
    float weight
    timestamps created_at
  }
  JURY_ASSIGNMENTS {
    bigint id PK
    bigint user_id FK
    bigint event_id FK
    bigint category_id FK
    boolean is_active
    timestamps created_at
  }
  SCORES {
    bigint id PK
    bigint submission_id FK
    bigint jury_id FK
    bigint criteria_id FK
    float score
    text comment
    timestamps created_at
  }
  ANNOUNCEMENTS {
    bigint id PK
    bigint event_id FK
    string title
    text content
    enum type
    boolean is_published
    timestamps created_at
  }
`);
document.getElementById('erd').innerHTML = svg;

document.querySelectorAll('#erd svg .node').forEach(node => {
  const firstPath = node.querySelector('path[d]');
  if (!firstPath) return;
  const d = firstPath.getAttribute('d');
  const nums = d.match(/-?[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 8) return;
  const xs = [nums[0], nums[2], nums[4], nums[6]];
  const ys = [nums[1], nums[3], nums[5], nums[7]];
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x); rect.setAttribute('y', y);
  rect.setAttribute('width', w); rect.setAttribute('height', h);
  rect.setAttribute('rx', '8');
  for (const a of ['fill', 'stroke', 'stroke-width', 'class', 'style']) {
    if (firstPath.hasAttribute(a)) rect.setAttribute(a, firstPath.getAttribute(a));
  }
  firstPath.replaceWith(rect);
});

document.querySelectorAll('#erd svg .row-rect-odd path, #erd svg .row-rect-even path').forEach(p => {
  p.setAttribute('stroke', 'none');
});
</script>
