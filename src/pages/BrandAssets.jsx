import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image, Video, Tag, Search, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_LABELS = {
  image: { label: "Image", color: "bg-blue-100 text-blue-700" },
  video: { label: "Video", color: "bg-purple-100 text-purple-700" },
  logo: { label: "Logo", color: "bg-amber-100 text-amber-700" },
  banner: { label: "Banner", color: "bg-green-100 text-green-700" },
  icon: { label: "Icon", color: "bg-pink-100 text-pink-700" },
  other: { label: "Other", color: "bg-gray-100 text-gray-600" },
};

function UploadModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", type: "image", tags: "", description: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.name) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await onSave({ ...form, file_url });
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Brand Asset</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Sacred Seeds Logo Dark"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              {Object.entries(TYPE_LABELS).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="summer, retreat, testimonial"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Notes</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="When and how to use this asset..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </div>
          <div
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              file ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-300"
            }`}
          >
            <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <p className="text-sm text-gray-500">{file ? file.name : "Click to select file"}</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">Cancel</button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Save Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssetCard({ asset, onDelete }) {
  const isVideo = asset.type === "video";
  const badge = TYPE_LABELS[asset.type] || TYPE_LABELS.other;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
    >
      <div className="relative aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
        {isVideo ? (
          <video src={asset.file_url} className="w-full h-full object-cover" controls />
        ) : (
          <img src={asset.file_url} alt={asset.name} className="w-full h-full object-contain p-2" />
        )}
        <button
          onClick={() => onDelete(asset.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity min-h-0 min-w-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-gray-800 truncate">{asset.name}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.color}`}>{badge.label}</span>
        </div>
        {asset.tags && (
          <div className="flex items-center gap-1 flex-wrap mt-1">
            <Tag className="w-3 h-3 text-gray-400 shrink-0" />
            {asset.tags.split(",").map((t) => (
              <span key={t} className="text-[10px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">{t.trim()}</span>
            ))}
          </div>
        )}
        {asset.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{asset.description}</p>}
      </div>
    </motion.div>
  );
}

export default function BrandAssets() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const qc = useQueryClient();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["brand-assets"],
    queryFn: () => base44.entities.BrandAsset.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BrandAsset.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brand-assets"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BrandAsset.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brand-assets"] }),
  });

  const filtered = assets.filter((a) => {
    const matchType = filterType === "all" || a.type === filterType;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || (a.tags || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender">
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSave={(data) => createMutation.mutateAsync(data)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Assets</h1>
            <p className="text-gray-500 text-sm mt-1">Upload logos, images, and videos for the Campaign Strategist AI to use in content drafts.</p>
          </div>
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" /> Upload Asset
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none w-52"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...Object.keys(TYPE_LABELS)].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors min-h-0 min-w-0 ${
                  filterType === t
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                }`}
              >
                {t === "all" ? "All" : TYPE_LABELS[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Image className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No assets yet. Upload your first brand asset to get started.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((asset) => (
                <AssetCard key={asset.id} asset={asset} onDelete={(id) => deleteMutation.mutate(id)} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}