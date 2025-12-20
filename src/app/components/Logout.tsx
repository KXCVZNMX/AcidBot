import {signOut} from "next-auth/react"

export default () =>
    <button onClick={() => signOut()} className={'btn'}>
        Sign out
    </button>