using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller
{
    // Domyślna akcja - Index
    public IActionResult Index()
    {
        return View(); // Szuka widoku Index.cshtml w folderze Views/Home
    }

    // Opcjonalna akcja About
    public IActionResult About()
    {
        return View(); // Szuka widoku About.cshtml w folderze Views/Home
    }
}
