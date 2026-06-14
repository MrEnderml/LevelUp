import { ref } from "vue";
import { useHero } from "../useHero";
import { notifications } from "../../data/notifications";
import { spEnemy } from "../../data/spaceEnemy";
import { dimensions } from "../../data/dimensions";
import { useTimeline } from "../battleUtils/dims/useTimeline";

const isPanelVisible = ref(false);

export function useNotificationHandler() {
  const { hero } = useHero();

  const ctx = {
    h: hero.value,
    sp: spEnemy,
    dim: dimensions.value
  }

  function notesHandler() {
    const h = hero.value;
    const used = h.notes.triggers;

    h.notes.msg = h.notes.msg.filter(note => {
      if (!note.expiresAt)
        return true;
  
      return Date.now() < note.expiresAt;
    });

    if (h.notes.msg.length <= 0)
      closePanel();

    for (const n of notifications) {
      if (n.once && used[n.id])
        continue;
  
      if (!n?.condition?.(ctx))
        continue;
  
      if (!canTrigger(n))
        continue;
  
      pushNotification({
        id: n.id,
        ...n.message,

        expiresAt:
          n.cooldown
            ? Date.now() + n.cooldown
            : null
      });
  
      if (n.once)
        h.notes.triggers[n.id] = true;
  
      if (n.cooldown)
        h.notes.cooldowns[n.id] =
          Date.now() + n.cooldown;
    }
    
  }

  function canTrigger(notification) {

    const cd =
      hero.value.notes.cooldowns[
        notification.id
      ];
  
    if (!cd)
      return true;
  
    return Date.now() >= cd;
  }

  function pushNotification(note) {
    hero.value.notes.msg.unshift({
      date: Date.now(),
      ...note
    });

    if (hero.value.settings.notes)
      openPanel();
  }

  function pushNoteById(noteId) {

    const note = notifications.find(n => n.id === noteId);
  
    if (!note)
      return;
  
    pushNotification({
      id: note.id,
      ...note.message,
  
      expiresAt:
        note.cooldown
          ? Date.now() + note.cooldown
          : null
    });
  
  }

  function clearNotifications() {
    hero.value.notes.msg = [];

    if (hero.value.notes.msg.length == 0)
      closePanel();
  }

  function removeNotification(id) {
    hero.value.notes.msg =
      hero.value.notes.msg.filter(n => n.id !== id);

    if (hero.value.notes.msg.length == 0)
      closePanel();
  }

  function clickNotification(note) {
    if (note.link) {
        hero.value.eLink = note.link;
        removeNotification(hero.value.notes.msg.findIndex(n => n.id === note.id));
    }
}

  function togglePanel() {
    isPanelVisible.value = !isPanelVisible.value;
  }

  function openPanel() {
    isPanelVisible.value = true;
  }

  function closePanel() {
    isPanelVisible.value = false;
  }

  return { 
    notesHandler,
    removeNotification,
    clearNotifications,
    clickNotification,
    isPanelVisible,
    togglePanel,
    openPanel,
    closePanel,
    pushNoteById
   };
}