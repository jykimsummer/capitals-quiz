// 저장/조회 계층. Supabase가 설정돼 있으면 REST(PostgREST)로, 아니면 localStorage로 동작.
(function () {
  const cfg = window.QUIZ_CONFIG || {};
  const useSupabase = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  const LS_KEY = "capitals-quiz-attempts";

  function headers() {
    return {
      "Content-Type": "application/json",
      apikey: cfg.SUPABASE_ANON_KEY,
      Authorization: "Bearer " + cfg.SUPABASE_ANON_KEY,
    };
  }
  async function rest(path, body, extra) {
    const res = await fetch(cfg.SUPABASE_URL + "/rest/v1/" + path, {
      method: "POST",
      headers: Object.assign(headers(), extra || {}),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let msg = res.status + " " + res.statusText;
      try { const j = await res.json(); msg = j.message || j.hint || msg; } catch (_) {}
      throw new Error(msg);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  function lsAll() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (_) { return []; }
  }
  function lsSave(rows) { localStorage.setItem(LS_KEY, JSON.stringify(rows)); }
  const norm = (s) => String(s || "").replace(/\s+/g, "");

  window.QuizAPI = {
    mode: useSupabase ? "supabase" : "local",

    // attempt: {section, student_id, name, week, score, total, wrong, answers}
    async saveAttempt(attempt) {
      if (useSupabase) {
        await rest("attempts", attempt, { Prefer: "return=minimal" });
        return;
      }
      const rows = lsAll();
      rows.push(Object.assign({ id: rows.length + 1, created_at: new Date().toISOString() }, attempt));
      lsSave(rows);
    },

    async getHistory(student_id, name) {
      if (useSupabase) {
        return rest("rpc/get_history", { p_student_id: student_id, p_name: name });
      }
      return lsAll()
        .filter((r) => r.student_id === student_id && norm(r.name) === norm(name))
        .sort((a, b) => a.week - b.week || a.created_at.localeCompare(b.created_at));
    },

    async adminAttempts(password) {
      if (useSupabase) {
        return rest("rpc/admin_attempts", { p_password: password });
      }
      if (password !== "jeonghwa2026") throw new Error("wrong password");
      return lsAll().sort((a, b) =>
        a.section.localeCompare(b.section) || a.student_id.localeCompare(b.student_id) ||
        a.week - b.week || a.created_at.localeCompare(b.created_at));
    },
  };
})();
