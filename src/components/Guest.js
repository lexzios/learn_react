import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GuestAdd from './GuestAdd';
import { faTimes , faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const API_URL = '/employees';

const Guest = () => {
    const [employees, setEmployee] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [addnew, setAddNew] = useState(false);
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState(false);
    const controller = new AbortController();
    let isMounted = true;

    useEffect(() => {
        let isMounted = true;

        getEmployee();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const getEmployee = async () => {
        try {
            const response = await axiosPrivate.get(API_URL, {
                signal: controller.signal
            });
            console.log(response.data);
            isMounted && setEmployee(response.data);
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
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
            getEmployee();
        } catch (err) {
            console.log(err);
        }
    }

    const showForm = async (e) => {  
        if(!addnew){
            setAddNew(true);
        } else {
            setAddNew(false);
            getEmployee();
        }     
    }

    const editForm = async (employee) => {  
        //{employee?.firstname} {employee?.lastname} {employee?._id}
        //console.log(employee?.firstname);
        if(!edit){
            setEdit(true);
            setData(employee);
        } else {
            setEdit(false);
        }  
        getEmployee();   
    }

    return (
        <> 
            <section>
            <h2>Guest Menu</h2>
        {addnew ? (
            <>
                <AddEmployee />
            
                <button onClick={showForm}>Cancel </button>
            </>
            ) : (
                <div>
                    {employees?.length
                        ? (
                            <ul>
                                {employees.map((employee, i) => <li key={i}>
                                    {employee?.firstname} {employee?.lastname} - [                                    
                                    <FontAwesomeIcon icon={faTimes} onClick={() => handleDelete(employee?._id)}  />]- [                                    
                                    <FontAwesomeIcon icon={faInfoCircle} onClick={() => editForm(employee)}  />]
                                    </li>)}
                            </ul>
                        ) : <p>No employees to display</p>
                    }
                    <button onClick={showForm}>Add New</button>
                </div>  
                
                
            )}
            {edit ? (
                <>
                    <AddEmployee editData={data}/>                
                    <button onClick={editForm}>Cancel </button>
                </>
                ):('')}
                
            <br />
            <Link to="/linkpage">Back to the Link page</Link>
            </section>
        </>
    );
};

export default Guest;
