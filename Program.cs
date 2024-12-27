using Checkers.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Rejestracja us³ug w kontenerze DI
builder.Services.AddControllersWithViews(); // Obs³uga MVC
builder.Services.AddSignalR();             // Obs³uga SignalR

var app = builder.Build();

// Konfiguracja potoku HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection(); // Przekierowanie na HTTPS
app.UseStaticFiles();      // Obs³uga plików statycznych (CSS, JS itp.)

app.UseRouting();          // Obs³uga routingu

app.UseAuthorization();    // Obs³uga autoryzacji (mo¿esz pomin¹æ dla anonimowych u¿ytkowników)

// Mapowanie œcie¿ek dla kontrolerów i SignalR
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapHub<GameHub>("/gameHub"); // Mapowanie SignalR Hub pod œcie¿kê `/gameHub`

app.Run();
