// ==========================================
// Life Mastery Tracker - Application Logic
// ==========================================

// ==========================================
// Data Management
// ==========================================
const StorageKeys = {
    HABITS: 'lifeMastery_habits',
    GOALS: 'lifeMastery_goals',
    JOURNAL: 'lifeMastery_journal',
    PURITY: 'lifeMastery_purity',
    WHYS: 'lifeMastery_whys',
    PRAYERS: 'lifeMastery_prayers',
    CHECKLIST: 'lifeMastery_checklist',
    BIBLE: 'lifeMastery_bible',
    STATS: 'lifeMastery_stats',
    HABITS_LOG: 'lifeMastery_habitsLog'
};

// Default habits based on user's goals
const defaultHabits = [
    { id: 1, name: 'Read Bible', icon: '📖', category: 'spiritual', streak: 0, completedToday: false },
    { id: 2, name: 'Workout', icon: '🏋️', category: 'health', streak: 0, completedToday: false },
    { id: 3, name: 'Apply to Jobs', icon: '💼', category: 'career', streak: 0, completedToday: false },
    { id: 4, name: 'Work on Skills', icon: '💻', category: 'growth', streak: 0, completedToday: false },
    { id: 5, name: 'Business Work', icon: '💰', category: 'business', streak: 0, completedToday: false },
    { id: 6, name: 'Eat Healthy', icon: '🥗', category: 'health', streak: 0, completedToday: false },
    { id: 7, name: 'No PMO', icon: '🛡️', category: 'purity', streak: 0, completedToday: false },
    { id: 8, name: 'Prayer Time', icon: '🙏', category: 'spiritual', streak: 0, completedToday: false }
];

// Default goals
const defaultGoals = [
    { id: 1, title: 'Grow in Faith', icon: '✝️', category: 'Spiritual', target: 365, current: 0, description: 'Daily Bible reading and prayer' },
    { id: 2, title: 'Get Fit', icon: '💪', category: 'Health', target: 100, current: 0, description: 'Complete 100 workouts' },
    { id: 3, title: 'Land a Job', icon: '💼', category: 'Career', target: 50, current: 0, description: 'Apply to 50 jobs' },
    { id: 4, title: 'Master Skills', icon: '🎯', category: 'Growth', target: 200, current: 0, description: '200 hours of skill development' },
    { id: 5, title: 'Build Business', icon: '🚀', category: 'Business', target: 100, current: 0, description: '100 days of business work' },
    { id: 6, title: 'Conquer Lust', icon: '🛡️', category: 'Purity', target: 90, current: 0, description: '90 days of purity' }
];

// Motivational quotes
const quotes = [
    '"I can do all things through Christ who strengthens me." - Philippians 4:13',
    '"The only way to do great work is to love what you do." - Steve Jobs',
    '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
    '"Be strong and courageous. Do not be afraid; do not be discouraged." - Joshua 1:9',
    '"The man who moves a mountain begins by carrying away small stones." - Confucius',
    '"Your body is a temple of the Holy Spirit." - 1 Corinthians 6:19',
    '"Discipline is the bridge between goals and accomplishment." - Jim Rohn',
    '"Watch and pray so that you will not fall into temptation." - Matthew 26:41',
    '"The pain you feel today will be the strength you feel tomorrow."',
    '"Every moment is a fresh beginning." - T.S. Eliot'
];

