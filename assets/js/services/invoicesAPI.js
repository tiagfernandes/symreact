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

/**
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
function findOneById(id) {
    return axios
        .get("https://localhost:8000/api/invoices/" + id)
        .then(response => response.data)
}

/**
 *
 * @param id
 * @param invoice
 * @returns {AxiosPromise<any>}
 */
function update(id, invoice) {
    return axios.put("https://localhost:8000/api/invoices/" + id, invoice);
}

/**
 *
 * @param invoice
 * @returns {AxiosPromise<any>}
 */
function create(invoice) {
    return axios.post("https://localhost:8000/api/invoices", invoice);
}

export default {
    findAll,
    deleteById,
    findOneById,
    update,
    create
}