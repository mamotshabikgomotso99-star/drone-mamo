"use client";

import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldHint } from "@/components/ui/form";
import { MapPin, Pencil, Square } from "lucide-react";

interface MapPickerProps {
  initial?: { lat: number; lng: number; address?: string; boundary?: Array<[number, number]> };
  onChange: (loc: { lat: number; lng: number; address?: string; boundary?: Array<[number, number]> }) => void;
  allowBoundary?: boolean;
  height?: number;
}

const DEFAULT_CENTER: [number, number] = [-28.5, 25.5]; // Somewhere central in SA
const DEFAULT_ZOOM = 5;

export function MapPicker({
  initial,
  onChange,
  allowBoundary = true,
  height = 420,
}: MapPickerProps) {
  const mapEl = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<L.Map | null>(null);
  const marker = React.useRef<L.Marker | null>(null);
  const boundaryLayer = React.useRef<L.Polygon | null>(null);
  const vertexLayer = React.useRef<L.LayerGroup | null>(null);
  const [mode, setMode] = React.useState<"pin" | "polygon">("pin");
  const [boundary, setBoundary] = React.useState<Array<[number, number]>>(initial?.boundary ?? []);
  const [search, setSearch] = React.useState(initial?.address ?? "");
  const [searching, setSearching] = React.useState(false);

  // Init map
  React.useEffect(() => {
    if (!mapEl.current || map.current) return;
    const m = L.map(mapEl.current, {
      center: initial ? [initial.lat, initial.lng] : DEFAULT_CENTER,
      zoom: initial ? 13 : DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILES_URL ?? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(m);

    map.current = m;
    vertexLayer.current = L.layerGroup().addTo(m);

    if (initial) {
      const mm = L.marker([initial.lat, initial.lng], { draggable: true }).addTo(m);
      mm.on("dragend", () => {
        const { lat, lng } = mm.getLatLng();
        onChange({ lat, lng });
      });
      marker.current = mm;
      if (initial.boundary?.length) {
        drawPolygon(initial.boundary);
      }
    }

    // Click to drop / add vertex
    m.on("click", (e: L.LeafletMouseEvent) => {
      if (mode === "pin") {
        if (!marker.current) {
          marker.current = L.marker(e.latlng, { draggable: true }).addTo(m);
          marker.current.on("dragend", () => {
            const ll = marker.current!.getLatLng();
            onChange({ lat: ll.lat, lng: ll.lng });
          });
        } else {
          marker.current.setLatLng(e.latlng);
        }
        const ll = e.latlng;
        onChange({ lat: ll.lat, lng: ll.lng });
      } else {
        // append vertex
        setBoundary((b) => [...b, [e.latlng.lng, e.latlng.lat]]);
      }
    });

    return () => {
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render polygon when boundary changes
  React.useEffect(() => {
    if (boundaryLayer.current) {
      boundaryLayer.current.remove();
      boundaryLayer.current = null;
    }
    if (vertexLayer.current) {
      vertexLayer.current.clearLayers();
      boundary.forEach(([lng, lat]) => {
        L.circleMarker([lat, lng], {
          radius: 4,
          color: "#34d273",
          fillColor: "#34d273",
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(vertexLayer.current!);
      });
    }
    if (boundary.length >= 3) {
      drawPolygon(boundary);
    }
    if (boundary.length > 0) {
      onChange({
        lat: initial?.lat ?? DEFAULT_CENTER[0],
        lng: initial?.lng ?? DEFAULT_CENTER[1],
        boundary,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundary]);

  function drawPolygon(ring: Array<[number, number]>) {
    if (!map.current) return;
    const latlngs = ring.map(([lng, lat]) => [lat, lng] as [number, number]);
    boundaryLayer.current = L.polygon(latlngs, {
      color: "#34d273",
      weight: 2,
      fillColor: "#34d273",
      fillOpacity: 0.15,
    }).addTo(map.current);
    try {
      map.current.fitBounds(boundaryLayer.current.getBounds(), { padding: [40, 40] });
    } catch {}
  }

  async function geocode() {
    if (!search) return;
    setSearching(true);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&countrycodes=za&limit=1`,
      );
      const j = await r.json();
      if (j && j[0]) {
        const lat = parseFloat(j[0].lat);
        const lng = parseFloat(j[0].lon);
        if (map.current) map.current.setView([lat, lng], 14);
        if (marker.current) marker.current.setLatLng([lat, lng]);
        else if (map.current) {
          marker.current = L.marker([lat, lng], { draggable: true }).addTo(map.current);
          marker.current.on("dragend", () => {
            const ll = marker.current!.getLatLng();
            onChange({ lat: ll.lat, lng: ll.lng });
          });
        }
        onChange({ lat, lng, address: j[0].display_name });
      }
    } catch (e) {
      console.error("geocode failed", e);
    } finally {
      setSearching(false);
    }
  }

  function clearBoundary() {
    setBoundary([]);
    if (boundaryLayer.current) {
      boundaryLayer.current.remove();
      boundaryLayer.current = null;
    }
    if (vertexLayer.current) vertexLayer.current.clearLayers();
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (map.current) map.current.setView([lat, lng], 14);
        if (marker.current) marker.current.setLatLng([lat, lng]);
        else if (map.current) {
          marker.current = L.marker([lat, lng], { draggable: true }).addTo(map.current);
          marker.current.on("dragend", () => {
            const ll = marker.current!.getLatLng();
            onChange({ lat: ll.lat, lng: ll.lng });
          });
        }
        onChange({ lat, lng });
      },
      (err) => console.warn("geo failed", err),
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Label>Search address</Label>
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Reitz, Free State"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  geocode();
                }
              }}
            />
            <Button onClick={geocode} loading={searching} variant="secondary">
              Search
            </Button>
          </div>
          <FieldHint>Search results from OpenStreetMap (South Africa only).</FieldHint>
        </div>
        <div className="sm:pt-7">
          <Button variant="ghost" onClick={useCurrentLocation}>
            <MapPin className="h-4 w-4" /> Use my location
          </Button>
        </div>
      </div>

      {allowBoundary ? (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-fg-muted">Mode:</span>
          <button
            type="button"
            onClick={() => setMode("pin")}
            className={
              "rounded-full border px-3 py-1 transition-colors " +
              (mode === "pin"
                ? "border-leaf-400/60 bg-leaf-50 text-leaf-700"
                : "border-leaf-700/15 text-fg-dim hover:text-fg")
            }
          >
            <MapPin className="inline h-3 w-3 mr-1" /> Drop pin
          </button>
          <button
            type="button"
            onClick={() => setMode("polygon")}
            className={
              "rounded-full border px-3 py-1 transition-colors " +
              (mode === "polygon"
                ? "border-leaf-400/60 bg-leaf-50 text-leaf-700"
                : "border-leaf-700/15 text-fg-dim hover:text-fg")
            }
          >
            <Square className="inline h-3 w-3 mr-1" /> Draw boundary
          </button>
          {mode === "polygon" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  if (boundary.length < 3) return;
                  setBoundary((b) => [...b, b[0]]);
                }}
                className="rounded-full border border-leaf-400/60 bg-leaf-50 px-3 py-1 text-leaf-700"
              >
                <Pencil className="inline h-3 w-3 mr-1" /> Close shape
              </button>
              <button
                type="button"
                onClick={clearBoundary}
                className="rounded-full border border-leaf-700/15 px-3 py-1 text-fg-dim hover:text-fg"
              >
                Clear
              </button>
              <span className="text-fg-muted ml-2">
                {boundary.length} point{boundary.length === 1 ? "" : "s"}{" "}
                {boundary.length >= 3 ? "· drag pin to refine location" : ""}
              </span>
            </>
          ) : null}
        </div>
      ) : null}

      <div
        ref={mapEl}
        className="rounded-2xl overflow-hidden border border-leaf-700/15"
        style={{ height }}
      />
    </div>
  );
}