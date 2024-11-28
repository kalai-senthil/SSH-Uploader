import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

import type { COMMAND, IP, PATH } from "$lib/typings";
import { v4 as uuid } from "uuid";
import { commands, ips, paths, utilsEditing } from "$lib/store";

async function getIPS() {
    const db = await getDB()
    const results = await db.select('SELECT * from IPS;');

    return results as IP[];
}
async function getCommands() {
    const db = await getDB()
    const results = await db.select('SELECT * from COMMANDS;');

    return results as COMMAND[];
}
async function getPaths() {
    const db = await getDB()
    const results = await db.select('SELECT * from PATHS;');

    return results as PATH[];
}
async function addPath(name: string, path: string) {
    try {
        const db = await getDB()
        const ipID = uuid()
        await db.execute('INSERT INTO PATHS (ID,NAME,PATH) VALUES ($1,$2,$3);', [ipID, name, path]);
        paths.update(paths => {
            paths.push({
                ID: ipID, NAME: name, PATH: path,
            })
            return [...paths];
        })
        return { success: true, data: { id: ipID, name, ip: path } };
    } catch (error) {
        return { success: false, data: null }
    }
}
async function addIP(name: string, ip: string) {
    try {
        const db = await getDB()
        const ipID = uuid()
        await db.execute('INSERT INTO IPS (ID,NAME,IP) VALUES ($1,$2,$3);', [ipID, name, ip]);
        ips.update(ips => {
            ips.push({
                ID: ipID, NAME: name, IP: ip,
            })
            return [...ips];
        })
        return { success: true, data: { id: ipID, name, ip } };
    } catch (error) {
        return { success: false, data: null }
    }
}
async function editIP(ip: IP) {
    try {
        const db = await getDB()
        await db.execute('UPDATE IPS SET NAME = $1,IP = $2 WHERE ID = $3;', [ip.NAME, ip.IP, ip.ID]);
        ips.update(ips => {
            const idx = ips.findIndex(_ip => _ip.ID === ip.ID);
            ips[idx] = ip;
            return [...ips];
        })
        return { success: true };
    } catch (error) {
        return { success: false }
    }
}
async function editCommand(command: COMMAND) {
    try {
        const db = await getDB()
        await db.execute('UPDATE COMMANDS SET NAME = $1,COMMAND = $2 WHERE ID = $3;', [command.NAME, command.COMMAND, command.ID]);
        commands.update(commands => {
            const idx = commands.findIndex(_ip => _ip.ID === command.ID);
            commands[idx] = command;
            return [...commands];
        })
        return { success: true };
    } catch (error) {
        return { success: false }
    }
}
async function editPath(path: PATH) {
    try {
        const db = await getDB()
        await db.execute('UPDATE PATHS SET NAME = $1,PATH = $2 WHERE ID = $3;', [path.NAME, path.PATH, path.ID]);
        paths.update(paths => {
            const idx = paths.findIndex(_ip => _ip.ID === path.ID);
            paths[idx] = path;
            return [...paths];
        })
        return { success: true };
    } catch (error) {
        return { success: false }
    }
}
async function addCommand(name: string, command: string) {
    try {
        const db = await getDB()
        const id = uuid()
        await db.execute('INSERT INTO COMMANDS (ID,NAME,COMMAND) VALUES ($1,$2,$3);', [id, name, command]);
        commands.update(commands => {
            commands.push({
                ID: id, NAME: name, COMMAND: command,
            })
            return [...commands];
        })
        return { success: true, data: { id: id, name, ip: command } };
    } catch (error) {
        return { success: false, data: null }
    }
}


async function deleteIP(id: string) {
    try {
        const db = await getDB()
        await db.execute('DELETE FROM IPS WHERE ID = $1;', [id]);
        ips.update(ips => {
            const idx = ips.findIndex(d => d.ID === id);
            ips.splice(idx, 1);
            return [...ips];
        })
        return { success: true, };
    } catch (error) {
        return { success: false, }
    }
}
async function deleteCommand(id: string) {
    try {
        const db = await getDB()
        await db.execute('DELETE FROM COMMANDS WHERE ID = $1;', [id]);
        commands.update(commands => {
            const idx = commands.findIndex(d => d.ID === id);
            commands.splice(idx, 1);
            return [...commands];
        })
        return { success: true, };
    } catch (error) {
        return { success: false, }
    }
}

async function deletePath(id: string) {
    try {
        const db = await getDB()
        await db.execute('DELETE FROM PATHS WHERE ID = $1;', [id]);
        paths.update(paths => {
            const idx = paths.findIndex(d => d.ID === id);
            paths.splice(idx, 1);
            return [...paths];
        })
        return { success: true, };
    } catch (error) {
        return { success: false, }
    }
}
async function getDB() {
    if (db === null) {
        db = await Database.load('sqlite:test.db');
    }
    return db;
}
export { getDB }
export { getIPS, addIP, deleteIP,editCommand,editPath, getCommands, addCommand, deleteCommand, getPaths, addPath, deletePath,editIP }