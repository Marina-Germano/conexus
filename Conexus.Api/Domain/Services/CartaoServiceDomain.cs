using Conexus.Api.Aplication.DTOs;
using Conexus.Api.Domain.Models;
using Conexus.Api.Infra;
using Conexus.Api.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Conexus.Api.Aplication;

namespace Conexus.Api.Domain.Services;

public class CartaoServiceDomain : ICartaoServiceDomain
{

    private readonly AppDbContext _context;
    public CartaoServiceDomain(AppDbContext context) //injeção de dependencia
    {
        _context = context;
    }

    [HttpPost("inserir")]
    public async Task<ApplicationResult<long>> Inserir(CartaoDTO cartaoDTO)
    {
        if(cartaoDTO == null)
        {
            return ApplicationResult<long>.Failure("Dados inválidos.", 400);
        }
        
        Cartao cartao = new Cartao();
        cartao.Idcartao = cartaoDTO.Idcartao ;
        cartao.Idaluno = cartaoDTO.Idaluno;
        cartao.NomeTitular = cartaoDTO.NomeTitular;
        cartao.Bandeira = cartaoDTO.Bandeira;
        cartao.UltimosDigitos = cartaoDTO.UltimosDigitos;
        cartao.NumeroCriptografado = cartaoDTO.NumeroCriptografado;
        cartao.ValidadeMes = cartaoDTO.ValidadeMes;
        cartao.ValidadeAno = cartaoDTO.ValidadeAno;

        await _context.Cartaos.AddAsync(cartao); //adiciona o Cartao no contexto
        await _context.SaveChangesAsync(); //salva as alterações no banco de dados

        var result = ApplicationResult<long>.Success(cartao.Idcartao, 200, "Registro Salvo com Sucesso.");
        return result;
    }

    public async Task<ApplicationResult<List<CartaoDTO>>> Buscar()
    {
        var cartaos = _context.Cartaos;
        var resultCartaos = await cartaos.Select(e => new CartaoDTO
        {
            Idcartao = e.Idcartao,
            Idaluno = e.Idaluno,
            NomeTitular = e.NomeTitular,
            Bandeira = e.Bandeira,
            UltimosDigitos = e.UltimosDigitos,
            NumeroCriptografado = e.NumeroCriptografado,
            ValidadeMes = e.ValidadeMes,
            ValidadeAno = e.ValidadeAno
        }).ToListAsync();

        var result = ApplicationResult<List<CartaoDTO>>.Success(resultCartaos, 200, "Registros Localizados.");

        return result;
    }

    public async Task<ApplicationResult<List<CartaoDetalheDTO>>> BuscarTodos()
{
    var cartaos = _context.Cartaos;

    var resultCartaos = await cartaos
        .Select(e => new CartaoDetalheDTO
        {
            // Idcartao = e.Idcartao,
            // Idaluno = e.Idaluno,
            // NomeTitular = e.NomeTitular,
            // Bandeira = e.Bandeira,
            // UltimosDigitos = e.UltimosDigitos,
            // NumeroCriptografado = e.NumeroCriptografado,
            // ValidadeMes = e.ValidadeMes,
            // ValidadeAno = e.ValidadeAno,

            // 🔹 Nome do aluno vindo do relacionamento
            NomeUsuario = e.IdalunoNavigation != null
                ? e.IdalunoNavigation.IdusuarioNavigation.Nome
                : string.Empty
        })
        .ToListAsync();

    var result = ApplicationResult<List<CartaoDetalheDTO>>.Success(
        resultCartaos,
        200,
        "Registros Localizados."
    );

    return result;
}


    public async Task<ApplicationResult<CartaoDTO>> Atualizar(CartaoDTO cartaoDTO)
    {
        var info = new {Message = "Parâmetros inválidos." };
        
        if (cartaoDTO == null || cartaoDTO.Idcartao <= 0)
        {
            return ApplicationResult<CartaoDTO>.Failure(info.Message, 400);
        }

        var result = await _context.Cartaos.Where(e => e.Idcartao == cartaoDTO.Idcartao).FirstOrDefaultAsync();

        if (result == null)
        {
            info = new { Message = "Registro não encontrado." };
        }
        ApplicationResult<CartaoDTO>.Failure(info.Message, 400);

        result.Idcartao = cartaoDTO.Idcartao;
        result.Idaluno = cartaoDTO.Idaluno;
        result.NomeTitular = cartaoDTO.NomeTitular;
        result.Bandeira = cartaoDTO.Bandeira;
        result.UltimosDigitos = cartaoDTO.UltimosDigitos;
        result.NumeroCriptografado = cartaoDTO.NumeroCriptografado;
        result.ValidadeMes = cartaoDTO.ValidadeMes;
        result.ValidadeAno = cartaoDTO.ValidadeAno;

        _context.Entry<Cartao>(result).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        info = new { Message = "Dados alterados" };

        return ApplicationResult<CartaoDTO>.Success(cartaoDTO, message: info.Message);
    }
    
    [HttpDelete("excluir")]
    public async Task<ApplicationResult<CartaoDTO>> Excluir(int id)
    {
        var info = new { Message = "Parâmetros inválidos." };

        if (id <= 0)
        {
            return ApplicationResult<CartaoDTO>.Failure(info.Message, 400);
        }

        var result = await _context.Cartaos.Where(e => e.Idcartao == id).FirstOrDefaultAsync();

        if (result == null)
        {
            info = new { Message = "Registro não encontrado." };
            return ApplicationResult<CartaoDTO>.Failure(info.Message, 400);
        }
        
        _context.Entry<Cartao>(result).State = EntityState.Deleted;

        await _context.SaveChangesAsync();

        info = new { Message = "Registro Excluidos" };
        
        var cartaoDTO = new CartaoDTO
        {
            Idcartao = result.Idcartao,
            Idaluno = result.Idaluno,
            NomeTitular = result.NomeTitular,
            Bandeira = result.Bandeira,
            UltimosDigitos = result.UltimosDigitos,
            NumeroCriptografado = result.NumeroCriptografado,
            ValidadeMes = result.ValidadeMes,
            ValidadeAno = result.ValidadeAno
        };

        return ApplicationResult<CartaoDTO>.Success(cartaoDTO, message: info.Message);
    }
    
}