import { getCommands, getIPS, getPaths } from "$lib/db";
import type { COMMAND, IP, PATH, UtilsEditing } from "$lib/typings";
import { writable } from "svelte/store";


export const ips = writable<IP[]>([])
export const commands = writable<COMMAND[]>([])
export const paths = writable<PATH[]>([])
export const utilsEditing = writable<UtilsEditing>({ openEditDialog: false })



export function resetUtilsEditing() {
    utilsEditing.set({openEditDialog:false})
}

export async function initIPS() {
    const ipsList = await getIPS();
    ips.set(ipsList);
}

export async function initCommands() {
    const _commands = await getCommands();
    commands.set(_commands);
}

export async function initPaths() {
    const _paths = await getPaths();
    paths.set(_paths);
}