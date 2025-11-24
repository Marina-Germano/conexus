using Conexus.Api.Aplication.DTOs;
using Conexus.Api.Domain.Models;
using Conexus.Api.Infra;
using Conexus.Api.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Conexus.Api.Aplication;

namespace Conexus.Api.Domain.Services;

public class AlunoServiceDoamin : IAlunoServiceDomain
{

    private readonly AppDbContext _context;
    public AlunoServiceDoamin(AppDbContext context) //injeção de dependencia
    {
        _context = context;
    }

    [HttpPost("inserir")]
    public async Task<ApplicationResult<long>> Inserir(AlunoDTO alunoDTO)
    {
        if(alunoDTO == null)
        {
            return ApplicationResult<long>.Failure("Dados inválidos.", 400);
        }
        
        Aluno aluno = new Aluno();
        aluno.Nome = alunoDTO.Nome;

        await _context.Alunos.AddAsync(aluno); //adiciona o Aluno no contexto
        await _context.SaveChangesAsync(); //salva as alterações no banco de dados

        var result = ApplicationResult<long>.Success(aluno.Id, 200, "Registro Salvo com Sucesso.");
        return result;
    }

    public async Task<ApplicationResult<List<AlunoDTO>>> BuscarTodos()
    {
        var alunos = _context.Alunos;
        var resultAlunos = await alunos.Select(e => new AlunoDTO
        {
            Id = e.Id,
            Nome = e.Nome
        }).ToListAsync();

        var result = ApplicationResult<List<AlunoDTO>>.Success(resultAlunos, 200, "Registros Localizados.");

        return result;
    }

    public async Task<ApplicationResult<AlunoDTO>> Atualizar(AlunoDTO alunoDTO)
    {
        var info = new {Message = "Parâmetros inválidos." };
        
        if (alunoDTO == null || alunoDTO.Id <= 0)
        {
            return ApplicationResult<AlunoDTO>.Failure(info.Message, 400);
        }

        var result = await _context.Alunos.Where(e => e.Id == alunoDTO.Id).FirstOrDefaultAsync();

        if (result == null)
        {
            info = new { Message = "Registro não encontrado." };
        }
        ApplicationResult<AlunoDTO>.Failure(info.Message, 400);

        result.Nome = alunoDTO.Nome;

        _context.Entry<Aluno>(result).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        info = new { Message = "Dados alterados" };

        return ApplicationResult<AlunoDTO>.Success(alunoDTO, message: info.Message);
    }
    
    [HttpDelete("excluir")]
    public async Task<ApplicationResult<AlunoDTO>> Excluir(int id)
    {
        var info = new { Message = "Parâmetros inválidos." };

        if (id <= 0)
        {
            return ApplicationResult<AlunoDTO>.Failure(info.Message, 400);
        }

        var result = await _context.Alunos.Where(e => e.Id == id).FirstOrDefaultAsync();

        if (result == null)
        {
            info = new { Message = "Registro não encontrado." };
            return ApplicationResult<AlunoDTO>.Failure(info.Message, 400);
        }
        
        _context.Entry<Aluno>(result).State = EntityState.Deleted;

        await _context.SaveChangesAsync();

        info = new { Message = "Registro Excluidos" };
        
        var alunoDTO = new alunoDTO
        {
            Id = result.Id,
            Nome = result.Nome
        };

        return ApplicationResult<AlunoDTO>.Success(alunoDTO, message: info.Message);
    }
    
}