using Conexus.Api.Aplication.DTOs;
using Conexus.Api.Domain.Models;
using Conexus.Api.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Conexus.Api.Aplication;
using Conexus.Api.Infra;
namespace Conexus.Api.Domain.Services;

public class AlunoServiceDomain : IAlunoServiceDomain
{

    private readonly AppDbContext _context;
    public AlunoServiceDomain(AppDbContext context) //injeção de dependencia
    {
        _context = context;
    }

    [HttpPost("inserir")]
    public async Task<ApplicationResult<long>> Inserir(AlunoDTO alunoDTO)
    {
        if (alunoDTO == null)
        {
            return ApplicationResult<long>.Failure("Dados inválidos.", 400);
        }

        Aluno aluno = new Aluno();
        
        aluno.Idaluno = alunoDTO.Idaluno;
        aluno.Idusuario = alunoDTO.Idusuario;
        aluno.Cep = alunoDTO.Cep;
        aluno.Rua = alunoDTO.Rua;
        aluno.Numero = alunoDTO.Numero;
        aluno.Bairro = alunoDTO.Bairro;
        aluno.Complemento = alunoDTO.Complemento;
        aluno.Responsavel = alunoDTO.Responsavel;
        aluno.TelResponsavel = alunoDTO.TelResponsavel;
        aluno.Situacao = alunoDTO.Situacao;

        await _context.Alunos.AddAsync(aluno); //adiciona o Aluno no contexto
        await _context.SaveChangesAsync(); //salva as alterações no banco de dados

        var result = ApplicationResult<long>.Success(aluno.Idaluno, 200, "Registro Salvo com Sucesso.");
        return result;
    }

    [HttpGet("buscar-todos")]
        public async Task<ApplicationResult<List<AlunoDTO>>> Buscar()
        {
            var alunos = await _context.Alunos
                .Select(a => new AlunoDTO
                {
                    Idaluno = a.Idaluno,
                    Idusuario = a.Idusuario,
                    Cep = a.Cep,
                    Rua = a.Rua,
                    Numero = a.Numero,
                    Bairro = a.Bairro,
                    Complemento = a.Complemento,
                    Responsavel = a.Responsavel,
                    TelResponsavel = a.TelResponsavel,
                    Situacao = a.Situacao,
                    //NomeUsuario = a.IdusuarioNavigation != null ? a.IdusuarioNavigation.Nome : string.Empty
                    // CPF não incluído aqui
                })
                .ToListAsync();

            return ApplicationResult<List<AlunoDTO>>.Success(alunos, 200, "Registros Localizados.");
        }

        // Busca Detalhada
        [HttpGet("buscar-todos-detalhes")]
        public async Task<ApplicationResult<List<AlunoDetalheDTO>>> BuscarTodos()
        {
            var alunos = await _context.Alunos
                .Include(a => a.IdusuarioNavigation) // Inclui dados do usuário
                .Select(a => new AlunoDetalheDTO
                {
                    Idaluno = a.Idaluno,
                    Idusuario = a.Idusuario,
                    Cep = a.Cep,
                    Rua = a.Rua,
                    Numero = a.Numero,
                    Bairro = a.Bairro,
                    Complemento = a.Complemento,
                    Responsavel = a.Responsavel,
                    TelResponsavel = a.TelResponsavel,
                    Situacao = a.Situacao,
                    NomeUsuario = a.IdusuarioNavigation.Nome,
                    CpfUsuario = a.IdusuarioNavigation.Cpf
                })
                .ToListAsync();

            return ApplicationResult<List<AlunoDetalheDTO>>.Success(alunos, 200, "Registros Localizados.");
        }

    public async Task<ApplicationResult<AlunoDTO>> Atualizar(AlunoDTO alunoDTO)
    {
        var info = new { Message = "Parâmetros inválidos." };

        if (alunoDTO == null || alunoDTO.Id <= 0)
        {
            return ApplicationResult<AlunoDTO>.Failure(info.Message, 400);
        }

        var result = await _context.Alunos.Where(a => a.Idaluno == alunoDTO.Id).FirstOrDefaultAsync();

        if (result == null)
        {
            info = new { Message = "Registro não encontrado." };
        }
        ApplicationResult<AlunoDTO>.Failure(info.Message, 400);

        result.Idaluno = alunoDTO.Idaluno;
        result.Idusuario = alunoDTO.Idusuario;
        result.Cep = alunoDTO.Cep;
        result.Situacao = alunoDTO.Situacao;
        result.TelResponsavel = alunoDTO.TelResponsavel;
        result.Responsavel = alunoDTO.Responsavel;
        result.Complemento = alunoDTO.Complemento;
        result.Bairro = alunoDTO.Bairro;
        result.Numero = alunoDTO.Numero;
        result.Rua = alunoDTO.Rua;

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

        var result = await _context.Alunos.Where(a => a.Idaluno == id).FirstOrDefaultAsync();

        if (result == null)
        {
            info = new { Message = "Registro não encontrado." };
            return ApplicationResult<AlunoDTO>.Failure(info.Message, 400);
        }

        _context.Entry<Aluno>(result).State = EntityState.Deleted;

        await _context.SaveChangesAsync();

        info = new { Message = "Registro Excluidos" };

        var alunoDTO = new AlunoDTO
        {
            Id = result.Idaluno,
            Cep = result.Cep,
            Situacao = result.Situacao,
            TelResponsavel = result.TelResponsavel,
            Responsavel = result.Responsavel,
            Complemento = result.Complemento,
            Bairro = result.Bairro,
            Numero = result.Numero,
            Rua = result.Rua
        };

        return ApplicationResult<AlunoDTO>.Success(alunoDTO, message: info.Message);
    }

    // public async Task<ApplicationResult<List<NomeAlunoDTO>>> NomeAlunos(string nome)
    // {
    //     var NomeAluno = _context.NomeAlunos;

    //     var result = NomeAluno.Join(
    //         _context.Usuario, //Chave Estrangeira
    //         ie => ie.idusuario, //Chave Primária
    //         e => e.Id,

    //         (ie, e) => new NomeAlunoDTO
    //         {
    //             Id = ie.Id,
    //             idusuario = ie.idusuario,
    //             Valor = ie.Valor,
    //             Evento = new EventoDTO
    //             {
    //                 Id = e.Id,
    //                 Nome = e.Nome
    //             }
    //         }
    //     );

    //     if (string.IsNullOrEmpty(nome))
    //     {
    //         result = result.Where(e => e.Evento.Nome.Contains(nome));
    //     }

    //     var results = await result.ToListAsync();

    //     return ApplicationResult<List<NomeAlunoDTO>>.Success(results);
    // }
}