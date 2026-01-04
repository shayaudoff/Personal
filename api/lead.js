import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // CORS
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
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const {
      name,
      email,
      phone,
      message,
      generatedLink,
      company
    } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        ok: false,
        error: "Missing name or phone"
      });
    }

    const isBot = Boolean(company && company.trim() !== "");

    const ip =
      (req.headers["x-forwarded-for"] || "")
        .split(",")[0]
        ?.trim() ||
      req.socket?.remoteAddress ||
      null;

    const userAgent = req.headers["user-agent"] || null;

    const { error } = await supabase.from("wa_leads").insert({
      name,
      email: email || null,
      phone,
      message: message || null,
      generated_link: generatedLink || null,
      ip,
      user_agent: userAgent,
      is_bot: isBot
    });

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || String(err)
    });
  }
}