using System.ComponentModel.DataAnnotations;

namespace Conexus.Api.Aplication.DTOs;

public class AlunoDTO
{
    public long Id { get; set; }

    [Required(ErrorMessage = "Nome obrigatório")] //not null no banco de dados
    [MinLength(6)]
    [MaxLength(500, ErrorMessage = "Ultrapassouo limite excedido!")] //define apenas tamanho maximo
    public string Nome { get; set; }
}