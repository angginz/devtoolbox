import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])

  function addNotification(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random()
    const notification = {
      id,
      message,
      type,
      duration
    }

    notifications.value.push(notification)

    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clearAll() {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }
})