// Scripture verses for strength
const scriptures = [
    { text: "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.", reference: "1 Corinthians 10:13" },
    { text: "Submit yourselves, then, to God. Resist the devil, and he will flee from you.", reference: "James 4:7" },
    { text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.", reference: "Psalm 51:10" },
    { text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.", reference: "Galatians 5:22-23" },
    { text: "Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour.", reference: "1 Peter 5:8" },
    { text: "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.", reference: "Philippians 4:8" },
    { text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.", reference: "Psalm 28:7" },
    { text: "Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life.", reference: "James 1:12" },
    { text: "For physical training is of some value, but godliness has value for all things.", reference: "1 Timothy 4:8" },
    { text: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3" }
];

// Memory verses for temptation
const memoryVerses = [
    { text: "Flee from sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body.", reference: "1 Corinthians 6:18" },
    { text: "How can a young person stay on the path of purity? By living according to your word.", reference: "Psalm 119:9" },
    { text: "Put to death, therefore, whatever belongs to your earthly nature: sexual immorality, impurity, lust, evil desires and greed, which is idolatry.", reference: "Colossians 3:5" },
    { text: "Do you not know that your bodies are temples of the Holy Spirit?", reference: "1 Corinthians 6:19" },
    { text: "But I tell you that anyone who looks at a woman lustfully has already committed adultery with her in his heart.", reference: "Matthew 5:28" },
    { text: "So whether you eat or drink or whatever you do, do it all for the glory of God.", reference: "1 Corinthians 10:31" }
];

// Purity messages based on days
const purityMessages = {
    0: "Every journey begins with a single step. Today is day one. You've got this!",
    1: "One day clean! The first step is often the hardest. Keep going!",
    3: "Three days strong! Your brain is starting to rewire. Stay vigilant!",
    7: "One week! This is a major milestone. You're building new habits!",
    14: "Two weeks! You're breaking free from old patterns. God is with you!",
    21: "21 days - they say this is how long it takes to form a habit. Keep building!",
    30: "ONE MONTH! This is incredible progress. You are a warrior!",
    60: "60 days of freedom! Your mind is clearer, your spirit stronger!",
    90: "90 DAYS! You've reached a major milestone. You are living proof of God's power!",
    180: "6 MONTHS! You are an inspiration. True freedom is possible!",
    365: "ONE YEAR! You have overcome. Share your testimony and help others!"
};

// ==========================================
// State Management
// ==========================================
let state = {
    habits: [],
    goals: [],
    journal: [],
    purity: { startDate: null, bestStreak: 0, temptationsResisted: 0, totalCleanDays: 0 },
    whys: [],
    prayers: [],
    checklist: {},
    bible: { book: 'genesis', chapter: 1, daysRead: 0, streak: 0 },
    habitsLog: {},
    currentPage: 'dashboard'
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeUI();
    setupEventListeners();
    updateDashboard();
    setDailyQuote();
    setDailyScripture();
    checkAndResetDaily();
});

function loadState() {
    // Load habits
    const savedHabits = localStorage.getItem(StorageKeys.HABITS);
    state.habits = savedHabits ? JSON.parse(savedHabits) : [...defaultHabits];

    // Load goals
    const savedGoals = localStorage.getItem(StorageKeys.GOALS);
    state.goals = savedGoals ? JSON.parse(savedGoals) : [...defaultGoals];

    // Load journal
    const savedJournal = localStorage.getItem(StorageKeys.JOURNAL);
    state.journal = savedJournal ? JSON.parse(savedJournal) : [];

    // Load purity data
    const savedPurity = localStorage.getItem(StorageKeys.PURITY);
    state.purity = savedPurity ? JSON.parse(savedPurity) : { startDate: null, bestStreak: 0, temptationsResisted: 0, totalCleanDays: 0 };

    // Load whys
    const savedWhys = localStorage.getItem(StorageKeys.WHYS);
    state.whys = savedWhys ? JSON.parse(savedWhys) : [
        "I want to honor God with my body",
        "I want to be free from shame and guilt",
        "I want to have healthy relationships",
        "I want mental clarity and focus"
    ];

    // Load prayers
    const savedPrayers = localStorage.getItem(StorageKeys.PRAYERS);
    state.prayers = savedPrayers ? JSON.parse(savedPrayers) : [];

    // Load checklist
    const savedChecklist = localStorage.getItem(StorageKeys.CHECKLIST);
    state.checklist = savedChecklist ? JSON.parse(savedChecklist) : {};

    // Load bible progress
    const savedBible = localStorage.getItem(StorageKeys.BIBLE);
    state.bible = savedBible ? JSON.parse(savedBible) : { book: 'genesis', chapter: 1, daysRead: 0, streak: 0 };

    // Load habits log
    const savedHabitsLog = localStorage.getItem(StorageKeys.HABITS_LOG);
    state.habitsLog = savedHabitsLog ? JSON.parse(savedHabitsLog) : {};
}

function saveState() {
    localStorage.setItem(StorageKeys.HABITS, JSON.stringify(state.habits));
    localStorage.setItem(StorageKeys.GOALS, JSON.stringify(state.goals));
    localStorage.setItem(StorageKeys.JOURNAL, JSON.stringify(state.journal));
    localStorage.setItem(StorageKeys.PURITY, JSON.stringify(state.purity));
    localStorage.setItem(StorageKeys.WHYS, JSON.stringify(state.whys));
    localStorage.setItem(StorageKeys.PRAYERS, JSON.stringify(state.prayers));
    localStorage.setItem(StorageKeys.CHECKLIST, JSON.stringify(state.checklist));
    localStorage.setItem(StorageKeys.BIBLE, JSON.stringify(state.bible));
    localStorage.setItem(StorageKeys.HABITS_LOG, JSON.stringify(state.habitsLog));
}

function checkAndResetDaily() {
    const today = getDateString();
    const lastDate = localStorage.getItem('lifeMastery_lastDate');

    if (lastDate !== today) {
        // Reset daily habit completions
        state.habits.forEach(habit => {
            habit.completedToday = false;
        });

        // Check for broken streaks
        if (lastDate) {
            const lastDateObj = new Date(lastDate);
            const todayObj = new Date(today);
            const diffDays = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                // Missed days - reset streaks for incomplete habits
                state.habits.forEach(habit => {
                    if (!state.habitsLog[lastDate]?.[habit.id]) {
                        habit.streak = 0;
                    }
                });
            }
        }

        localStorage.setItem('lifeMastery_lastDate', today);
        saveState();
    }
}

// ==========================================
// UI Initialization
// ==========================================
function initializeUI() {
    updateDate();
    renderHabits();
    renderGoals();
    renderPurityStats();
    renderWhyList();
    renderPrayers();
    renderMemoryVerses();
    renderPastEntries();
    renderStatistics();
    loadChecklist();
    loadBibleProgress();
}

function updateDate() {
    const dateEl = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

function setDailyQuote() {
    const quoteEl = document.getElementById('daily-quote');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = randomQuote;
}

function setDailyScripture() {
    const scriptureEl = document.getElementById('daily-scripture');
    const randomVerse = scriptures[Math.floor(Math.random() * scriptures.length)];
    scriptureEl.querySelector('.verse-text').textContent = `"${randomVerse.text}"`;
    scriptureEl.querySelector('.verse-reference').textContent = `- ${randomVerse.reference}`;
}

// ==========================================
// Navigation
// ==========================================
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => handleNavigation(item));
    });

    // Modal
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    // Dashboard quick actions
    document.getElementById('log-workout-btn').addEventListener('click', () => toggleHabitByName('Workout'));
    document.getElementById('log-bible-btn').addEventListener('click', () => toggleHabitByName('Read Bible'));
    document.getElementById('log-job-btn').addEventListener('click', () => toggleHabitByName('Apply to Jobs'));
    document.getElementById('log-skill-btn').addEventListener('click', () => toggleHabitByName('Work on Skills'));
    document.getElementById('log-healthy-btn').addEventListener('click', () => toggleHabitByName('Eat Healthy'));
    document.getElementById('log-business-btn').addEventListener('click', () => toggleHabitByName('Business Work'));

    // Scripture
    document.getElementById('new-scripture-btn').addEventListener('click', setDailyScripture);

    // Purity
    document.getElementById('reset-purity-btn').addEventListener('click', resetPurityStreak);

    // Emergency button
    document.getElementById('emergency-btn').addEventListener('click', showEmergencyContent);
    document.getElementById('i-resisted-btn').addEventListener('click', recordResistance);

    // Why list
    document.getElementById('add-why-btn').addEventListener('click', addWhy);
    document.getElementById('new-why-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addWhy();
    });

    // Goals
    document.getElementById('add-goal-btn').addEventListener('click', showAddGoalModal);

    // Habits
    document.getElementById('add-habit-btn').addEventListener('click', showAddHabitModal);

    // Journal
    document.getElementById('save-journal-btn').addEventListener('click', saveJournalEntry);

    // Prayers
    document.getElementById('add-prayer-btn').addEventListener('click', addPrayer);
    document.getElementById('new-prayer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPrayer();
    });

    // Bible reading
    document.getElementById('save-reading-btn').addEventListener('click', saveBibleProgress);

    // Checklist
    document.getElementById('save-checklist-btn').addEventListener('click', saveChecklist);
}

