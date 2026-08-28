/**
 * Seeds the database with: admin user, services, pricing, drones, team members, sample data.
 *
 * Run: npm run db:seed
 */

import "dotenv/config";
import { db } from "../lib/db";
import {
  users,
  customerProfiles,
  services,
  servicePricingRules,
  drones,
  teamMembers,
  farms,
} from "../lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

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

const SERVICE_DATA = [
  {
    slug: "crop-spraying",
    name: "Crop Spraying",
    shortDescription:
      "Precision aerial spraying of crops using agricultural drones — uniform coverage, less chemical waste.",
    description:
      "KM Drone Services delivers accurate, uniform crop spraying via agricultural spray drones. Our electrostatic nozzle technology and GPS-guided flight paths ensure every pass delivers consistent coverage — drastically reducing chemical usage, fuel costs, and soil compaction compared to traditional spraying methods. Ideal for vineyards, orchards, row crops, and small-to-mid-scale fields where precision matters most.",
    category: "spraying" as const,
    pricingModel: "per_hectare" as const,
    basePriceZar: "850",
    perHectarePriceZar: "320",
    minimumHectares: "1",
    maxHectaresPerDay: "120",
    benefits: [
      "60-90% reduction in water vs. manual spraying",
      "GPS-guided flight paths for uniform coverage",
      "No soil compaction or crop damage from heavy machinery",
      "Up to 6× faster than knapsack spraying",
      "Targeted application reduces chemical costs",
    ],
    useCases: [
      "Vineyards and orchards in Western Cape",
      "Sugarcane fields in KwaZulu-Natal",
      "Maize and soya fields in Free State",
      "Citrus estates in Limpopo",
      "Vegetable plots and horticulture",
    ],
    suitableCustomers: [
      "Commercial crop farmers",
      "Vineyard owners",
      "Orchard operators",
      "Agricultural cooperatives",
    ],
    iconKey: "spray",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243b0?w=1200&q=80",
  },
  {
    slug: "fertilizer-application",
    name: "Fertilizer Application",
    shortDescription:
      "Targeted aerial application of foliar fertilizers and nutrients for stronger yields.",
    description:
      "Foliar fertilizer application via drone delivers nutrients directly to the leaf canopy at the precise moment your crop needs them. Our spreader-equipped drones cover large areas quickly and evenly, allowing foliar feeding that drives measurable yield improvements. Combine with soil-sampling data and prescription maps for variable-rate application.",
    category: "fertilization" as const,
    pricingModel: "per_hectare" as const,
    basePriceZar: "950",
    perHectarePriceZar: "280",
    minimumHectares: "1",
    maxHectaresPerDay: "100",
    benefits: [
      "Variable-rate application from prescription maps",
      "Uniform coverage across entire field",
      "No tractor wheel-ruts or soil damage",
      "Apply nutrients when conditions are optimal",
    ],
    useCases: [
      "Foliar feeding during critical growth stages",
      "Micronutrient correction across uneven fields",
      "Large-scale maize/soya top-dressing",
    ],
    suitableCustomers: [
      "Commercial farmers",
      "Cooperatives seeking yield gains",
      "Precision agriculture operations",
    ],
    iconKey: "flask",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80",
  },
  {
    slug: "pesticide-application",
    name: "Pesticide Application",
    shortDescription:
      "Precision pesticide spraying that reduces chemical use while protecting your crop.",
    description:
      "Apply pesticides with surgical precision. Drone-based spraying keeps operators out of the chemical zone, reduces drift, and minimizes the total volume of product required. Our pilots are trained in chemical-handling best-practices and work to local regulations governing aerial application.",
    category: "spraying" as const,
    pricingModel: "per_hectare" as const,
    basePriceZar: "850",
    perHectarePriceZar: "350",
    minimumHectares: "1",
    maxHectaresPerDay: "120",
    benefits: [
      "Reduces operator exposure to chemicals",
      "Lowers overall chemical usage",
      "Targets problem areas without affecting the whole field",
      "Works in wet-field conditions where tractors can't",
    ],
    useCases: [
      "Locust / armyworm outbreaks",
      "Late-season fungal applications",
      "Targeted pest hot-spots",
    ],
    suitableCustomers: ["All crop farmers", "Outbreak response teams"],
    iconKey: "shield",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
  },
  {
    slug: "crop-monitoring",
    name: "Crop Monitoring",
    shortDescription:
      "Aerial crop monitoring with high-resolution imaging across the season.",
    description:
      "Regular scheduled flyovers capture the full state of your fields through the season. We deliver high-resolution RGB and (where configured) multispectral imagery, with annotated observations from our agronomy team. Track crop stage, identify problem areas early, and quantify the impact of interventions.",
    category: "monitoring" as const,
    pricingModel: "fixed" as const,
    basePriceZar: "2400",
    perHectarePriceZar: "0",
    minimumHectares: "1",
    maxHectaresPerDay: "500",
    benefits: [
      "Catch problems before they cost yield",
      "Track crop stage across paddocks",
      "Build a season-long visual record",
    ],
    useCases: [
      "Weekly flyovers during peak season",
      "Vineyard block-by-block monitoring",
      "Pre-harvest assessment",
    ],
    suitableCustomers: ["Vineyards", "Orchards", "Row-crop farmers"],
    iconKey: "leaf",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
  },
  {
    slug: "crop-health-analysis",
    name: "Crop Health Analysis",
    shortDescription:
      "NDVI-style vegetation-index analysis from aerial imagery.",
    description:
      "We produce vegetation-health maps from aerial imagery, identifying variation in vigour, irrigation issues, drainage problems, and potential disease pressure. Use these maps to direct scouting, prioritize interventions, and document performance over time.",
    category: "analysis" as const,
    pricingModel: "per_hectare" as const,
    basePriceZar: "600",
    perHectarePriceZar: "120",
    minimumHectares: "5",
    maxHectaresPerDay: "800",
    benefits: [
      "Identify variability across the field",
      "Target scouting precisely to problem zones",
      "Track intervention efficacy across time",
    ],
    useCases: [
      "End-of-season benchmarking",
      "Mid-season correction",
      "Trial-plot comparisons",
    ],
    suitableCustomers: ["Farmers", "Agronomy consultants", "Trial operators"],
    iconKey: "activity",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1530507629858-e3759c1ced7d?w=1200&q=80",
  },
  {
    slug: "pest-disease-detection",
    name: "Pest & Disease Detection",
    shortDescription:
      "Aerial detection that flags problem zones for fast scouting and treatment.",
    description:
      "Our aerial detection service helps identify potential pest or disease hot-spots before they spread. We do not replace in-field scouting — we give you the right places to focus it. Outputs include geo-referenced maps and an annotated report for your agronomist.",
    category: "analysis" as const,
    pricingModel: "per_hectare" as const,
    basePriceZar: "500",
    perHectarePriceZar: "95",
    minimumHectares: "5",
    maxHectaresPerDay: "600",
    benefits: [
      "Reduce scouting labour hours",
      "Catch outbreaks earlier",
      "Geo-located problem areas for treatment",
    ],
    useCases: ["Outbreak response", "Pre-spray assessment", "Insurance evidence"],
    suitableCustomers: ["All crop farmers", "Insurance assessors"],
    iconKey: "search",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1592982537447-7440770faae2?w=1200&q=80",
  },
  {
    slug: "agricultural-mapping",
    name: "Agricultural Mapping",
    shortDescription:
      "High-resolution aerial maps & orthomosaics for planning and record-keeping.",
    description:
      "Generate geo-referenced aerial maps of your farm for planning, record-keeping, and precision-agriculture operations. Outputs include a high-resolution orthomosaic, contour lines, and ready-to-use shape files for most major farm-management platforms.",
    category: "mapping" as const,
    pricingModel: "per_hectare" as const,
    basePriceZar: "450",
    perHectarePriceZar: "85",
    minimumHectares: "5",
    maxHectaresPerDay: "1000",
    benefits: [
      "Geo-rectified, high-resolution outputs",
      "Compatible with major farm-mgmt platforms",
      "Single deliverable: maps, contours, files",
    ],
    useCases: [
      "Farm planning and layout",
      "Boundary disputes & records",
      "Precision-ag baseline data",
    ],
    suitableCustomers: ["New farm purchases", "Estate planning", "Records"],
    iconKey: "map",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80",
  },
  {
    slug: "farm-surveying",
    name: "Farm Surveying",
    shortDescription:
      "Drone-based surveying and visual inspection of agricultural property.",
    description:
      "Aerial surveying for estate layout, topographic information, and volumetric work. Outputs are suitable for planning, design, and reporting. Combine with our mapping service for a complete property record.",
    category: "mapping" as const,
    pricingModel: "custom" as const,
    basePriceZar: "3500",
    perHectarePriceZar: "0",
    minimumHectares: "1",
    maxHectaresPerDay: "500",
    benefits: [
      "Fast, non-invasive topographic data",
      "Suitable for planning submissions",
      "Geo-located visual record",
    ],
    useCases: [
      "Dam sizing & volume calculation",
      "Estate layout / new roads",
      "Pre-purchase inspections",
    ],
    suitableCustomers: ["Estates", "Farmers expanding", "Engineers"],
    iconKey: "compass",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
  },
  {
    slug: "irrigation-monitoring",
    name: "Irrigation Monitoring",
    shortDescription:
      "Monitor irrigation coverage and identify stressed zones from the air.",
    description:
      "Aerial imagery paired with analysis identifies irrigation issues — blocked nozzles, dry patches, drainage problems — and verifies uniformity across the system. Combine with on-the-ground checks for full coverage.",
    category: "monitoring" as const,
    pricingModel: "per_hectare" as const,
    basePriceZar: "500",
    perHectarePriceZar: "110",
    minimumHectares: "2",
    maxHectaresPerDay: "400",
    benefits: [
      "Catch irrigation failures early",
      "Verify uniformity across systems",
      "Save water & energy",
    ],
    useCases: [
      "Pivot / linear-move validation",
      "Drip-system uniformity checks",
      "Drought-stress mapping",
    ],
    suitableCustomers: ["All irrigated farms"],
    iconKey: "droplet",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
  },
  {
    slug: "livestock-monitoring",
    name: "Livestock Monitoring",
    shortDescription:
      "Aerial monitoring of livestock and grazing areas on extensive properties.",
    description:
      "For extensive livestock operations, drone flyovers assist with herd counts, fence-line inspection, water-point checks, and locating animals in difficult terrain. We do not replace stockmen — we extend their reach.",
    category: "livestock" as const,
    pricingModel: "fixed" as const,
    basePriceZar: "1900",
    perHectarePriceZar: "0",
    minimumHectares: "1",
    maxHectaresPerDay: "800",
    benefits: [
      "Extend the reach of stockmen",
      "Locate animals in rough terrain",
      "Identify fence & infrastructure issues",
    ],
    useCases: [
      "Extensive cattle/sheep operations",
      "Game farms",
      "Fence-line inspection",
    ],
    suitableCustomers: ["Cattle ranchers", "Sheep farmers", "Game farmers"],
    iconKey: "cow",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80",
  },
  {
    slug: "agricultural-photography",
    name: "Agricultural Photography & Video",
    shortDescription:
      "Premium aerial imagery for marketing, estates, and farm portfolios.",
    description:
      "Cinematic 4K aerial photography and video for farms, estates, agricultural brands, and marketing campaigns. Includes professional colour grading, music licensing for video, and edited stills ready for print or digital use.",
    category: "media" as const,
    pricingModel: "fixed" as const,
    basePriceZar: "4500",
    perHectarePriceZar: "0",
    minimumHectares: "1",
    maxHectaresPerDay: "200",
    benefits: [
      "Stunning 4K aerial footage",
      "Edited deliverables",
      "Licensed for commercial use",
    ],
    useCases: [
      "Estate marketing",
      "Brand campaigns",
      "Auction / sale catalogues",
    ],
    suitableCustomers: ["Estates", "Agricultural brands", "Marketing teams"],
    iconKey: "camera",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&q=80",
  },
];

