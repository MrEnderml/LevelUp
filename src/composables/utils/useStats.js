import { reactive, computed } from "vue";

export function useStats(engine, base, options = {}) {
  const final = reactive({ ...base })

  const hooks = {
    additive: [],
    multiplicative: [],
    exponent: [],
    post: [],
  }

  function addHook(type, fn, priority = 0) {
    hooks[type].push({ fn, priority });
  }

  function recalc() {
    Object.assign(final, base)
    for (const h of hooks.additive.sort((a,b)=>a.priority-b.priority)) h.fn(final)
    for (const h of hooks.multiplicative.sort((a,b)=>a.priority-b.priority)) h.fn(final)
    for (const h of hooks.exponent.sort((a,b)=>a.priority-b.priority)) h.fn(final)
    for (const h of hooks.post.sort((a,b)=>a.priority-b.priority)) h.fn(final)
  }

  if (options.auto !== false) {
    engine.addHook("beforeTick", recalc)
  }

  return { base, final, addHook, recalc }
}
