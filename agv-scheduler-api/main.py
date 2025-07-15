# # main.py
# from fastapi import FastAPI, HTTPException
# from model.scheduler import AGVScheduler
# import pandas as pd
# from datetime import datetime
# import logging
# import traceback

# app = FastAPI()

# # Configure logging
# logging.basicConfig(filename='logs/api.log', level=logging.INFO)

# def process_scheduler():
#     """Process the scheduler and return results"""
#     try:
#         # Load and process data
#         df = pd.read_csv("data/AGV_Hackathon_dataset.xlsx - Sheet1.csv")
        
#         # Convert scheduling time properly
#         df["Scheduled Time"] = df["Time of Scheduling"].apply(
#             lambda x: datetime.strptime(x, "%H:%M")
#         )
        
#         # Create tasks with proper datetime handling
#         tasks = []
#         for _, row in df.iterrows():
#             tasks.append({
#                 "ID": str(row["ID"]),
#                 "Source Station": row["Source Station"],
#                 "Destination Station": row["Destination Station"],
#                 "Payload Weight": row["Payload Weight"],
#                 "Priority": row["Priority"],
#                 "Scheduled Time": row["Scheduled Time"]
#             })
        
#         # Initialize and run scheduler
#         scheduler = AGVScheduler(agv_count=3, agv_capacity=10)
#         scheduler.schedule_tasks(tasks)
        
#         # Process logs with proper status mapping
#         log_df = scheduler.get_execution_logs_df()
        
#         # Convert logs to required format
#         formatted_logs = []
#         for _, log in log_df.iterrows():
#             formatted_logs.append({
#                 "AGV": log["AGV"],
#                 "From": str(log["From"]),
#                 "To": str(log["To"]),
#                 "Time": log["Time"],
#                 "Weight": str(log["Weight"]),
#                 "Payload": log["Payload"],
#                 "Status": log["Status"]
#             })
        
#         # Process summary report
#         summary = scheduler.get_summary_report()
        
#         return {
#             "logs": formatted_logs,
#             "summary": {
#                 "total_execution_minutes": round(summary["Total Execution Time (minutes)"], 1),
#                 "avg_delivery_times": {str(k): round(v, 1) for k, v in summary["Average Delivery Time by Priority"].items()},
#                 "charge_counts": {k: int(v) for k, v in summary["Number of Charges per AGV"].items()}
#             }
#         }
        
#     except Exception as e:
#         logging.error(f"Error processing scheduler: {str(e)}\n{traceback.format_exc()}")
#         raise

# @app.get("/schedule-results")
# async def get_schedule_results():
#     """Endpoint to retrieve AGV scheduling results"""
#     try:
#         logging.info("Processing AGV schedule request")
#         results = process_scheduler()
#         return {
#             "status": "success",
#             "data": results
#         }
#     except FileNotFoundError:
#         raise HTTPException(status_code=404, detail="Dataset file not found")
#     except Exception as e:
#         logging.error(f"API Error: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import FastAPI, HTTPException
from model.scheduler import AGVScheduler
import pandas as pd
from datetime import datetime
import logging
import traceback

app = FastAPI()

# Configure logging
logging.basicConfig(filename='logs/api.log', level=logging.INFO)

def process_scheduler():
    """Process the scheduler and return results"""
    try:
        # Load and process data
        df = pd.read_csv("data/AGV_Hackathon_dataset.xlsx - Sheet1.csv")
        
        # Convert scheduling time properly
        df["Scheduled Time"] = df["Time of Scheduling"].apply(
            lambda x: datetime.strptime(x, "%H:%M")
        )
        
        # Create tasks with proper datetime handling
        tasks = []
        for _, row in df.iterrows():
            tasks.append({
                "ID": str(row["ID"]),
                "Source Station": row["Source Station"],
                "Destination Station": row["Destination Station"],
                "Payload Weight": row["Payload Weight"],
                "Priority": row["Priority"],
                "Scheduled Time": row["Scheduled Time"]
            })
        
        # Initialize and run scheduler
        scheduler = AGVScheduler(agv_count=3, agv_capacity=10)
        scheduler.schedule_tasks(tasks)
        
        # Process logs with proper status mapping
        log_df = scheduler.get_execution_logs_df()
        
        # Convert logs to required format
        formatted_logs = []
        for _, log in log_df.iterrows():
            formatted_logs.append({
                "AGV": log["AGV"],
                "From": str(log["From"]),
                "To": str(log["To"]),
                "Time": log["Time"],
                "Weight": str(log["Weight"]),
                "Payload": log["Payload"],
                "Status": log["Status"],
                "Battery": str(log["Battery (mins left)"])
            })
        
        # Process summary report
        summary = scheduler.get_summary_report()
        
        return {
            "logs": formatted_logs,
            "summary": {
                "total_execution_minutes": round(summary["Total Execution Time (minutes)"], 1),
                "avg_delivery_times": {str(k): round(v, 1) for k, v in summary["Average Delivery Time by Priority"].items()},
                "charge_counts": {k: int(v) for k, v in summary["Number of Charges per AGV"].items()}
            }
        }
        
    except Exception as e:
        logging.error(f"Error processing scheduler: {str(e)}\n{traceback.format_exc()}")
        raise

@app.get("/schedule-results")
async def get_schedule_results():
    """Endpoint to retrieve AGV scheduling results"""
    try:
        logging.info("Processing AGV schedule request")
        results = process_scheduler()
        return {
            "status": "success",
            "data": results
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Dataset file not found")
    except Exception as e:
        logging.error(f"API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))