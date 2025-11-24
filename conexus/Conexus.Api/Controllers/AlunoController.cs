using Conexus.Api.Infra;
using Conexus.Api.Domain.Services.Interfaces;
using Conexus.Api.Aplication.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Conexus.Api.Aplication;

namespace Conexus.Api.Controllers;

public class AlunoController : ApiControllerBase
{

    private readonly IAlunoServiceDomain _Alunoervice;
    public AlunoController(IAlunoerviceDomain service) //injeção de dependencia
    {
        _Alunoervice = service;
    }

    [HttpPost("inserir")]
    public async Task<IActionResult> Inserir([FromBody] AlunoDTO Aluno)
    {
        ApplicationResult<long> result = await _Alunoervice.Inserir(Aluno);
        return StatusCode(result.StatusCode, result);
    }


    [HttpGet("buscartodos")] //sempre especificar os verbos (o que eu quero que aconteça)
    public async Task<IActionResult> BuscarTodos()
    {
        var result = await _Alunoervice.BuscarTodos();
        return StatusCode(result.StatusCode, result); //retorna o status code 200
    }

    [HttpPut("atualizar")]
    public async Task<IActionResult> Atualizar(AlunoDTO Aluno)
    {
       var result = await _Alunoervice.Atualizar(Aluno);
        return StatusCode(result.StatusCode, result);
    }
    
    [HttpDelete("excluir/{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var result = await _Alunoervice.Excluir(id);
        return StatusCode(result.StatusCode, result);
    }
    
}