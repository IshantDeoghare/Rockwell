// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ChevronDown, ChevronUp, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuCheckboxItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const ExecutionLogs = ({ logs, currentLogIndex }) => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
//   const [filters, setFilters] = useState({
//     agv: [],
//     status: [],
//   })

//   // Get unique values for filters
//   const uniqueAgvs = [...new Set(logs.map((log) => log.AGV))]
//   const uniqueStatuses = [...new Set(logs.map((log) => log.Status))]

//   // Handle sorting
//   const requestSort = (key) => {
//     let direction = "ascending"
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending"
//     }
//     setSortConfig({ key, direction })
//   }

//   // Get sorted and filtered logs
//   const getSortedAndFilteredLogs = () => {
//     let filteredLogs = [...logs]

//     // Apply search
//     if (searchTerm) {
//       filteredLogs = filteredLogs.filter((log) =>
//         Object.values(log).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
//       )
//     }

//     // Apply filters
//     if (filters.agv.length > 0) {
//       filteredLogs = filteredLogs.filter((log) => filters.agv.includes(log.AGV))
//     }

//     if (filters.status.length > 0) {
//       filteredLogs = filteredLogs.filter((log) => filters.status.includes(log.Status))
//     }

//     // Apply sorting
//     if (sortConfig.key) {
//       filteredLogs.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? -1 : 1
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? 1 : -1
//         }
//         return 0
//       })
//     }

//     return filteredLogs
//   }

//   const sortedAndFilteredLogs = getSortedAndFilteredLogs()

//   // Get sort direction icon
//   const getSortDirectionIcon = (key) => {
//     if (sortConfig.key !== key) return null
//     return sortConfig.direction === "ascending" ? (
//       <ChevronUp className="h-4 w-4" />
//     ) : (
//       <ChevronDown className="h-4 w-4" />
//     )
//   }

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "In Transit":
//         return "bg-blue-500"
//       case "Delivered":
//         return "bg-green-500"
//       case "Charging":
//         return "bg-yellow-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Input
//             type="text"
//             placeholder="Search logs..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="bg-slate-700 border-slate-600 text-white"
//           />
//         </div>

