import React, { useState } from "react";
import styles from "./ChatBot.module.css";
// import bot from "./assets/bot.svg";
// import send from "./assets/send.png";
import { SendHorizontal, BotMessageSquare } from "lucide-react";
// import user from "./assets/user.png";
import cancel from "./assets/cancel.svg";
import axios, { AxiosResponse } from "axios";

interface Message {
	text: string;
	sender: "user" | "bot";
}

interface ChatResponse {
	success: boolean;
	answer: string;
}

const ChatBot: React.FC<{ propFnc: () => void; OpenChat: boolean }> = ({
	propFnc,
	OpenChat,
}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState<string>("");

	const handleSendMessage = async () => {
		const objFromUser: Message = {
			text: input,
			sender: "user",
		};

		setMessages((prev) => [...prev, objFromUser]);
		setInput("");

		const objToSend = {
			external_user_id:  JSON.parse(localStorage.getItem("user")!).username,
			query: input,
		};

		try {
			const response: AxiosResponse<ChatResponse> = await axios.post(
				"http://localhost:8000/chat",
				objToSend,
				{
					timeout : 50 * 1000, // 50 sec
				}
			);

			if (response.data.success) {
				const objectReceived : Message = {
					text: response.data.answer,
					sender: "bot",
				}
				setMessages((prev) => [...prev, objectReceived]);
			} else {
				const objectReceived : Message = {
					text: "ERROR: Unable to get a valid response.",
					sender: "bot",
				}
				setMessages((prev) => [...prev, objectReceived]);

			}
		} catch (error) {
			console.error("Error sending message:", error);
			const objectReceived : Message = {
				text: "ERROR: Something went wrong.",
				sender: "bot",
			}
			setMessages((prev) => [...prev, objectReceived]);
		} 
	};

	return (
		<div
			className={styles.chatbot}
			style={{ display: OpenChat ? "flex" : "none" }}
		>
			<div className={styles.header}>
				<div>
					<BotMessageSquare
						color="white"
						size={"30px"}
					/>
					<h4>Chat with Us</h4>
				</div>
				<button
					onClick={propFnc}
					className="cursor-pointer"
					aria-label="Cancel"
				>
					<img
						src={cancel}
						alt="cancelBtn"
					/>
				</button>
			</div>
			<div className={styles.messages}>
				{messages.map((msg, index) => (
					<div
						key={index + msg.sender}
						className={styles[msg.sender]}
					>
						{msg.text}
					</div>
				))}
			</div>
			<div className={styles.inputArea}>
				<div className={styles.input}>
					<input
						type="text"
						placeholder="Type your Message Here..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(event) =>
							event.key === "Enter" && handleSendMessage()
						}
					/>
					<button onClick={handleSendMessage}>
						<SendHorizontal />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatBot;
