public class DummyDataGenerator
{
    private static Random random = new Random();

    private static string[] categories = { "walls", "doors", "floors", "windows", "roofs", "ceilings", "stairs" };
    private static string[] levels = { "level1", "level2", "level3" };
    private static string[] fireRating = { "A", "B", "C", "D", "E", "F" };
    private static double[] heights = { 3.5, 4.22, 4.5, 7 };
    private static string[] someLongParameterName = { "Alphaaaaaaaaaaaaaaaa", "Betaaaaaaaaaaa", "Gammaaaaa", "Deltaaaaaaaaaaaaaaaaaaaaaaaaaaa", "Epsilonaaaa", "Zetaaaaa" };
    private static string[] dataSources = { "Revit-2022__836_Project-Name", "Rhino-8__2402_DR_some-long-filename", "Csv_brutally-long-filename-2023-02-23_randomShit" };

    private static T GetRandomElement<T>(T[] array)
    {
        return array[random.Next(array.Length)];
    }

    private static int GetRandomNumber(int min, int max)
    {
        return random.Next(min, max + 1);
    }

    public static List<DataItem> GenerateDummyData(string dataSource, int count)
    {
        var data = new List<DataItem>();

        for (int i = 0; i < count; i++)
        {
            var category = GetRandomElement(categories);
            var attributes = new Dictionary<string, object>
            {
                { "Area", GetRandomNumber(1, 10) },
                { "Category", category },
                { "Level", GetRandomElement(levels) },
                { "Fire Rating", (category == "walls" || category == "floors") ? GetRandomElement(fireRating) : null },
                { "Height", category == "walls" ? GetRandomElement(heights) : null },
                { "Some Long Parameter Name That Never Keeps on Goooooooooooooooooing", GetRandomElement(someLongParameterName) }
            };

            var item = new DataItem(GetRandomNumber(1, 1000000).ToString(), dataSource, attributes);

            data.Add(item);
        }

        return data;
    }
}