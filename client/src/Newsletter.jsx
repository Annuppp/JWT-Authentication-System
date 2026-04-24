import { ActionButton } from "./ActionButton.jsx";

export const Newsletter = () => {
    const handleSubscribe = () => {
        console.log("Subscribed");
    };
    return (
        <div>
            <h2>Subscribe to the Newsletter</h2>
            <ActionButton text="Subscribe" onClick={handleSubscribe} />
        </div>
    );
};
