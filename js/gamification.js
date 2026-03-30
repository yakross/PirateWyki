/**
 * GalaxWiki — Gamification Module (gamification.js)
 * Manages XP, ranks and awards for user interactions.
 * Requires Firebase Auth + Firestore (global `auth` and `db`).
 */

// ── Rank table ──────────────────────────────────────────────
const GW_RANKS = [
    { name: 'Recluta',     icon: '🪐', minXp: 0    },
    { name: 'Piloto',      icon: '🚀', minXp: 50   },
    { name: 'Explorador',  icon: '🛸', minXp: 150  },
    { name: 'Cazador',     icon: '⚔️',  minXp: 350  },
    { name: 'Comandante',  icon: '🛡️',  minXp: 700  },
    { name: 'Almirante',   icon: '🌟', minXp: 1200 },
    { name: 'Leyenda',     icon: '👑', minXp: 2500 },
];

// ── XP rewards per action ───────────────────────────────────
const GW_XP_REWARDS = {
    comment:       10,
    build_create:  30,
    build_like:    5,
    blueprint:     15,
    favorite:      5,
    daily_visit:   5,
};

// ── Get rank info for a given XP amount ─────────────────────
function gwGetRank(xp = 0) {
    let rank = GW_RANKS[0];
    for (const r of GW_RANKS) {
        if (xp >= r.minXp) rank = r;
    }
    const idx = GW_RANKS.indexOf(rank);
    const next = GW_RANKS[idx + 1] || null;
    const progress = next
        ? Math.round(((xp - rank.minXp) / (next.minXp - rank.minXp)) * 100)
        : 100;
    return { rank, next, progress, xp };
}

// ── Award XP to the current user ────────────────────────────
async function gwAwardXp(action) {
    if (typeof auth === 'undefined' || !auth.currentUser) return null;
    const amount = GW_XP_REWARDS[action];
    if (!amount) return null;

    const uid = auth.currentUser.uid;
    const userRef = db.collection('users').doc(uid);

    try {
        await db.runTransaction(async tx => {
            const snap = await tx.get(userRef);
            const currentXp = (snap.exists && snap.data().xp) ? snap.data().xp : 0;
            tx.set(userRef, { xp: currentXp + amount, xpUpdatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
        return amount;
    } catch (e) {
        console.warn('[GW Gamification] Error awarding XP:', e);
        return null;
    }
}

// ── Render rank badge into a container element ───────────────
function gwRenderRankBadge(containerId, xp) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const { rank, next, progress } = gwGetRank(xp);
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%); border:1px solid rgba(102,126,234,0.25); border-radius:14px; padding:14px 18px;">
            <span style="font-size:28px;">${rank.icon}</span>
            <div style="flex:1;">
                <div style="font-size:15px; font-weight:700; color:var(--text-primary);">${rank.name}</div>
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">${xp} XP total ${next ? `· ${next.minXp - xp} XP para ${next.name}` : '· Rango máximo 🏆'}</div>
                <div style="background:rgba(255,255,255,0.08); border-radius:20px; height:8px; overflow:hidden;">
                    <div style="background:linear-gradient(90deg,#667eea,#764ba2); height:100%; width:${progress}%; border-radius:20px; transition:width 0.8s ease;"></div>
                </div>
            </div>
            <div style="font-size:22px; font-weight:800; color:#a78bfa;">${progress}%</div>
        </div>`;
}

// ── Daily visit bonus (fire-and-forget) ─────────────────────
async function gwDailyVisit() {
    if (typeof auth === 'undefined' || !auth.currentUser) return;
    const key = `gw_daily_${auth.currentUser.uid}`;
    const lastVisit = localStorage.getItem(key);
    const today = new Date().toDateString();
    if (lastVisit === today) return;
    localStorage.setItem(key, today);
    await gwAwardXp('daily_visit');
}

// Auto-trigger daily visit when auth is ready
if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => { if (user) gwDailyVisit(); });
}
