using gpro_web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace gpro_web.Services
{    
    public interface IClienteService
{
    Cliente BuscarPorCuit(Int64 cuit);
    List<Cliente> BuscarClientes(String Dato);
    void NuevoCliente(Cliente cliente);
    void UpdateCliente(Cliente cliente);
}

public class ClienteService : IClienteService
{
    private gpro_dbContext _context;

    public ClienteService(gpro_dbContext context)
        {
            _context = context;
        }

    public List<Cliente> BuscarClientes(string Dato)
    {
        var clientes = from b in _context.Cliente
                       where b.ApellidoCliente.Contains(Dato) || b.NombreCliente.Contains(Dato) || b.RazonSocialCliente.Contains(Dato)
                       select b;
        if (clientes.ToList().Count() == 0)
        {
            return null;
        }

        return clientes.ToList();
    }

    public Cliente BuscarPorCuit(Int64 cuit)
    {
        var cliente = from b in _context.Cliente
                      where b.IdCliente.Equals(cuit)
                      select b;

        if (cliente.ToList().Count() == 0)
        {
            return null;
        }
        return cliente.ToList().ElementAt(0);
    }

    public void NuevoCliente(Cliente cliente)
    {
        throw new NotImplementedException();
    }

    public void UpdateCliente(Cliente cliente)
    {
        throw new NotImplementedException();
    }
}
}
