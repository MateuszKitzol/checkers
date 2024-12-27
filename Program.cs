using Checkers.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Rejestracja us�ug w kontenerze DI
builder.Services.AddControllersWithViews(); // Obs�uga MVC
builder.Services.AddSignalR();             // Obs�uga SignalR

var app = builder.Build();

// Konfiguracja potoku HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection(); // Przekierowanie na HTTPS
app.UseStaticFiles();      // Obs�uga plik�w statycznych (CSS, JS itp.)

app.UseRouting();          // Obs�uga routingu

app.UseAuthorization();    // Obs�uga autoryzacji (mo�esz pomin�� dla anonimowych u�ytkownik�w)

// Mapowanie �cie�ek dla kontroler�w i SignalR
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapHub<GameHub>("/gameHub"); // Mapowanie SignalR Hub pod �cie�k� `/gameHub`

app.Run();
