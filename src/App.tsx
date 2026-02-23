import { useState, useRef, useEffect, useCallback } from "react";

const TODAY = new Date("2026-02-20");

// ── LOCALSTORAGE HELPERS ─────────────────────────────────────
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const set = useCallback((v) => {
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [val, set];
}

// ── INITIAL DATA ─────────────────────────────────────────────
const INITIAL_TASKS = [
  { id: 1, title: "Industry Emails – Check in / next steps", category: "Emails", priority: "high", status: "in-progress", dueDate: "2026-02-20", needsElisa: true, note: "Elisa asked about this on Feb 9. Look at sign-up numbers by industry to prioritize.", userNotes: "Need to pull analytics on form sign-ups by industry before next meeting", links: [{ label: "Consulting Email", url: "https://docs.google.com/document/d/1l0WXnaHYbQfMahe90JOUoBvD08cCcdRtlj2XvDSMNzY/edit" }], completedThisWeek: false, attachments: [], goalId: null },
  { id: 2, title: "MSx Pages Document – Review & Notes", category: "Website", priority: "high", status: "in-progress", dueDate: "2026-02-20", needsElisa: false, note: "Review MSx pages with notes doc.", userNotes: "", links: [{ label: "MSx Pages w/Notes", url: "https://docs.google.com/document/d/1vFhDbxmmCXu8D4CuwDe9gmEpTuaF_kwXr07bVtghA9w/edit" }], completedThisWeek: false, attachments: [], goalId: null },
  { id: 3, title: "AF Growth Goals – February 2026 Update", category: "Goals", priority: "high", status: "in-progress", dueDate: "2026-02-25", needsElisa: true, note: "Valeria and Tyler added Aleena to UX designer meeting.", userNotes: "", links: [{ label: "Feb 2026 Growth Goals", url: "https://docs.google.com/document/d/1BIcDfOriWmLFuJCKdBri71v_kTXbafs592cMwIKVSgc/edit" }], completedThisWeek: false, attachments: [], goalId: null },
  { id: 4, title: "Scripts for Direct Enrollment – Noodle Setup", category: "Scripts / NRM", priority: "high", status: "todo", dueDate: "2026-02-28", needsElisa: true, note: "Consider setting up scripts for direct enrollment.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 5, title: "UTM Builder for Joe – Social Media", category: "Analytics", priority: "medium", status: "todo", dueDate: "2026-02-25", needsElisa: false, note: "Complete UTM builder for Joe's social media tracking.", userNotes: "", links: [{ label: "UTM Builder", url: "https://docs.google.com/spreadsheets/d/1yLwdpoCbOfMOh1Z9EJcijjeCMFgqOn5T6Wgt6tKVxzg/edit" }], completedThisWeek: false, attachments: [], goalId: null },
  { id: 6, title: "New Scripts for NRM – Prof. Experience, Essays, Activities", category: "Scripts / NRM", priority: "high", status: "in-progress", dueDate: "2026-03-07", needsElisa: false, note: "Three new scripts in progress.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 7, title: "Education Section Script – V3 Review", category: "Scripts / NRM", priority: "medium", status: "in-progress", dueDate: "2026-02-28", needsElisa: false, note: "Currently in V3. AF comments are in.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 8, title: "LOR Script – Waiting for Animated V1", category: "Scripts / NRM", priority: "medium", status: "waiting", dueDate: "2026-03-01", needsElisa: true, note: "Script mapped out with NRM. Waiting for animated V1.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 9, title: "Application Checklist – Portal Collateral", category: "App Bootcamp", priority: "high", status: "in-progress", dueDate: "2026-03-07", needsElisa: true, note: "Need to confirm branding/design for collateral on website.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 10, title: "Event Sign-Up Forms – Finish Remaining 2 Templates", category: "Forms", priority: "medium", status: "in-progress", dueDate: "2026-02-28", needsElisa: false, note: "4 of 6 done. Remaining: New MSx Prospect + MSx Off-Campus Templates.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 11, title: "MSx Homepage & Why MSx – Web Binder Comments", category: "Website", priority: "medium", status: "in-progress", dueDate: "2026-03-01", needsElisa: false, note: "Put pages in web binder after Wendy's team comments.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 12, title: "MBA Homepage Content – Draft for Review", category: "Website", priority: "medium", status: "in-progress", dueDate: "2026-03-07", needsElisa: false, note: "UX designer meeting scheduled.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 13, title: "Portal Content / Architecture – Review", category: "App Bootcamp", priority: "medium", status: "in-progress", dueDate: "2026-03-14", needsElisa: false, note: "Portal content architecture document to be reviewed.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
  { id: 14, title: "Resumes & Eval Criteria Scripts – Still to Come", category: "Scripts / NRM", priority: "low", status: "todo", dueDate: "2026-03-21", needsElisa: false, note: "Flagged as 'still to come' after current script batch.", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null },
];

const INITIAL_MEETINGS = [
  { id: "m1", date: "2026-02-19", label: "Feb 19, 2026",
    takeaways: {
      decisions: ["Proceed with direct enrollment scripts as default; deferred differences go in FAQ"],
      elisaActions: ["Review UTM builder output for Joe by EOW", "Connect Aleena with UX designer re: admissions section"],
      myActions: ["Pull industry email sign-up analytics", "Finish 2 remaining event form templates"],
      openQuestions: ["Should bootcamp page URL be /mba/admission/bootcamp?", "Do we need a designer for portal collateral?"],
    }, raw: "", attachments: [] }
];

const INITIAL_SESSIONS = [
  { id: "s1", date: "2026-02-19", label: "Feb 19, 2026",
    elisaContent: "Add bootcamp URL to agenda for next time.\nAlso want to revisit the MSx vs MBA comp page timeline.",
    content: `📅 1:1 Agenda — Feb 19, 2026\n\n🙋 NEEDS ELISA'S INPUT\n  • Industry Emails — analytics by industry needed\n  • AF Growth Goals — UX designer meeting\n\n─────────────────────\n📝 NOTES\n\n- Direct enrollment scripts: go with direct as default, deferred diffs as FAQ\n- UTM builder: Elisa reviewing Joe's output by EOW\n- LOR script: waiting for animated V1\n- App checklist: need designer confirmation from Valeria`,
    pushed: true, pushedTo: "m1", attachments: [] }
];

const INITIAL_GOALS = []; // populated via AI extraction from uploaded doc

const CATEGORIES_LIST = ["Website", "Scripts / NRM", "App Bootcamp", "Emails", "Forms", "Goals", "Analytics"];
const CATEGORIES_FILTER = ["All", ...CATEGORIES_LIST];
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const STATUS_LABELS = { todo: "To Do", "in-progress": "In Progress", waiting: "Waiting", done: "Done" };
const STATUS_COLORS = { todo: { bg: "#FFF3CD", text: "#92620A" }, "in-progress": { bg: "#DBEAFE", text: "#1D4ED8" }, waiting: { bg: "#EDE9FE", text: "#6D28D9" }, done: { bg: "#D1FAE5", text: "#065F46" } };
const PRIORITY_COLORS = { high: { bg: "#FEE2E2", text: "#B91C1C" }, medium: { bg: "#FEF9C3", text: "#92620A" }, low: { bg: "#F1F5F9", text: "#475569" } };
const TAKEAWAY_SECTIONS = [
  { key: "decisions", emoji: "✅", label: "Decisions Made", color: "#059669" },
  { key: "elisaActions", emoji: "👩‍💼", label: "Elisa's Actions", color: "#2D3A8C" },
  { key: "myActions", emoji: "🙋‍♀️", label: "My Actions", color: "#7C3AED" },
  { key: "openQuestions", emoji: "❓", label: "Open Questions", color: "#B45309" },
];

const getDays = (d) => Math.ceil((new Date(d) - TODAY) / 86400000);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtDateLong = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const uid = () => Math.random().toString(36).slice(2, 9);
const fileIcon = (type) => type === "application/pdf" ? "📄" : type?.includes("word") ? "📝" : "📎";
const fileTypeLabel = (type) => type === "application/pdf" ? "PDF" : type?.includes("word") ? "DOCX" : "File";

// ── PRIMITIVES ───────────────────────────────────────────────
function Pill({ children, bg, color, style = {} }) {
  return <span style={{ background: bg, color, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", ...style }}>{children}</span>;
}
function CountdownBadge({ dueDate }) {
  const d = getDays(dueDate);
  const [bg, color, label] = d < 0 ? ["#FEE2E2","#B91C1C",`${Math.abs(d)}d overdue`] : d === 0 ? ["#FEE2E2","#B91C1C","Due today"] : d <= 3 ? ["#FFEDD5","#C2410C",`${d}d left`] : d <= 7 ? ["#FEF9C3","#92620A",`${d}d left`] : ["#F1F5F9","#475569",`${d}d`];
  return <Pill bg={bg} color={color} style={{ fontFamily: "monospace" }}>{label}</Pill>;
}
function EditableText({ value, onChange, placeholder = "Click to edit…", multiline = false, style = {}, inputStyle = {} }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef(null);
  useEffect(() => setVal(value), [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  const commit = () => { setEditing(false); if (val !== value) onChange(val); };
  if (editing) {
    const shared = { value: val, onChange: e => setVal(e.target.value), onBlur: commit, ref, style: { width: "100%", border: "1.5px solid #818CF8", borderRadius: 6, padding: "4px 7px", fontSize: "inherit", fontFamily: "'Sora',sans-serif", fontWeight: "inherit", color: "inherit", outline: "none", background: "white", resize: "vertical", ...inputStyle } };
    return multiline ? <textarea {...shared} rows={3} onKeyDown={e => e.key === "Escape" && commit()} /> : <input {...shared} onKeyDown={e => (e.key === "Enter" || e.key === "Escape") && commit()} />;
  }
  return <span onClick={() => setEditing(true)} title="Click to edit" onMouseEnter={e => { e.currentTarget.style.background = "#EEF2FF"; e.currentTarget.style.borderRadius = "4px"; }} onMouseLeave={e => { e.currentTarget.style.background = ""; }} style={{ cursor: "text", padding: "1px 3px", margin: "-1px -3px", transition: "background 0.1s", ...style }}>{val || <em style={{ color: "#94A3B8", fontWeight: 400 }}>{placeholder}</em>}</span>;
}
function EditableBulletList({ items, onChange, color = "#4338CA", placeholder = "Add item…" }) {
  const [newVal, setNewVal] = useState("");
  const add = () => { const t = newVal.trim(); if (t) { onChange([...items, t]); setNewVal(""); } };
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 5 }}>
          <span style={{ color, marginTop: 3, flexShrink: 0, fontSize: 14 }}>›</span>
          <div style={{ flex: 1 }}><EditableText value={item} onChange={v => { const n = [...items]; n[i] = v; onChange(n); }} multiline style={{ fontSize: 13, color: "#1E2850", display: "block", lineHeight: 1.5 }} inputStyle={{ fontSize: 13 }} /></div>
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: 15, padding: "1px 4px", flexShrink: 0 }}>×</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
        <input value={newVal} onChange={e => setNewVal(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder={placeholder} style={{ flex: 1, border: "1.5px dashed #C7D2FE", borderRadius: 7, padding: "5px 9px", fontSize: 12, fontFamily: "'Sora',sans-serif", outline: "none", background: "#FAFBFF", color: "#475569" }} />
        <button onClick={add} style={{ background: "#EEF2FF", color: "#4338CA", border: "none", borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add</button>
      </div>
    </div>
  );
}

// ── FILE VIEWER MODAL ────────────────────────────────────────
function FileViewer({ file, onClose }) {
  if (!file) return null;
  const isPdf = file.type === "application/pdf";
  const isDocx = file.type?.includes("word") || file.name?.endsWith(".docx");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", zIndex: 200, display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#1E2850", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20 }}>{fileIcon(file.type)}</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: "white", flex: 1 }}>{file.name}</span>
        <Pill bg="#FFFFFF22" color="white">{fileTypeLabel(file.type)}</Pill>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✕ Close</button>
      </div>
      <div style={{ flex: 1, overflow: "hidden", background: "#F1F5F9" }}>
        {isPdf ? (
          <iframe src={file.dataUrl} style={{ width: "100%", height: "100%", border: "none" }} title={file.name} />
        ) : isDocx ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
            <div style={{ fontSize: 64 }}>📝</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1E2850" }}>{file.name}</div>
            <div style={{ fontSize: 13, color: "#64748B", textAlign: "center", maxWidth: 400 }}>
              DOCX files can't be previewed directly in browser. Download it to open in Word, or export from Google Docs as PDF for inline preview.
            </div>
            <a href={file.dataUrl} download={file.name} style={{ background: "#2D3A8C", color: "white", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>⬇ Download {file.name}</a>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <div style={{ textAlign: "center", color: "#64748B" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📎</div>
              <div style={{ fontWeight: 600 }}>Preview not available</div>
              <a href={file.dataUrl} download={file.name} style={{ display: "inline-block", marginTop: 12, background: "#2D3A8C", color: "white", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>⬇ Download</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FILE UPLOAD ZONE ─────────────────────────────────────────
function FileUploadZone({ attachments = [], onAdd, onRemove, onView, compact = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { alert(`${file.name} is too large (max 10MB)`); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        onAdd({ id: uid(), name: file.name, type: file.type, size: file.size, dataUrl: e.target.result, uploadedAt: new Date().toISOString() });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      {attachments.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {attachments.map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 5, background: "#EEF2FF", border: "1.5px solid #C7D2FE", borderRadius: 9, padding: "4px 5px 4px 10px" }}>
              <span style={{ fontSize: 13 }}>{fileIcon(f.type)}</span>
              <button onClick={() => onView(f)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2D3A8C", fontSize: 12, fontWeight: 600, padding: 0 }}>{f.name.length > 22 ? f.name.slice(0,20) + "…" : f.name}</button>
              <Pill bg="#C7D2FE" color="#2D3A8C" style={{ fontSize: 9, padding: "1px 5px" }}>{fileTypeLabel(f.type)}</Pill>
              <button onClick={() => onRemove(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 14, padding: "0 3px" }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `1.5px dashed ${dragging ? "#818CF8" : "#C7D2FE"}`, borderRadius: 9, padding: compact ? "7px 12px" : "10px 14px", cursor: "pointer", background: dragging ? "#EEF2FF" : "#FAFBFF", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
        <span style={{ fontSize: 16 }}>📎</span>
        <span style={{ fontSize: 12, color: "#64748B" }}>{compact ? "Attach file" : "Drop a PDF or DOCX here, or click to browse"}</span>
        <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: "auto" }}>max 10MB</span>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" multiple onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
    </div>
  );
}

// ── TASK CARD ────────────────────────────────────────────────
function TaskCard({ task, onUpdate, onDelete, onToggleDone, onToggleNeeds, onViewFile, goals = [] }) {
  const [open, setOpen] = useState(false);
  const [addingLink, setAddingLink] = useState(false);
  const [ll, setLl] = useState(""); const [lu, setLu] = useState("");
  const isDone = task.status === "done";
  const upd = (f, v) => onUpdate(task.id, { [f]: v });
  const saveLink = () => { if (ll.trim() && lu.trim()) { upd("links", [...task.links, { label: ll.trim(), url: lu.trim() }]); setLl(""); setLu(""); setAddingLink(false); } };
  const addAttachment = (file) => upd("attachments", [...(task.attachments || []), file]);
  const removeAttachment = (fid) => upd("attachments", (task.attachments || []).filter(f => f.id !== fid));

  // Build flat list of all sub-items across all goals for the dropdown
  const allSubItems = goals.flatMap(g => g.subItems.map(s => ({ ...s, goalTitle: g.title })));
  const linkedSub = allSubItems.find(s => s.id === task.goalId);

  return (
    <div style={{ background: isDone ? "#F8FAFC" : "#fff", border: `1.5px solid ${task.needsElisa && !isDone ? "#FCA5A5" : "#E8EDF5"}`, borderRadius: 12, marginBottom: 8, opacity: isDone ? 0.62 : 1, boxShadow: "0 1px 3px rgba(30,41,80,0.04)" }}>
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <button onClick={() => onToggleDone(task.id)} style={{ width: 19, height: 19, borderRadius: 5, border: `2px solid ${isDone ? "#10B981" : "#CBD5E1"}`, background: isDone ? "#10B981" : "white", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 3 }}>
          {isDone && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1E2850", textDecoration: isDone ? "line-through" : "none", marginBottom: 5 }}>
            <EditableText value={task.title} onChange={v => upd("title", v)} style={{ fontWeight: 600, fontSize: 13.5 }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
            <select value={task.priority} onChange={e => upd("priority", e.target.value)} style={{ background: PRIORITY_COLORS[task.priority].bg, color: PRIORITY_COLORS[task.priority].text, border: "none", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              {["high","medium","low"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={task.status} onChange={e => upd("status", e.target.value)} style={{ background: STATUS_COLORS[task.status].bg, color: STATUS_COLORS[task.status].text, border: "none", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select value={task.category} onChange={e => upd("category", e.target.value)} style={{ background: "#EEF2FF", color: "#4338CA", border: "none", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {task.needsElisa && !isDone && <Pill bg="#FEE2E2" color="#B91C1C">🙋 Needs Elisa</Pill>}
            {!isDone && <CountdownBadge dueDate={task.dueDate} />}
            {(task.attachments?.length > 0) && <Pill bg="#EEF2FF" color="#4338CA">📎 {task.attachments.length}</Pill>}
            {linkedSub && <Pill bg="#F0FDF4" color="#059669" style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>🎯 {linkedSub.goalTitle}</Pill>}
          </div>
        </div>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: 17, padding: "0 2px", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s", marginTop: 1 }}>›</button>
      </div>
      {open && (
        <div style={{ padding: "0 14px 14px 43px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, flexShrink: 0 }}>Due</span>
            <input type="date" value={task.dueDate} onChange={e => upd("dueDate", e.target.value)} style={{ border: "1.5px solid #E2E8F0", borderRadius: 7, padding: "4px 9px", fontSize: 12, fontFamily: "'Sora',sans-serif", outline: "none", color: "#1E2850" }} />
          </div>
          {/* Goal link */}
          {goals.length > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, flexShrink: 0 }}>Goal</span>
              <select value={task.goalId || ""} onChange={e => upd("goalId", e.target.value || null)}
                style={{ flex: 1, border: "1.5px solid #E2E8F0", borderRadius: 7, padding: "4px 9px", fontSize: 12, fontFamily: "'Sora',sans-serif", outline: "none", color: "#1E2850", background: "white" }}>
                <option value="">— not linked —</option>
                {goals.map(g => (
                  <optgroup key={g.id} label={g.title}>
                    {g.subItems.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          )}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Description</div>
            <EditableText value={task.note} onChange={v => upd("note", v)} placeholder="Add description…" multiline style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, display: "block" }} inputStyle={{ fontSize: 13, minHeight: 60 }} />
          </div>
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>My Notes</div>
            <EditableText value={task.userNotes} onChange={v => upd("userNotes", v)} placeholder="Add notes, updates, blockers…" multiline style={{ fontSize: 13, color: "#1E2850", lineHeight: 1.6, display: "block" }} inputStyle={{ fontSize: 13, minHeight: 56 }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Links</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
              {task.links.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 3, background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 8, padding: "2px 4px 2px 10px" }}>
                  <a href={l.url} target="_blank" rel="noreferrer" style={{ color: "#4338CA", fontSize: 12, fontWeight: 500, textDecoration: "none" }}>🔗 {l.label}</a>
                  <button onClick={() => upd("links", task.links.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 13, padding: "0 3px" }}>×</button>
                </div>
              ))}
            </div>
            {addingLink ? (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <input placeholder="Label" value={ll} onChange={e => setLl(e.target.value)} style={{ flex: "1 1 100px", border: "1.5px solid #C7D2FE", borderRadius: 7, padding: "5px 9px", fontSize: 12, fontFamily: "'Sora',sans-serif", outline: "none" }} />
                <input placeholder="https://…" value={lu} onChange={e => setLu(e.target.value)} onKeyDown={e => e.key === "Enter" && saveLink()} style={{ flex: "2 1 160px", border: "1.5px solid #C7D2FE", borderRadius: 7, padding: "5px 9px", fontSize: 12, fontFamily: "'Sora',sans-serif", outline: "none" }} />
                <button onClick={saveLink} style={{ background: "#2D3A8C", color: "white", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Add</button>
                <button onClick={() => setAddingLink(false)} style={{ background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
              </div>
            ) : <button onClick={() => setAddingLink(true)} style={{ background: "#F1F5F9", color: "#475569", border: "1.5px dashed #CBD5E1", borderRadius: 7, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>+ Add link</button>}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Documents</div>
            <FileUploadZone attachments={task.attachments || []} onAdd={addAttachment} onRemove={removeAttachment} onView={onViewFile} compact />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 6, borderTop: "1px solid #F1F5F9" }}>
            <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer", fontSize: 12, color: "#475569" }}>
              <input type="checkbox" checked={task.needsElisa} onChange={() => onToggleNeeds(task.id)} />
              <span style={{ fontWeight: 600 }}>🙋 Needs Elisa</span>
            </label>
            <button onClick={() => onDelete(task.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#EF4444", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>🗑 Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DOCUMENTS TAB ────────────────────────────────────────────
function DocumentsTab({ tasks, sessions, meetings, onViewFile }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | tasks | meetings | sessions

  // Collect all docs from all sources
  const allDocs = [
    ...(tasks.flatMap(t => (t.attachments || []).map(f => ({ ...f, source: "task", sourceLabel: t.title, sourceId: t.id })))),
    ...(sessions.flatMap(s => (s.attachments || []).map(f => ({ ...f, source: "meeting-notes", sourceLabel: s.label, sourceId: s.id })))),
    ...(meetings.flatMap(m => (m.attachments || []).map(f => ({ ...f, source: "meeting", sourceLabel: m.label, sourceId: m.id })))),
  ].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  const filtered = allDocs
    .filter(f => filter === "all" || (filter === "tasks" && f.source === "task") || (filter === "meetings" && f.source !== "task"))
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.sourceLabel.toLowerCase().includes(search.toLowerCase()));

  const sourceColor = (s) => s === "task" ? { bg: "#EEF2FF", color: "#4338CA" } : s === "meeting-notes" ? { bg: "#F5F3FF", color: "#7C3AED" } : { bg: "#F0FDF4", color: "#059669" };
  const sourceEmoji = (s) => s === "task" ? "✅" : s === "meeting-notes" ? "📓" : "👩‍💼";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1E2850" }}>📁 Documents</div>
          <div style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>All files attached to tasks, meetings, and notes</div>
        </div>
        <Pill bg="#EEF2FF" color="#4338CA">{allDocs.length} file{allDocs.length !== 1 ? "s" : ""}</Pill>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…"
          style={{ flex: "1 1 200px", border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontFamily: "'Sora',sans-serif", outline: "none", color: "#1E2850" }}
          onFocus={e => e.target.style.borderColor = "#818CF8"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
        {[["all","All"],["tasks","Tasks"],["meetings","Meetings"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === v ? "#2D3A8C" : "#E2E8F0"}`, background: filter === v ? "#2D3A8C" : "white", color: filter === v ? "white" : "#64748B", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#64748B" }}>{allDocs.length === 0 ? "No documents yet" : "No results"}</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>{allDocs.length === 0 ? "Attach PDFs or DOCX files to tasks, meeting notes, or the Elisa tab" : "Try a different search"}</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {filtered.map(f => (
            <div key={f.id} style={{ background: "white", border: "1.5px solid #E8EDF5", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(30,41,80,0.04)" }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{fileIcon(f.type)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <button onClick={() => onViewFile(f)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#2D3A8C", padding: 0, textAlign: "left", textDecoration: "underline" }}>{f.name}</button>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                  <Pill {...sourceColor(f.source)} style={{ fontSize: 10 }}>{sourceEmoji(f.source)} {f.source === "task" ? "Task" : f.source === "meeting-notes" ? "Meeting Notes" : "Meeting"}</Pill>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{f.sourceLabel}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <Pill bg="#F1F5F9" color="#64748B" style={{ fontSize: 10 }}>{fileTypeLabel(f.type)}</Pill>
                <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>{(f.size / 1024).toFixed(0)} KB</div>
              </div>
              <button onClick={() => onViewFile(f)} style={{ background: "#EEF2FF", color: "#4338CA", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>Open</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MEETING NOTES TAB ────────────────────────────────────────
function MeetingNotesTab({ sessions, setSessions, onPushToHub, tasks, onApplyTaskSync, onViewFile }) {
  const [activeId, setActiveId]   = useState(sessions[0]?.id || null);
  const [pushing, setPushing]     = useState(false);
  const [pushError, setPushError] = useState("");
  const [toast, setToast]         = useState(null);

  const active = sessions.find(s => s.id === activeId);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const buildAgenda = () => {
    const overdue    = tasks.filter(t => getDays(t.dueDate) <= 0 && t.status !== "done");
    const needsElisa = tasks.filter(t => t.needsElisa && t.status !== "done");
    const dueSoon    = tasks.filter(t => getDays(t.dueDate) > 0 && getDays(t.dueDate) <= 7 && t.status !== "done" && !t.needsElisa);
    const waiting    = tasks.filter(t => t.status === "waiting");
    const lines = [`📅 1:1 Agenda — ${fmtDateLong(TODAY.toISOString().slice(0,10))}`, ``];
    if (overdue.length)    { lines.push(`🚨 OVERDUE`);                overdue.forEach(t    => lines.push(`  • ${t.title}`));  lines.push(``); }
    if (needsElisa.length) { lines.push(`🙋 NEEDS ELISA'S INPUT`);    needsElisa.forEach(t => lines.push(`  • ${t.title}`)); lines.push(``); }
    if (waiting.length)    { lines.push(`⏳ BLOCKED`);                 waiting.forEach(t    => lines.push(`  • ${t.title}`)); lines.push(``); }
    if (dueSoon.length)    { lines.push(`📅 DUE THIS WEEK`);          dueSoon.forEach(t    => lines.push(`  • ${t.title} (${fmtDate(t.dueDate)})`)); lines.push(``); }
    lines.push(`─────────────────────`, `📝 NOTES`, ``, `DECISIONS`, `  • `, ``, `ELISA'S ACTIONS`, `  • `, ``, `MY ACTIONS`, `  • `);
    return lines.join("\n");
  };

  const createSession = () => {
    const s = { id: uid(), date: TODAY.toISOString().slice(0,10), label: fmtDateLong(TODAY.toISOString().slice(0,10)), content: buildAgenda(), elisaContent: "", pushed: false, pushedTo: null, attachments: [] };
    setSessions(p => [s, ...p]);
    setActiveId(s.id);
  };
  const updateSession = (id, changes) => setSessions(p => p.map(s => s.id === id ? { ...s, ...changes } : s));
  const deleteSession = (id) => { if (!confirm("Delete these meeting notes?")) return; const r = sessions.filter(s => s.id !== id); setSessions(r); setActiveId(r[0]?.id || null); };

  const startPush = async () => {
    const combined = [active?.content, active?.elisaContent].filter(Boolean).join("\n\n---\n\n");
    if (!combined.trim()) { setPushError("Add some notes first."); return; }
    setPushing(true); setPushError("");
    const taskList = tasks.filter(t => t.status !== "done").map(t => ({ id: t.id, title: t.title }));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": "YOUR_API_KEY_HERE", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          system: `You are a meeting notes parser for a 1:1 between Aleena (employee) and Elisa (manager) at Stanford GSB admissions marketing.\n\nReturn ONLY valid JSON:\n{\n  "takeaways": { "decisions": [], "elisaActions": [], "myActions": [], "openQuestions": [] },\n  "taskSync": {\n    "newTasks": [{ "title": "...", "category": "...", "priority": "high|medium|low", "dueDate": "YYYY-MM-DD or null", "note": "..." }],\n    "noteUpdates": [{ "taskId": <number>, "note": "..." }]\n  }\n}\nRules: each takeaway = 1 sentence. newTasks = only Aleena's commitments. category one of: Website, Scripts / NRM, App Bootcamp, Emails, Forms, Goals, Analytics. Return ONLY JSON.`,
          messages: [{ role: "user", content: `Meeting notes:\n\n${combined}\n\nExisting tasks:\n${JSON.stringify(taskList)}` }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "").replace(/```json|```/g, "").trim());
      const meetingId = onPushToHub(active.date, active.label, parsed.takeaways, active.content);
      updateSession(active.id, { pushed: true, pushedTo: meetingId });
      const { newTasks = [], noteUpdates = [] } = parsed.taskSync || {};
      onApplyTaskSync(newTasks, noteUpdates);
      const parts = [];
      if (newTasks.length)   parts.push(`${newTasks.length} task${newTasks.length > 1 ? "s" : ""} created`);
      if (noteUpdates.length) parts.push(`${noteUpdates.length} updated`);
      showToast(`✅ Pushed${parts.length ? " · " + parts.join(" · ") : ""}`);
    } catch { setPushError("Extraction failed — check your notes and try again."); }
    setPushing(false);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#1E2850", color: "white", borderRadius: 12, padding: "12px 22px", fontSize: 13, fontWeight: 600, zIndex: 300, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          {toast}
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, minHeight: 500 }}>
        {/* LEFT SIDEBAR */}
        <div style={{ width: 190, flexShrink: 0 }}>
          <button onClick={createSession} style={{ width: "100%", background: "#2D3A8C", color: "white", border: "none", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>+ New Meeting</button>
          {sessions.length === 0 && <div style={{ color: "#94A3B8", fontSize: 12 }}>No meetings yet</div>}
          {sessions.map(s => (
            <div key={s.id} onClick={() => { setActiveId(s.id); setPushError(""); }}
              style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer", background: activeId === s.id ? "#2D3A8C" : "white", border: `1.5px solid ${activeId === s.id ? "#2D3A8C" : "#E8EDF5"}`, transition: "all 0.12s" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: activeId === s.id ? "white" : "#1E2850", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: activeId === s.id ? "rgba(255,255,255,0.65)" : s.pushed ? "#10B981" : "#F59E0B" }}>
                {s.pushed ? "✓ Pushed" : "● Draft"}
                {s.attachments?.length > 0 && ` · 📎${s.attachments.length}`}
              </div>
            </div>
          ))}
        </div>

        {/* MAIN AREA */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!active ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📓</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#64748B", marginBottom: 16 }}>Select a meeting or create one</div>
              <button onClick={createSession} style={{ background: "#2D3A8C", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ New Meeting</button>
            </div>
          ) : (
            <div>
              {/* Meeting header — clean, minimal */}
              <div style={{ background: "white", border: "1.5px solid #E8EDF5", borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#1E2850", marginBottom: 6 }}>
                      <EditableText value={active.label} onChange={v => updateSession(active.id, { label: v })} style={{ fontWeight: 800, fontSize: 18 }} placeholder="Meeting title…" />
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <input type="date" value={active.date} onChange={e => updateSession(active.id, { date: e.target.value, label: fmtDateLong(e.target.value) })} style={{ border: "1.5px solid #E2E8F0", borderRadius: 7, padding: "3px 9px", fontSize: 12, fontFamily: "'Sora',sans-serif", outline: "none", color: "#64748B" }} />
                      {active.pushed ? <Pill bg="#D1FAE5" color="#065F46">✓ Pushed</Pill> : active.content ? <Pill bg="#FEF9C3" color="#92620A">Draft</Pill> : null}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <button onClick={() => deleteSession(active.id)} style={{ background: "none", border: "1.5px solid #E2E8F0", color: "#94A3B8", borderRadius: 8, padding: "7px 10px", fontSize: 13, cursor: "pointer" }}>🗑</button>
                    <button onClick={startPush} disabled={pushing} style={{ background: pushing ? "#94A3B8" : "#2D3A8C", color: "white", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: pushing ? "default" : "pointer", boxShadow: pushing ? "none" : "0 2px 8px rgba(45,58,140,0.25)" }}>
                      {pushing ? "Pushing…" : active.pushed ? "↻ Re-push" : "✨ Push to Hub"}
                    </button>
                  </div>
                </div>
                {pushError && <div style={{ marginTop: 10, background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#B91C1C" }}>{pushError}</div>}
              </div>

              {/* Notes — two panes, visually distinct but calm */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                {/* Aleena's notes */}
                <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #C7D2FE", overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", background: "#EEF2FF", borderBottom: "1.5px solid #C7D2FE", display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 14 }}>🙋‍♀️</span>
                    <span style={{ fontWeight: 700, fontSize: 12, color: "#2D3A8C" }}>Your notes</span>
                    {active.content && <span style={{ fontSize: 10, color: "#6366F1", marginLeft: "auto" }}>{active.content.split(/\s+/).filter(Boolean).length}w</span>}
                  </div>
                  <textarea value={active.content} onChange={e => updateSession(active.id, { content: e.target.value })} placeholder="Your agenda and notes go here — auto-filled from tasks when you create a new meeting…" style={{ width: "100%", minHeight: 340, border: "none", padding: "14px 16px", fontSize: 12.5, fontFamily: "'Sora',sans-serif", lineHeight: 1.8, outline: "none", resize: "none", color: "#1E2850", background: "transparent" }} />
                </div>
                {/* Elisa's notes */}
                <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #DDD6FE", overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", background: "#F5F3FF", borderBottom: "1.5px solid #DDD6FE", display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 14 }}>👩‍💼</span>
                    <span style={{ fontWeight: 700, fontSize: 12, color: "#7C3AED" }}>Elisa's notes</span>
                    {active.elisaContent && <span style={{ fontSize: 10, color: "#7C3AED", marginLeft: "auto" }}>{active.elisaContent.split(/\s+/).filter(Boolean).length}w</span>}
                  </div>
                  <textarea value={active.elisaContent || ""} onChange={e => updateSession(active.id, { elisaContent: e.target.value })} placeholder="Elisa can add items, corrections, or anything to cover here…" style={{ width: "100%", minHeight: 340, border: "none", padding: "14px 16px", fontSize: 12.5, fontFamily: "'Sora',sans-serif", lineHeight: 1.8, outline: "none", resize: "none", color: "#1E2850", background: "transparent" }} />
                </div>
              </div>

              {/* Attachments — collapsed style */}
              <div style={{ background: "white", border: "1.5px solid #E8EDF5", borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>📎 Documents</div>
                <FileUploadZone attachments={active.attachments || []} onAdd={f => updateSession(active.id, { attachments: [...(active.attachments || []), f] })} onRemove={fid => updateSession(active.id, { attachments: (active.attachments || []).filter(f => f.id !== fid) })} onView={onViewFile} compact />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ── REVIEW TAB (merged Prep + Weekly) ────────────────────────
function ReviewTab({ tasks, goals = [] }) {
  const [view, setView] = useState("prep"); // "prep" | "weekly"

  // ── Prep data ──
  const agendaSections = [
    { emoji: "🚨", label: "Overdue", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", items: tasks.filter(t => getDays(t.dueDate) <= 0 && t.status !== "done") },
    { emoji: "🙋", label: "Needs Elisa", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", items: tasks.filter(t => t.needsElisa && t.status !== "done") },
    { emoji: "⏳", label: "Blocked", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", items: tasks.filter(t => t.status === "waiting") },
    { emoji: "📅", label: "Due this week", color: "#2D3A8C", bg: "#EEF2FF", border: "#C7D2FE", items: tasks.filter(t => getDays(t.dueDate) > 0 && getDays(t.dueDate) <= 7 && t.status !== "done") },
  ].filter(s => s.items.length);

  const linkedSubIds = new Set(tasks.filter(t => t.goalId && t.status !== "done").map(t => t.goalId));
  const goalGaps = goals.flatMap(g => g.subItems.filter(s => !linkedSubIds.has(s.id)).map(s => ({ goalTitle: g.title, subTitle: s.title })));

  const copyAgenda = () => {
    const lines = [`1:1 Agenda — ${TODAY.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}`, ""];
    agendaSections.forEach(s => { lines.push(`${s.emoji} ${s.label}`); s.items.forEach(t => { lines.push(`  • ${t.title} (due ${fmtDate(t.dueDate)})`); if (t.userNotes) lines.push(`    → ${t.userNotes}`); }); lines.push(""); });
    if (goalGaps.length) { lines.push("⚠️ Goal gaps"); goalGaps.forEach(g => lines.push(`  • ${g.goalTitle} → ${g.subTitle}`)); }
    navigator.clipboard.writeText(lines.join("\n")).then(() => alert("Agenda copied!"));
  };

  // ── Weekly data ──
  const done = tasks.filter(t => t.completedThisWeek);
  const slipped = tasks.filter(t => getDays(t.dueDate) < 0 && t.status !== "done");
  const inProg = tasks.filter(t => t.status === "in-progress");
  const waiting = tasks.filter(t => t.status === "waiting");
  const total = tasks.filter(t => t.status !== "done").length;
  const byCategory = {};
  tasks.filter(t => t.status !== "done").forEach(t => { if (!byCategory[t.category]) byCategory[t.category] = { total: 0, high: 0 }; byCategory[t.category].total++; if (t.priority === "high") byCategory[t.category].high++; });

  const exportSummary = () => {
    const lines = [`Weekly Summary — ${TODAY.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}`, "", `✅ Completed (${done.length})`, ...done.map(t=>`  • ${t.title}`), "", `🔄 In Progress (${inProg.length})`, ...inProg.map(t=>`  • ${t.title}`), "", `⚠️ Overdue (${slipped.length})`, ...slipped.map(t=>`  • ${t.title}`)];
    navigator.clipboard.writeText(lines.join("\n")).then(()=>alert("Copied!"));
  };

  return (
    <div>
      {/* Header with toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "#1E2850" }}>{view === "prep" ? "📋 Meeting Prep" : "📊 Weekly Snapshot"}</div>
          <div style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>{view === "prep" ? "What to cover in your next 1:1" : "How your week is shaping up"}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {/* Toggle */}
          <div style={{ display: "flex", background: "#E8EDF5", borderRadius: 10, padding: 3 }}>
            {[["prep","📋 Prep"],["weekly","📊 Weekly"]].map(([k,l]) => (
              <button key={k} onClick={() => setView(k)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: view === k ? "white" : "transparent", color: view === k ? "#1E2850" : "#64748B", boxShadow: view === k ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>{l}</button>
            ))}
          </div>
          {view === "prep"
            ? <button onClick={copyAgenda} style={{ background: "#2D3A8C", color: "white", border: "none", borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📋 Copy</button>
            : <button onClick={exportSummary} style={{ background: "#2D3A8C", color: "white", border: "none", borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📤 Export</button>
          }
        </div>
      </div>

      {/* PREP VIEW */}
      {view === "prep" && (
        <div>
          {agendaSections.length === 0 && goalGaps.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#64748B" }}>You're all caught up!</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Nothing urgent to bring to the meeting</div>
            </div>
          )}

          {agendaSections.map((s, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{s.emoji}</div>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#1E2850" }}>{s.label}</span>
                <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700, border: `1px solid ${s.border}` }}>{s.items.length}</span>
              </div>
              <div style={{ marginLeft: 36 }}>
                {s.items.map(t => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 12px", background: "white", border: "1.5px solid #F1F5F9", borderRadius: 9, marginBottom: 5, gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1E2850" }}>{t.title}</div>
                      {t.userNotes && <div style={{ fontSize: 11, color: "#10B981", marginTop: 2, fontStyle: "italic" }}>→ {t.userNotes}</div>}
                    </div>
                    <CountdownBadge dueDate={t.dueDate} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {goalGaps.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#FFFBEB", border: "1.5px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⚠️</div>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#1E2850" }}>Goal gaps</span>
                <span style={{ background: "#FFFBEB", color: "#D97706", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700, border: "1px solid #FDE68A" }}>{goalGaps.length} without tasks</span>
              </div>
              <div style={{ marginLeft: 36 }}>
                {goalGaps.map((g, i) => (
                  <div key={i} style={{ padding: "9px 12px", background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 9, marginBottom: 5 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", marginBottom: 1 }}>🎯 {g.goalTitle}</div>
                    <div style={{ fontSize: 12, color: "#92400E" }}>{g.subTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* WEEKLY VIEW */}
      {view === "weekly" && (
        <div>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Completed", val: done.length, color: "#10B981", bg: "#F0FDF4", sub: "this week" },
              { label: "In Progress", val: inProg.length, color: "#3B82F6", bg: "#EFF6FF", sub: "active" },
              { label: "Overdue", val: slipped.length, color: "#EF4444", bg: "#FEF2F2", sub: "need action" },
              { label: "Waiting", val: waiting.length, color: "#8B5CF6", bg: "#F5F3FF", sub: "on others" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "14px 16px", border: `1.5px solid ${s.color}22` }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#1E2850", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Done + Overdue side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #D1FAE5", padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#059669", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✅</span> Done this week
              </div>
              {done.length === 0
                ? <div style={{ color: "#94A3B8", fontSize: 12 }}>Mark tasks as done to track here</div>
                : done.map(t => <div key={t.id} style={{ fontSize: 12, color: "#374151", padding: "4px 0", borderBottom: "1px solid #F0FDF4", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#10B981", fontSize: 10 }}>●</span>{t.title}</div>)}
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #FEE2E2", padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#B91C1C", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
                <span>⚠️</span> Overdue
              </div>
              {slipped.length === 0
                ? <div style={{ color: "#94A3B8", fontSize: 12 }}>Nothing overdue 🎉</div>
                : slipped.map(t => <div key={t.id} style={{ fontSize: 12, color: "#374151", padding: "4px 0", borderBottom: "1px solid #FEF2F2", display: "flex", justifyContent: "space-between" }}><span>{t.title}</span><span style={{ color: "#EF4444", fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>{fmtDate(t.dueDate)}</span></div>)}
            </div>
          </div>

          {/* By area */}
          <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #E8EDF5", padding: "16px 18px" }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: "#64748B", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Open tasks by area</div>
            {Object.entries(byCategory).sort((a,b) => b[1].total - a[1].total).map(([cat, d]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 120, fontSize: 12, fontWeight: 600, color: "#475569", flexShrink: 0 }}>{cat}</div>
                <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 20, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${(d.total/total)*100}%`, background: d.high > 0 ? "#EF4444" : "#6366F1", height: "100%", borderRadius: 20, transition: "width 0.3s" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", width: 20, textAlign: "right" }}>{d.total}</div>
                {d.high > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", background: "#FEE2E2", borderRadius: 20, padding: "1px 6px" }}>{d.high} urgent</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ELISA TAB ────────────────────────────────────────────────
function ElisaTab({ tasks, meetings, setMeetings, onViewFile }) {
  const [viewingMeeting, setViewingMeeting] = useState(null);
  const needsReview = tasks.filter(t => t.needsElisa && t.status !== "done").sort((a, b) => getDays(a.dueDate) - getDays(b.dueDate));
  const latestMeeting = meetings[0];
  const updateMeeting = (id, updater) => setMeetings(p => p.map(m => m.id === id ? { ...m, takeaways: updater(m.takeaways) } : m));
  const updateLabel = (id, label) => setMeetings(p => p.map(m => m.id === id ? { ...m, label } : m));
  const deleteMeeting = (id) => setMeetings(p => p.filter(m => m.id !== id));
  const exportForElisa = () => {
    const lines = [`📋 1:1 Status — ${TODAY.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}`, "", `🙋 NEEDS YOUR INPUT (${needsReview.length})`];
    needsReview.forEach(t => { lines.push(`  • ${t.title} — due ${fmtDate(t.dueDate)}`); if (t.userNotes) lines.push(`    → ${t.userNotes}`); });
    if (latestMeeting) { lines.push("", `📝 LAST MEETING (${latestMeeting.label})`); TAKEAWAY_SECTIONS.forEach(s => { if (latestMeeting.takeaways[s.key]?.length) { lines.push(`\n${s.emoji} ${s.label}`); latestMeeting.takeaways[s.key].forEach(i => lines.push(`  • ${i}`)); } }); }
    navigator.clipboard.writeText(lines.join("\n")).then(() => alert("Copied for Elisa!"));
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div><div style={{ fontWeight: 800, fontSize: 18, color: "#1E2850" }}>👩‍💼 Elisa's View</div><div style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>Pre-meeting review · post-meeting log</div></div>
        <button onClick={exportForElisa} style={{ background: "#2D3A8C", color: "white", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📤 Share with Elisa</button>
      </div>

      {viewingMeeting && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "white", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "85vh", overflow: "auto", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#1E2850" }}><EditableText value={viewingMeeting.label} onChange={v => { updateLabel(viewingMeeting.id, v); setViewingMeeting(p => ({...p, label: v})); }} style={{ fontWeight: 800, fontSize: 16 }} /></div>
              <button onClick={() => setViewingMeeting(null)} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, padding: "6px 11px", cursor: "pointer", color: "#64748B" }}>✕</button>
            </div>
            {TAKEAWAY_SECTIONS.map(({ key, emoji, label, color }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{emoji} {label}</div>
                <EditableBulletList items={viewingMeeting.takeaways[key] || []} onChange={items => { updateMeeting(viewingMeeting.id, t => ({...t, [key]: items})); setViewingMeeting(p => ({...p, takeaways: {...p.takeaways, [key]: items}})); }} color={color} placeholder={`Add ${label.toLowerCase()}…`} />
              </div>
            ))}
            {/* Meeting attachments */}
            {(viewingMeeting.attachments?.length > 0) && (
              <div style={{ marginTop: 12, borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Documents</div>
                {viewingMeeting.attachments.map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span>{fileIcon(f.type)}</span>
                    <button onClick={() => onViewFile(f)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2D3A8C", fontSize: 12, fontWeight: 600, textDecoration: "underline", padding: 0 }}>{f.name}</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { if (confirm("Delete this meeting?")) { deleteMeeting(viewingMeeting.id); setViewingMeeting(null); } }} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 12, cursor: "pointer", fontWeight: 600, marginTop: 8 }}>🗑 Delete</button>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #FCA5A5", padding: "16px 18px", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 16 }}>🙋</span>
            <span style={{ fontWeight: 800, fontSize: 12, color: "#B91C1C", textTransform: "uppercase", letterSpacing: 1 }}>Needs Elisa's Review</span>
            <span style={{ background: "#FEE2E2", color: "#B91C1C", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{needsReview.length}</span>
          </div>
          <span style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic", alignSelf: "center" }}>Pre-meeting</span>
        </div>
        <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>Items Elisa needs to weigh in on, decide, or unblock</div>
        {needsReview.length === 0 ? <div style={{ color: "#94A3B8", fontSize: 13, padding: "8px 0" }}>Nothing flagged!</div> : needsReview.map(t => (
          <div key={t.id} style={{ background: "#FFF5F5", border: "1px solid #FEE2E2", borderRadius: 10, padding: "11px 14px", marginBottom: 7 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1E2850" }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 3, lineHeight: 1.5 }}>{t.note}</div>
                {t.userNotes && <div style={{ fontSize: 12, color: "#10B981", marginTop: 4, fontStyle: "italic" }}>💬 {t.userNotes}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                <CountdownBadge dueDate={t.dueDate} />
                <Pill bg={PRIORITY_COLORS[t.priority].bg} color={PRIORITY_COLORS[t.priority].text}>{t.priority}</Pill>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #C7D2FE", padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 16 }}>📝</span>
            <span style={{ fontWeight: 800, fontSize: 12, color: "#2D3A8C", textTransform: "uppercase", letterSpacing: 1 }}>Meeting Takeaways</span>
          </div>
          <span style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic", alignSelf: "center" }}>Auto-populated from Meeting Notes tab</span>
        </div>
        <div style={{ fontSize: 12, color: "#64748B", marginBottom: 14 }}>Pushed from the Meeting Notes tab · edit any bullet directly</div>
        {meetings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#94A3B8" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📓</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#64748B" }}>No takeaways yet</div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#1E2850", display: "flex", gap: 6, alignItems: "center" }}>
                  <EditableText value={latestMeeting.label} onChange={v => updateLabel(latestMeeting.id, v)} style={{ fontWeight: 700, fontSize: 13 }} />
                  <Pill bg="#EEF2FF" color="#4338CA">latest</Pill>
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>click bullets to edit</div>
              </div>
              {TAKEAWAY_SECTIONS.map(({ key, emoji, label, color }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>{emoji} {label}</div>
                  <EditableBulletList items={latestMeeting.takeaways[key] || []} onChange={items => updateMeeting(latestMeeting.id, t => ({...t, [key]: items}))} color={color} placeholder={`Add ${label.toLowerCase()}…`} />
                </div>
              ))}
            </div>
            {meetings.length > 1 && (
              <div style={{ borderTop: "1px solid #E8EDF5", paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Previous meetings</div>
                {meetings.slice(1).map(m => (
                  <div key={m.id} onClick={() => setViewingMeeting(m)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "#F8FAFC", borderRadius: 9, marginBottom: 5, cursor: "pointer", border: "1.5px solid #E8EDF5" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1E2850" }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{[m.takeaways.decisions, m.takeaways.elisaActions, m.takeaways.myActions].flat().length} items{m.attachments?.length > 0 && ` · 📎 ${m.attachments.length}`}</div>
                    </div>
                    <span style={{ color: "#94A3B8", fontSize: 12 }}>click to edit ›</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── GOALS TAB ────────────────────────────────────────────────
function GoalsTab({ goals, setGoals, tasks, onUpdateTask }) {
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [expandedSub, setExpandedSub] = useState(null);
  const inputRef = useRef(null);

  // Upload + AI extract
  const handleUpload = async (file) => {
    if (!file) return;
    setExtracting(true); setExtractError("");
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      const isPdf = file.type === "application/pdf";
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: { "Content-Type": "application/json", "x-api-key": "YOUR_API_KEY_HERE", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 2000,
            system: `You are extracting goals from a document for Aleena, a marketing manager at Stanford GSB admissions.
Extract the goals structure and return ONLY valid JSON:
{
  "goals": [
    {
      "id": "g1",
      "title": "Big goal title",
      "period": "Annual 2026 / Q1 2026 / etc",
      "subItems": [
        { "id": "g1s1", "title": "Sub-item or key result" }
      ]
    }
  ]
}
Rules:
- Keep goal titles concise (under 10 words)
- Each sub-item should be 1 actionable line
- period: infer from context (Annual, Q1, Q2, etc.) or leave empty string
- Return ONLY the JSON, no other text.`,
            messages: [{
              role: "user",
              content: [{
                type: isPdf ? "document" : "text",
                ...(isPdf
                  ? { source: { type: "base64", media_type: "application/pdf", data: base64 } }
                  : { text: `Extract goals from this document content. (Note: DOCX preview unavailable — if you see garbled text, do your best to extract goals from it.)` }
                )
              }, { type: "text", text: "Extract the goals structure from this document." }]
            }]
          })
        });
        const data = await res.json();
        const text = data.content?.[0]?.text || "";
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        setGoals(parsed.goals || []);
        if (parsed.goals?.length) setExpandedGoal(parsed.goals[0].id);
      } catch { setExtractError("Couldn't extract goals — try a PDF for best results, or add goals manually below."); }
      setExtracting(false);
    };
    reader.readAsDataURL(file);
  };

  const addGoal = () => {
    const g = { id: uid(), title: "New goal", period: "", subItems: [] };
    setGoals(p => [...p, g]);
    setExpandedGoal(g.id);
  };
  const updateGoal = (gid, changes) => setGoals(p => p.map(g => g.id === gid ? { ...g, ...changes } : g));
  const deleteGoal = (gid) => { if (confirm("Delete this goal?")) setGoals(p => p.filter(g => g.id !== gid)); };
  const addSubItem = (gid) => {
    const s = { id: uid(), title: "New sub-item" };
    updateGoal(gid, { subItems: [...(goals.find(g => g.id === gid)?.subItems || []), s] });
  };
  const updateSubItem = (gid, sid, title) => updateGoal(gid, { subItems: goals.find(g => g.id === gid).subItems.map(s => s.id === sid ? { ...s, title } : s) });
  const deleteSubItem = (gid, sid) => updateGoal(gid, { subItems: goals.find(g => g.id === gid).subItems.filter(s => s.id !== sid) });

  // Tasks linked to a sub-item
  const linkedTasks = (sid) => tasks.filter(t => t.goalId === sid && t.status !== "done");
  const allLinkedTaskIds = new Set(tasks.filter(t => t.goalId).map(t => t.goalId));

  // Goals with no linked tasks at all
  const goalsWithGaps = goals.filter(g => g.subItems.some(s => !allLinkedTaskIds.has(s.id)));

  const PERIOD_COLORS = { "Annual": { bg: "#EEF2FF", color: "#4338CA" }, "Q1": { bg: "#F0FDF4", color: "#059669" }, "Q2": { bg: "#FFFBEB", color: "#D97706" }, "Q3": { bg: "#FFF7ED", color: "#EA580C" }, "Q4": { bg: "#FDF4FF", color: "#9333EA" } };
  const periodStyle = (p) => { const key = Object.keys(PERIOD_COLORS).find(k => p?.includes(k)); return key ? PERIOD_COLORS[key] : { bg: "#F1F5F9", color: "#64748B" }; };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1E2850" }}>🎯 Goals</div>
          <div style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>
            {goals.length > 0 ? `${goals.length} goal${goals.length !== 1 ? "s" : ""} · ${goals.reduce((n,g) => n + g.subItems.length, 0)} sub-items` : "Upload your goals doc to get started"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={addGoal} style={{ background: "#EEF2FF", color: "#4338CA", border: "1.5px solid #C7D2FE", borderRadius: 9, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add Goal</button>
          <button onClick={() => inputRef.current?.click()} disabled={extracting} style={{ background: extracting ? "#94A3B8" : "#2D3A8C", color: "white", border: "none", borderRadius: 9, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: extracting ? "default" : "pointer" }}>
            {extracting ? "✨ Extracting…" : "📄 Import from Doc"}
          </button>
          <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={e => handleUpload(e.target.files[0])} style={{ display: "none" }} />
        </div>
      </div>

      {extractError && <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#B91C1C" }}>{extractError}</div>}

      {/* Gap alert */}
      {goals.length > 0 && goalsWithGaps.length > 0 && (
        <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 12, padding: "11px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div style={{ fontSize: 13, color: "#92400E" }}>
            <strong>{goalsWithGaps.length} goal{goalsWithGaps.length > 1 ? "s have" : " has"} sub-items with no linked tasks</strong>
            {" "}— consider creating tasks to drive these forward
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#64748B" }}>No goals yet</div>
          <div style={{ fontSize: 13, marginTop: 4, marginBottom: 20 }}>Import from a PDF/DOCX goals doc, or add manually</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => inputRef.current?.click()} style={{ background: "#2D3A8C", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📄 Import from Doc</button>
            <button onClick={addGoal} style={{ background: "#EEF2FF", color: "#4338CA", border: "1.5px solid #C7D2FE", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Add Manually</button>
          </div>
        </div>
      )}

      {goals.map(goal => {
        const isOpen = expandedGoal === goal.id;
        const totalSubs = goal.subItems.length;
        const linkedCount = goal.subItems.filter(s => allLinkedTaskIds.has(s.id)).length;
        const ps = periodStyle(goal.period);

        return (
          <div key={goal.id} style={{ background: "white", border: "1.5px solid #E8EDF5", borderRadius: 14, marginBottom: 10, boxShadow: "0 1px 4px rgba(30,41,80,0.05)", overflow: "hidden" }}>
            {/* Goal header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", cursor: "pointer" }} onClick={() => setExpandedGoal(isOpen ? null : goal.id)}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🎯</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#1E2850" }}>
                  <EditableText value={goal.title} onChange={v => updateGoal(goal.id, { title: v })} style={{ fontWeight: 800, fontSize: 14 }} />
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                  {goal.period && <Pill bg={ps.bg} color={ps.color} style={{ fontSize: 10 }}>{goal.period}</Pill>}
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{totalSubs} sub-item{totalSubs !== 1 ? "s" : ""}</span>
                  {totalSubs > 0 && <span style={{ fontSize: 11, color: linkedCount === totalSubs ? "#10B981" : "#F59E0B", fontWeight: 600 }}>{linkedCount}/{totalSubs} linked to tasks</span>}
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteGoal(goal.id); }} style={{ background: "none", border: "none", color: "#E2E8F0", cursor: "pointer", fontSize: 16, padding: "2px 6px", flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.color="#EF4444"} onMouseLeave={e => e.currentTarget.style.color="#E2E8F0"}>🗑</button>
              <span style={{ color: "#CBD5E1", fontSize: 16, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>›</span>
            </div>

            {isOpen && (
              <div style={{ borderTop: "1px solid #F1F5F9", padding: "12px 16px 16px" }}>
                {/* Period editor */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>Period</span>
                  <input value={goal.period || ""} onChange={e => updateGoal(goal.id, { period: e.target.value })} placeholder="e.g. Annual 2026, Q1…" style={{ border: "1.5px solid #E2E8F0", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontFamily: "'Sora',sans-serif", outline: "none", color: "#1E2850", width: 180 }} />
                </div>

                {/* Sub-items */}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Sub-items</div>
                {goal.subItems.length === 0 && <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 10 }}>No sub-items yet — add one below</div>}
                {goal.subItems.map(sub => {
                  const linked = linkedTasks(sub.id);
                  const isSubOpen = expandedSub === sub.id;
                  const hasGap = !allLinkedTaskIds.has(sub.id);

                  return (
                    <div key={sub.id} style={{ background: "#F8FAFC", border: `1.5px solid ${hasGap ? "#FDE68A" : "#E8EDF5"}`, borderRadius: 10, marginBottom: 7, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px" }}>
                        <span style={{ fontSize: 12, color: hasGap ? "#F59E0B" : "#10B981", flexShrink: 0 }}>{hasGap ? "◌" : "●"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <EditableText value={sub.title} onChange={v => updateSubItem(goal.id, sub.id, v)} style={{ fontSize: 13, fontWeight: 600, color: "#1E2850" }} />
                        </div>
                        {linked.length > 0 && (
                          <button onClick={() => setExpandedSub(isSubOpen ? null : sub.id)} style={{ background: "#EEF2FF", color: "#4338CA", border: "none", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                            {linked.length} task{linked.length !== 1 ? "s" : ""} {isSubOpen ? "▲" : "▼"}
                          </button>
                        )}
                        {hasGap && <Pill bg="#FFFBEB" color="#D97706" style={{ fontSize: 10, flexShrink: 0 }}>no tasks</Pill>}
                        <button onClick={() => deleteSubItem(goal.id, sub.id)} style={{ background: "none", border: "none", color: "#CBD5E1", cursor: "pointer", fontSize: 14, padding: "0 3px", flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.color="#EF4444"} onMouseLeave={e => e.currentTarget.style.color="#CBD5E1"}>×</button>
                      </div>

                      {isSubOpen && linked.length > 0 && (
                        <div style={{ borderTop: "1px solid #E8EDF5", padding: "8px 12px 10px 28px" }}>
                          {linked.map(t => (
                            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #F1F5F9", gap: 8 }}>
                              <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#1E2850" }}>{t.title}</div>
                              <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                                <Pill bg={STATUS_COLORS[t.status].bg} color={STATUS_COLORS[t.status].text} style={{ fontSize: 10 }}>{STATUS_LABELS[t.status]}</Pill>
                                <CountdownBadge dueDate={t.dueDate} />
                                <button onClick={() => onUpdateTask(t.id, { goalId: null })} style={{ background: "none", border: "none", color: "#CBD5E1", cursor: "pointer", fontSize: 13, padding: "0 2px" }} title="Unlink">×</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <button onClick={() => addSubItem(goal.id)} style={{ background: "#F1F5F9", color: "#475569", border: "1.5px dashed #CBD5E1", borderRadius: 8, padding: "5px 14px", fontSize: 12, cursor: "pointer", marginTop: 4 }}>+ Add sub-item</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ── PASSWORD GATE ─────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const check = () => {
    if (pw === "aleena") { onUnlock(); }
    else { setError(true); setShake(true); setPw(""); setTimeout(() => setShake(false), 500); }
  };
  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", minHeight: "100vh", background: "linear-gradient(135deg,#1E2850 0%,#2D3A8C 60%,#3B4FBF 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{ background:"rgba(255,255,255,0.06)", backdropFilter:"blur(20px)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"40px 36px", width:"100%", maxWidth:360, textAlign:"center", animation:shake?"shake 0.4s ease":"none" }}>
        <div style={{ fontSize:44, marginBottom:14 }}>🔒</div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", marginBottom:6 }}>Aleena × Elisa · Stanford GSB</div>
        <div style={{ fontSize:22, fontWeight:800, color:"white", marginBottom:28, letterSpacing:-0.5 }}>1:1 Action Hub</div>
        <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&check()} placeholder="Enter password" autoFocus style={{ width:"100%", padding:"13px 16px", borderRadius:12, border:`1.5px solid ${error?"#F87171":"rgba(255,255,255,0.2)"}`, background:"rgba(255,255,255,0.08)", color:"white", fontSize:15, fontFamily:"'Sora',sans-serif", outline:"none", marginBottom:10, textAlign:"center", letterSpacing:2, transition:"border-color 0.15s" }} />
        {error&&<div style={{ fontSize:12, color:"#FCA5A5", marginBottom:10, fontWeight:600 }}>Incorrect password — try again</div>}
        <button onClick={check} style={{ width:"100%", padding:"13px", background:"white", color:"#1E2850", border:"none", borderRadius:12, fontSize:14, fontWeight:800, cursor:"pointer" }}>Unlock →</button>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useLocalStorage("hub_unlocked", false);
  const [tasks, setTasks]       = useLocalStorage("hub_tasks", INITIAL_TASKS);
  const [meetings, setMeetings] = useLocalStorage("hub_meetings", INITIAL_MEETINGS);
  const [sessions, setSessions] = useLocalStorage("hub_sessions", INITIAL_SESSIONS);
  const [goals, setGoals]       = useLocalStorage("hub_goals", INITIAL_GOALS);
  const [tab, setTab]           = useState("notes");
  const [taskView, setTaskView] = useState("open");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingFile, setViewingFile] = useState(null);
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const updateTask    = (id, changes) => setTasks(p => p.map(t => t.id === id ? { ...t, ...changes } : t));
  const deleteTask    = (id) => { if (confirm("Delete this task?")) setTasks(p => p.filter(t => t.id !== id)); };
  const toggleDone    = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done", completedThisWeek: t.status !== "done" } : t));
  const toggleNeeds   = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, needsElisa: !t.needsElisa } : t));
  const addTask       = () => { const n = { id: uid(), title: "New task", category: "Website", priority: "medium", status: "todo", dueDate: TODAY.toISOString().slice(0,10), needsElisa: false, note: "", userNotes: "", links: [], completedThisWeek: false, attachments: [], goalId: null }; setTasks(p => [n, ...p]); };
  const pushToHub     = (date, label, takeaways, raw) => { const id = `m${Date.now()}`; setMeetings(p => [{ id, date, label, takeaways, raw, attachments: [] }, ...p]); return id; };

  // Apply task sync from meeting notes push
  const applyTaskSync = (newTasks, noteUpdates) => {
    // Create new tasks
    if (newTasks.length > 0) {
      const created = newTasks.map(t => ({
        id: uid(), title: t.title, category: t.category || "Website",
        priority: t.priority || "medium", status: "todo",
        dueDate: t.dueDate || TODAY.toISOString().slice(0,10),
        needsElisa: false, note: t.note || "", userNotes: "", links: [],
        completedThisWeek: false, attachments: [], fromMeeting: true,
      }));
      setTasks(p => [...created, ...p]);
    }
    // Apply note updates to existing tasks
    if (noteUpdates.length > 0) {
      setTasks(p => p.map(task => {
        const update = noteUpdates.find(u => u.taskId === task.id || u.taskId === String(task.id));
        if (!update) return task;
        const existing = task.userNotes ? task.userNotes.trim() : "";
        const newNote = existing ? `${existing}\n→ ${update.note}` : `→ ${update.note}`;
        return { ...task, userNotes: newNote };
      }));
    }
  };

  const filtered = tasks
    .filter(t => t.status !== "done")
    .filter(t => category === "All" || t.category === category)
    .filter(t => statusFilter === "all" || t.status === statusFilter)
    .sort((a, b) => getDays(a.dueDate) - getDays(b.dueDate) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const openCount    = tasks.filter(t => t.status !== "done").length;
  const urgent       = tasks.filter(t => getDays(t.dueDate) <= 3 && t.status !== "done").length;
  const needsCount   = tasks.filter(t => t.needsElisa && t.status !== "done").length;
  const draftSessions = sessions.filter(s => !s.pushed).length;
  const totalDocs    = [...tasks.flatMap(t => t.attachments || []), ...sessions.flatMap(s => s.attachments || []), ...meetings.flatMap(m => m.attachments || [])].length;

  const TABS = [
    { key: "notes",     label: "📓 Notes" },
    { key: "tasks",     label: "✅ Tasks" },
    { key: "goals",     label: `🎯 Goals${goals.length > 0 ? ` (${goals.length})` : ""}` },
    { key: "review",    label: "📋 Review" },
    { key: "elisa",     label: "👩‍💼 Elisa" },
    { key: "docs",      label: `📁 Docs${totalDocs > 0 ? ` (${totalDocs})` : ""}` },
  ];

  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", background: "#F0F4FF", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}button{font-family:inherit}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#C7D2FE;border-radius:3px}textarea:focus{outline:none}`}</style>

      {viewingFile && <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />}

      <div style={{ background: "linear-gradient(135deg,#1E2850 0%,#2D3A8C 60%,#3B4FBF 100%)", padding: "28px 24px 0", color: "white" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, opacity: 0.45, marginBottom: 6, textTransform: "uppercase" }}>Aleena × Elisa · Stanford GSB</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 10 }}>1:1 Action Hub</h1>
          {/* Stat chips */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: `${openCount} open`, color: "rgba(255,255,255,0.15)", text: "rgba(255,255,255,0.75)" },
              urgent > 0 ? { label: `${urgent} urgent`, color: "rgba(239,68,68,0.25)", text: "#FCA5A5" } : null,
              needsCount > 0 ? { label: `${needsCount} need Elisa`, color: "rgba(251,191,36,0.2)", text: "#FCD34D" } : null,
              draftSessions > 0 ? { label: `${draftSessions} draft`, color: "rgba(251,191,36,0.2)", text: "#FCD34D" } : null,
              totalDocs > 0 ? { label: `📎 ${totalDocs}`, color: "rgba(165,180,252,0.15)", text: "#A5B4FC" } : null,
            ].filter(Boolean).map((s, i) => (
              <div key={i} style={{ background: s.color, color: s.text, borderRadius: 20, padding: "4px 11px", fontSize: 11, fontWeight: 700, backdropFilter: "blur(4px)" }}>{s.label}</div>
            ))}
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)} style={{ padding: "10px 16px", borderRadius: "10px 10px 0 0", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: tab === key ? "#F0F4FF" : "transparent", color: tab === key ? "#1E2850" : "rgba(255,255,255,0.55)", transition: "all 0.15s", letterSpacing: 0.1 }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 60px" }}>
        {tab === "notes"   && <MeetingNotesTab sessions={sessions} setSessions={setSessions} onPushToHub={pushToHub} tasks={tasks} onApplyTaskSync={applyTaskSync} onViewFile={setViewingFile} />}
        {tab === "review"  && <ReviewTab tasks={tasks} goals={goals} />}
        {tab === "elisa"   && <ElisaTab tasks={tasks} meetings={meetings} setMeetings={setMeetings} onViewFile={setViewingFile} />}
        {tab === "docs"    && <DocumentsTab tasks={tasks} sessions={sessions} meetings={meetings} onViewFile={setViewingFile} />}
        {tab === "goals"   && <GoalsTab goals={goals} setGoals={setGoals} tasks={tasks} onUpdateTask={updateTask} />}
        {tab === "tasks"   && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#1E2850" }}>Tasks</div>
              <button onClick={addTask} style={{ background: "#2D3A8C", color: "white", border: "none", borderRadius: 9, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ New Task</button>
            </div>
            {/* Sub-tab: Open / Done */}
            <div style={{ display: "flex", background: "#E8EDF5", borderRadius: 10, padding: 3, marginBottom: 14, width: "fit-content" }}>
              {[["open","Open"],["done","Completed"]].map(([k,l]) => (
                <button key={k} onClick={() => setTaskView(k)} style={{ padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: taskView === k ? "white" : "transparent", color: taskView === k ? "#1E2850" : "#64748B", boxShadow: taskView === k ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>{l}{k === "done" && tasks.filter(t => t.status === "done").length > 0 ? ` (${tasks.filter(t => t.status === "done").length})` : ""}</button>
              ))}
            </div>

            {taskView === "open" && (
              <div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {CATEGORIES_FILTER.map(c => <button key={c} onClick={() => setCategory(c)} style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${category === c ? "#2D3A8C" : "#E2E8F0"}`, background: category === c ? "#2D3A8C" : "white", color: category === c ? "white" : "#64748B", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{c}</button>)}
                </div>
                <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
                  {[["all","All"],["todo","To Do"],["in-progress","In Progress"],["waiting","Waiting"]].map(([v, l]) => <button key={v} onClick={() => setStatusFilter(v)} style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${statusFilter === v ? "#6366F1" : "#E2E8F0"}`, background: statusFilter === v ? "#EEF2FF" : "white", color: statusFilter === v ? "#4338CA" : "#64748B", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{l}</button>)}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8 }}>{filtered.length} task{filtered.length !== 1 ? "s" : ""} · sorted by deadline</div>
                {filtered.map(t => <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} onToggleDone={toggleDone} onToggleNeeds={toggleNeeds} onViewFile={setViewingFile} goals={goals} />)}
              </div>
            )}

            {taskView === "done" && (
              <div>
                {tasks.filter(t => t.status === "done").length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#64748B" }}>Nothing completed yet</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Check off tasks to see them here</div>
                  </div>
                ) : tasks.filter(t => t.status === "done").map(t => <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} onToggleDone={toggleDone} onToggleNeeds={toggleNeeds} onViewFile={setViewingFile} goals={goals} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
