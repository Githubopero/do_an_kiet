using Microsoft.AspNetCore.Mvc;

using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly IConfiguration _config;

    public ChatController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest req)
    {
        try
        {
            Console.WriteLine("=== REQUEST ===");
            Console.WriteLine(req?.Message);

            if (string.IsNullOrWhiteSpace(req?.Message))
                return BadRequest("Message is empty");

            // Lấy API key OpenRouter
            var apiKey = _config["OpenRouter:ApiKey"];
            Console.WriteLine("API KEY: " + (string.IsNullOrEmpty(apiKey) ? "NULL" : "OK"));

            using var client = new HttpClient();

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            // bắt buộc với OpenRouter
            client.DefaultRequestHeaders.Add("HTTP-Referer", "http://localhost");
            client.DefaultRequestHeaders.Add("X-Title", "Chat App");
            var carData = @"Đây là thông tin các mẫu xe và phiên bản xe cùng với giá và số chỗ ngồi, dung lượng pin, quãng đường di chuyển trên 1 lần sạc, các tùy chọn cấu hình hiện có của xe VinFast(viết tắt là VF) của Việt Nam
                VF3 | Mini SUV | 4 chỗ | pin 18.64 kWh | 210 km | RWD | Base | 299000000 VND | Màu, Mâm, Nội thất
VF3 | Mini SUV | 4 chỗ | pin 18.64 kWh | 210 km | RWD | Plus | 307000000 VND | Màu, Mâm, Nội thất

VF5 | A-SUV | 5 chỗ | pin 29.6–37.23 kWh | 326 km | FWD | Plus | 529000000 VND | Màu, Thuê pin, Công nghệ

VF6 | B-SUV | 5 chỗ | pin ~59 kWh | ~399 km | FWD | Eco | 689000000 VND | ADAS, Màn hình, Nội thất
VF6 | B-SUV | 5 chỗ | pin ~59 kWh | ~399 km | FWD | Plus | 749000000 VND | ADAS, Màn hình, Nội thất

VF7 | C-SUV | 5 chỗ | pin ~75 kWh | ~450 km | FWD | Eco | 799000000 VND | ADAS, Nội thất
VF7 | C-SUV | 5 chỗ | pin ~75 kWh | ~450 km | AWD | Plus Steel Roof | 999000000 VND | AWD, ADAS, Trần thép
VF7 | C-SUV | 5 chỗ | pin ~75 kWh | ~450 km | AWD | Plus Glass Roof | 1019000000 VND | AWD, ADAS, Trần kính

VF8 | D-SUV | 5 chỗ | pin 82–87.7 kWh | 420–471 km | AWD | Eco | 1069000000 VND | ADAS, Da, Giải trí
VF8 | D-SUV | 5 chỗ | pin 82–87.7 kWh | 420–471 km | AWD | Plus | 1199000000 VND | ADAS, Da, Giải trí

VF9 | E-SUV | 7 chỗ | pin ~123 kWh | ~594 km | AWD | Eco 7 chỗ | 1499000000 VND | ADAS, Tiêu chuẩn
VF9 | E-SUV | 7 chỗ | pin ~123 kWh | ~594 km | AWD | Plus 7 chỗ | 1699000000 VND | ADAS, Cao cấp
VF9 | E-SUV | 7 chỗ | pin ~123 kWh | ~594 km | AWD | Plus 7 chỗ kính | 1728000000 VND | ADAS, Trần kính
VF9 | E-SUV | 6 chỗ | pin ~123 kWh | ~594 km | AWD | Eco 6 chỗ | 1731000000 VND | Ghế thương gia
VF9 | E-SUV | 6 chỗ | pin ~123 kWh | ~594 km | AWD | Plus 6 chỗ kính | 1760000000 VND | Ghế thương gia, Trần kính

VFe34 | C-SUV | 5 chỗ | pin 41.9 kWh | 318.6 km | FWD | Standard | ngừng bán | Thuê pin
            ";
            var body = new
            {
                model = "z-ai/glm-4.5-air:free",
                messages = new[]
    {
        new {
            role = "system",
            content = "Bạn là tư vấn bán xe ô tô điện VinFast của Việt Nam. Trả lời ngắn gọn, dễ hiểu."
        },
        new {
            role = "system",
            content = carData
        },
        new {
            role = "user",
            content = req.Message
        }
    }
            };
            // var body = new
            // {
            //     model = "z-ai/glm-4.5-air:free",
            //     messages = new[]
            //     {
            //         new { role = "user", content = req.Message }
            //     }
            // };

            var response = await client.PostAsync(
                "https://openrouter.ai/api/v1/chat/completions",
                new StringContent(
                    JsonSerializer.Serialize(body),
                    Encoding.UTF8,
                    "application/json"
                )
            );

            var result = await response.Content.ReadAsStringAsync();

            Console.WriteLine("=== OPENROUTER RESPONSE ===");
            Console.WriteLine(result);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, result);
            }

            var json = JsonDocument.Parse(result);

            var reply = json.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return Ok(new { reply });
        }
        catch (Exception ex)
        {
            Console.WriteLine("=== ERROR ===");
            Console.WriteLine(ex.ToString());
            return StatusCode(500, ex.ToString());
        }
    }
    public class ChatRequest
    {
        public string? Message { get; set; }
    }
}