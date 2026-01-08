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
// MOTIVATIONAL QUOTES
// ==========================================
const MOTIVATIONAL_QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Hard times create strong men. Strong men create good times.", author: "G. Michael Hopf" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "A warrior is not about perfection. It's about absolute vulnerability.", author: "Unknown" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
    { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Winners are not people who never fail, but people who never quit.", author: "Unknown" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Unknown" },
    { text: "Little things make big days.", author: "Unknown" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "The only person you should try to be better than is the person you were yesterday.", author: "Unknown" },
    { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
    { text: "A man who conquers himself is greater than one who conquers a thousand men in battle.", author: "Buddha" },
];

// ==========================================
// LOGIC PUZZLE GAME SYSTEM
// ==========================================

// Sequence Pattern Puzzles - Find the next number/symbol
const SEQUENCE_PUZZLES = [
    { sequence: [2, 6, 18, 54, "?"], answer: 162, options: [108, 162, 148, 216], explanation: "×3 each time" },
    { sequence: [1, 1, 2, 3, 5, 8, "?"], answer: 13, options: [11, 12, 13, 15], explanation: "Fibonacci: add previous two" },
    { sequence: [3, 6, 11, 18, 27, "?"], answer: 38, options: [36, 38, 40, 42], explanation: "+3, +5, +7, +9, +11" },
    { sequence: [1, 4, 9, 16, 25, "?"], answer: 36, options: [30, 34, 36, 49], explanation: "Perfect squares: 1², 2², 3²..." },
    { sequence: [2, 3, 5, 7, 11, "?"], answer: 13, options: [12, 13, 14, 15], explanation: "Prime numbers" },
    { sequence: [1, 8, 27, 64, "?"], answer: 125, options: [100, 125, 128, 216], explanation: "Perfect cubes: 1³, 2³, 3³..." },
    { sequence: [99, 92, 86, 81, 77, "?"], answer: 74, options: [72, 73, 74, 75], explanation: "-7, -6, -5, -4, -3" },
    { sequence: [2, 5, 11, 23, 47, "?"], answer: 95, options: [71, 83, 95, 99], explanation: "×2 + 1 each time" },
    { sequence: [1, 2, 6, 24, 120, "?"], answer: 720, options: [480, 600, 720, 840], explanation: "Factorials: 1!, 2!, 3!, 4!, 5!, 6!" },
    { sequence: [256, 128, 64, 32, "?"], answer: 16, options: [8, 12, 16, 24], explanation: "÷2 each time" },
];

// Matrix/Pattern Reasoning Puzzles
const MATRIX_PUZZLES = [
    {
        grid: ["◯", "◯", "●", "◯", "●", "●", "●", "●", "?"],
        answer: "◯",
        options: ["◯", "●", "◐", "◑"],
        explanation: "Each row has increasing filled circles"
    },
    {
        grid: ["→", "↓", "←", "↓", "←", "↑", "←", "↑", "?"],
        answer: "→",
        options: ["→", "↓", "←", "↑"],
        explanation: "Arrows rotate 90° clockwise in each row"
    },
    {
        grid: ["1", "2", "3", "4", "5", "6", "7", "8", "?"],
        answer: "9",
        options: ["0", "9", "10", "1"],
        explanation: "Simple counting sequence"
    },
    {
        grid: ["△", "▢", "◯", "▢", "◯", "△", "◯", "△", "?"],
        answer: "▢",
        options: ["△", "▢", "◯", "◇"],
        explanation: "Each shape appears once per row"
    },
    {
        grid: ["A", "C", "E", "G", "I", "K", "M", "O", "?"],
        answer: "Q",
        options: ["P", "Q", "R", "S"],
        explanation: "Every other letter (odd positions)"
    },
];

