/**
 * Seeds Supabase with realistic fake data for "ABC Security Ltd":
 * 12 venues, ~150 staff, today's shifts (with a few absences), a handful
 * of incidents, and a few venues left deliberately understaffed.
 *
 * Requires SUPABASE_SECRET_KEY (bypasses RLS) — never expose this key
 * to the browser. Run with: npm run seed
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { fakerEN_GB as faker } from "@faker-js/faker";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SECRET_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { persistSession: false },
});

faker.seed(4102); // reproducible dataset across re-seeds

// ---------------------------------------------------------------------------
// Venues
// ---------------------------------------------------------------------------
const VENUE_DEFS = [
  { name: "Meridian Shopping Centre", type: "retail", city: "Manchester", headcount: 6 },
  { name: "Ovation Nightclub", type: "nightlife", city: "Manchester", headcount: 8 },
  { name: "Harborview Retail Park", type: "retail", city: "Liverpool", headcount: 4 },
  { name: "Zenith Corporate Tower", type: "office", city: "Leeds", headcount: 3 },
  { name: "The Warehouse Live", type: "event venue", city: "Sheffield", headcount: 10 },
  { name: "Grandview Hotel & Spa", type: "hospitality", city: "Manchester", headcount: 4 },
  { name: "Northgate Business Park", type: "office", city: "Leeds", headcount: 2 },
  { name: "Riverside Retail Outlet", type: "retail", city: "Chester", headcount: 5 },
  { name: "Apex Distribution Depot", type: "logistics", city: "Warrington", headcount: 3 },
  { name: "The Pavilion Arena", type: "event venue", city: "Sheffield", headcount: 12 },
  { name: "Coastal Leisure Complex", type: "leisure", city: "Blackpool", headcount: 5 },
  { name: "Fenwick Student Quarter", type: "residential", city: "Liverpool", headcount: 2 },
] as const;

// Venues at these indices are deliberately left understaffed by the shift
// generator below (fewer staff assigned today than required_headcount).
const UNDERSTAFFED_VENUE_INDEXES = new Set([1, 4, 9]);

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------
const STAFF_COUNT = 150;
const SUPERVISOR_RATIO = 0.1; // ~15 supervisors
const CONTROLLER_COUNT = 5;
const LICENCE_TYPES = ["Door Supervisor", "CCTV (Public Space Surveillance)", "Close Protection", "Security Guarding"];

function randomLicenceExpiry(): string | null {
  // Rough real-world spread: 8% already expired, 12% expiring within 30
  // days, 5% with no licence on file, the rest comfortably valid.
  const roll = faker.number.float({ min: 0, max: 1 });
  if (roll < 0.05) return null;
  if (roll < 0.13) {
    return faker.date.recent({ days: 60 }).toISOString().slice(0, 10); // expired
  }
  if (roll < 0.25) {
    return faker.date.soon({ days: 30 }).toISOString().slice(0, 10); // expiring soon
  }
  return faker.date
    .future({ years: 2.5 })
    .toISOString()
    .slice(0, 10); // healthy
}

async function main() {
  console.log("Seeding ABC Security Ltd data...");

  console.log("Clearing existing data...");
  await supabase.from("incidents").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("shifts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("staff").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("venues").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // -- Venues -----------------------------------------------------------
  const venueRows = VENUE_DEFS.map((v) => ({
    name: v.name,
    client_name: "ABC Security Ltd",
    address: faker.location.streetAddress(),
    city: v.city,
    venue_type: v.type,
    required_headcount: v.headcount,
    active: true,
  }));

  const { data: venues, error: venueErr } = await supabase
    .from("venues")
    .insert(venueRows)
    .select();
  if (venueErr || !venues) throw venueErr;
  console.log(`Inserted ${venues.length} venues`);

  // -- Staff --------------------------------------------------------------
  const staffRows = Array.from({ length: STAFF_COUNT }, (_, i) => {
    const role =
      i < CONTROLLER_COUNT
        ? "controller"
        : i < CONTROLLER_COUNT + STAFF_COUNT * SUPERVISOR_RATIO
          ? "supervisor"
          : "guard";
    const fullName = faker.person.fullName();
    return {
      full_name: fullName,
      role,
      email: faker.internet
        .email({ firstName: fullName.split(" ")[0], provider: "abcsecurity.co.uk" })
        .toLowerCase(),
      phone: faker.phone.number({ style: "national" }),
      sia_licence_number: faker.string.numeric(10),
      sia_licence_type: faker.helpers.arrayElement(LICENCE_TYPES),
      sia_licence_expiry: randomLicenceExpiry(),
      active: true,
    };
  });

  const { data: staff, error: staffErr } = await supabase
    .from("staff")
    .insert(staffRows)
    .select();
  if (staffErr || !staff) throw staffErr;
  console.log(`Inserted ${staff.length} staff`);

  const guardsAndSupervisors = staff.filter((s) => s.role !== "controller");
  const shuffledStaff = faker.helpers.shuffle(guardsAndSupervisors);

  // -- Shifts ---------------------------------------------------------
  // Cover a 5-day window (yesterday -> +3 days) so the dashboard's "today"
  // numbers sit inside a believable rota, not an isolated snapshot.
  const shiftRows: {
    venue_id: string;
    staff_id: string;
    start_time: string;
    end_time: string;
    status: string;
  }[] = [];

  let staffCursor = 0;
  function nextStaffId() {
    const person = shuffledStaff[staffCursor % shuffledStaff.length];
    staffCursor++;
    return person.id;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let dayOffset = -1; dayOffset <= 3; dayOffset++) {
    const day = new Date(today);
    day.setDate(day.getDate() + dayOffset);
    const isToday = dayOffset === 0;

    venues.forEach((venue, venueIdx) => {
      const isDeliberatelyUnderstaffed = UNDERSTAFFED_VENUE_INDEXES.has(venueIdx);
      // Understaffed venues are short today specifically; other days are
      // close to full so the pattern reads as "today's problem", not a
      // permanently broken venue.
      const shortfall = isDeliberatelyUnderstaffed
        ? faker.number.int({ min: 2, max: 3 })
        : 0;
      const assignedCount = isToday
        ? Math.max(1, venue.required_headcount - shortfall)
        : Math.max(1, venue.required_headcount - faker.number.int({ min: 0, max: 1 }));

      for (let i = 0; i < assignedCount; i++) {
        const startHour = faker.helpers.arrayElement([6, 8, 14, 18, 22]);
        const start = new Date(day);
        start.setHours(startHour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + faker.helpers.arrayElement([8, 10, 12]));

        // A small, realistic slice of no-shows — only meaningful for
        // shifts that have actually started (today or in the past).
        let status: string = "scheduled";
        if (dayOffset < 0) {
          status = "completed";
        } else if (isToday) {
          status = faker.number.float({ min: 0, max: 1 }) < 0.06 ? "absent" : "confirmed";
        }

        shiftRows.push({
          venue_id: venue.id,
          staff_id: nextStaffId(),
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          status,
        });
      }
    });
  }

  const { error: shiftErr } = await supabase.from("shifts").insert(shiftRows);
  if (shiftErr) throw shiftErr;
  console.log(`Inserted ${shiftRows.length} shifts`);

  // -- Incidents --------------------------------------------------------
  const INCIDENT_TEMPLATES = [
    { title: "Unauthorised entry attempt", severity: "high" },
    { title: "Altercation between patrons", severity: "medium" },
    { title: "Fire alarm activation - false alarm", severity: "low" },
    { title: "Suspicious package reported", severity: "critical" },
    { title: "Theft reported by tenant", severity: "medium" },
    { title: "CCTV outage - blind spot in car park", severity: "low" },
    { title: "Trespassing after hours", severity: "medium" },
    { title: "Medical emergency - attendee collapsed", severity: "high" },
    { title: "Vandalism to west entrance", severity: "low" },
    { title: "Verbal threat made against staff member", severity: "high" },
    { title: "Perimeter fence breach", severity: "critical" },
    { title: "Lost child reported and located", severity: "low" },
  ] as const;

  const incidentRows = Array.from({ length: 22 }, () => {
    const template = faker.helpers.arrayElement(INCIDENT_TEMPLATES);
    const venue = faker.helpers.arrayElement(venues);
    const reporter = faker.helpers.arrayElement(guardsAndSupervisors);
    const status = faker.helpers.weightedArrayElement([
      { value: "open", weight: 4 },
      { value: "investigating", weight: 2 },
      { value: "closed", weight: 4 },
    ]);
    return {
      venue_id: venue.id,
      reported_by: reporter.id,
      title: template.title,
      description: faker.lorem.sentences(2),
      severity: template.severity,
      status,
      occurred_at: faker.date.recent({ days: 14 }).toISOString(),
    };
  });

  const { error: incidentErr } = await supabase.from("incidents").insert(incidentRows);
  if (incidentErr) throw incidentErr;
  console.log(`Inserted ${incidentRows.length} incidents`);

  console.log("Done. Understaffed today: " +
    [...UNDERSTAFFED_VENUE_INDEXES].map((i) => venues[i].name).join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
