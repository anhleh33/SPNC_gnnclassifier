# 1. Start with a base image (the "OS" for your container)
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only your requirements file first to leverage caching
COPY Requirements-Full.txt .

# 4. Install dependencies
RUN pip install --no-cache-dir -r Requirements-Full.txt

# 5. Copy the rest of your application code
COPY . .

# 6. Expose the port your app runs on (e.g., 8000 for FastAPI/Uvicorn)
EXPOSE 8000

# 7. Define the command to run your app
CMD ["python", "app.py"]