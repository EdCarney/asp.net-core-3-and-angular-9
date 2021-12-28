using System;
using System.Net.NetworkInformation;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HealthCheck
{
	public class ICMPHealthCheck : IHealthCheck
	{
        string Host { get; }
        int TimeoutMs { get; }

        private string ErrorMsg => $"ICMP to {Host} failed";

        public ICMPHealthCheck(string host, int timeoutMs)
        {
            Host = host ?? string.Empty;
            TimeoutMs = timeoutMs;
        }

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
                        string msg = $"ICMP to {Host} took {reply.RoundtripTime}";
                        return reply.RoundtripTime < TimeoutMs
                            ? HealthCheckResult.Healthy(msg)
                            : HealthCheckResult.Degraded(msg);
                    default:
                        return HealthCheckResult.Unhealthy(ErrorMsg);
                }
            }
            catch (Exception ex)
            {
                // log exception
                return HealthCheckResult.Unhealthy(ErrorMsg, ex);
            }
        }
    }
}

