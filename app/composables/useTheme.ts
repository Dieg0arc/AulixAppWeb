import { useColorMode } from "@vueuse/core"

export function useTheme() {
  const mode = useColorMode({
    storageKey: "aulix-theme",
    selector: "html",
    attribute: "class",
    modes: { light: "", dark: "dark" },
  })

  const isDark = computed(() => mode.value === "dark")
  const toggle = () => {
    mode.value = mode.value === "dark" ? "light" : "dark"
  }

  return { mode, isDark, toggle }
}
