using Conexus.Api.Domain.Models;
using Microsoft.EntityFrameworkCore; //classe que possui os trem para manipular o banco de dados

namespace Conexus.Api.Infra;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) //construtor
    {
        
    }

    public DbSet<Aluno> Alunos { get; set; } //representa a tabela no banco de dados
}