const DRONE_DATA = [
  {
    name: "KM-Alpha-01",
    model: "DJI Agras T50",
    registration: "ZS-KMA1",
    capacityKg: "40",
    flightTimeMin: 18,
    status: "available" as const,
    notes: "Primary spray drone — 40L tank, radar terrain follow.",
  },
  {
    name: "KM-Bravo-02",
    model: "DJI Agras T25",
    registration: "ZS-KMB2",
    capacityKg: "20",
    flightTimeMin: 15,
    status: "available" as const,
    notes: "Light spray drone — orchards & vineyards.",
  },
  {
    name: "KM-Charlie-03",
    model: "DJI Mavic 3 Enterprise",
    registration: "ZS-KMC3",
    capacityKg: "0",
    flightTimeMin: 42,
    status: "available" as const,
    notes: "Mapping & inspection — RTK module installed.",
  },
  {
    name: "KM-Delta-04",
    model: "DJI Mavic 3 Multispectral",
    registration: "ZS-KMD4",
    capacityKg: "0",
    flightTimeMin: 38,
    status: "maintenance" as const,
    notes: "NDVI / crop-health. Scheduled maintenance this week.",
  },
];

const TEAM_DATA = [
  {
    name: "Karabo Mokoena",
    role: "Founder & Chief Pilot",
    email: "karabo@kmdrones.co.za",
    phone: "+27 11 555 0101",
    available: true,
    bio: "SACAA-licensed commercial drone pilot with extensive experience in agricultural spray operations.",
    avatarUrl: null,
  },
  {
    name: "Lerato Nkosi",
    role: "Operations Manager",
    email: "lerato@kmdrones.co.za",
    phone: "+27 11 555 0102",
    available: true,
    bio: "Coordinates bookings, dispatch, and client relationships across South Africa.",
    avatarUrl: null,
  },
  {
    name: "Sipho Dlamini",
    role: "Senior Drone Pilot",
    email: "sipho@kmdrones.co.za",
    phone: "+27 11 555 0103",
    available: true,
    bio: "Specialist in vineyard and orchard operations across the Western Cape.",
    avatarUrl: null,
  },
  {
    name: "Naledi van Wyk",
    role: "Agriscience Analyst",
    email: "naledi@kmdrones.co.za",
    phone: "+27 11 555 0104",
    available: true,
    bio: "Turns aerial imagery into actionable insights for farmers.",
    avatarUrl: null,
  },
];