// Logic Word Problems (College-level)
const LOGIC_PROBLEMS = [
    {
        problem: "If all Bloops are Razzies, and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
        answer: "True",
        options: ["True", "False", "Cannot determine", "Sometimes"],
        explanation: "Transitive property: A⊂B and B⊂C means A⊂C"
    },
    {
        problem: "A bat and ball cost $1.10. The bat costs $1.00 more than the ball. How much does the ball cost?",
        answer: "$0.05",
        options: ["$0.10", "$0.05", "$0.15", "$0.01"],
        explanation: "Ball = x, Bat = x + 1.00. x + (x + 1.00) = 1.10, so x = 0.05"
    },
    {
        problem: "In a race, you pass the person in 2nd place. What position are you in now?",
        answer: "2nd",
        options: ["1st", "2nd", "3rd", "Cannot tell"],
        explanation: "You take their position, not surpass to 1st"
    },
    {
        problem: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        answer: "5 minutes",
        options: ["1 minute", "5 minutes", "20 minutes", "100 minutes"],
        explanation: "Each machine makes 1 widget in 5 min, regardless of count"
    },
    {
        problem: "There's a lily pad in a lake. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take to cover half of it?",
        answer: "47 days",
        options: ["24 days", "47 days", "46 days", "12 days"],
        explanation: "If it doubles to full on day 48, it was half on day 47"
    },
    {
        problem: "A farmer has 17 sheep. All but 9 die. How many are left?",
        answer: "9",
        options: ["8", "9", "17", "0"],
        explanation: "'All but 9' means 9 remain alive"
    },
    {
        problem: "You have 12 balls. One is heavier. Using a balance scale, what's the minimum weighings needed to find it?",
        answer: "3",
        options: ["2", "3", "4", "6"],
        explanation: "Divide into thirds each time: 12→4→2→1 (log₃12 ≈ 3)"
    },
    {
        problem: "A is B's brother. B is C's sister. C is D's father. How is A related to D?",
        answer: "Uncle",
        options: ["Father", "Uncle", "Grandfather", "Cousin"],
        explanation: "A is sibling to B, B is sibling to C (D's father), so A is D's uncle"
    },
];

// Spatial Reasoning Puzzles
const SPATIAL_PUZZLES = [
    {
        problem: "If you fold a paper in half 3 times, then punch 1 hole through all layers, how many holes when unfolded?",
        answer: "8",
        options: ["3", "6", "8", "16"],
        explanation: "2³ = 8 layers, so 8 holes"
    },
    {
        problem: "A cube has 6 faces painted red. If cut into 27 smaller cubes, how many small cubes have exactly 1 red face?",
        answer: "6",
        options: ["6", "8", "12", "1"],
        explanation: "Only the center of each face (6 faces × 1 center each)"
    },
    {
        problem: "How many squares are on a standard 8×8 chessboard? (Count all sizes)",
        answer: "204",
        options: ["64", "204", "128", "256"],
        explanation: "1² + 2² + ... + 8² = 204 (sum of squares)"
    },
    {
        problem: "A clock shows 3:15. What is the angle between the hour and minute hands?",
        answer: "7.5°",
        options: ["0°", "7.5°", "15°", "90°"],
        explanation: "Hour hand moves 0.5° per minute; at 3:15 it's at 97.5°, minute at 90°"
    },
    {
        problem: "You're facing North. You turn left, then do an about-face, then turn right. Which direction are you facing?",
        answer: "North",
        options: ["North", "South", "East", "West"],
        explanation: "N → left → W → about-face → E → right → N"
    },
];

// Combine all puzzle types
const ALL_LOGIC_PUZZLES = {
    sequence: SEQUENCE_PUZZLES,
    matrix: MATRIX_PUZZLES,
    logic: LOGIC_PROBLEMS,
    spatial: SPATIAL_PUZZLES
};

