using System;
using System.Net;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;

public class WebSocketServer
{
    public async Task RunServerAsync()
    {
        var httpListener = new HttpListener();
        httpListener.Prefixes.Add("http://localhost:8184/");
        httpListener.Start();
        Console.WriteLine("Server started.");

        while (true)
        {
            var context = await httpListener.GetContextAsync();

            if (context.Request.IsWebSocketRequest)
            {
                var webSocketContext = await context.AcceptWebSocketAsync(null);
                var webSocket = webSocketContext.WebSocket;

                _ = HandleIncomingMessagesAsync(webSocket);
            }
            else
            {
                context.Response.StatusCode = 400;
                context.Response.Close();
            }
        }
    }

    private static async Task HandleIncomingMessagesAsync(WebSocket webSocket)
    {
        var buffer = new byte[1024];

        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"Received message from client: {message}");
            }
            else if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            }
        }
    }
}