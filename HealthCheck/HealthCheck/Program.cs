using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.SpaServices.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSpaStaticFiles(opt =>
{
    opt.RootPath = "src/assets/";
});

var app = builder.Build();
var env = app.Environment;

// Configure the HTTP request pipeline.
if (!env.IsDevelopment())
{
}

//app.UseHttpsRedirection();
app.UseStaticFiles();

if (env.IsDevelopment())
{
    app.UseSpaStaticFiles();
}

app.UseRouting();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    if (env.IsDevelopment())
    {
        spa.UseAngularCliServer("start");
    }
});

app.MapFallbackToFile("index.html");

app.Run();

