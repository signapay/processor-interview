using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace SignaPayProcessor.Models;
    
    [Serializable]
    public class Transaction
    {
        [Key]
        public DateTime TimeStamp { get; set; }  

        public decimal Amount { get; set; }

        [XmlIgnore]
        public string? CardType { get; set; } = "unknown";
        
        public long CardNumber { get; set; }
              
    }