'use client';

import { signIn } from "@/auth";
import {loginGithub} from "@/app/components/singin";

export default function SignIn() {
    return (
        <form action={loginGithub}>
            <button type={'submit'} className={'btn'}>Login</button>
        </form>
    )
}