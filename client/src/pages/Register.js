import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from "../Components/Atoms";
import styled from "styled-components";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { RunningImg } from "../Components/Atoms";
import narutoRun from "../assets/images/narutoRun.gif";
import { useTranslation } from "react-i18next";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  const { user, isLoading, showAlert, displayAlert, setupUser } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    const isDemo = false;

    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password, isDemo };
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: t("login.alert_text"),
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: t("register.alert_text"),
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/my-animes");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? t("register.title") : t("login.title")}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            labelText={t("register.name")}
            value={values.name}
            handleChange={handleChange}
          />
        )}

        {/* email input */}
        <FormRow
          type="email"
          name="email"
          labelText={t("register.email")}
          value={values.email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          type="password"
          name="password"
          labelText={t("register.password")}
          value={values.password}
          handleChange={handleChange}
        />
        <button
          type="submit"
          className="btn btn-block btn-submit"
          disabled={isLoading}
        >
          {t("register.submit")}
        </button>
        <p>
          {values.isMember ? t("login.switch1") : t("register.switch1")}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? t("login.switch2") : t("register.switch2")}
          </button>
        </p>
      </form>
      <div className="run">
        <RunningImg img={narutoRun} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .run {
    position: absolute;
    top: 80vh;
    left: 0;
    width: 100vw;
  }
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }

  h3 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
`;

export default Register;
