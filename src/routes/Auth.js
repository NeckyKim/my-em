import React from "react";
import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
// import { sendEmailVerification } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
// import { sendSignInLinkToEmail } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { TwitterAuthProvider } from "firebase/auth";
// import { GithubAuthProvider } from "firebase/auth";
// import { authService } from "../FirebaseModules";

import styles from "./Auth.module.css"



function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [findPassword, setFindPassword] = useState(false);
    const [message, setMessage] = useState("")

    const auth = getAuth();

    const onChange = (event) => {
        const { target: { name, value } } = event;

        if (name === "email") {
            setEmail(value);
        }

        else if (name === "password") {
            setPassword(value);
        }

        else if (name === "passwordCheck") {
            setPasswordCheck(value);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            if (newAccount) {
                if (password === passwordCheck) {
                    try {
                        await createUserWithEmailAndPassword(
                            auth, email, password
                        );

                        // sendSignInLinkToEmail(auth, email, {
                        //     url: "https://my-em-46948.firebaseapp.com",
                        //     handleCodeInApp: true
                        // });
                    }


                    catch (error) {
                        setMessage("???????????? ?????? ????????? ??????????????????.");
                    }
                }

                else {
                    setMessage("??????????????? ???????????? ????????????.")
                }
            }

            else if (findPassword) {
                await sendPasswordResetEmail(auth, email);
                setMessage("???????????? ?????????????????????.");
                setEmail("");
                setPassword("");
                setFindPassword(false);
            }

            else {
                await signInWithEmailAndPassword(
                    auth, email, password
                );
            }

        }

        catch (error) {
            if (error.code === "auth/user-not-found") {
                setMessage("???????????? ?????? ??????????????????.");
            }

            else if (error.code === "auth/invalid-email") {
                setMessage("???????????? ?????? ????????? ???????????????.");
            }

            else if (error.code === "auth/wrong-password") {
                setMessage("???????????? ?????? ?????????????????????.");
            }

            else if (error.code === "auth/email-already-in-use") {
                setMessage("?????? ????????? ??????????????????.");
            }

            else if (error.code === "auth/weak-password") {
                setMessage("??????????????? ?????? ????????????.");
            }

            else {
                setMessage("????????? ?????? ????????? ??????????????????.");
            }
        }
    }

    const toggleLoginRegister = () => {
        setMessage("");
        setEmail("");
        setPassword("");
        setPasswordCheck("");
        setNewAccount(prev => !prev);
    }

    const toggleLoginFindPassword = () => {
        setMessage("");
        setEmail("");
        setPassword("");
        setPasswordCheck("");
        setFindPassword(prev => !prev);
    }

    const onSocialClick = async (event) => {
        const name = event.target.name;
        let provider;

        try {
            if (name === "google") {
                provider = new GoogleAuthProvider();
            }

            else if (name === "facebook") {
                provider = new FacebookAuthProvider();
            }

            else if (name === "twitter") {
                provider = new TwitterAuthProvider();
            }

            await signInWithPopup(auth, provider);
        }

        catch (error) {
            if (error.code === "auth/popup-closed-by-user") {
                setMessage("???????????? ?????????????????????.");
            }

            else if (error.code === "auth/account-exists-with-different-credential") {
                setMessage("?????? ?????? ???????????? ????????? ??????????????????.");
            }

            else {
                setMessage("????????? ?????? ????????? ??????????????????.");
            }
        }
    }



    return (
        <div className={styles.loginContainer}>
            <div className={styles.background} />

            <div className={styles.title}>
                my:em
            </div>
            <br />

            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="?????????"
                    value={email}
                    onChange={onChange}
                    className={styles.inputZone}
                    required
                />
                <br />

                {
                    !findPassword &&
                    <>
                        <input
                            name="password"
                            type="password"
                            placeholder="????????????"
                            value={password}
                            onChange={onChange}
                            className={styles.inputZone}
                            required
                        />
                    </>
                }
                <br />


                {
                    newAccount && !findPassword &&
                    <input
                        name="passwordCheck"
                        type="password"
                        placeholder="???????????? ??????"
                        value={passwordCheck}
                        onChange={onChange}
                        className={styles.inputZone}
                        required
                    />
                }

                <input
                    type="submit"
                    value={!newAccount ? (!findPassword ? "?????????" : "???????????? ?????????") : "?????? ??????"}
                    className={styles.mainButton}
                />
                <br />
            </form>

            <div className={styles.errorMessage}>
                {message}
            </div>

            <span onClick={toggleLoginRegister} className={styles.toggleButton}>
                {
                    newAccount === true && findPassword === false ?
                        "????????????" :
                        (findPassword === false ? "???????????? ??????" : "")
                }
            </span>

            <span className={styles.toggleButtonBeside}>
                {
                    newAccount === false && findPassword === false ? "???|???" : ""
                }
            </span>

            <span
                onClick={toggleLoginFindPassword} className={styles.toggleButton}>
                {
                    findPassword === true && newAccount === false ?
                        "????????????" :
                        (newAccount === false ? "???????????? ??????" : "")
                }
            </span>
            <br /><br />

            {
                !newAccount && !findPassword &&
                <div className={styles.buttonsZone}>
                    <button
                        name="google"
                        onClick={onSocialClick}
                        className={styles.googleButton}
                    >
                        <img
                            alt="google"
                            src={process.env.PUBLIC_URL + "/auth/google.png"}
                            onClick={onSocialClick}
                            className={styles.socialLoginIcon}
                        />
                        Google ?????????
                    </button>

                    <button
                        name="facebook"
                        onClick={onSocialClick}
                        className={styles.facebookButton}
                    >
                        <img
                            alt="facebook"
                            src={process.env.PUBLIC_URL + "/auth/facebook.png"}
                            className={styles.socialLoginIcon}
                        />
                        Facebook ?????????
                    </button>
                </div>
            }
        </div>
    )
}

export default Auth;