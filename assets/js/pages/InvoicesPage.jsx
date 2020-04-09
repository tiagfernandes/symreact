import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import moment from 'moment';
import InvoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Enoyée",
    CANCELLED: "Annulée"
};

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch (e) {
            console.log(e.response);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    //Gestion de changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setCurrentPage(1);
        setSearch(currentTarget.value);
    };

    //Gestion de la suppression
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.deleteById(id);
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    };

    const itemsPerPage = 10;


    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (<>
        <h1>Liste des factures</h1>

        <div className="form-group">
            <input type="text" className="form-control" placeholder="Rechercher ..." onChange={handleSearch}
                   value={search}/>
        </div>

        <table className="table table-hover">
            <thead>
            <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th className="text-center">Date d'envoi</th>
                <th className="text-center">Status</th>
                <th className="text-center">Montant</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                    <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                </td>
                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                <td className="text-center">
                    <span
                        className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                </td>
                <td className="text-center">
                    {invoice.amount.toLocaleString()} €
                </td>
                <td>
                    <button className="btn btn-sm btn-primary mr-1">Editer</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer
                    </button>
                </td>
            </tr>)}

            </tbody>
        </table>
        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange}
                    length={filteredInvoices.length}/>
    </>);
};

export default InvoicesPage;