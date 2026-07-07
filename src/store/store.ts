import {configureStore} from '@reduxjs/toolkit'
import {useDispatch, useSelector} from "react-redux";
import {userInfoReducer} from "./slice/userInfo/userInfo.slice.ts";

export const store = configureStore({
    reducer: {
        userInfo: userInfoReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()