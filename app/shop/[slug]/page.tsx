"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { addToCart, openCartDrawer } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  badge?: "new" | "limited" | "sold-out";
  sizes?: { size: string; stock: number }[];
  colors?: { name: string; hex: string }[];
  category: string;
  description?: string;
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "Infinity Classic Tank",
    slug: "infinity-classic-tank",
    price: 45,
    compareAtPrice: 55,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?w=600&q=80",
    ],
    badge: "new",
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 8 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 0 },
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gold", hex: "#C9A84C" },
      { name: "White", hex: "#FFFFFF" },
    ],
    category: "tank",
    description: "Premium cotton blend with infinity branding. Features a relaxed fit, deep armholes, and our signature infinity logo embroidered on the chest. Perfect for court sessions or street style.",
  },
  {
    id: "2",
    name: "Courtside Tee",
    slug: "courtside-tee",
    price: 55,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    ],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 20 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 7 },
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
    ],
    category: "tee",
    description: "Oversized fit with retro court graphics. Made from 100% premium cotton for maximum comfort and durability.",
  },
  {
    id: "3",
    name: "Boujee Hoops Hoodie",
    slug: "boujee-hoops-hoodie",
    price: 85,
    compareAtPrice: 120,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    ],
    badge: "limited",
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 },
      { size: "2XL", stock: 0 },
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Grey", hex: "#4A4A4A" },
    ],
    category: "tee",
    description: "Heavyweight fleece with embroidered details. Features a drawstring hood, kangaroo pocket, and premium Boujee Hoops embroidery.",
  },
  {
    id: "4",
    name: "Street Legend Cap",
    slug: "street-legend-cap",
    price: 35,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    badge: "new",
    category: "accessory",
    description: "Classic snapback with premium embroidery. Adjustable fit with 6-panel construction.",
  },
  {
    id: "5",
    name: "Game Day Shorts",
    slug: "game-day-shorts",
    price: 48,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 5 },
    ],
    category: "shorts",
    description: "Breathable mesh with side stripes. Lightweight fabric perfect for game day.",
  },
  {
    id: "6",
    name: "Classic Crew Socks",
    slug: "classic-crew-socks",
    price: 18,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
    badge: "sold-out",
    category: "accessory",
    description: "Cotton blend with arch support. Comfortable cushioning for all-day wear.",
  },
  {
    id: "7",
    name: "Venice Beach Tank",
    slug: "venice-beach-tank",
    price: 40,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80",
    category: "tank",
    description: "Lightweight fabric with beach vibes. Perfect for sunny days.",
  },
  {
    id: "8",
    name: "Oversized Hoodie",
    slug: "oversized-hoodie",
    price: 95,
    compareAtPrice: 130,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    badge: "new",
    category: "tee",
    description: "Ultra-soft fleece with dropped shoulders. The ultimate comfort piece.",
  },
];

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ProductDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  
  const product = allProducts.find((p) => p.slug === slug) || null;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedSize(null);
    setQuantity(1);
    setIsAdded(false);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <main className="min-h-screen bg-background pt-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl text-primary mb-4">Product Not Found</h1>
          <Link href="/shop" className="inline-block px-6 py-3 bg-accent text-background hover:bg-accent/90 transition-colors font-body text-sm uppercase tracking-wider">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const hasMultipleImages = product.images && product.images.length > 1;
  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;
  const selectedSizeData = selectedSize !== null ? product.sizes?.[selectedSize] : null;
  const isSizeAvailable = selectedSizeData ? selectedSizeData.stock > 0 : true;
  
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (hasSizes && !isSizeAvailable) return;

    const size = product.sizes?.[selectedSize ?? 0]?.size || "One Size";
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      size,
      quantity,
      color: product.colors?.[selectedColor]?.name,
    }));
    dispatch(openCartDrawer());
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist({ id: product.id }));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
      }));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const totalImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-8"
        >
          <Link href="/" className="text-accent-2 hover:text-accent transition-colors">Home</Link>
          <span className="text-accent-2">/</span>
          <Link href="/shop" className="text-accent-2 hover:text-accent transition-colors">Shop</Link>
          <span className="text-accent-2">/</span>
          <span className="text-primary">{product.name}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[3/4] bg-surface rounded-2xl overflow-hidden mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 cursor-zoom-in"
                  onClick={() => setIsZoomed(!isZoomed)}
                  onMouseMove={handleMouseMove}
                  style={isZoomed ? {
                    backgroundImage: `url(${totalImages[selectedImageIndex]})`,
                    backgroundSize: '200%',
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                  } : {}}
                >
                  <Image
                    src={totalImages[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-150' : ''}`}
                    style={isZoomed ? { objectFit: 'fill' } : {}}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {product.badge && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`font-body text-xs uppercase tracking-wider px-3 py-1.5 font-bold ${
                    product.badge === "new" ? "bg-accent text-background" :
                    product.badge === "limited" ? "bg-primary text-background" :
                    "bg-danger text-primary"
                  }`}>
                    {product.badge}
                  </span>
                  {discount > 0 && (
                    <span className="font-body text-xs uppercase tracking-wider px-3 py-1.5 bg-danger text-primary font-bold w-fit">
                      -{discount}%
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handleWishlist}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg ${
                  isWishlisted ? "text-danger" : "text-primary hover:text-danger"
                }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              {isZoomed && (
                <button
                  onClick={() => setIsZoomed(false)}
                  className="absolute bottom-4 right-4 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-lg text-sm text-primary"
                >
                  Click to zoom out
                </button>
              )}
            </div>

            {hasMultipleImages && (
              <div className="flex gap-3">
                {totalImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "ring-2 ring-accent ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="space-y-6">
              <div>
                <p className="font-body text-sm text-accent uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-primary">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-body text-3xl font-bold text-primary">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="font-body text-xl text-accent-2 line-through">
                      ₦{product.compareAtPrice.toLocaleString()}
                    </span>
                    <span className="font-body text-sm text-danger font-medium">
                      Save ₦{(product.compareAtPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              <p className="font-body text-accent-2 leading-relaxed">
                {product.description}
              </p>

                {hasColors && product.colors && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-body text-sm text-primary">Color</span>
                    <span className="font-body text-sm text-accent-2">
                      {product.colors[selectedColor]?.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(index)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor === index
                            ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                            : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {hasSizes && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-body text-sm text-primary">Size</span>
                    <button className="font-body text-sm text-accent underline underline-offset-2">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes!.map((sizeData, index) => (
                      <button
                        key={sizeData.size}
                        onClick={() => setSelectedSize(index)}
                        disabled={sizeData.stock === 0}
                        className={`min-w-[48px] h-12 px-4 font-body text-sm font-medium transition-all rounded-lg ${
                          selectedSize === index
                            ? "bg-accent text-background"
                            : sizeData.stock === 0
                            ? "bg-surface text-accent-2/30 cursor-not-allowed line-through"
                            : "bg-surface text-primary hover:bg-accent hover:text-background border border-accent-2/10"
                        }`}
                      >
                        {sizeData.size}
                      </button>
                    ))}
                  </div>
                  {selectedSize !== null && !isSizeAvailable && (
                    <p className="mt-2 text-sm text-danger">This size is currently out of stock</p>
                  )}
                </div>
              )}

              <div>
                <span className="font-body text-sm text-primary block mb-3">Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-accent-2/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-primary hover:text-accent hover:bg-surface transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    <span className="w-16 text-center font-body text-lg text-primary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-primary hover:text-accent hover:bg-surface transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                  <span className="font-body text-sm text-accent-2">
                    {selectedSizeData ? `${selectedSizeData.stock} in stock` : 'In stock'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={hasSizes && !isSizeAvailable}
                  className={`flex-1 h-14 font-body text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-xl ${
                    isSizeAvailable || !hasSizes
                      ? "bg-accent text-background hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
                      : "bg-surface text-accent-2 cursor-not-allowed"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      {hasSizes && selectedSizeData?.stock === 0 ? "Sold Out" : "Add to Cart"}
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-accent-2/10">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mx-auto mb-2 text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <p className="font-body text-xs text-accent-2">Free Shipping</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mx-auto mb-2 text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <p className="font-body text-xs text-accent-2">Easy Returns</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mx-auto mb-2 text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <p className="font-body text-xs text-accent-2">Secure Payment</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-24"
          >
            <h2 className="font-display text-3xl text-primary mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link href={`/shop/${item.slug}`} className="group block">
                    <div className="relative aspect-[3/4] bg-surface rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {item.badge && (
                        <span className={`absolute top-3 left-3 font-body text-[10px] uppercase tracking-wider px-2 py-1 font-bold ${
                          item.badge === "new" ? "bg-accent text-background" :
                          item.badge === "limited" ? "bg-primary text-background" :
                          "bg-danger text-primary"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-body text-base text-primary group-hover:text-accent transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-body text-sm font-bold text-primary mt-1">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
