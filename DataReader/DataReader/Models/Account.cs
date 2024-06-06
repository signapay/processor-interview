namespace DataReader.Models
{
    public class Account
    {
        public string Name { get; set; }
        public List<Card> Cards { get; set; } = new List<Card>();
    }
}
