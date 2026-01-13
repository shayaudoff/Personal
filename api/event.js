import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // CORS (match your existing lead.js style)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({
      ok: false,
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Vercel may provide req.body as an object or a string
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    // Minimal validation
    if (!body.event) {
      return res.status(400).json({ ok: false, error: "Missing event" });
    }

    const ip =
      (req.headers["x-forwarded-for"] || "")
        .toString()
        .split(",")[0]
        ?.trim() ||
      req.socket?.remoteAddress ||
      null;

    const userAgent = req.headers["user-agent"] || null;
    const acceptLanguage = req.headers["accept-language"] || null;

    // Optional geo headers (may be null)
    const country = req.headers["x-vercel-ip-country"] || null;
    const region = req.headers["x-vercel-ip-country-region"] || null;
    const city = req.headers["x-vercel-ip-city"] || null;

    // Map known fields (everything else should be ignored)
    const row = {
      // consent + identity
      visitor_id: body.visitor_id || null,
      consent_version: body.consent_version || null,
      consent_analytics: Boolean(body.consent_analytics),
      consent_marketing: Boolean(body.consent_marketing),

      // event core
      event: body.event,
      event_type: body.event_type || null,
      ts: body.ts || null,
      path: body.path || null,
      referrer: body.referrer || null,

      // marketing attribution
      utm: body.utm || null,

      // client hints
      tz: body.tz || null,
      locale: body.locale || null,
      color_scheme: body.color_scheme || null,
      viewport_w: Number.isFinite(body.viewport_w) ? body.viewport_w : (body.viewport_w ?? null),
      viewport_h: Number.isFinite(body.viewport_h) ? body.viewport_h : (body.viewport_h ?? null),
      screen_w: Number.isFinite(body.screen_w) ? body.screen_w : (body.screen_w ?? null),
      screen_h: Number.isFinite(body.screen_h) ? body.screen_h : (body.screen_h ?? null),
      dpr: body.dpr ?? null,

      // element info
      element: body.element || null,

      // server-observed
      ip,
      user_agent: userAgent,
      accept_language: acceptLanguage,
      country,
      region,
      city,
    };

    const { error } = await supabase.from("site_events").insert(row);
    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || String(err),
    });
  }
}
