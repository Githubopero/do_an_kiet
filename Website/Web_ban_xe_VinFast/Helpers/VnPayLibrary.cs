using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Microsoft.Extensions.Configuration;

namespace Web_ban_xe_VinFast.Helpers
{
    public class VnPayLibrary
    {
        public const string VERSION = "2.1.0";
        private SortedList<String, String> _requestData = new SortedList<String, String>(new VnPayCompare());
        private SortedList<String, String> _responseData = new SortedList<String, String>(new VnPayCompare());

        public void AddRequestData(string key, string value)
        {
            if (!String.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!String.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            string retValue;
            if (_responseData.TryGetValue(key, out retValue))
            {
                return retValue;
            }
            else
            {
                return string.Empty;
            }
        }

        #region Request

        //public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        //{
        //    StringBuilder data = new StringBuilder();
        //    foreach (KeyValuePair<string, string> kv in _requestData)
        //    {
        //        if (!String.IsNullOrEmpty(kv.Value))
        //        {
        //            data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
        //        }
        //    }
        //    string queryString = data.ToString();

        //    baseUrl += "?" + queryString;
        //    String signData = queryString;
        //    if (signData.Length > 0)
        //    {

        //        signData= signData.Remove(data.Length - 1, 1);
        //    }
        //    string vnp_SecureHash = Utils.HmacSHA512(vnp_HashSecret , signData);
        //    baseUrl += "vnp_SecureHash=" + vnp_SecureHash;

        //    return baseUrl;
        //}
        //public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        //{
        //    StringBuilder data = new StringBuilder();
        //    foreach (KeyValuePair<string, string> kv in _requestData)
        //    {
        //        if (!String.IsNullOrEmpty(kv.Value))
        //        {
        //            // SỬA TẠI ĐÂY: Sử dụng HttpUtility.UrlEncode và thay thế + bằng %20
        //            data.Append(HttpUtility.UrlEncode(kv.Key) + "=" + HttpUtility.UrlEncode(kv.Value) + "&");
        //        }
        //    }

        //    string queryString = data.ToString();
        //    if (queryString.EndsWith("&"))
        //    {
        //        queryString = queryString.Remove(queryString.Length - 1);
        //    }

        //    // Chuỗi dùng để băm (không có UrlEncode cho key/value)
        //    StringBuilder rawData = new StringBuilder();
        //    foreach (KeyValuePair<string, string> kv in _requestData)
        //    {
        //        if (!String.IsNullOrEmpty(kv.Value))
        //        {
        //            rawData.Append(kv.Key + "=" + kv.Value + "&");
        //        }
        //    }
        //    string rawHash = rawData.ToString();
        //    if (rawHash.EndsWith("&"))
        //    {
        //        rawHash = rawHash.Remove(rawHash.Length - 1);
        //    }

        //    // Băm với chuỗi thô (rawHash)
        //    string vnp_SecureHash = Utils.HmacSHA512(vnp_HashSecret, rawHash);

        //    // URL cuối cùng dùng queryString đã encode
        //    return baseUrl + "?" + queryString + "&vnp_SecureHash=" + vnp_SecureHash;
        //}
        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            var data = new StringBuilder();
            foreach (var kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            string queryString = data.ToString().TrimEnd('&');
            baseUrl += "?" + queryString;

            // Tạo chuỗi hash - PHẢI DÙNG CHUỖI ĐÃ ENCODE (giống queryString)
            string signData = queryString;
            string vnp_SecureHash = Utils.HmacSHA512(vnp_HashSecret, signData);

            return baseUrl + "&vnp_SecureHash=" + vnp_SecureHash;
        }



        #endregion

        #region Response process

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            string rspRaw = GetResponseData();
            string myChecksum = Utils.HmacSHA512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }
        private string GetResponseData()
        {

            StringBuilder data = new StringBuilder();
            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }
            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }
            foreach (KeyValuePair<string, string> kv in _responseData)
            {
                if (!String.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode( kv.Key) + "=" + WebUtility.UrlEncode(kv.Value )+ "&");
                }
            }
            //remove last '&'
            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }
            return data.ToString();
        }

        #endregion
    }

    public class Utils
    {
         

        public static String HmacSHA512(string key, String inputData)
        {
            var hash = new StringBuilder(); 
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }
        public static string GetIpAddress(HttpContext httpContext)
        {
            string ip = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (string.IsNullOrEmpty(ip) || ip.ToLower() == "unknown")
                ip = httpContext.Connection.RemoteIpAddress?.ToString();

            return ip ?? "127.0.0.1";
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}