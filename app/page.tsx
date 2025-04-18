"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { detectCyberbullying } from "@/app/actions"
import { Loader2, Shield, AlertTriangle, CheckCircle, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function CyberBullyingDetector() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<{
    isCyberbullying: boolean
    explanation: string
    confidence: number
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Initial animation for the header
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // Animation for result appearance
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" })
    }
  }, [result])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsAnalyzing(true)
    setResult(null)

    try {
      const response = await detectCyberbullying(text)
      setResult(response)
    } catch (error) {
      console.error("Error analyzing text:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="relative min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-100 text-foreground">
      {/* Grid Background */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-12 px-4 sm:px-6 min-h-screen">
        {/* Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-md bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:bg-slate-700/80 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-emerald-400" />
          ) : (
            <Moon className="h-5 w-5 text-emerald-600" />
          )}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl"
        >
          <h1 ref={headerRef} className="text-4xl sm:text-5xl font-bold mb-2 text-center text-white">
            Cyberbullying <span className="text-emerald-400">Detector</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-slate-400 text-center mb-10"
          >
            Powered by Gemini 2.0 Flash
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-6 bg-slate-900/80 backdrop-blur-sm p-6 rounded-md border border-slate-800 shadow-lg"
          >
            <div className="space-y-2">
              <label htmlFor="text-input" className="text-sm font-medium text-slate-300 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                Enter text to analyze
              </label>
              <div className="relative textarea-container">
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste text here..."
                  className="min-h-32 bg-slate-800/70 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/50 transition-all duration-300 rounded-md shadow-inner backdrop-blur-sm font-mono text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isAnalyzing || !text.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Detect Cyberbullying"
              )}
            </Button>
          </motion.form>

          {result && (
            <div
              ref={resultRef}
              className={cn(
                "mt-8 p-6 rounded-md border shadow-lg transition-all duration-500 backdrop-blur-sm",
                result.isCyberbullying ? "bg-red-900/20 border-red-800/50" : "bg-emerald-900/20 border-emerald-800/50",
              )}
            >
              <div className="flex items-center mb-4">
                {result.isCyberbullying ? (
                  <AlertTriangle className="h-6 w-6 text-red-400 mr-2" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-emerald-400 mr-2" />
                )}
                <h2 className="text-xl font-semibold text-white">
                  {result.isCyberbullying ? "Cyberbullying Detected" : "No Cyberbullying Detected"}
                </h2>
              </div>

              <div className="mb-4">
                <p className="text-slate-300 font-mono text-sm">{result.explanation}</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-400">Confidence</span>
                  <span className="text-sm text-slate-400">{Math.round(result.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-2 rounded-full",
                      result.isCyberbullying
                        ? "bg-gradient-to-r from-red-600 to-red-400"
                        : "bg-gradient-to-r from-emerald-600 to-emerald-400",
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-slate-800/50 backdrop-blur-sm rounded-md border border-slate-700 shadow-inner">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="mt-4 text-slate-400 text-sm">
              This tool helps identify potentially harmful content. <br />
              Results are AI-generated and may not be 100% accurate.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
