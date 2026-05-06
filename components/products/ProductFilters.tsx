"use client";

import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import { Search } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  search: string;
  category: string;
}

export default function ProductFilters({ search, category }: ProductFiltersProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);
  const [categoryValue, setCategoryValue] = useState(category);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    if (categoryValue) params.set("category", categoryValue);
    router.push(`/products?${params.toString()}`);
  };

  const handleCategory = (value: string) => {
    setCategoryValue(value);
    const params = new URLSearchParams();
    if (searchValue) params.set("search", searchValue);
    if (value) params.set("category", value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>
      <select
        value={categoryValue}
        onChange={(e) => handleCategory(e.target.value)}
        className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
        <option value="home">Home & Living</option>
        <option value="sports">Sports</option>
      </select>
    </div>
  );
}