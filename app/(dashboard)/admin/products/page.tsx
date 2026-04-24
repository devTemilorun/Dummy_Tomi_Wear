"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Edit2, Trash2, Plus, Image as ImageIcon } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  description: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products?limit=100");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchProducts();
          }}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b dark:border-gray-700">
                <td className="p-3">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <ImageIcon size={32} className="text-gray-400" />
                  )}
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">
                  <span
                    className={
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-3 capitalize">{product.category}</td>
                <td className="p-3 space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Product Form Component (inline)
function ProductForm({ product, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    stock: product?.stock || "",
    images: product?.images?.join(",") || "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await axios.post("/api/upload", fd);
        uploadedUrls.push(res.data.url);
      } catch (error) {
        toast.error("Upload failed for " + file.name);
      }
    }
    const newUrls = form.images
      ? form.images.split(",").concat(uploadedUrls).join(",")
      : uploadedUrls.join(",");
    setForm({ ...form, images: newUrls });
    setUploading(false);
    toast.success(`${uploadedUrls.length} image(s) uploaded`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      images: form.images.split(",").map((s: string) => s.trim()),
    };
    try {
      if (product) {
        await axios.put(`/api/products/${product.id}`, payload);
        toast.success("Product updated");
      } else {
        await axios.post("/api/products", payload);
        toast.success("Product created");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <Input
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm border rounded p-1 dark:bg-gray-800"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
          <Input
            label="Image URLs (comma separated)"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          />
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}