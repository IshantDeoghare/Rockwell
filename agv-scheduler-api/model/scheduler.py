# # model/scheduler.py
# import networkx as nx
# import pandas as pd
# from datetime import datetime, timedelta

# class AGVScheduler:
#     def __init__(self, agv_count, agv_capacity, charging_station=9):
#         self.graph = self._create_graph()
#         self.agv_count = agv_count
#         self.agv_capacity = agv_capacity
#         self.charging_station = charging_station
#         self.empty_speed = 5
#         self.full_speed = 10
#         self.charging_time = timedelta(minutes=15)
#         self.discharge_time = timedelta(minutes=45)
#         self.agvs = self._init_agvs()
#         self.execution_logs = []
#         self.delivery_times = {1: [], 2: [], 3: []}
#         self.charge_counts = {f"agv_{i+1}": 0 for i in range(agv_count)}
#         self.occupied_edges = {}
#         self.unassigned_tasks = []

#     def _create_graph(self):
#         G = nx.Graph()
#         edges = [(1, 2), (2, 3), (1, 4), (4, 7), (2, 5), (5, 8),
#                  (7, 8), (3, 6), (5, 6), (8, 9)]
#         G.add_edges_from(edges)
#         return G

#     def draw_graph(self):
#         import matplotlib.pyplot as plt
#         pos = {1:(0,2), 2:(1,2), 3:(2,2), 4:(0,1), 5:(1,1), 6:(2,1),
#                7:(0,0), 8:(1,0), 9:(2,0)}
#         nx.draw(self.graph, pos, with_labels=True,
#                 node_color='lightgreen', node_size=1000,
#                 font_size=12, edge_color='gray')
#         plt.title("AGV Station Network")
#         plt.show()

#     def _init_agvs(self):
#         return {
#             f"agv_{i+1}": {
#                 "position": pos,
#                 "battery": self.discharge_time,
#                 "time": datetime.strptime("8:00", "%H:%M"),
#                 "queue": [],
#                 "load": 0
#             } for i, pos in enumerate([1, 3, 7])
#         }

#     def _calculate_travel_time(self, path, load_weight):
#         unit_time = (self.full_speed if load_weight >= self.agv_capacity
#                      else self.empty_speed + int(load_weight/self.agv_capacity * 
#                      (self.full_speed - self.empty_speed)))
#         return timedelta(minutes=unit_time * (len(path)-1))

#     def _is_edge_available(self, edge, time):
#         return self.occupied_edges.get((edge, time.strftime('%H:%M')), None) is None

#     def _reserve_edge(self, edge, time, agv):
#         self.occupied_edges[(edge, time.strftime('%H:%M'))] = agv

#     def schedule_tasks(self, tasks):
#         tasks.sort(key=lambda x: (x['Priority'], x['Scheduled Time']))
#         retry_queue = tasks[:]
#         max_retries = 3
#         retry_attempt = 0

#         while retry_queue and retry_attempt < max_retries:
#             new_retry_queue = []
#             for task in retry_queue:
#                 assigned = self._assign_task(task)
#                 if not assigned:
#                     task['Scheduled Time'] += timedelta(minutes=5)
#                     new_retry_queue.append(task)
#             retry_queue = new_retry_queue
#             retry_attempt += 1

#     def _assign_task(self, task):
#         src = task['Source Station']
#         dest = task['Destination Station']
#         weight, priority = task['Payload Weight'], task['Priority']
#         sched_time = task['Scheduled Time']
#         best_agv, best_time = None, None

#         for agv, state in self.agvs.items():
#             if weight + state['load'] > self.agv_capacity:
#                 continue

#             if state['battery'] < self._calculate_travel_time(
#                 nx.shortest_path(self.graph, state['position'], src), 0):
#                 charge_path = nx.shortest_path(self.graph, state['position'], self.charging_station)
#                 charge_time = state['time']
#                 for i in range(len(charge_path) - 1):
#                     self.execution_logs.append(
#                         f"{agv}-{charge_path[i]}-{charge_path[i+1]}-"
#                         f"{charge_time.strftime('%H:%M')}-0-charge-charge")
#                     travel_time = self._calculate_travel_time([charge_path[i], charge_path[i+1]], 0)
#                     charge_time += travel_time
#                 self.charge_counts[agv] += 1
#                 self.agvs[agv]['position'] = self.charging_station
#                 self.agvs[agv]['battery'] = self.discharge_time
#                 self.agvs[agv]['time'] = charge_time + self.charging_time

