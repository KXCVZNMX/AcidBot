'use client';

import { signIn } from "@/auth";
import {singInFn} from "@/app/components/singin";

export default function SignIn() {
    return (
        <form action={singInFn}>
            <button type={'submit'} className={'btn'}>Login</button>
        </form>
    )
}