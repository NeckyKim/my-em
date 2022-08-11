import React, { useEffect } from "react";
import { useState } from "react";

import { dbService } from "../FirebaseModules";
import { collection } from "firebase/firestore";
// import { doc } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
// import { getDocs } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { query } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { ref } from "firebase/storage";
import { uploadString } from "firebase/storage";

import Message from "../components/Message";

import styles from "./Home.module.css"



function Home({ userObject }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageLength, setMessageLength] = useState(0);
    const [attachment, setAttachment] = useState();

    useEffect(() => {
        const q = query(
            collection(dbService, "messages"),
            orderBy("time")
        );

        onSnapshot(q, (snapshot) => {
            const messageArray = snapshot.docs.map((current) => ({
                id: current.id,
                ...current.data()
            }));

            setMessages(messageArray);
            setMessageLength(messageArray.length)
        });
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();

        await addDoc(collection(dbService, "messages"), {
            message: message,
            time: Date.now(),
            creatorId: userObject.uid,
            creatorEmail: userObject.email,
        });

        setMessage("");
    };

    const onChange = (event) => {
        const { target: { value } } = event;

        setMessage(value);
    }

    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];

        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => {
        setAttachment(null);
    }



    return (
        <div>
            <div className={styles.messageInputBackground} />

            <form onSubmit={onSubmit} className={styles.messageInputContainer}>
                <textarea
                    type="textarea"
                    name="message"
                    placeholder="메시지를 입력하세요."
                    value={message}
                    onChange={onChange}
                    maxLength={1000}
                    className={styles.messageInputZone}
                    required
                />

                <input type="file" accept="image/*" onChange={onFileChange} />

                <div>
                    {attachment && <img src={attachment} width="50px" />}
                    <button onClick={onClearAttachment}>Clear</button>
                </div>

                <input type="submit" value="전송" className={styles.messageSendButton} />
                <br /><br />
            </form>

            <div className={styles.messageDisplayZone}>
                {messages.map((current) =>
                    <Message key={current.id} messageObject={current}
                        isOwner={userObject.uid === current.creatorId} />
                )}
            </div>

            {messageLength === 0 &&
                <div className={styles.noMessages}>
                    메시지가 없습니다
                </div>
            }
        </div>
    )
}

export default Home;