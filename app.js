// Life Quest - Main Application Logic
// Gamified Self-Improvement Tracker

// ==========================================
// LEVEL SYSTEM - XP Requirements increase exponentially
// ==========================================
const LEVELS = [
    { level: 1, title: "Novice Adventurer", xpRequired: 0, avatar: "🧑" },
    { level: 2, title: "Apprentice Warrior", xpRequired: 100, avatar: "🧑‍🎓" },
    { level: 3, title: "Dedicated Disciple", xpRequired: 250, avatar: "🥷" },
    { level: 4, title: "Rising Champion", xpRequired: 500, avatar: "🦸" },
    { level: 5, title: "Faithful Soldier", xpRequired: 850, avatar: "⚔️" },
    { level: 6, title: "Proven Warrior", xpRequired: 1300, avatar: "🛡️" },
    { level: 7, title: "Battle-Tested Hero", xpRequired: 1900, avatar: "🏆" },
    { level: 8, title: "Mighty Conqueror", xpRequired: 2700, avatar: "👑" },
    { level: 9, title: "Legendary Knight", xpRequired: 3800, avatar: "🎖️" },
    { level: 10, title: "Kingdom Champion", xpRequired: 5200, avatar: "⭐" },
    { level: 11, title: "Elite Guardian", xpRequired: 7000, avatar: "🌟" },
    { level: 12, title: "Master Warrior", xpRequired: 9500, avatar: "💫" },
    { level: 13, title: "Grand Champion", xpRequired: 13000, avatar: "🔥" },
    { level: 14, title: "Divine Warrior", xpRequired: 18000, avatar: "✨" },
    { level: 15, title: "Immortal Legend", xpRequired: 25000, avatar: "👼" },
];

const DEFAULT_QUESTS = [
    { id: "bible", name: "Read Bible", icon: "📖", xp: 35, category: "spiritual" },
    { id: "purity", name: "Stay Pure", icon: "🛡️", xp: 30, category: "purity" },
    { id: "devotional", name: "Read Devotional", icon: "📚", xp: 25, category: "spiritual" },
    { id: "workout", name: "Workout", icon: "💪", xp: 20, category: "health" },
    { id: "job", name: "Apply to Job", icon: "💼", xp: 20, category: "career" },
    { id: "skills", name: "Build Skills", icon: "🎯", xp: 20, category: "growth" },
    { id: "business", name: "Business Work", icon: "🚀", xp: 20, category: "business" },
    { id: "healthy", name: "Eat Healthy", icon: "🥗", xp: 15, category: "health" },
];

const ACHIEVEMENTS = [
    { id: "first_quest", name: "First Step", icon: "👣", desc: "Complete your first quest", condition: (s) => s.totalQuestsCompleted >= 1 },
    { id: "week_streak", name: "Week Warrior", icon: "🔥", desc: "7 day streak", condition: (s) => s.currentStreak >= 7 },
    { id: "month_streak", name: "Monthly Master", icon: "💪", desc: "30 day streak", condition: (s) => s.currentStreak >= 30 },
    { id: "level_5", name: "Rising Star", icon: "⭐", desc: "Reach level 5", condition: (s) => s.level >= 5 },
    { id: "level_10", name: "Champion", icon: "👑", desc: "Reach level 10", condition: (s) => s.level >= 10 },
    { id: "100_quests", name: "Centurion", icon: "🎖️", desc: "Complete 100 quests", condition: (s) => s.totalQuestsCompleted >= 100 },
    { id: "purity_week", name: "Pure Heart", icon: "🛡️", desc: "7 days of purity", condition: (s) => s.purityDays >= 7 },
    { id: "purity_month", name: "Shield Bearer", icon: "🏰", desc: "30 days of purity", condition: (s) => s.purityDays >= 30 },
    { id: "purity_90", name: "Fortress", icon: "⚔️", desc: "90 days of purity", condition: (s) => s.purityDays >= 90 },
    { id: "10_victories", name: "Overcomer", icon: "🏆", desc: "Resist 10 temptations", condition: (s) => s.victories >= 10 },
    { id: "bible_30", name: "Scripture Scholar", icon: "📖", desc: "30 days of Bible reading", condition: (s) => s.bibleStreak >= 30 },
    { id: "journal_week", name: "Reflector", icon: "📝", desc: "Journal for 7 days", condition: (s) => s.journalEntries >= 7 },
];

