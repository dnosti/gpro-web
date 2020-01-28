import { authHeader } from './auth-header';
import { handleResponse } from './handle-response';

export const clienteService = {
    getByString,
    getById,
};



function getByString(dato: string) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`http://localhost:60932/cliente/dato/${dato}`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`http://localhost:60932/cliente/cuit/${id}`, requestOptions).then(handleResponse);
    }