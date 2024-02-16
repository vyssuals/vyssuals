using System;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        var url = "ws://localhost:8184";
        var exePath = @"/Users/yskert/Documents/GitHub/vyssuals/vyssuals/src/lib/tests/WebsocketServer/bin/Release/net8.0/osx-arm64/publish/WebsocketServer"; // Replace with the path to your self-contained executable

        var cts = new CancellationTokenSource();
        var connectTask = TryConnectAsync(url, exePath, cts.Token);

        Console.WriteLine("Press Enter to stop...");
        Console.ReadLine();

        cts.Cancel();

        try
        {
            await connectTask;
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Operation was cancelled.");
        }
    }

    static async Task TryConnectAsync(string url, string exePath, CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            if (!await TryConnectToServerAsync(url))
            {
                Console.WriteLine("Could not connect to the server. Starting the server...");

                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = exePath,
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    }
                };

                process.Start();

                Console.WriteLine("Server started. Trying to connect again after a few seconds...");
                await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
            }
            else
            {
                Console.WriteLine("Connected to the server.");
                break; // Exit the loop once the connection is successful
            }
        }
    }

    static async Task<bool> TryConnectToServerAsync(string url)
    {
        using var client = new ClientWebSocket();

        try
        {
            await client.ConnectAsync(new Uri(url), CancellationToken.None);
            return true;
        }
        catch (WebSocketException)
        {
            return false;
        }
    }
}