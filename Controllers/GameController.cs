using Microsoft.AspNetCore.Mvc;

namespace Checkers.Controllers
{
    public class GameController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
