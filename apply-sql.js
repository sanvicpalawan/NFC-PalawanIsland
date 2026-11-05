require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const dir = path.join(__dirname, "drizzle");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort();

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), "utf8");
    const stmts = sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);
    for (const s of stmts) {
      try { await c.query(s); }
      catch (e) {
        if (/already exists/i.test(e.message)) continue;
        console.log("ERR in " + f + ": " + e.message.slice(0, 150));
      }
    }
    console.log("applied " + f + " (" + stmts.length + " statements)");
  }
  const r = await c.query("select table_name from information_schema.tables where table_schema='nfc_palawan' order by 1");
  console.log("tables: " + r.rows.map(x => x.table_name).join(", "));
  await c.end();
})().catch(e => { console.log("FATAL " + e.message); process.exit(1); });
