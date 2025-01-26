#!/bin/bash

# Step 1: Navigate to the frontend directory
echo "Navigating to the frontend directory..."
cd frontend || { echo "Frontend directory not found! Exiting."; exit 1; }

# Step 2: Build the frontend (npm run build)
echo "Building the frontend..."
npm run build || { echo "Frontend build failed! Exiting."; exit 1; }

# Step 3: Go back to the previous directory
echo "Returning to the previous directory..."
cd - || { echo "Failed to return to the previous directory! Exiting."; exit 1; }

# Step 4: Delete all files in the wwwroot folder
echo "Deleting files in the wwwroot folder..."
rm -rf wwwroot/* || { echo "Failed to delete wwwroot files! Exiting."; exit 1; }

# Step 5: Copy the frontend build files to wwwroot
echo "Copying build files to wwwroot..."
cp -r frontend/build/* wwwroot/ || { echo "Failed to copy build files to wwwroot! Exiting."; exit 1; }

# Step 6: Build and run the .NET backend
echo "Building the .NET project..."
dotnet build || { echo "dotnet build failed! Exiting."; exit 1; }

echo "Running the .NET project..."
dotnet run || { echo "dotnet run failed! Exiting."; exit 1; }

# Step 7: Clean the .NET project
echo "Cleaning the .NET project..."
dotnet clean || { echo "dotnet clean failed! Exiting."; exit 1; }

echo "Script execution completed successfully."