#             path_to_src = nx.shortest_path(self.graph, self.agvs[agv]['position'], src)
#             travel_time_to_src = self._calculate_travel_time(path_to_src, 0)
#             path_to_dest = nx.shortest_path(self.graph, src, dest)
#             travel_time_to_dest = self._calculate_travel_time(path_to_dest, weight)
#             final_delivery_time = max(self.agvs[agv]['time'], sched_time) + travel_time_to_src + travel_time_to_dest

#             if not best_time or final_delivery_time < best_time:
#                 best_time = final_delivery_time
#                 best_agv = agv
#                 best_path_src = path_to_src
#                 best_path_dest = path_to_dest
#                 best_start_time = max(self.agvs[agv]['time'], sched_time)

#         if not best_agv:
#             return False

#         cur_time = best_start_time

#         for i in range(len(best_path_src)-1):
#             edge = (best_path_src[i], best_path_src[i+1])
#             self._reserve_edge(edge, cur_time, best_agv)
#             self.execution_logs.append(
#                 f"{best_agv}-{edge[0]}-{edge[1]}-"
#                 f"{cur_time.strftime('%H:%M')}-0-{task['ID']}-In Transit")
#             travel_time = self._calculate_travel_time([edge[0], edge[1]], 0)
#             cur_time += travel_time
#             self.agvs[best_agv]['battery'] -= travel_time

#         for i in range(len(best_path_dest)-1):
#             edge = (best_path_dest[i], best_path_dest[i+1])
#             self._reserve_edge(edge, cur_time, best_agv)
#             delivery_status = "Delivered" if i == len(best_path_dest)-2 else "In Transit"
#             self.execution_logs.append(
#                 f"{best_agv}-{edge[0]}-{edge[1]}-"
#                 f"{cur_time.strftime('%H:%M')}-{weight}-{task['ID']}-{delivery_status}")
#             travel_time = self._calculate_travel_time([edge[0], edge[1]], weight)
#             cur_time += travel_time
#             self.agvs[best_agv]['battery'] -= travel_time

#         self.agvs[best_agv]['position'] = dest
#         self.agvs[best_agv]['time'] = cur_time
#         self.agvs[best_agv]['queue'].append(task)
#         self.agvs[best_agv]['load'] -= weight if self.agvs[best_agv]['load'] >= weight else 0
#         self.delivery_times[priority].append((cur_time - sched_time).total_seconds() / 60)
#         return True

#     def get_summary_report(self):
#         total_exec_time = max(self.agvs[agv]['time'] for agv in self.agvs) - datetime.strptime("8:00", "%H:%M")
#         avg_delivery_by_priority = {
#             p: round(sum(self.delivery_times[p])/len(self.delivery_times[p]), 2) if self.delivery_times[p] else 0
#             for p in self.delivery_times
#         }
#         return {
#             "Total Execution Time (minutes)": total_exec_time.total_seconds() / 60,
#             "Average Delivery Time by Priority": avg_delivery_by_priority,
#             "Number of Charges per AGV": self.charge_counts
#         }

#     def get_execution_logs_df(self):
#         logs = []
#         for log in self.execution_logs:
#             parts = log.split('-')
#             if len(parts) >=7:
#                 logs.append({
#                     "AGV": parts[0],
#                     "From": parts[1],
#                     "To": parts[2],
#                     "Time": parts[3],
#                     "Weight": parts[4],
#                     "Payload": parts[5],
#                     "Status": parts[6]
#                 })
#         return pd.DataFrame(logs)

#     def get_agv_status(self):
#         status = []
#         for agv, state in self.agvs.items():
#             status.append({
#                 "AGV": agv,
#                 "Position": state['position'],
#                 "Battery (mins left)": int(state['battery'].total_seconds() / 60),
#                 "Current Time": state['time'].strftime("%H:%M"),
#                 "Queue Size": len(state['queue']),
#                 "Current Load": state['load']
#             })
#         return pd.DataFrame(status)

