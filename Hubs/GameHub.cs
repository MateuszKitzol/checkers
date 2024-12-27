using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Checkers.Hubs
{
    public class GameHub : Hub
    {
        public async Task SendMove(string roomId, string move)
        {
            await Clients.Group(roomId).SendAsync("ReceiveMove", move);
        }

        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("UserJoined", Context.ConnectionId);
        }
    }
}
