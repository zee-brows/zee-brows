export const defaultContent = {
  home: {
    loaderText: "Travel • Tech • Media",
    eyebrow: "Creative studio + technology growth agency",
    headline: "Creative Digital Experiences That Grow Brands",
    subtext:
      "Strategy, social media, ads, websites, branding, and video production shaped as one premium digital growth experience.",
    heroImage: "/assets/hero.png",
    heroLogo: "/assets/zee-brows-official-logo-cutout.webp"
  },
  stages: [
    {
      key: "strategy",
      kicker: "Stage 01",
      title: "Strategy",
      word: "STRATEGY",
      text: "Insight-led planning shapes the direction before a single post, ad, website, or video goes live.",
      image: "/assets/stage-strategy.png"
    },
    {
      key: "social",
      kicker: "Stage 02",
      title: "Social Media",
      word: "CREATE",
      text: "The brand system opens into content calendars, reels, post grids, stories, and engagement signals.",
      image: "/assets/stage-social.png"
    },
    {
      key: "ads",
      kicker: "Stage 03",
      title: "Google Ads",
      word: "LAUNCH",
      text: "Search intent, conversion tracking, remarketing, and campaign intelligence turn attention into action.",
      image: "/assets/stage-google-ads.png"
    },
    {
      key: "websites",
      kicker: "Stage 04",
      title: "Websites",
      word: "BUILD",
      text: "Campaign energy becomes fast, responsive, conversion-focused websites and landing experiences.",
      image: "/assets/stage-websites.png"
    },
    {
      key: "branding",
      kicker: "Stage 05",
      title: "Branding",
      word: "DESIGN",
      text: "Identity, colors, layouts, visual direction, and creative systems make every touchpoint feel premium.",
      image: "/assets/stage-branding.png"
    },
    {
      key: "video",
      kicker: "Stage 06",
      title: "Video Production",
      word: "EDIT",
      text: "Video timelines, motion graphics, ad creatives, and short-form stories bring the message into motion.",
      image: "/assets/stage-video.png"
    },
    {
      key: "growth",
      kicker: "Stage 07",
      title: "Growth",
      word: "GROW",
      text: "Everything connects into one digital growth ecosystem: strategy, content, ads, websites, branding, and optimization.",
      image: "/assets/stage-growth.png"
    }
  ],
  metrics: [
    { number: "100+", label: "Creative Projects Delivered" },
    { number: "10+", label: "Industries Served" },
    { number: "5+", label: "Countries Reached" },
    { number: "500+", label: "Digital Assets Created" },
    { number: "Global", label: "Local & International Brand Experience" }
  ],
  services: [
    {
      title: "Social Media Marketing",
      slug: "social-media-marketing",
      short: "Creative content, consistent publishing, engagement, and growth-focused reporting.",
      description:
        "We manage and grow your social media presence with creative content, strategic planning, consistent posting, audience engagement, and performance tracking.",
      visual: "/assets/services.png"
    },
    {
      title: "Google Ads Management",
      slug: "google-ads-management",
      short: "Lead, sales, call, and traffic campaigns built around measurable performance.",
      description:
        "We create, manage, and optimize Google Ads campaigns designed to generate leads, sales, calls, website traffic, and measurable business growth.",
      visual: "/assets/stage-google-ads.png"
    },
    {
      title: "SEO Services",
      slug: "seo-services",
      short: "Search visibility improved through technical, local, content, and keyword strategy.",
      description:
        "We improve your website visibility on search engines through keyword strategy, technical SEO, content optimization, local SEO, and performance tracking.",
      visual: "/assets/services.png"
    },
    {
      title: "Website Development",
      slug: "website-development",
      short: "Modern, responsive, conversion-focused websites built to generate trust and leads.",
      description:
        "We design and develop modern, responsive, conversion-focused websites that help businesses build trust and generate leads.",
      visual: "/assets/stage-websites.png"
    },
    {
      title: "Branding & Creative Design",
      slug: "branding-creative-design",
      short: "Professional identity systems, social branding, packaging, and marketing materials.",
      description:
        "We create strong brand identities that help businesses look professional, memorable, and trustworthy.",
      visual: "/assets/stage-branding.png"
    },
    {
      title: "Video Production",
      slug: "video-production",
      short: "Scroll-stopping reels, ad creatives, motion graphics, promos, and brand stories.",
      description:
        "We create scroll-stopping video content designed for social media, ads, brand storytelling, and digital campaigns.",
      visual: "/assets/stage-video.png"
    }
  ],
  projects: [
    {
      name: "Leo Brand UK",
      industry: "International Brand",
      service: "Branding and campaign creative",
      result: "A sharper brand presentation for an overseas audience.",
      image: "/assets/portfolio-contact.png"
    },
    {
      name: "Go Local Extra Wargrave UK",
      industry: "Retail / Convenience Store",
      service: "Social media, Meta ads, local promotion",
      result: "Improved local visibility, stronger social presence, and better customer engagement.",
      image: "/assets/portfolio-contact.png"
    },
    {
      name: "Divine Metier",
      industry: "Lifestyle / Professional Services",
      service: "Brand identity and social media creative",
      result: "Premium visual direction with a clearer digital voice.",
      image: "/assets/portfolio-contact.png"
    }
  ],
  contact: {
    email: "hello@zeebrows.com",
    phone: "+94 77 000 0000",
    whatsapp: "+94 77 000 0000",
    address: "Main Road, Thavasikulam, Vavuniya, Sri Lanka",
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    tiktok: "#",
    youtube: "#"
  },
  seo: {
    title: "Zee Brows | Digital Marketing, Branding & Website Development Agency",
    description:
      "Zee Brows is a creative digital marketing agency helping businesses grow through social media marketing, Google Ads, SEO, website development, branding, and video production.",
    keywords:
      "Digital marketing agency Sri Lanka, Digital marketing company Sri Lanka, Social media marketing Sri Lanka, Google Ads agency Sri Lanka, Website development Sri Lanka, Branding agency Sri Lanka, Video production Sri Lanka, Digital marketing Vavuniya"
  },
  messages: []
};

export function mergeContent(content) {
  return {
    ...defaultContent,
    ...(content || {}),
    home: { ...defaultContent.home, ...(content?.home || {}) },
    contact: { ...defaultContent.contact, ...(content?.contact || {}) },
    seo: { ...defaultContent.seo, ...(content?.seo || {}) },
    stages: content?.stages?.length ? content.stages : defaultContent.stages,
    metrics: content?.metrics?.length ? content.metrics : defaultContent.metrics,
    services: content?.services?.length ? content.services : defaultContent.services,
    projects: content?.projects?.length ? content.projects : defaultContent.projects,
    messages: content?.messages || []
  };
}
