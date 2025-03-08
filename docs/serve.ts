import { serve } from "bun";
import { join } from "path";

const PROJECT_ROOT = process.cwd();

serve({
  port: 3100,
  fetch(req) {
    const url = new URL(req.url);
    const filepath = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file(join(PROJECT_ROOT, "docs", filepath));
    return new Response(file);
  },
}); 