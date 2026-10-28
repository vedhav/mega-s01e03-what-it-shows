<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import tickets from '#lib/data/tickets-4471.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { problemsOf, type Problem } from '#lib/kb/problems';

  let {
    ticket,
    what = {},
    only,
  }: { ticket: number; what?: Partial<Record<Problem, string>>; only?: Problem } = $props();

  const split = $derived(problemsOf(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const filed = (p: Problem) => (tickets.problems as Record<string, { issue: string; state: string; note: string }>)[p];
  const raw = (reports as Report[]).filter((r) => r.mergedInto === ticket).length;
  const shown = $derived(only ? split.rows.filter((r) => r.problem === only) : split.rows);
</script>

<p class="sum">
  <strong>{split.merged.length}</strong> reports in #{ticket} ({raw} export rows: the export's pages overlap) ·
  <strong>{split.rows.length}</strong>
  {split.rows.length === 1 ? 'problem' : 'problems'} · #{ticket} closed {tickets.closed}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>what goes wrong</th><th>tenants</th><th>seen</th><th>ticket</th><th>state</th></tr>
  </thead>
  <tbody>
    {#each shown as row (row.problem)}
      {@const t = filed(row.problem)}
      <tr class:open={t?.state === 'open'}>
        <td><code>{row.problem}</code></td>
        <td><strong>{row.reports.length}</strong></td>
        <td>{what[row.problem] ?? ''}</td>
        <td>{row.tenants}</td>
        <td class="muted">{row.firstSeen} → {row.lastSeen}</td>
        <td>{#if t}<a href={t.issue}>{t.issue.replace(/^.*\/issues\//, '#')}</a>{:else}<span class="none">none</span>{/if}</td>
        <td>{#if t}<b>{t.state}</b> <span class="muted">{t.note}</span>{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each shown as row (row.problem)}
  {#if row.problem !== 'one-day' && row.oneDay}
    <p class="note">{row.oneDay} of the {row.reports.length} <code>{row.problem}</code> reports read as a one-day move; counted under
      <code>{row.problem}</code> by tenant and again under <code>one-day</code>.</p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .muted { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); font-weight: 600; }
  .open td { background: var(--warn-bg); }
</style>
