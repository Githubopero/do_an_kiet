namespace Web_ban_xe_VinFast.DTOs.CarImage
{
    public class UploadCarImageRequest
    {
        public long XeId { get; set; }
        public IFormFile? File { get; set; } // File thực tế tải lên
        public string LoaiAnh { get; set; } = "gallery"; // main, gallery, video_thumbnail
        public short ThuTuSapXep { get; set; } = 0;
    }
}
