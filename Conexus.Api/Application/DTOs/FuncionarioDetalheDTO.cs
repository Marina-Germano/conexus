using System;
using System.Collections.Generic;

namespace Conexus.Api.Aplication.DTOs;

public partial class FuncionarioDetalheDTO
{
    // public int Idfuncionario { get; set; }

    // public int Idusuario { get; set; }

    // public string? Cargo { get; set; }

    public string? Especialidade { get; set; }

    public string NomeUsuario { get; set; } = string.Empty;
    
    public string Cpf { get; set; } = string.Empty;
}