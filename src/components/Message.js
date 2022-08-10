import React from "react";
import { useState } from "react";

import { dbService } from "../FirebaseModules";
import { doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

import styles from "./Message.module.css"



function Message({ messageObject, isOwner }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newMessage, setNewMessage] = useState(messageObject.message);

    const beforeMessage = messageObject.message;

    const onSubmit = async (event) => {
        event.preventDefault();

        const ok = window.confirm("수정하시겠습니까?");
        const textRef = doc(dbService, "messages", `${messageObject.id}`);
        const beforeMessage = messageObject.message;

        if (ok) {
            setIsEditing(false);

            await updateDoc(textRef, {
                message: newMessage
            });
        }
    }

    const onChange = (event) => {
        const { target: { name, value } } = event;

        setNewMessage(value);
    }

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        const textRef = doc(dbService, "messages", `${messageObject.id}`);

        if (ok) {
            await deleteDoc(textRef);
        }
    }

    const toggleEditing = () => {
        setNewMessage(beforeMessage);
        setIsEditing((prev) => !prev);
    }

    const timeConverter = (time) => {
        return Number(time);
    }



    return (
        <div className={styles.messageContainer}>
            <div className={styles.messageInfo}>
                <span className={styles.messageEmail}>
                    {messageObject.creatorEmail}
                </span>

                <span className={styles.messageTime}>
                    {timeConverter(messageObject.time)}
                </span>
            </div>


            {
                isEditing ?
                    <form onSubmit={onSubmit}>
                        <textarea
                            type="text"
                            value={newMessage}
                            onChange={onChange}
                            className={styles.editingBox}
                            required
                        />
                        <br />

                        <input
                            type="submit"
                            value="완료"
                            className={styles.button}
                        />

                        <button onClick={toggleEditing} className={styles.button}>
                            취소
                        </button>
                    </form>
                    :
                    <div className={styles.messageText}>
                        {messageObject.message}
                    </div>
            }

            {
                isOwner && !isEditing &&
                <div>
                    <button onClick={toggleEditing} className={styles.button}>
                        수정
                    </button>
                    <button onClick={onDeleteClick} className={styles.button}>
                        삭제
                    </button>
                </div>
            }
        </div >
    )
}

export default Message;