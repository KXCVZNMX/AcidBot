import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {MongoClient} from 'mongodb';

interface SongData {
    sort: string;
    title: string;
    artist: string;
    catcode: string;                    // Category
    version: string;                    // Version code
    bpm: string;
    image_url: string;
    release: string;
    dx_lev_bas: string;
    dx_lev_adv: string;
    dx_lev_exp: string;
    dx_lev_mas: string;
    dx_lev_bas_i: string;
    dx_lev_bas_notes: string;
    dx_lev_bas_notes_tap: string;
    dx_lev_bas_notes_hold: string;
    dx_lev_bas_notes_slide: string;
    dx_lev_bas_notes_touch: string;
    dx_lev_bas_notes_break: string;
    dx_lev_adv_i: string;
    dx_lev_adv_notes: string;
    dx_lev_adv_notes_tap: string;
    dx_lev_adv_notes_hold: string;
    dx_lev_adv_notes_slide: string;
    dx_lev_adv_notes_touch: string;
    dx_lev_adv_notes_break: string;
    dx_lev_exp_i: string;
    dx_lev_exp_notes: string;
    dx_lev_exp_notes_tap: string;
    dx_lev_exp_notes_hold: string;
    dx_lev_exp_notes_slide: string;
    dx_lev_exp_notes_touch: string;
    dx_lev_exp_notes_break: string;
    dx_lev_exp_designer: string;
    dx_lev_mas_i: string;
    dx_lev_mas_notes: string;
    dx_lev_mas_notes_tap: string;
    dx_lev_mas_notes_hold: string;
    dx_lev_mas_notes_slide: string;
    dx_lev_mas_notes_touch: string;
    dx_lev_mas_notes_break: string;
    dx_lev_mas_designer: string;
    wiki_url: string;
    intl: string;                       // Internation Ver. Availability
    date_added: string;
    date_intl_added: string;
    date?: string;                      // isNew
}

dotenv.config({path: './.env.local'});

const fileContent = fs.readFileSync('./otoge-db/maimai/data/music-ex-intl.json', 'utf8');
const songs: SongData[] = JSON.parse(fileContent);

(async () => {
    const uri = process.env.MONGODB_URI || '';

    console.log(uri)

    let client: MongoClient | undefined;
    
    try {
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('maimaiIntlSongInfo');
        await collection.drop().catch(() => {});
        await collection.insertMany(songs);
    } catch (e) {
        console.error(e);
    } finally {
        if (client) {
            await client.close();
        }
    }
})();