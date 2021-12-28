using System;
using System.Net.NetworkInformation;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HealthCheck.Models
{
	public class ICMPHealthCheck : IHealthCheck
	{
        private string Host = "www.asdihg.com";
        private int Timeout = 300;

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                PingReply reply;
                using (var ping = new Ping())
                {
                    reply = await ping.SendPingAsync(Host);
                }

                switch (reply?.Status)
                {
                    case IPStatus.Success:
                        return reply.RoundtripTime < Timeout
                            ? HealthCheckResult.Healthy()
                            : HealthCheckResult.Degraded();
                    default:
                        return HealthCheckResult.Unhealthy();
                }
            }
            catch (Exception ex)
            {
                // log exception
                return HealthCheckResult.Unhealthy();
            }
        }
    }
}