import networkx as nx
import pandas as pd
from datetime import datetime, timedelta

class AGVScheduler:
    def __init__(self, agv_count, agv_capacity, charging_station=9):
        self.graph = self._create_graph()
        self.agv_count = agv_count
        self.agv_capacity = agv_capacity
        self.charging_station = charging_station
        self.empty_speed = 5
        self.full_speed = 10
        self.charging_time = timedelta(minutes=15)
        self.discharge_time = timedelta(minutes=45)
        self.agvs = self._init_agvs()
        self.execution_logs = []
        self.delivery_times = {1: [], 2: [], 3: []}
        self.charge_counts = {f"agv_{i+1}": 0 for i in range(agv_count)}
        self.occupied_edges = {}
        self.unassigned_tasks = []

    def _create_graph(self):
        G = nx.Graph()
        edges = [(1, 2), (2, 3), (1, 4), (4, 7), (2, 5), (5, 8),
                 (7, 8), (3, 6), (5, 6), (8, 9)]
        G.add_edges_from(edges)
        return G

    def draw_graph(self):
        import matplotlib.pyplot as plt
        pos = {1:(0,2), 2:(1,2), 3:(2,2), 4:(0,1), 5:(1,1), 6:(2,1),
               7:(0,0), 8:(1,0), 9:(2,0)}
        nx.draw(self.graph, pos, with_labels=True,
                node_color='lightgreen', node_size=1000,
                font_size=12, edge_color='gray')
        plt.title("AGV Station Network")
        plt.show()

    def _init_agvs(self):
        return {
            f"agv_{i+1}": {
                "position": pos,
                "battery": self.discharge_time,
                "time": datetime.strptime("8:00", "%H:%M"),
                "queue": [],
                "load": 0
            } for i, pos in enumerate([1, 3, 7])
        }

    def _calculate_travel_time(self, path, load_weight):
        unit_time = (self.empty_speed + (load_weight / self.agv_capacity) * 
                     (self.full_speed - self.empty_speed))
        return timedelta(minutes=unit_time * (len(path)-1))

    def _calculate_battery_reduction(self, weight):
        return timedelta(minutes=self.empty_speed + 
                        (weight / self.agv_capacity * 
                        (self.full_speed - self.empty_speed)))

    def _is_edge_available(self, edge, time):
        return self.occupied_edges.get((edge, time.strftime('%H:%M')), None) is None

    def _reserve_edge(self, edge, time, agv):
        self.occupied_edges[(edge, time.strftime('%H:%M'))] = agv

    def schedule_tasks(self, tasks):
        tasks.sort(key=lambda x: (x['Priority'], x['Scheduled Time']))
        retry_queue = tasks[:]
        max_retries = 3
        retry_attempt = 0

        while retry_queue and retry_attempt < max_retries:
            new_retry_queue = []
            for task in retry_queue:
                assigned = self._assign_task(task)
                if not assigned:
                    task['Scheduled Time'] += timedelta(minutes=5)
                    new_retry_queue.append(task)
            retry_queue = new_retry_queue
            retry_attempt += 1

    def _assign_task(self, task):
        src = task['Source Station']
        dest = task['Destination Station']
        weight, priority = task['Payload Weight'], task['Priority']
        sched_time = task['Scheduled Time']
        best_agv, best_time = None, None

        for agv, state in self.agvs.items():
            if weight + state['load'] > self.agv_capacity:
                continue

            if state['battery'] < self._calculate_travel_time(
                nx.shortest_path(self.graph, state['position'], src), 0):
                charge_path = nx.shortest_path(self.graph, state['position'], self.charging_station)
                charge_time = state['time']
                for i in range(len(charge_path) - 1):
                    edge = (charge_path[i], charge_path[i+1])
                    battery_level = int(self.agvs[agv]['battery'].total_seconds() / 60)
                    self.execution_logs.append(
                        f"{agv}-{edge[0]}-{edge[1]}-"
                        f"{charge_time.strftime('%H:%M')}-0-charge-charge-{battery_level}")
                    travel_time = self._calculate_travel_time([edge[0], edge[1]], 0)
                    charge_time += travel_time
                    self.agvs[agv]['battery'] -= travel_time
                self.charge_counts[agv] += 1
                self.agvs[agv]['position'] = self.charging_station
                self.agvs[agv]['battery'] = self.discharge_time
                self.agvs[agv]['time'] = charge_time + self.charging_time

            path_to_src = nx.shortest_path(self.graph, self.agvs[agv]['position'], src)
            travel_time_to_src = self._calculate_travel_time(path_to_src, 0)
            path_to_dest = nx.shortest_path(self.graph, src, dest)
            travel_time_to_dest = self._calculate_travel_time(path_to_dest, weight)
            final_delivery_time = max(self.agvs[agv]['time'], sched_time) + travel_time_to_src + travel_time_to_dest

            if not best_time or final_delivery_time < best_time:
                best_time = final_delivery_time
                best_agv = agv
                best_path_src = path_to_src
                best_path_dest = path_to_dest
                best_start_time = max(self.agvs[agv]['time'], sched_time)

        if not best_agv:
            return False

        cur_time = best_start_time

        for i in range(len(best_path_src)-1):
            edge = (best_path_src[i], best_path_src[i+1])
            self._reserve_edge(edge, cur_time, best_agv)
            battery_level = int(self.agvs[best_agv]['battery'].total_seconds() / 60)
            self.execution_logs.append(
                f"{best_agv}-{edge[0]}-{edge[1]}-"
                f"{cur_time.strftime('%H:%M')}-0-{task['ID']}-In Transit-{battery_level}")
            travel_time = self._calculate_travel_time([edge[0], edge[1]], 0)
            cur_time += travel_time
            self.agvs[best_agv]['battery'] -= travel_time

        for i in range(len(best_path_dest)-1):
            edge = (best_path_dest[i], best_path_dest[i+1])
            self._reserve_edge(edge, cur_time, best_agv)
            delivery_status = "Delivered" if i == len(best_path_dest)-2 else "In Transit"
            battery_level = int(self.agvs[best_agv]['battery'].total_seconds() / 60)
            self.execution_logs.append(
                f"{best_agv}-{edge[0]}-{edge[1]}-"
                f"{cur_time.strftime('%H:%M')}-{weight}-{task['ID']}-{delivery_status}-{battery_level}")
            travel_time = self._calculate_travel_time([edge[0], edge[1]], weight)
            cur_time += travel_time
            self.agvs[best_agv]['battery'] -= travel_time

        self.agvs[best_agv]['position'] = dest
        self.agvs[best_agv]['time'] = cur_time
        self.agvs[best_agv]['queue'].append(task)
        self.agvs[best_agv]['load'] -= weight if self.agvs[best_agv]['load'] >= weight else 0
        self.delivery_times[priority].append((cur_time - sched_time).total_seconds() / 60)
        return True

    def get_summary_report(self):
        total_exec_time = max(self.agvs[agv]['time'] for agv in self.agvs) - datetime.strptime("8:00", "%H:%M")
        avg_delivery_by_priority = {
            p: round(sum(self.delivery_times[p])/len(self.delivery_times[p]), 2) if self.delivery_times[p] else 0
            for p in self.delivery_times
        }
        return {
            "Total Execution Time (minutes)": total_exec_time.total_seconds() / 60,
            "Average Delivery Time by Priority": avg_delivery_by_priority,
            "Number of Charges per AGV": self.charge_counts
        }

    def get_execution_logs_df(self):
        logs = []
        for log in self.execution_logs:
            parts = log.split('-')
            if len(parts) >=8:
                logs.append({
                    "AGV": parts[0],
                    "From": parts[1],
                    "To": parts[2],
                    "Time": parts[3],
                    "Weight": parts[4],
                    "Payload": parts[5],
                    "Status": parts[6],
                    "Battery (mins left)": parts[7]
                })
        return pd.DataFrame(logs)

    def get_agv_status(self):
        status = []
        for agv, state in self.agvs.items():
            status.append({
                "AGV": agv,
                "Position": state['position'],
                "Battery (mins left)": int(state['battery'].total_seconds() / 60),
                "Current Time": state['time'].strftime("%H:%M"),
                "Queue Size": len(state['queue']),
                "Current Load": state['load']
            })
        return pd.DataFrame(status)