function handleNavigation(item) {
    const page = item.dataset.page;

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Update page title
    document.getElementById('page-title').textContent = item.querySelector('span:last-child').textContent;

    // Show correct page
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');

    state.currentPage = page;
}

// ==========================================
// Habits Management
// ==========================================
function renderHabits() {
    renderQuickHabits();
    renderFullHabitsList();
    renderStreaks();
}

function renderQuickHabits() {
    const container = document.getElementById('quick-habits-list');
    container.innerHTML = state.habits.map(habit => `
        <div class="habit-item ${habit.completedToday ? 'completed' : ''}" data-id="${habit.id}" onclick="toggleHabit(${habit.id})">
            <div class="habit-checkbox">${habit.completedToday ? '✓' : ''}</div>
            <span class="habit-name">${habit.icon} ${habit.name}</span>
            <span class="habit-streak">${habit.streak > 0 ? `🔥 ${habit.streak}` : ''}</span>
        </div>
    `).join('');
}

function renderFullHabitsList() {
    const container = document.getElementById('habits-list');
    container.innerHTML = state.habits.map(habit => `
        <div class="habit-card ${habit.completedToday ? 'completed' : ''}" data-id="${habit.id}">
            <div class="habit-checkbox" onclick="toggleHabit(${habit.id})">${habit.completedToday ? '✓' : ''}</div>
            <div class="habit-details">
                <h4>${habit.icon} ${habit.name}</h4>
                <p>Category: ${habit.category}</p>
            </div>
            <div class="habit-meta">
                <div class="habit-streak-display">🔥 ${habit.streak}</div>
                <span style="font-size: 0.75rem; color: var(--text-muted);">day streak</span>
            </div>
        </div>
    `).join('');
}

