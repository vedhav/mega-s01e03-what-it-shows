// The problems inside a merged ticket, counted the way the desk counts (CauseTable): every report
// once, filed by its cause (causes.ts). Reports the desk read differently (desk-notes.json) are a
// problem of their own, counted again under it and footnoted where they are filed.
import { groupByCause, readAs, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'unplaced' | 'one-day';

export type ProblemRow = {
  problem: Problem;
  reports: Report[];
  // How many of these reports the desk also tracks as a one-day move.
  oneDay: number;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
};

function span(rs: Report[]): Pick<ProblemRow, 'tenants' | 'firstSeen' | 'lastSeen'> {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return { tenants: new Set(rs.map((r) => r.tenant)).size, firstSeen: days[0], lastSeen: days[days.length - 1] };
}

export function problemsOf(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: Report[]; rows: ProblemRow[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const rows: ProblemRow[] = groupByCause(merged, tenantOf).map((g) => ({
    problem: g.cause,
    reports: g.reports,
    oneDay: readAs(g, oneDayMove),
    ...span(g.reports),
  }));
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) rows.push({ problem: 'one-day', reports: moved, oneDay: moved.length, ...span(moved) });
  return { merged, rows };
}