async function main() {
  console.log("🌱 Seeding KM Drone Services database…");

  // --- Admin user ---
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@kmdrones.co.za";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "Admin123!";
  const adminName = process.env.ADMIN_SEED_NAME ?? "KM Drone Admin";

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 12);
    const [admin] = await db
      .insert(users)
      .values({
        email: adminEmail,
        passwordHash: hash,
        name: adminName,
        role: "admin",
        status: "active",
        emailVerified: true,
      })
      .returning();
    console.log(`✓ Admin user created: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}  (please change after first login)`);
  } else {
    console.log(`• Admin already exists: ${adminEmail}`);
  }

  // --- Demo customer ---
  const demoCustomerEmail = "demo@kmdrones.co.za";
  let demoCustomer = await db.query.users.findFirst({
    where: eq(users.email, demoCustomerEmail),
  });
  if (!demoCustomer) {
    const hash = await bcrypt.hash("Demo123!", 12);
    const [u] = await db
      .insert(users)
      .values({
        email: demoCustomerEmail,
        passwordHash: hash,
        name: "Thabo Khumalo",
        phone: "+27 82 555 0199",
        role: "customer",
        status: "active",
        emailVerified: true,
      })
      .returning();
    demoCustomer = u;
    await db.insert(customerProfiles).values({
      userId: u.id,
      companyName: "Highveld Maize Co-op",
      province: "Free State",
      preferredCrop: "Maize",
    });
    // sample farm
    await db.insert(farms).values({
      userId: u.id,
      name: "Home farm — Reitz district",
      address: "Reitz, Free State",
      province: "Free State",
      city: "Reitz",
      lat: "-27.8014",
      lng: "28.4256",
      sizeHectares: "420",
      cropType: "Maize",
      isPrimary: true,
    });
    console.log(`✓ Demo customer created: ${demoCustomerEmail} / Demo123!`);
  }

  // --- Services ---
  const existingServices = await db.query.services.findMany();
  if (existingServices.length === 0) {
    for (const s of SERVICE_DATA) {
      const [inserted] = await db.insert(services).values(s).returning();
      // Add a default urgency fee for each service
      await db.insert(servicePricingRules).values({
        serviceId: inserted.id,
        name: "Urgent (48-hour) surcharge",
        kind: "urgency_fee",
        amountZar: "1500",
        percent: null,
        description: "Applied when the booking must happen within 48 hours.",
        active: true,
      });
      await db.insert(servicePricingRules).values({
        serviceId: inserted.id,
        name: "Distance surcharge (>100km from base)",
        kind: "location_fee",
        amountZar: "8",
        percent: null,
        description:
          "Per-kilometre fuel surcharge applied when travel from operations base exceeds 100 km.",
        active: true,
      });
    }
    console.log(`✓ ${SERVICE_DATA.length} services created with default pricing rules`);
  } else {
    console.log(`• Services already exist (${existingServices.length})`);
  }

  // --- Drones ---
  const existingDrones = await db.query.drones.findMany();
  if (existingDrones.length === 0) {
    for (const d of DRONE_DATA) await db.insert(drones).values(d);
    console.log(`✓ ${DRONE_DATA.length} drones created`);
  } else {
    console.log(`• Drones already exist (${existingDrones.length})`);
  }

  // --- Team ---
  const existingTeam = await db.query.teamMembers.findMany();
  if (existingTeam.length === 0) {
    for (const t of TEAM_DATA) await db.insert(teamMembers).values(t);
    console.log(`✓ ${TEAM_DATA.length} team members created`);
  } else {
    console.log(`• Team members already exist (${existingTeam.length})`);
  }

  console.log("\n✅ Seed complete.\n");
  console.log(`Admin login : ${adminEmail} / ${adminPassword}`);
  console.log(`Demo customer: demo@kmdrones.co.za / Demo123!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
