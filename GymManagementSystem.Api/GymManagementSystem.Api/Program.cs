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
builder.Services.AddScoped<StatsService>();
builder.Services.AddScoped<UserService>();

var app = builder.Build();

// Seed default users on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    var defaultUsers = new[]
    {
        new GymManagementSystem.Api.Models.UserAccount { Username = "admin",        PasswordHash = "admin123",  Email = "admin@gymtech.com",        Role = "Admin" },
        new GymManagementSystem.Api.Models.UserAccount { Username = "receptionist", PasswordHash = "recep123",  Email = "recep@gymtech.com",        Role = "Receptionist" },
        new GymManagementSystem.Api.Models.UserAccount { Username = "trainer",      PasswordHash = "trainer123", Email = "trainer@gymtech.com",     Role = "Trainer" },
    };

    foreach (var u in defaultUsers)
    {
        if (!db.AdminUsers.Any(x => x.Username == u.Username))
            db.AdminUsers.Add(u);
    }
    db.SaveChanges();

    // Seed default trainers
    var defaultTrainers = new[]
    {
        new GymManagementSystem.Api.Models.Trainer { FullName = "Alex Popescu",     Speciality = "Strength & Conditioning", Phone = "0720000001" },
        new GymManagementSystem.Api.Models.Trainer { FullName = "Maria Ionescu",    Speciality = "Yoga & Flexibility",      Phone = "0720000002" },
        new GymManagementSystem.Api.Models.Trainer { FullName = "Andrei Vasile",    Speciality = "Cardio & HIIT",           Phone = "0720000003" },
        new GymManagementSystem.Api.Models.Trainer { FullName = "Elena Dumitrescu", Speciality = "Nutrition & Weight Loss",  Phone = "0720000004" },
    };
    foreach (var t in defaultTrainers)
    {
        if (!db.Trainers.Any(x => x.FullName == t.FullName))
            db.Trainers.Add(t);
    }
    db.SaveChanges();

    // Seed individual trainer login accounts
    var trainerLogins = new[]
    {
        ("alex.popescu",    "alex123",   "alex.popescu@gymtech.com",    "Alex Popescu"),
        ("maria.ionescu",   "maria123",  "maria.ionescu@gymtech.com",   "Maria Ionescu"),
        ("andrei.vasile",   "andrei123", "andrei.vasile@gymtech.com",   "Andrei Vasile"),
        ("elena.dumitrescu","elena123",  "elena.dumitrescu@gymtech.com","Elena Dumitrescu"),
    };
    foreach (var (username, password, email, fullName) in trainerLogins)
    {
        if (!db.AdminUsers.Any(u => u.Username == username))
        {
            var trainer = db.Trainers.FirstOrDefault(t => t.FullName == fullName);
            db.AdminUsers.Add(new GymManagementSystem.Api.Models.UserAccount
            {
                Username = username, PasswordHash = password, Email = email,
                Role = "Trainer", TrainerId = trainer?.TrainerId
            });
        }
    }
    db.SaveChanges();
}

app.UseCors("AllowAll");

//app.UseCors("AllowAngularApp");



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger/index.html"));
}

app.UseAuthorization();

app.MapControllers();

app.Run();