// ==========================================
// WARRIOR PATH MESSAGES
// ==========================================
const PATH_MESSAGES = [
    "Stay on the hard path. Every day you resist, you become stronger.",
    "Your discipline today shapes your character tomorrow.",
    "Champions are made when no one is watching.",
    "The battle is won in the moments of decision.",
    "Every temptation resisted is a victory earned.",
    "Your struggle today is building your strength for tomorrow.",
    "Real warriors fight battles no one else can see.",
    "The path to greatness is paved with daily discipline.",
    "You are not fighting alone. Keep pressing forward.",
    "Each day of purity is a step toward freedom.",
    "Your future self will thank you for your choices today.",
    "Strength doesn't come from what you can do, but from overcoming what you thought you couldn't.",
    "The fire that forges you is the same fire that purifies you.",
    "Victory belongs to those who refuse to give up.",
    "Today's discipline is tomorrow's freedom.",
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

    // Daily puzzle
    puzzleSolvedToday: false,
    lastPuzzleTime: 0,
    lastPuzzleAttempts: 0,
    lastPuzzleXP: 0,

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
        // Streak = consecutive days with at least 1 quest logged
        if (lastDate) {
            const daysDiff = getDaysDifference(lastDate, today);
            const hadQuestYesterday = state.questHistory[lastDate] &&
                Object.keys(state.questHistory[lastDate]).length > 0;

            if (daysDiff > 1 || !hadQuestYesterday) {
                // Missed a day or didn't log any quests yesterday - reset streak
                state.currentStreak = 0;
            }
        }

        // Reset daily tracking
        state.todayQuests = {};
        state.todayXP = 0;
        state.devotionalReadToday = false;
        state.morningPureToday = false;
        state.eveningPureToday = false;
        state.puzzleSolvedToday = false;
        state.lastPuzzleTime = 0;
        state.lastPuzzleAttempts = 0;
        state.lastPuzzleXP = 0;
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
    state.totalQuestsCompleted = Math.max(0, state.totalQuestsCompleted - 1);

    const today = getDateString();
    if (state.questHistory[today]) {
        delete state.questHistory[today][questId];
    }

    // If this was the only quest today, decrement streak
    const completedToday = Object.keys(state.todayQuests).length;
    if (completedToday === 0) {
        state.currentStreak = Math.max(0, state.currentStreak - 1);
    }

    removeXP(quest.xp);
    showToast(`-${quest.xp} XP: ${quest.name} removed`, "info");
    saveState();
    updateAllDisplays();
}

