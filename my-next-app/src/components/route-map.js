// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion } from "framer-motion"
// import { Battery, Package, Truck } from "lucide-react"

// const RouteMap = ({ agvPositions, agvStatuses, currentLog }) => {
//   const canvasRef = useRef(null)
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
//   const [nodePositions, setNodePositions] = useState({})
//   const [paths, setPaths] = useState([])
//   const [agvAnimations, setAgvAnimations] = useState({
//     agv_1: { x: 0, y: 0 },
//     agv_2: { x: 0, y: 0 },
//     agv_3: { x: 0, y: 0 },
//   })

//   // Define the grid layout
//   const gridLayout = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//   ]

//   // Define connections between nodes
//   const connections = [
//     [1, 2],
//     [2, 3],
//     [1, 4],
//     [2, 5],
//     [3, 6],
//     // [4, 5],
//     [5, 6],
//     [4, 7],
//     [5, 8],
//     // [6, 9],
//     [7, 8],
//     [8, 9],
//   ]

//   // Calculate node positions based on canvas size
//   useEffect(() => {
//     if (canvasRef.current) {
//       const { width, height } = canvasRef.current.getBoundingClientRect()
//       setDimensions({ width, height })

//       const padding = 60
//       const nodeWidth = (width - padding * 2) / 3
//       const nodeHeight = (height - padding * 2) / 3

//       const positions = {}
//       gridLayout.forEach((row, rowIndex) => {
//         row.forEach((nodeId, colIndex) => {
//           positions[nodeId] = {
//             x: padding + colIndex * nodeWidth + nodeWidth / 2,
//             y: padding + rowIndex * nodeHeight + nodeHeight / 2,
//           }
//         })
//       })

//       setNodePositions(positions)

//       // Calculate paths
//       const pathsArray = connections.map(([from, to]) => ({
//         from,
//         to,
//         x1: positions[from]?.x || 0,
//         y1: positions[from]?.y || 0,
//         x2: positions[to]?.x || 0,
//         y2: positions[to]?.y || 0,
//       }))

//       setPaths(pathsArray)
//     }
//   }, [dimensions.width, dimensions.height])

//   // Update AGV animations based on positions
//   useEffect(() => {
//     const newAnimations = { ...agvAnimations }

//     Object.entries(agvPositions).forEach(([agv, position]) => {
//       const nodePos = nodePositions[position]
//       if (nodePos) {
//         newAnimations[agv] = {
//           x: nodePos.x,
//           y: nodePos.y,
//         }
//       }
//     })

//     setAgvAnimations(newAnimations)
//   }, [agvPositions, nodePositions])

//   // Get color based on battery level
//   const getBatteryColor = (level) => {
//     if (level > 70) return "text-green-500"
//     if (level > 30) return "text-yellow-500"
//     return "text-red-500"
//   }

//   // Get color based on AGV status
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "In Transit":
//         return "text-blue-400"
//       case "Delivered":
//         return "text-green-400"
//       case "Charging":
//         return "text-yellow-400"
//       default:
//         return "text-gray-400"
//     }
//   }

//   // Get AGV icon color based on which AGV it is
//   const getAgvColor = (agvId) => {
//     switch (agvId) {
//       case "agv_1":
//         return "#3b82f6" // blue
//       case "agv_2":
//         return "#10b981" // green
//       case "agv_3":
//         return "#f59e0b" // amber
//       default:
//         return "#6b7280" // gray
//     }
//   }

//   return (
//     <div
//       className="relative w-full h-[600px] bg-slate-900 rounded-lg border border-slate-700 overflow-hidden"
//       ref={canvasRef}
//     >
//       {/* Grid background */}
//       <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
//         {Array.from({ length: 144 }).map((_, i) => (
//           <div key={i} className="border-[0.5px] border-slate-800" />
//         ))}
//       </div>

