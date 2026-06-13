/** Fetch a child-friendly thumbnail from Wikimedia Commons (free, no API key) */
export async function fetchWordImage(searchTerm: string): Promise<string> {
  const term = searchTerm.trim();
  if (!term) return "";

  try {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: term + " illustration",
      gsrlimit: "3",
      prop: "pageimages",
      piprop: "thumbnail",
      pithumbsize: "300",
      format: "json",
      origin: "*",
    });

    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";

    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return "";

    for (const page of Object.values(pages) as { thumbnail?: { source?: string } }[]) {
      if (page.thumbnail?.source) return page.thumbnail.source;
    }
  } catch {
    /* fallback to emoji */
  }
  return "";
}
