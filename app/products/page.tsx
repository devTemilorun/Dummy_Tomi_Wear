
import ProductCard from "@/components/products/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import ProductFilters from "@/components/products/ProductFilters";
import { prisma } from "@/lib/prisma";

//  ISR Configuration
export const revalidate = 60;

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
}

async function getProducts(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const search = searchParams.search || "";
  const category = searchParams.category || "";

  const where: any = {};
  if (category && category !== "") {
    where.category = category;
  }
  if (search && search !== "") {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { products, total, page, totalPages } = await getProducts(params);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        All Products
        {total > 0 && (
          <span className="text-lg font-normal text-gray-500 ml-2">
            ({total} items)
          </span>
        )}
      </h1>

      <ProductFilters
        search={params.search || ""}
        category={params.category || ""}
      />

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Link
                href={`/products?page=${page - 1}&search=${params.search || ""}&category=${params.category || ""}`}
                className={`px-4 py-2 border rounded transition ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-disabled={page === 1}
              >
                Previous
              </Link>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <Link
                href={`/products?page=${page + 1}&search=${params.search || ""}&category=${params.category || ""}`}
                className={`px-4 py-2 border rounded transition ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-disabled={page === totalPages}
              >
                Next
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}