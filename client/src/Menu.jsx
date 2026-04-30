import { MenuItems } from "./MenuItems";

export const Menu = () => {
    const handleOrder = (name, price) => {
        console.log(`You ordered ${name} for Rs${price}.`);
    };
    return (
        <div>
            <MenuItems name="Pizza" price={20} onOrder={handleOrder} />
            <MenuItems name="Burger" price={10} onOrder={handleOrder} />
            <MenuItems name="Momo" price={5} onOrder={handleOrder} />
        </div>
    );
};
