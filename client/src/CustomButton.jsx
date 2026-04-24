export const CustomButton = ({ text }) => {
    return (
        <div>
            <h2>This is CustomButton</h2>
            <button
                onClick={() => {
                    console.log("The custom button was clicked");
                }}
            >
                {text}
            </button>
        </div>
    );
};
