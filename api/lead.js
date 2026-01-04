const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({
      ok: false,
      error: "Missing Supabase environment variables"
    });
    return;
  }

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

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
      res.status(400).json({ ok: false, error: "Missing name or phone" });
      return;
    }

    const isBot = Boolean(company && company.trim() !== "");

    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket?.remoteAddress ||
      null;

    const userAgent = req.headers["user-agent"] || null;

    const { error } = await supabase
      .from("wa_leads")
      .insert({
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

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message || String(err)
    });
  }
};