// ==========================================
// STATE MANAGEMENT
// ==========================================
let state = {
    // User Info
    userName: "Warrior",

    // XP & Leveling
    totalXP: 0,
    currentXP: 0,
    level: 1,

    // Streaks
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: null,

    // Purity Tracking
    purityStartDate: null,
    purityDays: 0,
    purityBestStreak: 0,
    victories: 0,

    // Quest Tracking
    quests: [...DEFAULT_QUESTS],
    todayQuests: {},
    totalQuestsCompleted: 0,
    questHistory: {},

    // Devotional & Bible
    devotionalReadToday: false,
    bibleBook: "",
    bibleChapter: 1,
    chaptersRead: 0,
    bibleStreak: 0,
    lastBibleDate: null,
    currentDevotionalOffset: 0, // For navigating past devotionals

    // Purity Tiers
    morningPureToday: false,
    eveningPureToday: false,

    // Achievement bonus clicks
    achievementBonusClicks: {}, // Track bonus XP clicks per achievement

    // Journal
    journalEntries: 0,
    journals: [],

    // Achievements
    unlockedAchievements: [],

    // Daily tracking
    todayXP: 0,
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("Life Quest: Initializing...");
        loadState();
        checkNewDay();
        setupEventListeners();
        updateAllDisplays();
        console.log("Life Quest: Initialization complete!");
    } catch (error) {
        console.error("Life Quest: Initialization error:", error);
    }
});
function loadState() {
    const saved = localStorage.getItem("lifequest_state");
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
    }

    // Initialize purity if not set
    if (!state.purityStartDate) {
        state.purityStartDate = new Date().toISOString();
    }
}

function saveState() {
    localStorage.setItem("lifequest_state", JSON.stringify(state));
}

function checkNewDay() {
    const today = getDateString();
    const lastDate = state.lastActiveDate;

    if (lastDate !== today) {
        // Check if streak should continue or reset
        if (lastDate) {
            const daysDiff = getDaysDifference(lastDate, today);
            if (daysDiff > 1) {
                // Missed days - check if we should penalize
                const questsCompletedYesterday = Object.keys(state.todayQuests || {}).length;
                if (questsCompletedYesterday < state.quests.length / 2) {
                    state.currentStreak = 0;
                }
            }
        }

        // Reset daily tracking
        state.todayQuests = {};
        state.todayXP = 0;
        state.devotionalReadToday = false;
        state.morningPureToday = false;
        state.eveningPureToday = false;
        state.currentDevotionalOffset = 0;
        state.lastActiveDate = today;

        // Update purity days
        updatePurityDays();

        saveState();
    }
}

function getDateString(date = new Date()) {
    return date.toISOString().split("T")[0];
}

function getDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

// ==========================================
// XP & LEVELING SYSTEM
// ==========================================
function addXP(amount, reason = "") {
    state.totalXP += amount;
    state.todayXP += amount;

    const oldLevel = state.level;
    updateLevel();

    if (state.level > oldLevel) {
        showLevelUp(state.level);
    }

    showToast(`+${amount} XP${reason ? ": " + reason : ""}`, "xp");
    saveState();
    updateAllDisplays();
}

function removeXP(amount) {
    state.totalXP = Math.max(0, state.totalXP - amount);
    state.todayXP = Math.max(0, state.todayXP - amount);
    updateLevel();
    saveState();
    updateAllDisplays();
}

function updateLevel() {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (state.totalXP >= LEVELS[i].xpRequired) {
            state.level = LEVELS[i].level;
            break;
        }
    }
}

function getCurrentLevelInfo() {
    return LEVELS.find(l => l.level === state.level) || LEVELS[0];
}

function getNextLevelInfo() {
    return LEVELS.find(l => l.level === state.level + 1) || LEVELS[LEVELS.length - 1];
}

function getXPProgress() {
    const current = getCurrentLevelInfo();
    const next = getNextLevelInfo();
    const xpIntoLevel = state.totalXP - current.xpRequired;
    const xpNeeded = next.xpRequired - current.xpRequired;
    return { xpIntoLevel, xpNeeded, percent: Math.min(100, (xpIntoLevel / xpNeeded) * 100) };
}

// ==========================================
// QUEST SYSTEM
// ==========================================
function completeQuest(questId) {
    if (state.todayQuests[questId]) return; // Already completed

    const quest = state.quests.find(q => q.id === questId);
    if (!quest) return;

    state.todayQuests[questId] = true;
    state.totalQuestsCompleted++;

    // Log to history
    const today = getDateString();
    if (!state.questHistory[today]) state.questHistory[today] = {};
    state.questHistory[today][questId] = true;

    // Calculate bonus XP for completing multiple quests
    const completedCount = Object.keys(state.todayQuests).length;
    let bonusXP = 0;
    if (completedCount === state.quests.length) {
        bonusXP = 50; // All quests bonus
        showToast("🎉 All quests complete! +50 bonus XP", "success");
    } else if (completedCount >= state.quests.length / 2) {
        bonusXP = 10; // Half quests bonus
    }

    addXP(quest.xp + bonusXP, quest.name);

    // Update streak
    updateStreak();

    // Check achievements
    checkAchievements();

    saveState();
    updateAllDisplays();
}

function uncompleteQuest(questId) {
    if (!state.todayQuests[questId]) return;

    const quest = state.quests.find(q => q.id === questId);
    if (!quest) return;

    delete state.todayQuests[questId];

    const today = getDateString();
    if (state.questHistory[today]) {
        delete state.questHistory[today][questId];
    }

    removeXP(quest.xp);
    saveState();
    updateAllDisplays();
}

function toggleQuest(questId) {
    if (state.todayQuests[questId]) {
        uncompleteQuest(questId);
    } else {
        completeQuest(questId);
    }
}

