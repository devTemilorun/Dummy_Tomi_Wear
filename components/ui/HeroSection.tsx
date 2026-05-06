"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-linear-to-r from-blue-600 to-indigo-600 text-white py-20 px-4">
      <div className="container mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Welcome to ShopHub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl mb-8 max-w-2xl mx-auto"
        >
          Discover amazing products at unbeatable prices. Fast shipping & secure payments.
        </motion.p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition inline-block"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}