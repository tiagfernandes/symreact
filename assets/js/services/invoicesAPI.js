import axios from 'axios';
import {INVOICES_API} from "../config";

/**
 * @returns {AxiosPromise<any>}
 */
function findAll() {
    return axios
        .get(INVOICES_API)
        .then(response => response.data['hydra:member']);
}

/**
 * @param id
 * @returns {AxiosPromise}
 */
function deleteById(id) {
    return axios
        .delete(INVOICES_API + "/" + id);
}

/**
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
function findOneById(id) {
    return axios
        .get(INVOICES_API + "/" + id)
        .then(response => response.data)
}

/**
 *
 * @param id
 * @param invoice
 * @returns {AxiosPromise<any>}
 */
function update(id, invoice) {
    return axios.put(INVOICES_API + "/" + id, invoice);
}

/**
 *
 * @param invoice
 * @returns {AxiosPromise<any>}
 */
function create(invoice) {
    return axios.post(INVOICES_API, invoice);
}

export default {
    findAll,
    deleteById,
    findOneById,
    update,
    create
}