function addCustomQuest(name, xp, icon) {
    const id = "custom_" + Date.now();
    state.quests.push({ id, name, icon: icon || "✨", xp: xp || 20, category: "custom" });
    saveState();
    renderQuests();
}

// ==========================================
// STREAK SYSTEM
// ==========================================
function updateStreak() {
    const today = getDateString();
    const completedToday = Object.keys(state.todayQuests).length;
    const threshold = Math.ceil(state.quests.length / 2);

    if (completedToday >= threshold) {
        state.currentStreak++;
        if (state.currentStreak > state.bestStreak) {
            state.bestStreak = state.currentStreak;
        }
    }

    saveState();
}

// ==========================================
// PURITY TRACKING
// ==========================================
function updatePurityDays() {
    if (state.purityStartDate) {
        const start = new Date(state.purityStartDate);
        const now = new Date();
        state.purityDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

        if (state.purityDays > state.purityBestStreak) {
            state.purityBestStreak = state.purityDays;
        }
    }
}

function resetPurity() {
    if (confirm("Being honest is the first step to freedom. Are you sure you want to reset?")) {
        // Save best streak before reset
        if (state.purityDays > state.purityBestStreak) {
            state.purityBestStreak = state.purityDays;
        }

        state.purityStartDate = new Date().toISOString();
        state.purityDays = 0;

        // XP penalty for breaking streak
        removeXP(Math.min(50, state.purityDays * 2));

        showToast("Streak reset. God's mercies are new every morning. Start again!", "info");
        saveState();
        updateAllDisplays();
    }
}

function recordVictory() {
    state.victories++;
    addXP(15, "Overcame temptation!");
    checkAchievements();
    saveState();
}

// ==========================================
// PURITY TIER SYSTEM
// ==========================================
function completePurityTier(tier) {
    if (tier === "morning" && !state.morningPureToday) {
        state.morningPureToday = true;
        addXP(15, "Morning purity!");
        showToast("☀️ Morning clear! Keep it up!", "success");
        updatePurityTierButtons();

        // Check if both tiers complete - gives the full quest completion
        if (state.morningPureToday && state.eveningPureToday) {
            completeQuest("purity");
        }
    } else if (tier === "evening" && !state.eveningPureToday) {
        state.eveningPureToday = true;
        addXP(15, "Evening purity!");
        showToast("🌙 Evening clear! Full day conquered!", "success");
        updatePurityTierButtons();

        // Check if both tiers complete - gives the full quest completion
        if (state.morningPureToday && state.eveningPureToday) {
            completeQuest("purity");
        }
    }
    saveState();
}

function updatePurityTierButtons() {
    const morningBtn = document.getElementById("morning-pure-btn");
    const eveningBtn = document.getElementById("evening-pure-btn");

    if (morningBtn) {
        morningBtn.classList.toggle("completed", state.morningPureToday);
        if (state.morningPureToday) {
            morningBtn.querySelector(".tier-xp").textContent = "✓ Done";
        }
    }

    if (eveningBtn) {
        eveningBtn.classList.toggle("completed", state.eveningPureToday);
        if (state.eveningPureToday) {
            eveningBtn.querySelector(".tier-xp").textContent = "✓ Done";
        }
    }
}

// ==========================================
// ACHIEVEMENTS
// ==========================================
function checkAchievements() {
    const stats = {
        totalQuestsCompleted: state.totalQuestsCompleted,
        currentStreak: state.currentStreak,
        level: state.level,
        purityDays: state.purityDays,
        victories: state.victories,
        bibleStreak: state.bibleStreak,
        journalEntries: state.journalEntries,
    };

    ACHIEVEMENTS.forEach(achievement => {
        if (!state.unlockedAchievements.includes(achievement.id)) {
            if (achievement.condition(stats)) {
                state.unlockedAchievements.push(achievement.id);
                showToast(`🏆 Achievement Unlocked: ${achievement.name}!`, "success");
                addXP(25, `Achievement: ${achievement.name}`);
            }
        }
    });
}

// ==========================================
// DEVOTIONAL SYSTEM
// ==========================================
function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getTodayDevotional() {
    const dayOfYear = getDayOfYear();
    const index = (dayOfYear - 1 + state.currentDevotionalOffset) % window.DEVOTIONALS.length;
    // Handle negative index
    const adjustedIndex = index < 0 ? window.DEVOTIONALS.length + index : index;
    return window.DEVOTIONALS[adjustedIndex];
}

function getDevotionalDayNumber() {
    const dayOfYear = getDayOfYear();
    return dayOfYear + state.currentDevotionalOffset;
}

function navigateDevotional(direction) {
    if (direction === "prev") {
        state.currentDevotionalOffset--;
    } else if (direction === "next") {
        // Don't go into the future
        if (state.currentDevotionalOffset < 0) {
            state.currentDevotionalOffset++;
        }
    } else if (direction === "today") {
        state.currentDevotionalOffset = 0;
    }
    renderDevotional();
    updateDevotionalNavButtons();
}

