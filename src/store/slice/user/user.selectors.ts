import {createSelector} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";

const selectUserState = (state: RootState) => state.user;

export const selectCurrentUserId = createSelector(
    [selectUserState],
    user => user.currentUserId
);

export const selectIsLoggedIn = createSelector(
    [selectUserState],
    user => user.isLoggedIn
);

export const selectIsUserLoading = createSelector(
    [selectUserState],
    user => user.isLoading
);

export const selectUserError = createSelector(
    [selectUserState],
    user => user.error
);