<template>
    <div v-if="isPanelVisible" class="notification-panel">
        <div class="panel-header">
            <span>Notifications ({{ hero.notes.msg.length }})</span>
            <div style="display: flex; gap: 5px">
                <button class="close-all-btn" @click="clearNotifications">Close All</button>
                <button class="close-all-btn" @click="togglePanel">✕</button>
            </div>
        </div>

        <div class="notification-list">
            <div 
                v-for="(note, index) in visibleNotifications" 
                :key="note.id" 
                class="notification-item"
                :class="{ 'fade-out': note.closing }"
            >
                <div class="notification-content">
                    <p @click="clickNotification(note)">{{ note.text }}</p>
                    <button class="close-btn" @click="removeNotification(note.id)">✕</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useHero } from "../../composables/useHero";
import { useNotificationHandler } from "../../composables/UI/useNotificationHandler";


const { hero } = useHero();
const { 
    isPanelVisible,
    togglePanel,
    clearNotifications,
    removeNotification,
    clickNotification,
} = useNotificationHandler();


const maxVisible = 5;
const visibleNotifications = computed(() =>
    hero.value.notes.msg.slice(0, maxVisible)
);

</script>

<style scoped>
.notification-toggle-btn {
    position: fixed;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #1a1f2b, #0f131c);
    color: #aaa;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 6px;
    z-index: 1000;
    border: 1px solid #2a3142;
    transition: 0.2s;
}

.notification-toggle-btn:hover {
    color: #fff;
    border-color: #3a82ff;
}

.notification-toggle-btn .has-notifications {
    color: #ff4d4d;
}

.notification-panel {
    position: fixed;
    top: 45px;
    left: 10px;
    width: 280px;
    max-height: 380px;
    background: rgba(15, 18, 26, 0.95);
    border: 1px solid #2a3142;
    border-radius: 10px;
    padding: 10px;
    overflow: hidden;
    z-index: 1000;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    color: #ccc;
    font-size: 13px;
}

.close-all-btn {
    background: transparent;
    border: 1px solid #3a82ff;
    color: #3a82ff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    transition: 0.2s;
}

.close-all-btn:hover {
    background: #3a82ff;
    color: #fff;
}

.notification-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}


.notification-item {
    position: relative;
    background: linear-gradient(135deg, #1b2230, #131923);
    border: 1px solid #2d374a;
    color: #d0d6e0;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.3;

    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.25s forwards;
}

.notification-item p {
    margin: 0;
    padding-right: 20px;
}

.close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    background: transparent;
    border: none;
    color: #888;
    font-size: 12px;
    transition: 0.2s;
}

.close-btn:hover {
    color: #ff4d4d;
}

@keyframes fadeIn {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-out {
    animation: fadeOut 0.2s forwards;
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateY(-10px);
    }
}
</style>