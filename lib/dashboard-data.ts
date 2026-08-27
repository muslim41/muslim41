import type { SupabaseClient } from "@supabase/supabase-js";

export type Venue = {
  id: string;
  name: string;
  city: string;
  venue_type: string;
  required_headcount: number;
};

export type VenueStaffing = Venue & {
  assigned_today: number;
  shortfall: number;
  understaffed: boolean;
};

export type DashboardSummary = {
  totalVenues: number;
  guardsOnShiftToday: number;
  understaffedVenues: VenueStaffing[];
  allVenues: VenueStaffing[];
  licencesExpiringSoon: number;
  licencesExpired: number;
  openIncidents: number;
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardSummary(
  supabase: SupabaseClient,
): Promise<DashboardSummary> {
  const todayStart = startOfToday();
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const in30Days = new Date(todayStart);
  in30Days.setDate(in30Days.getDate() + 30);

  const [venuesRes, shiftsRes, staffRes, incidentsRes] = await Promise.all([
    supabase
      .from("venues")
      .select("id, name, city, venue_type, required_headcount")
      .eq("active", true)
      .order("name"),
    supabase
      .from("shifts")
      .select("venue_id, staff_id, status")
      .gte("start_time", todayStart.toISOString())
      .lt("start_time", todayEnd.toISOString()),
    supabase.from("staff").select("id, sia_licence_expiry").eq("active", true),
    supabase.from("incidents").select("id, status"),
  ]);

  if (venuesRes.error) throw venuesRes.error;
  if (shiftsRes.error) throw shiftsRes.error;
  if (staffRes.error) throw staffRes.error;
  if (incidentsRes.error) throw incidentsRes.error;

  const venues = venuesRes.data ?? [];
  const shifts = shiftsRes.data ?? [];
  const staff = staffRes.data ?? [];
  const incidents = incidentsRes.data ?? [];

  const onShiftStatuses = new Set(["scheduled", "confirmed", "completed"]);
  const staffOnShiftByVenue = new Map<string, Set<string>>();
  let guardsOnShiftToday = 0;

  for (const shift of shifts) {
    if (!onShiftStatuses.has(shift.status)) continue;
    guardsOnShiftToday++;
    const set = staffOnShiftByVenue.get(shift.venue_id) ?? new Set<string>();
    set.add(shift.staff_id);
    staffOnShiftByVenue.set(shift.venue_id, set);
  }

  const allVenues: VenueStaffing[] = venues.map((venue) => {
    const assigned = staffOnShiftByVenue.get(venue.id)?.size ?? 0;
    const shortfall = Math.max(0, venue.required_headcount - assigned);
    return {
      ...venue,
      assigned_today: assigned,
      shortfall,
      understaffed: shortfall > 0,
    };
  });

  const understaffedVenues = allVenues
    .filter((v) => v.understaffed)
    .sort((a, b) => b.shortfall - a.shortfall);

  let licencesExpiringSoon = 0;
  let licencesExpired = 0;
  for (const person of staff) {
    if (!person.sia_licence_expiry) continue;
    const expiry = new Date(person.sia_licence_expiry);
    if (expiry < todayStart) {
      licencesExpired++;
    } else if (expiry <= in30Days) {
      licencesExpiringSoon++;
    }
  }

  const openIncidents = incidents.filter((i) => i.status !== "closed").length;

  return {
    totalVenues: venues.length,
    guardsOnShiftToday,
    understaffedVenues,
    allVenues,
    licencesExpiringSoon,
    licencesExpired,
    openIncidents,
  };
}