function renderStreaks() {
    const container = document.getElementById('streaks-display');
    const topHabits = [...state.habits].sort((a, b) => b.streak - a.streak).slice(0, 4);

    container.innerHTML = topHabits.map(habit => `
        <div class="streak-item">
            <div class="streak-value">${habit.streak}</div>
            <div class="streak-label">${habit.icon} ${habit.name}</div>
        </div>
    `).join('');
}

function toggleHabit(id) {
    const habit = state.habits.find(h => h.id === id);
    if (!habit) return;

    habit.completedToday = !habit.completedToday;

    if (habit.completedToday) {
        habit.streak++;
        // Log the completion
        const today = getDateString();
        if (!state.habitsLog[today]) state.habitsLog[today] = {};
        state.habitsLog[today][id] = true;

        // Update related goal
        updateGoalProgress(habit.category);
    } else {
        habit.streak = Math.max(0, habit.streak - 1);
        const today = getDateString();
        if (state.habitsLog[today]) {
            delete state.habitsLog[today][id];
        }
    }

    saveState();
    renderHabits();
    updateDashboard();
    updateQuickActionButtons();
}

function toggleHabitByName(name) {
    const habit = state.habits.find(h => h.name === name);
    if (habit) {
        toggleHabit(habit.id);
    }
}

