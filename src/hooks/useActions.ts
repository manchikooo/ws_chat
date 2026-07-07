import {useDispatch} from 'react-redux';
import {bindActionCreators} from '@reduxjs/toolkit';
import {userInfoActions} from "../store/slice/userInfo/userInfo.slice.ts";
import {roomActions} from "../store/slice/room/room.slice.ts";


const actions = {
    ...userInfoActions,
    ...roomActions
};

export const useActions = () => {
    const dispatch = useDispatch();

    return bindActionCreators(actions, dispatch);
};