//       {/* Paths between nodes */}
//       <svg className="absolute inset-0 w-full h-full">
//         {paths.map((path, index) => (
//           <line
//             key={`path-${index}`}
//             x1={path.x1}
//             y1={path.y1}
//             x2={path.x2}
//             y2={path.y2}
//             stroke="#475569"
//             strokeWidth="2"
//             strokeDasharray="4"
//           />
//         ))}
//       </svg>

//       {/* Nodes */}
//       {Object.entries(nodePositions).map(([nodeId, position]) => (
//         <div
//           key={`node-${nodeId}`}
//           className={`absolute w-16 h-16 -ml-8 -mt-8 rounded-full flex items-center justify-center text-xl font-bold ${
//             nodeId === "9" ? "bg-green-900 border-2 border-green-500" : "bg-slate-700 border border-slate-600"
//           } ${nodeId === "9" ? "text-green-300" : "text-white"}`}
//           style={{
//             left: position.x,
//             top: position.y,
//             boxShadow: nodeId === "9" ? "0 0 15px rgba(34, 197, 94, 0.5)" : "none",
//             zIndex: 10,
//           }}
//         >
//           {nodeId}
//           {nodeId === "9" && <div className="absolute -top-8 text-xs text-green-400 font-normal">Charging Station</div>}
//         </div>
//       ))}

//       {/* AGVs */}
//       {Object.entries(agvAnimations).map(([agvId, position]) => (
//         <motion.div
//           key={agvId}
//           className="absolute flex flex-col items-center"
//           initial={{ x: position.x, y: position.y }}
//           animate={{ x: position.x, y: position.y }}
//           transition={{
//             type: "spring",
//             stiffness: 100,
//             damping: 20,
//             duration: 1,
//           }}
//           style={{
//             zIndex: 20,
//             marginLeft: -30,
//             marginTop: -30,
//           }}
//         >
//           <div
//             className={`w-14 h-14 rounded-lg flex items-center justify-center ${
//               agvStatuses[agvId]?.status === "In Transit" ? "animate-pulse" : ""
//             }`}
//             style={{
//               backgroundColor: getAgvColor(agvId),
//               boxShadow: `0 0 15px ${getAgvColor(agvId)}80`,
//             }}
//           >
//             <Truck className="w-8 h-8 text-white" />
//           </div>

//           <div className="mt-1 px-2 py-1 bg-slate-800 rounded text-xs font-bold text-white">{agvId.toUpperCase()}</div>

//           {/* Status indicators */}
//           <div className="absolute -right-16 -top-2 flex flex-col gap-1">
//             <div className={`flex items-center gap-1 ${getBatteryColor(agvStatuses[agvId]?.battery)}`}>
//               <Battery className="w-3 h-3" />
//               <span className="text-xs">{agvStatuses[agvId]?.battery}%</span>
//             </div>

//             {agvStatuses[agvId]?.weight > 0 && (
//               <div className="flex items-center gap-1 text-yellow-400">
//                 <Package className="w-3 h-3" />
//                 <span className="text-xs">{agvStatuses[agvId]?.weight}</span>
//               </div>
//             )}

//             <div className={`text-xs font-medium ${getStatusColor(agvStatuses[agvId]?.status)}`}>
//               {agvStatuses[agvId]?.status}
//             </div>
//           </div>
//         </motion.div>
//       ))}

//       {/* Current path highlight */}
//       {currentLog && (
//         <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
//           {nodePositions[currentLog.From] && nodePositions[currentLog.To] && (
//             <motion.line
//               initial={{ pathLength: 0, opacity: 0 }}
//               animate={{ pathLength: 1, opacity: 1 }}
//               transition={{ duration: 1.5, ease: "easeInOut" }}
//               x1={nodePositions[currentLog.From].x}
//               y1={nodePositions[currentLog.From].y}
//               x2={nodePositions[currentLog.To].x}
//               y2={nodePositions[currentLog.To].y}
//               stroke={getAgvColor(currentLog.AGV)}
//               strokeWidth="3"
//               strokeLinecap="round"
//               strokeDasharray="0"
//             />
//           )}
//         </svg>
//       )}

