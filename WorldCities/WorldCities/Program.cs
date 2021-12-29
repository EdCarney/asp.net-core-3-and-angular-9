using HealthCheck.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure static file options
var staticFileHeader = new HeaderConfig();
builder.Configuration.GetSection("StaticFiles:Headers").Bind(staticFileHeader);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}

app.UseStaticFiles(new StaticFileOptions()
{
    OnPrepareResponse = context =>
    {
        context.Context.Response.Headers["Cache-Control"] = staticFileHeader.CacheControl;
        context.Context.Response.Headers["Pragma"] = staticFileHeader.Pragma;
        context.Context.Response.Headers["Expires"] = staticFileHeader.Expires;
    }
});
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");;

app.Run();

