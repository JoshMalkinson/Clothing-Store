// =============================================================
//  Fernly · Site content
// -------------------------------------------------------------
//  All editable copy lives here so you can adjust the site
//  without touching markup. `brand` is a PLACEHOLDER — change it
//  (and the copy below) once the real brand name is decided.
// =============================================================

export interface NavLink {
  label: string;
  href: string;
}

export interface ValueProp {
  icon: 'motion' | 'durable' | 'care';
  title: string;
  description: string;
}

export interface Collection {
  name: string;
  description: string;
  meta: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  detail: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const site = {
  brand: 'Action Bodywear',
  tagline: 'Activewear that keeps up',
  description:
    'Considered activewear for kids and teenagers — soft, durable, and made to move from the first bell to the final whistle.',
  ctaLabel: 'Explore the collection',
  ctaHref: '/shop',

  nav: <NavLink[]>[
    { label: 'Shop', href: '/shop' },
    { label: 'Our approach', href: '/#approach' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/#contact' },
  ],

  hero: {
    eyebrow: 'Activewear · Ages 4–16',
    title: 'Made to move. Built to be handed down.',
    subtitle:
      'Considered, comfortable activewear for kids and teenagers — soft enough for the school run, tough enough for everything after it.',
    primaryLabel: 'Explore the collection',
    primaryHref: '/shop',
    secondaryLabel: 'Our approach',
    secondaryHref: '/#approach',
    note: 'Free returns · Designed to last season after season',
    imageCaption: 'Add your hero photograph here',
    statValue: '4–16',
    statLabel: 'A considered fit for every stage',
  },

  valueProps: <ValueProp[]>[
    {
      icon: 'motion',
      title: 'Made to move',
      description:
        'Breathable, four-way stretch fabrics that flex with every sprint, climb, and cartwheel — never holding them back.',
    },
    {
      icon: 'durable',
      title: 'Built to last',
      description:
        'Reinforced seams and hard-wearing knits designed to survive the wash, the playground, and the next in line.',
    },
    {
      icon: 'care',
      title: 'Designed with care',
      description:
        'Soft finishes, considered details, and a fit that kids actually choose to wear — morning, noon, and long after.',
    },
  ],

  approach: {
    eyebrow: 'Our approach',
    title: 'Thoughtful clothing for restless humans.',
    paragraphs: [
      'Every piece starts with how kids actually move — not how they’re asked to stand still. We obsess over the details that matter: the softness against skin, the give in a sleeve, the seam that simply refuses to quit.',
      'The result is activewear with a quiet kind of quality. Pieces that look considered, feel premium, and earn their place back in the drawer week after week.',
    ],
    stats: <Stat[]>[
      { value: '4-way', label: 'Stretch on every active piece' },
      { value: '30+', label: 'Wash cycles tested per design' },
      { value: '100%', label: 'Designed to be handed down' },
    ],
    imageCaption: 'Add a lifestyle or fabric photo here',
  },

  testimonials: <Testimonial[]>[
    {
      quote:
        'Finally, kit that survives three kids and still looks brand new. The fit is lovely and they actually ask to wear it.',
      author: 'Priya R.',
      detail: 'Parent of three',
    },
    {
      quote:
        'The fabric feels genuinely premium without the fuss. It washes beautifully and keeps its shape.',
      author: 'Daniel M.',
      detail: 'Parent · age 9',
    },
    {
      quote:
        'My teenager is impossible to shop for and even she approves. That is the highest praise I can give.',
      author: 'Sofia L.',
      detail: 'Parent · age 14',
    },
  ],

  cta: {
    eyebrow: 'Stay in the loop',
    title: 'Be first to see new collections.',
    subtitle:
      'Occasional updates on new arrivals and restocks. No noise — just the good stuff.',
    placeholder: 'you@example.com',
    button: 'Notify me',
    note: 'We’ll only email about products. Unsubscribe anytime.',
  },

  footer: {
    blurb:
      'Considered activewear for kids and teenagers — made to move, and made to last.',
    columns: <FooterColumn[]>[
      {
        title: 'Shop',
        links: [
          { label: 'Everyday Movement', href: '/shop#everyday-movement' },
          { label: 'On the Field', href: '/shop#on-the-field' },
          { label: 'Cooler Days', href: '/shop#cooler-days' },
          { label: 'Rest & Recover', href: '/shop#rest-recover' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Our approach', href: '/#approach' },
          { label: 'Reviews', href: '/#reviews' },
          { label: 'Sizing guide', href: '/shop' },
          { label: 'Contact', href: '/#contact' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Shipping & returns', href: '#' },
          { label: 'Care guide', href: '#' },
          { label: 'FAQs', href: '#' },
        ],
      },
    ],
  },
};
