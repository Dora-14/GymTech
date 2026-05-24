using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAngularApp",
//        policy => policy.WithOrigins("http://localhost:4200") // Angular's default port
//                        .AllowAnyMethod()
//                        .AllowAnyHeader());
//});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<MemberService>();
builder.Services.AddScoped<SubscriptionService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<AttendanceService>();
builder.Services.AddScoped<TrainerService>();
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

app.UseCors("AllowAll");

//app.UseCors("AllowAngularApp");



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
