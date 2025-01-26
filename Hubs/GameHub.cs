using Microsoft.AspNetCore.SignalR;
using Checkers.Models; // Namespace for Room and Move models
using System.Collections.Concurrent;

namespace Checkers.Hubs
{
    public class GameHub : Hub
    {
        private static ConcurrentDictionary<string, string> Nicknames = new ConcurrentDictionary<string, string>();
        private static ConcurrentDictionary<string, Room> Rooms = new ConcurrentDictionary<string, Room>();

        public Task SetNickname(string nickname)
        {
            Nicknames[Context.ConnectionId] = nickname;
            return Task.CompletedTask;
        }

        public Task GetRooms()
        {
            return Clients.Caller.SendAsync("UpdateRooms", Rooms.Values);
        }

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

        public async Task JoinRoom(string roomId, string playerName)
        {
            Console.WriteLine($"[DEBUG] Player {playerName} is attempting to join room {roomId}");

            if (!Rooms.TryGetValue(roomId, out var room))
            {
                Console.WriteLine($"[DEBUG] Room {roomId} not found");
                await Clients.Caller.SendAsync("RoomNotFound", roomId);
                return;
            }

            if (!Nicknames.ContainsKey(Context.ConnectionId))
            {
                Console.WriteLine($"[DEBUG] Setting nickname for Connection ID {Context.ConnectionId} to {playerName}");
                Nicknames[Context.ConnectionId] = playerName;
            }

            if (!room.Players.Contains(Context.ConnectionId))
            {
                room.Players.Add(Context.ConnectionId);
                Console.WriteLine($"[DEBUG] Player {playerName} with Connection ID {Context.ConnectionId} added to room {roomId}");
            }

            if (string.IsNullOrEmpty(room.CurrentTurn))
            {
                room.CurrentTurn = room.Players[0]; // First player gets the first turn
                Console.WriteLine($"[DEBUG] Initial turn set to player: {Nicknames[room.CurrentTurn]}");
            }

            room.Status = room.Players.Count switch
            {
                1 => "waiting",
                2 => "occupied",
                _ => room.Status
            };

            await Clients.All.SendAsync("UpdateRooms", Rooms.Values);

            var playerNames = room.Players.Select(id => Nicknames[id]).ToList();
            await Clients.Group(roomId).SendAsync("PlayerJoined", playerNames, room.CurrentTurn);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            Console.WriteLine($"[DEBUG] Player {playerName} with Connection ID {Context.ConnectionId} added to SignalR group {roomId}");

            // Broadcast the initial turn
            await EnsureTurnSynchronization(roomId);
        }

        public async Task SendMove(string roomId, Move move)
        {
            Console.WriteLine($"[DEBUG] Move received: {move.FromRow},{move.FromCol} -> {move.ToRow},{move.ToCol}");

            if (!Rooms.TryGetValue(roomId, out var room))
            {
                Console.WriteLine($"[DEBUG] Room {roomId} not found.");
                await Clients.Caller.SendAsync("Error", "Room not found");
                return;
            }

            foreach (var playerId in room.Players)
            {
                if (playerId != Context.ConnectionId) // Send move to the opponent
                {
                    await Clients.Client(playerId).SendAsync("ReceiveMove", move);
                }
            }

            // Change the turn to the next player
            await ChangeTurn(roomId);
        }

        public async Task ChangeTurn(string roomId)
        {
            if (Rooms.TryGetValue(roomId, out var room) && room.Players.Count == 2)
            {
                room.CurrentTurn = room.Players[0] == room.CurrentTurn
                    ? room.Players[1]
                    : room.Players[0];

                Console.WriteLine($"[DEBUG] Turn changed in room {roomId}. New CurrentTurn: {Nicknames[room.CurrentTurn]}");

                // Notify all clients in the room about the new turn
                await EnsureTurnSynchronization(roomId);
            }
        }

        public async Task SendGameUpdate(string roomId, object gameState)
        {
            await Clients.Group(roomId).SendAsync("UpdateGame", gameState);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine($"[DEBUG] Connection {Context.ConnectionId} disconnected");

            foreach (var room in Rooms.Values)
            {
                if (room.Players.Remove(Context.ConnectionId))
                {
                    Console.WriteLine($"[DEBUG] Player removed from room {room.Id}");

                    room.Status = room.Players.Count switch
                    {
                        0 => "free",
                        1 => "waiting",
                        _ => room.Status
                    };

                    await Clients.All.SendAsync("UpdateRooms", Rooms.Values);
                    break;
                }
            }

            Nicknames.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Ensures turn synchronization by sending the current turn to all clients in a room.
        /// </summary>
        private async Task EnsureTurnSynchronization(string roomId)
        {
            if (Rooms.TryGetValue(roomId, out var room))
            {
                Console.WriteLine($"[DEBUG] Ensuring turn sync for room {roomId}: CurrentTurn={Nicknames[room.CurrentTurn]}");
                await Clients.Group(roomId).SendAsync("UpdateTurn", room.CurrentTurn);
            }
        }
    }
}
