using Conexus.Api.Domain.Services;
using Conexus.Api.Domain.Services.Interfaces;
using Conexus.Api.Infra;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;         // ✅ necessário
using Microsoft.Extensions.DependencyInjection;  // ✅ necessário
using Microsoft.Extensions.Hosting;         // ✅ necessário



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger NSwag
builder.Services.AddOpenApiDocument();

// Injeção de dependência
builder.Services.AddScoped<IAlunoServiceDomain, AlunoServiceDomain>();

// String de conexão
var strConn = "server=localhost;database=escola_idiomas;user=root;password=";

// MySQL AutoDetect
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseMySql(strConn, ServerVersion.AutoDetect(strConn))
);

var app = builder.Build();

// Middleware
app.UseRouting();

app.UseOpenApi();
app.UseSwaggerUi();

app.MapControllers();

app.Run();


// using Conexus.Api.Domain.Services;
// using Microsoft.EntityFrameworkCore; 

// using Conexus.Api.Domain.Services.Interfaces;
// using Conexus.Api.Infra;

// var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddRouting();

// //Add serviços do OpenAPI
// //builder.Services.AddOpenApi();
// builder.Services.AddOpenApiDocument();

// //configurando a injeção de dependencia dos serviços
// builder.Services.AddScoped<IAlunoServiceDomain, AlunoServiceDomain>();

// //string de conexão com o banco de dados
// var strConn = @"server=localhost;database=escola_idiomas;user=root;password=;";
// //var version = ServerVersion.AutoDetect(strConn); //detectar a versão do mysql
// //var serverVersion = new MariaDbServerVersion(version);//especificando a versão
// builder.Services.AddDbContext<AppDbContext>(options => options.UseMySql(strConn, serverVersion));

// builder.Services.AddDbContext<AppDbContext>(
//     options => options.UseMySql(strConn, ServerVersion.AutoDetect(strConn))
// );


// var app = builder.Build();

// app.UseRouting();
// app.UseAuthorization();
// app.MapControllers();
// app.UseOpenApi();
// app.UseSwaggerUi();


// app.Run();
