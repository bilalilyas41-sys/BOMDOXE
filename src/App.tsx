/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  MapPin, 
  Instagram, 
  Facebook, 
  Menu as MenuIcon, 
  X, 
  ChevronRight, 
  Plus, 
  Minus, 
  Clock,
  UtensilsCrossed,
  GlassWater,
  Music,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'dish' | 'burger' | 'drink' | 'portion';
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// --- Data ---
const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Cachupa Rica',
    description: 'Tradicional de Cabo Verde. Milho, feijão, carnes variadas e legumes selecionados.',
    price: 18.50,
    category: 'dish',
    image: '/src/assets/images/hero_cachupa_1779174087052.png'
  },
  {
    id: '2',
    name: 'Feijoada Brasileira',
    description: 'O sabor autêntico do Brasil. Feijão preto, carnes salgadas, farofa e laranja.',
    price: 17.00,
    category: 'dish',
    image: '/src/assets/images/hero_feijoada_1779174110153.png'
  },
  {
    id: '3',
    name: 'Bom Doxe Burger',
    description: 'Hambúrguer artesanal, queijo cheddar, cebola caramelizada e molho especial.',
    price: 14.50,
    category: 'burger',
    image: '/src/assets/images/gourmet_burger_1779174191851.png'
  },
  {
    id: '4',
    name: 'Tábua de Salgados',
    description: 'Mix de pastéis, coxinhas e rissóis tradicionais para partilhar.',
    price: 12.00,
    category: 'portion',
    image: '/src/assets/images/cocktail_drinks_1779174241689.png'
  },
  {
    id: '5',
    name: 'Cocktail de Assinatura',
    description: 'Drink exclusivo preparado pelos nossos mixologistas.',
    price: 9.50,
    category: 'drink',
    image: '/src/assets/images/cocktail_drinks_1779174241689.png'
  }
];

