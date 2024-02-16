using Newtonsoft.Json;

public class DataItem
{
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("dataSource")]
    public string DataSource { get; set; }
    [JsonProperty("attributes")]
    public Dictionary<string, object> Attributes { get; set; }

    public DataItem(string id, string dataSource, Dictionary<string, object> attributes)
    {
        Id = id;
        DataSource = dataSource;
        Attributes = attributes;
    }
}