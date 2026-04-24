import "./App.css";
import { Newsletter } from "./Newsletter.jsx";
import { Contact } from "./Contact.jsx";
import { CustomButton } from "./customButton.jsx";

const App = () => {
    return (
        <div>
            <Contact />
            <Newsletter />
            <CustomButton text="Custom" />
        </div>
    );
};

export default App;
