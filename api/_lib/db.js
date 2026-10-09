// The signups database: a Postgres on Railway. Three small tables, created on first use, so there
// is no migration step. Only these functions reach it; the browser never does.
import pg from "pg";
import { env, httpError } from "./http.js";

let pool;
let ready;

function connect() {
  if (!pool) {
    // Railway's public Postgres endpoint presents a self-signed certificate: encrypt, don't verify.
    // `?sslmode=disable` (a local database) turns encryption off.
    const url = env("DATABASE_URL");
    const ssl = /sslmode=disable/.test(url) ? false : { rejectUnauthorized: false };
    pool = new pg.Pool({ connectionString: url.replace(/[?&]sslmode=[^&]*/, ""), ssl, max: 2, idleTimeoutMillis: 10_000 });
    // An idle connection the database drops (a restart, a network blip) must not crash the
    // function; the pool replaces it on the next query.
    pool.on("error", (err) => console.error("signups database: idle connection dropped:", err.message));
  }
  if (!ready) {
    ready = pool.query(`
      create table if not exists signups (
        email       text primary key,
        provider    text not null,
        first_seen  timestamptz not null default now(),
        last_seen   timestamptz not null default now(),
        sign_ins    integer not null default 1
      );
      create table if not exists downloads (
        id          bigserial primary key,
        email       text not null,
        file        text not null,
        created_at  timestamptz not null default now()
      );
      create table if not exists email_sends (
        id          bigserial primary key,
        email       text not null,
        ip          text not null,
        created_at  timestamptz not null default now()
      );
      create index if not exists email_sends_recent on email_sends (created_at);
    `).catch((err) => {
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
    throw httpError(502, `The signups database refused the request: ${err.message}`);
  }
}

export async function recordSignIn(email, provider) {
  await query(
    `insert into signups (email, provider) values ($1, $2)
     on conflict (email) do update set last_seen = now(), sign_ins = signups.sign_ins + 1`,
    [email.toLowerCase(), provider],
  );
}

export async function recordDownload(email, file) {
  await query("insert into downloads (email, file) values ($1, $2)", [email.toLowerCase(), file]);
}

// Email links: at most 3 per address and 10 per IP an hour, so the form can't be used to spam.
export async function allowEmailSend(email, ip) {
  const { rows } = await query(
    `select count(*) filter (where email = $1) as by_email, count(*) filter (where ip = $2) as by_ip
     from email_sends where created_at > now() - interval '1 hour'`,
    [email.toLowerCase(), ip],
  );
  if (Number(rows[0].by_email) >= 3 || Number(rows[0].by_ip) >= 10) return false;
  await query("insert into email_sends (email, ip) values ($1, $2)", [email.toLowerCase(), ip]);
  return true;
}
