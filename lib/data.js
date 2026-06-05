import {
  BarChart3,
  Blocks,
  CalendarDays,
  Clapperboard,
  Code2,
  Compass,
  FileBarChart,
  Globe2,
  LineChart,
  Megaphone,
  Palette,
  Rocket,
  Search,
  Share2,
  Target,
  Video
} from "lucide-react";

export const services = [
  {
    title: "Social Media Marketing",
    slug: "social-media-marketing",
    icon: Share2,
    short: "Creative content, consistent publishing, engagement, and growth-focused reporting.",
    description:
      "We manage and grow your social media presence with creative content, strategic planning, consistent posting, audience engagement, and performance tracking.",
    includes: [
      "Monthly content calendar",
      "Post design",
      "Reels and short videos",
      "Caption writing",
      "Page management",
      "Community engagement",
      "Campaign planning",
      "Analytics reports"
    ],
    visual: "/assets/services.png"
  },
  {
    title: "Google Ads Management",
    slug: "google-ads-management",
    icon: Target,
    short: "Lead, sales, call, and traffic campaigns built around measurable performance.",
    description:
      "We create, manage, and optimize Google Ads campaigns designed to generate leads, sales, calls, website traffic, and measurable business growth.",
    includes: [
      "Search Ads",
      "Display Ads",
      "YouTube Ads",
      "Performance Max",
      "Remarketing",
      "Keyword research",
      "Conversion tracking",
      "Monthly reporting"
    ],
    visual: "/assets/services.png"
  },
  {
    title: "SEO Services",
    slug: "seo-services",
    icon: Search,
    short: "Search visibility improved through technical, local, content, and keyword strategy.",
    description:
      "We improve your website visibility on search engines through keyword strategy, technical SEO, content optimization, local SEO, and performance tracking.",
    includes: ["Keyword research", "On-page SEO", "Technical SEO", "Local SEO", "Blog strategy", "SEO audits", "Monthly reports"],
    visual: "/assets/services.png"
  },
  {
    title: "Website Development",
    slug: "website-development",
    icon: Code2,
    short: "Modern, responsive, conversion-focused websites built to generate trust and leads.",
    description:
      "We design and develop modern, responsive, conversion-focused websites that help businesses build trust and generate leads.",
    includes: [
      "Business websites",
      "Landing pages",
      "Ecommerce websites",
      "Portfolio websites",
      "Booking websites",
      "Web applications",
      "Mobile responsive design",
      "SEO-friendly development"
    ],
    visual: "/assets/about.png"
  },
  {
    title: "Branding & Creative Design",
    slug: "branding-creative-design",
    icon: Palette,
    short: "Professional identity systems, social branding, packaging, and marketing materials.",
    description:
      "We create strong brand identities that help businesses look professional, memorable, and trustworthy.",
    includes: ["Logo design", "Brand identity", "Brand guidelines", "Social media branding", "Poster design", "Packaging design", "Marketing materials"],
    visual: "/assets/about.png"
  },
  {
    title: "Video Production",
    slug: "video-production",
    icon: Video,
    short: "Scroll-stopping reels, ad creatives, motion graphics, promos, and brand stories.",
    description:
      "We create scroll-stopping video content designed for social media, ads, brand storytelling, and digital campaigns.",
    includes: ["Reels", "TikTok videos", "YouTube videos", "Promo videos", "Motion graphics", "Ad creatives", "Product videos", "Editing and color grading"],
    visual: "/assets/portfolio-contact.png"
  }
];

export const extraServices = [
  { title: "Lead Generation", icon: Rocket, text: "Conversion-led funnels that attract the right prospects." },
  { title: "Business Growth Strategy", icon: Compass, text: "Planning that connects creative direction with commercial goals." },
  { title: "Analytics", icon: BarChart3, text: "Clear reporting across campaigns, assets, and outcomes." },
  { title: "Content Calendar", icon: CalendarDays, text: "Consistent scheduling with creative momentum." },
  { title: "Reporting", icon: FileBarChart, text: "Monthly performance visibility and next-step recommendations." },
  { title: "Creative Design", icon: Blocks, text: "Premium visuals for every brand touchpoint." },
  { title: "Growth", icon: LineChart, text: "Compounding improvements through testing and optimization." },
  { title: "Conversion", icon: Megaphone, text: "Campaigns built around action, not vanity." }
];

export const projects = [
  ["Leo Brand UK", "International Brand", "Branding and campaign creative", "A sharper brand presentation for an overseas audience."],
  ["Go Local Extra Wargrave UK", "Retail / Convenience Store", "Social media, Meta ads, local promotion", "Improved local visibility, stronger social presence, and better customer engagement."],
  ["Divine Metier", "Lifestyle / Professional Services", "Brand identity and social media creative", "Premium visual direction with a clearer digital voice."],
  ["MNKT International", "International Business", "Digital brand support", "Consistent campaign assets for cross-market communication."],
  ["Hechbee International", "Ecommerce / Consumer", "Creative assets and marketing support", "More polished digital touchpoints for product promotion."],
  ["One Piece", "Creative Project", "Content and campaign visuals", "Distinct digital assets with stronger visual memorability."],
  ["Fiverr Projects", "Global Freelance", "Web, branding, social, and video work", "Flexible creative delivery for international clients."]
].map(([name, industry, service, result]) => ({ name, industry, service, result }));

export const industries = [
  "Retail",
  "Ecommerce",
  "Travel",
  "Education",
  "Healthcare",
  "Real Estate",
  "Finance",
  "Restaurants",
  "Local Businesses",
  "International Brands"
];

export const metrics = [
  ["100+", "Creative Projects Delivered"],
  ["10+", "Industries Served"],
  ["5+", "Countries Reached"],
  ["500+", "Digital Assets Created"],
  ["Global", "Local & International Brand Experience"]
];
