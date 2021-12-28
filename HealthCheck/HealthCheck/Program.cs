using HealthCheck.Models;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddOptions();
builder.Services.AddHealthChecks()
    .AddCheck<ICMPHealthCheck>("ICMP");

var app = builder.Build();

// Configure static file options

var staticFilesHeaderConfig = new HeaderConfig();
builder.Configuration.GetSection("StaticFiles:Headers").Bind(staticFilesHeaderConfig);
var staticFilesConfig = new StaticFileConfig() { Header = staticFilesHeaderConfig };

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}

app.UseStaticFiles(new StaticFileOptions()
{
    OnPrepareResponse = (context) =>
    {
        // disable caching for all static files
        context.Context.Response.Headers["Cache-Control"] = staticFilesConfig.Header.CacheControl;
        context.Context.Response.Headers["Pragma"] = staticFilesConfig.Header.Pragma;
        context.Context.Response.Headers["Expires"] = staticFilesConfig.Header.Expires;
    }
});

app.UseRouting();
app.UseHealthChecks("/hc");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();