// --- Components ---

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-4 md:gap-8 items-center justify-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-5xl font-black text-yellow-500">{timeLeft.days}</span>
        <span className="text-[10px] uppercase tracking-widest text-white/50">Dias</span>
      </div>
      <div className="text-2xl text-yellow-500/30">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-5xl font-black text-yellow-500">{timeLeft.hours}</span>
        <span className="text-[10px] uppercase tracking-widest text-white/50">Horas</span>
      </div>
      <div className="text-2xl text-yellow-500/30">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-5xl font-black text-yellow-500">{timeLeft.minutes}</span>
        <span className="text-[10px] uppercase tracking-widest text-white/50">Minutos</span>
      </div>
      <div className="text-2xl text-yellow-500/30 md:hidden">:</div>
      <div className="flex flex-col items-center hidden md:flex">
        <span className="text-3xl md:text-5xl font-black text-yellow-500">{timeLeft.seconds}</span>
        <span className="text-[10px] uppercase tracking-widest text-white/50">Segundos</span>
      </div>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white font-['Inter'] selection:bg-yellow-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 group px-4 py-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
             <div className="relative w-12 h-12 flex items-center justify-center">
                <UtensilsCrossed size={28} className="text-white absolute rotate-[-15deg] group-hover:rotate-[15deg] transition-transform duration-500" />
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl group-hover:bg-yellow-500/40 transition-all" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.4em] text-yellow-500 leading-none mb-1">J.A.</span>
                <span className="text-2xl font-black tracking-tighter text-white leading-none">BOM DOXE</span>
             </div>
          </div>

          <div className="hidden md:flex items-center gap-12 text-sm font-medium uppercase tracking-widest text-white/60">
            <a href="#menu" className="hover:text-yellow-500 transition-colors">Menu</a>
            <a href="#about" className="hover:text-yellow-500 transition-colors">O Conceito</a>
            <a href="#location" className="hover:text-yellow-500 transition-colors">Localização</a>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:text-yellow-500 transition-colors"
            >
              <ShoppingBag size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-white"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-black p-8 flex flex-col"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsMenuOpen(false)} className="p-2">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-4xl font-bold italic">
              <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>O Conceito</a>
              <a href="#location" onClick={() => setIsMenuOpen(false)}>Localização</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-md bg-zinc-950 border-l border-white/10 p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-tight">O Seu Pedido</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <p className="text-sm uppercase tracking-widest">Carrinho vazio</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="text-white/50 text-xs mt-1">{item.price.toFixed(2)}€</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-white/20 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-white/50 uppercase tracking-widest font-medium">Total Estimado</span>
                    <span className="text-3xl font-black text-yellow-500">{cartTotal.toFixed(2)}€</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert('Processando pedido... O sistema de pagamentos será integrado em breve!');
                    }}
                    className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Finalizar Pedido <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/nightclub_interior_1779174218309.png" 
            className="w-full h-full object-cover opacity-50" 
            alt="Interior" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <Clock size={14} /> Grande Inauguração: 30 de Maio
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
              BOM <span className="text-yellow-500 italic">DOXE</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              O melhor da culinária num só lugar. Cachupa, Feijoada, Burgueres e o espírito de festa que Corroios esperava.
            </p>

            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href="#menu"
                className="w-full md:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 transition-transform"
              >
                Ver Menu & Encomendar
              </a>
              <a 
                href="#location"
                className="w-full md:w-auto px-10 py-5 bg-transparent border border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/5 transition-colors"
              >
                Como Chegar
              </a>
            </div>

            <div className="pt-12">
              <Countdown targetDate="2026-05-30T20:00:00" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights / Features */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6 group">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500">
              <UtensilsCrossed size={32} />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight italic">Fusão de Sabores</h3>
            <p className="text-white/50 leading-relaxed">
              Da tradicional Cachupa de Cabo Verde à nossa Feijoada Brasileira premium. Uma viagem gastronómica sem sair de Corroios.
            </p>
          </div>
          <div className="space-y-6 group">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500">
              <GlassWater size={32} />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight italic">Mixologia & Bar</h3>
            <p className="text-white/50 leading-relaxed">
              Drinks exclusivos e porções para partilhar. O lugar perfeito para o seu sunset ou para começar a noite.
            </p>
          </div>
          <div className="space-y-6 group">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500">
              <Music size={32} />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight italic">Nightclub Aura</h3>
            <p className="text-white/50 leading-relaxed">
              Com um investimento de 100.000€, criámos um espaço de eleição. Luxo, modernidade e a melhor vibração musical.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px]">A Seleção BOM DOXE</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
                Menu de <br/><span className="text-zinc-800">Assinatura</span>
              </h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {['all', 'dish', 'burger', 'drink', 'portion'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                    activeCategory === cat 
                      ? "bg-yellow-500 text-black border-yellow-500" 
                      : "border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  {cat === 'all' ? 'Ver Todos' : cat === 'dish' ? 'Pratos' : cat === 'burger' ? 'Burgueres' : cat === 'drink' ? 'Drinks' : 'Petiscos'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MENU_ITEMS.filter(item => activeCategory === 'all' || item.category === activeCategory).map(item => (
              <motion.div 
                layout
                key={item.id}
                className="group relative bg-white/5 rounded-[2.5rem] p-4 border border-white/5 hover:border-yellow-500/20 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-zinc-900">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => addToCart(item)}
                    className="absolute bottom-6 right-6 p-4 bg-yellow-500 text-black rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all active:scale-90"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>
                
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold italic uppercase tracking-tight">{item.name}</h3>
                    <span className="text-yellow-500 font-black text-lg">{item.price.toFixed(2)}€</span>
                  </div>
                  <p className="text-white/40 text-sm font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Location Section */}
      <section id="location" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
              Visite-nos em <br/> <span className="text-yellow-500">Corroios</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-yellow-500 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Endereço</p>
                  <p className="text-xl font-medium">Rua Alberto de Serpa, nº 9, Corroios</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-yellow-500 flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Horário de Inauguração</p>
                  <p className="text-xl font-medium">Sábado, 30 de Maio às 20:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-yellow-500 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Reservas & Info</p>
                  <a href="tel:+351923363386" className="text-xl font-medium hover:text-yellow-500 transition-colors">+351 923 363 386</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-yellow-500 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">E-mail</p>
                  <a href="mailto:info.bomdoxe@gmail.com" className="text-xl font-medium hover:text-yellow-500 transition-colors">info.bomdoxe@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61560973001773" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <Facebook className="text-white group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest">Facebook</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <Instagram className="text-white group-hover:text-pink-500 transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest">Instagram</span>
              </a>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-video lg:aspect-auto h-full min-h-[400px] bg-zinc-900 rounded-[3rem] overflow-hidden border border-white/10">
             <div className="absolute inset-0 p-8 flex items-center justify-center text-center">
                <div className="space-y-4">
                  <MapPin size={48} className="mx-auto text-yellow-500" />
                  <p className="text-white/50 font-light italic">Mapa interativo será carregado no dia da inauguração.</p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Rua+Alberto+de+Serpa+9+Corroios"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-8 py-4 bg-yellow-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-transform"
                  >
                    Ver no Google Maps
                  </a>
                </div>
             </div>
             {/* Mock overlay to suggest a map */}
             <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-9.15,38.64,13,0/800x800?access_token=pk.placeholder')] bg-cover" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tighter">BOM DOXE</h2>
            <div className="flex flex-col gap-2 text-xs text-white/30">
              <a href="tel:+351923363386" className="hover:text-yellow-500 flex items-center gap-2 transition-colors">
                <Phone size={12} /> +351 923 363 386
              </a>
              <a href="mailto:info.bomdoxe@gmail.com" className="hover:text-yellow-500 flex items-center gap-2 transition-colors">
                <Mail size={12} /> info.bomdoxe@gmail.com
              </a>
            </div>
            <p className="text-sm text-white/30 max-w-sm mt-4">
              Criado para proporcionar momentos inesquecíveis. O melhor da música, da bebida e da gastronomia mundial.
            </p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <a href="#menu" className="hover:text-white transition-colors">Menu</a>
            <a href="#about" className="hover:text-white transition-colors">Legal</a>
            <a href="#location" className="hover:text-white transition-colors">Privacidade</a>
          </div>

          <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-700">
            © 2026 J.A. BOM DOXE. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
