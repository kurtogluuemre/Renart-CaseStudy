using Microsoft.AspNetCore.Mvc;
using Renart.Models;
using Renart.Models.VMs;
using System.Text.Json;

namespace Renart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YuzukController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly double degerUsd = 75.0;

        public YuzukController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] double? minPrice, [FromQuery] double? maxPrice, [FromQuery] double? minPopularity, [FromQuery] double? maxPopularity)
        {
            var path = Path.Combine(_env.ContentRootPath, "Data", "yuzukler.json");

            if (!System.IO.File.Exists(path))
                return NotFound($"JSON dosyası bulunamadı: {path}");

            var json = await System.IO.File.ReadAllTextAsync(path);

            var yuzukler = JsonSerializer.Deserialize<List<Yuzuk>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var responseList = yuzukler.Select(y => new YuzukVM
            {
                Name = y.Name,
                Weight = y.Weight,
                Images = y.Images,
                Popularity = Math.Round(y.PopularityScore * 5, 1),
                Price = Math.Round((y.PopularityScore + 1) * y.Weight * degerUsd, 2)
            });

            if (minPrice.HasValue)
                responseList = responseList.Where(y => y.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                responseList = responseList.Where(y => y.Price <= maxPrice.Value);

            if (minPopularity.HasValue)
                responseList = responseList.Where(y => y.Popularity >= minPopularity.Value);

            if (maxPopularity.HasValue)
                responseList = responseList.Where(y => y.Popularity <= maxPopularity.Value);

            return Ok(responseList.ToList());
        }
    }
}
