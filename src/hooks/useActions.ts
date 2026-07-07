import {useDispatch} from 'react-redux';
import {bindActionCreators} from '@reduxjs/toolkit';
import {userInfoActions} from "../store/slice/userInfo/userInfo.slice.ts";


const actions = {
    ...userInfoActions,
};

export const useActions = () => {
    const dispatch = useDispatch();

    return bindActionCreators(actions, dispatch);
};
