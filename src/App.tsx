/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
  MessageSquare,
  ArrowUpRight,
  Star
} from 'lucide-react';

// --- Types ---

interface NavLink {
  label: string;
  href: string;
}

interface StepCard {
  title: string;
  description: string;
  image?: string;
  content?: React.ReactNode;
}

interface BenefitCard {
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  logo: string;
  avatar: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tighter">
          afferex<span className="text-brand-orange">™</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-sm font-medium hover:text-brand-orange transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#login" className="text-sm font-medium hover:text-brand-orange transition-colors">Login</a>
          <button className="px-6 py-3 bg-brand-cream text-brand-black rounded-full text-sm font-bold hover:bg-white transition-all transform hover:scale-105">
            Book a call
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-brand-black z-40 flex flex-col items-center justify-center gap-8 p-6"
          >
            <button 
              className="absolute top-8 right-6 p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="text-3xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col items-center gap-4 mt-8 w-full">
              <a href="#login" className="text-xl font-medium">Login</a>
              <button className="w-full py-4 bg-brand-cream text-brand-black rounded-full text-lg font-bold">
                Book a call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] uppercase tracking-[0.2em] text-brand-muted font-bold mb-6">
    {children}
  </div>
);

const StackedHeading = ({ lines }: { lines: string[] }) => (
  <h2 className="text-display text-[8vw] md:text-[6vw] lg:text-[5vw] mb-8 leading-[1.1]">
    {lines.map((line, i) => (
      <motion.span 
        key={i}
        className="inline-block mr-[0.3em]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      >
        {line}
      </motion.span>
    ))}
  </h2>
);

