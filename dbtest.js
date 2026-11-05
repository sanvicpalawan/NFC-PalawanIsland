require("dotenv").config({ quiet: true });
const { Client } = require("pg");
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const q = async (label, sql) => {
    try { const r = await c.query(sql); console.log(label + " => " + JSON.stringify(r.rows).slice(0, 300)); }
    catch (e) { console.log(label + " ERR => " + e.message); }
  };
  await q("whoami", "select current_user cu, current_schema() cs");
  await q("my_privs", "select has_schema_privilege(current_user,'nfc_palawan','CREATE') c, has_schema_privilege(current_user,'public','CREATE') p");
  await q("create_test", "create table if not exists nfc_palawan.__probe(id int)");
  await q("drop_test", "drop table if exists nfc_palawan.__probe");
  await q("tables", "select table_name from information_schema.tables where table_schema='nfc_palawan' order by 1");
  await c.end();
})().catch(e => { console.log("FATAL " + e.message); process.exit(1); });
