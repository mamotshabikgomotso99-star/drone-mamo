"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sun,
  Moon,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Label, FieldError, FieldHint } from "@/components/ui/form";
import { MapPicker } from "@/components/map/MapPicker";
import { formatZAR, approximatePolygonHectares } from "@/lib/utils";
import { calculatePricing } from "@/lib/validators";
import { createBookingAction } from "@/actions/bookings";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/components/ui/utils";

interface ServiceLite {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  pricingModel: string;
  basePriceZar: string;
  perHectarePriceZar: string;
  minimumHectares: string;
  maxHectaresPerDay: string;
  pricingRules?: Array<{ kind: string; amountZar: string | null; percent: string | null; active: boolean }>;
}

interface BookingFlowProps {
  services: ServiceLite[];
  initialServiceSlug?: string;
  user: { id: string; name: string; email: string };
}

const STEPS = [
  { id: 1, title: "Service" },
  { id: 2, title: "Farm" },
  { id: 3, title: "Schedule" },
  { id: 4, title: "Review" },
];

export function BookingFlow({ services, initialServiceSlug, user }: BookingFlowProps) {
  const router = useRouter();
  const t = useToast();
  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);

  const initialService = React.useMemo(
    () => services.find((s) => s.slug === initialServiceSlug) ?? services[0],
    [services, initialServiceSlug],
  );

  const [serviceId, setServiceId] = React.useState(initialService?.id ?? "");
  const [farm, setFarm] = React.useState({
    name: "",
    address: "",
    province: "",
    city: "",
    lat: -28.5,
    lng: 25.5,
    sizeHectares: 0,
    cropType: "",
    boundary: undefined as Array<[number, number]> | undefined,
  });
  const [cropType, setCropType] = React.useState("");
  const [scheduledDate, setScheduledDate] = React.useState<string>("");
  const [timeSlot, setTimeSlot] = React.useState<"morning" | "afternoon">("morning");
  const [urgency, setUrgency] = React.useState<"standard" | "urgent">("standard");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const service = services.find((s) => s.id === serviceId);

  const farmArea = farm.boundary && farm.boundary.length >= 3
    ? approximatePolygonHectares(farm.boundary)
    : null;

  const pricing = React.useMemo(() => {
    if (!service) return null;
    return calculatePricing({
      service: {
        pricingModel: service.pricingModel as "fixed" | "per_hectare" | "hybrid" | "custom",
        basePriceZar: service.basePriceZar,
        perHectarePriceZar: service.perHectarePriceZar,
        minimumHectares: service.minimumHectares,
        maxHectaresPerDay: service.maxHectaresPerDay,
      },
      hectares: farm.sizeHectares,
      urgency,
      distanceKm: 0,
      pricingRules: service.pricingRules,
    });
  }, [service, farm.sizeHectares, urgency, farm.boundary]);

  function next() {
    setError(null);
    if (step === 1) {
      if (!service) {
        setError("Please select a service");
        return;
      }
    }
    if (step === 2) {
      if (!farm.name || !farm.address || !farm.sizeHectares) {
        setError("Please complete farm details");
        return;
      }
    }
    if (step === 3) {
      if (!scheduledDate) {
        setError("Please choose a date");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function submit() {
    if (!service) return;
    setError(null);
    setSubmitting(true);
    const res = await createBookingAction({
      serviceId: service.id,
      farm: {
        name: farm.name,
        address: farm.address,
        province: farm.province || undefined,
        city: farm.city || undefined,
        lat: farm.lat,
        lng: farm.lng,
        sizeHectares: farm.sizeHectares,
        cropType: farm.cropType || undefined,
        boundary: farm.boundary ?? undefined,
      },
      cropType: cropType || farm.cropType || "Mixed",
      scheduledDate: new Date(scheduledDate),
      timeSlot,
      urgency,
      contactName: user.name,
      contactPhone: "",
      notes: notes || undefined,
      distanceKm: 0,
    } as any);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong");
      t.toast({ title: "Booking failed", description: res.error, tone: "error" });
      return;
    }
    t.toast({
      title: "Booking submitted",
      description: `Reference ${res.data?.reference}. Opening your dashboard...`,
      tone: "success",
    });
    router.push(`/dashboard?booking=${res.data?.reference}`);
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        {/* Stepper */}
        <ol className="flex items-center gap-2 mb-8">
          {STEPS.map((s) => (
            <li key={s.id} className="flex-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  step >= s.id ? "bg-leaf-400" : "bg-ash-200",
                )}
              />
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium border",
                    step > s.id
                      ? "bg-leaf-400 text-ink border-leaf-400"
                      : step === s.id
                        ? "border-leaf-400/60 text-leaf-700"
                        : "border-leaf-700/15 text-fg-muted",
                  )}
                >
                  {step > s.id ? <Check className="h-3 w-3" /> : s.id}
                </span>
                <span className={cn("text-xs font-medium", step >= s.id ? "text-fg" : "text-fg-muted")}>
                  {s.title}
                </span>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl glass p-6 sm:p-8">
          {step === 1 ? (
            <Step1
              services={services}
              serviceId={serviceId}
              onSelect={setServiceId}
            />
          ) : null}

          {step === 2 ? (
            <Step2
              farm={farm}
              setFarm={setFarm}
              cropType={cropType}
              setCropType={setCropType}
            />
          ) : null}

          {step === 3 ? (
            <Step3
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
              urgency={urgency}
              setUrgency={setUrgency}
              notes={notes}
              setNotes={setNotes}
            />
          ) : null}

          {step === 4 ? (
            <Step4
              service={service}
              farm={farm}
              cropType={cropType}
              scheduledDate={scheduledDate}
              timeSlot={timeSlot}
              urgency={urgency}
              notes={notes}
            />
          ) : null}

          {error ? (
            <div className="mt-4 text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> {error}
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={back}
              disabled={step === 1}
              className={step === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length ? (
              <Button onClick={next}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} loading={submitting}>
                Submit booking <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <BookingSummary
          service={service}
          farm={farm}
          pricing={pricing}
          farmArea={farmArea}
        />
      </div>
    </div>
  );
}

function Step1({
  services,
  serviceId,
  onSelect,
}: {
  services: ServiceLite[];
  serviceId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-fg">Choose a service</h2>
      <p className="mt-1 text-sm text-fg-muted">Pick the closest match — you can refine later.</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {services.map((s) => {
          const selected = serviceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={cn(
                "text-left rounded-2xl border p-5 transition-all",
                selected
                  ? "border-leaf-400/60 bg-leaf-50 glow-leaf"
                  : "border-leaf-700/15 hover:bg-ash-50",
              )}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-fg">{s.name}</h3>
                {selected ? <Check className="h-5 w-5 text-leaf-700" /> : null}
              </div>
              <p className="mt-1 text-sm text-fg-dim line-clamp-2">{s.shortDescription}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({
  farm,
  setFarm,
  cropType,
  setCropType,
}: {
  farm: any;
  setFarm: (f: any) => void;
  cropType: string;
  setCropType: (v: string) => void;
}) {
  const SA_PROVINCES = [
    "Western Cape",
    "Eastern Cape",
    "Northern Cape",
    "Free State",
    "KwaZulu-Natal",
    "North West",
    "Gauteng",
    "Mpumalanga",
    "Limpopo",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Farm details</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Drop a pin on the map or draw your farm boundary. The size is calculated automatically.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="farmName" required>Farm name</Label>
          <Input
            id="farmName"
            value={farm.name}
            onChange={(e) => setFarm({ ...farm, name: e.target.value })}
            placeholder="e.g. Home farm — Reitz"
          />
        </div>
        <div>
          <Label htmlFor="cropType" required>Primary crop</Label>
          <Select
            id="cropType"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          >
            <option value="">Select crop</option>
            {["Maize", "Soya", "Wheat", "Sugarcane", "Citrus", "Grapes", "Apples", "Pears", "Potatoes", "Tomatoes", "Onions", "Macadamias", "Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address" required>Address</Label>
        <Input
          id="address"
          value={farm.address}
          onChange={(e) => setFarm({ ...farm, address: e.target.value })}
          placeholder="e.g. Reitz, Free State"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province">Province</Label>
          <Select
            id="province"
            value={farm.province}
            onChange={(e) => setFarm({ ...farm, province: e.target.value })}
          >
            <option value="">Select province</option>
            {SA_PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="city">City / town</Label>
          <Input
            id="city"
            value={farm.city}
            onChange={(e) => setFarm({ ...farm, city: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Map location</Label>
        <MapPicker
          initial={farm.lat ? { lat: farm.lat, lng: farm.lng, address: farm.address } : undefined}
          onChange={(loc) => {
            setFarm({
              ...farm,
              lat: loc.lat,
              lng: loc.lng,
              boundary: loc.boundary ?? farm.boundary,
              // Auto-fill size from boundary
              sizeHectares: loc.boundary && loc.boundary.length >= 3
                ? Number(approximatePolygonHectares(loc.boundary).toFixed(2))
                : farm.sizeHectares,
              address: loc.address ?? farm.address,
            });
          }}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sizeHectares" required>Farm size (hectares)</Label>
          <Input
            id="sizeHectares"
            type="number"
            step="0.1"
            min="0.1"
            value={farm.sizeHectares || ""}
            onChange={(e) =>
              setFarm({ ...farm, sizeHectares: parseFloat(e.target.value) || 0 })
            }
            leftSlot={<span className="text-xs">ha</span>}
          />
          <FieldHint>
            We auto-fill this if you draw a boundary on the map — adjust as needed.
          </FieldHint>
        </div>
      </div>
    </div>
  );
}

function Step3({
  scheduledDate,
  setScheduledDate,
  timeSlot,
  setTimeSlot,
  urgency,
  setUrgency,
  notes,
  setNotes,
}: {
  scheduledDate: string;
  setScheduledDate: (s: string) => void;
  timeSlot: "morning" | "afternoon";
  setTimeSlot: (s: "morning" | "afternoon") => void;
  urgency: "standard" | "urgent";
  setUrgency: (s: "standard" | "urgent") => void;
  notes: string;
  setNotes: (s: string) => void;
}) {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Schedule</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Choose a date and time. We&apos;ll confirm by email. Weather may shift
          the schedule — we&apos;ll reschedule at no cost if needed.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scheduledDate" required>Preferred date</Label>
          <Input
            id="scheduledDate"
            type="date"
            min={tomorrow}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            leftSlot={<Calendar className="h-4 w-4" />}
          />
        </div>
        <div>
          <Label>Time of day</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTimeSlot("morning")}
              className={cn(
                "rounded-xl border p-3 text-sm transition-colors",
                timeSlot === "morning"
                  ? "border-leaf-400/60 bg-leaf-50 text-leaf-700"
                  : "border-leaf-700/15 text-fg-dim hover:bg-ash-100",
              )}
            >
              <Sun className="h-4 w-4 inline mr-1.5" /> Morning
            </button>
            <button
              type="button"
              onClick={() => setTimeSlot("afternoon")}
              className={cn(
                "rounded-xl border p-3 text-sm transition-colors",
                timeSlot === "afternoon"
                  ? "border-leaf-400/60 bg-leaf-50 text-leaf-700"
                  : "border-leaf-700/15 text-fg-dim hover:bg-ash-100",
              )}
            >
              <Moon className="h-4 w-4 inline mr-1.5" /> Afternoon
            </button>
          </div>
        </div>
      </div>

      <div>
        <Label>Urgency</Label>
        <div className="grid sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setUrgency("standard")}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              urgency === "standard"
                ? "border-leaf-400/60 bg-leaf-50"
                : "border-leaf-700/15 hover:bg-ash-100",
            )}
          >
            <div className="font-medium text-fg text-sm">Standard</div>
            <div className="text-xs text-fg-muted mt-1">3–7 working days · no surcharge</div>
          </button>
          <button
            type="button"
            onClick={() => setUrgency("urgent")}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              urgency === "urgent"
                ? "border-amber-400/60 bg-amber-500/10"
                : "border-leaf-700/15 hover:bg-ash-100",
            )}
          >
            <div className="font-medium text-fg text-sm">Urgent</div>
            <div className="text-xs text-fg-muted mt-1">Within 48 hours · small surcharge</div>
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything we should know about the field, the crop, or the brief?"
        />
      </div>
    </div>
  );
}

function Step4({
  service,
  farm,
  cropType,
  scheduledDate,
  timeSlot,
  urgency,
  notes,
}: {
  service: ServiceLite | undefined;
  farm: any;
  cropType: string;
  scheduledDate: string;
  timeSlot: string;
  urgency: string;
  notes: string;
}) {
  if (!service) return null;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg">Review &amp; submit</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Verify the details. We&apos;ll send a confirmation email and confirm the
          final price within 1 business day.
        </p>
      </div>

      <div className="rounded-2xl glass p-5 space-y-3 text-sm">
        <Row label="Service" value={service.name} />
        <Row label="Farm" value={farm.name} />
        <Row label="Address" value={farm.address} />
        <Row label="Size" value={`${farm.sizeHectares} ha`} />
        <Row label="Crop" value={cropType || "—"} />
        <Row label="Date" value={scheduledDate ? new Date(scheduledDate).toLocaleDateString("en-ZA", { dateStyle: "long" }) : "—"} />
        <Row label="Time" value={timeSlot === "morning" ? "Morning" : "Afternoon"} />
        <Row label="Urgency" value={urgency === "urgent" ? "Urgent" : "Standard"} />
        {notes ? <Row label="Notes" value={notes} /> : null}
      </div>

      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
        <strong className="text-amber-300">Heads up:</strong> pricing shown
        alongside is an estimate. Final pricing is confirmed after we review
        your brief.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg text-right">{value}</span>
    </div>
  );
}

function BookingSummary({
  service,
  farm,
  pricing,
  farmArea,
}: {
  service: ServiceLite | undefined;
  farm: any;
  pricing: any;
  farmArea: number | null;
}) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-2xl glass-strong p-6">
        <h3 className="text-sm uppercase tracking-wider text-fg-muted mb-4">Estimate</h3>
        {service ? (
          <>
            <div className="text-fg font-semibold">{service.name}</div>
            <div className="mt-1 text-xs text-fg-muted">
              {service.pricingModel.replace("_", " ")} pricing
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-fg-muted">Base</span>
                <span className="text-fg">{formatZAR(pricing?.base ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Per hectare</span>
                <span className="text-fg">{formatZAR(pricing?.perHectare ?? 0)}</span>
              </div>
              {pricing?.urgencyFee ? (
                <div className="flex justify-between">
                  <span className="text-fg-muted">Urgency</span>
                  <span className="text-fg">{formatZAR(pricing.urgencyFee)}</span>
                </div>
              ) : null}
              {pricing?.locationFee ? (
                <div className="flex justify-between">
                  <span className="text-fg-muted">Travel</span>
                  <span className="text-fg">{formatZAR(pricing.locationFee)}</span>
                </div>
              ) : null}
            </div>
            <div className="mt-5 pt-4 border-t border-leaf-700/15 flex items-center justify-between">
              <span className="text-fg-muted text-sm">Estimated total</span>
              <span className="text-2xl font-semibold text-fg">
                {formatZAR(pricing?.total ?? 0)}
              </span>
            </div>
            {farmArea ? (
              <div className="mt-3 text-xs text-fg-muted">
                Boundary area ≈ {farmArea.toFixed(2)} ha
              </div>
            ) : null}
            <div className="mt-3 text-xs text-fg-muted">
              {farm.sizeHectares ? `${farm.sizeHectares} ha used for pricing` : "Set farm size to see pricing"}
            </div>
          </>
        ) : (
          <div className="text-sm text-fg-muted">Pick a service to see an estimate.</div>
        )}
      </div>
      <p className="mt-4 text-xs text-fg-muted">
        Indicative only. Final pricing is confirmed after a brief review of your farm.
      </p>
    </aside>
  );
}