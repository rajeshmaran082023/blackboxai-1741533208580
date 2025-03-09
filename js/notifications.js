class NotificationManager {
    constructor() {
        this.audio = document.getElementById('notification');
        this.timerCircle = document.querySelector('.timer-circle');
        
        // Check if browser supports notifications
        this.hasNotificationPermission = 'Notification' in window;
        if (this.hasNotificationPermission) {
            Notification.requestPermission();
        }
    }

    notify(message) {
        // Play sound notification
        this.playSound();
        
        // Show browser notification
        this.showBrowserNotification(message);
        
        // Show visual notification
        this.showVisualNotification();
    }

    playSound() {
        // Reset audio to start and play
        this.audio.currentTime = 0;
        this.audio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    }

    showBrowserNotification(message) {
        if (this.hasNotificationPermission && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: message,
                icon: 'https://cdn-icons-png.flaticon.com/512/1786/1786455.png'
            });
        }
    }

    showVisualNotification() {
        // Add flash animation class
        this.timerCircle.classList.add('animate-pulse');
        
        // Change border color
        const originalBorder = this.timerCircle.style.borderColor;
        this.timerCircle.style.borderColor = '#4CAF50';
        
        // Remove animation and restore color after 3 seconds
        setTimeout(() => {
            this.timerCircle.classList.remove('animate-pulse');
            this.timerCircle.style.borderColor = originalBorder;
        }, 3000);
    }
}

// Initialize notification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
});

// Add custom animation to Tailwind
if (window.tailwind) {
    tailwind.config = {
        theme: {
            extend: {
                animation: {
                    pulse: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                },
                keyframes: {
                    pulse: {
                        '0%, 100%': { opacity: '1' },
                        '50%': { opacity: '.5' },
                    },
                },
            },
        },
    };
}
