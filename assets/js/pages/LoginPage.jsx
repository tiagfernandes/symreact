import React, {useContext, useState} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../context/AuthContext";

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
            history.replace("/customers");
        } catch (e) {
            console.log(e.response);
            setError("Données invalides")
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-groupe">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="email"
                        placeholder="Adresse de connexion"
                        name="username"
                        className={"form-control" + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success mt-3">Je me connecte</button>
                </div>
            </form>
        </>
    )
};

export default LoginPage;