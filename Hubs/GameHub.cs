using Microsoft.AspNetCore.SignalR;
using Checkers.Models; // Namespace for Room and Move models
using System.Collections.Concurrent;

namespace Checkers.Hubs
{
    public class GameHub : Hub
    {
        private static ConcurrentDictionary<string, string> Nicknames = new ConcurrentDictionary<string, string>();
        private static ConcurrentDictionary<string, Room> Rooms = new ConcurrentDictionary<string, Room>();

        /// <summary>
        /// Sets the nickname for a player.
        /// </summary>
        public Task SetNickname(string nickname)
        {
            Nicknames[Context.ConnectionId] = nickname;
            return Task.CompletedTask;
        }

        /// <summary>
        /// Sends the list of all rooms to the caller.
        /// </summary>
        public Task GetRooms()
        {
            return Clients.Caller.SendAsync("UpdateRooms", Rooms.Values);
        }

        /// <summary>
        /// Creates a new room and notifies all clients.
        /// </summary>
        public Task CreateRoom(string roomName)
        {
            var roomId = Guid.NewGuid().ToString();
            var room = new Room
            {
                Id = roomId,
                Name = roomName,
                Status = "free"
            };

            Rooms[roomId] = room;
            return Clients.All.SendAsync("UpdateRooms", Rooms.Values);
        }

        /// <summary>
        /// Handles a player joining a room.
        /// </summary>
        public async Task JoinRoom(string roomId, string playerName)
        {
            Console.WriteLine($"Player {playerName} is attempting to join room {roomId}");

            if (Rooms.TryGetValue(roomId, out var room))
            {
                Console.WriteLine($"Room {roomId} exists with {room.Players.Count} player(s): {string.Join(", ", room.Players)}");

                if (!room.Players.Contains(playerName))
                {
                    room.Players.Add(playerName);
                    Console.WriteLine($"Player {playerName} added to room {roomId}");
                }

                // Update the room status
                room.Status = room.Players.Count switch
                {
                    1 => "waiting",  // One player in the room
                    2 => "occupied", // Two players in the room
                    _ => room.Status
                };

                Console.WriteLine($"Room {roomId} status updated to {room.Status}");

                // Add the player to the SignalR group
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                Console.WriteLine($"Player {playerName} added to SignalR group {roomId}");

                // Notify all clients in the room about the updated player list
                await Clients.Group(roomId).SendAsync("PlayerJoined", room.Players);
                Console.WriteLine($"Notifying players in room {roomId}: {string.Join(", ", room.Players)}");

                // Notify all clients about the updated room list
                await Clients.All.SendAsync("UpdateRooms", Rooms.Values);
            }
            else
            {
                Console.WriteLine($"Room {roomId} not found");
                await Clients.Caller.SendAsync("RoomNotFound", roomId);
            }
        }



        /// <summary>
        /// Sends a game state update to all players in the room.
        /// </summary>
        public async Task SendGameUpdate(string roomId, object gameState)
        {
            await Clients.Group(roomId).SendAsync("UpdateGame", gameState);
        }

        /// <summary>
        /// Handles a player move in a room.
        /// </summary>
        public async Task SendMove(string roomId, Move move)
        {
            if (!Rooms.ContainsKey(roomId))
            {
                await Clients.Caller.SendAsync("Error", "Room not found");
                return;
            }

            await Clients.Group(roomId).SendAsync("ReceiveMove", move);
        }

        /// <summary>
        /// Handles player disconnection and updates room status.
        /// </summary>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine($"Connection {Context.ConnectionId} disconnected");

            // Remove the player from the room they were in
            foreach (var room in Rooms.Values)
            {
                if (room.Players.Remove(Nicknames.GetValueOrDefault(Context.ConnectionId)))
                {
                    Console.WriteLine($"Player removed from room {room.Id}");

                    // Update room status
                    room.Status = room.Players.Count switch
                    {
                        0 => "free",
                        1 => "waiting",
                        _ => room.Status
                    };

                    // Notify all clients about updated room list
                    await Clients.All.SendAsync("UpdateRooms", Rooms.Values);
                    break;
                }
            }

            // Remove the player from the nicknames dictionary
            Nicknames.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
