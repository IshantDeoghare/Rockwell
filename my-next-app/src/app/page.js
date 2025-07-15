// "use client"

// import { useState, useEffect } from "react"
// import RouteMap from "@/components/route-map"
// import SummaryReport from "@/components/summary-report"
// import ExecutionLogs from "@/components/execution-logs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Play, Pause, RotateCcw } from "lucide-react"

// export default function Home() {
//   const [data, setData] = useState(null)
//   const [currentLogIndex, setCurrentLogIndex] = useState(0)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [agvPositions, setAgvPositions] = useState({
//     agv_1: "1",
//     agv_2: "3",
//     agv_3: "7",
//   })
//   const [agvStatuses, setAgvStatuses] = useState({
//     agv_1: { battery: 100, weight: 0, payload: null, status: "Idle" },
//     agv_2: { battery: 100, weight: 0, payload: null, status: "Idle" },
//     agv_3: { battery: 100, weight: 0, payload: null, status: "Idle" },
//   })

//   // Fetch data from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/agv-schedule')
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }
//         const result = await response.json()
//         setData(result)
//         setError(null)
//       } catch (err) {
//         setError(err.message)
//         setData(null)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Update AGV positions based on current log
//   useEffect(() => {
//     if (data && data.data && currentLogIndex < data.data.logs.length) {
//       const currentLog = data.data.logs[currentLogIndex]

//       setAgvPositions(prev => ({
//         ...prev,
//         [currentLog.AGV]: currentLog.To,
//       }))

//       setAgvStatuses(prev => ({
//         ...prev,
//         [currentLog.AGV]: {
//           ...prev[currentLog.AGV],
//           weight: Number.parseInt(currentLog.Weight),
//           payload: currentLog.Payload,
//           status: currentLog.Status,
//           battery: Math.max(prev[currentLog.AGV].battery - 5, 0),
//         },
//       }))
//     }
//   }, [currentLogIndex, data])

//   // Animation loop
//   useEffect(() => {
//     let timer
//     if (isPlaying && data && data.data && currentLogIndex < data.data.logs.length - 1) {
//       timer = setTimeout(() => {
//         setCurrentLogIndex(prev => prev + 1)
//       }, 2000)
//     }
//     return () => clearTimeout(timer)
//   }, [isPlaying, currentLogIndex, data])

//   const handlePlay = () => setIsPlaying(true)
//   const handlePause = () => setIsPlaying(false)
//   const handleReset = () => {
//     setIsPlaying(false)
//     setCurrentLogIndex(0)
//     setAgvPositions({
//       agv_1: "1",
//       agv_2: "3",
//       agv_3: "7",
//     })
//     setAgvStatuses({
//       agv_1: { battery: 100, weight: 0, payload: null, status: "Idle" },
//       agv_2: { battery: 100, weight: 0, payload: null, status: "Idle" },
//       agv_3: { battery: 100, weight: 0, payload: null, status: "Idle" },
//     })
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading AGV data...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//         <div className="text-red-500 text-xl">Error: {error}</div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
//       <header className="border-b border-slate-700 bg-slate-900 py-4">
//         <div className="container mx-auto px-4">
//           <h1 className="text-2xl font-bold text-center">AGV Fleet Management System</h1>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <Card className="col-span-1 lg:col-span-2 bg-slate-800 border-slate-700 shadow-xl">
//             <CardHeader className="border-b border-slate-700">
//               <CardTitle className="flex justify-between items-center">
//                 <span>Route Map & AGV Visualization</span>
//                 <div className="flex space-x-2">
//                   {isPlaying ? (
//                     <Button variant="outline" size="sm" onClick={handlePause}>
//                       <Pause className="h-4 w-4 mr-1" /> Pause
//                     </Button>
//                   ) : (
//                     <Button variant="outline" size="sm" onClick={handlePlay}>
//                       <Play className="h-4 w-4 mr-1" /> Play
//                     </Button>
//                   )}
//                   <Button variant="outline" size="sm" onClick={handleReset}>
//                     <RotateCcw className="h-4 w-4 mr-1" /> Reset
//                   </Button>
//                 </div>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <RouteMap
//                 agvPositions={agvPositions}
//                 agvStatuses={agvStatuses}
//                 currentLog={currentLogIndex < data.data.logs.length ? data.data.logs[currentLogIndex] : null}
//               />
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-800 border-slate-700 shadow-xl">
//             <CardHeader className="border-b border-slate-700">
//               <CardTitle>Summary Report</CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <SummaryReport summary={data.data.summary} />
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="bg-slate-800 border-slate-700 shadow-xl">
//           <CardHeader className="border-b border-slate-700">
//             <CardTitle>Execution Logs</CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <ExecutionLogs logs={data.data.logs} currentLogIndex={currentLogIndex} />
//           </CardContent>
//         </Card>
//       </main>

