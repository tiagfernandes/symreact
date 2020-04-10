import React, {useState} from 'react';
import Field from "../components/Forms/Field";
import {Link} from "react-router-dom";
import AuthAPI from "../services/authAPI";

const RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({
            ...user,
            [name]: value
        })
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Mot de passe non identique"
        } else {
            try {
                await AuthAPI.register(user);
                history.replace("/login");
            } catch (e) {
                console.log(e);
                if (e.response.data.violations) {
                    e.response.data.violations.forEach(violation => {
                        apiErrors[violation.propertyPath] = violation.message;
                    });

                }
            }
        }
        setErrors(apiErrors);
    };

    return (
        <>
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom"
                    placeholder="Votre Nom"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Votre email"
                    error={errors.email}
                    value={user.email}
                    type="email"
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation de mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;