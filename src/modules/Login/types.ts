import type {Dispatch, SetStateAction} from "react";

export type LoginProps = {
    setIsErrorMessage: Dispatch<SetStateAction<string>>,
    setIsUserId: Dispatch<SetStateAction<string>>,
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>,
    handleRequestRooms: () => Promise<void>
}