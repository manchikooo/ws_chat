import type {Dispatch, SetStateAction} from "react";

export type LoginProps = {
    setIsErrorMessage: Dispatch<SetStateAction<string>>,
}