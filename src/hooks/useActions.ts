import {useDispatch} from 'react-redux';
import {bindActionCreators} from '@reduxjs/toolkit';
import {userActions} from "../store/slice/user/user.slice.ts";
import {roomActions} from "../store/slice/room/room.slice.ts";
import {messageActions} from "../store/slice/message/message.slice.ts";


const actions = {
    ...userActions,
    ...roomActions,
    ...messageActions
};

export const useActions = () => {
    const dispatch = useDispatch();

    return bindActionCreators(actions, dispatch);
};
