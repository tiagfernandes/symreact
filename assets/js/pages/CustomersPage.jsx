import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = props => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    //Récupère les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            console.log(error.response)
        }
    };

    //Au chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);

    //Gestion de la suppression
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await CustomersAPI.deleteById(id);
            toast.success("Le client a été supprimé");
        } catch (error) {
            toast.error("Une erreur est survenue !");
            console.log(error.response);
            setCustomers(originalCustomers);
        }
    };

    //Gestion de changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const itemsPerPage = 10;

    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setCurrentPage(1);
        setSearch(currentTarget.value);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>

            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher ..." onChange={handleSearch}
                       value={search}/>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </tr>
                </thead>
                {!loading && (<tbody>
                {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <a href="#">{customer.firstName} {customer.lastName}</a>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-info">{customer.invoices.length}</span>
                        </td>
                        <td className="text-center">
                            {customer.totalAmount.toLocaleString()} €
                        </td>
                        <td>
                            <Link to={"/customers/" + customer.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>)}
            </table>
            {loading && <TableLoader/>}

            {itemsPerPage < filteredCustomers.length &&
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length}
                        onPageChanged={handlePageChange}/>
            }
        </>
    );
};

export default CustomersPage;