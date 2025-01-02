using Microsoft.AspNetCore.Mvc;

namespace Checkers.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        [HttpGet("status")]
        public IActionResult GetGameStatus()
        {
            return Ok(new { status = "Gra rozpoczęta", board = new string[8, 8] });
        }
    }
}