//         <div className="flex gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="bg-slate-700 border-slate-600 text-white">
//                 <Filter className="h-4 w-4 mr-2" /> AGV
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="bg-slate-700 border-slate-600 text-white">
//               {uniqueAgvs.map((agv) => (
//                 <DropdownMenuCheckboxItem
//                   key={agv}
//                   checked={filters.agv.includes(agv)}
//                   onCheckedChange={(checked) => {
//                     if (checked) {
//                       setFilters((prev) => ({ ...prev, agv: [...prev.agv, agv] }))
//                     } else {
//                       setFilters((prev) => ({ ...prev, agv: prev.agv.filter((a) => a !== agv) }))
//                     }
//                   }}
//                 >
//                   {agv}
//                 </DropdownMenuCheckboxItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="bg-slate-700 border-slate-600 text-white">
//                 <Filter className="h-4 w-4 mr-2" /> Status
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="bg-slate-700 border-slate-600 text-white">
//               {uniqueStatuses.map((status) => (
//                 <DropdownMenuCheckboxItem
//                   key={status}
//                   checked={filters.status.includes(status)}
//                   onCheckedChange={(checked) => {
//                     if (checked) {
//                       setFilters((prev) => ({ ...prev, status: [...prev.status, status] }))
//                     } else {
//                       setFilters((prev) => ({ ...prev, status: prev.status.filter((s) => s !== status) }))
//                     }
//                   }}
//                 >
//                   {status}
//                 </DropdownMenuCheckboxItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-slate-700 text-left">
//               <th
//                 className="p-3 border-b border-slate-600 text-slate-300 font-medium cursor-pointer"
//                 onClick={() => requestSort("AGV")}
//               >
//                 <div className="flex items-center gap-1">AGV {getSortDirectionIcon("AGV")}</div>
//               </th>
//               <th
//                 className="p-3 border-b border-slate-600 text-slate-300 font-medium cursor-pointer"
//                 onClick={() => requestSort("From")}
//               >
//                 <div className="flex items-center gap-1">From {getSortDirectionIcon("From")}</div>
//               </th>
//               <th
//                 className="p-3 border-b border-slate-600 text-slate-300 font-medium cursor-pointer"
//                 onClick={() => requestSort("To")}
//               >
//                 <div className="flex items-center gap-1">To {getSortDirectionIcon("To")}</div>
//               </th>
//               <th
//                 className="p-3 border-b border-slate-600 text-slate-300 font-medium cursor-pointer"
//                 onClick={() => requestSort("Time")}
//               >
//                 <div className="flex items-center gap-1">Time {getSortDirectionIcon("Time")}</div>
//               </th>
//               <th
//                 className="p-3 border-b border-slate-600 text-slate-300 font-medium cursor-pointer"
//                 onClick={() => requestSort("Weight")}
//               >
//                 <div className="flex items-center gap-1">Weight {getSortDirectionIcon("Weight")}</div>
//               </th>
//               <th
//                 className="p-3 border-b border-slate-600 text-slate-300 font-medium cursor-pointer"
//                 onClick={() => requestSort("Payload")}
//               >
//                 <div className="flex items-center gap-1">Payload {getSortDirectionIcon("Payload")}</div>
//               </th>
//               <th
//                 className="p-3 border-b border-slate-600 text-slate-300 font-medium cursor-pointer"
//                 onClick={() => requestSort("Status")}
//               >
//                 <div className="flex items-center gap-1">Status {getSortDirectionIcon("Status")}</div>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {sortedAndFilteredLogs.map((log, index) => (
//                 <motion.tr
//                   key={`${log.AGV}-${log.Time}-${log.Payload}`}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className={`${index === currentLogIndex ? "bg-slate-600" : index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} hover:bg-slate-700 transition-colors`}
//                 >
//                   <td className="p-3 border-b border-slate-700 font-medium">{log.AGV}</td>
//                   <td className="p-3 border-b border-slate-700">{log.From}</td>
//                   <td className="p-3 border-b border-slate-700">{log.To}</td>
//                   <td className="p-3 border-b border-slate-700">{log.Time}</td>
//                   <td className="p-3 border-b border-slate-700">{log.Weight}</td>
//                   <td className="p-3 border-b border-slate-700">{log.Payload}</td>
//                   <td className="p-3 border-b border-slate-700">
//                     <div className="flex items-center gap-2">
//                       <span className={`w-2 h-2 rounded-full ${getStatusColor(log.Status)}`}></span>
//                       {log.Status}
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </AnimatePresence>
//             {sortedAndFilteredLogs.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="p-4 text-center text-slate-400">
//                   No logs found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default ExecutionLogs



"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react"

