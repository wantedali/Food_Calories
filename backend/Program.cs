using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FoodCalorie.Services;
using FoodCalorie.Models;
using System.Text;
using System.Net.Http.Headers;            // ← make sure this matches your namespace
using Microsoft.OpenApi.Models;
using FoodCalorie.Filters;   
var builder = WebApplication.CreateBuilder(args);

// إضافة قراءة متغيّرات البيئة (لضمان قراءة OPENAI_API_KEY)
builder.Configuration.AddEnvironmentVariables();
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDB")
);

// Register MongoDB client
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

// Register a database instance
builder.Services.AddScoped(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});
builder.Services.AddHttpClient("FoodModel", client =>
{
    client.BaseAddress = new Uri("http://localhost:8000/");
    client.Timeout = TimeSpan.FromSeconds(30);
});
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<DailyMealService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddSingleton<ChatGptService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddScoped<TokenService>();

// ———————————————— إضافة OpenAI HttpClient ————————————————

var openAiKey = builder.Configuration["OPENAI_API_KEY"];
if (string.IsNullOrWhiteSpace(openAiKey))
{
    throw new Exception("Please set the OPENAI_API_KEY environment variable.");
}

builder.Services.AddHttpClient("OpenAI", client =>
{
    client.BaseAddress = new Uri("https://api.openai.com/v1/");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", openAiKey);
});

// ——————————————————————————————————————————————————————————————
builder.Services.AddSwaggerGen(c =>
{
    // Optional: give your API a name & version
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FoodCalorie API", Version = "v1" });

    // <-- Here’s the magic that collapses IFormFile into one picker
    c.OperationFilter<FileUploadOperationFilter>();
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseStaticFiles();  // serves wwwroot by default
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
