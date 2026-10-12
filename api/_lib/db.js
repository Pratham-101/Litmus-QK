// The website's database: a Postgres on Railway. Small tables, created on first use, so there is
// no migration step. Only these functions reach it; the browser never does.
import pg from "pg";
import { env, httpError } from "./http.js";

let pool;
let ready;

const SCHEMA = `
  create table if not exists signups (
    email       text primary key,
    name        text,
    company     text,
    provider    text not null,              -- form | google | microsoft | email
    first_seen  timestamptz not null default now(),
    last_seen   timestamptz not null default now(),
    sign_ins    integer not null default 1
  );
  alter table signups add column if not exists name text;
  alter table signups add column if not exists company text;
  create table if not exists downloads (
    id          bigserial primary key,
    email       text not null,
    file        text not null,
    created_at  timestamptz not null default now()
  );
  create table if not exists leads (            -- "Talk to our FDE"
    id          bigserial primary key,
    name        text not null,
    email       text not null,
    company     text,
    agent_kind  text,
    agent       text,
    message     text,
    created_at  timestamptz not null default now()
  );
  create table if not exists rate_events (     -- abuse limits for the public forms
    id          bigserial primary key,
    kind        text not null,
    key         text not null,
    created_at  timestamptz not null default now()
  );
  create index if not exists rate_events_recent on rate_events (kind, key, created_at);
`;

function connect() {
  if (!pool) {
    // Railway's public Postgres endpoint presents a self-signed certificate: encrypt, don't verify.
    // `?sslmode=disable` (a local database) turns encryption off.
    const url = env("DATABASE_URL");
    const ssl = /sslmode=disable/.test(url) ? false : { rejectUnauthorized: false };
    pool = new pg.Pool({ connectionString: url.replace(/[?&]sslmode=[^&]*/, ""), ssl, max: 2, idleTimeoutMillis: 10_000 });
    // An idle connection the database drops (a restart, a network blip) must not crash the
    // function; the pool replaces it on the next query.
    pool.on("error", (err) => console.error("website database: idle connection dropped:", err.message));
  }
  if (!ready) {
    ready = pool.query(SCHEMA).catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready.then(() => pool);
}

async function query(sql, params) {
  try {
    const db = await connect();
    return await db.query(sql, params);
  } catch (err) {
    if (err.status) throw err;
    throw httpError(502, `The website database refused the request: ${err.message}`);
  }
}

export async function recordSignIn(email, provider, { name = null, company = null } = {}) {
  await query(
    `insert into signups (email, provider, name, company) values ($1, $2, $3, $4)
     on conflict (email) do update set last_seen = now(), sign_ins = signups.sign_ins + 1,
       name = coalesce(excluded.name, signups.name), company = coalesce(excluded.company, signups.company)`,
    [email.toLowerCase(), provider, name, company],
  );
}

export async function recordDownload(email, file) {
  await query("insert into downloads (email, file) values ($1, $2)", [email.toLowerCase(), file]);
}

export async function recordLead(lead) {
  await query(
    "insert into leads (name, email, company, agent_kind, agent, message) values ($1, $2, $3, $4, $5, $6)",
    [lead.name, lead.email.toLowerCase(), lead.company, lead.agent_kind, lead.agent, lead.message],
  );
}

// At most `limit` events of `kind` per key an hour; records this one when allowed.
export async function allow(kind, key, limit) {
  const { rows } = await query(
    "select count(*) as n from rate_events where kind = $1 and key = $2 and created_at > now() - interval '1 hour'",
    [kind, key],
  );
  if (Number(rows[0].n) >= limit) return false;
  await query("insert into rate_events (kind, key) values ($1, $2)", [kind, key]);
  return true;
}
