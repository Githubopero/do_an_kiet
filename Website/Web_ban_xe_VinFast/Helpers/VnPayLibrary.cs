using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace Web_ban_xe_VinFast.Helpers
{
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var value) ? value : string.Empty;
        }

        //public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        //{
        //    StringBuilder data = new StringBuilder();
        //    foreach (KeyValuePair<string, string> kv in _requestData)
        //    {
        //        if (!string.IsNullOrEmpty(kv.Value))
        //        {
        //            // VNPAY yêu cầu UrlEncode các giá trị
        //            data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
        //        }
        //    }

        //    string queryString = data.ToString();
        //    if (queryString.Length > 0)
        //    {
        //        // Xóa ký tự '&' cuối cùng
        //        queryString = queryString.Remove(queryString.Length - 1);
        //    }

        //    string vnp_SecureHash = HmacSha512(vnp_HashSecret, queryString);
        //    string finalUrl = baseUrl + "?" + queryString + "&vnp_SecureHash=" + vnp_SecureHash;

        //    return finalUrl;
        //}

        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            StringBuilder data = new StringBuilder();
            foreach (KeyValuePair<string, string> kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    // Bước 1: Tạo chuỗi dữ liệu để băm (KHÔNG ENCODE)
                    data.Append(kv.Key + "=" + kv.Value + "&");
                }
            }

            string queryString = data.ToString();
            // Xóa ký tự '&' cuối cùng
            if (queryString.Length > 0)
            {
                queryString = queryString.Remove(queryString.Length - 1);
            }

            // Bước 2: Tạo mã băm từ chuỗi chưa Encode
            string vnp_SecureHash = HmacSha512(vnp_HashSecret, queryString);

            // Bước 3: Tạo URL cuối cùng (Lúc này mới ENCODE từng giá trị)
            StringBuilder urlBuilder = new StringBuilder(baseUrl + "?");
            foreach (KeyValuePair<string, string> kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    urlBuilder.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            // Nối mã băm vào cuối URL
            return urlBuilder.ToString() + "vnp_SecureHash=" + vnp_SecureHash;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            StringBuilder data = new StringBuilder();
            foreach (KeyValuePair<string, string> kv in _responseData)
            {
                if (!string.IsNullOrEmpty(kv.Value) && kv.Key != "vnp_SecureHashType" && kv.Key != "vnp_SecureHash")
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            string rawData = data.ToString();
            if (rawData.Length > 0)
            {
                rawData = rawData.Remove(rawData.Length - 1);
            }

            string checkSum = HmacSha512(secretKey, rawData);
            return checkSum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string HmacSha512(string key, string inputData)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                return BitConverter.ToString(hashValue).Replace("-", "").ToLower();
            }
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            return string.CompareOrdinal(x, y);
        }
    }
}