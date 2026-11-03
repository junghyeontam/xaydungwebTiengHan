const res = await fetch("http://localhost:3000");
const html = await res.text();
const matches = html.match(/href="([^"]+\.css[^"]*)"/g);
console.log("CSS links found in HTML:", matches);

if (matches) {
  for (const m of matches) {
    const raw = m.replace('href="', '').replace('"', '');
    const fullUrl = raw.startsWith("http") ? raw : "http://localhost:3000" + raw;
    const cssRes = await fetch(fullUrl);
    console.log("Fetched CSS:", fullUrl, "=> Status:", cssRes.status, "Content-Type:", cssRes.headers.get("content-type"));
    if (!cssRes.ok) {
      console.error("FAIL: CSS returned status", cssRes.status);
    }
  }
}