function updateDevotionalNavButtons() {
    const nextBtn = document.getElementById("next-devo-btn");
    const todayBtn = document.getElementById("today-devo-btn");

    if (nextBtn) {
        nextBtn.disabled = state.currentDevotionalOffset >= 0;
    }
    if (todayBtn) {
        todayBtn.disabled = state.currentDevotionalOffset === 0;
    }
}

function markDevotionalRead() {
    if (state.devotionalReadToday) return;

    state.devotionalReadToday = true;
    completeQuest("devotional");
    saveState();
    updateAllDisplays();

    document.getElementById("mark-read-btn").textContent = "✓ Completed!";
    document.getElementById("mark-read-btn").disabled = true;
}

function logBibleReading() {
    const book = document.getElementById("bible-book").value;
    const chapter = document.getElementById("bible-chapter").value;

    if (!book || !chapter) {
        showToast("Please select a book and chapter", "error");
        return;
    }

    state.bibleBook = book;
    state.bibleChapter = parseInt(chapter);
    state.chaptersRead++;

    // Update streak
    const today = getDateString();
    if (state.lastBibleDate !== today) {
        const daysDiff = state.lastBibleDate ? getDaysDifference(state.lastBibleDate, today) : 0;
        if (daysDiff <= 1) {
            state.bibleStreak++;
        } else {
            state.bibleStreak = 1;
        }
        state.lastBibleDate = today;
    }

    completeQuest("bible");
    checkAchievements();
    saveState();
    updateAllDisplays();

    showToast(`Logged: ${book} ${chapter}`, "success");
}

// ==========================================
// JOURNAL SYSTEM
// ==========================================
function saveJournalEntry() {
    const textarea = document.getElementById("journal-textarea");
    const content = textarea.value.trim();

    if (!content) {
        showToast("Please write something first", "error");
        return;
    }

    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        content: content
    };

    state.journals.unshift(entry);
    state.journalEntries++;

    addXP(10, "Journal entry");
    checkAchievements();
    saveState();

    textarea.value = "";
    renderJournalEntries();
    showToast("Journal entry saved!", "success");
}

function renderJournalEntries() {
    const container = document.getElementById("journal-entries-list");
    if (!container) return;

    if (state.journals.length === 0) {
        container.innerHTML = '<p class="empty-state">No entries yet. Start writing!</p>';
        return;
    }

    container.innerHTML = state.journals.slice(0, 10).map(entry => {
        const date = new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });
        const preview = entry.content.substring(0, 100) + (entry.content.length > 100 ? "..." : "");
        return `<div class="journal-entry-item" onclick="viewJournalEntry(${entry.id})">
            <span class="entry-date">${date}</span>
            <p class="entry-preview">${preview}</p>
        </div>`;
    }).join("");
}

// ==========================================
// PANIC MODE
// ==========================================
function openPanicMode() {
    document.getElementById("panic-overlay").classList.remove("hidden");
    loadPanicContent("lust"); // Default category
    document.body.style.overflow = "hidden";
}

function closePanicMode() {
    document.getElementById("panic-overlay").classList.add("hidden");
    document.body.style.overflow = "";
}

function loadPanicContent(category) {
    const content = window.PANIC_CONTENT[category];
    if (!content) return;

    // Update active button
    document.querySelectorAll(".panic-cat-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === category);
    });

    // Render steps
    const stepsContainer = document.getElementById("panic-steps");
    stepsContainer.innerHTML = content.steps.map((step, i) => `
        <div class="panic-step">
            <div class="step-number">${i + 1}</div>
            <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.desc}</p>
            </div>
        </div>
    `).join("");

    // Render verses
    const versesContainer = document.getElementById("panic-verses");
    versesContainer.innerHTML = content.verses.map(verse => `
        <div class="panic-verse-card">
            <p>"${verse.text}"</p>
            <cite>- ${verse.ref}</cite>
        </div>
    `).join("");
}

function startBreathing() {
    const circle = document.getElementById("breathing-circle");
    const text = document.getElementById("breathing-text");
    const btn = document.getElementById("start-breathing");

    btn.disabled = true;
    btn.textContent = "Breathing...";

    let phase = "inhale";
    let count = 0;

    const breathe = () => {
        if (count >= 6) {
            text.textContent = "Done!";
            btn.disabled = false;
            btn.textContent = "Start Again";
            circle.classList.remove("inhale", "exhale");
            return;
        }

        if (phase === "inhale") {
            text.textContent = "Breathe In...";
            circle.classList.add("inhale");
            circle.classList.remove("exhale");
            phase = "hold";
            setTimeout(breathe, 4000);
        } else if (phase === "hold") {
            text.textContent = "Hold...";
            phase = "exhale";
            setTimeout(breathe, 4000);
        } else {
            text.textContent = "Breathe Out...";
            circle.classList.add("exhale");
            circle.classList.remove("inhale");
            phase = "inhale";
            count++;
            setTimeout(breathe, 4000);
        }
    };

    breathe();
}

