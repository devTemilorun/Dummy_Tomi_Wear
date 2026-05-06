import { prisma } from "@/lib/prisma";
import Image from "next/image";
import AddToCartButton from "@/components/products/AddToCartButton";

//ISR Configuration
export const revalidate = 60;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
    take: 100,
  });
  return products.map((product) => ({
    slug: product.slug,
  }));
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
        <p className="mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 mb-4 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative w-20 h-20 border-2 rounded overflow-hidden shrink-0 border-gray-200 dark:border-gray-700"
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {product.name}
          </h1>
          <p className="text-2xl text-blue-600 font-bold mb-4">
            ₦{product.price.toLocaleString()}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {product.description}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Stock Status:</span>{" "}
            <span
              className={
                product.stock > 0 ? "text-green-600" : "text-red-600 font-semibold"
              }
            >
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </p>

          <AddToCartButton productId={product.id} stock={product.stock} />
        </div>
      </div>
    </div>
  );
}