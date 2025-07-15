"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, TrendingUp, Battery } from "lucide-react"
import { motion } from "framer-motion"

const SummaryReport = ({ summary }) => {
  const chartRef = useRef(null)

  // Format time to hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Create priority delivery time chart
  useEffect(() => {
    if (!chartRef.current) return

    const canvas = chartRef.current
    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1

    // Set canvas dimensions accounting for device pixel ratio
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const chartWidth = rect.width - 40
    const chartHeight = rect.height - 40
    const barWidth = chartWidth / 3 - 20

    // Data
    const data = [
      { label: "Priority 1", value: summary.avg_delivery_times["1"], color: "#3b82f6" },
      { label: "Priority 2", value: summary.avg_delivery_times["2"], color: "#10b981" },
      { label: "Priority 3", value: summary.avg_delivery_times["3"], color: "#f59e0b" },
    ]

    // Find max value for scaling
    const maxValue = Math.max(...data.map((d) => d.value))

    // Draw bars
    data.forEach((item, index) => {
      const x = 30 + index * (barWidth + 20)
      const barHeight = (item.value / maxValue) * chartHeight
      const y = rect.height - 30 - barHeight

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, y, x, rect.height - 30)
      gradient.addColorStop(0, `${item.color}80`)
      gradient.addColorStop(1, item.color)

      // Draw bar
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 5)
      ctx.fill()

      // Draw value
      ctx.fillStyle = "#f8fafc"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(formatTime(item.value), x + barWidth / 2, y - 10)

      // Draw label
      ctx.fillStyle = "#94a3b8"
      ctx.fillText(item.label, x + barWidth / 2, rect.height - 10)
    })

    // Draw y-axis
    ctx.strokeStyle = "#334155"
    ctx.beginPath()
    ctx.moveTo(20, 10)
    ctx.lineTo(20, rect.height - 30)
    ctx.lineTo(rect.width - 10, rect.height - 30)
    ctx.stroke()
  }, [summary])

  return (
    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Card className="bg-slate-700 border-slate-600 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 bg-opacity-20 rounded-full">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Execution Time</p>
                <p className="text-xl font-bold">{formatTime(summary.total_execution_minutes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500 bg-opacity-20 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Average Delivery Times</p>
              </div>
            </div>
            <div className="h-[150px] w-full">
              <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500 bg-opacity-20 rounded-full">
                <Battery className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Charging Statistics</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(summary.charge_counts).map(([agv, count]) => (
                <div key={agv} className="flex items-center">
                  <div className="w-20 text-sm">{agv.toUpperCase()}</div>
                  <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / 20) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="w-10 text-right text-sm">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default SummaryReport

