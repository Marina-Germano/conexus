using Conexus.Api.Domain.Services;
using Conexus.Api.Domain.Services.Interfaces;
using Conexus.Api.Infra;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;         // ✅ necessário
using Microsoft.Extensions.DependencyInjection;  // ✅ necessário
using Microsoft.Extensions.Hosting;         // ✅ necessário



var builder = WebApplication.CreateBuilder(args);

// 1. Defina a URL exata do seu front-end
string vueOrigin = "http://localhost:5173"; // Sua aplicação Vue está em 5173

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", 
        policy => policy.WithOrigins(vueOrigin) // <-- MUDAR AQUI: Use WithOrigins()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()); // <-- MUDAR AQUI: Se estiver usando credenciais
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger NSwag
builder.Services.AddOpenApiDocument();

// Injeção de dependência
builder.Services.AddScoped<IAlunoServiceDomain, AlunoServiceDomain>();
builder.Services.AddScoped<IAlunoTurmaServiceDomain, AlunoTurmaServiceDomain>();
builder.Services.AddScoped<IAvaliacaoServiceDomain, AvaliacaoServiceDomain>();
builder.Services.AddScoped<ICalendarioAulaServiceDomain, CalendarioAulaServiceDomain>();
builder.Services.AddScoped<ICartaoServiceDomain, CartaoServiceDomain>();
builder.Services.AddScoped<IContatoServiceDomain, ContatoServiceDomain>();
builder.Services.AddScoped<IDocumentoAlunoServiceDomain, DocumentoAlunoServiceDomain>();
builder.Services.AddScoped<IEmprestimoMaterialServiceDomain, EmprestimoMaterialServiceDomain>();
builder.Services.AddScoped<IFormaPagamentoServiceDomain, FormaPagamentoServiceDomain>();
builder.Services.AddScoped<IFuncionarioServiceDomain, FuncionarioServiceDomain>();
builder.Services.AddScoped<IIdiomaServiceDomain, IdiomaServiceDomain>();
builder.Services.AddScoped<IMaterialServiceDomain, MaterialServiceDomain>();
builder.Services.AddScoped<INivelServiceDomain, NivelServiceDomain>();
builder.Services.AddScoped<IPagamentoServiceDomain, PagamentoServiceDomain>();
builder.Services.AddScoped<IPresencaServiceDomain, PresencaServiceDomain>();
builder.Services.AddScoped<ITipoDocumentoServiceDomain, TipoDocumentoServiceDomain>();
builder.Services.AddScoped<ITipoMaterialServiceDomain, TipoMaterialServiceDomain>();
builder.Services.AddScoped<ITurmaServiceDomain, TurmaServiceDomain>();
builder.Services.AddScoped<IUsuarioServiceDomain, UsuarioServiceDomain>();

// String de conexão
//var strConn = "server=localhost;database=escola_idiomas;user=root;password=root";
var strConn = "server=localhost;database=escola_idiomas;user=root;password="; //computador casa da Mari

// MySQL AutoDetect
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseMySql(strConn, ServerVersion.AutoDetect(strConn))
);



var app = builder.Build();


// Middleware
app.UseCors("AllowSpecificOrigin");

app.UseOpenApi();
app.UseSwaggerUi();
app.MapControllers();

app.Run();