//       {/* Legend */}
//       <div className="absolute bottom-4 right-4 bg-slate-800 bg-opacity-80 p-3 rounded-lg border border-slate-700">
//         <div className="text-xs font-bold mb-2 text-slate-300">Legend</div>
//         <div className="flex items-center gap-2 mb-1">
//           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//           <span className="text-xs text-slate-300">AGV 1</span>
//         </div>
//         <div className="flex items-center gap-2 mb-1">
//           <div className="w-3 h-3 rounded-full bg-green-500"></div>
//           <span className="text-xs text-slate-300">AGV 2</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//           <span className="text-xs text-slate-300">AGV 3</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RouteMap

"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Battery, Package, Truck } from "lucide-react"

const RouteMap = ({ agvPositions, agvStatuses, currentLogs }) => {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [nodePositions, setNodePositions] = useState({})
  const [paths, setPaths] = useState([])
  const [agvAnimations, setAgvAnimations] = useState({
    agv_1: { x: 0, y: 0 },
    agv_2: { x: 0, y: 0 },
    agv_3: { x: 0, y: 0 },
  })

  // Define the grid layout
  const gridLayout = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]

  // Define connections between nodes (horizontal and vertical only to match reference image)
  const connections = [
    [1, 2],
    [2, 3],
    [1, 4],
    [2, 5],
    [3, 6],
    // [4, 5],
    [5, 6],
    [4, 7],
    [5, 8],
    // [6, 9],
    [7, 8],
    [8, 9],
  ]

  // Calculate node positions based on canvas size
  useEffect(() => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      const padding = 80
      const nodeWidth = (width - padding * 2) / 3
      const nodeHeight = (height - padding * 2) / 3

      const positions = {}
      gridLayout.forEach((row, rowIndex) => {
        row.forEach((nodeId, colIndex) => {
          positions[nodeId] = {
            x: padding + colIndex * nodeWidth + nodeWidth / 2,
            y: padding + rowIndex * nodeHeight + nodeHeight / 2,
          }
        })
      })

      setNodePositions(positions)

      // Calculate paths
      const pathsArray = connections.map(([from, to]) => ({
        from,
        to,
        x1: positions[from]?.x || 0,
        y1: positions[from]?.y || 0,
        x2: positions[to]?.x || 0,
        y2: positions[to]?.y || 0,
      }))

      setPaths(pathsArray)
    }
  }, [dimensions.width, dimensions.height])

  // Update AGV animations based on positions
  useEffect(() => {
    const newAnimations = { ...agvAnimations }

    Object.entries(agvPositions).forEach(([agv, position]) => {
      const nodePos = nodePositions[position]
      if (nodePos) {
        newAnimations[agv] = {
          x: nodePos.x,
          y: nodePos.y,
        }
      }
    })

    setAgvAnimations(newAnimations)
  }, [agvPositions, nodePositions])

  // Get color based on battery level
  const getBatteryColor = (level) => {
    if (level > 70) return "text-green-400"
    if (level > 30) return "text-yellow-400"
    return "text-red-400"
  }

  // Get color based on AGV status
  const getStatusColor = (status) => {
    switch (status) {
      case "In Transit":
        return "text-blue-400"
      case "Delivered":
        return "text-green-400"
      case "Charging":
        return "text-yellow-400"
      case "charge":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  // Get AGV icon color based on which AGV it is
  const getAgvColor = (agvId) => {
    switch (agvId) {
      case "agv_1":
        return "#4287f5" // blue
      case "agv_2":
        return "#42c78a" // green
      case "agv_3":
        return "#f5a742" // amber
      default:
        return "#6b7280" // gray
    }
  }

  return (
    <div className="relative w-full h-[600px] bg-[#0d1429] rounded-lg overflow-hidden" ref={canvasRef}>
      {/* Grid background - exact match to reference image */}
      <div className="absolute inset-0">
        <div className="w-full h-full grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#1a2747]" />
          ))}
        </div>
      </div>

      {/* Paths between nodes - straight lines only */}
      <svg className="absolute inset-0 w-full h-full">
        {paths.map((path, index) => (
          <line
            key={`path-${index}`}
            x1={path.x1}
            y1={path.y1}
            x2={path.x2}
            y2={path.y2}
            stroke="#475569"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* Current path highlights for each AGV */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
        {Object.entries(currentLogs).map(
          ([agvId, log]) =>
            nodePositions[log.From] &&
            nodePositions[log.To] && (
              <motion.line
                key={`path-${agvId}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                x1={nodePositions[log.From].x}
                y1={nodePositions[log.From].y}
                x2={nodePositions[log.To].x}
                y2={nodePositions[log.To].y}
                stroke={getAgvColor(agvId)}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ),
        )}
      </svg>

      {/* Nodes - styled to match reference image */}
      {Object.entries(nodePositions).map(([nodeId, position]) => (
        <div
          key={`node-${nodeId}`}
          className={`absolute flex items-center justify-center rounded-full border-2 ${
            nodeId === "9" ? "bg-[#8bc34a] border-[#7cb342] text-[#1b5e20]" : "bg-white border-gray-300 text-gray-700"
          }`}
          style={{
            left: position.x,
            top: position.y,
            width: "80px",
            height: "80px",
            transform: "translate(-40px, -40px)",
            fontSize: "24px",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          {nodeId}
          {nodeId === "9" && (
            <div className="absolute -top-8 text-xs text-green-400 font-normal whitespace-nowrap">Charging Station</div>
          )}
        </div>
      ))}

      {/* AGVs */}
      {Object.entries(agvAnimations).map(([agvId, position]) => (
        <motion.div
          key={agvId}
          className="absolute flex flex-col items-center"
          initial={{ x: position.x, y: position.y }}
          animate={{ x: position.x, y: position.y }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 1,
          }}
          style={{
            zIndex: 20,
            marginLeft: -30,
            marginTop: -30,
          }}
        >
          <div
            className={`w-14 h-14 rounded-lg flex items-center justify-center ${
              agvStatuses[agvId]?.status === "In Transit" ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: getAgvColor(agvId),
              boxShadow: `0 0 15px ${getAgvColor(agvId)}80`,
            }}
          >
            <Truck className="w-8 h-8 text-white" />
          </div>

          <div className="mt-1 px-2 py-1 bg-[#1a2747] rounded text-xs font-bold text-white">{agvId.toUpperCase()}</div>

          {/* Status indicators */}
          <div className="absolute -right-16 -top-2 flex flex-col gap-1">
            <div className={`flex items-center gap-1 ${getBatteryColor(agvStatuses[agvId]?.battery)}`}>
              <Battery className="w-3 h-3" />
              <span className="text-xs">{agvStatuses[agvId]?.battery}%</span>
            </div>

            {agvStatuses[agvId]?.weight > 0 && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Package className="w-3 h-3" />
                <span className="text-xs">{agvStatuses[agvId]?.weight}</span>
              </div>
            )}

            <div className={`text-xs font-medium ${getStatusColor(agvStatuses[agvId]?.status)}`}>
              {agvStatuses[agvId]?.status}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-[#1a2747] bg-opacity-80 p-3 rounded-lg border border-[#243462]">
        <div className="text-xs font-bold mb-2 text-white">Legend</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#4287f5" }}></div>
          <span className="text-xs text-white">AGV 1</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#42c78a" }}></div>
          <span className="text-xs text-white">AGV 2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f5a742" }}></div>
          <span className="text-xs text-white">AGV 3</span>
        </div>
      </div>
    </div>
  )
}

export default RouteMap