const ExecutionLogs = ({ logs, activeLogIndices }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [filters, setFilters] = useState({
    agv: [],
    status: [],
  })

  // Get unique values for filters
  const uniqueAgvs = [...new Set(logs.map((log) => log.AGV))]
  const uniqueStatuses = [...new Set(logs.map((log) => log.Status))]

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted and filtered logs
  const getSortedAndFilteredLogs = () => {
    let filteredLogs = [...logs]

    // Apply search
    if (searchTerm) {
      filteredLogs = filteredLogs.filter((log) =>
        Object.values(log).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply filters
    if (filters.agv.length > 0) {
      filteredLogs = filteredLogs.filter((log) => filters.agv.includes(log.AGV))
    }

    if (filters.status.length > 0) {
      filteredLogs = filteredLogs.filter((log) => filters.status.includes(log.Status))
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredLogs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return filteredLogs
  }

  const sortedAndFilteredLogs = getSortedAndFilteredLogs()

  // Get sort direction icon
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "In Transit":
        return "bg-blue-500"
      case "Delivered":
        return "bg-green-500"
      case "Charging":
        return "bg-yellow-500"
      case "charge":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#94a3b8]" />
          </div>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1a2747] border border-[#243462] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4287f5] focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              className="px-4 py-2 bg-[#1a2747] border border-[#243462] rounded-md text-white flex items-center gap-2"
              onClick={() => {
                const dropdown = document.getElementById("agv-dropdown")
                dropdown.classList.toggle("hidden")
              }}
            >
              <Filter className="h-4 w-4" /> AGV
            </button>
            <div
              id="agv-dropdown"
              className="absolute right-0 mt-2 w-48 bg-[#1a2747] border border-[#243462] rounded-md shadow-lg z-10 hidden"
            >
              {uniqueAgvs.map((agv) => (
                <div key={agv} className="px-4 py-2 hover:bg-[#243462] cursor-pointer flex items-center">
                  <input
                    type="checkbox"
                    id={`agv-${agv}`}
                    checked={filters.agv.includes(agv)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters((prev) => ({ ...prev, agv: [...prev.agv, agv] }))
                      } else {
                        setFilters((prev) => ({ ...prev, agv: prev.agv.filter((a) => a !== agv) }))
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`agv-${agv}`} className="text-white cursor-pointer flex-1">
                    {agv}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              className="px-4 py-2 bg-[#1a2747] border border-[#243462] rounded-md text-white flex items-center gap-2"
              onClick={() => {
                const dropdown = document.getElementById("status-dropdown")
                dropdown.classList.toggle("hidden")
              }}
            >
              <Filter className="h-4 w-4" /> Status
            </button>
            <div
              id="status-dropdown"
              className="absolute right-0 mt-2 w-48 bg-[#1a2747] border border-[#243462] rounded-md shadow-lg z-10 hidden"
            >
              {uniqueStatuses.map((status) => (
                <div key={status} className="px-4 py-2 hover:bg-[#243462] cursor-pointer flex items-center">
                  <input
                    type="checkbox"
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters((prev) => ({ ...prev, status: [...prev.status, status] }))
                      } else {
                        setFilters((prev) => ({ ...prev, status: prev.status.filter((s) => s !== status) }))
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`status-${status}`} className="text-white cursor-pointer flex-1">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1a2747] text-left">
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("AGV")}
              >
                <div className="flex items-center gap-1">AGV {getSortDirectionIcon("AGV")}</div>
              </th>
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("From")}
              >
                <div className="flex items-center gap-1">From {getSortDirectionIcon("From")}</div>
              </th>
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("To")}
              >
                <div className="flex items-center gap-1">To {getSortDirectionIcon("To")}</div>
              </th>
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("Time")}
              >
                <div className="flex items-center gap-1">Time {getSortDirectionIcon("Time")}</div>
              </th>
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("Weight")}
              >
                <div className="flex items-center gap-1">Weight {getSortDirectionIcon("Weight")}</div>
              </th>
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("Payload")}
              >
                <div className="flex items-center gap-1">Payload {getSortDirectionIcon("Payload")}</div>
              </th>
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("Status")}
              >
                <div className="flex items-center gap-1">Status {getSortDirectionIcon("Status")}</div>
              </th>
              <th
                className="p-3 border-b border-[#243462] text-white font-medium cursor-pointer"
                onClick={() => requestSort("Battery")}
              >
                <div className="flex items-center gap-1">Battery {getSortDirectionIcon("Battery")}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedAndFilteredLogs.map((log, index) => (
                <motion.tr
                  key={`${log.AGV}-${log.Time}-${log.Payload}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${activeLogIndices.includes(index) ? "bg-[#243462]" : index % 2 === 0 ? "bg-[#111936]" : "bg-[#162040]"} hover:bg-[#1a2747] transition-colors`}
                >
                  <td className="p-3 border-b border-[#243462] font-medium text-white">{log.AGV}</td>
                  <td className="p-3 border-b border-[#243462] text-white">{log.From}</td>
                  <td className="p-3 border-b border-[#243462] text-white">{log.To}</td>
                  <td className="p-3 border-b border-[#243462] text-white">{log.Time}</td>
                  <td className="p-3 border-b border-[#243462] text-white">{log.Weight}</td>
                  <td className="p-3 border-b border-[#243462] text-white">{log.Payload}</td>
                  <td className="p-3 border-b border-[#243462] text-white">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(log.Status)}`}></span>
                      {log.Status}
                    </div>
                  </td>
                  <td className="p-3 border-b border-[#243462] text-white">{log.Battery}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {sortedAndFilteredLogs.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-[#94a3b8]">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExecutionLogs
