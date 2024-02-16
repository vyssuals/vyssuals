public class DataItem
{
    public string Id { get; set; }
    public string DataSource { get; set; }
    public Dictionary<string, object> Attributes { get; set; }

    public DataItem(string id, string dataSource, Dictionary<string, object> attributes)
    {
        Id = id;
        DataSource = dataSource;
        Attributes = attributes;
    }
}