const routes = [
  "/",
  "/roadmap",
  "/theory",
  "/lessons/beginner-1-lesson-3-ayo-eoyo-endings",
  "/review",
  "/profile",
  "/shop",
  "/auth",
  "/vi/admin/login",
  "/vi/admin/teaching/lessons",
];

for (const r of routes) {
  const res = await fetch(`http://localhost:3000${r}`);
  console.log(`${r.padEnd(46)} -> HTTP ${res.status}`);
  if (res.status !== 200) {
    console.error(`FAIL: Expected 200 for ${r}, got ${res.status}`);
    process.exitCode = 1;
  }
}

const unauthGet = await fetch("http://localhost:3000/api/admin/orders?role=content_editor");
console.log(`/api/admin/orders GET (content_editor)         -> HTTP ${unauthGet.status}`);
if (unauthGet.status !== 403) {
  console.error(`FAIL: Expected 403 for content_editor on /api/admin/orders, got ${unauthGet.status}`);
  process.exitCode = 1;
}

const unauthPost = await fetch("http://localhost:3000/api/admin/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    action: "approve_refund",
    actorRole: "support_agent",
    actorEmail: "support@junghyeon.vn",
    orderId: "ORD-1",
    refundId: "REF-1",
  }),
});
console.log(`/api/admin/orders POST (support_agent)         -> HTTP ${unauthPost.status}`);
if (unauthPost.status !== 403) {
  console.error(`FAIL: Expected 403 for support_agent refund approval, got ${unauthPost.status}`);
  process.exitCode = 1;
}
