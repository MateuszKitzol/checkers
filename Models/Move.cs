﻿namespace Checkers.Models
{
    public class Move
    {
        public int FromRow { get; set; }
        public int FromCol { get; set; }
        public int ToRow { get; set; }
        public int ToCol { get; set; }
        public bool IsKing { get; set; }
    }
}
