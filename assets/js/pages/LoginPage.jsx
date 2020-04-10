import React, {useContext, useState} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../context/AuthContext";
import Field from "../components/Forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({history}) => {
    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;

        setCredentials({...credentials, [name]: value})
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await authAPI.authenticate(credentials);
            setIsAuthenticated(true);
            setError('');
            toast.success("Vous êtes désormais connecté !");
            history.replace("/customers");
        } catch (e) {
            console.log(e.response);
            toast.error("Une erreur est survenue");
            setError("Données invalides")
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="username"
                    label="Adresse email"
                    type="email"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse de connexion"
                    error={error}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success mt-3">Je me connecte</button>
                </div>
            </form>
        </>
    )
};

export default LoginPage;