import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const API_URL = '/guests';

const GuestAdd = ({editData}) => {
    const userRef = useRef();
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    let isMounted = true;
    const [empid, setEmpid] = useState('');

    const [fullname, setFullname] = useState('');
    const [validFullname, setValidFullname] = useState(false);
    const [firstnameFocus, setFullnameFocus] = useState(false);

    const [lastname, setLastname] = useState('');
    const [validLastname, setValidLastname] = useState(false);
    const [lastnameFocus, setLastnameFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
        if(editData){
            console.log(editData);
            setFirstname(editData?.firstname);
            setLastname(editData?.lastname);
            setEmpid(editData?._id);
        }else{
            console.log('no data');
            setFirstname('');
            setLastname('');
            setEmpid('');
        }
    }, [])

    useEffect(() => {
        setValidFirstname(USER_REGEX.test(firstname));
    }, [firstname])

    useEffect(() => {
        setValidLastname(USER_REGEX.test(lastname));
    }, [lastname])

    useEffect(() => {
        setErrMsg('');
    }, [firstname, lastname])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(firstname);
        const v2 = USER_REGEX.test(lastname);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            if(!empid){
                const response = await axiosPrivate.post(API_URL, JSON.stringify({ firstname, lastname }));
                console.log('add');
                setFirstname(response?.data.firstname);
                setLastname(response?.data.lastname);
                setEmpid(response?.data._id);
            }else{
                const response = await axiosPrivate.put(API_URL, JSON.stringify({ id:empid, firstname:firstname, lastname:lastname }));
                console.log('update');
                //console.log(response?.data.firstname);
                setFirstname(response?.data.firstname);
                setLastname(response?.data.lastname);
                setEmpid(response?.data._id);
            }
            // TODO: remove console.logs before deployment
            
            isMounted && setSuccess(true);
            //clear state and controlled inputs
            //setFirstname('');
            //setLastname('');
            //setEmpid('');
        } catch (err) {
            errRef.current.focus();
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    
    const handleEdit = async (uuid) => {  
        console.log(uuid);
        console.log(this.props.editData);
    }


    return (
        <>
        
            {success ? (
                <article>
                    <h1>Success!</h1><br/>
                    <label htmlFor="firstname">Firstname: {firstname}</label><br/>
                    <label htmlFor="lastname">Lastname: {lastname}</label><br/>
                </article>
            ) : (
                <article>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="firstname">
                            firstname:
                            <FontAwesomeIcon icon={faCheck} className={validFirstname ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validFirstname || !firstname ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setFirstname(e.target.value)}
                            value={firstname}
                            required
                            aria-invalid={validFirstname ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setFirstnameFocus(true)}
                            onBlur={() => setFirstnameFocus(false)}
                        />
                        <p id="uidnote" className={setFirstnameFocus && firstname && !validFirstname ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label htmlFor="lastname">
                            lastname:
                            <FontAwesomeIcon icon={faCheck} className={validLastname ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validLastname || !lastname ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            onChange={(e) => setLastname(e.target.value)}
                            value={lastname}
                            required
                            aria-invalid={validLastname ? "false" : "true"}
                            aria-describedby="lastnote"
                            onFocus={() => setLastnameFocus(true)}
                            onBlur={() => setLastnameFocus(false)}
                        />                        
                        <input
                            type="hidden"
                            id="id"
                            value={empid}
                        />
                        <p id="lastnote" className={setLastnameFocus && lastname && !validLastname ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                
                        <button disabled={!validFirstname && !validLastname ? true : false}>Submit</button>
                    </form>
                </article>
            )}
        </>
    )
}

export default GuestAdd
