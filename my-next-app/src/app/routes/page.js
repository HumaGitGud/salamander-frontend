import Link from "next/link";

const restaurants = [
    {id:1, name:"The Cozy Corner"}, 
    {id:2, name:"Sushi Express"}, 
    {id:3, name:"Pasta Palace"}, 
    {id:4, name:"Taco Town"}, 
    {id:5, name:"Bella Italia"} 
];

export default function Restaurants() {
    return (
        <div>
            {restaurants.map(restaurant => (
                <div key={restaurant.id}>
                    <Link href={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
                </div>
            ))}
        </div>
    );
}