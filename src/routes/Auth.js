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
                        setMessage("회원가입 중에 오류가 발생했습니다.");
                    }
                }

                else {
                    setMessage("비밀번호가 일치하지 않습니다.")
                }
            }

            else if (findPassword) {
                await sendPasswordResetEmail(auth, email);
                setMessage("이메일이 전송되었습니다.");
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
                setMessage("가입되지 않은 이메일입니다.");
            }

            else if (error.code === "auth/invalid-email") {
                setMessage("올바르지 않은 이메일 형식입니다.");
            }

            else if (error.code === "auth/wrong-password") {
                setMessage("올바르지 않은 비밀번호입니다.");
            }

            else if (error.code === "auth/email-already-in-use") {
                setMessage("이미 가입된 이메일입니다.");
            }

            else if (error.code === "auth/weak-password") {
                setMessage("비밀번호가 너무 짧습니다.");
            }

            else {
                setMessage("로그인 중에 오류가 발생했습니다.");
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
                setMessage("로그인이 취소되었습니다.");
            }

            else if (error.code === "auth/account-exists-with-different-credential") {
                setMessage("이미 다른 계정으로 가입된 이메일입니다.");
            }

            else {
                setMessage("로그인 중에 오류가 발생했습니다.");
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
                    placeholder="이메일"
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
                            placeholder="비밀번호"
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
                        placeholder="비밀번호 확인"
                        value={passwordCheck}
                        onChange={onChange}
                        className={styles.inputZone}
                        required
                    />
                }

                <input
                    type="submit"
                    value={!newAccount ? (!findPassword ? "로그인" : "비밀번호 재설정") : "회원 가입"}
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
                        "돌아가기" :
                        (findPassword === false ? "회원가입 하기" : "")
                }
            </span>

            <span className={styles.toggleButtonBeside}>
                {
                    newAccount === false && findPassword === false ? "ㅤ|ㅤ" : ""
                }
            </span>

            <span
                onClick={toggleLoginFindPassword} className={styles.toggleButton}>
                {
                    findPassword === true && newAccount === false ?
                        "돌아가기" :
                        (newAccount === false ? "비밀번호 찾기" : "")
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
                        Google 로그인
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
                        Facebook 로그인
                    </button>
                </div>
            }
        </div>
    )
}

export default Auth;