const Marquee = ({ items, reverse = false, speed = 30 }: { items: string[], reverse?: boolean, speed?: number }) => {
  const { scrollYProgress } = useScroll();
  const skew = useTransform(scrollYProgress, [0, 1], [0, reverse ? -10 : 10]);

  return (
    <div className="marquee-container py-12 border-y border-white/5 overflow-hidden relative">
      <motion.div 
        style={{ skewX: skew }}
        animate={{ x: reverse ? [0, -1000] : [-1000, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-6 px-12">
            <span className="text-4xl md:text-6xl font-display font-bold outline-text opacity-40 hover:opacity-100 hover:text-brand-orange transition-all duration-500 cursor-default uppercase tracking-tighter hover:scale-110 inline-block">
              {item}
            </span>
            <div className="w-3 h-3 bg-brand-orange rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

// --- Types ---
// ... (previous types)

// --- Gemini Initialization ---
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number, key?: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  );
};

const CursorGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      animate={{
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 107, 53, 0.05), transparent 80%)`
      }}
    />
  );
};

const EyeGraphic = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const calculateEyePosition = (eyeCenterX: number, eyeCenterY: number) => {
    const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);
    const distance = Math.min(
      Math.hypot(mousePos.x - eyeCenterX, mousePos.y - eyeCenterY) / 10,
      6 // Max movement within socket
    );
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  const [eyePositions, setEyePositions] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const leftEyeX = rect.left + rect.width * 0.3;
    const leftEyeY = rect.top + rect.height * 0.5;
    const rightEyeX = rect.left + rect.width * 0.6;
    const rightEyeY = rect.top + rect.height * 0.5;

    setEyePositions({
      left: calculateEyePosition(leftEyeX, leftEyeY),
      right: calculateEyePosition(rightEyeX, rightEyeY)
    });
  }, [mousePos]);

  return (
    <div 
      ref={containerRef} 
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] translate-x-1/2 hover:translate-x-0 transition-transform duration-500"
    >
      <motion.div 
        className="w-32 h-24 bg-brand-dark border border-white/10 rounded-l-full flex items-center justify-center gap-3 pl-6 pr-4 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-brand-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Left Eye Socket */}
        <div className="w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]">
          <motion.div 
            animate={{ x: eyePositions.left.x, y: eyePositions.left.y }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-5 h-5 bg-brand-black rounded-full relative"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1 opacity-80" />
          </motion.div>
          <motion.div 
            animate={{ height: ["0%", "0%", "100%", "0%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1] }}
            className="absolute top-0 left-0 w-full bg-brand-dark z-10"
          />
        </div>

        {/* Right Eye Socket */}
        <div className="w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]">
          <motion.div 
            animate={{ x: eyePositions.right.x, y: eyePositions.right.y }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-5 h-5 bg-brand-black rounded-full relative"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1 opacity-80" />
          </motion.div>
          <motion.div 
            animate={{ height: ["0%", "0%", "100%", "0%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1] }}
            className="absolute top-0 left-0 w-full bg-brand-dark z-10"
          />
        </div>
      </motion.div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cyclingWord, setCyclingWord] = useState('logo');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('Standard (Flash)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hey! Got any questions about how afferex works or need design advice? I'm here to help." }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const modelName = quality === 'Standard (Flash)' ? 'gemini-3.1-flash-image-preview' : 'gemini-3-pro-image-preview';
      const imageSize = quality === 'Standard (Flash)' ? '1K' : (quality === 'Studio (Pro 1K)' ? '1K' : '4K');
      
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: imageSize as any
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage) return;
    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          ...chatHistory.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: "You are Peter, the founder of afferex™. You are a world-class designer with 20 years of experience. You are helpful, professional, and have a keen eye for minimalist aesthetics. You provide design advice and answer questions about afferex's subscription model.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          tools: [{ googleSearch: {} }]
        }
      });

      const modelResponse = response.text || "I'm sorry, I couldn't process that. Could you try again?";
      setChatHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const words = ['logo', 'animation', 'website', 'social post', 'branding'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCyclingWord(prev => {
        const currentIndex = words.indexOf(prev);
        return words[(currentIndex + 1) % words.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      id: 'branding',
      label: 'Branding',
      title: 'Branding that stands out',
      description: "A strong brand is more than just a logo. It's the foundation of how your business is perceived and remembered. I help you build a visual identity that resonates with your audience and stands the test of time.",
      tags: ['Visual identities', 'Logos', 'Brand guidelines', 'Icons', 'Illustrations', 'Merch', 'Packaging', 'Signage', 'Corporate stationary', 'Apparel'],
      image: 'https://picsum.photos/seed/branding-mockup/800/600'
    },
    {
      id: 'websites',
      label: 'Websites',
      title: 'Websites that convert visitors',
      description: "Designing compelling, goal-driven websites that don't just look good but perform. From landing pages to complex design systems, I ensure your digital presence is as functional as it is beautiful.",
      tags: ['Web design', 'App design', 'Product design', 'Design systems', 'Landing pages', 'Sitemaps', 'Wireframes', 'UX/UI', 'Framer development'],
      image: 'https://picsum.photos/seed/web-mockup/800/600'
    },
    {
      id: 'animations',
      label: 'Animations',
      title: 'Animations that move your audience',
      description: "Motion design adds a layer of depth to your brand. Whether it's a logo reveal or a full branding reel, I bring your ideas to life with smooth, purposeful animation.",
      tags: ['Branding reels', 'Web animations', 'Explainers', 'Logo reveals', 'Animated icons', 'Social media', 'Product videos', 'Motion graphics', '2D & 3D'],
      image: 'https://picsum.photos/seed/motion-mockup/800/600'
    },
    {
      id: 'marketing',
      label: 'Marketing Assets',
      title: 'Marketing Assets that drive your sales',
      description: "Consistent marketing assets are key to scaling. I provide everything from pitch decks to social graphics, ensuring your brand stays cohesive across all touchpoints.",
      tags: ['Campaigns', 'Presentations', 'Newsletters', 'Online banners', 'Social media', 'Digital ads', 'Infographics', 'Print design', '+ much more!'],
      image: 'https://picsum.photos/seed/marketing-mockup/800/600'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "afferex has completely transformed how we handle design. The speed and quality are unmatched. It's like having a senior designer on staff without the overhead.",
      author: "Joris Nieuwenhuis",
      role: "Founder",
      company: "EventGoose",
      logo: "https://picsum.photos/seed/logo1/100/40",
      avatar: "https://picsum.photos/seed/avatar1/100/100"
    },
    {
      quote: "The unlimited revisions and fixed monthly rate give us peace of mind. Peter's eye for detail is incredible, and he always delivers on time.",
      author: "Gijs Haccou",
      role: "CEO",
      company: "NUX",
      logo: "https://picsum.photos/seed/logo2/100/40",
      avatar: "https://picsum.photos/seed/avatar2/100/100"
    },
    {
      quote: "I've worked with many agencies, but none are as efficient as afferex. The personal portal makes managing requests a breeze.",
      author: "Marinus Klasen",
      role: "Creative Director",
      company: "Shop Maestro",
      logo: "https://picsum.photos/seed/logo3/100/40",
      avatar: "https://picsum.photos/seed/avatar3/100/100"
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: "Wouldn't it be smarter to just hire a full-time designer?",
      answer: "A senior-level designer now costs over ₹10,00,000 per year, plus benefits. Aside from that, you may not always have enough work to keep them busy at all times, so you're stuck paying for time you aren't able to utilize. With our flexible model, you only pay when you have work available."
    },
    {
      question: "How do I request a new design?",
      answer: "afferex offers a ton of flexibility in how you request designs using Trello. Some common ways clients request designs is directly via Trello, sharing Google docs or wireframes, or even recording a brief Loom video (for those who prefer not to write their briefs out). Basically, if it can be linked to or shared in Trello, it's fair game."
    },
    {
      question: "Is there a limit to how many designs I can request?",
      answer: "Once subscribed, you're able to add as many design requests to your queue as you'd like, and they will be delivered one by one."
    },
    {
      question: "How fast will I receive my designs?",
      answer: "On average, most requests are completed in just two days or less. However, more complex requests can take longer."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative overflow-x-hidden">
      <CursorGlow />
      <Navbar />
      <EyeGraphic />
      
      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Glow Background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-brand-orange/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl w-full text-center md:text-left relative z-10">
          <h1 className="text-display text-[10vw] md:text-[8vw] lg:text-[7vw] mb-12 leading-[1.1]">
            <motion.span className="inline-block mr-[0.3em]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>Handcrafted</motion.span>
            <motion.span className="inline-block mr-[0.3em]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>designs</motion.span>
            <motion.span className="inline-block mr-[0.3em]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>for</motion.span>
            <motion.span className="inline-block mr-[0.3em]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>fast-growing</motion.span>
            <motion.span className="inline-block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>businesses</motion.span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-md text-lg md:text-xl text-brand-cream/70 font-medium leading-relaxed"
            >
              Easy & efficient all-in-one design support to quickly scale your brand.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-8 py-4 bg-brand-cream text-brand-black rounded-full font-bold hover:bg-white transition-all transform hover:scale-105">
                Book a free call
              </button>
              <button className="px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-all">
                How it works
              </button>
            </motion.div>
          </div>
        </div>

        {/* Slogan Marquee */}
        <div className="mt-24 w-full">
          <Marquee items={['Pixel Perfect', 'High Performance', 'Modern Aesthetic', 'Scalable Design', 'User Centric', 'Brand Identity']} />
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto relative">
        <FadeUp>
          <SectionLabel>How it works</SectionLabel>
          <StackedHeading lines={['Designs', 'whenever', 'you', 'need', 'them']} />
        </FadeUp>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { 
              step: '01', 
              title: 'Join', 
              desc: 'No need to wait. You can join and start requesting designs today!',
              img: 'https://picsum.photos/seed/join/600/400'
            },
            { 
              step: '02', 
              title: 'Request', 
              desc: "Request any designs you need, and I'll start delivering them one by one.",
              content: (
                <div className="bg-brand-black/40 rounded-xl p-4 border border-white/5 h-full overflow-hidden">
                  <div className="flex flex-col gap-2">
                    {['Logo concepts', 'Branding package', 'Landing page', 'Product animation'].map((item, i) => (
                      <div key={i} className="bg-brand-dark p-3 rounded-lg border border-white/10 flex items-center justify-between">
                        <span className="text-xs font-medium">{item}</span>
                        <div className="w-6 h-6 rounded-full bg-brand-orange/20 border border-brand-orange/30" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            { 
              step: '03', 
              title: 'Receive', 
              desc: 'Each design is delivered within only two business days on average.',
              img: 'https://picsum.photos/seed/receive/600/400'
            }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-dark p-8 rounded-brand border border-white/5 flex flex-col h-[450px] hover:border-brand-orange/30 transition-colors group"
            >
              <div className="text-brand-orange font-bold mb-4">{card.step}</div>
              <h3 className="text-3xl font-bold mb-4">{card.title}</h3>
              <p className="text-brand-cream/60 mb-8 text-sm leading-relaxed">{card.desc}</p>
              <div className="mt-auto flex-grow overflow-hidden rounded-xl">
                {card.img ? (
                  <img src={card.img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                ) : card.content}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-dark p-8 rounded-brand border border-white/5">
            <h3 className="text-2xl font-bold mb-4">Jump in worry-free</h3>
            <p className="text-brand-cream/60 text-sm leading-relaxed">
              All the risks are removed. You can pause or cancel anytime. Plus, the 7-day tryout period has you covered.
            </p>
          </div>
          <div className="bg-brand-dark p-8 rounded-brand border border-white/5">
            <h3 className="text-2xl font-bold mb-4">Get started today</h3>
            <p className="text-brand-cream/60 text-sm leading-relaxed">
              No complicated contracts, tiresome onboarding or tedious price negotiations. I'm ready to begin right now!
            </p>
          </div>
        </div>
      </section>

      {/* --- Membership Benefits --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
        <FadeUp>
          <SectionLabel>Membership benefits</SectionLabel>
          <StackedHeading lines={['Great', 'designs,', 'greater', 'speed']} />
        </FadeUp>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Premium craftsmanship', desc: 'Guaranteed high-quality designs that are unique & handmade to fit your brand.' },
            { title: 'Ultra-fast delivery', desc: 'Receive your designs in just two business days on average, or sometimes even sooner!' },
            { title: 'Clear progress overview', desc: 'Easily manage your requests through your personal portal as I deliver them one by one.' },
            { title: 'Fixed monthly rate', desc: 'No surprises or discussions about invoices. You pay the same fixed price each month.' },
            { title: 'Unlimited revisions', desc: "I'll keep refining the design until it aligns perfectly with your vision and goals." },
            { title: 'Flexible if needed', desc: 'You can pause or cancel anytime you like. No unused subscription time goes to waste!' }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-brand-dark p-10 rounded-brand border border-white/5 hover:border-brand-orange/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-orange/20 transition-colors">
                <Check className="text-brand-orange" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-brand-cream/60 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Services Section --- */}
      <section id="services" className="py-32 px-6 max-w-7xl mx-auto">
        <FadeUp>
          <SectionLabel>Included services</SectionLabel>
          <h2 className="text-display text-[8vw] md:text-[6vw] mb-12">
            Request your next <br />
            <span className="relative inline-block bg-brand-orange text-brand-black px-4 py-1 mt-2 transform -rotate-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={cyclingWord}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {cyclingWord}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
        </FadeUp>

        <div className="flex flex-wrap gap-4 mb-12">
          {services.map((service, i) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === i ? 'bg-brand-cream text-brand-black' : 'bg-brand-dark text-brand-cream/50 hover:text-brand-cream'}`}
            >
              {service.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-4xl font-bold mb-6">{services[activeTab].title}</h3>
            <p className="text-brand-cream/60 text-lg leading-relaxed mb-8">
              {services[activeTab].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {services[activeTab].tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-brand-dark rounded-full text-xs font-medium border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            key={`img-${activeTab}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[4/3] bg-brand-dark rounded-brand overflow-hidden border border-white/5"
          >
            <img src={services[activeTab].image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative">
        <FadeUp>
          <SectionLabel>About us</SectionLabel>
        </FadeUp>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-brand-dark rounded-brand overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 relative group">
                <img src="https://picsum.photos/seed/parth/600/800" alt="Parth Betai" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="text-center">
                <div className="font-bold">Parth Betai</div>
                <div className="text-xs text-brand-muted uppercase tracking-widest">Co-Founder</div>
              </div>
            </div>
            <div className="space-y-4 mt-12">
              <div className="aspect-[3/4] bg-brand-dark rounded-brand overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 relative group">
                <img src="https://picsum.photos/seed/parvez/600/800" alt="Parvez Hussain" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="text-center">
                <div className="font-bold">Parvez Hussain</div>
                <div className="text-xs text-brand-muted uppercase tracking-widest">Co-Founder</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <FadeUp delay={0.2}>
              <StackedHeading lines={['Meet', 'the', 'founders']} />
              <p className="text-brand-cream/60 text-lg leading-relaxed mb-6">
                Welcome to afferex™! We are Parth Betai and Parvez Hussain, the creative minds behind this studio. With a shared passion for design excellence and technological innovation, we've built a studio that bridges the gap between artistic vision and business growth.
              </p>
              <p className="text-brand-cream/60 text-lg leading-relaxed">
                Our mission is simple: to provide fast-growing businesses with the high-end design support they need to dominate their markets. We don't just create visuals; we build brand legacies.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full" />
        <FadeUp>
          <SectionLabel>Client testimonials</SectionLabel>
          <div className="mb-16">
            <h2 className="text-display text-[8vw] md:text-[6vw] leading-tight">
              Trusted by <br />
              <span className="text-brand-orange">amazing brands</span>
            </h2>
          </div>
        </FadeUp>

        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-12 snap-x">
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-[350px] md:min-w-[450px] bg-brand-dark p-10 rounded-brand border border-white/5 snap-center flex flex-col">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-brand-orange text-brand-orange" />)}
              </div>
              <p className="text-xl font-medium mb-12 leading-relaxed italic">"{t.quote}"</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt="" className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-bold">{t.author}</div>
                    <div className="text-xs text-brand-muted">{t.role}, {t.company}</div>
                  </div>
                </div>
                <img src={t.logo} alt="" className="h-6 opacity-50 grayscale" referrerPolicy="no-referrer" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Pricing --- */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto relative">
        <FadeUp>
          <SectionLabel>Membership pricing</SectionLabel>
          <StackedHeading lines={['The', 'all-in-one', 'solution']} />
        </FadeUp>
        
        <div className="relative mt-20">
          {/* Main Pricing Card */}
          <FadeUp delay={0.2}>
            <div className="max-w-2xl mx-auto bg-brand-dark rounded-[40px] p-12 border border-white/10 relative overflow-hidden">
              <div className="absolute top-8 right-8 bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Spots available
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-2">Custom Solutions</h3>
                <p className="text-brand-muted text-sm">Tailored design support for your unique business needs.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-brand-orange font-bold text-xl mb-1">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-muted">Satisfaction</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-brand-orange font-bold text-xl mb-1">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-muted">Support</div>
                </div>
              </div>

            <div className="space-y-4 mb-12">
              {[
                'Ongoing design support',
                'Access to personal portal',
                'Updates every 48 hours',
                'Defined goals & deadlines',
                'Unlimited revisions',
                'Pause or cancel anytime'
              ].map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand-orange/20 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-brand-orange" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-5 bg-brand-cream text-brand-black rounded-full font-bold text-lg hover:bg-white transition-all transform hover:scale-[1.02]">
              Book a free call
            </button>
          </div>
        </FadeUp>

        {/* Side Ticker */}
          <div className="hidden xl:block absolute top-1/2 -left-32 -translate-y-1/2 w-48 h-96 overflow-hidden pointer-events-none opacity-20">
            <div className="vertical-marquee space-y-4">
              {['Logos', 'Websites', 'Apps', 'Mockups', 'Icons', 'Banners', 'Ads', 'Reels', 'Decks', 'Social'].map(tag => (
                <div key={tag} className="px-4 py-2 border border-white/20 rounded-full text-xs text-center">{tag}</div>
              ))}
              {/* Duplicate */}
              {['Logos', 'Websites', 'Apps', 'Mockups', 'Icons', 'Banners', 'Ads', 'Reels', 'Decks', 'Social'].map(tag => (
                <div key={`dup-${tag}`} className="px-4 py-2 border border-white/20 rounded-full text-xs text-center">{tag}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { title: 'Pause anytime', desc: 'Taking a break? No worries! Hit pause whenever you need.' },
            { title: 'Try it for 7 days', desc: 'Experience my services risk-free. Cancel within the first 7 days and get 75% back.' },
            { title: 'Free introduction', desc: 'Book a free 30-minute introduction call to see if we are a match.' }
          ].map((item, i) => (
            <div key={i} className="bg-brand-dark p-8 rounded-brand border border-white/5">
              <h4 className="font-bold mb-3">{item.title}</h4>
              <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Comparison Section --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <FadeUp>
          <SectionLabel>Comparing options</SectionLabel>
          <StackedHeading lines={['Why', 'it', 'just', 'makes', 'sense']} />
          <p className="text-brand-muted mt-4">
            If you're wondering about other options, I've made it easy! See how afferex™ compares to hiring in-house or a pricey agency.
          </p>
        </FadeUp>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-20 border border-white/5 rounded-brand overflow-hidden">
          {/* Hiring */}
          <div className="p-10 bg-brand-dark/50 border-r border-white/5">
            <h4 className="text-xl font-bold mb-8 opacity-50">Hiring a designer</h4>
            <ul className="space-y-6 text-sm text-brand-muted">
              <li>Salary up to ₹10,00,000/year</li>
              <li>Specialized in one division</li>
              <li>Long time to find candidate</li>
              <li>Training & supply costs</li>
              <li>Pay for idle time</li>
            </ul>
          </div>

          {/* afferex */}
          <div className="p-10 bg-brand-cream text-brand-black relative z-10 transform scale-105 shadow-2xl rounded-brand">
            <h4 className="text-xl font-bold mb-8">afferex™</h4>
            <ul className="space-y-6 text-sm font-medium">
              <li className="flex items-center gap-2"><Check size={16} /> Flexible Pricing</li>
              <li className="flex items-center gap-2"><Check size={16} /> Brand, graphic, web & motion</li>
              <li className="flex items-center gap-2"><Check size={16} /> Priority Support</li>
              <li className="flex items-center gap-2"><Check size={16} /> Unlimited revisions</li>
              <li className="flex items-center gap-2"><Check size={16} /> Cancel anytime</li>
            </ul>
            <button className="w-full mt-12 py-4 bg-brand-black text-brand-cream rounded-full font-bold hover:scale-105 transition-transform">
              Contact for Quote
            </button>
          </div>

          {/* Agency */}
          <div className="p-10 bg-brand-dark/50 border-l border-white/5">
            <h4 className="text-xl font-bold mb-8 opacity-50">Traditional agencies</h4>
            <ul className="space-y-6 text-sm text-brand-muted">
              <li>Exceeds ₹10,00,000/project</li>
              <li>Different person per specialization</li>
              <li>Long waiting times</li>
              <li>High unforeseen revision costs</li>
              <li>No pause/cancel option</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- Design Philosophy Section --- */}
      <section id="philosophy" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-brand-orange/5 to-transparent -z-10" />
        <SectionLabel>Our Philosophy</SectionLabel>
        <StackedHeading lines={['Design', 'with', 'purpose']} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {[
            { title: 'Minimalism', desc: 'We believe in stripping away the unnecessary to reveal the essential. Clean lines, purposeful whitespace, and clear communication.' },
            { title: 'Innovation', desc: 'Staying ahead of design trends and leveraging the latest tools to ensure your brand always looks futuristic.' },
            { title: 'Collaboration', desc: 'We work as an extension of your team, ensuring our designs align perfectly with your business objectives.' }
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="bg-brand-dark p-10 rounded-brand border border-white/10 h-full">
                <div className="text-brand-orange font-display text-4xl mb-6">0{i+1}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-brand-muted leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="faq" className="py-32 px-6 max-w-7xl mx-auto">
        <FadeUp>
          <SectionLabel>Frequently asked questions</SectionLabel>
        </FadeUp>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <FadeUp delay={0.2}>
              <StackedHeading lines={['What', 'the', 'FAQ', '?!']} />
            </FadeUp>
            <div className="space-y-4 mt-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/10">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-6 flex items-center justify-between text-left hover:text-brand-orange transition-colors"
                  >
                    <span className="text-lg font-bold">{faq.question}</span>
                    {openFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-brand-muted leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-[300px] h-[600px] bg-brand-dark rounded-[40px] border-[8px] border-brand-black shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-brand-black rounded-b-2xl z-20" />
              <div className="p-6 pt-12 flex-grow overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-3 mb-8">
                  <img src="https://picsum.photos/seed/founders/100/100" alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  <div>
                    <div className="text-xs font-bold">Team afferex™</div>
                    <div className="text-[10px] text-green-500">Online</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'model' ? 'bg-brand-cream/10 rounded-tl-none' : 'bg-brand-orange text-brand-black font-bold rounded-tr-none ml-8'}`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isThinking && (
                    <div className="bg-brand-cream/10 p-4 rounded-2xl rounded-tl-none text-xs flex gap-1">
                      <span className="w-1 h-1 bg-brand-cream rounded-full animate-bounce" />
                      <span className="w-1 h-1 bg-brand-cream rounded-full animate-bounce delay-100" />
                      <span className="w-1 h-1 bg-brand-cream rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 bg-brand-dark border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..." 
                    className="w-full h-10 bg-white/5 rounded-full px-4 pr-10 text-[10px] focus:outline-none focus:bg-white/10 transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-orange hover:text-white transition-colors"
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section className="py-32 px-6 relative overflow-hidden">
        <FadeUp>
          <div className="max-w-7xl mx-auto">
            <StackedHeading lines={['Ready', 'to', 'reforge', 'your', 'brand?']} />
            <p className="text-brand-muted mt-4">
              Book a free 30-minute introduction call and discover how you can simplify obtaining quality designs to quickly scale your business.
            </p>
          </div>
        </FadeUp>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
            <FadeUp delay={0.2}>
              <div className="bg-brand-dark p-12 rounded-brand border border-white/10 flex flex-col items-start h-full">
                <h3 className="text-3xl font-bold mb-4">Book a free call</h3>
                <p className="text-brand-muted mb-8">Discover how afferex can help your business scale with premium design.</p>
                <button className="mt-auto px-8 py-4 bg-brand-cream text-brand-black rounded-full font-bold flex items-center gap-2 group">
                  Schedule now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="bg-brand-dark p-12 rounded-brand border border-white/10">
                <h3 className="text-3xl font-bold mb-8">Send a message</h3>
                <form className="space-y-4">
                  <input type="text" placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
                  <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
                  <textarea placeholder="Message" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand-orange transition-colors resize-none" />
                  <button className="w-full py-4 bg-brand-muted/20 text-brand-muted rounded-full font-bold text-sm cursor-not-allowed">
                    Please fill in all fields
                  </button>
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl font-bold mb-6">afferex<span className="text-brand-orange">™</span></div>
              <a href="mailto:hello@afferex.studio" className="text-xl hover:text-brand-orange transition-colors">hello@afferex.studio</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-sm text-brand-muted hover:text-brand-cream transition-colors">Client login</a>
              <a href="#" className="text-sm text-brand-muted hover:text-brand-cream transition-colors">Book a call</a>
              <a href="#" className="text-sm text-brand-muted hover:text-brand-cream transition-colors">Company info</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-sm text-brand-muted hover:text-brand-cream transition-colors">Terms & conditions</a>
              <a href="#" className="text-sm text-brand-muted hover:text-brand-cream transition-colors">Privacy policy</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-brand-muted font-bold">
            <div>Handcrafted in Edinburgh 🏴 by afferex™</div>
            <div>© 2026 All rights reserved</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