// ==========================================
// UI UPDATES
// ==========================================
function updateAllDisplays() {
    updateHeader();
    updateLevelDisplay();
    updateScriptureDisplay();
    updateQuestProgress();
    updatePurityDisplay();
    updatePurityTierButtons();
    updateCharacterCard();
    updateStatsPage();
    renderQuests();
    renderDevotional();
    renderAchievements();
    renderWeeklyHeatmap();
}

function updateHeader() {
    // Greeting
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
    if (hour >= 17) greeting = "Good Evening";

    const greetingEl = document.getElementById("greeting-text");
    if (greetingEl) greetingEl.textContent = `${greeting}, ${state.userName}`;

    // Date
    const dateEl = document.getElementById("date-display");
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
    }

    // Streak
    const streakEl = document.getElementById("main-streak");
    if (streakEl) streakEl.textContent = state.currentStreak;
}

function updateLevelDisplay() {
    const levelInfo = getCurrentLevelInfo();
    const progress = getXPProgress();

    // Hero section
    const heroLevel = document.getElementById("hero-level");
    const heroTitle = document.getElementById("hero-title");
    const heroDesc = document.getElementById("hero-description");
    const levelPercent = document.getElementById("level-percent");

    if (heroLevel) heroLevel.textContent = levelInfo.level;
    if (heroTitle) heroTitle.textContent = levelInfo.title;
    if (heroDesc) heroDesc.textContent = `${progress.xpIntoLevel} / ${progress.xpNeeded} XP to next level`;
    if (levelPercent) levelPercent.textContent = `${Math.round(progress.percent)}%`;

    // Progress ring
    const ring = document.getElementById("level-progress-ring");
    if (ring) {
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (progress.percent / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }

    // XP bar
    const xpFill = document.getElementById("xp-fill");
    if (xpFill) xpFill.style.width = `${progress.percent}%`;

    const currentXP = document.getElementById("current-xp");
    const nextLevelXP = document.getElementById("next-level-xp");
    if (currentXP) currentXP.textContent = progress.xpIntoLevel;
    if (nextLevelXP) nextLevelXP.textContent = progress.xpNeeded;

    // Level badge
    const badge = document.getElementById("level-badge");
    if (badge) badge.textContent = levelInfo.level;
}

function updateScriptureDisplay() {
    const devo = getTodayDevotional();
    const dayOfYear = getDayOfYear();

    const dayEl = document.getElementById("scripture-day");
    const verseEl = document.getElementById("daily-verse-text");
    const refEl = document.getElementById("daily-verse-ref");

    if (dayEl) dayEl.textContent = `Day ${dayOfYear}`;
    if (verseEl) verseEl.textContent = `"${devo.verse}"`;
    if (refEl) refEl.textContent = `- ${devo.ref}`;
}

function updateQuestProgress() {
    const completed = Object.keys(state.todayQuests).length;
    const total = state.quests.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;

    const fill = document.getElementById("today-progress-fill");
    if (fill) fill.style.width = `${percent}%`;

    const completedEl = document.getElementById("quests-completed");
    const totalEl = document.getElementById("quests-total");
    if (completedEl) completedEl.textContent = completed;
    if (totalEl) totalEl.textContent = total;

    // Quest summary
    const xpToday = document.getElementById("xp-today");
    const questsDone = document.getElementById("quests-done");
    if (xpToday) xpToday.textContent = state.todayXP;
    if (questsDone) questsDone.textContent = `${completed}/${total}`;
}

function updatePurityDisplay() {
    updatePurityDays();

    const daysEl = document.getElementById("purity-days-home");
    const msgEl = document.getElementById("purity-message-home");

    if (daysEl) daysEl.textContent = state.purityDays;
    if (msgEl) msgEl.textContent = getPurityMessage(state.purityDays);
}

function getPurityMessage(days) {
    if (days === 0) return "Today is day one. You've got this!";
    if (days < 7) return "Building momentum. Stay strong!";
    if (days < 14) return "One week strong! Keep pushing!";
    if (days < 30) return "You're rewiring your brain. Don't stop!";
    if (days < 60) return "A month of freedom! You're a warrior!";
    if (days < 90) return "Your strength is inspiring!";
    return "You are living proof of God's power!";
}

function updateCharacterCard() {
    const levelInfo = getCurrentLevelInfo();

    const nameEl = document.getElementById("character-name");
    const titleEl = document.getElementById("character-title");

    if (nameEl) nameEl.textContent = state.userName;
    if (titleEl) titleEl.textContent = levelInfo.title;
}

function updateStatsPage() {
    const statsLevel = document.getElementById("stats-level");
    const statsTotalXP = document.getElementById("stats-total-xp");
    const statsXPNeeded = document.getElementById("stats-xp-needed");

    if (statsLevel) statsLevel.textContent = state.level;
    if (statsTotalXP) statsTotalXP.textContent = state.totalXP;
    if (statsXPNeeded) statsXPNeeded.textContent = getXPProgress().xpNeeded - getXPProgress().xpIntoLevel;

    const currentStreakStat = document.getElementById("current-streak-stat");
    const bestStreakStat = document.getElementById("best-streak-stat");
    const totalDaysStat = document.getElementById("total-days-stat");
    const victoriesStat = document.getElementById("victories-stat");

    if (currentStreakStat) currentStreakStat.textContent = state.currentStreak;
    if (bestStreakStat) bestStreakStat.textContent = state.bestStreak;
    if (totalDaysStat) totalDaysStat.textContent = Object.keys(state.questHistory).length;
    if (victoriesStat) victoriesStat.textContent = state.victories;

    // Level tower
    const tower = document.getElementById("level-tower");
    if (tower) {
        tower.innerHTML = Array.from({ length: 10 }, (_, i) =>
            `<div class="level-block ${i < state.level ? "filled" : ""}"></div>`
        ).join("");
    }
}

function renderQuests() {
    const container = document.getElementById("quests-list");
    if (!container) return;

    container.innerHTML = state.quests.map(quest => {
        const completed = state.todayQuests[quest.id];
        return `
            <div class="quest-item ${completed ? "completed" : ""}" onclick="toggleQuest('${quest.id}')">
                <div class="quest-checkbox">${completed ? "✓" : ""}</div>
                <span class="quest-icon">${quest.icon}</span>
                <div class="quest-info">
                    <span class="quest-name">${quest.name}</span>
                    <span class="quest-xp">+${quest.xp} XP</span>
                </div>
            </div>
        `;
    }).join("");

    // Update quick action cards
    document.querySelectorAll(".action-card").forEach(card => {
        const questId = card.dataset.quest;
        if (questId && state.todayQuests[questId]) {
            card.classList.add("completed");
        } else {
            card.classList.remove("completed");
        }
    });
}

function renderDevotional() {
    const devo = getTodayDevotional();
    const displayDay = getDevotionalDayNumber();

    const devoDay = document.getElementById("devo-day");
    const devoTheme = document.getElementById("devo-theme");
    const devoVerse = document.getElementById("devo-verse");
    const devoVerseRef = document.getElementById("devo-verse-ref");
    const devoTitle = document.getElementById("devo-title");
    const devoText = document.getElementById("devo-text");
    const devoAction = document.getElementById("devo-action");
    const devoPrayer = document.getElementById("devo-prayer");

    if (devoDay) {
        const dayLabel = state.currentDevotionalOffset === 0 ? "Today" :
            state.currentDevotionalOffset === -1 ? "Yesterday" :
            `Day ${Math.max(1, displayDay)}`;
        devoDay.textContent = `${dayLabel} of 365`;
    }
    if (devoTheme) devoTheme.textContent = devo.theme;
    if (devoVerse) devoVerse.textContent = `"${devo.verse}"`;
    if (devoVerseRef) devoVerseRef.textContent = `- ${devo.ref}`;
    if (devoTitle) devoTitle.textContent = devo.title;
    if (devoText) devoText.textContent = devo.text;
    if (devoAction) devoAction.textContent = devo.action;
    if (devoPrayer) devoPrayer.textContent = devo.prayer;

    // Update Bible stats
    const chaptersRead = document.getElementById("chapters-read");
    const readingStreak = document.getElementById("reading-streak");
    if (chaptersRead) chaptersRead.textContent = state.chaptersRead;
    if (readingStreak) readingStreak.textContent = state.bibleStreak;

    // Update devotional button - only allow marking today's as read
    const btn = document.getElementById("mark-read-btn");
    if (btn) {
        if (state.currentDevotionalOffset !== 0) {
            btn.textContent = "📅 Go to Today to Mark Complete";
            btn.disabled = true;
        } else if (state.devotionalReadToday) {
            btn.textContent = "✓ Completed!";
            btn.disabled = true;
        } else {
            btn.textContent = "✓ I Read Today's Devotional (+25 XP)";
            btn.disabled = false;
        }
    }

    // Update devotional nav buttons
    updateDevotionalNavButtons();
}

function renderAchievements() {
    const container = document.getElementById("achievements-grid");
    if (!container) return;

    container.innerHTML = ACHIEVEMENTS.map(ach => {
        const unlocked = state.unlockedAchievements.includes(ach.id);
        const bonusClicks = state.achievementBonusClicks[ach.id] || 0;
        return `
            <div class="achievement ${unlocked ? "unlocked" : ""}" data-id="${ach.id}" onclick="claimAchievementBonus('${ach.id}')">
                <span class="achievement-icon">${ach.icon}</span>
                <span class="achievement-name">${ach.name}</span>
                ${unlocked ? `<span class="achievement-bonus">+5 XP${bonusClicks > 0 ? ` (×${bonusClicks})` : ""}</span>` : ""}
            </div>
        `;
    }).join("");
}

function claimAchievementBonus(achievementId) {
    const unlocked = state.unlockedAchievements.includes(achievementId);
    if (!unlocked) {
        showToast("Unlock this achievement first!", "info");
        return;
    }

    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return;

    // Track bonus clicks
    if (!state.achievementBonusClicks[achievementId]) {
        state.achievementBonusClicks[achievementId] = 0;
    }
    state.achievementBonusClicks[achievementId]++;

    // Add bonus XP (diminishing returns after 3 clicks per day)
    const clicks = state.achievementBonusClicks[achievementId];
    const bonusXP = clicks <= 3 ? 5 : Math.max(1, 5 - clicks + 3);

    addXP(bonusXP, `${ach.name} bonus!`);

    // Visual feedback
    const element = document.querySelector(`.achievement[data-id="${achievementId}"]`);
    if (element) {
        element.classList.add("clicked");
        setTimeout(() => element.classList.remove("clicked"), 300);
    }

    saveState();
    renderAchievements();
}

// Make function globally accessible
window.claimAchievementBonus = claimAchievementBonus;

function renderWeeklyHeatmap() {
    const container = document.getElementById("weekly-heatmap");
    if (!container) return;

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    let html = "";
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = getDateString(date);
        const dayHistory = state.questHistory[dateStr] || {};
        const completed = Object.keys(dayHistory).length;
        const level = Math.min(5, Math.ceil((completed / state.quests.length) * 5));

        html += `
            <div class="heatmap-day level-${level}">
                <span>${days[date.getDay()]}</span>
                <span>${completed}</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ==========================================
// MODALS & TOASTS
// ==========================================
function showLevelUp(newLevel) {
    const levelInfo = LEVELS.find(l => l.level === newLevel);

    document.getElementById("new-level-display").textContent = `Level ${newLevel}`;
    document.getElementById("new-title-display").textContent = levelInfo?.title || "Champion";
    document.getElementById("levelup-modal").classList.remove("hidden");
}

function closeLevelUp() {
    document.getElementById("levelup-modal").classList.add("hidden");
}

function showAddQuestModal() {
    document.getElementById("add-quest-modal").classList.remove("hidden");
}

function closeAddQuestModal() {
    document.getElementById("add-quest-modal").classList.add("hidden");
    document.getElementById("new-quest-name").value = "";
    document.getElementById("new-quest-xp").value = "";
    document.getElementById("new-quest-icon").value = "";
}

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
        xp: "⚡",
        success: "✓",
        error: "✕",
        info: "ℹ"
    };

    toast.innerHTML = `<div class="toast-icon">${icons[type] || icons.info}</div><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-btn, .sidebar-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            if (page) navigateTo(page);
        });
    });

    // Quick action cards
    document.querySelectorAll(".action-card").forEach(card => {
        card.addEventListener("click", () => {
            const questId = card.dataset.quest;
            if (questId) toggleQuest(questId);
        });
    });

    // Panic buttons
    document.getElementById("panic-btn-main")?.addEventListener("click", openPanicMode);
    document.getElementById("panic-btn-sidebar")?.addEventListener("click", openPanicMode);
    document.getElementById("panic-close")?.addEventListener("click", closePanicMode);

    // Panic category buttons
    document.querySelectorAll(".panic-cat-btn").forEach(btn => {
        btn.addEventListener("click", () => loadPanicContent(btn.dataset.category));
    });

    // Panic actions
    document.getElementById("start-breathing")?.addEventListener("click", startBreathing);
    document.getElementById("victory-btn")?.addEventListener("click", () => {
        recordVictory();
        closePanicMode();
    });
    document.getElementById("need-more-btn")?.addEventListener("click", () => {
        document.getElementById("panic-resources").classList.remove("hidden");
    });

    // Purity reset
    document.getElementById("reset-shield-btn")?.addEventListener("click", resetPurity);

    // Level up modal
    document.getElementById("close-levelup")?.addEventListener("click", closeLevelUp);

    // Add quest modal
    document.getElementById("add-quest-btn")?.addEventListener("click", showAddQuestModal);
    document.getElementById("cancel-quest-btn")?.addEventListener("click", closeAddQuestModal);
    document.getElementById("save-quest-btn")?.addEventListener("click", () => {
        const name = document.getElementById("new-quest-name").value.trim();
        const xp = parseInt(document.getElementById("new-quest-xp").value) || 20;
        const icon = document.getElementById("new-quest-icon").value || "✨";

        if (name) {
            addCustomQuest(name, xp, icon);
            closeAddQuestModal();
            showToast("Quest added!", "success");
        }
    });

    // Devotional
    document.getElementById("mark-read-btn")?.addEventListener("click", markDevotionalRead);
    document.getElementById("log-reading-btn")?.addEventListener("click", logBibleReading);

    // Devotional navigation
    document.getElementById("prev-devo-btn")?.addEventListener("click", () => navigateDevotional("prev"));
    document.getElementById("next-devo-btn")?.addEventListener("click", () => navigateDevotional("next"));
    document.getElementById("today-devo-btn")?.addEventListener("click", () => navigateDevotional("today"));

    // Purity tier buttons
    document.getElementById("morning-pure-btn")?.addEventListener("click", () => completePurityTier("morning"));
    document.getElementById("evening-pure-btn")?.addEventListener("click", () => completePurityTier("evening"));

    // Journal
    document.getElementById("save-journal-btn")?.addEventListener("click", saveJournalEntry);

    // Settings
    document.getElementById("save-profile-btn")?.addEventListener("click", () => {
        const name = document.getElementById("user-name").value.trim();
        if (name) {
            state.userName = name;
            saveState();
            updateAllDisplays();
            showToast("Profile saved!", "success");
        }
    });

    document.getElementById("export-data-btn")?.addEventListener("click", () => {
        const data = JSON.stringify(state, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lifequest-backup.json";
        a.click();
    });

    document.getElementById("reset-data-btn")?.addEventListener("click", () => {
        if (confirm("This will delete ALL your data. Are you sure?")) {
            localStorage.removeItem("lifequest_state");
            location.reload();
        }
    });
}

