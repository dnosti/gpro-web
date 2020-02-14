import { authHeader } from './auth-header';
import { handleResponse } from './handle-response';

export const userService = {
    getAll,
    getById,
    getByApyNom,
    getByDni,
    register
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('http://localhost:60932/usuarios', requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`http://localhost:60932/usuarios/${id}`, requestOptions).then(handleResponse);
}

function getByDni(dni) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`http://localhost:60932/usuarios/dni/${dni}`, requestOptions).then(handleResponse);
}


function getByApyNom(apellido, nombre) {
    const requestOptions = { method: 'GET', headers: authHeader() }
    return fetch(`http://localhost:60932/usuarios/apynom/${apellido}/${nombre}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(user)
    };

    return fetch('http://localhost:60932/usuarios/register', requestOptions).then(handleResponse);
}