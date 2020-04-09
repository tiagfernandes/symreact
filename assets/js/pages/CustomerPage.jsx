import React, {useEffect, useState} from 'react';
import Field from "../components/Forms/Field";
import {Link} from "react-router-dom";
import axios from "axios";

const CustomerPage = ({match}) => {

    const [editing, setEditing] = useState(false);
    const {id = "new"} = match.params;

    const fetchCustomer = async id => {
        try {
            const data = await axios
                .get("https://localhost:8000/api/customers/" + id)
                .then(response => response.data);
            const {firstName, lastName, email, company} = data;

            setCustomer({firstName, lastName, email, company});
        } catch (e) {
            console.log(e.response);
        }
    };


    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    const [customer, setCustomer] = useState(
        {
            lastName: "",
            firstName: "",
            email: "",
            company: ""
        }
    );

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });


    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({
            ...customer,
            [name]: value
        })
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                const response = await axios.put("https://localhost:8000/api/customers/" + id, customer);
                console.log(response);
            } else {
                const response = await axios.post("https://localhost:8000/api/customers", customer);
            }

            setErrors({});
        } catch (e) {
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
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}

            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Email du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    )
};

export default CustomerPage;