function navigateTo(page) {
    // Update nav buttons
    document.querySelectorAll(".nav-btn, .sidebar-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.page === page);
    });

    // Show page
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const pageEl = document.getElementById(`${page}-page`);
    if (pageEl) pageEl.classList.add("active");

    // Render page-specific content
    if (page === "journal") renderJournalEntries();
}

// Make functions globally accessible
window.toggleQuest = toggleQuest;
window.viewJournalEntry = (id) => {
    const entry = state.journals.find(j => j.id === id);
    if (entry) alert(entry.content);
};

// ==========================================
// ESV BIBLE READER
// ==========================================
let currentBook = "";
let currentChapter = 1;

function setupBibleReader() {
    const loadBtn = document.getElementById("load-chapter-btn");
    const prevBtn = document.getElementById("prev-chapter-btn");
    const nextBtn = document.getElementById("next-chapter-btn");
    const readerBook = document.getElementById("reader-book");
    const readerChapter = document.getElementById("reader-chapter");

    if (loadBtn) {
        loadBtn.addEventListener("click", () => {
            const book = readerBook?.value;
            const chapter = parseInt(readerChapter?.value) || 1;
            if (book) {
                loadBibleChapter(book, chapter);
            } else {
                showToast("Please select a book", "error");
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentChapter > 1) {
                currentChapter--;
                if (readerChapter) readerChapter.value = currentChapter;
                loadBibleChapter(currentBook, currentChapter);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentChapter++;
            if (readerChapter) readerChapter.value = currentChapter;
            loadBibleChapter(currentBook, currentChapter);
        });
    }
}

async function loadBibleChapter(book, chapter) {
    const container = document.getElementById("bible-text-container");
    const prevBtn = document.getElementById("prev-chapter-btn");
    const nextBtn = document.getElementById("next-chapter-btn");

    if (!container) return;

    container.innerHTML = '<p class="bible-loading">Loading...</p>';
    currentBook = book;
    currentChapter = chapter;

    const bookName = book.replace(/\+/g, " ");

    // Try multiple APIs as fallbacks
    const apis = [
        {
            name: "bible-api",
            url: `https://bible-api.com/${encodeURIComponent(bookName + " " + chapter)}?translation=kjv`,
            parse: (data) => {
                if (data.error) throw new Error(data.error);
                if (data.verses && data.verses.length > 0) {
                    return data.verses.map(v =>
                        `<span class="verse-num">${v.verse}</span>${v.text}`
                    ).join(" ");
                }
                return data.text || "";
            }
        },
        {
            name: "bible-go",
            url: `https://bible-go-api.rkeplin.com/v1/books/${encodeURIComponent(bookName)}/chapters/${chapter}?translation=kjv`,
            parse: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map(v =>
                        `<span class="verse-num">${v.verseId}</span>${v.verse}`
                    ).join(" ");
                }
                throw new Error("No verses found");
            }
        }
    ];

    for (const api of apis) {
        try {
            console.log(`Trying ${api.name}...`);
            const response = await fetch(api.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.log(`${api.name} failed with status ${response.status}`);
                continue;
            }

            const data = await response.json();
            const formattedText = api.parse(data);

            if (formattedText) {
                container.innerHTML = `
                    <h4 class="chapter-title">${bookName} ${chapter}</h4>
                    <div class="bible-text">${formattedText}</div>
                `;

                if (prevBtn) prevBtn.disabled = chapter <= 1;
                if (nextBtn) nextBtn.disabled = false;
                return; // Success!
            }
        } catch (error) {
            console.log(`${api.name} error:`, error.message);
            continue;
        }
    }

    // All APIs failed - show embedded reader as fallback
    console.error("All Bible APIs failed");
    const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(bookName + " " + chapter)}&version=KJV&interface=print`;
    container.innerHTML = `
        <p class="bible-error">Unable to load from API.</p>
        <p class="bible-fallback" style="margin-bottom: 1rem;">
            <a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(bookName + " " + chapter)}&version=KJV" target="_blank" style="color: var(--primary);">
                📖 Open ${bookName} ${chapter} on BibleGateway
            </a>
        </p>
    `;
}

// Add Bible reader setup to initialization
const originalSetupEventListeners = setupEventListeners;
setupEventListeners = function() {
    originalSetupEventListeners();
    setupBibleReader();
};
