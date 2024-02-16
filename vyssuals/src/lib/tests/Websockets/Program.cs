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
        if (await client.TryConnectAsync("ws://localhost:8184"))
        {
            // If the client is connected, start sending dummy data every 10 seconds
            while (true)
            {
                var dummyData = DummyDataGenerator.GenerateDummyData("Revit-2022__836_Project-Name", 2);
                await client.SendDataAsync(dummyData);

                await Task.Delay(10000); // Wait for 10 seconds
            }
        }

        // Keep the application running until the user presses Enter
        Console.WriteLine("Press Enter to quit...");
        Console.ReadLine();
    }
}