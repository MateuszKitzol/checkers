using Microsoft.AspNetCore.Mvc;

namespace Checkers.Controllers
{
    public class RoomController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
