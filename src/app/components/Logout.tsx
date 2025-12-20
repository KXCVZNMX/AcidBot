import {signOut} from "@/auth"

export default () =>
    <button onClick={() => signOut()} className={'btn'}>
        Sign out
    </button>