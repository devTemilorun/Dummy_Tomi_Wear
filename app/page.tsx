import HeroSection from "@/components/ui/HeroSection";
import ProductCard from "@/components/products/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { prisma } from "@/lib/prisma";

export const revalidate = 120;

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>
      <HeroSection />

      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Featured Products
        </h2>
        
        {products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}