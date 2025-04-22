export function shakeElement(ref) {
    if (!ref?.current) return
    const el = ref.current

    el.classList.remove('animate-shake')
    void el.offsetWidth
    el.classList.add('animate-shake')

    setTimeout(() => {
        el.classList.remove('animate-shake')
    }, 400)
}
  