//       <footer className="border-t border-slate-700 bg-slate-900 py-4 mt-8">
//         <div className="container mx-auto px-4 text-center text-slate-400">
//           <p>AGV Fleet Management System © 2025</p>
//         </div>
//       </footer>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import RouteMap from "@/components/route-map"
import SummaryReport from "@/components/summary-report"
import ExecutionLogs from "@/components/execution-logs"
import { Play, RotateCcw, Pause, FastForward } from "lucide-react"

// Helper functions for time management
const parseTimeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

const formatMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

export default function Home() {
  const [data, setData] = useState(null)
  const [simulationTime, setSimulationTime] = useState(parseTimeToMinutes("08:00"))
  const [isPlaying, setIsPlaying] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [activeLogIndices, setActiveLogIndices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [agvLogs, setAgvLogs] = useState({ agv_1: [], agv_2: [], agv_3: [] })

  // AGV states management with enforced initial positions
  const [agvStates, setAgvStates] = useState({
    agv_1: createAgvState("1"),
    agv_2: createAgvState("3"),
    agv_3: createAgvState("7"),
  })

  function createAgvState(initialPosition) {
    return {
      position: initialPosition,
      battery: 100,
      weight: 0,
      payload: null,
      status: "Idle",
      currentLogIndex: -1,
      nextLogTime: null,
    }
  }

  // Fetch and initialize data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/agv-schedule')
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const result = await response.json()

        // Filter and sort logs
        const filteredLogs = result.data.logs.filter(log => 
          parseTimeToMinutes(log.Time) >= parseTimeToMinutes("08:00")
        )
        
        const sortedLogs = [...filteredLogs].sort((a, b) => 
          parseTimeToMinutes(a.Time) - parseTimeToMinutes(b.Time)
        )

        const groupedLogs = { agv_1: [], agv_2: [], agv_3: [] }
        sortedLogs.forEach((log, index) => {
          groupedLogs[log.AGV].push({ ...log, originalIndex: index })
        })

        setData({ ...result, data: { ...result.data, logs: sortedLogs } })
        setAgvLogs(groupedLogs)
        setError(null)

        // Initialize AGV states with enforced positions
        setAgvStates({
          agv_1: {
            ...createAgvState("1"),
            nextLogTime: groupedLogs.agv_1[0]?.Time 
              ? parseTimeToMinutes(groupedLogs.agv_1[0].Time)
              : null
          },
          agv_2: {
            ...createAgvState("3"),
            nextLogTime: groupedLogs.agv_2[0]?.Time 
              ? parseTimeToMinutes(groupedLogs.agv_2[0].Time)
              : null
          },
          agv_3: {
            ...createAgvState("7"),
            nextLogTime: groupedLogs.agv_3[0]?.Time 
              ? parseTimeToMinutes(groupedLogs.agv_3[0].Time)
              : null
          },
        })

      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update AGV states
  useEffect(() => {
    if (!data) return

    const newAgvStates = { ...agvStates }
    const newActiveIndices = []
    let statesUpdated = false

    Object.keys(agvLogs).forEach(agvId => {
      const logs = agvLogs[agvId]
      const currentState = newAgvStates[agvId]
      let latestProcessedIndex = currentState.currentLogIndex

      // Process only relevant logs
      for (let i = currentState.currentLogIndex + 1; i < logs.length; i++) {
        const log = logs[i]
        const logTime = parseTimeToMinutes(log.Time)

        if (logTime <= simulationTime) {
          // Validate initial position consistency
          if (i === 0 && log.From !== currentState.position) {
            console.warn(`Initial position mismatch for ${agvId}: Expected ${currentState.position}, found ${log.From}`)
          }

          latestProcessedIndex = i
          newActiveIndices.push(log.originalIndex)
        } else {
          break
        }
      }

      if (latestProcessedIndex !== currentState.currentLogIndex) {
        const lastLog = logs[latestProcessedIndex]
        newAgvStates[agvId] = {
          ...currentState,
          position: lastLog.To,
          weight: Number.parseInt(lastLog.Weight),
          payload: lastLog.Payload,
          status: lastLog.Status,
          battery: lastLog.Status === "Charging" 
            ? Math.min(currentState.battery + 20, 100)
            : Math.max(currentState.battery - (5 * (latestProcessedIndex - currentState.currentLogIndex)), 0),
          currentLogIndex: latestProcessedIndex,
          nextLogTime: latestProcessedIndex + 1 < logs.length 
            ? parseTimeToMinutes(logs[latestProcessedIndex + 1].Time)
            : null,
        }
        statesUpdated = true
      }
    })

    if (statesUpdated) {
      setAgvStates(newAgvStates)
      setActiveLogIndices(newActiveIndices)
    }
  }, [simulationTime, data, agvLogs])

  // Simulation timer
  useEffect(() => {
    let timer
    if (isPlaying && data) {
      timer = setTimeout(() => {
        const nextLogTimes = Object.values(agvStates)
          .map(state => state.nextLogTime)
          .filter(time => time !== null)

        if (nextLogTimes.length > 0) {
          const nextTime = Math.min(...nextLogTimes)
          const increment = Math.min(simulationSpeed, nextTime - simulationTime)
          const newTime = simulationTime + (increment <= 0 ? simulationSpeed : increment)
          setSimulationTime(Math.min(newTime, 24 * 60)) // Max 24 hours
        } else {
          setIsPlaying(false)
        }
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, simulationTime, agvStates, simulationSpeed, data])

  // Control handlers
  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const toggleSpeed = () => setSimulationSpeed(prev => prev === 1 ? 5 : prev === 5 ? 10 : 1)
  
  const handleReset = () => {
    setIsPlaying(false)
    setSimulationTime(parseTimeToMinutes("08:00"))
    setAgvStates({
      agv_1: { ...createAgvState("1"), nextLogTime: agvLogs.agv_1[0]?.Time ? parseTimeToMinutes(agvLogs.agv_1[0].Time) : null },
      agv_2: { ...createAgvState("3"), nextLogTime: agvLogs.agv_2[0]?.Time ? parseTimeToMinutes(agvLogs.agv_2[0].Time) : null },
      agv_3: { ...createAgvState("7"), nextLogTime: agvLogs.agv_3[0]?.Time ? parseTimeToMinutes(agvLogs.agv_3[0].Time) : null },
    })
    setActiveLogIndices([])
  }

  // Get current active logs
  const getCurrentLogs = () => {
    const currentLogs = {}
    Object.keys(agvStates).forEach(agvId => {
      const state = agvStates[agvId]
      if (state.currentLogIndex >= 0) {
        currentLogs[agvId] = agvLogs[agvId][state.currentLogIndex]
      }
    })
    return currentLogs
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1022] flex items-center justify-center">
        <div className="text-white text-xl">Loading AGV data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1022] flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1022]">
      <header className="border-b border-[#1a2747] bg-[#0a1022] py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center text-white">AGV Fleet Management System</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 lg:col-span-2 bg-[#111936] rounded-lg overflow-hidden border border-[#1a2747]">
            <div className="border-b border-[#1a2747] px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-white">Route Map & AGV Visualization</h2>
                <div className="px-3 py-1 bg-[#1a2747] rounded-md text-white">
                  Time: {formatMinutesToTime(simulationTime)}
                </div>
              </div>
              <div className="flex space-x-2">
                {isPlaying ? (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#1a2747] text-white hover:bg-[#243462] transition-colors"
                  >
                    <Pause className="h-4 w-4" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={handlePlay}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#1a2747] text-white hover:bg-[#243462] transition-colors"
                  >
                    <Play className="h-4 w-4" /> Play
                  </button>
                )}
                <button
                  onClick={toggleSpeed}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#1a2747] text-white hover:bg-[#243462] transition-colors"
                >
                  <FastForward className="h-4 w-4" /> {simulationSpeed}x
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#1a2747] text-white hover:bg-[#243462] transition-colors"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
            </div>
            <div className="p-6">
              <RouteMap
                agvPositions={{
                  agv_1: agvStates.agv_1.position,
                  agv_2: agvStates.agv_2.position,
                  agv_3: agvStates.agv_3.position,
                }}
                agvStatuses={{
                  agv_1: agvStates.agv_1,
                  agv_2: agvStates.agv_2,
                  agv_3: agvStates.agv_3,
                }}
                currentLogs={getCurrentLogs()}
              />
            </div>
          </div>

          <div className="bg-[#111936] rounded-lg overflow-hidden border border-[#1a2747]">
            <div className="border-b border-[#1a2747] px-6 py-4">
              <h2 className="font-semibold text-white">Summary Report</h2>
            </div>
            <div className="p-6">
              <SummaryReport summary={data.data.summary} />
            </div>
          </div>
        </div>

        <div className="bg-[#111936] rounded-lg overflow-hidden border border-[#1a2747]">
          <div className="border-b border-[#1a2747] px-6 py-4">
            <h2 className="font-semibold text-white">Execution Logs</h2>
          </div>
          <div className="p-6">
            <ExecutionLogs logs={data.data.logs} activeLogIndices={activeLogIndices} />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1a2747] bg-[#0a1022] py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-[#4a5d8a]">
          <p>AGV Fleet Management System © 2025</p>
        </div>
      </footer>
    </div>
  )
}