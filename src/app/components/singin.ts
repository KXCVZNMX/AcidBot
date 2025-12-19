'use server'

import {signIn} from "@/auth";

export const singInFn = async () => {
    await signIn("github")
}