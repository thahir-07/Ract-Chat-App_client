import React, { useEffect, useState } from 'react'
import './MyStyles.css'
import { Button, IconButton } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../images/live-chat.png'
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion"
import { refresh } from '../Features/RefreshSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Groups() {
    const lightTheme = useSelector((state) => state.themeKey)
    const refreshHandle = useSelector((state) => state.refreshKey)
    const [groups, setGroups] = useState([])
    const user = JSON.parse(localStorage.getItem('userData'))
    const [loading,setLoading]=useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        axios.get('http://localhost:5000/chat/fetchGroups', config).then((response) => {
            console.log('Groups', response.data)
            setGroups(response.data)
        }).catch(err => console.log(err.message))
    }, [refreshHandle])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ ease: "anticipate", duration: "0.3" }}
                className='list-container'>
                <div className={'online-users-container' + ((lightTheme) ? "" : ' dark')}>
                    <img src={logo} alt="" className='online-users-logo' />
                    <p >Available Groups</p>
                    <IconButton onClick={() => {
                        dispatch(refresh())
                    }}>
                        <RefreshIcon className={'icon ' + (lightTheme ? "" : "dark")} />
                    </IconButton>

                </div>

                <div className={'sd-Search' + ((lightTheme) ? "" : ' dark')}>
                    <IconButton>
                        <SearchIcon className={'' + ((lightTheme) ? "" : ' dark')} />
                    </IconButton>
                    <input placeholder='Search' className={'search-box' + ((lightTheme) ? "" : ' dark')} />
                </div>

                <div className={'online-list-container' + ((lightTheme) ? "" : ' dark')}>
                    {groups.map((group, index) => {
                        return (
                            <motion.div whileHover={{ scale: 1.01 }} className={'online-list' + ((lightTheme) ? "" : ' dark')}>
                                <p className={'con-icon' + ((lightTheme) ? "" : ' dark-icon')}>{group.chatName[0].toUpperCase()}</p>
                                <p className={'online-list-title' + ((lightTheme) ? "" : ' dark')}>{group.chatName}</p>
                                {!group.users.includes(user._id) ? (<LoadingButton loading={loading} style={{ color: "#63d7b0", marginLeft: "auto" }} onClick={() => {
                                    setLoading((prevState) => !prevState)
                                    const config = {
                                        headers: {
                                            Authorization: `Bearer ${user.token}`
                                        }
                                    }
                                    axios.put('http://localhost:5000/chat/addSelfToGroup', {
                                        chatId: group._id,
                                        userId: user._id
                                    }, config).then((response) => {
                                        console.log(response)
                                        setLoading((prevState) => !prevState)
                                        dispatch(refresh())
                                    }).catch((err) => {
                                        console.log(err.message)
                                        dispatch(refresh)
                                    })
                                    
                                }}>join</LoadingButton>)
                                    :
                                    (<LoadingButton loading={false} style={{ color: "#63d7b0", marginLeft: "auto" }} onClick={() => {

                                    }}>exit</LoadingButton>)
                                }

                            </motion.div>


                        )
                    })

                    }

                </div>
            </motion.div>
        </AnimatePresence>


    )
}

export default Groups
