class PomodoroTimer {
    constructor() {
        // DOM elements
        this.timeDisplay = document.getElementById('time');
        this.sessionTypeDisplay = document.getElementById('session-type');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.workDurationInput = document.getElementById('work-duration');
        this.breakDurationInput = document.getElementById('break-duration');

        // Timer state
        this.isRunning = false;
        this.isPaused = false;
        this.isWorkSession = true;
        this.timeLeft = this.workDurationInput.value * 60;
        this.timerInterval = null;

        // Bind event listeners
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.workDurationInput.addEventListener('change', () => this.updateDuration());
        this.breakDurationInput.addEventListener('change', () => this.updateDuration());

        // Initialize
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
            this.workDurationInput.disabled = true;
            this.breakDurationInput.disabled = true;

            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();

                if (this.timeLeft <= 0) {
                    this.handleSessionComplete();
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.startButton.disabled = false;
            this.pauseButton.disabled = true;
            clearInterval(this.timerInterval);
            this.updateDisplay();
        }
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.isWorkSession = true;
        clearInterval(this.timerInterval);
        this.timeLeft = this.workDurationInput.value * 60;
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        this.workDurationInput.disabled = false;
        this.breakDurationInput.disabled = false;
        this.updateDisplay();
    }

    updateDuration() {
        if (!this.isRunning) {
            this.timeLeft = this.isWorkSession ? 
                this.workDurationInput.value * 60 : 
                this.breakDurationInput.value * 60;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.sessionTypeDisplay.textContent = this.isWorkSession ? 'Work Session' : 'Break Session';
    }

    handleSessionComplete() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        
        // Trigger notification
        window.notificationManager.notify(
            this.isWorkSession ? 'Work session completed!' : 'Break session completed!'
        );

        // Save session to history
        window.storageManager.saveSession({
            type: this.isWorkSession ? 'work' : 'break',
            duration: this.isWorkSession ? 
                this.workDurationInput.value : 
                this.breakDurationInput.value,
            timestamp: new Date().toISOString()
        });

        // Switch session type
        this.isWorkSession = !this.isWorkSession;
        this.timeLeft = this.isWorkSession ? 
            this.workDurationInput.value * 60 : 
            this.breakDurationInput.value * 60;

        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        this.workDurationInput.disabled = false;
        this.breakDurationInput.disabled = false;
        this.updateDisplay();
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroTimer = new PomodoroTimer();
});
