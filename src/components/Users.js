import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { faTimes , faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserForm from './UserForm';
const API_URL = '/users';

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    let isMounted = true;
    const controller = new AbortController();
    const [addnew, setAddNew] = useState(false);
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState(false);

    useEffect(() => {

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const getUsers = async () => {
        try {
            const response = await axiosPrivate.get(API_URL, {
                signal: controller.signal
            });
            console.log(response.data);
            isMounted && setUsers(response.data);
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }
    
    const editForm = async (user) => {  
        if(!edit){
            setEdit(true);
            setData(user);
        } else {
            setEdit(false);
        }  
        getUsers();   
    }

    const handleDelete = async (uuid) => {
        //e.preventDefault();
        if (!uuid) {
            console.log("Invalid Entry");
            return;
        }else{           
            const json = JSON.stringify({ id: uuid }); 
            console.log(json);
        }
        try {
            const response = await axiosPrivate.delete(API_URL, {data:{ id:uuid }});
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            getUsers();
        } catch (err) {
            console.log(err);
        }
    }

    const showForm = async (e) => {  
        if(!addnew){
            setAddNew(true);
        } else {
            setAddNew(false);
            getUsers();
        }     
    }

    return (
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username} - [                                    
                            <FontAwesomeIcon icon={faTimes} onClick={() => handleDelete(user?._id)}  />]- [                                    
                            <FontAwesomeIcon icon={faInfoCircle} onClick={() => editForm(user)}  />]</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
            {edit ? (
                <>
                    <UserForm editData={data}/>                
                    <button onClick={editForm}>Cancel </button>
                </>
                ):('')}
        </article>
    );
};

export default Users;
