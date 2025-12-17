using System;

namespace Conexus.Api.Aplication.DTOs;

public class AvaliacaoDetalheDTO
{
    public int Idavaliacao { get; set; }

    public int IdalunoTurma { get; set; }

    public int Idfuncionario { get; set; }

    public int Idturma { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public string? Titulo { get; set; }

    public DateOnly DataAvaliacao { get; set; }

    public decimal? Nota { get; set; }

    public decimal? Peso { get; set; }

    public string? Observacao { get; set; }

    // Campos adicionais
    public string NomeUsuario { get; set; } = string.Empty;
    //public string CpfAluno { get; set; } = string.Empty;
    public string NomeFuncionario { get; set; } = string.Empty;
    //public string CpfFuncionario { get; set; } = string.Empty;
    public string DescricaoTurma { get; set; } = string.Empty;
}