function updateQuickActionButtons() {
    const habitMap = {
        'log-workout-btn': 'Workout',
        'log-bible-btn': 'Read Bible',
        'log-job-btn': 'Apply to Jobs',
        'log-skill-btn': 'Work on Skills',
        'log-healthy-btn': 'Eat Healthy',
        'log-business-btn': 'Business Work'
    };

    Object.entries(habitMap).forEach(([btnId, habitName]) => {
        const btn = document.getElementById(btnId);
        const habit = state.habits.find(h => h.name === habitName);
        if (habit && habit.completedToday) {
            btn.classList.add('done');
        } else {
            btn.classList.remove('done');
        }
    });
}

function showAddHabitModal() {
    openModal('Add New Habit', `
        <form id="add-habit-form">
            <div class="form-group">
                <label>Habit Name</label>
                <input type="text" id="habit-name" required placeholder="e.g., Morning Meditation">
            </div>
            <div class="form-group">
                <label>Icon (emoji)</label>
                <input type="text" id="habit-icon" required placeholder="e.g., 🧘">
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="habit-category">
                    <option value="spiritual">Spiritual</option>
                    <option value="health">Health</option>
                    <option value="career">Career</option>
                    <option value="growth">Growth</option>
                    <option value="business">Business</option>
                    <option value="purity">Purity</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Habit</button>
            </div>
        </form>
    `);

    document.getElementById('add-habit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newHabit = {
            id: Date.now(),
            name: document.getElementById('habit-name').value,
            icon: document.getElementById('habit-icon').value,
            category: document.getElementById('habit-category').value,
            streak: 0,
            completedToday: false
        };
        state.habits.push(newHabit);
        saveState();
        renderHabits();
        closeModal();
    });
}

// ==========================================
// Goals Management
// ==========================================
function renderGoals() {
    const container = document.getElementById('goals-container');
    container.innerHTML = state.goals.map(goal => {
        const progress = Math.min(100, (goal.current / goal.target) * 100);
        return `
            <div class="goal-card" data-id="${goal.id}">
                <div class="goal-header">
                    <div>
                        <div class="goal-icon">${goal.icon}</div>
                        <div class="goal-title">${goal.title}</div>
                        <div class="goal-category">${goal.category}</div>
                    </div>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">${goal.description}</p>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="goal-stats">
                        <span>${goal.current} / ${goal.target}</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-secondary" onclick="incrementGoal(${goal.id})">+1 Progress</button>
                </div>
            </div>
        `;
    }).join('');
}

function incrementGoal(id) {
    const goal = state.goals.find(g => g.id === id);
    if (goal && goal.current < goal.target) {
        goal.current++;
        saveState();
        renderGoals();
        updateDashboard();
    }
}

function updateGoalProgress(category) {
    const categoryGoalMap = {
        'spiritual': 'Grow in Faith',
        'health': 'Get Fit',
        'career': 'Land a Job',
        'growth': 'Master Skills',
        'business': 'Build Business',
        'purity': 'Conquer Lust'
    };

    const goalTitle = categoryGoalMap[category];
    if (goalTitle) {
        const goal = state.goals.find(g => g.title === goalTitle);
        if (goal && goal.current < goal.target) {
            goal.current++;
            saveState();
            renderGoals();
        }
    }
}

