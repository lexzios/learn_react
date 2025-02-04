import { Link } from "react-router-dom"
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from '../api/fakestore';

const Editor = () => {
    const [users, setUsers] = useState();
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
            const response = await axios.get('/products', {
                signal: controller.signal
            });
            console.log(response.data);
            isMounted && setUsers(response.data);
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    return (
        <section>
            <h1>Editors Page</h1>
            <br />
            <p>You must have been assigned an Editor role.</p>
            
            <table>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                </tr>        
            {users?.length
                ? (
                    (() => {
                        const arr = [];
                        for (let i = 0; i < users?.length; i++) {
                            arr.push(
                                <tr>
                                    <td key={i}>{users[i].title}</td>
                                    <td key={i}>{users[i].price}</td>
                                    <td key={i}>{users[i].category}</td>
                                </tr>
                            );
                        }
                        return arr;
                    })()
                ) : <p>no data / Loading Please Wait</p>
            }            
            </table>
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>

        </section>
    )
}

export default Editor
