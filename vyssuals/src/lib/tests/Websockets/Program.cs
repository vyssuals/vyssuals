class Program
{
    static async Task Main(string[] args)
    {
        var client = new WebSocketClient();
        var server = new WebSocketServer();

        // Start the server first
        _ = server.RunServerAsync();

        // Wait for the server to start
        await Task.Delay(1000); // Wait for 1 second

        // Then try to connect the client
        await client.TryConnectAsync("ws://localhost:8184");

        // Add your code here to send/receive messages, etc.

        // Keep the application running until the user presses Enter
        Console.WriteLine("Press Enter to quit...");
        Console.ReadLine();
    }
}