function showAddGoalModal() {
    openModal('Add New Goal', `
        <form id="add-goal-form">
            <div class="form-group">
                <label>Goal Title</label>
                <input type="text" id="goal-title" required placeholder="e.g., Learn Spanish">
            </div>
            <div class="form-group">
                <label>Icon (emoji)</label>
                <input type="text" id="goal-icon" required placeholder="e.g., 🇪🇸">
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" id="goal-category" required placeholder="e.g., Education">
            </div>
            <div class="form-group">
                <label>Target Number</label>
                <input type="number" id="goal-target" required min="1" placeholder="e.g., 100">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="goal-description" placeholder="What does achieving this goal look like?"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Goal</button>
            </div>
        </form>
    `);

    document.getElementById('add-goal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newGoal = {
            id: Date.now(),
            title: document.getElementById('goal-title').value,
            icon: document.getElementById('goal-icon').value,
            category: document.getElementById('goal-category').value,
            target: parseInt(document.getElementById('goal-target').value),
            current: 0,
            description: document.getElementById('goal-description').value
        };
        state.goals.push(newGoal);
        saveState();
        renderGoals();
        closeModal();
    });
}

// ==========================================
// Dashboard Updates
// ==========================================
function updateDashboard() {
    // Calculate today's progress
    const completedToday = state.habits.filter(h => h.completedToday).length;
    const totalHabits = state.habits.length;
    const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    // Update progress ring
    const progressRing = document.getElementById('main-progress-ring');
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (percentage / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;

    // Update percentage text
    document.getElementById('progress-percentage').textContent = `${percentage}%`;

    // Update total streak (average of all streaks)
    const totalStreak = state.habits.reduce((sum, h) => sum + h.streak, 0);
    const avgStreak = state.habits.length > 0 ? Math.round(totalStreak / state.habits.length) : 0;
    document.getElementById('total-streak').textContent = avgStreak;

    // Update purity display
    updatePurityDisplay();
    updateQuickActionButtons();
}

// ==========================================
// Purity Tracking
// ==========================================
function updatePurityDisplay() {
    const days = calculatePurityDays();
    document.getElementById('purity-days').textContent = days;

    // Update message
    const message = getPurityMessage(days);
    document.getElementById('purity-message').textContent = message;

    // Update purity goal
    const purityGoal = state.goals.find(g => g.title === 'Conquer Lust');
    if (purityGoal) {
        purityGoal.current = days;
        saveState();
        renderGoals();
    }
}

function calculatePurityDays() {
    if (!state.purity.startDate) return 0;
    const start = new Date(state.purity.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getPurityMessage(days) {
    const thresholds = [365, 180, 90, 60, 30, 21, 14, 7, 3, 1, 0];
    for (const threshold of thresholds) {
        if (days >= threshold) {
            return purityMessages[threshold];
        }
    }
    return purityMessages[0];
}

function resetPurityStreak() {
    if (confirm('Are you being honest with yourself? Remember, honesty is the foundation of recovery. Click OK to reset your streak.')) {
        const currentDays = calculatePurityDays();

        // Update best streak if current was better
        if (currentDays > state.purity.bestStreak) {
            state.purity.bestStreak = currentDays;
        }

        // Add to total clean days
        state.purity.totalCleanDays += currentDays;

        // Reset start date
        state.purity.startDate = new Date().toISOString();

        saveState();
        updatePurityDisplay();
        renderPurityStats();

        alert('Your streak has been reset. Today is a new day. God\'s mercies are new every morning!');
    }
}

function startPurityStreak() {
    state.purity.startDate = new Date().toISOString();
    saveState();
    updatePurityDisplay();
}

// Initialize purity streak if not started
if (!state.purity.startDate) {
    state.purity.startDate = new Date().toISOString();
    saveState();
}

function renderPurityStats() {
    document.getElementById('current-streak-stat').textContent = calculatePurityDays();
    document.getElementById('best-streak-stat').textContent = state.purity.bestStreak;
    document.getElementById('total-clean-days').textContent = state.purity.totalCleanDays + calculatePurityDays();
    document.getElementById('temptations-resisted').textContent = state.purity.temptationsResisted;
}

function showEmergencyContent() {
    const content = document.getElementById('emergency-content');
    content.classList.toggle('hidden');

    // Scroll to make sure it's visible
    content.scrollIntoView({ behavior: 'smooth' });
}

function recordResistance() {
    state.purity.temptationsResisted++;
    saveState();
    renderPurityStats();

    alert('PRAISE GOD! You resisted temptation! Your strength grows with each victory. Keep fighting the good fight!');

    document.getElementById('emergency-content').classList.add('hidden');
}

// ==========================================
// Why List (Reasons to Stay Pure)
// ==========================================
function renderWhyList() {
    const container = document.getElementById('why-list');
    container.innerHTML = state.whys.map((why, index) => `
        <div class="why-item">
            <span>✓</span>
            <span>${why}</span>
            <button class="btn btn-secondary" style="margin-left: auto; padding: 0.25rem 0.5rem;" onclick="removeWhy(${index})">×</button>
        </div>
    `).join('');
}

function addWhy() {
    const input = document.getElementById('new-why-input');
    const value = input.value.trim();

    if (value) {
        state.whys.push(value);
        saveState();
        renderWhyList();
        input.value = '';
    }
}

function removeWhy(index) {
    state.whys.splice(index, 1);
    saveState();
    renderWhyList();
}

// ==========================================
// Journal
// ==========================================
function saveJournalEntry() {
    const textarea = document.getElementById('journal-entry');
    const content = textarea.value.trim();

    if (!content) {
        alert('Please write something in your journal first.');
        return;
    }

    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        content: content
    };

    state.journal.unshift(entry);
    saveState();
    renderPastEntries();
    textarea.value = '';

    alert('Journal entry saved!');
}

function renderPastEntries() {
    const container = document.getElementById('past-entries');
    const entriesHtml = state.journal.slice(0, 10).map(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        const preview = entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '');

        return `
            <div class="entry-item" onclick="showFullEntry(${entry.id})">
                <div class="entry-date">${dateStr}</div>
                <div class="entry-preview">${preview}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `<h4>Past Entries</h4>${entriesHtml || '<p style="color: var(--text-muted);">No journal entries yet. Start writing!</p>'}`;
}

function showFullEntry(id) {
    const entry = state.journal.find(e => e.id === id);
    if (entry) {
        const date = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        openModal(`Journal Entry - ${date}`, `
            <div style="white-space: pre-wrap; line-height: 1.8; color: var(--text-secondary);">
                ${entry.content}
            </div>
            <div class="form-actions" style="margin-top: 1.5rem;">
                <button class="btn btn-danger" onclick="deleteEntry(${id})">Delete Entry</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        `);
    }
}

function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this journal entry?')) {
        state.journal = state.journal.filter(e => e.id !== id);
        saveState();
        renderPastEntries();
        closeModal();
    }
}

// ==========================================
// Prayer Requests
// ==========================================
function addPrayer() {
    const input = document.getElementById('new-prayer-input');
    const value = input.value.trim();

    if (value) {
        state.prayers.push({
            id: Date.now(),
            text: value,
            answered: false,
            date: new Date().toISOString()
        });
        saveState();
        renderPrayers();
        input.value = '';
    }
}

function renderPrayers() {
    const container = document.getElementById('prayer-list');
    container.innerHTML = state.prayers.map(prayer => `
        <div class="prayer-item ${prayer.answered ? 'answered' : ''}" onclick="togglePrayer(${prayer.id})">
            <span>${prayer.answered ? '✓' : '🙏'}</span>
            <span>${prayer.text}</span>
        </div>
    `).join('') || '<p style="color: var(--text-muted);">Add your prayer requests...</p>';
}

function togglePrayer(id) {
    const prayer = state.prayers.find(p => p.id === id);
    if (prayer) {
        prayer.answered = !prayer.answered;
        saveState();
        renderPrayers();
    }
}

// ==========================================
// Memory Verses
// ==========================================
function renderMemoryVerses() {
    const container = document.getElementById('memory-verses');
    container.innerHTML = memoryVerses.map(verse => `
        <div class="verse-card">
            <p>"${verse.text}"</p>
            <cite>- ${verse.reference}</cite>
        </div>
    `).join('');
}

// ==========================================
// Bible Reading Progress
// ==========================================
function saveBibleProgress() {
    state.bible.book = document.getElementById('current-book').value;
    state.bible.chapter = parseInt(document.getElementById('current-chapter').value);
    state.bible.daysRead++;
    state.bible.streak++;

    saveState();
    loadBibleProgress();

    // Also mark the Bible habit as complete
    toggleHabitByName('Read Bible');

    alert('Bible reading progress saved!');
}

function loadBibleProgress() {
    document.getElementById('current-book').value = state.bible.book;
    document.getElementById('current-chapter').value = state.bible.chapter;
    document.getElementById('bible-days').textContent = state.bible.daysRead;
    document.getElementById('bible-streak').textContent = state.bible.streak;
}

// ==========================================
// Checklist
// ==========================================
function saveChecklist() {
    const checkboxes = document.querySelectorAll('#protection-checklist input[type="checkbox"]');
    checkboxes.forEach(cb => {
        state.checklist[cb.id] = cb.checked;
    });
    saveState();
    alert('Protection checklist saved!');
}

function loadChecklist() {
    Object.entries(state.checklist).forEach(([id, checked]) => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = checked;
    });
}

// ==========================================
// Statistics
// ==========================================
function renderStatistics() {
    // Calculate stats
    const totalDays = Object.keys(state.habitsLog).length;
    const totalCompletions = Object.values(state.habitsLog).reduce((sum, day) => {
        return sum + Object.keys(day).length;
    }, 0);
    const avgCompletion = totalDays > 0 ? Math.round((totalCompletions / (totalDays * state.habits.length)) * 100) : 0;

    // Update overview stats
    document.getElementById('total-days-tracked').textContent = totalDays;
    document.getElementById('avg-completion').textContent = `${avgCompletion}%`;

    // Count specific achievements
    const workoutGoal = state.goals.find(g => g.title === 'Get Fit');
    const jobGoal = state.goals.find(g => g.title === 'Land a Job');
    document.getElementById('total-workouts').textContent = workoutGoal ? workoutGoal.current : 0;
    document.getElementById('total-applications').textContent = jobGoal ? jobGoal.current : 0;

    // Render habit completion rates
    renderHabitStats();
    renderWeeklyHeatmap();
}

function renderHabitStats() {
    const container = document.getElementById('habit-stats-chart');
    const totalDays = Math.max(1, Object.keys(state.habitsLog).length);

    container.innerHTML = state.habits.map(habit => {
        const completions = Object.values(state.habitsLog).filter(day => day[habit.id]).length;
        const rate = Math.round((completions / totalDays) * 100);

        return `
            <div class="habit-bar-item">
                <span class="habit-bar-label">${habit.icon} ${habit.name}</span>
                <div class="habit-bar-track">
                    <div class="habit-bar-fill" style="width: ${rate}%">${rate}%</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderWeeklyHeatmap() {
    const container = document.getElementById('weekly-heatmap');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    let html = '';
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = getDateString(date);
        const dayLog = state.habitsLog[dateStr] || {};
        const completions = Object.keys(dayLog).length;
        const level = Math.min(5, Math.ceil((completions / state.habits.length) * 5));

        html += `
            <div class="heatmap-day level-${level}">
                <span>${days[date.getDay()]}</span>
                <span>${completions}/${state.habits.length}</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ==========================================
// Modal Functions
// ==========================================
function openModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// ==========================================
// Utility Functions
// ==========================================
function getDateString(date = new Date()) {
    return date.toISOString().split('T')[0];
}

// Make functions globally accessible
window.toggleHabit = toggleHabit;
window.incrementGoal = incrementGoal;
window.closeModal = closeModal;
window.removeWhy = removeWhy;
window.showFullEntry = showFullEntry;
window.deleteEntry = deleteEntry;
window.togglePrayer = togglePrayer;
