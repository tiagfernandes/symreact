import axios from 'axios';

/**
 * @returns {AxiosPromise<any>}
 */
function findAll() {
    return axios
        .get('https://localhost:8000/api/invoices')
        .then(response => response.data['hydra:member']);
}

/**
 * @param id
 * @returns {AxiosPromise}
 */
function deleteById(id) {
    return axios
        .delete('https://localhost:8000/api/invoices/' + id);
}

export default {
    findAll,
    deleteById
}