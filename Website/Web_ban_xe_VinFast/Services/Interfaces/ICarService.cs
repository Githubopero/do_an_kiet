using Web_ban_xe_VinFast.DTOs.Car;
using Web_ban_xe_VinFast.DTOs.Admin;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface ICarService
    {
        Task<List<CarListDto>> GetAllCarsAsync();
        Task<List<CarListDto>> FilterCarsAsync(CarFilterParams param);
        Task<CarDetailDto> GetCarDetailAsync(long carId);
        Task<PriceDetailDto> CalculatePriceAsync(ConfigPriceRequest req);

        


        //quản lý phiên bản xe admin
        // 1. Thêm hàm này để lấy TẤT CẢ phiên bản (hiển thị ngay từ đầu + lọc search)
        Task<List<CarVersionDto>> GetAllVersionsAdminAsync();

        // 2. Lấy phiên bản theo từng xe (đã có)
        Task<IEnumerable<CarVersionDto>> GetVersionsByCarIdAsync(long carId);

        // 3. Tạo mới phiên bản
        Task CreateVersionAsync(long carId, CarVersionDto versionDto);

        // 4. Thêm hàm cập nhật phiên bản (bạn đã viết trong Service nhưng chưa khai báo ở đây)
        Task UpdateVersionAsync(long versionId, CarVersionDto dto);

        // 5. Thêm hàm xóa mềm phiên bản
        Task DeleteVersionAsync(long versionId);


        //quản lý xe admin
        Task<List<CarListDto>> GetAllCarsAdminAsync();

        Task CreateCarAsync(CreateCarRequest req);
        Task UpdateCarAsync(long id, UpdateCarRequest request);
        Task UpdateCarStatusAsync(long id, string status);
        Task DeleteCarAsync(long id);
    }
}
