
using Web_ban_xe_VinFast.Services.Implementations;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();



            //builder.Services.AddScoped<ICarService, CarService>();
            //builder.Services.AddScoped<IUserManagementService, UserManagementService>();
            //builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
