// Shared project data
const PROJECTS = [
  { id: 'pixel', num: '01', title: 'Pixel Painter', stack: ['JS', 'Canvas'], year: 2024, tag: 'Tool', img: 'assets/images/pixel_painter.jpg', url: 'https://pedroalves-dv.github.io/pixelpainter/', desc: 'Interactive pixel art tool. Click/drag drawing, grid customization, image-to-pixel, eyedropper.', role: 'Design + Build', x: 40, y: 80, w: 360, h: 240 },
  { id: 'meridian', num: '02', title: 'Meridian', stack: ['Next.js', 'TS'], year: 2024, tag: 'Product', img: 'assets/images/meridian-time1.jpg', url: 'https://meridian-time.vercel.app/', desc: 'World time zone explorer for distributed teams. Live clocks, customizable timezone dashboard, visual timeline.', role: 'Design + Build', x: 440, y: 80, w: 360, h: 240 },
  { id: 'shop', num: '03', title: 'Shop Prototype', stack: ['Next.js', 'Shopify'], year: 2024, tag: 'Commerce', img: null, url: 'https://shop-tawny-iota-46.vercel.app/', desc: 'Headless e-commerce with Shopify. Product listings, cart, checkout flow.', role: 'Build', x: 840, y: 80, w: 360, h: 240 },
  { id: 'swap', num: '04', title: 'SwapSense', stack: ['JS', 'API'], year: 2023, tag: 'Utility', img: 'assets/images/swap-sense-white.png', url: 'https://pedroalves-dv.github.io/swap-sense/', desc: 'Currency converter with spending-power comparisons for travelers and expats.', role: 'Design + Build', x: 40, y: 360, w: 560, h: 240 },
  { id: 'rpg', num: '05', title: 'Dragon Slayer', stack: ['JS'], year: 2023, tag: 'Game', img: 'assets/images/rpg-ipad.png', url: 'https://pedroalves-dv.github.io/dragon-repeller/', desc: 'Browser-based RPG. Locations, battles, dragon boss. Pure vanilla JS.', role: 'Build', x: 640, y: 360, w: 560, h: 240 },
];

window.PORTFOLIO_PROJECTS = PROJECTS;
