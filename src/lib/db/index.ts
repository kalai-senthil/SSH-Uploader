import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

import type {
  _Object,
  COMMAND,
  EDGE,
  FLOW,
  Flow,
  IP,
  NODE,
  PASSWORD,
  PATH,
  USER,
} from "$lib/typings";
import { v4 as uuid } from "uuid";
import {
  addFlow,
  clearCanvas,
  commands,
  flows,
  ips,
  passwords,
  paths,
  saveFlow,
  users,
  utilsEditing,
} from "$lib/store";
import { MarkerType } from "@xyflow/svelte";

async function getIPS() {
  const db = await getDB();
  const results = await db.select(
    "SELECT IP.*,PWD.PASSWORD from IPS IP INNER JOIN PASSWORDS PWD ON IP.PASSWORD = PWD.ID;"
  );
  return results as IP[];
}
export async function getFlow(id: string) {
  const db = await getDB();
  const nodes: any[] = await db.select(
    "SELECT * FROM NODES WHERE FLOWID = $1;",
    [id]
  );
  const edges: EDGE[] = await db.select(
    "SELECT * FROM EDGES WHERE FLOWID = $1;",
    [id]
  );
  return {
    nodes: nodes.map((node) => ({
      ...node,
      data: JSON.parse(node.data),
      position: JSON.parse(node.position),
    })),
    edges: edges.map((edge) => ({
      ...edge,
      markerEnd: {
        type: MarkerType.Arrow,
      },
    })),
  };
}
async function getFlows() {
  const results: _Object<Flow> = {};
  const db = await getDB();
  const flows: FLOW[] = await db.select("SELECT * FROM FLOWS;");
  for (const flow of flows) {
    const flowNodesAndEdges = await getFlow(flow.ID);
    results[flow.ID] = { ...flow, ...flowNodesAndEdges };
  }
  return results;
}
async function getCommands() {
  const db = await getDB();
  const results = await db.select("SELECT * from COMMANDS;");

  return results as COMMAND[];
}
export async function getCommand(id:string) {
  const db = await getDB();
  const results = await db.select("SELECT * from COMMANDS WHERE ID = $1;",[id]);

  return (results as COMMAND[])[0];
}
async function getPaths() {
  const db = await getDB();
  const results = await db.select("SELECT * from PATHS;");

  return results as PATH[];
}
async function getPasswords() {
  const db = await getDB();
  const results = await db.select("SELECT * from PASSWORDS;");

  return results as PASSWORD[];
}
async function getUsers() {
  const db = await getDB();
  const results = await db.select("SELECT * from USERS;");

  return results as USER[];
}
async function addPath(name: string, path: string) {
  try {
    const db = await getDB();
    const ipID = uuid();
    await db.execute("INSERT INTO PATHS (ID,NAME,PATH) VALUES ($1,$2,$3);", [
      ipID,
      name,
      path,
    ]);
    paths.update((val) => ({
      ...val,
      [ipID]: {
        ID: ipID,
        NAME: name,
        PATH: path,
      },
    }));
    return { success: true, data: { id: ipID, name, ip: path } };
  } catch (error) {
    return { success: false, data: null };
  }
}
async function addUser(name: string) {
  try {
    const db = await getDB();
    const ipID = uuid();
    await db.execute("INSERT INTO USERS (ID,NAME) VALUES ($1,$2);", [
      ipID,
      name,
    ]);
    users.update((val) => ({
      ...val,
      [ipID]: {
        ID: ipID,
        NAME: name,
      },
    }));
    return { success: true, data: { id: ipID, name } };
  } catch (error) {
    return { success: false, data: null };
  }
}
async function getPassword(id: string) {
  try {
    const db = await getDB();
    const password: any = await db.select(
      "SELECT PASSWORD FROM PASSWORDS WHERE ID = $1 LIMIT 1",
      [id]
    );
    return password[0].PASSWORD;
  } catch (error) {
    return null;
  }
}
async function addIP(name: string, ip: string, passwordId: string) {
  try {
    const db = await getDB();
    const ipID = uuid();
    const password = await getPassword(passwordId);
    await db.execute(
      "INSERT INTO IPS (ID,NAME,IP,PASSWORD) VALUES ($1,$2,$3,$4);",
      [ipID, name, ip, passwordId]
    );
    ips.update((val) => ({
      ...val,
      [ipID]: {
        ID: ipID,
        NAME: name,
        IP: ip,
        PASSWORD: password,
      },
    }));
    return { success: true, data: { id: ipID, name, ip } };
  } catch (error) {
    return { success: false, data: null };
  }
}
async function addPassword(name: string, password: string) {
  try {
    const db = await getDB();
    const ipID = uuid();
    await db.execute(
      "INSERT INTO PASSWORDS (ID,NAME,PASSWORD) VALUES ($1,$2,$3);",
      [ipID, name, password]
    );
    passwords.update((passwords) => ({
      ...passwords,
      [ipID]: {
        ID: ipID,
        NAME: name,
        PASSWORD: password,
      },
    }));
    return { success: true, data: { id: ipID, name, ip: password } };
  } catch (error) {
    return { success: false, data: null };
  }
}
async function editIP(ip: IP) {
  try {
    const db = await getDB();
    await db.execute(
      "UPDATE IPS SET NAME = $1,IP = $2,PASSWORD = $3 WHERE ID = $4;",
      [ip.NAME, ip.IP, ip.PASSWORD, ip.ID]
    );
    const pass = await getPassword(ip.PASSWORD);
    ips.update((ips) => ({
      ...ips,
      [ip.ID]: { ...ip, PASSWORD: pass },
    }));

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function editCommand(command: COMMAND) {
  try {
    const db = await getDB();
    await db.execute(
      "UPDATE COMMANDS SET NAME = $1,COMMAND = $2 WHERE ID = $3;",
      [command.NAME, command.COMMAND, command.ID]
    );
    commands.update((vals) => ({ ...vals, [command.ID]: command }));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function editUser(path:USER) {
  try {
    const db = await getDB();
    await db.execute("UPDATE USERS SET NAME = $1 WHERE ID = $2;", [
      path.NAME,
      path.ID,
    ]);
    users.update((vals) => ({ ...vals, [path.ID]: path }));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function editPath(path: PATH) {
  try {
    const db = await getDB();
    await db.execute("UPDATE PATHS SET NAME = $1,PATH = $2 WHERE ID = $3;", [
      path.NAME,
      path.PATH,
      path.ID,
    ]);
    paths.update((vals) => ({ ...vals, [path.ID]: path }));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function editPassword(path: PASSWORD) {
  try {
    const db = await getDB();
    await db.execute(
      "UPDATE PASSWORDS SET NAME = $1,PASSWORD = $2 WHERE ID = $3;",
      [path.NAME, path.PASSWORD, path.ID]
    );
    passwords.update((pass) => ({ ...pass, [path.ID]: path }));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function addCommand(name: string, command: string) {
  try {
    const db = await getDB();
    const id = uuid();
    await db.execute(
      "INSERT INTO COMMANDS (ID,NAME,COMMAND) VALUES ($1,$2,$3);",
      [id, name, command]
    );
    commands.update((commands) => ({
      ...commands,
      [id]: { ID: id, NAME: name, COMMAND: command },
    }));
    return { success: true, data: { id: id, name, command: command } };
  } catch (error) {
    return { success: false, data: null };
  }
}

async function deleteIP(id: string) {
  try {
    const db = await getDB();
    await db.execute("DELETE FROM IPS WHERE ID = $1;", [id]);
    ips.update((ips) => {
      delete ips[id];
      return ips;
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

async function deleteUser(id: string) {
  try {
    const db = await getDB();
    await db.execute("DELETE FROM USERS WHERE ID = $1;", [id]);
    users.update((ips) => {
      delete ips[id];
      return ips;
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function deleteCommand(id: string) {
  try {
    const db = await getDB();
    await db.execute("DELETE FROM COMMANDS WHERE ID = $1;", [id]);
    commands.update((commands) => {
      delete commands[id];
      return commands;
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

async function deletePath(id: string) {
  try {
    const db = await getDB();
    await db.execute("DELETE FROM PATHS WHERE ID = $1;", [id]);
    paths.update((paths) => {
      delete paths[id];
      return paths;
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function deleteFlow(id: string) {
  try {
    const db = await getDB();
    await db.execute("DELETE FROM FLOWS WHERE ID = $1;", [id]);
    flows.update((flow) => {
      delete flow[id];
      return flow;
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function editFlow(flow: Flow) {
  await deleteFlow(flow.ID);
  await saveFlow(flow, false);
}
async function copyFlow(id: string) {
  flows.subscribe(async (vals) => {
    const flow = vals[id];
    saveFlow({ ...flow, ID: uuid() });
  })();
}
async function deletePassword(id: string) {
  try {
    const db = await getDB();
    await db.execute("DELETE FROM PASSWORDS WHERE ID = $1;", [id]);
    passwords.update((paths) => {
      delete paths[id];
      return paths;
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
async function getDB() {
  if (db === null) {
    db = await Database.load("sqlite:test.db");
  }
  return db;
}
export { getDB };
export {
  getIPS,
  addIP,
  copyFlow,
  deleteIP,
  deleteFlow,
  editUser,
  editFlow,
  addPassword,
  editCommand,
  editPath,
  getCommands,
  deletePassword,
  addCommand,
  getFlows,
  editPassword,
  deleteCommand,
  getPaths,
  addPath,
  deletePath,addUser,
  editIP,
  getPasswords,
  deleteUser,
  getUsers
};
