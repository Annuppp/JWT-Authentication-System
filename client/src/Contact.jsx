import { ActionButton } from "./ActionButton.jsx";

export const Contact = () => {
    const Message = () => {
        console.log("Message Sent");
    };
    return (
        <div>
            <h2>Contact us</h2>
            <ActionButton text="Send Message" onClick={Message} />
        </div>
    );
};
