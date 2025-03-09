class StorageManager {
    constructor() {
        this.historyList = document.getElementById('history-list');
        this.clearHistoryButton = document.getElementById('clear-history');
        
        // Bind event listeners
        this.clearHistoryButton.addEventListener('click', () => this.clearHistory());
        
        // Load existing history on initialization
        this.loadHistory();
    }

    saveSession(session) {
        let history = this.getHistory();
        history.unshift(session); // Add new session at the beginning
        
        // Keep only the last 50 sessions
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        localStorage.setItem('pomodoroHistory', JSON.stringify(history));
        this.loadHistory(); // Refresh the display
    }

    getHistory() {
        const history = localStorage.getItem('pomodoroHistory');
        return history ? JSON.parse(history) : [];
    }

    clearHistory() {
        localStorage.removeItem('pomodoroHistory');
        this.loadHistory(); // Refresh the display
    }

    loadHistory() {
        const history = this.getHistory();
        this.historyList.innerHTML = ''; // Clear current display

        if (history.length === 0) {
            this.historyList.innerHTML = `
                <div class="text-gray-500 text-center py-4">
                    No sessions recorded yet
                </div>
            `;
            return;
        }

        history.forEach(session => {
            const date = new Date(session.timestamp);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const sessionElement = document.createElement('div');
            sessionElement.className = 'flex justify-between items-center p-3 bg-white rounded-lg shadow-sm';
            sessionElement.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${session.type === 'work' ? 'fa-briefcase text-blue-500' : 'fa-coffee text-green-500'} mr-3"></i>
                    <div>
                        <div class="font-medium">${session.type === 'work' ? 'Work Session' : 'Break Session'}</div>
                        <div class="text-sm text-gray-500">${formattedDate} at ${formattedTime}</div>
                    </div>
                </div>
                <div class="text-gray-600">
                    ${session.duration} minutes
                </div>
            `;

            this.historyList.appendChild(sessionElement);
        });
    }
}

// Initialize storage manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storageManager = new StorageManager();
});
