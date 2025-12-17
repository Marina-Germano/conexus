using System;
using System.Collections.Generic;

namespace Conexus.Api.Aplication.DTOs;

public partial class AlunoTurmaDetalheDTO
{
    public int IdalunoTurma { get; set; }

    public int Idaluno { get; set; }

    public int Idturma { get; set; }

    public string NomeUsuario { get; set; } = string.Empty;

    public string DescricaoTurma { get; set; } = string.Empty;
    
    public string CpfUsuario {get; set;} = string.Empty;

    public DateOnly? DataMatricula { get; set; }

}
