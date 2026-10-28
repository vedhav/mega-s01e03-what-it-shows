# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

---

## #4471 split (added 2026-10-28)

#4471 merged 412 date reports as one issue. They are three problems, each with its own ticket:

| ticket | problem | reports |
|---|---|---|
| [#1](https://github.com/vedhav/mega-s01e03-what-it-shows/issues/1) | `parser`: month-first parser | 374 |
| [#2](https://github.com/vedhav/mega-s01e03-what-it-shows/issues/2) | `hint`: booking-v3 `MM/DD/YYYY` hint | 33 |
| [#3](https://github.com/vedhav/mega-s01e03-what-it-shows/issues/3) | `one-day`: one-day shift (time zone / DST) | 5 |

- The page: [`src/routes/kb/incidents/4471-split/+page.svx`](src/routes/kb/incidents/4471-split/+page.svx), signed, desk ref `DR-M7SV-8CCN`.
- Its logic: [`src/lib/kb/problems.ts`](src/lib/kb/problems.ts), [`src/lib/kb/ProblemTable.svelte`](src/lib/kb/ProblemTable.svelte).
- As the desk sees it: [`desk-view/kb/incidents/4471-split.html`](desk-view/kb/incidents/4471-split.html) and [`desk-view/4471-split.png`](desk-view/4471-split.png).
- Build it yourself: `npm install && npm run build`, then open `build/kb/incidents/4471-split.html` (or `npm run preview`).
