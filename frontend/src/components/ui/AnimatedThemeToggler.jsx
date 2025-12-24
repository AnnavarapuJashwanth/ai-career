"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { cn } from "../../lib/utils"

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    // Check localStorage first, default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else if (savedTheme === "light") {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    } else if (prefersDark) {
      // Only use system preference if no saved theme
      setIsDark(true)
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      // Default to light mode
      setIsDark(false)
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      // Fallback for browsers without View Transitions API
      flushSync(() => {
        const newTheme = !isDark
        setIsDark(newTheme)
        if (newTheme) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("theme", newTheme ? "dark" : "light")
      })
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark
        setIsDark(newTheme)
        if (newTheme) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("theme", newTheme ? "dark" : "light")
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, duration])

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "relative w-11 h-11 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform",
        className
      )}
      {...props}
    >
      <div className="relative w-5 h-5">
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400 absolute inset-0" />
        ) : (
          <Moon className="w-5 h-5 text-blue-500 absolute inset-0" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
