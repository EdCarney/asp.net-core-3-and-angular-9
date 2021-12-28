﻿using HealthCheck;
using HealthCheck.Models;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddOptions();
builder.Services.AddHealthChecks().
    .AddCheck("ICMP_01", new ICMPHealthCheck("www.ryadel.com", 100))
    .AddCheck("IMCP_02", new ICMPHealthCheck("www.google.com", 100))
    .AddCheck("ICMP_03", new ICMPHealthCheck("www.ksicb.com", 100));

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
app.UseHealthChecks("/hc", new CustomHealthCheckOptions());

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();

