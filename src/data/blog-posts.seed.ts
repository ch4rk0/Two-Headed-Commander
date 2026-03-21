export interface ContentBlock {
  type: 'p' | 'h2' | 'h3' | 'blockquote' | 'img';
  text?: string;
  src?: string;
  alt?: string;
  caption?: string;
}

export interface BlogPost {
  slug: string;
  title: { en: string; fr: string } | string;
  date: string;
  excerpt: { en: string; fr: string } | string;
  coverImage: string;
  coverAlt: string;
  content?: ContentBlock[];   // legacy seed format
  contentHtml?: string;        // TipTap editor format
  published?: boolean;
  authorEmail?: string;
}

export const BLOG_POSTS_SEED: BlogPost[] = [

  /* ── Article 2 ─────────────────────────────────────────────── */
  {
    slug: 'building-your-first-two-headed-commander-deck',
    title: 'Building Your First Two-Headed Commander Deck',
    date: '2026-03-01',
    excerpt: 'Choosing the right commander, syncing strategies with your partner, and the key deckbuilding principles that make Two-Headed Commander different from solo EDH.',
    coverImage: '',
    coverAlt: '',
    content: [
      { type: 'p', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { type: 'h2', text: 'Choosing Your Commander' },
      { type: 'p', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.' },
      { type: 'h3', text: "Synergy with Your Partner's Commander" },
      { type: 'p', text: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat.' },
      { type: 'blockquote', text: 'In Two-Headed Commander, redundancy between teammates is more valuable than singleton variety — coordinate your strategies before you build.' },
      { type: 'h2', text: 'Deckbuilding Principles for 2v2' },
      { type: 'p', text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.' },
      { type: 'p', text: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.' },
      { type: 'h3', text: 'Ramp, Draw, and Board Wipes' },
      { type: 'p', text: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores.' },
    ],
  },

  /* ── Article 1 ─────────────────────────────────────────────── */
  {
    slug: 'why-extra-turns-are-banned',
    title: 'Why Every Extra Turn Card Is Banned',
    date: '2026-03-10',
    excerpt: "In a 2v2 format, an extra turn doesn't just skip one opponent — it skips two. Here's the full reasoning behind one of the format's most sweeping category bans.",
    coverImage: 'images/hero-bg.jpg',
    coverAlt: 'Two players sharing a turn — Two-Headed Commander banner',
    content: [
      { type: 'p', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { type: 'h2', text: 'The Problem with Extra Turns in 2v2' },
      { type: 'p', text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.' },
      { type: 'p', text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.' },
      { type: 'blockquote', text: "A single extra turn in Two-Headed Giant effectively steals two players' turns at once — the swing in tempo is doubled compared to any 1v1 context." },
      { type: 'h2', text: 'A Category Ban, Not a Card-by-Card Decision' },
      { type: 'p', text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.' },
      { type: 'img', src: 'images/hero-bg.jpg', alt: 'Placeholder article image', caption: 'Replace this image with a relevant card art crop or photo.' },
      { type: 'p', text: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.' },
      { type: 'h2', text: 'What About "Harmless" Extra Turns?' },
      { type: 'p', text: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.' },
    ],
  },

];
