// === STATE & KONFIGURASI ===
let tasks = JSON.parse(localStorage.getItem('zenith_tasks')) || [];
let hapticEnabled = true;
let timerInterval = null;
let timeLeft = 25 * 60; // 25 menit dalam detik
let generatedSteps = [];

// === FUNGSI HAPTIC FEEDBACK (GETAR PERANGKAT) ===
function triggerHaptic(pattern = [50]) {
    if (!hapticEnabled) return;
    if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
    }
}

document.getElementById('haptic-toggle').addEventListener('click', (e) => {
    hapticEnabled = !hapticEnabled;
    e.target.textContent = hapticEnabled ? "📳 Getar: ON" : "📴 Getar: OFF";
    if (hapticEnabled) {
        triggerHaptic([60, 40, 60]);
        showToast("Fitur getar perangkat diaktifkan!");
    } else {
        showToast("Fitur getar dinonaktifkan.");
    }
});

// === NOTIFIKASI TOAST ===
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// === TEMA DARK / LIGHT MODE ===
document.getElementById('theme-toggle').addEventListener('click', (e) => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    e.target.textContent = isDark ? '🌙' : '☀️';
    triggerHaptic([30]);
});

// === NAVIGASI TAB ===
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
        triggerHaptic([25]);
    });
});

// === MANAJEMEN TUGAS (CRUD & LOCALSTORAGE) ===
function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'done' : ''}`;
        li.innerHTML = `
            <span style="cursor:pointer" onclick="toggleTask(${index})">
                ${task.done ? '✅' : '⬜'} ${task.text}
            </span>
            <button onclick="deleteTask(${index})" style="background:none;border:none;cursor:pointer;color:#ef4444;font-weight:bold;">✕</button>
        `;
        list.appendChild(li);
    });

    document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('completed-tasks').textContent = tasks.filter(t => t.done).length;
    localStorage.setItem('zenith_tasks', JSON.stringify(tasks));
}

function addTask(text) {
    if (!text.trim()) return;
    tasks.push({ text: text.trim(), done: false });
    renderTasks();
    triggerHaptic([40]);
    showToast("Tugas berhasil ditambahkan!");
}

window.toggleTask = (index) => {
    tasks[index].done = !tasks[index].done;
    renderTasks();
    triggerHaptic(tasks[index].done ? [50, 30, 80] : [30]);
};

window.deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
    triggerHaptic([40]);
};

document.getElementById('add-task-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    addTask(input.value);
    input.value = '';
});

// === POMODORO TIMER ===
function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('minutes').textContent = mins;
    document.getElementById('seconds').textContent = secs;
}

document.getElementById('start-timer').addEventListener('click', () => {
    if (timerInterval) return;
    triggerHaptic([50]);
    showToast("Sesi fokus dimulai!");
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            // Pola getar panjang sebagai alarm selesai
            triggerHaptic([300, 100, 300, 100, 400]);
            showToast("🎉 Waktu fokus selesai! Saatnya istirahat.");
        }
    }, 1000);
});

document.getElementById('pause-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    triggerHaptic([30]);
});

document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    triggerHaptic([40]);
});

// === AI TASK DECONSTRUCTOR (PEMECAH TUGAS CERDAS) ===
document.getElementById('generate-steps-btn').addEventListener('click', () => {
    const topic = document.getElementById('ai-prompt-input').value.trim();
    if (!topic) {
        showToast("Masukkan judul proyek terlebih dahulu!");
        return;
    }

    // Logika pemecahan tugas kontekstual
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('web') || lowerTopic.includes('koding') || lowerTopic.includes('aplikasi')) {
        generatedSteps = [
            `Riset referensi & buat sketsa wireframe untuk "${topic}"`,
            `Susun kerangka struktur dasar (HTML / Arsitektur Folder)`,
            `Terapkan styling desain responsif dan interaktif (CSS)`,
            `Implementasikan logika fungsi utama & pengujian bug (JavaScript/Python)`,
            `Publikasikan karya dan lengkapi dokumentasi README & Logbook`
        ];
    } else if (lowerTopic.includes('ujian') || lowerTopic.includes('belajar') || lowerTopic.includes('matematika')) {
        generatedSteps = [
            `Kumpulkan rangkuman rumus & konsep inti bab "${topic}"`,
            `Kerjakan 5 soal latihan tingkat dasar untuk pemahaman konsep`,
            `Analisis soal tipe HOTS / studi kasus yang sering keluar`,
            `Lakukan simulasi pengerjaan dengan batas waktu 25 menit`
        ];
    } else {
        generatedSteps = [
            `Identifikasi tujuan utama dan kebutuhan dari "${topic}"`,
            `Bagi pengerjaan menjadi 3 bagian kecil berurutan`,
            `Kerjakan bagian pertama selama 1 sesi Pomodoro (25 menit)`,
            `Evaluasi hasil akhir dan rapikan detail kekurangan`
        ];
    }

    const stepsList = document.getElementById('ai-steps-list');
    stepsList.innerHTML = generatedSteps.map(step => `<li>${step}</li>`).join('');
    document.getElementById('ai-result-container').classList.remove('hidden');
    triggerHaptic([40, 40, 80]);
});

document.getElementById('import-to-tasks-btn').addEventListener('click', () => {
    generatedSteps.forEach(step => tasks.push({ text: step, done: false }));
    renderTasks();
    triggerHaptic([60, 40, 60]);
    showToast("Semua tahapan berhasil dimasukkan ke Daftar Tugas!");
});

// Inisialisasi awal
renderTasks();
