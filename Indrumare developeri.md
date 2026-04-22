**Pe backend le implementați în ordinea asta:  VISUAL STUDIO**



„Backend-ul este dezvoltat în C# folosind ASP.NET Core Web API, în Visual Studio, cu Entity Framework Core pentru accesul la baza de date.”



**1. Structura proiectului**



Dacă mergeți pe Angular + .NET, backend-ul îl faceți ca ASP.NET Core Web API.



Structură bună:



GymManagementSystem.Api

│

├── Controllers

├── Models

├── Data

├── Services

├── Repositories

├── DTOs

└── Validators

**2. Entitățile din UML devin clase C#**



Adică exact ce ați desenat în UML.



Exemplu:



public class Member

{

&#x20;   public int MemberId { get; set; }

&#x20;   public string FullName { get; set; }

&#x20;   public string Email { get; set; }

&#x20;   public string Phone { get; set; }

&#x20;   public DateTime DateOfBirth { get; set; }

&#x20;   public DateTime RegistrationDate { get; set; }



&#x20;   public List<Subscription> Subscriptions { get; set; } = new();

&#x20;   public List<Payment> Payments { get; set; } = new();

&#x20;   public List<Attendance> Attendances { get; set; } = new();

&#x20;   public List<MemberTrainer> MemberTrainers { get; set; } = new();

}

public class Subscription

{

&#x20;   public int SubscriptionId { get; set; }

&#x20;   public string Type { get; set; }

&#x20;   public decimal Price { get; set; }

&#x20;   public int DurationDays { get; set; }

&#x20;   public DateTime StartDate { get; set; }

&#x20;   public DateTime EndDate { get; set; }

&#x20;   public bool IsActive { get; set; }



&#x20;   public int MemberId { get; set; }

&#x20;   public Member Member { get; set; }

}



La fel faceți pentru:



Payment

Attendance

Trainer

MemberTrainer

**3. Creezi AppDbContext**



Asta implementează ERD-ul vostru în Entity Framework.



using Microsoft.EntityFrameworkCore;



public class AppDbContext : DbContext

{

&#x20;   public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }



&#x20;   public DbSet<Member> Members { get; set; }

&#x20;   public DbSet<Subscription> Subscriptions { get; set; }

&#x20;   public DbSet<Payment> Payments { get; set; }

&#x20;   public DbSet<Attendance> Attendances { get; set; }

&#x20;   public DbSet<Trainer> Trainers { get; set; }

&#x20;   public DbSet<MemberTrainer> MemberTrainers { get; set; }



&#x20;   protected override void OnModelCreating(ModelBuilder modelBuilder)

&#x20;   {

&#x20;       modelBuilder.Entity<MemberTrainer>()

&#x20;           .HasKey(mt => new { mt.MemberId, mt.TrainerId });



&#x20;       modelBuilder.Entity<MemberTrainer>()

&#x20;           .HasOne(mt => mt.Member)

&#x20;           .WithMany(m => m.MemberTrainers)

&#x20;           .HasForeignKey(mt => mt.MemberId);



&#x20;       modelBuilder.Entity<MemberTrainer>()

&#x20;           .HasOne(mt => mt.Trainer)

&#x20;           .WithMany(t => t.MemberTrainers)

&#x20;           .HasForeignKey(mt => mt.TrainerId);

&#x20;   }

}

**4. Business logic-ul din UML NU îl puneți în entities**



Aici mulți greșesc.



Metode ca:



GetPaymentHistory()

ValidateAccess()

RenewSubscription()



mai bine merg în Services, nu în modele.



Deci:



Models = date

Services = logică

Controllers = endpoints

**5. Creezi servicii**



Aici implementezi regulile importante.



MemberService

public class MemberService

{

&#x20;   private readonly AppDbContext \_context;



&#x20;   public MemberService(AppDbContext context)

&#x20;   {

&#x20;       \_context = context;

&#x20;   }



&#x20;   public async Task<List<Member>> GetAllAsync()

&#x20;   {

&#x20;       return await \_context.Members.ToListAsync();

&#x20;   }



&#x20;   public async Task<Member> AddAsync(Member member)

&#x20;   {

&#x20;       \_context.Members.Add(member);

&#x20;       await \_context.SaveChangesAsync();

&#x20;       return member;

&#x20;   }

}

SubscriptionService



**Aici implementați regula cu un singur abonament activ.**



public class SubscriptionService

