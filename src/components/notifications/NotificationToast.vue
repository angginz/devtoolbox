<script setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()
// storeToRefs keeps reactivity when the store replaces the array
const { notifications } = storeToRefs(notificationStore)

const removeNotification = (id) => {
  notificationStore.removeNotification(id)
}
</script>

<template>
  <div class="notification-container" v-if="notifications.length > 0">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-toast"
      :class="`notification-${notification.type}`"
      @click="removeNotification(notification.id)"
    >
      <div class="notification-content">
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      <button
        class="notification-close"
        @click.stop="removeNotification(notification.id)"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-toast {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  background: #ffffff;
  color: #333333;
  border-left: 4px solid #4caf50;
  transition: all 0.3s ease;
  animation: slide-in 0.3s ease-out;
}

.notification-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.notification-info {
  border-left-color: #2196f3;
}

.notification-success {
  border-left-color: #4caf50;
}

.notification-warning {
  border-left-color: #ff9800;
}

.notification-error {
  border-left-color: #f44336;
}

.notification-content {
  flex: 1;
  margin-right: 8px;
}

.notification-message {
  font-size: 14px;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background: #f5f5f5;
  color: #333;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Dark mode styles */
html.dark-mode .notification-toast {
  background: #1e293b;
  color: #e2e8f0;
}

html.dark-mode .notification-close {
  color: #94a3b8;
}

html.dark-mode .notification-close:hover {
  background: #334155;
  color: #e2e8f0;
}
</style>
