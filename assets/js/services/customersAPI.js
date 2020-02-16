import axios from 'axios';

/**
 * @returns {AxiosPromise<any>}
 */
function findAll() {
    return axios
        .get('https://localhost:8000/api/customers')
        .then(response => response.data['hydra:member']);
}

/**
 * @param id
 * @returns {AxiosPromise}
 */
function deleteById(id) {
    return axios
        .delete('https://localhost:8000/api/customers/' + id);
}

export default {
    findAll,
    deleteById
}