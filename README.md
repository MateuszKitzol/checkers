# Checkers Game

## 🏆 Project Overview

This is a **multiplayer Checkers game** built using:

- **Frontend:** React (with SignalR for real-time communication)
- **Backend:** ASP.NET Core (with SignalR Hub)

Players can:

- Come up with their nicknames. 
- Create and join rooms to play Checkers.
- Move their pieces and capture opponents.

## 🚀 How to Run Locally

### 1️⃣ **Clone the Repository**

```sh
git clone <your-repository-url>
cd <your-project-directory>
```

### 2️⃣ **Make the **``** Script Executable**

```sh
chmod +x build-and-run.sh
```

### 3️⃣ **Run the Project**

```sh
./build-and-run.sh
```

This script will:

- Build the frontend.
- Copy the build files to the backend’s `wwwroot/` directory.
- Clean, build, and run the .NET backend.

### 4️⃣ **Access the Application**

Once the script finishes execution:

- Open your browser and go to [**http://localhost:7116**](http://localhost:7116)
- Start playing!

## 🎮 Gameplay Features

- Real-time multiplayer checkers.
- Turn-based moves with SignalR synchronization.
- Automatic game-over detection.
- Room system that resets after each game.

## 🔧 Troubleshooting

- If you get **permission issues** running the script, use:
  ```sh
  chmod +x build-and-run.sh
  ```
- If you see **port conflicts**, make sure no other applications are using ports 7116 (backend) or 3000 (React development server).
- If SignalR doesn't connect, restart the project and check your browser console logs.

## 🌟 License

This project is open-source. Feel free to modify and improve it!

---

🚀 **Enjoy playing Checkers!**

