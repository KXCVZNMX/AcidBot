import { NextResponse } from 'next/server';

// Only returns the script to extract the clal token.
export async function GET() {
    const site_link = process.env.SITE_LINK ?? 'https://acid.kvznmx.com';

    const code =
        'function reject() {\n' +
        '    return prompt("Do not change the url after copying it from the site");\n' +
        '}\n' +
        '\n' +
        'javascript: void(function(d) {\n' +
        '   if (d.location.host === "lng-tgk-aime-gw.am-all.net") {\n' +
        '        let code = new URL(document.location.href).searchParams.get("id") ?? reject();\n' +
        '        if (code) {\n' +
        '            let cookie = d.cookie.match(/clal=([^;]*)/)?.[1];\n' +
        '            if (cookie.length !== 64) return alert("Error!\\nI can\\\'t fetch your session, try logging in again or switch browsers.");\n' +
        `            let win = window.open(\`${site_link}/api/v1/profile/clal?clal=$\{cookie}\`, '_blank');
` +
        '        } else if (code === null) {\n' +
        '            console.log("User cancelled");\n' +
        '        } else {\n' +
        '            alert("Wrong code! Please do not change the url after copying it from the site");\n' +
        '        }\n' +
        '    } else return alert("Error!\\nYou are not in the right website");\n' +
        '})(document)';

    return new NextResponse(code, {
        headers: {
            'Content-Type': 'application/javascript; charset=utf-8',
        },
    });
}
