/****************************************************************
 *  utils/auth.js  – shared helper for all admin-side auth checks
 ****************************************************************/

/* ❶ First grab the role that the frontend saved during login.
      This covers the case where the JWT itself doesn’t embed it. */
const roleFromLS = localStorage.getItem("role");

/* ❷ Decode JWT payload (if any) and merge with the fallback role. */
export function getJwtPayload() {
  const token = localStorage.getItem("jwt");

  /* ── No token at all ───────────────────────────────────────── */
  if (!token) {
    console.warn("[auth] no JWT in localStorage");
    return { role: roleFromLS || null };
  }

  try {
    /* split "<header>.<payload>.<sig>" → grab middle section */
    const [, base64] = token.split(".");
    const payload = JSON.parse(atob(base64));

    /* diagnostics */
    const info = {
      hasToken: true,
      roleInLS: roleFromLS,
      roleInJWT: payload.role,
      exp: payload.exp,
    };
    console.log("[auth] getJwtPayload result:", info);

    /* merge role from LS as a fallback */
    return { ...payload, role: payload.role || roleFromLS };
  } catch (err) {
    console.error("[auth] failed to parse JWT:", err);
    return { role: roleFromLS || null };
  }
}
