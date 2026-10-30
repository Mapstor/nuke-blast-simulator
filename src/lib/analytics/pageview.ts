// NBS-016: the GA4 page_view payload. It carries ONLY the pathname — never the
// query string. The simulator's share URL encodes the chosen weapon and the map
// coordinates in the query string (?bomb=&lat=&lng=), so stripping the query
// means a reader's weapon selection and target location never reach Google
// Analytics. tests/analytics.test.ts enforces that nothing here leaks a query.
export function pageviewPayload(pathname: string, origin: string, title: string) {
  // Defensive: if a full URL or a path with a query is passed, keep only the path.
  const path = pathname.split('#')[0].split('?')[0] || '/'
  return {
    page_path: path,
    page_location: origin + path,
    page_title: title,
  }
}
