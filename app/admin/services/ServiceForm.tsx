"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { adminUpsertServiceAction, adminDeleteServiceAction } from "@/actions/admin";
import { useToast } from "@/components/ui/toast";

const CATEGORIES = [
  { value: "spraying", label: "Crop spraying" },
  { value: "fertilization", label: "Fertilization" },
  { value: "monitoring", label: "Monitoring" },
  { value: "mapping", label: "Mapping" },
  { value: "analysis", label: "Analysis" },
  { value: "livestock", label: "Livestock" },
  { value: "media", label: "Media" },
] as const;

const MODELS = [
  { value: "fixed", label: "Fixed" },
  { value: "per_hectare", label: "Per hectare" },
  { value: "hybrid", label: "Hybrid (base + per ha)" },
  { value: "custom", label: "Custom quote" },
] as const;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

export function ServiceForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const t = useToast();
  const [pending, setPending] = React.useState(false);
  const [name, setName] = React.useState(initial?.name ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (initial?.id) fd.set("id", initial.id);
    setPending(true);
    const res = await adminUpsertServiceAction({
      id: initial?.id,
      slug: (fd.get("slug") as string) || slugify(name),
      name: fd.get("name"),
      shortDescription: fd.get("shortDescription"),
      description: fd.get("description"),
      category: fd.get("category"),
      pricingModel: fd.get("pricingModel"),
      basePriceZar: fd.get("basePriceZar"),
      perHectarePriceZar: fd.get("perHectarePriceZar"),
      minimumHectares: fd.get("minimumHectares"),
      maxHectaresPerDay: fd.get("maxHectaresPerDay"),
      imageUrl: fd.get("imageUrl") || "",
      iconKey: fd.get("iconKey") || "",
      benefits: [],
      useCases: [],
      suitableCustomers: [],
      featured: fd.get("featured") === "true",
      active: fd.get("active") === "true",
    });
    setPending(false);
    if (!res.ok) {
      t.toast({ title: "Could not save service", description: res.error, tone: "error" });
    } else {
      t.toast({ title: initial ? "Service updated" : "Service created", tone: "success" });
      router.refresh();
      if (!initial) (e.currentTarget as HTMLFormElement).reset();
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Deactivate this service?")) return;
    const res = await adminDeleteServiceAction(initial.id);
    if (!res.ok) {
      t.toast({ title: "Could not deactivate", description: res.error, tone: "error" });
    } else {
      t.toast({ title: "Service deactivated", tone: "success" });
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          minLength={2}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!initial) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="my-service"
        />
      </div>
      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Input id="shortDescription" name="shortDescription" required minLength={10} placeholder="One-sentence pitch" />
      </div>
      <div>
        <Label htmlFor="description">Full description</Label>
        <Textarea id="description" name="description" rows={4} required minLength={20} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" required defaultValue="spraying">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="pricingModel">Pricing model</Label>
          <Select id="pricingModel" name="pricingModel" required defaultValue="per_hectare">
            {MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="basePriceZar">Base price (ZAR)</Label>
          <Input id="basePriceZar" name="basePriceZar" type="number" min="0" step="0.01" required defaultValue="0" />
        </div>
        <div>
          <Label htmlFor="perHectarePriceZar">Per hectare (ZAR)</Label>
          <Input id="perHectarePriceZar" name="perHectarePriceZar" type="number" min="0" step="0.01" required defaultValue="0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="minimumHectares">Min hectares</Label>
          <Input id="minimumHectares" name="minimumHectares" type="number" min="0" step="0.1" required defaultValue="0" />
        </div>
        <div>
          <Label htmlFor="maxHectaresPerDay">Max ha/day</Label>
          <Input id="maxHectaresPerDay" name="maxHectaresPerDay" type="number" min="0" step="0.1" required defaultValue="0" />
        </div>
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
      </div>
      <div className="flex gap-3 pt-1">
        <label className="flex items-center gap-2 text-sm text-fg-dim">
          <input type="checkbox" name="featured" value="true" className="rounded border-leaf-700/15 bg-white" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-fg-dim">
          <input type="checkbox" name="active" value="true" defaultChecked className="rounded border-leaf-700/15 bg-white" />
          Active
        </label>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={pending} className="flex-1">
          {initial ? "Save changes" : "Create service"}
        </Button>
        {initial?.id ? (
          <Button type="button" variant="ghost" onClick={handleDelete}>
            Deactivate
          </Button>
        ) : null}
      </div>
    </form>
  );
}