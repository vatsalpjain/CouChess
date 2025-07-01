// script.js

let settings = document.querySelector('#settings');
let selectedTime = 2; // Default time (2 minutes)
let p1Interval, p2Interval;
let p1TimeLeft, p2TimeLeft;
const p1_timer = document.getElementById('p1_timer');
const p2_timer = document.getElementById('p2_timer');
const countp1 = document.getElementById('countp1');
const countp2 = document.getElementById('countp2');
let movesP1 = 0, movesP2 = 0;
let isP1Turn = true;

const settings_form = `
    <div id="settings-overlay" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl flex flex-col items-center min-w-[300px] text-center">
            <span class="text-2xl font-bold mb-4">Settings</span>
            <span class="mb-4 time-option cursor-pointer hover:bg-blue-200 p-2 rounded transition" id="setting_1" data-minutes="2">Bullet<br>2m vs 2m</span>
            <span class="mb-4 time-option cursor-pointer hover:bg-blue-200 p-2 rounded transition" id="setting_2" data-minutes="5">Blitz<br>5m vs 5m</span>
            <span class="mb-4 time-option cursor-pointer hover:bg-blue-200 p-2 rounded transition" id="setting_3" data-minutes="15">Rapid<br>15m vs 15m</span>
            <span class="mb-4 time-option cursor-pointer hover:bg-blue-200 p-2 rounded transition" id="setting_4" data-minutes="60">Hourglass<br>60m vs 60m</span>
            <button id="close-settings" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">Close</button>
        </div>
    </div>
`;

settings.addEventListener('click', () => {
    if (!document.getElementById('settings-overlay')) {
        document.body.insertAdjacentHTML('beforeend', settings_form);

        // Highlight current selection
        document.querySelectorAll('.time-option').forEach(opt => {
            if(parseInt(opt.dataset.minutes) === selectedTime) {
                opt.classList.add('bg-blue-200', 'font-bold');
            }
        });

        // Time selection handler
        document.querySelectorAll('.time-option').forEach(opt => {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.time-option').forEach(o =>
                    o.classList.remove('bg-blue-200', 'font-bold'));
                this.classList.add('bg-blue-200', 'font-bold');
                selectedTime = parseInt(this.dataset.minutes);
            });
        });

        // Close settings handler
        document.getElementById('close-settings').onclick = () => {
            resetTimers();
            document.getElementById('settings-overlay').remove();
        };
    }
});

function resetTimers() {
    clearInterval(p1Interval);
    clearInterval(p2Interval);

    p1TimeLeft = selectedTime * 60;
    p2TimeLeft = selectedTime * 60;

    updateTimerDisplay(1, p1TimeLeft);
    updateTimerDisplay(2, p2TimeLeft);

    isP1Turn = true;
    movesP1 = 0;
    movesP2 = 0;
    countp1.textContent = '0';
    countp2.textContent = '0';

    // Reset UI states and background color
    p1_timer.classList.remove('disabled-timer');
    p2_timer.classList.add('disabled-timer');
    p1_timer.style.opacity = '1';
    p2_timer.style.opacity = '0.7';
    p1_timer.style.backgroundColor = ''; // Reset to original
    p2_timer.style.backgroundColor = '';
}

function updateTimerDisplay(player, seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const displayString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    if(player === 1) {
        p1_timer.querySelector('span').textContent = displayString;
    } else {
        p2_timer.querySelector('span').textContent = displayString;
    }
}

function startTimer(player) {
    if(player === 1) {
        clearInterval(p2Interval);
        p1Interval = setInterval(() => {
            if (p1TimeLeft > 0) {
                p1TimeLeft--;
                updateTimerDisplay(1, p1TimeLeft);
            }
            if(p1TimeLeft <= 0) {
                clearInterval(p1Interval);
                p1_timer.style.backgroundColor = '#ef4444'; // Red for time out
                setTimeout(() => alert("Player 1's time is up!"), 100);
            }
        }, 1000);
    } else {
        clearInterval(p1Interval);
        p2Interval = setInterval(() => {
            if (p2TimeLeft > 0) {
                p2TimeLeft--;
                updateTimerDisplay(2, p2TimeLeft);
            }
            if(p2TimeLeft <= 0) {
                clearInterval(p2Interval);
                p2_timer.style.backgroundColor = '#ef4444'; // Red for time out
                setTimeout(() => alert("Player 2's time is up!"), 100);
            }
        }, 1000);
    }
}

// Player Turn Handling
p1_timer.addEventListener('click', () => {
    if(isP1Turn && p1TimeLeft > 0) {
        movesP1++;
        countp1.textContent = movesP1;
        startTimer(2); // Switch to player 2's timer
        isP1Turn = false;
        p1_timer.classList.add('disabled-timer');
        p2_timer.classList.remove('disabled-timer');
        p1_timer.style.opacity = '0.7';
        p2_timer.style.opacity = '1';
    }
});

p2_timer.addEventListener('click', () => {
    if(!isP1Turn && p2TimeLeft > 0) {
        movesP2++;
        countp2.textContent = movesP2;
        startTimer(1); // Switch to player 1's timer
        isP1Turn = true;
        p2_timer.classList.add('disabled-timer');
        p1_timer.classList.remove('disabled-timer');
        p2_timer.style.opacity = '0.7';
        p1_timer.style.opacity = '1';
    }
});

// Initialize game
resetTimers();

