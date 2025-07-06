namespace Renart.Models.VMs
{
    public class YuzukVM
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public double Popularity { get; set; } // 5 üzerinden
        public double Weight { get; set; }
        public Dictionary<string, string> Images { get; set; }
    }
}