{

&#x20;   private readonly AppDbContext \_context;



&#x20;   public SubscriptionService(AppDbContext context)

&#x20;   {

&#x20;       \_context = context;

&#x20;   }



&#x20;   public async Task<Subscription> AddSubscriptionAsync(Subscription newSubscription)

&#x20;   {

&#x20;       var activeSubscription = await \_context.Subscriptions

&#x20;           .FirstOrDefaultAsync(s => s.MemberId == newSubscription.MemberId \&\& s.IsActive);



&#x20;       if (activeSubscription != null)

&#x20;       {

&#x20;           activeSubscription.IsActive = false;

&#x20;       }



&#x20;       newSubscription.IsActive = true;



&#x20;       \_context.Subscriptions.Add(newSubscription);

&#x20;       await \_context.SaveChangesAsync();



&#x20;       return newSubscription;

&#x20;   }

}

**6. Creezi Controllers**



**Astea vin din Use Case Diagram.**



De exemplu:



Manage Members → MemberController

Manage Subscriptions → SubscriptionController

Manage Payments → PaymentController

MemberController

using Microsoft.AspNetCore.Mvc;



\[ApiController]

\[Route("api/\[controller]")]

public class MemberController : ControllerBase

{

&#x20;   private readonly MemberService \_memberService;



&#x20;   public MemberController(MemberService memberService)

&#x20;   {

&#x20;       \_memberService = memberService;

&#x20;   }



&#x20;   \[HttpGet]

&#x20;   public async Task<IActionResult> GetAll()

&#x20;   {

&#x20;       var members = await \_memberService.GetAllAsync();

&#x20;       return Ok(members);

&#x20;   }



&#x20;   \[HttpPost]

&#x20;   public async Task<IActionResult> Create(Member member)

&#x20;   {

&#x20;       var created = await \_memberService.AddAsync(member);

&#x20;       return Ok(created);

&#x20;   }

}

**7. Legi serviciile în Program.cs**

builder.Services.AddDbContext<AppDbContext>(options =>

&#x20;   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



builder.Services.AddScoped<MemberService>();

builder.Services.AddScoped<SubscriptionService>();

**8. Creezi baza de date**



În appsettings.json:



"ConnectionStrings": {

&#x20; "DefaultConnection": "Server=(localdb)\\\\mssqllocaldb;Database=GymManagementDb;Trusted\_Connection=True;"

}



Apoi:



Add-Migration InitialCreate

Update-Database

**9. Ce implementați concret din Use Case**



Use case-urile voastre devin endpoint-uri.



Exemplu:



Manage Members

GET /api/member

GET /api/member/{id}

POST /api/member

PUT /api/member/{id}

DELETE /api/member/{id}

Manage Subscriptions

GET /api/subscription/member/{memberId}

POST /api/subscription

PUT /api/subscription/{id}/renew

Manage Payments

POST /api/payment

GET /api/payment/member/{memberId}

Record Attendance

POST /api/attendance/checkin

GET /api/attendance/member/{memberId}

**10. Validări importante**



Exemple:



email să nu fie gol

EndDate > StartDate

payment amount > 0

să nu existe 2 subscriptions active

check-in doar dacă există subscription activ



Exemplu simplu:



if (string.IsNullOrWhiteSpace(member.Email))

&#x20;   throw new Exception("Email is required.");



if (newSubscription.EndDate <= newSubscription.StartDate)

&#x20;   throw new Exception("End date must be after start date.");

**11. Legătura cu architecture diagram**



Architecture diagram-ul vostru se implementează așa:



Presentation Layer → Angular

Business Logic Layer → Services

Data Access Layer → EF Core + DbContext

Database Layer → SQL Server





**12. Ordinea corectă de lucru**



**Pasul 1**



Faceți:



Models

DbContext

Migration



**Pasul 2**



Faceți:



MemberController

SubscriptionController

PaymentController



**Pasul 3**



Faceți:



business rules

validation

attendance

trainer assignment



**Pasul 4**



Legați Angular de API



**13. Varianta pentru profesor**



**Backend-ul va fi implementat în ASP.NET Core Web API. Entitățile definite în UML vor fi transformate în clase C#, relațiile vor fi gestionate prin Entity Framework Core, iar logica aplicației va fi implementată în servicii separate. Funcționalitățile principale din Use Case Diagram vor fi expuse prin controllere API, iar datele vor fi stocate într-o bază de date SQL.**

