import React from "react";
import './UsersList.css'
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UsersList=({items}) => {
    if(items.length===0) {
        return(
            <div className="center">
                <Card>
                    <h1>No Users Found</h1>
                </Card>
            </div>
        );
    }
    else {
        return (
            <ul className="user-list">
                {items.map(user=>(
                    <UserItem key={user.id} id={user.id} image={user.image} name={user.name} placeCount={user.places.length} />
                ))}
            </ul>
        );
    }
}

export default UsersList;