function toggleQuest(questId) {
    // Toggle: if completed, uncomplete it (remove XP). If not completed, complete it.
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

    // Streak increments when FIRST quest of the day is logged
    // Additional quests just add XP, not days
    if (completedToday === 1) {
        // This is the first quest of the day - increment streak!
        state.currentStreak++;
        if (state.currentStreak > state.bestStreak) {
            state.bestStreak = state.currentStreak;
        }
        showToast(`Day ${state.currentStreak} streak!`, "success");
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
    updateHomePageContent();
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

    // Hero section - Level number and title
    const heroLevel = document.getElementById("hero-level");
    const heroTitle = document.getElementById("hero-title");

    if (heroLevel) heroLevel.textContent = levelInfo.level;
    if (heroTitle) heroTitle.textContent = levelInfo.title;

    // Home page level ring progress
    const homeLevelRing = document.getElementById("home-level-ring");
    if (homeLevelRing) {
        const circumference = 2 * Math.PI * 52; // r=52
        const offset = circumference - (progress.percent / 100) * circumference;
        homeLevelRing.style.strokeDasharray = circumference;
        homeLevelRing.style.strokeDashoffset = offset;
        homeLevelRing.style.stroke = "var(--primary)";
    }

    // Home XP bar
    const homeXpFill = document.getElementById("home-xp-fill");
    if (homeXpFill) homeXpFill.style.width = `${progress.percent}%`;

    // Home XP text
    const homeXpText = document.getElementById("home-xp-text");
    if (homeXpText) homeXpText.textContent = `${progress.xpIntoLevel} / ${progress.xpNeeded} XP`;

    // Old elements (for other pages)
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

// ==========================================
// HOME PAGE CONTENT (Verse, Quote, Puzzle, Path)
// ==========================================
function updateHomePageContent() {
    const dayOfYear = getDayOfYear();

    // Verse of the Day (from devotionals)
    const devo = getTodayDevotional();
    const verseText = document.getElementById("daily-verse-text");
    const verseRef = document.getElementById("daily-verse-ref");
    if (verseText) verseText.textContent = `"${devo.verse}"`;
    if (verseRef) verseRef.textContent = `- ${devo.ref}`;

    // Motivational Quote (rotates daily)
    const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
    const quote = MOTIVATIONAL_QUOTES[quoteIndex];
    const motivationText = document.getElementById("daily-motivation");
    const motivationAuthor = document.getElementById("motivation-author");
    if (motivationText) motivationText.textContent = `"${quote.text}"`;
    if (motivationAuthor) motivationAuthor.textContent = `- ${quote.author}`;

    // Daily Logic Puzzle (interactive game)
    renderDailyPuzzle();

    // Warrior's Path Message (rotates daily)
    const pathIndex = dayOfYear % PATH_MESSAGES.length;
    const pathMessage = document.getElementById("path-message");
    if (pathMessage) pathMessage.textContent = PATH_MESSAGES[pathIndex];
}

// ==========================================
// LOGIC PUZZLE GAME - Interactive UI
// ==========================================
let currentPuzzle = null;
let puzzleAttempts = 0;
let puzzleTimer = null;
let puzzleStartTime = null;

function getTodaysPuzzle() {
    const dayOfYear = getDayOfYear();
    const puzzleTypes = ['sequence', 'matrix', 'logic', 'spatial'];
    const typeIndex = dayOfYear % puzzleTypes.length;
    const type = puzzleTypes[typeIndex];
    const puzzles = ALL_LOGIC_PUZZLES[type];
    const puzzleIndex = Math.floor(dayOfYear / puzzleTypes.length) % puzzles.length;

    return { type, puzzle: puzzles[puzzleIndex] };
}

function renderDailyPuzzle() {
    const container = document.getElementById("puzzle-card");
    if (!container) return;

    const { type, puzzle } = getTodaysPuzzle();
    currentPuzzle = { type, ...puzzle };

    // If already solved today
    if (state.puzzleSolvedToday) {
        renderSolvedPuzzle(container, puzzle, type);
        return;
    }

    puzzleAttempts = 0;
    puzzleStartTime = Date.now();

    // Render based on puzzle type
    let puzzleContent = '';

    if (type === 'sequence') {
        puzzleContent = renderSequencePuzzle(puzzle);
    } else if (type === 'matrix') {
        puzzleContent = renderMatrixPuzzle(puzzle);
    } else if (type === 'logic' || type === 'spatial') {
        puzzleContent = renderLogicPuzzle(puzzle);
    }

    container.innerHTML = `
        <div class="daily-card-header">
            <span class="daily-card-icon">🧠</span>
            <span class="daily-card-title">${getPuzzleTypeName(type)}</span>
            <span class="puzzle-badge" id="puzzle-badge">+15 XP</span>
        </div>
        <div class="puzzle-timer" id="puzzle-timer">⏱️ 0:00</div>
        ${puzzleContent}
        <div class="puzzle-options" id="puzzle-options"></div>
        <div class="puzzle-result hidden" id="puzzle-result"></div>
        <div class="puzzle-attempts" id="puzzle-attempts"></div>
    `;

    // Render options
    renderPuzzleOptions(puzzle);

    // Start timer
    startPuzzleTimer();
}

function getPuzzleTypeName(type) {
    const names = {
        sequence: 'Number Sequence',
        matrix: 'Pattern Matrix',
        logic: 'Logic Problem',
        spatial: 'Spatial Reasoning'
    };
    return names[type] || 'Brain Challenge';
}

function renderSequencePuzzle(puzzle) {
    return `
        <div class="sequence-display">
            ${puzzle.sequence.map((num, i) => `
                <span class="sequence-item ${num === '?' ? 'sequence-unknown' : ''}">${num}</span>
            `).join('<span class="sequence-arrow">→</span>')}
        </div>
        <p class="puzzle-instruction">What comes next in the sequence?</p>
    `;
}

function renderMatrixPuzzle(puzzle) {
    return `
        <div class="matrix-grid">
            ${puzzle.grid.map((cell, i) => `
                <div class="matrix-cell ${cell === '?' ? 'matrix-unknown' : ''}">${cell}</div>
            `).join('')}
        </div>
        <p class="puzzle-instruction">What replaces the question mark?</p>
    `;
}

function renderLogicPuzzle(puzzle) {
    return `
        <div class="logic-problem">
            <p class="problem-text">${puzzle.problem}</p>
        </div>
    `;
}

function renderPuzzleOptions(puzzle) {
    const optionsEl = document.getElementById("puzzle-options");
    if (!optionsEl) return;

    // Shuffle options
    const shuffledOptions = [...puzzle.options].sort(() => Math.random() - 0.5);

    optionsEl.innerHTML = shuffledOptions.map(option => `
        <button class="puzzle-option" onclick="checkLogicAnswer('${String(option).replace(/'/g, "\\'")}')">
            ${option}
        </button>
    `).join("");
}

function renderSolvedPuzzle(container, puzzle, type) {
    const timeSpent = state.lastPuzzleTime || 0;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    container.innerHTML = `
        <div class="daily-card-header">
            <span class="daily-card-icon">✅</span>
            <span class="daily-card-title">${getPuzzleTypeName(type)}</span>
            <span class="puzzle-badge solved">Solved!</span>
        </div>
        <div class="puzzle-solved-content">
            <div class="solved-stats">
                <div class="solved-stat">
                    <span class="solved-stat-value">${state.lastPuzzleAttempts || 1}</span>
                    <span class="solved-stat-label">Attempts</span>
                </div>
                <div class="solved-stat">
                    <span class="solved-stat-value">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                    <span class="solved-stat-label">Time</span>
                </div>
                <div class="solved-stat">
                    <span class="solved-stat-value">+${state.lastPuzzleXP || 15}</span>
                    <span class="solved-stat-label">XP</span>
                </div>
            </div>
            <div class="puzzle-explanation">
                <strong>Answer:</strong> ${puzzle.answer}<br>
                <strong>Explanation:</strong> ${puzzle.explanation}
            </div>
        </div>
    `;
    container.classList.add("solved");
}

function startPuzzleTimer() {
    if (puzzleTimer) clearInterval(puzzleTimer);

    const timerEl = document.getElementById("puzzle-timer");
    if (!timerEl) return;

    puzzleTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - puzzleStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerEl.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function checkLogicAnswer(selected) {
    if (state.puzzleSolvedToday) return;

    const resultEl = document.getElementById("puzzle-result");
    const optionsEl = document.getElementById("puzzle-options");
    const attemptsEl = document.getElementById("puzzle-attempts");
    const puzzleCard = document.getElementById("puzzle-card");

    puzzleAttempts++;
    const correct = String(currentPuzzle.answer);

    if (selected === correct) {
        // Stop timer
        if (puzzleTimer) clearInterval(puzzleTimer);
        const timeSpent = Math.floor((Date.now() - puzzleStartTime) / 1000);

        // Calculate XP based on attempts and time
        let xpEarned = 15;
        if (puzzleAttempts === 1) xpEarned = 25; // Perfect bonus
        else if (puzzleAttempts === 2) xpEarned = 20;
        else if (puzzleAttempts > 3) xpEarned = 10;

        // Time bonus (under 30 seconds)
        if (timeSpent < 30 && puzzleAttempts === 1) xpEarned += 5;

        state.puzzleSolvedToday = true;
        state.lastPuzzleTime = timeSpent;
        state.lastPuzzleAttempts = puzzleAttempts;
        state.lastPuzzleXP = xpEarned;

        // Show success animation
        resultEl.innerHTML = `
            <div class="puzzle-success">
                <span class="success-icon">🎉</span>
                <span class="success-text">Correct!</span>
                <span class="success-xp">+${xpEarned} XP</span>
            </div>
        `;
        resultEl.classList.remove("hidden");

        // Disable all options and highlight correct
        const buttons = optionsEl.querySelectorAll(".puzzle-option");
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent.trim() === correct) {
                btn.classList.add("correct");
            }
        });

        if (puzzleCard) puzzleCard.classList.add("solved");

        addXP(xpEarned, "Logic puzzle solved!");
        saveState();

        // Show explanation after delay
        setTimeout(() => {
            renderDailyPuzzle();
        }, 2000);
    } else {
        // Wrong answer
        resultEl.innerHTML = `<span class="puzzle-wrong">Not quite. Think again!</span>`;
        resultEl.classList.remove("hidden");

        // Update attempts display
        if (attemptsEl) {
            attemptsEl.textContent = `Attempts: ${puzzleAttempts}`;
        }

        // Disable wrong option
        const buttons = optionsEl.querySelectorAll(".puzzle-option");
        buttons.forEach(btn => {
            if (btn.textContent.trim() === selected) {
                btn.classList.add("wrong");
                btn.disabled = true;
            }
        });

        // Hint after 3 wrong attempts
        if (puzzleAttempts >= 3) {
            resultEl.innerHTML += `<div class="puzzle-hint">💡 Hint: ${currentPuzzle.explanation.split(':')[0]}...</div>`;
        }
    }
}

// Make puzzle function globally accessible
window.checkLogicAnswer = checkLogicAnswer;

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
        return `
            <div class="achievement ${unlocked ? "unlocked" : ""}" data-id="${ach.id}">
                <span class="achievement-icon">${ach.icon}</span>
                <span class="achievement-name">${ach.name}</span>
                <span class="achievement-desc">${ach.desc}</span>
            </div>
        `;
    }).join("");
}

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
