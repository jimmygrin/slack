import {useSelector, useDispatch } from 'react-redux'
import axios from 'axios'



const LOGIN_PENDING = 'LOGIN_PENDING'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

const LOGIN_FAILURE = 'LOGIN_FAILURE'

const LOGOUT= 'LOGOUT'

const initialState = {
    
    username: '',
    isAuthenticated: false,
    loading: false

}



export default (state=initialState, action)=>{
    switch(action.type){
        case LOGIN_PENDING:
            return {...state, loading: true}
        case LOGIN_SUCCESS:
            return {...state, loading: false, isAuthenticated: true, username: action.payload}
        case LOGIN_FAILURE:
            return {...state, loading: false, isAuthenticated: false, username:''}
        case LOGOUT:   
            return initialState
        default:
            return state            
    }
}

function login(username, password, dispatch){
    return new Promise ((resolve, reject)=>{
        axios
        .post('/login', {username, password})
        .then(resp=> {
                axios.defaults.headers.common = {
                    Authorization: `Bearer ${resp.data.token}`}
                dispatch ({
                type: LOGIN_SUCCESS,
                payload: username
            })
            resolve()
        })
        .catch(e => {
            dispatch({
                type: LOGIN_FAILURE
            })
            reject()
        })
    })
}

function logout(){
    axios.defaults.headers.common = {Authorization:""}
    return {
        type: LOGOUT

    }
 
}
export function useAuth() {
    const username = useSelector(appState => appState.authState.username)
    const isAuthenticated = useSelector(appState => appState.authState.isAuthenticated)
    const dispatch = useDispatch()
    const signin = (username, password) => {
        dispatch({type: LOGIN_PENDING})
        return login(username, password, dispatch)


        }

    const signout = ()=> dispatch(logout())

    return { username, signin, signout, isAuthenticated}
       
    }


