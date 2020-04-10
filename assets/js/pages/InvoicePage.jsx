import React, {useEffect, useState} from 'react';
import Field from "../components/Forms/Field";
import Select from "../components/Forms/Select";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const InvoicePage = ({history, match}) => {

    const {id = "new"} = match.params;
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            if (!invoice.customer) setInvoice({...invoice, customer: data[0]['@id']});

            setLoading(false);
        } catch (e) {
            toast.error("Une erreur est survenue !");
            console.log(e.response);
            history.replace("/invoices");
        }
    };

    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await InvoicesAPI.findOneById(id);
            setInvoice({amount, status, customer: customer['@id']});
            setLoading(false);
        } catch (e) {
            toast.error("Une erreur est survenue !");
            console.log(e);
            history.replace('/invoices');
        }
    };

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({
            ...invoice,
            [name]: value
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                console.log(editing);
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été mise a jours");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été créée");
            }
            history.replace("/invoices");
        } catch (e) {
            toast.error("Une erreur est survenue !");
            if (e.response.data.violations) {
                const apiErrors = {};
                e.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });

                setErrors(apiErrors);
            }
        }
    };

    return (
        <>
            {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}
            {loading && <FormContentLoader/>}
            {!loading && (<form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                    placeholder="Choisir un client"
                >
                    {customers.map(customer => <option key={customer.id}
                                                       value={customer['@id']}>{customer.firstName} {customer.lastName}</option>)}
                </Select>

                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                    placeholder="Choisir un statut"
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/invoices" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>)}
        </>
    );
};

export default InvoicePage;