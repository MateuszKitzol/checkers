namespace Checkers.Models
{
    public class Room
    {
        public string Id { get; set; }               // Unique identifier for the room
        public string Name { get; set; }             // Name of the room
        public string Status { get; set; }           // Status of the room (free, waiting, occupied)
        public List<string> Players { get; set; }    // List of players in the room

        public Room()
        {
            Players = new List<string>();            // Initialize the list of players
        }
    }
}
