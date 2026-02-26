# Risk Matrix

> Risk profile: **Low** — this is a pure client-side, stateless feature with no authentication, no API calls, and no persistence. Risks are scoped to third-party library behaviour and arithmetic correctness.

## Rules

- Maximum 5 risks.
- Mitigation required for Medium and High.
- Low risks may be marked as monitor-only.

## Scale

- Probability: `Low` | `Medium` | `High`
- Impact: `Low` | `Medium` | `High`

| Risk                                                                                           | Probability | Impact | Priority | Mitigation                                                                                                                             | Status |
| ---------------------------------------------------------------------------------------------- | ----------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Client-side PDF library adds excessive bundle weight (200–500 KB), degrading initial page load | Low         | Medium | Low      | Lazy-load the PDF module via dynamic import on button click; measure bundle size in CI with a size budget check                        | Open   |
| Floating-point arithmetic produces display errors in monetary values (e.g. `10.000000000001`)  | Low         | Low    | Low      | Apply `Math.round(value * 100) / 100` consistently in the totals calculation function; cover with unit tests using fractional fixtures | Open   |
| Cross-browser PDF rendering inconsistency (font metrics, layout shift) in Safari or Firefox    | Low         | Medium | Low      | Embed fonts explicitly in the PDF document; include cross-browser smoke tests in the Playwright E2E suite                              | Open   |
